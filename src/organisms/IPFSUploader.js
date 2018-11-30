const IPFS = require(`ipfs-api`)

const ipfs = new IPFS({
  host: `ipfs.xyo.network`,
  port: 5002,
  protocol: `https`,
})
// const ipfs = new IPFS(`ipfs.infura.io`, 5001, {
//   protocol: `https`,
// })
// const ipfs = new IPFS(`localhost`, 5001, {
//   protocol: `http`,
// })
const folder = `contracts`

const uploadIPFS = data =>
  new Promise((resolve, reject) =>
    ipfs.add(
      data,
      { recursive: false, wrapWithDirectory: true, pin: true },
      (err, res) => {
        console.log(`DATA`, data)

        if (err) {
          console.log(`Got IPFS error:`, err)
          reject(err)
        } else {
          res.forEach(fileObj => {
            console.log(` $ Storing contract`, fileObj.path)

            if (fileObj.path === folder || fileObj.path === ``) {
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

export default uploadIPFS
