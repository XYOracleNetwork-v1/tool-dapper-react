/* eslint-disable */
import Web3 from 'web3'
import { PortisProvider } from 'portis'

class SmartContractService {
  getAllSmartContracts = () => {
    return this.smartContracts
  }
  constructor() {
    this.smartContracts = []
    this.web3 = this.getWeb3()
    this.currentUser = undefined
    this.refreshContracts.bind(this)
  }

  getWeb3 = () => {
    if (typeof window.web3 !== 'undefined') {
      return new Web3(window.web3.currentProvider)
    }
    return new Web3(
      new PortisProvider({
        providerNodeUrl: 'http://localhost:8545',
      }),
    )
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
      console.log('valid results', results)
      if (results.length == 0) {
        throw new Error('No contracts found on this network')
      } else {
        return results.reduce((result, next) => result && next)
      }
    })
  }

  validContract = async name => {
    console.log('Validating Contract', name)
    const address = this.contractAddress(name)
    return new Promise((resolve, reject) => {
      this.web3.eth
        .getCode(address)
        .then(
          code =>
            code === '0x0' || code === '0x' ? resolve(false) : resolve(true),
        )
        .catch(err => reject(err))
    })
  }

  getCurrentUser = async () =>
    this.web3.eth.getAccounts().then(accounts => accounts[0])

  refreshContracts = async _ => {
    console.log('Refreshing contracts')
    let contracts = []
    return fetch('http://localhost:5000/abi')
      .then(contractDatas => {
        return contractDatas.json()
      })
      .then(data => {
        contracts = data.abi
        return this.web3.eth.net.getId()
      })
      .then(netId => {
        console.log('Checking contracts on network', netId)
        let sc = []
        contracts.forEach(contract => {
          let json = contract.data

          if (json && json.networks[netId]) {
            console.log('Adding Contract', json.contractName)
            const address = json.networks[netId].address
            const contract = new this.web3.eth.Contract(json.abi, address)
            sc.push({
              name: json.contractName,
              contract: contract,
              address: address,
            })
          } else if (Object.entries(json.networks).length > 0) {
            console.log(
              'You are on the wrong network',
              Object.entries(json.networks)[0],
            )
            throw new Error('Wrong Network Detected')
          }
        })
        this.smartContracts = sc
        return sc
      })
      .catch(err => {
        console.log('Caught here', err)
        // throw new Error('Could not refresh', err)
      })
  }

  reloadWeb3() {
    console.log('Reload Web 3')
    const refreshUser = () =>
      this.getCurrentUser().then(account => {
        this.currentUser = account
      })
    refreshUser.bind(this)
    const refreshDapp = async () =>
      Promise.all([refreshUser(), this.refreshContracts()])

    // Will refresh local store when new user is chosen:
    if (this.web3.currentProvider.publicConfigStore) {
      this.web3.currentProvider.publicConfigStore.on('update', refreshDapp)
    }

    return this.refreshContracts().then(refreshUser)
  }
}

export default SmartContractService
