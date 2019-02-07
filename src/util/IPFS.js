const IPFS = require(`ipfs-http-client`)

const folder = `contracts`

// localhost, 5001, http
// ipfs.infura.io, 5001, https
// ipfs.xyo.io, 5002, https
// ipfs.xyo.network, 5002, https
// ipfs.layerone.co, 5002, https
const defaultIpfsHost = 'ipfs.xyo.network'
const defaultIpfsPort = '5002'
const defaultIpfsProtocol = 'https'

const fields = ['ipfshost', 'ipfsport', 'ipfsprotocol']

export const ipfsConfigFromCookies = cookies => {
  const ipfshost = cookies.get(`ipfshost`) || defaultIpfsHost
  const ipfsport = cookies.get(`ipfsport`) || defaultIpfsPort
  const ipfsprotocol = cookies.get(`ipfsprotocol`) || defaultIpfsProtocol
  const config = { ipfshost, ipfsport, ipfsprotocol }
  fields.forEach(field => cookies.set(field, config[field]))
  return config
}

const parseResponse = (res, resolve, reject) => {
  console.log(`Got response`, res)
  res.forEach(fileObj => {
    const { path, hash } = fileObj
    console.log(` $ Storing contract`, fileObj)
    if (path === folder || path === `` || res.length === 1) {
      console.log(` $ Contracts stored to IPFS`, hash)
      console.log(` $ View contracts at https://ipfs.xyo.network/ipfs/${hash}`)
      return resolve(hash)
    }
  })
  reject(
    new Error(`No folder returned saving the IPFS file, this shouldn't happen`),
  )
}

const parseFiles = (files, resolve) => {
  const abi = files.reduce(
    (acc, file) =>
      file.content
        ? [
            ...acc,
            {
              data: JSON.parse(String(file.content)),
              ipfs: file.path,
            },
          ]
        : acc,
    [],
  )
  resolve(abi)
}

class IPFSClient {
  constructor(cookies) {
    this.cookies = cookies
    const {
      ipfshost: host,
      ipfsport: port,
      ipfsprotocol: protocol,
    } = ipfsConfigFromCookies(cookies)
    this.ipfs = new IPFS({ host, port, protocol })
  }

  getIpfsConfig = () =>
    fields.reduce(
      (acc, field) => ({ ...acc, [field]: this.cookies.get(field) }),
      {},
    )

  updateIpfsConfig = config => {
    fields.forEach(field => {
      this.cookies.set(field, config[field])
    })
    const {
      ipfshost: host,
      ipfsport: port,
      ipfsprotocol: protocol,
    } = ipfsConfigFromCookies(this.cookies)
    this.ipfs = new IPFS({ host, port, protocol })
    return this.getIpfsConfig()
  }

  uploadFiles = async data =>
    new Promise((resolve, reject) =>
      this.ipfs.add(
        data,
        { recursive: false, wrapWithDirectory: true, pin: true },
        (err, res) => {
          if (err) {
            console.log(`Got IPFS error:`, err)
            return reject(err)
          }
          parseResponse(res, resolve, reject)
        },
      ),
    )

  downloadFiles = async ipfsHash => {
    return new Promise((resolve, reject) => {
      this.ipfs.get(ipfsHash, (err, files) => {
        if (err) {
          return reject(err)
        }
        parseFiles(files, resolve)
      })
    })
  }
}

export default IPFSClient
