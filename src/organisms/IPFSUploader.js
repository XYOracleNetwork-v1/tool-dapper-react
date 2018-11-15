const IPFS = require(`ipfs-api`)

// const ipfs = new IPFS({
//   host: `ipfs.xyo.network`,
//   port: 5002,
//   protocol: `https`,
// })
const ipfs = new IPFS(
  `ipfs.infura.io`,
  5001, {
  protocol: `https`,
})
// const ipfs = new IPFS(`localhost`, 5001, {
//   protocol: `http`,
// })
const folder = `contracts`

const pinToIPFS = hash =>
  new Promise((resolve, reject) => {
    ipfs.pin.add(hash, (err, res) => {
      if (err) {
        reject(err)
      } else {
        console.log(` $ Contracts pinned on IPFS`)
        resolve(res)
      }
    })
  })

const addToIPFS = data =>
  new Promise((resolve, reject) =>
    ipfs.add(
      data,
      { recursive: false, wrapWithDirectory: true, pin: true },
      (err, res) => {
        if (err) {
          console.log(`Got IPFS error:`, err)
          reject(err)
        } else {
          res.forEach(fileObj => {
            console.log(` $ Storing contract`, fileObj.path)

            if (fileObj.path === folder || fileObj.path == ``) {
              console.log(` $ Contracts stored to IPFS`, fileObj.hash)
              console.log(
                ` $ View contracts at https://ipfs.xyo.network/ipfs/${
                  fileObj.hash
                }`,
              )
              resolve(fileObj.hash)
            }
          })
          reject(
            new Error(
              `No folder returned saving the IPFS file, this shouldn't happen`,
            ),
          )
        }
      },
    ),
  )

const uploadIPFS = data => {
  // abiFilePaths(program)
  // .then((files) => {
  //   const data = []
  //   files.forEach((filePath) => {
  //     const content = fs.readFileSync(filePath)
  //     const ipfsPath = `${folder}/${path.basename(filePath)}`
  //     data.push({ path: ipfsPath, content })
  //   })
  //   return data
  // })
  return addToIPFS(data)
    .catch(err => {
      console.log(err)
    })
}
export default uploadIPFS
