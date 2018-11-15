const glob = require(`glob`)
const downloadFiles = require(`./RemoteReader`).downloadFiles
const IPFSReader = require(`./IPFSReader`)
const remotePath = require(`./RemoteReader`).remotePath

const loadLocalABI = (path) => {
  // console.log('LOADING PATH', path, __dirname)
  return readLocalABI(path)
    .then(async files => {
      return { abi: files }
    })
    .catch(err => {
      throw err
    })
}

export const fetchABI = async cookies => {
  let settings = {
    portisNetwork: cookies.get(`portisNetwork`) || `development`,
    currentSource: cookies.get(`currentSource`) || `local`,
    local: cookies.get(`local`) || ``,
    remote: cookies.get(`remote`) || ``,
    ipfs: cookies.get(`ipfs`) || ``,
  }

  switch (settings.currentSource) {
    case `local`: {
      return loadLocalABI(settings.local)
    }
    case `remote`: {
      return downloadFiles(settings.remote)
        .then(() => {
          console.log(
            `Finished downloading, checking remote path`,
            remotePath,
            __dirname,
          )
          return loadLocalABI(settings.remote)
        })
        .catch(err => {
          console.log(err)
          throw err
        })
    }
    case `ipfs`: {
      return IPFSReader.downloadFiles(settings.ipfs)
        .then(files => {
          return { abi: files }
        })
        .catch(err => {
          throw err
        })
    }
  }
}

const globFromFiles = dir => {
  return new Promise((resolve, reject) => {
    const jsonPath = dir + `/*.json`

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
          // data: JSON.parse(fs.readFileSync(file)),
        }
      })
      // get the full paths of the file
      return resolve(contractDatas)
    })
  })
}
// get of list of files from 'dir' directory
const readLocalABI = dir => {
  return globFromFiles(dir)
}

export default fetchABI
