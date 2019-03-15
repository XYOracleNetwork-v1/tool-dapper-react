import abi from 'ethereumjs-abi'
import base58 from 'bs58'

export default [
  {
    id: 0,
    name: `sign`,
    description: `Use your account to sign a message`,
    inputs: [
      {
        name: `Signer`,
        value: undefined,
        type: `address`,
        placeholder: `ie. 0x000...`,
      },
      {
        name: `Message`,
        value: undefined,
        type: `string`,
        placeholder: `ie. This is a test`,
      },
    ],
    method: (web3, address, message, callback) =>
      web3.eth.personal.sign(message, address, callback),
  },
  {
    id: 1,
    name: `now`,
    description: `Return block time and number`,
    inputs: [],
    method: (web3, callback) => web3.eth.getBlockNumber(callback),
  },
  {
    id: 2,
    name: `kekkak256`,
    description: `Return hash of input`,
    inputs: [
      {
        name: `Input`,
        value: undefined,
        type: `string`,
        placeholder: `ie. Hash this string`,
      },
    ],
    method: (web3, callback) => web3.utils.keccak256(callback),
  },
  {
    id: 3,
    name: `encodeParameter`,
    description: `Return abi encoded of two inputs`,
    inputs: [
      {
        name: `type`,
        options: [`address`, `string`, `uint`],
        value: undefined,
        type: `option`,
        placeholder: `The type of parameter (string | address | uint)`,
      },
      {
        name: `parameter`,
        value: undefined,
        type: `string`,
        placeholder: `ie. The actual parameter to encode`,
      },
    ],
    method: (web3, input1, input2, callback) => {
      console.log(web3.eth.abi)
      return `0x${abi
        .soliditySHA3([`address`, `address`], [input1, input2])
        .toString(`hex`)}`
      // return web3.eth.abi.encodeParameter(input1, input2, callback)
    },
  },
  {
    id: 4,
    name: `recover`,
    description: `Recovers Ethereum address used to sign this data.`,
    inputs: [
      {
        name: `message`,
        value: undefined,
        type: `string`,
        placeholder: `The signed message or hash, already prefixed with "\x19Ethereum Signed Message:\n" + message.length + message.`,
      },
      {
        name: `signature`,
        value: undefined,
        type: `string`,
        placeholder: `The raw RLP encoded signature`,
      },
      {
        name: `isPrefixed`,
        value: false,
        type: `boolean`,
        placeholder: `if true, the given message will NOT automatically be prefixed with "\x19Ethereum Signed Message:\n" + message.length + message`,
      },
    ],
    method: (web3, message, sig, prefixed) =>
      console.log(web3.eth.accounts) ||
      web3.eth.accounts.recover(
        message,
        sig,
        prefixed === `true` || prefixed === `1`,
      ),
  },
  {
    id: 5,
    name: `decodeIPFS`,
    description: `Convert IPFS hash into bytes32`,
    inputs: [
      {
        name: `IPFS hash`,
        value: undefined,
        type: `string`,
        placeholder: `ie. Qm....`,
      },
    ],
    method: (web3, callback) =>
      `0x${base58
        .decode(callback)
        .slice(2)
        .toString(`hex`)}`,
  },
  {
    id: 6,
    name: `encodeIPFS`,
    description: `Convert bytes32 into IPFS hash`,
    inputs: [
      {
        name: `Bytes32 Hex String`,
        value: undefined,
        type: `string`,
        placeholder: `ie. 0x234...`,
      },
    ],
    method: (web3, bytes32Hex) => {
      const hashHex = `1220${bytes32Hex.slice(2).replace(/^0+/, ``)}`
      const hashBytes = Buffer.from(hashHex, `hex`)
      return base58.encode(hashBytes)
    },
  },
]
