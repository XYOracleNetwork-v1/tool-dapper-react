import Web3 from 'web3'


export const getWeb3 = () => {
  if (typeof window.web3 !== 'undefined') {
    return new Web3(window.web3.currentProvider)
  }
  return new Web3('http://localhost:8545')
}

export const contractNamed = (name) => {
  let contractObj = SmartContracts.find(contract => contract.name === name)
  if (contractObj) {
    return contractObj.contract
  }
  return undefined
}

export let SmartContracts = []
export let web3
export let DataVault
export const addressDataVault = '0xf45d62b4da78a55c98ff10b0fc22ca6c742381a5'



export function injectWeb3() {
  web3 = getWeb3()
  
	DataVault = new web3.eth.Contract(
		require('/Users/kevin/Documents/GitHub/tool-abiexplorer-react/src/ABI/DataVault.json').abi,
		addressDataVault)
    SmartContracts.push({name: 'DataVault',
                        contract: DataVault})

}

