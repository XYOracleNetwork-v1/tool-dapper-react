var s3 = require('s3')

const remotePath = '/tmp/ABI/remote'
const downloadFiles = bucketName => {
  var client = s3.createClient()

  const params = {
    Bucket: bucketName,
    Prefix: 'ABI/development',
  }
  let downloader = client.downloadDir({
    localDir: remotePath,
    s3Params: params,
  })

  return new Promise((resolve, reject) => {
    downloader.on('end', function(stuff) {
      console.log('done downloading', stuff)
      resolve()
    })
  })
}

module.exports = { downloadFiles, remotePath }
