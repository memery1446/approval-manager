require("@nomicfoundation/hardhat-ethers");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-verify");

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const CMC_API_KEY = process.env.CMC_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Chain ID configuration
const USE_DEFAULT_CHAIN_ID = process.env.USE_DEFAULT_CHAIN_ID === "true";
const DEFAULT_CHAIN_ID = USE_DEFAULT_CHAIN_ID ? 31337 : 1337;

// Add this task to force 0.0.0.0 binding
task("public-node", "Runs a Hardhat node that listens on all interfaces", async () => {
  const { spawn } = require("child_process");
  
  // Start Hardhat on a different port first
  const node = spawn("npx", ["hardhat", "node", "--port", "8546"]);
  
  node.stdout.on("data", (data) => {
    console.log(data.toString());
    // When we see the node is ready, start our proxy
    if (data.toString().includes("Started HTTP")) {
      const http = require("http");
      const server = http.createServer((req, res) => {
        const proxy = http.request({
          host: "localhost",
          port: 8546,  // Proxy to the alternate port
          path: req.url,
          method: req.method,
          headers: req.headers
        }, (pres) => {
          res.writeHead(pres.statusCode, pres.headers);
          pres.pipe(res);
        });
        req.pipe(proxy);
      });
      server.listen(8545, "0.0.0.0", () => {
        console.log(`\nPublic proxy running at http://0.0.0.0:8545`);
        console.log(`Accessible externally at http://209.216.78.221:8545`);
      });
    }
  });
  
  node.stderr.on("data", (data) => console.error(data.toString()));
  node.on("close", (code) => console.log(`Node process exited with code ${code}`));
  
  // Keep process running
  await new Promise(() => {});
});

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      explorerUrl: "https://sepolia.etherscan.io/"
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 1,
      explorerUrl: "https://etherscan.io/"
    },
    hardhat: {
      chainId: DEFAULT_CHAIN_ID,
      allowUnlimitedContractSize: true,
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        blockNumber: 18000000,
        enabled: true
      }
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 50,
    coinmarketcap: CMC_API_KEY
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
