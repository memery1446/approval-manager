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
 * Fetch ERC-1155 approvals for a given owner.
 * @param {string} ownerAddress - The wallet address of the token owner.
 * @param {ethers.Provider} [providedProvider] - Optional provider instance.
 * @returns {Promise<Array>} - Resolves to an array of approvals.
 */
export async function getERC1155Approvals(ownerAddress, providedProvider) {
    try {
        console.log("🔍 Fetching ERC-1155 approvals for:", ownerAddress);
        
        if (!ownerAddress) {
            console.warn("⚠️ No owner address provided for ERC-1155 approvals");
            return [];
        }

        // Use provided provider or get one from providerService
        const provider = providedProvider || await getProvider();
        if (!provider) {
            console.error("❌ No provider available for ERC-1155 approvals");
            return [];
        }

        // Get spender address from constants or use OpenSea proxy as fallback
        let spender;
        try {
            spender = CONTRACT_ADDRESSES.MockSpender 
                ? getAddress(CONTRACT_ADDRESSES.MockSpender)
                : "0x207a32a58e1666f4109b361869b9456bf4761283"; // OpenSea ERC-1155 proxy
        } catch (err) {
            console.warn("⚠️ Invalid spender address format, using fallback");
            spender = "0x207a32a58e1666f4109b361869b9456bf4761283"; // OpenSea ERC-1155 proxy
        }

        // Get contract addresses from constants
        const erc1155Contracts = [
            CONTRACT_ADDRESSES.TestERC1155,
            CONTRACT_ADDRESSES.UpgradeableERC1155
        ].filter(Boolean); // Remove null/undefined values

        if (erc1155Contracts.length === 0) {
            console.error("❌ No valid ERC-1155 contract addresses found.");
            return [];
        }

        const approvals = [];
        for (const address of erc1155Contracts) {
            try {
                // Skip null/undefined addresses
                if (!address) continue;
                
                // Validate address format
                let contractAddress;
                try {
                    contractAddress = getAddress(address);
                } catch (err) {
                    console.warn(`⚠️ Invalid contract address format: ${address}, skipping...`);
                    continue;
                }
                
                console.log(`🔍 Checking ERC-1155 approval for contract: ${contractAddress}`);
                const contract = new Contract(contractAddress, ERC1155_ABI, provider);
                
                console.log(`🔍 Checking ERC-1155 approval: ${contractAddress} for spender ${spender}`);

                const isApproved = await contract.isApprovedForAll(ownerAddress, spender);
                console.log(`🔎 Approval Check: Contract ${contractAddress}, Spender ${spender}, Result: ${isApproved}`);
                
                if (isApproved) {
                    // Extract collection name if possible
                    let collectionName = "ERC-1155 Collection";
                    try {
                        if (contract.name) {
                            collectionName = await contract.name();
                        } else if (contract.uri) {
                            // Some ERC-1155 contracts use URI instead
                            collectionName = `Collection at ${contractAddress.substring(0, 8)}...`;
                        }
                    } catch (err) {
                        console.warn(`⚠️ Could not get collection name for ${contractAddress}`);
                    }
                    
                    // 🔍 Get the transaction hash that set this approval
                    const transactionHash = await getLatestERC1155ApprovalTransaction(
                        provider, 
                        ownerAddress, 
                        contractAddress, 
                        spender
                    );
                    
                    approvals.push({
                        contract: contractAddress,
                        type: "ERC-1155",
                        spender,
                        isApproved: true,
                        asset: collectionName,
                        valueAtRisk: "All Items",
                        transactionHash // Add transaction hash to the approval object
                    });
                    
                    console.log(`✅ Found ERC-1155 approval: ${contractAddress} → ${spender}, TX: ${transactionHash}`);
                }
            } catch (error) {
                console.error(`❌ Error checking ERC-1155 approval for ${address}:`, error);
            }
        }

        console.log(`✅ Fetched ${approvals.length} ERC-1155 approvals`);
        return approvals;
    } catch (error) {
        console.error("❌ Error fetching ERC-1155 approvals:", error);
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
