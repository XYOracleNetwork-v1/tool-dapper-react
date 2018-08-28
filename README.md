# Dapper

View your smart contracts in an auto-generated

- When in doubt, `yarn` it out:
  Run `yarn`

- Use [Dapploy](https://github.com/XYOracleNetwork/tool-dappdeployer-node) to deploy smart contracts and deploy the ABI to the chain and to this project.

You'll can simply modify Dapploy's `deployer.conf` to point to this project's directory:

```
contractOutput={dapper-project-dir}/src/ABI
...
web3ModuleOutput={dapper-project-dir}/src/web3.js
```

- This project expects Dapploy's generated web3.js interface to load and expose the contracts. You can recreate this, but it's best to use this tool with Dapploy.

- Run `yarn start` to start the client

- Go to `localhost:3000` in a chrome browser if you are running your client locally with metamask.
