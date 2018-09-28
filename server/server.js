const express = require('express')
const readLocalABI = require('./ABIReader').readLocalABI
const downloadFiles = require('./RemoteReader').downloadFiles
const IPFSReader = require('./IPFSReader')
const remotePath = require('./RemoteReader').remotePath
const ConfigParser = require('./ConfigParser').ABIConfigParser
const app = express()
var cors = require('cors')
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

const loadLocalABI = (res, path) => {
  // console.log('LOADING PATH', path, __dirname)
  return readLocalABI(path)
    .then(files => {
      res.send({ abi: files })
    })
    .catch(err => {
      console.log(err)
      res.send({ abi: [] })
    })
}

app.get('/abi', (req, res, next) => {
  let config = new ConfigParser()
  const source = config.currentSource()
  const path = config.sourceValue(source)
  console.log('Returning ABI', source, path)

  switch (source) {
    case 'local': {
      return loadLocalABI(res, path)
    }
    case 'remote': {
      return downloadFiles(path)
        .then(() => {
          console.log(
            'Finished downloading, checking remote path',
            remotePath,
            __dirname,
          )
          return loadLocalABI(res, remotePath)
        })
        .catch(err => {
          console.log(err)
          res.send({ abi: [] })
        })
    }
    case 'ipfs': {
      return IPFSReader.downloadFiles(path)
        .then(files => res.send({ abi: files }))
        .catch(err => {
          console.log(err)
          res.send({ abi: [] })
        })
    }
  }

  console.log('Using ABI path', path)
})

app.get('/settings', (req, res, next) => {
  let config = new ConfigParser()
  let settings = config.settings()
  console.log('Returning Settings', settings)

  res.send({ settings: settings })
})

app.post('/settings', (req, res, next) => {
  let config = new ConfigParser()
  let settings = req.body.settings
  if (settings) {
    config.updateSettings(req.body.settings)
    res.send({ settings: req.body.settings })
  }
  console.log('Changing Settings To', req.body.settings)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
