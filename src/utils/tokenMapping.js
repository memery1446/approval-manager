// utils/tokenMapping.js
import { CONTRACT_ADDRESSES } from "../constants/abis";

// Map of token addresses 
const TOKEN_TYPES = {
  // Using addresses from CONTRACT_ADDRESSES with real-world naming
  [CONTRACT_ADDRESSES.TK1?.toLowerCase()]: {
    name: "Ethereum",
    description: "ETH",
    logoUrl: "/assets/tokens/eth.png"
  },
  [CONTRACT_ADDRESSES.TK2?.toLowerCase()]: {
    name: "Bitcoin",
    description: "BTC",
    logoUrl: "/assets/tokens/btc.png"
  },
  [CONTRACT_ADDRESSES.PermitToken?.toLowerCase()]: {
    name: "Uniswap",
    description: "UNI",
    logoUrl: "/logos/uniswap-logo.png"
  },
  [CONTRACT_ADDRESSES.FeeToken?.toLowerCase()]: {
    name: "Chainlink",
    description: "LINK",
    logoUrl: "/assets/tokens/link.png"
  },
  
  // Common known tokens on mainnet
  "0x6b175474e89094c44da98b954eedeac495271d0f": {
    name: "Dai",
    description: "DAI",
    logoUrl: "/logos/dai-logo.svg"
  },
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    name: "USD Coin",
    description: "USDC",
    logoUrl: "/logos/usdc-logo.svg"
  },
  "0xdac17f958d2ee523a2206206994597c13d831ec7": {
    name: "Tether",
    description: "USDT",
    logoUrl: "/assets/tokens/usdt.png"
  },
    "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e": {
    name: "Floki",
    description: "FLOKI",
    logoUrl: "/logos/floki-logo.svg"
  },
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": {
    name: "Wrapped Bitcoin",
    description: "WBTC",
    logoUrl: "/assets/tokens/wbtc.png"
  },
"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": {
  name: "Uniswap",
  description: "UNI",
  logoUrl: "/logos/uniswap-logo.png"
},
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": {
    name: "Wrapped Ether",
    description: "WETH",
    logoUrl: "/assets/tokens/weth.png"
  }
};

// NFT collection mapping (includes both ERC721 and ERC1155)
const NFT_COLLECTIONS = {
  // ERC-721 Collections with realistic names
  [CONTRACT_ADDRESSES.TestNFT?.toLowerCase()]: {
    name: "Bored Ape Yacht Club",
    description: "BAYC",
    logoUrl: "/logos/boredApe-logo.jpeg"
  },
  [CONTRACT_ADDRESSES.UpgradeableNFT?.toLowerCase()]: {
    name: "Azuki",
    description: "AZUKI",
    logoUrl: "/logos/azuki-logo.jpeg"
  },
  [CONTRACT_ADDRESSES.DynamicNFT?.toLowerCase()]: {
    name: "Doodles",
    description: "DOODLE",
    logoUrl: "/logos/doodles-logo.avif"
  },
  
  // ERC-1155 Collections with realistic names
  [CONTRACT_ADDRESSES.TestERC1155?.toLowerCase()]: {
    name: "Gods Unchained",
    description: "GODS",
    logoUrl: "/assets/nfts/gods.png"
  },
  [CONTRACT_ADDRESSES.UpgradeableERC1155?.toLowerCase()]: {
    name: "Sandbox",
    description: "SAND",
    logoUrl: "/logos/sandbox-logo.svg"
  },
  
  // Known NFT collections
  "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d": {
    name: "Bored Ape Yacht Club",
    description: "BAYC",
    logoUrl: "/assets/nfts/bayc.png"
  },
  "0x495f947276749ce646f68ac8c248420045cb7b5e": {
    name: "OpenSea Collections",
    description: "Various NFTs",
    logoUrl: "/logos/opensea-logo.svg"
  }
};

// Default logo paths
const DEFAULT_TOKEN_LOGO = "/assets/tokens/default-token.png";
const DEFAULT_NFT_LOGO = "/assets/nfts/default-nft.png";

/**
 * Get enhanced token information based on the contract address
 * @param {string} address - The token contract address
 * @returns {Object|null} - Token information or null if not found
 */
export const getTokenInfo = (address) => {
  if (!address) return null;
  
  // Normalize the address 
  const normalizedAddress = address.toLowerCase();
  
  // Return the token info or null
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
  if (!approval || !approval.contract) {
    // Default display for missing approval data
    return {
      name: "Unknown",
      description: "Unknown asset",
      logoUrl: DEFAULT_TOKEN_LOGO
    };
  }
  
  // Normalize the contract address
  const normalizedContract = approval.contract.toLowerCase();
  
  // For ERC-20 tokens
  if (approval.type === "ERC-20") {
    const tokenInfo = getTokenInfo(normalizedContract);
    if (tokenInfo) {
      return tokenInfo;
    }
    return {
      name: approval.asset || "Unknown Token",
      description: `${normalizedContract.substring(0, 6)}...`,
      logoUrl: DEFAULT_TOKEN_LOGO
    };
  } 
  // For ERC-721 and ERC-1155 tokens (both are NFT collections)
  else if (approval.type === "ERC-721" || approval.type === "ERC-1155") {
    const collectionInfo = getNFTCollectionInfo(normalizedContract);
    if (collectionInfo) {
      return collectionInfo;
    }
    
    // Generic NFT collection info if not found in our mapping
    return {
      name: approval.asset || "Unknown Collection",
      description: `${normalizedContract.substring(0, 6)}...`,
      logoUrl: DEFAULT_NFT_LOGO
    };
  }
  
  // Fallback for unknown types
  return {
    name: approval.asset || "Unknown Asset",
    description: approval.type || "Unknown type",
    logoUrl: DEFAULT_TOKEN_LOGO
  };
};

export const getLogoUrl = (address, type) => {
  if (!address) {
    return DEFAULT_TOKEN_LOGO;
  }
  
  const normalizedAddress = address.toLowerCase();
  
  // Try to get from our static mappings first
if (type === "ERC-20") {
  const tokenInfo = TOKEN_TYPES[normalizedAddress];
  if (tokenInfo?.logoUrl) return tokenInfo.logoUrl;
  
  // New: Try to get from CDN if not in our mapping
  return getDynamicTokenLogo(address);
} 
else if (type === "ERC-721" || type === "ERC-1155") {
  const nftInfo = NFT_COLLECTIONS[normalizedAddress];
  return nftInfo?.logoUrl || DEFAULT_NFT_LOGO;
}
  
return DEFAULT_TOKEN_LOGO;
};

/**
 * Get dynamic token logo URL from reliable CDN services
 * @param {string} address - The token contract address
 * @returns {string} - URL to the token logo
 */
// Add this function to your tokenMapping.js file (before the existing getLogoUrl function)
function getDynamicTokenLogo(address) {
  if (!address) return DEFAULT_TOKEN_LOGO;
  
  // Convert to lowercase for consistency
  const normalizedAddress = address.toLowerCase();
  
  // Special cases for common tokens we care about
  const specialCases = {
    // USDC
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    // UNI (for Permit token) 
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": "https://cryptologos.cc/logos/uniswap-uni-logo.png",
    // FLOKI (for Fee token)
    "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e": "https://cryptologos.cc/logos/floki-inu-floki-logo.png"
  };
  
  if (specialCases[normalizedAddress]) {
    return specialCases[normalizedAddress];
  }
  
  // For other tokens, use 1inch CDN
  return `https://tokens.1inch.io/${normalizedAddress}.png`;
}

export default {
  getTokenInfo,
  getNFTCollectionInfo,
  getAssetDisplayInfo,
  getLogoUrl,
  TOKEN_TYPES,
  NFT_COLLECTIONS
};
