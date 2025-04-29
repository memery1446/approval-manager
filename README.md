
## README

## 🐳 Running Approval Manager via Docker (Mainnet Forking Ready)

Elements to running the full-stack version:
- The React front-end served in a container.
- A locally forked Ethereum mainnet via Hardhat.
- Impersonation of token-rich accounts for demoing ERC-20 and ERC-1155 approvals.
- Easy MetaMask setup.

---

### ⚙️ 1. Requirements

- Docker (v20+)
- Node.js 18+ (only if running locally outside container)
- An **Infura** (or Alchemy) API key with mainnet access

---

### 🔐 2. Environment Variables

Before starting, create a `.env` file in the project root (or pass these as environment variables directly).

```dotenv
INFURA_API_KEY=your_infura_key_here
ALCHEMY_API_KEY=optional_alchemy_key
FORK_BLOCK_NUMBER=19700000          # Optional: Use a known stable block
USE_DEFAULT_CHAIN_ID=false
DEFAULT_CHAIN_ID=1337
``` 
Change ChainID by switching the boolean in hardhat.config.js

Make sure to **use the same `.env` file inside and outside Docker** if switching between local and container development.

---

### 🧱 3. Step-by-Step: Run the App with Docker

#### 📦 A. Build and Run the Frontend

```bash
docker build -t approval-manager .
docker run -d -p 3000:3000 --env-file .env approval-manager
```

#### Note: I start the front end with npm start, once cd'd into the project directory. Maybe Docker does this automatically...

Then open: [http://localhost:3000](http://localhost:3000)

#### ⚡ B. Fork Ethereum Mainnet with Hardhat

You can run this **outside Docker**, or create a second container later.

```bash
Docker Settings
npx hardhat node --fork https://mainnet.infura.io/v3/$INFURA_API_KEY
It will expose RPC at `http://127.0.0.1:8545`.
```

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

### 🛠️ 4. Approval Scripts (ERC-20, ERC-721, ERC-1155)

All approval scripts are in the `/scripts` directory and are designed to impersonate known token holder accounts on the forked chain.

Example:

```bash
npx hardhat run scripts/ERC20-approvals.js --network localhost

npx hardhat run scripts/ERC1155-approvals.js --network localhost
NFTs are currently auto approved and pushed. 
```

These will:
- Use impersonation to approve 9 token transfers
- Store on-chain approval data
- Automatically populate your front-end dashboard upon wallet connection or refresh

---

### 🧪 5. Troubleshooting

| Issue | Fix |
|------|------|
| `MetaMask shows wrong chain` | Ensure chain ID is **1337**, not 31337. This can be adjusted in the .env file boolean |
| `Frontend loads but no data` | Run approval scripts after node starts |
| `Cannot connect to RPC` | Ensure `localhost:8545` is accessible from Docker. Consider `host.docker.internal` on Mac if inside Docker |
| `Contracts not deployed?` | Run the deploy script in Hardhat again on the forked chain |

---

### 🧼 6. Cleanup

```bash
docker ps
docker stop <container_id>
```

Or stop the Hardhat node with `Ctrl + C`.

---

Let me know when you're ready and I’ll help walk through:
- Updating or rewriting the `Dockerfile` correctly
- Linking Docker and Hardhat node properly
- Testing everything for parity with your macOS setup

Want me to now tailor the Dockerfile itself?
