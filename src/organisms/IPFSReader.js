import IPFS from "ipfs-http-client"
import {ipfsConfigFromCookies} from './IPFSUploader'

let parseFiles = (files, resolve) => {
  let abi = []
  files.forEach(file => {
    if (file.content) {
      abi.push({
        data: JSON.parse(String(file.content)),
        ipfs: file.path,
      })
    }
  })
  resolve(abi)
}

export const downloadFiles = async (cookies, ipfsHash) => {
  let ipfsConfig = ipfsConfigFromCookies(cookies)
  const ipfs = new IPFS({
    host: ipfsConfig.ipfshost,
    port: ipfsConfig.ipfsport,
    protocol: ipfsConfig.ipfsprotocol,
  })
  return new Promise((resolve, reject) => {
      ipfs.get(ipfsHash, (err, files) => {
        if (err) {
          return reject(err)
        }
        parseFiles(files, resolve)
      })
  })
}
