import { Contract, getAddress } from "ethers";
import { NFT_ABI, CONTRACT_ADDRESSES } from "../constants/abis";
import { getProvider } from "./providerService";

/**
 * Get all possible NFT spenders to check for approvals
 * @returns {Array<string>} - Array of spender addresses
 */
function getAllPossibleNFTSpenders() {
    // First check if we have deployedAddresses available in the window
    let deployedSpenders = [];
    try {
        if (window.deployedAddresses) {
            console.log("Found deployedAddresses in window object for NFT checks");
            // Extract all spender contracts that might interact with NFTs
            if (window.deployedAddresses.MockSpender) 
                deployedSpenders.push(window.deployedAddresses.MockSpender);
            if (window.deployedAddresses.BridgeSpender)
                deployedSpenders.push(window.deployedAddresses.BridgeSpender);
            if (window.deployedAddresses.NftMarketplaceSpender)
                deployedSpenders.push(window.deployedAddresses.NftMarketplaceSpender);
        }
    } catch (error) {
        console.warn("Error accessing window.deployedAddresses for NFTs", error);
    }

    // Hardcoded spenders as fallback
    const hardcodedSpenders = [
        // Deployed spenders that interact with NFTs
        "0x1bEfE2d8417e22Da2E0432560ef9B2aB68Ab75Ad", // MockSpender
        "0x04f1A5b9BD82a5020C49975ceAd160E98d8B77Af", // BridgeSpender
        "0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101", // NftMarketplaceSpender
        
        // Common NFT marketplaces
        "0x00000000006c3852cbef3e08e8df289169ede581", // OpenSea Seaport 1.1
        "0x00000000000001ad428e4906ae43d8f9852d0dd6", // OpenSea Seaport 1.4
        "0x000000000000ad05ccc4f10045630fb830b95127", // OpenSea Seaport 1.5
        "0x4feE7B061C97C9c496b01DbcE9CDb10c02f0a0Be", // Rarible
        "0xf42aa99F011A1fA7CDA90E5E98b277E306BcA83e", // LooksRare
        "0xFF9c1b15b16263C61d017ee9f65c50E4AE0113D7",
        "0x6484EB0792c646A4827638Fc1B6F20461418eB00"  
    ];
    
    // Combine and remove duplicates
    return [...new Set([...deployedSpenders, ...hardcodedSpenders])];
}

/**
 * Get the latest Approval transaction hash for an ERC-721 approval.
 * @param {ethers.Provider} provider - The ethers provider
 * @param {string} owner - The token owner address
 * @param {string} contractAddress - The NFT contract address
 * @param {string} operator - The approved operator address
 * @returns {Promise<string>} - The transaction hash or "N/A" if not found
 */
async function getLatestNFTApprovalTransaction(provider, owner, contractAddress, operator) {
  try {
    console.log(`🔍 Searching for NFT approval events from ${contractAddress} for owner ${owner} and operator ${operator}`);
    
    // ApprovalForAll(address,address,bool) event signature
    const approvalForAllSignature = "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31";
    
    // Format addresses for topic filtering (pad to 32 bytes)
    const formattedOwner = "0x" + owner.slice(2).padStart(64, "0");
    const formattedOperator = "0x" + operator.slice(2).padStart(64, "0");
    
    console.log(`🔍 Using formatted topics - Owner: ${formattedOwner}, Operator: ${formattedOperator}`);
    
    // Search for ApprovalForAll events
    try {
      const approvalForAllLogs = await provider.getLogs({
        address: contractAddress,
        topics: [
          approvalForAllSignature,
          formattedOwner,
          formattedOperator
        ],
        fromBlock: "earliest",
        toBlock: "latest"
      });

      if (approvalForAllLogs.length > 0) {
        const latestLog = approvalForAllLogs[approvalForAllLogs.length - 1];
        console.log(`✅ Found ApprovalForAll transaction: ${latestLog.transactionHash}`);
        return latestLog.transactionHash;
      } else {
        console.log(`⚠️ No ApprovalForAll events found`);
      }
    } catch (error) {
      console.warn(`⚠️ Error searching for ApprovalForAll logs:`, error.message);
    }
  } catch (error) {
    console.warn(`⚠️ Error in getLatestNFTApprovalTransaction:`, error.message);
  }
  
  return "N/A"; // If no transaction is found
}

/**
 * Fetch ERC-721 NFT approvals for a user
 * @param {string} ownerAddress - Owner's wallet address
 * @param {ethers.Provider} [providedProvider] - Optional provider instance
 * @returns {Promise<Array>} - Approval objects
 */
export async function getERC721Approvals(ownerAddress, providedProvider) {
  console.log("🔍 Starting ERC-721 approval check for:", ownerAddress);
  
  if (!ownerAddress) {
    console.warn("⚠️ No owner address provided for ERC-721 approvals");
    return [];
  }

  const provider = providedProvider || await getProvider();
  if (!provider) {
    console.error("❌ No provider available for ERC-721 approvals");
    return [];
  }

  const nftCollections = [
    {
      address: CONTRACT_ADDRESSES.TestNFT,
      name: "Test NFT Collection",
      symbol: "TestNFT"
    },
    {
      address: CONTRACT_ADDRESSES.UpgradeableNFT,
      name: "Upgradeable NFT Collection",
      symbol: "UpgradeableNFT"
    },
    {
      address: CONTRACT_ADDRESSES.DynamicNFT,
      name: "Dynamic NFT Collection",
      symbol: "DynamicNFT"
    }
  ].filter(n => n.address);

  console.log(`🔍 Checking ${nftCollections.length} NFT collections`);

  const spenderAddresses = getAllPossibleNFTSpenders();
  console.log(`🔍 Checking for approvals to ${spenderAddresses.length} spenders:`, spenderAddresses);

  let approvals = [];

  const minimalNFTABI = [
    "function isApprovedForAll(address owner, address operator) view returns (bool)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function getApproved(uint256 tokenId) view returns (address)"
  ];

  for (let nftCollection of nftCollections) {
    if (!nftCollection.address) continue;

    let collectionAddress;
    try {
      collectionAddress = getAddress(nftCollection.address);
    } catch {
      console.warn(`⚠️ Invalid NFT address: ${nftCollection.address}`);
      continue;
    }

    const contract = new Contract(collectionAddress, NFT_ABI || minimalNFTABI, provider);
    let collectionName = nftCollection.name || "";
    let collectionSymbol = nftCollection.symbol || "";

    try {
      if (!collectionName) collectionName = await contract.name();
      if (!collectionSymbol) collectionSymbol = await contract.symbol();
    } catch {
      collectionName ||= collectionAddress.slice(0, 10);
    }

    for (let spender of spenderAddresses) {
      try {
        spender = getAddress(spender);
      } catch {
        continue;
      }

      console.log(`🔍 Checking NFT approval for spender: ${spender}`);

      // Check isApprovedForAll
      try {
        const isApproved = await contract.isApprovedForAll(ownerAddress, spender);
        if (isApproved) {
          const transactionHash = await getLatestNFTApprovalTransaction(provider, ownerAddress, collectionAddress, spender);
          const approval = {
            contract: collectionAddress,
            type: "ERC-721",
            spender,
            asset: collectionName,
            tokenId: "all",
            valueAtRisk: "All NFTs in Collection",
            transactionHash
          };
          approvals.push(approval);
          console.log(`✅ Found collection-level approval:`, approval);
        }
      } catch (err) {
        console.warn(`⚠️ isApprovedForAll failed for ${collectionAddress} → ${spender}:`, err.message);
      }

      // Check getApproved(tokenId) — always
      const tokenIdsToCheck = [1, 100, 999];
      for (let tokenId of tokenIdsToCheck) {
        try {
          const approvedSpender = await contract.getApproved(tokenId);
          if (approvedSpender.toLowerCase() === spender.toLowerCase()) {
            const approval = {
              contract: collectionAddress,
              type: "ERC-721",
              spender,
              asset: collectionName,
              tokenId,
              valueAtRisk: `NFT #${tokenId}`,
              transactionHash: "N/A"
            };
            approvals.push(approval);
            console.log(`✅ Found token-level approval:`, approval);
          }
        } catch (err) {
          // Most likely due to non-existent token
        }
      }
    }
  }

  console.log("✅ Completed ERC-721 check. Found approvals:", approvals.length);
  return approvals;
}


export default getERC721Approvals;