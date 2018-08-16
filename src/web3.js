/* 
  This is an auto-generated web3 interface to the smart contracts deployed via Dapploy
  Do not make changes to this file, they get overwritten each Dapploy :)
*/

import Web3 from 'web3'


export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
  return new Web3('http://localhost:8545')
}
const contractObject = (name) => SmartContracts.find(contract => contract.name === name)

export const contractNamed = (name) => {
  const contractObj = contractObject(name)
  return contractObj ? contractObj.contract : undefined
}

export const contractAddress = (name) => {
  const contractObj = contractObject(name)
  return contractObj ? contractObj.address : undefined
}

export const validContract = async (name) => {
  const address = contractAddress(name)
  return web3.eth.getCode(address).then(code => {
    return code === "0x" ? Promise.resolve(false) : Promise.resolve(true)
  })
} 

export let SmartContracts = []
export let web3
export let DataVault
export const addressDataVault = '0x268f3dea9bba2e0adf37f8e32b0ec0b92910d108'

export function injectWeb3() {
  web3 = getWeb3()
  
	DataVault = new web3.eth.Contract(
		require('./ABI/DataVault.json').abi,
		addressDataVault)
    SmartContracts.push({name: 'DataVault', contract: DataVault, address: addressDataVault})
}

