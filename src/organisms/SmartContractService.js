/* eslint-disable */
import Web3 from "web3"
import { PortisProvider } from "portis"
import { fetchABI } from "./ABIReader"
import { withCookies } from "react-cookie"

class SmartContractService {
  constructor(props) {
    console.log("WHAT PROPS? ", props)
    const { cookies } = props
    this.cookies = {
      portisNetwork: cookies.get("portisNetwork") || "mainnet",
    }
    console.log("Init SmartContractService")
    this.smartContracts = []
    this.currentUser = undefined
    this.refreshContracts.bind(this)
    this.reloadWeb3.bind(this)
  }

  getCurrentUser = () => this.currentUser

  getCurrentNetwork = () =>
    this.currentNetwork ? this.currentNetwork.network : undefined

  getCurrentNetworkId = () =>
    this.currentNetwork.netId ? this.currentNetwork.netId : undefined

  getSmartContracts = () => this.smartContracts

  getCurrentConfigStore = () =>
    this.web3
      ? this.web3.currentProvider
        ? this.web3.currentProvider.publicConfigStore
        : undefined
      : undefined

  getNetworksString = networks => {
    let networkString = ""
    let iterator = 0
    Object.entries(networks).forEach(net => {
      networkString += this.getNetworkString(iterator, net[0])
      iterator++
    })
    return networkString
  }

  getNetworkString = (iterator, netId) => {
    let addComma = (iterator, word) => (iterator > 0 ? `, ${word}` : word)
    let word = "localhost"
    switch (netId) {
      case "1":
        word = "mainnet"
        break
      case "3":
        word = "roptsten"
        break
      case "4":
        word = "rinkeby"
        break
      case "42":
        word = "kovan"
        break
      case "5777":
        word = "localhost"
        break
    }
    return addComma(iterator, word)
  }

  portisProvider = () => {
    let network = this.cookies.portisNetwork
    if (network && network !== "development") {
      return new Web3(
        new PortisProvider({
          apiKey: "3b1ca5fed7f439bf72771e64e9442d74",
          network: network,
        }),
      )
    } else {
      return new Web3(
        new PortisProvider({
          providerNodeUrl: "http://localhost:8545",
        }),
      )
    }
  }

  contractObject = name =>
    this.smartContracts.find(contract => contract.name === name)

  contractNamed = name => {
    const contractObj = this.contractObject(name)
    return contractObj ? contractObj.contract : undefined
  }

  contractAddress = name => {
    const contractObj = this.contractObject(name)
    return contractObj ? contractObj.address : undefined
  }

  validateContracts = async => {
    return Promise.all(
      this.smartContracts.map(contract => this.validContract(contract.name)),
    ).then(results => {
      if (results.length == 0) {
        throw new Error("No contracts found on this network")
      } else {
        return results.reduce((result, next) => result && next)
      }
    })
  }

  validContract = async name => {
    const address = this.contractAddress(name)
    return new Promise((resolve, reject) => {
      this.web3.eth
        .getCode(address)
        .then(code =>
          code === "0x0" || code === "0x" ? resolve(false) : resolve(true),
        )
    })
  }

  refreshContracts = async cookies => {
    let { abi } = await fetchABI(cookies)
    let { netId } = this.currentNetwork
    let sc = []
    abi.forEach(contract => {
      let json = contract.data
      if (json && Object.entries(json.networks).length > 0) {
        console.log("Adding Contract", json.contractName, json.networks[netId])
        const address = json.networks[netId]
          ? json.networks[netId].address
          : undefined
        const contract = new this.web3.eth.Contract(json.abi, address)
        sc.push({
          name: json.contractName,
          contract: contract,
          address: address,
          networks: json.networks,
        })
      } else if (Object.entries(json.networks).length > 0) {
        console.log(
          "You are on the wrong network",
          this.web3.currentProvider.network,
          Object.entries(json.networks)[0],
        )
        throw new Error("Wrong Network Detected")
      }
    })
    this.smartContracts = sc
    return sc
  }

  buildSmartContractList = async (netId, contracts) => {
    let sc = []
  }

  refreshUser = async () => {
    let accounts = await this.web3.eth.getAccounts()
    console.log(`Updating USER from ${this.currentUser} to ${accounts[0]}`)
    this.currentUser = accounts[0]
    return this.currentUser
  }

  refreshNetwork = async () => {
    let netId = await this.web3.eth.net.getId()
    this.currentNetwork = {
      network: this.getNetworkString(0, String(netId)),
      netId,
    }
    console.log("Updating current network", netId, this.currentNetwork)
    return this.currentNetwork
  }

  async reloadWeb3(cookies) {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      this.web3 = window.web3
      try {
        // Request account access if needed
        await window.ethereum.enable()
        // Acccounts now exposed
      } catch (error) {
        console.log("SmartContractService reloadWeb3 error", error)
        // User denied account access...

        throw Promise.reject(error)
      }
    } else if (typeof window.web3 !== "undefined") {
      this.web3 = new Web3(window.web3.currentProvider)
    } else {
      this.web3 = this.portisProvider()
    }

    await this.refreshUser()
    await this.refreshNetwork()
    await this.refreshContracts(cookies)

    return true
  }
}

export default SmartContractService
