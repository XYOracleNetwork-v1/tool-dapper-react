/* eslint-disable */
import Web3 from 'web3'
import { useEffect, useState } from 'react'
import { PortisProvider } from 'portis'
import Cookies from 'js-cookie'

import { readSettings } from './CookieReader'

const localProviderUrl = 'http://localhost:8545'

export const web3Networks = [
  { id: 0, name: 'dummy', description: 'whatever' },
  { id: 5777, name: `development`, description: `Development (local)` },
  { id: 42, name: `kovan`, description: `Kovan` },
  { id: 3, name: `ropsten`, description: `Ropsten` },
  { id: 4, name: `rinkeby`, description: `Rinkeby` },
  { id: 1, name: `mainnet`, description: `Main Net` },
]

export const useScsc = ipfsClient => {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentNetwork, setCurrentNetwork] = useState(null)
  const [smartContracts, setSmartContracts] = useState([])
  const [deployedContracts, setDeployedContracts] = useState({})
  const [web3, setWeb3] = useState(null)
  const getNetworkWithId = netString => {
    const found = element => element.name == netString
    return web3Networks.find(found)
  }
  const getNetworkNamed = netId => {
    const found = element => element.id == netId
    return web3Networks.find(found)
  }

  const refreshNetwork = async () => {
    if (!window.web3) return null
    const netId = await window.web3.eth.net.getId()
    console.log(`Updating Network To`, netId)
    const currNet = getNetworkNamed(netId)
    setCurrentNetwork(currNet)
    return currNet
  }

  useEffect(() => {
    if (!web3) return () => {}
    web3.eth.net.getId().then(netId => {
      console.log(`Updating Network To`, netId)
      const currNet = getNetworkNamed(netId)
      setCurrentNetwork(currNet)
    })
  })

  const refreshUser = async () => {
    const [newUser] = await window.web3.eth.getAccounts()
    console.log(`Updating USER from ${currentUser} to ${newUser}`)
    setCurrentUser(newUser)
    return newUser
  }

  useEffect(() => {
    if (!web3) return () => {}
    window.web3.eth.getAccounts().then(([newUser]) => {
      console.log(`Updating USER from ${currentUser} to ${newUser}`)
      setCurrentUser(newUser)
    })
  })

  const portisProvider = () => {
    console.log('Creating Portis connection')

    const portisNetwork = Cookies.get('portisNetwork')
    const portisAPI = '3b1ca5fed7f439bf72771e64e9442d74'
    this.currentNetwork = getNetworkWithId(portisNetwork)

    console.log('Creating Portis Privider', portisNetwork)

    if (portisNetwork !== 'development') {
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

  const changePortisNetwork = async newNetwork => {
    if (web3 && web3.currentProvider.isPortis) {
      if (newNetwork === 'development') {
        web3.currentProvider.changeNetwork({
          network: newNetwork,
          providerNodeUrl: localProviderUrl,
        })
      } else {
        web3.currentProvider.changeNetwork({
          network: newNetwork,
        })
      }
      console.log('Changing Portis Network', newNetwork)
      setWeb3(web3)
    }
  }

  const contractObject = name =>
    smartContracts.find(contract => contract.name === name) || {}

  const contractAddress = name => contractObject(name).address

  const validContract = async address => {
    if (!web3) return { valid: false, address }
    try {
      const code = await web3.eth.getCode(address)
      if (code === '0x0' || code === '0x') {
        return { valid: false, address }
      }
      return { valid: true, address }
    } catch (err) {
      console.log('Exception caught, invalid contract', address, err)
      return { valid: false, address }
    }
  }

  const deployedContractObjects = (name, netId) => {
    if (!deployedContracts) {
      return []
    }
    const currNet = (netId || currentNetwork) && currentNetwork.id

    console.log({
      deployedContracts,
      currNet,
      name,
      netId,
    })
    return Object.entries(deployedContracts).reduce(
      (acc, [address, dep]) =>
        dep && dep.name === name && (!currNet || dep.netId == currNet)
          ? [...acc, { address, ...dep }]
          : acc,
      [],
    )
  }

  const validateDeployedOnNetwork = async netId => {
    const promises = Object.entries(deployedContracts).reduce(
      (acc, [address, dep]) =>
        dep && dep.netId == netId ? [...acc, validContract(address)] : acc,
      [],
    )

    const results = await Promise.all(promises)
    const newDeployed = results.reduce((acc, { valid, address }) => {
      if (!valid) {
        delete acc[address]
      }
      return acc
    }, deployedContracts)
    setDeployedContracts(newDeployed)
  }

  useEffect(() => {
    if (!netId) return () => {}
    const netId = currentNetwork.id
    const promises = Object.entries(deployedContracts).reduce(
      (acc, [address, dep]) =>
        dep && dep.netId == netId ? [...acc, validContract(address)] : acc,
      [],
    )

    Promise.all(promises).then(results => {
      const newDeployed = results.reduce((acc, { valid, address }) => {
        if (!valid) {
          const { [address]: x, ...rest } = acc
          return rest
        }
        return acc
      }, deployedContracts)
      setDeployedContracts(newDeployed)
    })
  })

  useEffect(() => {
    localStorage.setItem('deployedContracts', JSON.stringify(deployedContracts))
  })

  const addSmartContract = abiObject => {
    const existingABI = smartContracts.filter(
      abi => abi.name === abiObject.name,
    )
    if (existingABI.length === 0) {
      setSmartContracts([...smartContracts, abiObject])
    }
  }

  const addSmartContracts = abiObjects => {
    const newSmartContracts = abiObjects.reduce(
      (acc, abiObject) =>
        smartContracts.find(abi => abi.name === abiObject.name)
          ? acc
          : [...acc, abiObject],
      smartContracts,
    )
    setSmartContracts(newSmartContracts)
  }

  const storeABI = ({ data: { bytecode, contractName, abi }, ipfs }) => {
    if (bytecode !== '0x') {
      const abiObject = {
        ipfs,
        name: contractName,
        bytecode,
        abi,
      }
      addSmartContract(abiObject)
    }
  }

  const storeABIs = abis => {
    const abiObjs = abis.reduce(
      (acc, { data: { bytecode, contractName, abi }, ipfs }) =>
        bytecode === '0x'
          ? acc
          : [
              ...acc,
              {
                ipfs,
                name: contractName,
                bytecode,
                abi,
              },
            ],
      [],
    )
    addSmartContracts(abiObjs)
  }

  const addDeployedContract = ({
    ipfs,
    name,
    address,
    bytecode,
    abi,
    notes = '',
    netId = currentNetwork.id,
  }) => {
    if (address) {
      const contract = {
        ipfs: ipfs,
        name: name,
        bytecode: bytecode,
        abi: abi,
        netId: netId,
        notes: notes,
      }
      setDeployedContracts({ ...deployedContracts, [address]: contract })
    }
  }

  const addDeployedContracts = contracts => {
    const newDeployedContracts = contracts.reduce(
      (
        acc,
        {
          ipfs,
          name,
          address,
          bytecode,
          abi,
          notes = '',
          netId = currentNetwork.id,
        },
      ) => {
        if (!address) return acc
        const contract = {
          ipfs: ipfs,
          name: name,
          bytecode: bytecode,
          abi: abi,
          netId: netId,
          notes: notes,
        }
        return { ...acc, [address]: contract }
      },
      deployedContracts,
    )
    setDeployedContracts(newDeployedContracts)
  }

  const storeDeployments = async ({
    data: { networks, contractName, bytecode, abi },
    data,
    ipfs,
  }) => {
    const deployments = Object.entries(networks)
    if (data && deployments.length > 0) {
      const contractsToDeploy = deployments
        .map(([netId, add]) => {
          const address = add && add.address
          if (!address) return
          return {
            ipfs,
            name: contractName,
            address,
            bytecode,
            abi,
            netId,
          }
        })
        .filter(Boolean)
      addDeployedContracts(contractsToDeploy)
    }
  }

  const storeABIDeployments = async abis => {
    const contractsToDeploy = abis.reduce(
      (
        acc,
        { data: { networks, contractName, bytecode, abi }, data, ipfs },
      ) => {
        const deployments = Object.entries(networks)
        if (data && deployments.length > 0) {
          const contractsToDeploy = deployments
            .map(([netId, add]) => {
              const address = add && add.address
              if (!address) return
              return {
                ipfs,
                name: contractName,
                address,
                bytecode,
                abi,
                netId,
              }
            })
            .filter(Boolean)
          return acc.concat(contractsToDeploy)
        }
      },
      [],
    )
    addDeployedContracts(contractsToDeploy)
  }

  const loadLocalStoreObjects = async () => {
    const objects = JSON.parse(localStorage.getItem('deployedContracts')) || {}
    const contractsToAdd = Object.entries(objects).map(
      ([address, contract]) => contract,
    )
    addSmartContracts(contractsToAdd)
    setDeployedContracts(objects)
  }

  const fetchABI = async () => {
    const settings = readSettings()
    switch (settings.currentSource) {
      default: {
        const files = await ipfsClient.downloadFiles(settings.ipfs)
        return { abi: files }
      }
    }
  }

  const loadIPFSContracts = async () => {
    const ipfs = Cookies.get(`ipfs`)
    console.log({ ipfs })

    if (ipfs) {
      let { abi } = await fetchABI()
      await storeABIs(abi)
      await storeABIDeployments(abi)
    } else {
      console.log('No ipfs file loaded, please add in settings')
    }
  }

  const createContract = (abi, address) => {
    if (!abi) {
      throw new Error('Contract must have abi passed')
    }
    return new web3.eth.Contract(abi, address)
  }

  const getCurrentConfigStore = () =>
    web3 && web3.currentProvider && web3.currentProvider.publicConfigStore

  useEffect(() => {
    const currentConfigStore = getCurrentConfigStore()
    // if (currentConfigStore) currentConfigStore.on(`update`, refreshUser)
  })

  const setupPortis = async () => {
    console.log('Setting up Portis')
    const newWeb3 = portisProvider()
    setWeb3(newWeb3)
    const promise = new Promise((resolve, reject) => {
      newWeb3.currentProvider.on('login', async () => {
        // await refreshUser()
        // await refreshNetwork()
        console.log('Portis Logged in', currentNetwork, currentUser)
        // await validateDeployedOnNetwork(currentNetwork.id)
        resolve()
      })
    })
    // await refreshUser() // forces login

    console.log('Done initializing web3 Portis', currentNetwork)
    return promise
  }

  const loadWeb3 = async () => {
    try {
      console.log('LOADING WEB 3')
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        setWeb3(window.web3)
        // Request account access if needed
        await window.ethereum.enable()
      } else if (typeof window.web3 !== 'undefined') {
        setWeb3(new Web3(window.web3.currentProvider))
      } else {
        return setupPortis()
      }
      // await refreshUser()
      // await refreshNetwork()
      // await validateDeployedOnNetwork(currentNetwork.id)
    } catch (err) {
      console.log({ err })
    }
  }

  return {
    loadWeb3,
    loadLocalStoreObjects,
    loadIPFSContracts,
    currentNetwork,
    currentUser,
    smartContracts,
    deployedContractObjects,
    contractObject,
    createContract,
    addDeployedContract,
    addDeployedContracts,
    getNetworkNamed,
    web3,
    changePortisNetwork,
  }
}
