const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * NFT Demo Approval Manager
 * 
 * For mainnet fork with locally deployed NFTs
 * Handles 3 types: standard, dynamic, and upgradeable NFTs
 */

async function main() {
  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("🚀 Starting NFT Demo Approval Manager");
  console.log(`📝 Using signer: ${await signer.getAddress()}`);
  
  // Load deployed addresses
  let deployedAddresses;
  try {
    const addressPath = path.join(__dirname, "../src/constants/deployedAddresses.json");
    deployedAddresses = JSON.parse(fs.readFileSync(addressPath));
    console.log("📦 Loaded deployed addresses");
  } catch (error) {
    console.error("❌ Could not load deployed addresses:", error.message);
    console.log("⚠️ Make sure to run deploy-and-approve-nfts.js first!");
    return;
  }
  
  // Define our NFT contracts with addresses from deployment
  const nftContracts = {
    // Standard NFT
    testNFT: {
      address: deployedAddresses.TestNFT,
      name: "TestNFT",
      type: "standard",
      tokenIds: [1] // Default tokenId from deployment
    },
    
    // Dynamic NFT
    dynamicNFT: {
      address: deployedAddresses.DynamicNFT,
      name: "DynamicNFT",
      type: "dynamic",
      tokenIds: [100] // From deployment script
    },
    
    // Upgradeable NFT
    upgradeableNFT: {
      address: deployedAddresses.UpgradeableNFT,
      name: "UpgradeableNFT",
      type: "upgradeable",
      tokenIds: [999] // From deployment script
    }
  };
  
  // Verify all contracts exist
  for (const [key, contract] of Object.entries(nftContracts)) {
    if (!contract.address) {
      console.error(`❌ Missing address for ${contract.name}. Please deploy it first.`);
      return;
    }
    console.log(`✅ Found ${contract.name} at ${contract.address}`);
  }
  
  // Real known spenders from mainnet for realism
  const spenders = {
    OPENSEA: "0x00000000006c3852cbef3e08e8df289169ede581", // OpenSea Seaport
    BLUR: "0x00000000000111AbE46ff893f3B2fdF1F759a8A8",   // Blur.io
    X2Y2: "0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3",   // X2Y2 Marketplace
    CUSTOM: "0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101"  // From your script
  };
  
  // Get optimized gas settings
  const feeData = await ethers.provider.getFeeData();
  const gasSettings = {
    maxFeePerGas: feeData.maxFeePerGas * BigInt(2),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * BigInt(2),
  };
  
  // Track all results
  const results = [];
  
  // 1. Normal NFT single token approval
  console.log("\n-----------------------------------------------");
  console.log(`Processing ${nftContracts.testNFT.name} single token approval`);
  
  try {
    const testNFT = await ethers.getContractAt(
      ["function approve(address to, uint256 tokenId)", "function getApproved(uint256 tokenId) view returns (address)"],
      nftContracts.testNFT.address,
      signer
    );
    
    console.log(`🔑 Approving OpenSea for tokenId 1...`);
    const tx1 = await testNFT.approve(spenders.OPENSEA, 1, gasSettings);
    await tx1.wait();
    
    console.log(`✅ Standard NFT approval successful: ${tx1.hash}`);
    results.push({
      nft: nftContracts.testNFT.name,
      type: "Single Token Approval",
      spender: "OpenSea",
      tokenId: 1,
      txHash: tx1.hash,
      riskLevel: "Low"
    });
  } catch (error) {
    console.error(`❌ Error with TestNFT approval:`, error.message);
  }
  
  // 2. Dynamic NFT single token approval
  console.log("\n-----------------------------------------------");
  console.log(`Processing ${nftContracts.dynamicNFT.name} single token approval`);
  
  try {
    const dynamicNFT = await ethers.getContractAt(
      ["function approve(address to, uint256 tokenId)", "function getApproved(uint256 tokenId) view returns (address)"],
      nftContracts.dynamicNFT.address,
      signer
    );
    
    console.log(`🔑 Approving Blur for tokenId 100...`);
    const tx2 = await dynamicNFT.approve(spenders.BLUR, 100, gasSettings);
    await tx2.wait();
    
    console.log(`✅ Dynamic NFT approval successful: ${tx2.hash}`);
    results.push({
      nft: nftContracts.dynamicNFT.name,
      type: "Single Token Approval",
      spender: "Blur",
      tokenId: 100,
      txHash: tx2.hash,
      riskLevel: "Low"
    });
  } catch (error) {
    console.error(`❌ Error with DynamicNFT approval:`, error.message);
  }
  
  // 3. Upgradeable NFT for medium risk
  console.log("\n-----------------------------------------------");
  console.log(`Processing ${nftContracts.upgradeableNFT.name} single token approval (Medium Risk)`);
  
  try {
    const upgradeableNFT = await ethers.getContractAt(
      ["function approve(address to, uint256 tokenId)", "function getApproved(uint256 tokenId) view returns (address)"],
      nftContracts.upgradeableNFT.address,
      signer
    );
    
    console.log(`🔑 Approving Custom Address for tokenId 999...`);
    console.log(`⚠️ MEDIUM RISK: Approving to a less common marketplace address`);
    const tx3 = await upgradeableNFT.approve(spenders.CUSTOM, 999, gasSettings);
    await tx3.wait();
    
    console.log(`✅ Upgradeable NFT approval successful: ${tx3.hash}`);
    results.push({
      nft: nftContracts.upgradeableNFT.name,
      type: "Single Token Approval",
      spender: "Custom Address",
      tokenId: 999,
      txHash: tx3.hash,
      riskLevel: "Medium"
    });
  } catch (error) {
    console.error(`❌ Error with UpgradeableNFT approval:`, error.message);
  }
  
  // 4. Full collection approval (high risk demo)
  console.log("\n-----------------------------------------------");
  console.log(`Processing ${nftContracts.testNFT.name} full collection approval`);
  
  try {
    const testNFT = await ethers.getContractAt(
      ["function setApprovalForAll(address operator, bool approved)",
       "function isApprovedForAll(address owner, address operator) view returns (bool)"],
      nftContracts.testNFT.address,
      signer
    );
    
    console.log(`🔑 Setting approval for ALL tokens to X2Y2...`);
    console.log(`⚠️ HIGH RISK: This grants approval for ALL tokens in the collection!`);
    const tx4 = await testNFT.setApprovalForAll(spenders.X2Y2, true, gasSettings);
    await tx4.wait();
    
    console.log(`✅ Full collection approval successful: ${tx4.hash}`);
    results.push({
      nft: nftContracts.testNFT.name,
      type: "Full Collection Approval",
      spender: "X2Y2",
      txHash: tx4.hash,
      riskLevel: "High"
    });
  } catch (error) {
    console.error(`❌ Error with full collection approval:`, error.message);
  }
  
  // Summary
  console.log("\n-----------------------------------------------");
  console.log("✅ NFT Approval Summary:");
  
  for (const result of results) {
    if (result.type === "Single Token Approval") {
      console.log(`- ${result.nft}: TokenId ${result.tokenId} approved for ${result.spender} (Risk: ${result.riskLevel})`);
    } else {
      console.log(`- ${result.nft}: ALL tokens approved for ${result.spender} (Risk: ${result.riskLevel})`);
    }
  }
  
  console.log("-----------------------------------------------");
  console.log("🎉 Demo NFT approvals completed successfully!");
}

// Execute the main function
main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});