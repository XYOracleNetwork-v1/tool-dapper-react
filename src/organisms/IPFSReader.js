// import IPFS from 'ipfs-mini'
import IPFS from 'ipfs-api'

// const ipfs = new IPFS({
//   host: 'ipfs.xyo.network',
//   port: 5002,
//   protocol: 'https',
// })
const ipfs = new IPFS({
  host: `ipfs.infura.io`,
  port: 5001,
  protocol: `https`,
})

export const downloadFiles = async ipfsHash => {
  return new Promise((resolve, reject) => {
    let abi = []
    ipfs.get(ipfsHash, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      try {
        files.forEach(file => {
          if (file.content) {
            abi.push({ data: JSON.parse(String(file.content)) })
          }
        })
      } catch (err) {
        reject(err)
        return
      }

      resolve(abi)
    })
  })
}

