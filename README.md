
## README


.ENV FILE

```dotenv
# Forked Eth in Hardhat
INFURA_API_KEY=5f7b012cb97c4a998c123f775bd9507f

# This key is publicly known
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

HARDHAT_RPC_URL=http://127.0.0.1:8545

# USE_DEFAULT_CHAIN_ID=true  # For 31337 (forked mainnet)
# or
USE_DEFAULT_CHAIN_ID=false # For 1337 (local development)

# Gas Reporting
GAS_REPORT=true

``` 

RUNNING DAPP

```bash
Instructions for the web server: 
1. NPM Instructions from the root directory in the screen called "screen -d -r BlockLock-Revoke": 
npm install -g serve
serve -s build

* We will get a new IP address that we can use for Nginx. We need to hard code one. 

2. Start the Hardhat node on the server in "screen -d -r BlockLock-Revoke":
npx hardhat public-node

3. It will expose RPC at the local transport layer `http://0.0.0.0:8545`.
Use Nginx as the web server to server: /etc/nginx/sites-enabled/revokedev.blocklock.ai
```

🔁 **Ensure MetaMask is connected to:**
```
Network Name: Hardhat Fork
RPC URL: http://127.0.0.1:8545
Chain ID: 1337
```

🪪 Import this funded account into MetaMask:
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

---
