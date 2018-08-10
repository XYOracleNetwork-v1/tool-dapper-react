#ABI Explorer

* When in doubt, `yarn` it out:
Run `yarn`

* Use [Dapp Deployer](https://github.com/XYOracleNetwork/tool-dappdeployer-node) to deploy smart contracts and deploy the ABI to the chain and to this project.  

You'll can simply modify Dapp Deployer's `deployer.conf` to point to this project's directory:
```
contractOutput={ABI-Explorer-Project-dir}/src/ABI
...
web3ModuleOutput={ABI-Explorer-Project-dir}/src/web3.js
```

* Run `yarn start` to start the client

* Go to `localhost:3000` in a chrome browser if you are running your client locally with metamask.