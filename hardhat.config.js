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
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        blockNumber: 18000000,
        enabled: true
      },
      chainId: DEFAULT_CHAIN_ID, // Dynamic chain ID
      allowUnlimitedContractSize: true
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: DEFAULT_CHAIN_ID // Match the same dynamic ID
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
