import { readSettings} from '../atoms/CookieReader'
const IPFSReader = require(`./IPFSReader`)


export const fetchABI = async cookies => {
  let settings = readSettings(cookies)

  switch (settings.currentSource) {
    default: {
      return IPFSReader.downloadFiles(cookies, settings.ipfs)
        .then(files => {
          return { abi: files }
        })
    }
  }
}

export default fetchABI
