/* eslint-disable */
import Web3 from "web3"
import { PortisProvider } from "portis"
import { fetchABI } from "./ABIReader"

class SmartContractService {
  constructor(props) {
    console.log("WHAT PROPS? ", props)
    const { cookies } = props
    this.cookies = {
      portisNetwork: cookies.get("portisNetwork") || "mainnet",
    }
    console.log("Init SmartContractService")
    this.smartContracts = []
    this.deployedContracts = {}
    // console.log("CREATING SERCICE", localStorage.getItem("deployedContracts"))
    this.currentUser = undefined
    this.refreshContracts.bind(this)
    this.reloadWeb3.bind(this)
  }

  getCurrentUser = () => this.currentUser

  getCurrentNetwork = () =>
    this.currentNetwork ? this.currentNetwork.network : undefined

  getCurrentNetworkId = () =>
    this.currentNetwork ? this.currentNetwork.netId : undefined

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

  deployedContractObjects = (name, netId) => {
    let contractsOnNet = []
    Object.entries(this.deployedContracts).map(deployed => {
      if (
        deployed[1] &&
        deployed[1].name === name &&
        deployed[1].netId == netId
      ) {
        contractsOnNet.push({address: deployed[0], ...deployed[1]})
      }
    })
    return contractsOnNet
  }

  currentDeployedContractObjects = name => {
    return this.deployedContractObjects(name, this.getCurrentNetworkId())
  }

  loadLocalStoreObjects = () => {
    let objects = JSON.parse(localStorage.getItem("deployedContracts"))
  }

  storeABI = abiData => {
    let json = abiData.data
    if (json.bytecode !== "0x") {
      let abiObject = {
        ipfs: abiData.ipfs,
        name: json.contractName,
        bytecode: json.bytecode,
        abi: json.abi,
      }

      let existingABI = this.smartContracts.filter(abi => abi.name === name)

      if (existingABI.length === 0) {
        this.smartContracts.push(abiObject)
      }
    }
  }

  storeDeployments = abiData => {
    let json = abiData.data
    let contractObj
    console.log("ABIDATA", json)
    // STORE ABIS
    const deployments = Object.entries(json.networks)
    if (json && deployments.length > 0) {
      deployments.forEach(deployed => {
        let address = deployed[1] ? deployed[1].address : undefined
        this.addDeployedContract(
          abiData.ipfs,
          json.contractName,
          address,
          json.bytecode,
          json.abi,
          deployed[0], // net id
        )
      })
    }
  }

  addDeployedContract = (ipfs, name, address, bytecode, abi, netId) => {
    if (!netId) {
      netId = this.getCurrentNetworkId()
    }
    console.log("ADDING CONTRACT", ipfs, name, address, netId, abi)
    if (address) {
      this.deployedContracts[address] = {
        ipfs: ipfs,
        name: name,
        bytecode: bytecode,
        abi: abi,
        netId: netId,
      }

      // console.log("PRE store", JSON.stringify(storeObj))

      // localStorage.setItem("deployedContracts", JSON.stringify(storeObj))
      console.log("Post STORE TEST")
    }
  }

  refreshContracts = async cookies => {
    let { abi } = await fetchABI(cookies)
    console.log("Contract leng", abi)
    await abi.forEach(this.storeABI)
    await abi.forEach(this.storeDeployments)
  }

  contractAtAddress = async (abi, address) => {
    const contract = new this.web3.eth.Contract(abi, address)
    return contract
  }

  refreshUser = async () => {
    let accounts = await this.web3.eth.getAccounts()
    console.log(`Updating USER from ${this.currentUser} to ${accounts[0]}`)
    this.currentUser = accounts[0]
    return this.currentUser
  }

  refreshNetwork = async () => {
    let netId = await this.web3.eth.net.getId()
    let net = {
      network: this.getNetworkString(0, String(netId)),
      netId,
    }
    console.log("Updating current network", netId, net)
    return net
  }

  reloadWeb3 = async cookies => {
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
    this.currentNetwork = await this.refreshNetwork()
    await this.refreshContracts(cookies)

    return true
  }
}

export default SmartContractService
