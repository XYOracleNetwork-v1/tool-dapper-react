
export const readSettings = cookies => {

  return {
    portisNetwork: cookies.get(`portisNetwork`) || `development`,
    currentSource: cookies.get(`currentSource`) || `ipfs`,
    local: cookies.get(`local`) || ``,
    remote: cookies.get(`remote`) || ``,
    ipfs: cookies.get(`ipfs`) || ``,
  }
}

