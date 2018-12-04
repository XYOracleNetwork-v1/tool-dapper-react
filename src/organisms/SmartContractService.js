/* eslint-disable */
import Web3 from "web3"
import { PortisProvider } from "portis"
import { fetchABI } from "./ABIReader"

const localProviderUrl = "http://localhost:8545"

class SmartContractService {
  constructor(refreshUI, cookies) {
    this.refreshUI = refreshUI
    this.smartContracts = []
    this.currentUser = undefined
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

  portisProvider = portisNetwork => {
    if (portisNetwork && portisNetwork !== "development") {
      return new Web3(
        new PortisProvider({
          apiKey: "3b1ca5fed7f439bf72771e64e9442d74",
          network: portisNetwork,
        }),
      )
    } else {
      console.log("Using localhost")
      return new Web3(
        new PortisProvider({
          network: "development",
          providerNodeUrl: localProviderUrl,
        }),
      )
    }
  }

  changeNetwork = async newNetwork => {
    if (this.web3 && this.web3.currentProvider.changeNetwork) {
      if (newNetwork === "development") {
        this.web3.currentProvider.changeNetwork({
          providerNodeUrl: localProviderUrl,
        })
      } else {
        this.web3.currentProvider.changeNetwork({ network: newNetwork })
      }
      console.log("Changing Portis Network", newNetwork)
      this.currentNetwork = await this.refreshNetwork()
    }
  }
  contractObject = name =>
    this.smartContracts.find(contract => contract.name === name)

  contractAddress = name => {
    const contractObj = this.contractObject(name)
    return contractObj ? contractObj.address : undefined
  }

  validContract = async address => {
    try {
      let code = await this.web3.eth.getCode(address)
      if (code === "0x0" || code === "0x") {
        return { valid: false, address }
      }
      return { valid: true, address }
    } catch (err) {
      console.log("Exception caught, invalid contract", address, err)
      return { valid: false, address }
    }
  }

  deployedContractObjects = (name, netId) => {
    console.log("Fetching deployed contract", name)
    if (!this.deployedContracts) {
      return []
    }
    let currNet = netId || this.getCurrentNetworkId()
    let contractsOnNet = []
    Object.entries(this.deployedContracts).map(deployed => {
      if (deployed[1] && deployed[1].name === name) {
        if (!currNet) {
          contractsOnNet.push({ address: deployed[0], ...deployed[1] })
        } else if (deployed[1].netId == currNet) {
          contractsOnNet.push({ address: deployed[0], ...deployed[1] })
        }
      }
    })
    return contractsOnNet
  }

  validateDeployedOnNetwork = async netId => {
    let promises = []

    let previouslyDeployed = this.deployedContracts
    Object.entries(previouslyDeployed).forEach(deployed => {
      if (deployed[1] && deployed[1].netId == netId) {
        promises.push(this.validContract(deployed[0]))
      }
    })

    let results = await Promise.all(promises)
    results.forEach(result => {
      if (!result.valid) {
        console.log("DELETING INVALID CONTRACT", result)
        delete previouslyDeployed[result.address]
      }
    })
    this.deployedContracts = previouslyDeployed
    this.refreshUI()
  }

  updateLocalStorage = () => {
    console.log("Updating deployments in local storage")
    localStorage.setItem(
      "deployedContracts",
      JSON.stringify(this.deployedContracts),
    )
  }

  addSmartContract(abiObject) {
    let existingABI = this.smartContracts.filter(abi => abi.name === abiObject.name)

    if (existingABI.length === 0) {
      this.smartContracts.push(abiObject)
    }
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
      this.addSmartContract(abiObject)
    }
  }

  storeDeployments = async abiData => {
    let json = abiData.data
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
          "",
          deployed[0], // net id
        )
      })
    }
  }

  addDeployedContract = (
    ipfs,
    name,
    address,
    bytecode,
    abi,
    notes = "",
    netId = this.getCurrentNetworkId(),
  ) => {
    if (address) {
      this.deployedContracts[address] = {
        ipfs: ipfs,
        name: name,
        bytecode: bytecode,
        abi: abi,
        netId: netId,
        notes: notes,
      }

      this.updateLocalStorage()
    }
  }

  loadLocalStoreObjects = async () => {
    let objects = JSON.parse(localStorage.getItem("deployedContracts"))
    this.deployedContracts = objects || {}
    Object.entries(objects).forEach(
      o => {
        this.addSmartContract(o[1])
      }
    )

    console.log("Local Storage Loaded", this.deployedContracts, this.smartContracts)
    this.refreshUI()
  }

  loadIPFSContracts = async cookies => {
    let ipfs = cookies.get(`ipfs`)

    if (ipfs) {
      let { abi } = await fetchABI(cookies)
      await abi.forEach(this.storeABI)
      await abi.forEach(this.storeDeployments)
      console.log("IPFS Storage Loaded", this.deployedContracts)

      this.refreshUI()
    } else {
      console.log("No ipfs file loaded, please add in settings")
    }
  }

  createContract = (abi, address) => {
    if (!abi) {
      throw new Error("Contract must have abi passed")
    }
    return new this.web3.eth.Contract(abi, address)
  }

  refreshUser = async () => {
    let accounts = await this.web3.eth.getAccounts()
    console.log(`Updating USER from ${this.currentUser} to ${accounts[0]}`)
    this.currentUser = accounts[0]
    console.log("onrefresh user", this.refreshUI)
    this.refreshUI()
    return this.currentUser
  }

  refreshNetwork = async () => {
    let netId = await this.web3.eth.net.getId()
    let net = {
      network: this.getNetworkString(0, String(netId)),
      netId,
    }
    console.log("Updating current network", net)
    this.refreshUI()
    return net
  }

  listenForUpdates = () => {
    this.getCurrentConfigStore().on(`update`, this.refreshUser)
  }

  loadWeb3 = async cookies => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      this.web3 = window.web3
      console.log("Enabling web3")
      // Request account access if needed
      await window.ethereum.enable()
    } else if (typeof window.web3 !== "undefined") {
      this.web3 = new Web3(window.web3.currentProvider)
      this.listenForUpdates()
    } else {
      this.web3 = this.portisProvider(cookies.get("portisProvider"))
      this.web3.currentProvider.on('login', this.refreshUser)
    }
    console.log("Refreshing User")

    await this.refreshUser()
    console.log("Refreshing User")

    this.currentNetwork = await this.refreshNetwork()

    await this.validateDeployedOnNetwork(this.getCurrentNetworkId())
  }
}

export default SmartContractService
