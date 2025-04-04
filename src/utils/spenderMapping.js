// utils/spenderMapping.js
import { CONTRACT_ADDRESSES } from "../constants/abis";

// Map of spender addresses 
const SPENDER_TYPES = {
  // Using addresses from your CONTRACT_ADDRESSES
  [CONTRACT_ADDRESSES.MockSpender?.toLowerCase()]: "Mock Service",
  [CONTRACT_ADDRESSES.BridgeSpender?.toLowerCase()]: "Bridge",
  [CONTRACT_ADDRESSES.DexSpender?.toLowerCase()]: "DEX",
  [CONTRACT_ADDRESSES.LendingSpender?.toLowerCase()]: "Lending Protocol",
  [CONTRACT_ADDRESSES.MiscSpender?.toLowerCase()]: "Misc Service",
  [CONTRACT_ADDRESSES.NftMarketplaceSpender?.toLowerCase()]: "NFT Marketplace",
  
  // Common known spenders
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap Router",
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap Router V3",
  "0x00000000006c3852cbef3e08e8df289169ede581": "OpenSea Seaport",
  "0x207a32a58e1666f4109b361869b9456bf4761283": "OpenSea",
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff": "0x Exchange",
};

/**
 * Get the spender type based on the address
 * @param {string} address - The spender address
 * @returns {string|null} - The spender type or null if not found
 */
export const getSpenderType = (address) => {
  if (!address) return null;
  
  // Normalize the address 
  const normalizedAddress = address.toLowerCase();
  
  // Return the spender type if found, or null if not
  return SPENDER_TYPES[normalizedAddress] || null;
};

/**
 * Check if an address is a known spender
 * @param {string} address - The spender address
 * @returns {boolean} - True if the address is a known spender
 */
export const isKnownSpender = (address) => {
  return getSpenderType(address) !== null;
};

export default {
  getSpenderType,
  isKnownSpender,
  SPENDER_TYPES
};

