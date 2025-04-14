const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * ERC1155 Approval Manager - Handles both normal and upgradeable ERC1155 tokens
 */
async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🚀 Starting ERC1155 Approval Manager Script");
  console.log(`📝 Using signer: ${await signer.getAddress()}`);
  
  // Try to load deployed addresses if available
  let deployedAddresses = {};
  try {
    const addressPath = path.join(__dirname, "../src/constants/deployedAddresses.json");
    deployedAddresses = JSON.parse(fs.readFileSync(addressPath));
    console.log("📦 Loaded deployed addresses");
  } catch (error) {
    console.log("ℹ️ No deployed addresses found, using defaults");
  }
  
  // Define ERC1155 tokens
  const tokens = [
    // Regular ERC1155
    {
      name: "OpenSea Shared Storefront",
      address: "0x495f947276749Ce646f68AC8c248420045cb7b5e",
      type: "standard"
    },
    // Upgradeable ERC1155 - Check if we have a deployed address
    {
      name: "Upgradeable ERC1155",
      address: deployedAddresses.UpgradeableERC1155 || "0xB66a603f4cFe17e3D27B87a8BfCaD319856518B8", // Rarible as fallback
      type: "upgradeable"
    }
  ];
  
  // Define operators (spenders)
  const operators = [
    {
      name: "Custom Operator",
      address: "0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101" // From your script
    },
    {
      name: "Rarible Operator",
      address: "0xfac7bea255a6990f749363002136af6556b31e04" // Rarible v2 operator
    }
  ];
  
  // ERC1155 ABI with necessary functions
  const erc1155Abi = [
    "function setApprovalForAll(address operator, bool approved) external",
    "function isApprovedForAll(address account, address operator) external view returns (bool)"
  ];
  
  // Get optimized gas settings
  const feeData = await ethers.provider.getFeeData();
  const gasSettings = {
    maxFeePerGas: feeData.maxFeePerGas * BigInt(2),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * BigInt(2),
  };
  
  // Process each token and operator pair
  const results = [];
  
  for (const token of tokens) {
    console.log(`\n-----------------------------------------------`);
    console.log(`Processing ${token.name} (${token.type} ERC1155)`);
    
    // Connect to the contract
    const contract = new ethers.Contract(token.address, erc1155Abi, signer);
    
    // Determine which operator to use based on token type
    const operator = token.type === "standard" ? operators[0] : operators[1];
    
    console.log(`Setting approval for ${operator.name} (${operator.address})`);
    
    // Check current approval status
    try {
      const isApproved = await contract.isApprovedForAll(signer.address, operator.address);
      console.log(`Current approval status: ${isApproved ? "Approved" : "Not approved"}`);
      
      if (isApproved) {
        console.log("✅ Already approved, no need to send transaction");
        results.push({
          token: token.name,
          operator: operator.name,
          result: "Already approved"
        });
        continue;
      }
      
      // Set approval for all tokens
      console.log("Setting approval for all tokens...");
      const tx = await contract.setApprovalForAll(
        operator.address,
        true,
        gasSettings
      );
      
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log(`✅ Approval set successfully`);
      
      // Verify approval was set correctly
      const newApprovalStatus = await contract.isApprovedForAll(signer.address, operator.address);
      console.log(`New approval status: ${newApprovalStatus ? "Approved" : "Not approved"}`);
      
      results.push({
        token: token.name,
        operator: operator.name,
        result: "Approval set successfully",
        txHash: tx.hash
      });
      
    } catch (error) {
      console.error(`❌ Error setting approval for ${token.name}:`, error.message);
      results.push({
        token: token.name,
        operator: operator.name,
        result: "Failed",
        error: error.message
      });
    }
  }
  
  // Summary
  console.log(`\n-----------------------------------------------`);
  console.log("📋 ERC1155 Approval Summary:");
  
  for (const result of results) {
    console.log(`- ${result.token} → ${result.operator}: ${result.result}`);
    if (result.txHash) {
      console.log(`  Transaction: ${result.txHash}`);
    }
  }
  
  console.log("-----------------------------------------------");
}

// Execute the main function
main().catch(error => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});