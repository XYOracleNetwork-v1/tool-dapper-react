const ConfigParser = require(`configparser`)
const fs = require(`fs`)
const untildify = require(`untildify`)

const initConfig = (config, configFile) => {
  if (fs.existsSync(configFile)) {
    throw new Error(
      `A config file was found at: ${configFile}. Stopping to prevent overwriting data.`,
    )
  }
  console.log(` $ Creating config file at ${configFile}`)
  // Adding sections and adding keys
  config.addSection(`ABISource`)
  config.set(`ABISource`, `local`, `./ABI`)
  config.set(`ABISource`, `currentSource`, `local`)

  config.write(configFile)
}

class ABIConfigParser {
  constructor() {
    this.configFile = `./.abiserver`

    this.config = new ConfigParser()

    this.parseConfig()
  }
  update(section, prop, value) {
    console.log('Updating', section, prop, value)
    this.config.set(section, prop, value)
    this.config.write(this.configFile)
  }
  updateSettings(settings) {
    let settingsArray = Object.entries(settings)
    console.log('Settings Array', settingsArray)
    settingsArray.forEach(([index, value]) => {
      console.log('Here', index, value)
      this.update('ABISource', index, value)
    })
  }
  parseConfig() {
    console.log(` $ Parsing config`, this.configFile)
    try {
      this.config.read(this.configFile)
    } catch (err) {
      console.log(`Invalid or missing config`)
      initConfig(this.config, this.configFile)
      this.config.read(this.configFile)
    }
  }
  currentSource() {
    return this.config.get(`ABISource`, `currentSource`)
  }
  sourceValue(source) {
    return untildify(this.config.get(`ABISource`, source))
  }
  settings() {
    return {
      currentSource: this.config.get(`ABISource`, `currentSource`),
      local: this.config.get(`ABISource`, `local`),
      ipfs: this.config.get(`ABISource`, `ipfs`),
      remote: this.config.get(`ABISource`, `remote`),
      network: this.config.get(`ABISource`, `network`),
    }
  }
}

module.exports = { ABIConfigParser }
