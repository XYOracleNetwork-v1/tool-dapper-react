const ipfsAPI = require('ipfs-api')

const ipfs = new ipfsAPI({
  host: 'ipfs.xyo.network',
  port: 5002,
  protocol: 'https',
})

const downloadFiles = ipfsHash => {
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

module.exports = { downloadFiles }
