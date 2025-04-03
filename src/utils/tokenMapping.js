// utils/tokenMapping.js
import { CONTRACT_ADDRESSES } from "../constants/abis";

// Map of token addresses to their descriptive names and types
const TOKEN_TYPES = {
  // Using addresses from your CONTRACT_ADDRESSES
  [CONTRACT_ADDRESSES.TK1?.toLowerCase()]: {
    name: "Standard Token",
    description: "Basic ERC20 implementation"
  },
  [CONTRACT_ADDRESSES.TK2?.toLowerCase()]: {
    name: "Secondary Token",
    description: "Alternative ERC20 for testing"
  },
  [CONTRACT_ADDRESSES.PermitToken?.toLowerCase()]: {
    name: "Permit Token",
    description: "ERC20 with EIP-2612 permit"
  },
  [CONTRACT_ADDRESSES.FeeToken?.toLowerCase()]: {
    name: "Fee Token",
    description: "ERC20 with transfer fees"
  },
  
  // Common known tokens on mainnet (for demo purposes)
  "0x6b175474e89094c44da98b954eedeac495271d0f": {
    name: "DAI",
    description: "Stablecoin"
  },
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    name: "USDC",
    description: "Stablecoin"
  },
  "0xdac17f958d2ee523a2206206994597c13d831ec7": {
    name: "USDT",
    description: "Stablecoin"
  },
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": {
    name: "WBTC",
    description: "Wrapped Bitcoin"
  },
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": {
    name: "WETH",
    description: "Wrapped Ether"
  }
};

// NFT collection mapping for better display of ERC721/ERC1155 tokens
const NFT_COLLECTIONS = {
  [CONTRACT_ADDRESSES.TestNFT?.toLowerCase()]: {
    name: "Test NFT",
    description: "Standard ERC721"
  },
  [CONTRACT_ADDRESSES.UpgradeableNFT?.toLowerCase()]: {
    name: "Upgradeable NFT",
    description: "Upgradeable ERC721"
  },
  [CONTRACT_ADDRESSES.DynamicNFT?.toLowerCase()]: {
    name: "Dynamic NFT",
    description: "Dynamic metadata ERC721"
  },
  [CONTRACT_ADDRESSES.TestERC1155?.toLowerCase()]: {
    name: "Multi-Token",
    description: "Standard ERC1155"
  },
  [CONTRACT_ADDRESSES.UpgradeableERC1155?.toLowerCase()]: {
    name: "Upgradeable Multi-Token",
    description: "Upgradeable ERC1155"
  },
  
  // Known NFT collections
  "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d": {
    name: "BAYC",
    description: "Bored Ape Yacht Club"
  },
  "0x495f947276749ce646f68ac8c248420045cb7b5e": {
    name: "OpenSea Shared",
    description: "OpenSea Shared Storefront"
  }
};

/**
 * Get enhanced token information based on the contract address
 * @param {string} address - The token contract address
 * @returns {Object|null} - Token information or null if not found
 */
export const getTokenInfo = (address) => {
  if (!address) return null;
  
  // Normalize the address to lowercase for comparison
  const normalizedAddress = address.toLowerCase();
  
  // Return the token info if found, or null if not
  return TOKEN_TYPES[normalizedAddress] || null;
};

/**
 * Get enhanced NFT collection information based on the contract address
 * @param {string} address - The NFT contract address
 * @returns {Object|null} - Collection information or null if not found
 */
export const getNFTCollectionInfo = (address) => {
  if (!address) return null;
  
  // Normalize the address to lowercase for comparison
  const normalizedAddress = address.toLowerCase();
  
  // Return the collection info if found, or null if not
  return NFT_COLLECTIONS[normalizedAddress] || null;
};

/**
 * Get appropriate asset display info based on token type (ERC20, ERC721, ERC1155)
 * @param {Object} approval - The approval object containing contract and type
 * @returns {Object} - Asset display information
 */
export const getAssetDisplayInfo = (approval) => {
  // Default display with what we already have
  const defaultDisplay = {
    name: approval.asset || approval.contract?.substring(0, 8),
    description: approval.type || "Unknown"
  };
  
  if (!approval || !approval.contract) return defaultDisplay;
  
  // For ERC-20 tokens
  if (approval.type === "ERC-20") {
    const tokenInfo = getTokenInfo(approval.contract);
    if (tokenInfo) {
      return tokenInfo;
    }
  } 
  // For ERC-721 and ERC-1155 tokens
  else if (approval.type === "ERC-721" || approval.type === "ERC-1155") {
    const collectionInfo = getNFTCollectionInfo(approval.contract);
    if (collectionInfo) {
      return collectionInfo;
    }
  }
  
  // Return the default if no mapping found
  return defaultDisplay;
};

export default {
  getTokenInfo,
  getNFTCollectionInfo,
  getAssetDisplayInfo,
  TOKEN_TYPES,
  NFT_COLLECTIONS
};

