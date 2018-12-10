/* eslint-disable */
import Web3 from "web3"
import { PortisProvider } from "portis"
import { fetchABI } from "./ABIReader"

const localProviderUrl = "http://localhost:8545"

const web3Networks = [
  { id: 0, name: 'dummy', description: "whatever"},
  { id: 5777, name: `development`, description: `Development (local)` },
  { id: 42, name: `kovan`, description: `Kovan` },
  { id: 3, name: `ropsten`, description: `Ropsten` },
  { id: 4, name: `rinkeby`, description: `Rinkeby` },
  { id: 1, name: `mainnet`, description: `Main Net` },
]

class SmartContractService {
  constructor(refreshUI, cookies) {
    this.refreshUI = refreshUI
    this.smartContracts = []
    this.currentUser = undefined
  }

  getCurrentUser = () => this.currentUser
  getCurrentNetwork = () => this.currentNetwork
  getSmartContracts = () => this.smartContracts
  getWeb3Networks = () => web3Networks

  getNetworkWithId = netString => {
    let found = element => {
      return (element.name = netString)
    }
    return web3Networks.find(found)
  }

  getNetworkNamed = netId => {
    let found = element => {
      return element.id == netId
    }
    return web3Networks.find(found)
  }

  portisProvider = cookies => {
    console.log("Creating Portis connection", cookies)

    const portisNetwork = cookies.get("portisNetwork")
    const portisAPI = "3b1ca5fed7f439bf72771e64e9442d74"
    this.currentNetwork = this.getNetworkWithId(portisNetwork)

    console.log("Creating Portis Privider", portisNetwork)

    if (portisNetwork !== "development") {
      return new Web3(
        new PortisProvider({
          apiKey: portisAPI,
          network: portisNetwork,
        }),
      )
    } else {
      return new Web3(
        new PortisProvider({
          apiKey: portisAPI,
          network: portisNetwork,
          providerNodeUrl: localProviderUrl,
        }),
      )
    }
  }

  changePortisNetwork = async newNetwork => {
    if (this.web3 && this.web3.currentProvider.isPortis) {
      if (newNetwork === "development") {
        this.web3.currentProvider.changeNetwork({
          network: newNetwork,
          providerNodeUrl: localProviderUrl,
        })
      } else {
        this.web3.currentProvider.changeNetwork({
          network: newNetwork,
        })
      }
      console.log("Changing Portis Network", newNetwork)
      await this.refreshNetwork()
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
    if (!this.deployedContracts) {
      return []
    }
    let currNet = netId || this.getCurrentNetwork() ? this.getCurrentNetwork().id : undefined
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
    // console.log("Updating deployments in local storage")
    localStorage.setItem(
      "deployedContracts",
      JSON.stringify(this.deployedContracts),
    )
  }

  addSmartContract(abiObject) {
    let existingABI = this.smartContracts.filter(
      abi => abi.name === abiObject.name,
    )

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
    netId = this.getCurrentNetwork().id,
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
    let objects = JSON.parse(localStorage.getItem("deployedContracts")) || {}
    Object.entries(objects).forEach(o => {
      this.addSmartContract(o[1])
    })
    this.deployedContracts = objects
    this.refreshUI()
  }

  loadIPFSContracts = async cookies => {
    let ipfs = cookies.get(`ipfs`)

      if (ipfs) {
        let { abi } = await fetchABI(cookies)
        await abi.forEach(this.storeABI)
        await abi.forEach(this.storeDeployments)
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
    this.refreshUI()
    return this.currentUser
  }

  refreshNetwork = async () => {
    let netId = await this.web3.eth.net.getId()
    console.log(`Updating Network To`, netId)

    this.currentNetwork = this.getNetworkNamed(netId)
    this.refreshUI()
    return this.currentNetwork
  }

  getCurrentConfigStore = () =>
    this.web3
      ? this.web3.currentProvider
        ? this.web3.currentProvider.publicConfigStore
        : undefined
      : undefined

  listenForUpdates = () => {
    this.getCurrentConfigStore().on(`update`, this.refreshUser)
  }

  setupPortis = async cookies => {
    console.log("Setting up Portis")
    this.web3 = this.portisProvider(cookies)
    let promise = new Promise((resolve, reject) => {
      this.web3.currentProvider.on("login", async stuff => {
        await this.refreshUser()
        await this.refreshNetwork()
        console.log("Portis Logged in", this.currentNetwork, this.currentUser)
        await this.validateDeployedOnNetwork(this.getCurrentNetwork().id)
        resolve()
      })
    })
    await this.refreshUser() // forces login

    console.log("Done initializing web3 Portis", this.currentNetwork)

    return promise
  }

  loadWeb3 = async cookies => {
    console.log("LOADING WEB 3")
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      this.web3 = window.web3
      // Request account access if needed
      await window.ethereum.enable()
    } else if (typeof window.web3 !== "undefined") {
      this.web3 = new Web3(window.web3.currentProvider)
    } else {
      return this.setupPortis(cookies)
    }

    await this.refreshUser()
    await this.refreshNetwork()
    await this.validateDeployedOnNetwork(this.getCurrentNetwork().id)

    this.listenForUpdates()
  }
}

export default SmartContractService
