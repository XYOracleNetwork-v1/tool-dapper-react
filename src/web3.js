/*
  This is an auto-generated web3 interface to the smart contracts deployed via Dapploy
  Do not make changes to this file, they get overwritten each Dapploy :)
*/
/* eslint-disable */
import Web3 from 'web3'

export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
  return new Web3('http://localhost:8545')
}

const contractObject = name =>
  SmartContracts.find(contract => contract.name === name)

export const contractNamed = name => {
  const contractObj = contractObject(name)
  return contractObj ? contractObj.contract : undefined
}

export const contractAddress = name => {
  const contractObj = contractObject(name)
  return contractObj ? contractObj.address : undefined
}

export const validateContracts = async => {
  return Promise.all(
    SmartContracts.map(contract => validContract(contract.name)),
  ).then(results => {
    console.log('valid results', results)
    return results.reduce((result, next) => result && next)
  })
}

export const validContract = async name => {
  console.log('Validating Contract', name)
  const address = contractAddress(name)
  return new Promise((resolve, reject) => {
    web3.eth
      .getCode(address)
      .then(
        code =>
          code === '0x0' || code === '0x' ? resolve(false) : resolve(true),
      )
      .catch(err => reject(err))
  })
}

const getCurrentUser = async () =>
  web3.eth.getAccounts().then(accounts => accounts[0])

export let SmartContracts = []
export let web3
export let currentUser

export const refreshContracts = async web3 => {
  let contracts = []
  return fetch('http://localhost:5000/abi')
    .then(contractDatas => {
      return contractDatas.json()
    })
    .then(data => {
      contracts = data.abi
      return web3.eth.net.getId()
    })
    .then(netId => {
      SmartContracts = []
      contracts.forEach(contract => {
        let json = contract.data
        if (json && json.networks[netId]) {
          console.log('Adding Contract', json.contractName)
          const address = json.networks[netId].address
          const contract = new web3.eth.Contract(json.abi, address)
          SmartContracts.push({
            name: json.contractName,
            contract: contract,
            address: address,
          })
        }
      })
      return SmartContracts
    })
    .catch(err => {
      console.log('Caught here', err)
    })
}

export function injectWeb3() {
  web3 = getWeb3()

  const refreshUser = () =>
    getCurrentUser().then(account => {
      currentUser = account
    })
  const refreshDapp = async () =>
    Promise.all([refreshUser(), refreshContracts(web3)])

  // Will refresh local store when new user is chosen:
  web3.currentProvider.publicConfigStore.on('update', refreshDapp)

  return refreshContracts(web3).then(refreshUser)
}
