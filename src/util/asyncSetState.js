export default (setState, state) =>
  new Promise((resolve, reject) => {
    try {
      setState(state, resolve)
    } catch (err) {
      reject(err)
    }
  })
