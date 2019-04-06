import Cookies from 'js-cookie'
import { useState, useEffect, useRef } from 'react'

const IPFS = require(`ipfs-http-client`)

const folder = `contracts`

// localhost, 5001, http
// ipfs.infura.io, 5001, https
// ipfs.xyo.io, 5002, https
// ipfs.xyo.network, 5002, https
// ipfs.layerone.co, 5002, https
const defaultIpfsHost = `ipfs.xyo.network`
const defaultIpfsPort = `5002`
const defaultIpfsProtocol = `https`

const fields = [`ipfshost`, `ipfsport`, `ipfsprotocol`]

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
  return resolve ? resolve(abi) : abi
}

export const useIPFS = () => {
  const [ipfsConfig, updateIpfsConfig] = useState(ipfsConfigFromCookies)
  const { ipfshost: host, ipfsport: port, ipfsprotocol: protocol } = ipfsConfig
  const ipfs = useRef(new IPFS({ host, port, protocol }))

  useEffect(() => {
    const {
      ipfshost: host,
      ipfsport: port,
      ipfsprotocol: protocol,
    } = ipfsConfig
    fields.forEach(field => Cookies.set(field, ipfsConfig[field]))
    ipfs.current = new IPFS({ host, port, protocol })
  })

  const uploadFiles = async data =>
    new Promise((resolve, reject) =>
      ipfs.current.add(
        data,
        { recursive: false, wrapWithDirectory: true, pin: true },
        (err, res) => {
          if (err) {
            console.log(`Got IPFS error:`, err)
            return reject(err)
          }
          console.log(`IPFS res:`, res)
          parseResponse(res, resolve, reject)
        },
      ),
    )

  const downloadFiles = async ipfsHash => {
    const files = await ipfs.current.get(ipfsHash)
    return parseFiles(files)
  }

  return {
    updateIpfsConfig,
    uploadFiles,
    downloadFiles,
    ipfsConfig,
  }
}
