// import IPFS from 'ipfs-mini'
import IPFS from "ipfs-http-client"

const ipfs = new IPFS({
  host: `ipfs.xyo.network`,
  port: 5002,
  protocol: `https`,
})
// const ipfs = new IPFS({
//   host: `ipfs.infura.io`,
//   port: 5001,
//   protocol: `https`,
// })
// const ipfs = new IPFS({
//   host: `127.0.0.1`,
//   port: 9001,
//   protocol: `http`,
// })

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

export const downloadFiles = async ipfsHash => {
  return new Promise((resolve, reject) => {
    ipfs.get(ipfsHash, (err, files) => {
      if (err) {
        return reject(err)
      }
      try {
        parseFiles(files, resolve)
      } catch (err) {
        console.log(`IPFS MUST BE JSON FILES!`)
        reject(err)
      }
    })
  })
}
