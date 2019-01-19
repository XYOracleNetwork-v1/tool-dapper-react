import { readSettings } from './CookieReader'
import { downloadFiles } from './IPFSReader'

export const fetchABI = async cookies => {
  let settings = readSettings(cookies)

  switch (settings.currentSource) {
    default: {
      return downloadFiles(cookies, settings.ipfs).then(files => {
        return { abi: files }
      })
    }
  }
}

export default fetchABI
