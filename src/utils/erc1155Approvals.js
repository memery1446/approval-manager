import { isAddress, Contract, getAddress } from "ethers"; 
import { getProvider } from "./providerService"; // Using providerService for consistency
import { ERC1155_ABI, CONTRACT_ADDRESSES } from "../constants/abis";

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

        // Get spender address from constants
        let spender;
        try {
            spender = getAddress(CONTRACT_ADDRESSES.MockSpender);
        } catch (err) {
            console.error("❌ Invalid spender address format. Check CONTRACT_ADDRESSES.MockSpender");
            return [];
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
                if (!address) continue;
                
                let contractAddress;
                try {
                    contractAddress = getAddress(address);
                } catch (err) {
                    console.warn(`⚠️ Invalid contract address format: ${address}, skipping...`);
                    continue;
                }
                
                console.log(`🔍 Checking ERC-1155 approval for contract: ${contractAddress}`);
                const contract = new Contract(contractAddress, ERC1155_ABI, provider);

                const isApproved = await contract.isApprovedForAll(ownerAddress, spender);
                console.log(`🔎 Approval Check: Contract ${contractAddress}, Spender ${spender}, Result:`, isApproved);

                if (isApproved) {
                    let collectionName = "ERC-1155 Collection";
                    try {
                        if (contract.name) {
                            collectionName = await contract.name();
                        }
                    } catch (err) {
                        console.warn(`⚠️ Could not get collection name for ${contractAddress}`);
                    }
                    
                    approvals.push({
                        contract: contractAddress,
                        type: "ERC-1155",
                        spender,
                        isApproved: true,
                        asset: collectionName,
                        valueAtRisk: "All Items"
                    });

                    console.log(`✅ Found ERC-1155 approval: ${contractAddress} → ${spender}`);
                }
            } catch (error) {
                console.error(`❌ Error checking ERC-1155 approval for ${address}:`, error);
            }
        }

        console.log("✅ Final ERC-1155 approvals:", approvals);
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
        return false;
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

