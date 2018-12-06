const IPFS = require(`ipfs-http-client`)

const folder = `contracts`

// localhost, 5001, http
// ipfs.infura.io, 5001, https
// ipfs.xyo.io, 5002, https
export const ipfsConfigFromCookies = cookies => {
  let ipfshost = cookies.get(`ipfshost`) || `ipfs.xyo.network`
  let ipfsport = cookies.get(`ipfsport`) || `5002`
  let ipfsprotocol = cookies.get(`ipfsprotocol`) || `https`
  return { ipfshost, ipfsport, ipfsprotocol }
}

const parseResponse = (res, resolve, reject) => {
  console.log(`Got response`, res)
  res.forEach(fileObj => {
    console.log(` $ Storing contract`, fileObj.path)

    if (fileObj.path === folder || fileObj.path === `` || res.length === 1) {
      console.log(` $ Contracts stored to IPFS`, fileObj.hash)
      console.log(
        ` $ View contracts at https://ipfs.xyo.network/ipfs/${
        fileObj.hash
        }`,
      )
      return resolve(fileObj.hash)
    } 
  })
  reject(
    new Error(
      `No folder returned saving the IPFS file, this shouldn't happen`,
    ),
  )
}

const uploadIPFS = async (cookies, data) => {
  let ipfsConfig = ipfsConfigFromCookies(cookies)
  const ipfs = new IPFS({
    host: ipfsConfig.ipfshost,
    port: ipfsConfig.ipfsport,
    protocol: ipfsConfig.ipfsprotocol,
  })
  return new Promise((resolve, reject) =>
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
    )
  )
}
export default uploadIPFS
