<h1 align="center">
  <img alt="Dapploy" src="https://ipfs.xyo.network/ipfs/QmYoV7gMcDeTEMrdGnKAs2VYL3E1ckRC3aNL5pdT7PazZL" width="300" backgroundColor="black">
</h1>
<h3 align="center">
  "Simulate your Smart Contracts"
</h3>

[logo]: https://cdn.xy.company/img/brand/XY_Logo_GitHub.png

[![logo]](https://xy.company)

---

[![NPM](https://nodei.co/npm/@xyo-network/tool-dapper-react.png)](https://nodei.co/npm/@xyo-network/tool-dapper-react/) 

[![Build Status](https://travis-ci.com/XYOracleNetwork/tool-dapper-react.svg?branch=develop)](https://travis-ci.com/XYOracleNetwork/tool-dapper-react) [![DepShield Badge](https://depshield.sonatype.org/badges/XYOracleNetwork/tool-dapper-react/depshield.svg)](https://depshield.github.io)

[![David Badge](https://david-dm.org/xyoraclenetwork/tool-dapper-react/status.svg)](https://david-dm.org/xyoraclenetwork/tool-dapper-react) [![David Badge](https://david-dm.org/xyoraclenetwork/tool-dapper-react/dev-status.svg)](https://david-dm.org/xyoraclenetwork/tool-dapper-react) 
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=XYOracleNetwork_tool-dapper-react&metric=alert_status)](https://sonarcloud.io/dashboard?id=XYOracleNetwork_tool-dapper-react) 

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3a9e6699e32345b983e0233aeb9e73d1)](https://www.codacy.com/app/pllearns/tool-dapper-react?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=XYOracleNetwork/tool-dapper-react&amp;utm_campaign=Badge_Grade)[![BCH compliance](https://bettercodehub.com/edge/badge/XYOracleNetwork/tool-dapper-react?branch=master)](https://bettercodehub.com/results/XYOracleNetwork/tool-dapper-react)

<p align="left">
  <a href="https://gitter.im/XYOracleNetwork/Dev">
    <img alt="Gitter Chat" src="https://img.shields.io/gitter/room/XYOracleNetwork/Stardust.svg">
  </a>
</p>

Check out Dapper, live at https://dapper.layerone.co to start playing with your smart contracts.

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
./dapploy -P
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

2. Tap `Save` and you should be able to see the FungibleToken in the dropdown and play with it!

3. Select `name()` function and you should see the name, "Fun Token" displayed.

<img src="https://ipfs.xyo.network/ipfs/QmcyJh9suzmMjiaumeTFRMRV4rzhffNPSkcRharvg6eYPn" />
