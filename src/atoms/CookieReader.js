
export const readSettings = cookies => {
  if (!cookies.get(`portisNetwork`)) {
    cookies.set(`portisNetwork`, `mainnet`, {
      path: `/`,
    })
  }
  return {
    portisNetwork: cookies.get(`portisNetwork`),
    currentSource: cookies.get(`currentSource`) || `ipfs`,
    local: cookies.get(`local`) || ``,
    remote: cookies.get(`remote`) || ``,
    ipfs: cookies.get(`ipfs`) || ``,
  }
}

