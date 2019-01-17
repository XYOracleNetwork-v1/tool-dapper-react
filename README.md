<h1 align="center">
  <img alt="Dapploy" src="https://ipfs.xyo.network/ipfs/QmYoV7gMcDeTEMrdGnKAs2VYL3E1ckRC3aNL5pdT7PazZL" width="300" backgroundColor="black">
</h1>

<p align="center">
  <a href="https://circleci.com/gh/XYOracleNetwork/tool-dapper-nodejs">
    <img alt="Circle Status" src="https://circleci.com/gh/XYOracleNetwork/tool-dapper-react.svg?style=shield&circle-token=1b563e086dc010649989a743f6fb89a3cd5bf93a">
  </a>
  <a href="https://gitter.im/XYOracleNetwork/Dev">
    <img alt="Gitter Chat" src="https://img.shields.io/gitter/room/XYOracleNetwork/Stardust.svg">
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img alt="Commitizen friendly" src="https://img.shields.io/badge/web3-friendly-brightgreen.svg">
    </a>
    <a href="https://david-dm.org/xyoraclenetwork/tool-dapper-react" title="dependencies status"><img src="https://david-dm.org/xyoraclenetwork/tool-dapper-react/status.svg"/></a>
  <a href="https://david-dm.org/xyoraclenetwork/tool-dapper-react?type=dev" title="devDependencies status"><img src="https://david-dm.org/xyoraclenetwork/tool-dapper-react/dev-status.svg"/></a>
    <a href="https://greenkeeper.io/" title="devDependencies status"><img src="https://badges.greenkeeper.io/XYOracleNetwork/tool-dapper-react.svg"/></a>
</p>

<h3 align="center">
  "Simulate your Smart Contracts"
</h3>
<p align="center">Made with  ❤️  by <b><a href="https://xy.company">XY - The Persistent Company</a></b></p>

Check out Dapper at https://dapper.layerone.co to start playing with your smart contracts.  

# Pt. I. - Let's Get Dapper


1. When in doubt, `yarn` it out in the project directory:
```
yarn
```

2. Run dapper
```
yarn start
```

# Pt. II - Dapploy Some Contracts locally

We need to deploy some smart contracts

1. Use [Dapploy](https://github.com/XYOracleNetwork/tool-dappdeployer-node) and create your first standalone smart contact project:
```
./dapploy init
./dapploy
``` 

**or** Use [Truffle](https://truffleframework.com) to deploy your smart contracts to any Ethereum blockchain, and note the folder of your ABI, usually in `<truffle_project>/build/contracts`

# Pt. III - View Local Contracts

1. If you don't already have it, [download and install Ganache from their site](https://truffleframework.com/ganache)

2. Same with [MetaMask from their site](https://metamask.io/)

3. Configure Ganache on 8545:
 - Open Ganache
 - Click the Gear Icon thingy ( ⚙️ ) to open `Preferences...`.	
   Make sure that port is set to 8545.	
 - Click "Save and Restart" in the top-right of Ganache	
 
4. Configure Metamask network to `localhost`
 - Sign into Metamask and change Network on Metamask to localhost 8545		
 
5. Add ganache account to metamask
 - In your Ganache UI, you'll see a list of ~10 addresses. Click the key icon (🔑) next to one of 'em. And then COPY the "Private Key"		
 
6. Start dapper. This should open up `localhost:3000` in a chrome browser.
```
yarn start
```

You should see the Dapper UI with no smart contracts loaded.


# Pt. III. - Play with your Smart Contracts

1. In Dapper UI, go to the settings cog and select `Local Path` and enter `<truffle_project>/build/contracts` (Priject dir from Pt. II)

3. Tap `Save` and you should be able to see the FungibleToken in the dropdown and play with it!

4. Select `name()` function and you should see the name, "Fun Token" displayed.

<img src="https://ipfs.xyo.network/ipfs/QmeHnp8ZZS9tdM8aCbGC9xHhmW8CGDem8PiELvdNZxpfY9" />
