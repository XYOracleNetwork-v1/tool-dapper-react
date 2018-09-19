var s3 = require('s3')

const remotePath = '/tmp/ABI/remote'
const downloadFiles = bucketName => {
  const client = s3.createClient()

  const params = {
    Bucket: bucketName,
    Prefix: 'ABI/development',
  }
  const downloader = client.downloadDir({
    localDir: remotePath,
    s3Params: params,
  })

  return new Promise((resolve, reject) => {
    downloader.on('end', function() {
      console.log('done downloading')
      resolve()
    })
    downloader.on(`error`, err => {
      return reject(err)
    })
  })
}

module.exports = { downloadFiles, remotePath }
