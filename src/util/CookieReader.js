import Cookies from 'js-cookie'

export const readSettings = () => {
  if (!Cookies.get(`portisNetwork`)) {
    Cookies.set(`portisNetwork`, `mainnet`, {
      path: `/`,
    })
  }
  return {
    portisNetwork: Cookies.get(`portisNetwork`),
    currentSource: Cookies.get(`currentSource`) || `ipfs`,
    local: Cookies.get(`local`) || ``,
    remote: Cookies.get(`remote`) || ``,
    ipfs: Cookies.get(`ipfs`) || ``,
  }
}
