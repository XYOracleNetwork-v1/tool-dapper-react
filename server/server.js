const express = require('express')
const readLocalABI = require('./ABIReader').readLocalABI
const ConfigParser = require('./ConfigParser').ABIConfigParser
const app = express()
var cors = require('cors')
const port = process.env.PORT || 5000
app.use(cors())

app.get('/abi', (req, res, next) => {
  let config = new ConfigParser()
  const source = config.currentSource()
  const path = config.sourceValue(source)

  switch (source) {
    case 'local': {
      readLocalABI(path)
        .then(files => {
          res.send({ abi: files })
        })
        .catch(err => {
          console.log(err)
          next(err)
        })
    }
  }

  console.log('Using ABI path', path)
})

app.post('/abi/update', (req, res) => {
  let config = new ConfigParser()
  console.log(req)
  // config.update()
})

app.listen(port, () => console.log(`Listening on port ${port}`))
