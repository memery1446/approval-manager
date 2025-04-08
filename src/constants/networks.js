// src/constants/networks.js
import { CONTRACT_ADDRESSES } from './abis';  // Reuse your existing address configuration

// Get the dynamic chain ID matching hardhat.config.js
const USE_DEFAULT_CHAIN_ID = process.env.USE_DEFAULT_CHAIN_ID === "true";
const LOCAL_CHAIN_ID = USE_DEFAULT_CHAIN_ID ? 31337 : 1337;

// Create the network config object
const networkConfig = {
    // Dynamically use the correct local chain ID
    [LOCAL_CHAIN_ID]: {
        name: "Hardhat",
        rpcUrl: process.env.HARDHAT_RPC_URL || "http://127.0.0.1:8545",
        contracts: {
            tokenManager: CONTRACT_ADDRESSES.TK1,
            secondToken: CONTRACT_ADDRESSES.TK2,
            erc721: [
                CONTRACT_ADDRESSES.TestNFT,
                CONTRACT_ADDRESSES.UpgradeableNFT,
                CONTRACT_ADDRESSES.DynamicNFT
            ],
            erc1155: [
                CONTRACT_ADDRESSES.TestERC1155,
                CONTRACT_ADDRESSES.UpgradeableERC1155
            ],
            MockSpender: CONTRACT_ADDRESSES.MockSpender,
            BridgeSpender: CONTRACT_ADDRESSES.BridgeSpender,
            DexSpender: CONTRACT_ADDRESSES.DexSpender,
            LendingSpender: CONTRACT_ADDRESSES.LendingSpender,
            MiscSpender: CONTRACT_ADDRESSES.MiscSpender,
            NftMarketplaceSpender: CONTRACT_ADDRESSES.NftMarketplaceSpender,
            PermitToken: CONTRACT_ADDRESSES.PermitToken,
            FeeToken: CONTRACT_ADDRESSES.FeeToken
        }
    },
    1: {
        name: "Ethereum Mainnet",
        rpcUrl: process.env.ETH_MAINNET_RPC || "https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY",
        contracts: {
            tokenManager: process.env.ETH_TOKEN_MANAGER || "0xYourEthereumTokenManager",
            erc721: process.env.ETH_ERC721 || "0xYourEthereumERC721",
            erc1155: process.env.ETH_ERC1155 || "0xYourEthereumERC1155"
        }
    },
    56: {
        name: "Binance Smart Chain",
        rpcUrl: process.env.BSC_RPC || "https://bsc-dataseed.binance.org/",
        contracts: {
            tokenManager: process.env.BSC_TOKEN_MANAGER || "0xYourBSCManager",
            erc721: process.env.BSC_ERC721 || "0xYourBSCERC721",
            erc1155: process.env.BSC_ERC1155 || "0xYourBSCERC1155"
        }
    },
    137: {
        name: "Polygon",
        rpcUrl: process.env.POLYGON_RPC || "https://polygon-rpc.com/",
        contracts: {
            tokenManager: process.env.POLYGON_TOKEN_MANAGER || "0xYourPolygonTokenManager",
            erc721: process.env.POLYGON_ERC721 || "0xYourPolygonERC721",
            erc1155: process.env.POLYGON_ERC1155 || "0xYourPolygonERC1155"
        }
    }
};

export const NETWORK_CONFIG = networkConfig;

// Export the current local chain ID for use in other files
export const CURRENT_CHAIN_ID = LOCAL_CHAIN_ID;

/**
 * @typedef {Object} NetworkConfig
 * @property {string} name - Human-readable network name
 * @property {string} rpcUrl - Network RPC endpoint
 * @property {Object} contracts - Contract addresses configuration
 * 
 * @typedef {Object} ContractAddresses
 * @property {string} tokenManager
 * @property {string} secondToken
 * @property {string[]} erc721
 * @property {string[]} erc1155
 * @property {string} MockSpender
 * @property {string} BridgeSpender
 * @property {string} DexSpender
 * @property {string} LendingSpender
 * @property {string} MiscSpender
 * @property {string} NftMarketplaceSpender
 * @property {string} PermitToken
 * @property {string} FeeToken
 */

