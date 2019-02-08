import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useContext,
  useReducer,
  createContext,
} from 'react'
import Cookies from 'js-cookie'
import Web3 from 'web3'
import { PortisProvider } from 'portis'

export const localProviderUrl = 'http://localhost:8545'

export const web3Networks = [
  { id: 0, name: 'dummy', description: 'whatever' },
  { id: 5777, name: `development`, description: `Development (local)` },
  { id: 42, name: `kovan`, description: `Kovan` },
  { id: 3, name: `ropsten`, description: `Ropsten` },
  { id: 4, name: `rinkeby`, description: `Rinkeby` },
  { id: 1, name: `mainnet`, description: `Main Net` },
]

export const web3NetworksById = web3Networks.reduce(
  (acc, k) => ({ ...acc, [k.id]: k }),
  {},
)

export const getNetworkById = netId => web3NetworksById[netId]

const Web3Context = createContext(null)

export const useWeb3Context = () => useContext(Web3Context)

export const useNetworkName = networkId => {
  const context = useWeb3Context()
  return useMemo(() => getNetworkById(networkId || context.networkId), [
    networkId,
    context.networkId,
  ])
}
export const useAccountEffect = (effect, depends = []) => {
  const context = useWeb3Context()
  useEffect(effect, [
    ...depends,
    context.networkId,
    context.account,
    // context.reRenderers.accountReRenderer,
  ])
}

export const useNetworkEffect = (effect, depends = []) => {
  const context = useWeb3Context()
  useEffect(effect, [
    ...depends,
    context.networkId,
    context.reRenderers.networkReRenderer,
  ])
}

export const useAccountAndNetworkEffect = (effect, depends = []) => {
  const context = useWeb3Context()
  useAccountEffect(effect, [...depends, context.reRenderers.networkReRenderer])
}

// web3 manager
const ETHEREUM_ACCESS_DENIED = 'ETHEREUM_ACCESS_DENIED'
const INITIALIZE = 'INITIALIZE'
const INITIALIZE_URL = 'INITIALIZE_URL'
const UPDATE_NETWORK_ID = 'UPDATE_NETWORK_ID'
const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT'

const initialWeb3State = {
  web3js: undefined,
  account: undefined,
  network: undefined,
  usingProviderURL: undefined,
}

const web3StateReducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      return { ...state, web3js: action.payload, usingProviderURL: false }
    case INITIALIZE_URL:
      return { ...state, web3js: action.payload, usingProviderURL: true }
    case UPDATE_NETWORK_ID:
      return { ...state, network: action.payload }
    case UPDATE_ACCOUNT:
      return { ...state, account: action.payload }
    default:
      return initialWeb3State
  }
}

export const useWeb3Manager = (pollTime = 1000, providerURL) => {
  const [web3State, dispatchWeb3State] = useReducer(
    web3StateReducer,
    initialWeb3State,
  )

  // compute initialization status
  const web3Initialized =
    web3State.web3js && web3State.account !== undefined && web3State.networkId

  // web3 error ref
  const [web3Error, setWeb3Error] = useState(null)
  useEffect(() => {
    if (web3Initialized && web3Error) setWeb3Error(null)
  })

  // run one-time initialization
  useEffect(() => {
    const { web3, ethereum } = window

    // for modern dapp browsers
    if (ethereum)
      ethereum
        .enable()
        .then(() => {
          const web3js = new Web3(ethereum)
          dispatchWeb3State({ type: INITIALIZE, payload: web3js })
        })
        .catch(deniedAccessMessage => {
          const deniedAccessError = Error(deniedAccessMessage.toString())
          deniedAccessError.code = ETHEREUM_ACCESS_DENIED
          setWeb3Error(deniedAccessError)
        })
    // for legacy dapp browsers
    else if (web3 && web3.currentProvider) {
      const web3js = new Web3(web3.currentProvider)
      dispatchWeb3State({ type: INITIALIZE, payload: web3js })
    }
    // use providerURL as a backup
    else if (web3 && providerURL) {
      const web3js = new Web3(providerURL)
      dispatchWeb3State({ type: INITIALIZE_URL, payload: web3js })
    }
    // no web3 detected, use portis
    else {
      console.log('Creating Portis connection')
      const portisNetwork = Cookies.get('portisNetwork')
      const portisAPI = '3b1ca5fed7f439bf72771e64e9442d74'
      console.log('Creating Portis Privider', portisNetwork)
      const portisArgs =
        portisNetwork === 'development'
          ? {
              apiKey: portisAPI,
              network: portisNetwork,
              providerNodeUrl: localProviderUrl,
            }
          : {
              apiKey: portisAPI,
              network: portisNetwork,
            }
      console.log('Setting up Portis')
      const web3js = new Web3(new PortisProvider(portisArgs))
      dispatchWeb3State({ type: INITIALIZE, payload: web3js })
    }
  }, [])

  const networkPoll = () => {
    web3State.web3js.eth.net
      .getId()
      .then(networkId => {
        if (networkId !== web3State.networkId) {
          const network = getNetworkById(networkId)
          dispatchWeb3State({ type: UPDATE_NETWORK_ID, payload: network })
        }
      })
      .catch(error => setWeb3Error(error))
  }

  const accountPoll = () => {
    web3State.web3js.eth
      .getAccounts()
      .then(accounts => {
        const account =
          accounts === undefined || accounts[0] === undefined
            ? null
            : accounts[0]
        if (account !== web3State.account)
          dispatchWeb3State({ type: UPDATE_ACCOUNT, payload: account })
      })
      .catch(error => setWeb3Error(error))
  }

  useEffect(
    () => {
      if (web3State.web3js) {
        networkPoll()
        const networkPollInterval = setInterval(networkPoll, pollTime)
        return () => clearInterval(networkPollInterval)
      }
    },
    [web3State.web3js, web3State.networkId],
  )

  useEffect(
    () => {
      if (web3State.web3js) {
        accountPoll()
        const accountPollInterval = setInterval(accountPoll, pollTime)
        return () => clearInterval(accountPollInterval)
      }
    },
    [web3State.web3js, web3State.account],
  )

  // reRenderers
  const [accountReRenderer, setAccountReRenderer] = useState(0)

  const forceAccountReRender = () => {
    setAccountReRenderer(accountReRenderer + 1)
  }

  const [networkReRenderer, setNetworkReRenderer] = useState(0)

  const forceNetworkReRender = () => {
    setNetworkReRenderer(networkReRenderer + 1)
  }

  const { usingProviderURL, account, network, ...rest } = web3State
  return {
    usingProviderURL,
    currentNetwork: network,
    currentUser: account,
    web3Initialized,
    web3Error,
    accountReRenderer,
    networkReRenderer,
    forceAccountReRender,
    forceNetworkReRender,
    ...rest,
  }
}
