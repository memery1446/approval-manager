import { useEffect } from 'react';
import { CONTRACT_ADDRESSES } from "../constants/abis";

/**
 * This component loads the deployed addresses into the window object
 * for use by the approval utilities.
 */
const DeployedAddressesLoader = () => {
  useEffect(() => {
    // Make addresses available globally
    window.deployedAddresses = CONTRACT_ADDRESSES;
    
    console.log("Loaded deployed addresses into window object:", 
      window.deployedAddresses);

    // Log the ERC-1155 approvals specifically
  console.log("DEBUG: ERC-1155 contracts", {
    TestERC1155: CONTRACT_ADDRESSES.TestERC1155,
    UpgradeableERC1155: CONTRACT_ADDRESSES.UpgradeableERC1155
  });
  
  console.log("DEBUG: ERC-1155 spenders", {
    MockSpender: CONTRACT_ADDRESSES.MockSpender,
    BridgeSpender: CONTRACT_ADDRESSES.BridgeSpender,
    NftMarketplaceSpender: CONTRACT_ADDRESSES.NftMarketplaceSpender
  });
    
    // Count how many spender contracts are available
    const spenderCount = [
      'MockSpender', 'BridgeSpender', 'DexSpender', 
      'LendingSpender', 'MiscSpender', 'NftMarketplaceSpender'
    ].filter(name => !!window.deployedAddresses[name]).length;
    
    console.log(`Found ${spenderCount} spender contracts in deployed addresses`);
    
  }, []);

  // This component doesn't render anything
  return null;
};

export default DeployedAddressesLoader;