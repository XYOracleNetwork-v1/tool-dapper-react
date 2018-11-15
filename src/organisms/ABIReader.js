import { readSettings} from '../atoms/CookieReader'
const downloadFiles = require(`./RemoteReader`).downloadFiles
const IPFSReader = require(`./IPFSReader`)
const remotePath = require(`./RemoteReader`).remotePath


export const fetchABI = async cookies => {
  let settings = readSettings(cookies)

  switch (settings.currentSource) {
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

export default fetchABI
