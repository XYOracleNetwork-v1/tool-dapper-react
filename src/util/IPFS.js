import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

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

const ipfsConfigFromCookies = () => {
  const ipfshost = Cookies.get(`ipfshost`) || defaultIpfsHost
  const ipfsport = Cookies.get(`ipfsport`) || defaultIpfsPort
  const ipfsprotocol = Cookies.get(`ipfsprotocol`) || defaultIpfsProtocol
  const config = { ipfshost, ipfsport, ipfsprotocol }
  fields.forEach(field => Cookies.set(field, config[field]))
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

export const useIPFS = () => {
  const [ipfsConfig, updateIpfsConfig] = useState(ipfsConfigFromCookies())
  const { ipfshost: host, ipfsport: port, ipfsprotocol: protocol } = ipfsConfig
  const [ipfs, setIPFS] = useState(new IPFS({ host, port, protocol }))

  useEffect(() => {
    const {
      ipfshost: host,
      ipfsport: port,
      ipfsprotocol: protocol,
    } = ipfsConfig
    fields.forEach(field => Cookies.set(field, ipfsConfig[field]))
    const ipfs = new IPFS({ host, port, protocol })
    setIPFS(ipfs)
  })

  const uploadFiles = async data =>
    new Promise((resolve, reject) =>
      ipfs.add(
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

  const downloadFiles = async ipfsHash =>
    new Promise((resolve, reject) => {
      ipfs.get(ipfsHash, (err, files) => {
        if (err) {
          return reject(err)
        }
        parseFiles(files, resolve)
      })
    })

  return {
    updateIpfsConfig,
    uploadFiles,
    downloadFiles,
    ipfsConfig,
  }
}
