const glob = require('glob')
const fs = require('fs')

const globFromFiles = dir => {
  return new Promise((resolve, reject) => {
    console.log(__dirname)

    const jsonPath = dir + '/*.json'

    glob(jsonPath, function(er, files) {
      if (!files || files.length === 0) {
        return reject(
          new Error(`Path '${jsonPath}' does not include json files.`),
        )
      }
      const contractDatas = files.map(file => {
        // TODO use IPFS and be done with yucky relative paths
        // Starting server from parent directory so add the ".."
        return {
          contractName: file.contractName,
          data: require(`${file}`),
        }
      })
      // get the full paths of the file
      return resolve(contractDatas)
    })
  })
}
// get of list of files from 'dir' directory
const readLocalABI = dir => {
  return validatePath(dir).then(_ => {
    return globFromFiles(dir)
  })
}

const validatePath = dir => {
  return new Promise((resolve, reject) => {
    if (!dir) {
      reject(new Error('Path is undefined'))
    }
    fs.readdir(dir, (err, files) => {
      if (!files || files.length === 0) {
        console.log(`ABI folder '${dir}' is empty or does not exist.`)
        return reject(err)
      }
      return resolve(true)
    })
  })
}

module.exports = { readLocalABI }
