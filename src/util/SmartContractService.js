/* eslint-disable */
import Web3 from 'web3'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { readSettings } from './CookieReader'
import { useWeb3Manager } from './web3'

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
  const [smartContracts, setSmartContracts] = useState([])
  const [deployedContracts, setDeployedContracts] = useState({})
  const web3Manager = useWeb3Manager()
  const { currentUser, currentNetwork, web3js: web3, initWeb3 } = web3Manager

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

  useEffect(
    () => {
      console.log('effect', 1)

      const netId = currentNetwork && currentNetwork.id
      if (!netId) return () => {}
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
        console.log({ newDeployed })

        setDeployedContracts(newDeployed)
      })
    },
    [currentNetwork],
  )

  useEffect(
    () => {
      console.log('effect', 2)

      localStorage.setItem(
        'deployedContracts',
        JSON.stringify(deployedContracts),
      )
    },
    [deployedContracts],
  )

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
          return [...acc, ...contractsToDeploy]
        }
        return acc
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

  const fetchABI = async hash => {
    Cookies.set('ipfs', hash)
    const settings = readSettings()
    switch (settings.currentSource) {
      default: {
        const files = await ipfsClient.downloadFiles(hash)
        return { abi: files }
      }
    }
  }

  const loadIPFSContracts = async (hash = Cookies.get('ipfs')) => {
    try {
      if (hash) {
        let { abi } = await fetchABI(hash)
        await storeABIs(abi)
        await storeABIDeployments(abi)
      } else {
        console.log('No ipfs file loaded, please add in settings')
      }
    } catch (err) {
      console.log({ err })
    }
  }

  const createContract = (abi, address) => {
    if (!abi) {
      throw new Error('Contract must have abi passed')
    }
    return new web3.eth.Contract(abi, address)
  }

  console.log('SCS!!!')

  return {
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
    web3,
    changePortisNetwork,
    initWeb3,
  }
}
