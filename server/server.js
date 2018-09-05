const express = require('express')
const ABI = require('./ABIReader').ABI
const validatePath = require('./ABIReader').validatePath
const app = express()
var cors = require('cors')
const port = process.env.PORT || 5000
app.use(cors())
let abiPathArg = process.argv[2]

app.get('/abi', (req, res, next) => {
  console.log('Using ABI path', abiPathArg)

  ABI(abiPathArg)
    .then(files => {
      res.send({ abi: files })
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})

validatePath(abiPathArg)
  .then(_ => {
    app.listen(port, () => console.log(`Listening on port ${port}`))
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
