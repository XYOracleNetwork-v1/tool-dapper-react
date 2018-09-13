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
  config.set(`ABISource`, `activeSource`, `local`)

  config.write(configFile)
}

class ABIConfigParser {
  constructor() {
    this.configFile = `./.abiserver`

    this.config = new ConfigParser()

    this.parseConfig()
  }
  update(section, prop, value) {
    this.config.set(section, prop, value)
    this.config.write(configFile)
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
    return this.config.get(`ABISource`, `activeSource`)
  }
  sourceValue(source) {
    return untildify(this.config.get(`ABISource`, source))
  }
}

module.exports = { ABIConfigParser }
