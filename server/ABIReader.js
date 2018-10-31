const glob = require('glob')
const fs = require('fs')

const globFromFiles = dir => {
  return new Promise((resolve, reject) => {
    const jsonPath = dir + '/*.json'

    glob(jsonPath, function(er, files) {
      if (er) {
        return reject(er)
      }
      if (!files || files.length === 0) {
        return reject(
          new Error(`Path '${jsonPath}' does not include json files.`),
        )
      }
      const contractDatas = files.map(file => {
        return {
          contractName: file.contractName,
          data: JSON.parse(fs.readFileSync(file)),
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
      console.log('Add path in Dapper settings')
      reject(new Error('Path is undefined'))
    }
    fs.readdir(dir, (err, files) => {
      if (!files || files.length === 0) {
        console.log(
          `ABI folder '${dir}' is empty or does not exist. cwd: ${__dirname}`,
        )
        return reject(err)
      }
      return resolve(true)
    })
  })
}

module.exports = { readLocalABI }
