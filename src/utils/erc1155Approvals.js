import { isAddress, Contract, getAddress } from "ethers"; 
import { getProvider } from "./providerService"; // Using providerService for consistency
import { ERC1155_ABI, CONTRACT_ADDRESSES } from "../constants/abis";

/**
 * Get the latest ApprovalForAll transaction hash for an ERC-1155 approval.
 * @param {ethers.Provider} provider - The ethers.js provider instance
 * @param {string} owner - The address of the owner
 * @param {string} contractAddress - The address of the ERC-1155 contract
 * @param {string} operator - The address of the operator/spender
 * @returns {Promise<string>} - The transaction hash or "N/A" if not found
 */
async function getLatestERC1155ApprovalTransaction(provider, owner, contractAddress, operator) {
  try {
    console.log(`🔍 Searching for ApprovalForAll event from ${contractAddress} for owner ${owner} and operator ${operator}`);
    
    // ApprovalForAll(address,address,bool) event signature
    const eventSignature = "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31";
    
    // Format owner and operator addresses for the topic filter
    const formattedOwner = "0x" + owner.slice(2).padStart(64, "0");
    const formattedOperator = "0x" + operator.slice(2).padStart(64, "0");
    
    const logs = await provider.getLogs({
      address: contractAddress,
      topics: [
        eventSignature,          // ApprovalForAll event signature
        formattedOwner,          // Owner address (first indexed parameter)
        formattedOperator        // Operator address (second indexed parameter)
      ],
      fromBlock: "earliest",
      toBlock: "latest"
    });

    if (logs.length > 0) {
      // Get the most recent approval
      const latestLog = logs[logs.length - 1];
      console.log(`🔍 Found ApprovalForAll transaction: ${latestLog.transactionHash}`);
      return latestLog.transactionHash;
    } else {
      console.log(`⚠️ No ApprovalForAll events found for this combination`);
    }
  } catch (error) {
    console.warn(`⚠️ Could not fetch ApprovalForAll logs for ${contractAddress}:`, error.message);
  }
  return "N/A"; // If no transaction is found
}

/**
 * Fetch ERC-1155 approvals for a given owner - simplified direct approach
 * @param {string} ownerAddress - The wallet address of the token owner
 * @param {ethers.Provider} [providedProvider] - Optional provider instance
 * @returns {Promise<Array>} - Array of approvals
 */
export async function getERC1155Approvals(ownerAddress, providedProvider) {
  try {
    console.log("🔍 SIMPLIFIED ERC-1155 check for:", ownerAddress);
    
    // Use provided provider or get one
    const provider = providedProvider || await getProvider();
    if (!provider) return [];
    
    // Get contract addresses directly
    const contracts = [
      { address: CONTRACT_ADDRESSES.TestERC1155, name: "Test ERC-1155" },
      { address: CONTRACT_ADDRESSES.UpgradeableERC1155, name: "Upgradeable ERC-1155" }
    ].filter(c => c.address); // Remove undefined
    
    // Get spender addresses directly
    const spenders = [
      { address: CONTRACT_ADDRESSES.MockSpender, name: "MockSpender" },
      { address: CONTRACT_ADDRESSES.BridgeSpender, name: "BridgeSpender" },
      { address: CONTRACT_ADDRESSES.NftMarketplaceSpender, name: "NftMarketplaceSpender" }
    ].filter(s => s.address); // Remove undefined
    
    console.log(`🔍 Checking ${contracts.length} ERC-1155 collections against ${spenders.length} spenders`);
    
    const approvals = [];
    
    // Check each contract and spender combination
    for (const contract of contracts) {
      const erc1155Contract = new Contract(
        contract.address, 
        ["function isApprovedForAll(address,address) view returns (bool)"], 
        provider
      );
      
      for (const spender of spenders) {
        try {
          console.log(`🔍 Checking ${contract.name} for spender ${spender.name}`);
          const isApproved = await erc1155Contract.isApprovedForAll(ownerAddress, spender.address);
          
          if (isApproved) {
            console.log(`✅ Found approval: ${contract.name} → ${spender.name}`);
            
            // Get TX hash (simplified)
            let txHash = "N/A";
            try {
              const formattedOwner = "0x" + ownerAddress.slice(2).padStart(64, "0");
              const formattedOperator = "0x" + spender.address.slice(2).padStart(64, "0");
              const eventSignature = "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31";
              
              const logs = await provider.getLogs({
                address: contract.address,
                topics: [eventSignature, formattedOwner, formattedOperator],
                fromBlock: "earliest",
                toBlock: "latest"
              });
              
              if (logs.length > 0) {
                txHash = logs[logs.length - 1].transactionHash;
              }
            } catch (e) {
              console.warn("Error getting TX hash", e);
            }
            
            approvals.push({
              contract: contract.address,
              type: "ERC-1155",
              spender: spender.address,
              isApproved: true,
              asset: contract.name,
              valueAtRisk: "All Items",
              transactionHash: txHash
            });
          }
        } catch (error) {
          console.error(`Error checking ${contract.name} for ${spender.name}:`, error.message);
        }
      }
    }
    
    console.log(`✅ Found ${approvals.length} ERC-1155 approvals`);
    return approvals;
  } catch (error) {
    console.error("❌ Error in ERC-1155 approvals check:", error);
    return [];
  }
}

/**
 * Revoke a **single** ERC-1155 approval.
 * @param {string} spenderAddress - The spender to revoke approval for.
 * @returns {Promise<boolean>} - `true` if successful, `false` otherwise.
 */
export async function revokeERC1155Approval(spenderAddress) {
    try {
        console.log("🚨 Revoking ERC-1155 approval for:", spenderAddress);
        const provider = await getProvider();
        const signer = await provider.getSigner();
        const erc1155Contracts = [
            CONTRACT_ADDRESSES.TestERC1155,
            CONTRACT_ADDRESSES.UpgradeableERC1155
        ].filter(Boolean);

        for (const address of erc1155Contracts) {
            console.log(`🔄 Revoking approval for contract: ${address}`);
            const contract = new Contract(address, ["function setApprovalForAll(address,bool)"], signer);
            const tx = await contract.setApprovalForAll(spenderAddress, false);
            await tx.wait();
            console.log(`✅ Approval revoked on contract: ${address}`);
        }

        return true;
    } catch (error) {
        console.error("❌ Error revoking ERC-1155 approval:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
}

/**
 * Batch revoke **multiple** ERC-1155 approvals.
 * @param {Array<Object>} approvals - Array of approvals (contract + spender) to revoke.
 * @returns {Promise<Object>} - Result object with success flag and error message if applicable.
 */
export async function revokeMultipleERC1155Approvals(approvals) {
    try {
        console.log("🚨 Revoking multiple ERC-1155 approvals:", approvals);
        const provider = await getProvider();
        const signer = await provider.getSigner();

        for (let { contract, spender } of approvals) {
            if (!isAddress(spender)) {
                console.error(`❌ Invalid spender address: ${spender}`);
                continue;
            }

            console.log(`🔄 Revoking approval for contract: ${contract}, spender: ${spender}`);
            const erc1155Contract = new Contract(contract, ["function setApprovalForAll(address,bool)"], signer);
            const tx = await erc1155Contract.setApprovalForAll(spender, false);
            await tx.wait();
            console.log(`✅ Approval revoked for: ${spender} on contract ${contract}`);
        }

        return { success: true };
    } catch (error) {
        console.error("❌ Error in batch ERC-1155 revocation:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
}

export default getERC1155Approvals;
