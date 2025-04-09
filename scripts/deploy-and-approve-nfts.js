const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [signer] = await ethers.getSigners();
  const spender = "0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101";

  const feeData = await ethers.provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas * BigInt(2);
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(2);

  const deployed = {};

  // === Deploy TestNFT ===
  console.log("🚀 Deploying TestNFT...");
  const TestNFT = await ethers.getContractFactory("TestNFT");
  const testNFT = await TestNFT.deploy({ maxFeePerGas, maxPriorityFeePerGas });
  await testNFT.waitForDeployment();
  const testNFTAddress = await testNFT.getAddress();
  deployed.TestNFT = testNFTAddress;
  console.log("✅ TestNFT deployed at:", testNFTAddress);

  console.log("🔐 Approving tokenId 1 from TestNFT...");
  await testNFT.approve(spender, 1, { maxFeePerGas, maxPriorityFeePerGas });

  // === Deploy DynamicNFT ===
  console.log("🚀 Deploying DynamicNFT...");
  const DynamicNFT = await ethers.getContractFactory("DynamicNFT");
  const dynamicNFT = await DynamicNFT.deploy({ maxFeePerGas, maxPriorityFeePerGas });
  await dynamicNFT.waitForDeployment();
  const dynamicNFTAddress = await dynamicNFT.getAddress();
  deployed.DynamicNFT = dynamicNFTAddress;
  console.log("✅ DynamicNFT deployed at:", dynamicNFTAddress);

  console.log("🪄 Minting DynamicNFT tokenId 100...");
  await dynamicNFT.mint(signer.address, 100, "ipfs://initial-uri", { maxFeePerGas, maxPriorityFeePerGas });
  console.log("🔐 Approving tokenId 100 from DynamicNFT...");
  await dynamicNFT.approve(spender, 100, { maxFeePerGas, maxPriorityFeePerGas });

  // === Deploy UpgradeableNFT ===
  console.log("🚀 Deploying UpgradeableNFT...");
  const UpgradeableNFT = await ethers.getContractFactory("UpgradeableNFT");
  const upgradeableNFT = await UpgradeableNFT.deploy({ maxFeePerGas, maxPriorityFeePerGas });
  await upgradeableNFT.waitForDeployment();
  const upgradeableNFTAddress = await upgradeableNFT.getAddress();
  deployed.UpgradeableNFT = upgradeableNFTAddress;
  console.log("✅ UpgradeableNFT deployed at:", upgradeableNFTAddress);

  console.log("🪄 Minting UpgradeableNFT tokenId 999...");
  await upgradeableNFT.mint(signer.address, 999, "ipfs://metadata-uri", { maxFeePerGas, maxPriorityFeePerGas });
  console.log("🔐 Approving tokenId 999 from UpgradeableNFT...");
  await upgradeableNFT.approve(spender, 999, { maxFeePerGas, maxPriorityFeePerGas });

  // === Write to deployedAddresses.json ===
  const outputPath = path.join(__dirname, "../src/constants/deployedAddresses.json");
  const existing = fs.existsSync(outputPath)
    ? JSON.parse(fs.readFileSync(outputPath))
    : {};

  // === Deduplication Check
  for (const [key, newAddress] of Object.entries(deployed)) {
    for (const [existingKey, existingAddress] of Object.entries(existing)) {
      if (newAddress.toLowerCase() === existingAddress.toLowerCase()) {
        console.warn(`⚠️ Address conflict: "${key}" is sharing address with "${existingKey}". Overwriting.`);
      }
    }
  }

  const merged = { ...existing, ...deployed };

  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));
  console.log("📦 Addresses saved to src/constants/deployedAddresses.json");

  console.log("✅ All NFTs deployed, minted, approved, and addresses saved.");
  console.log("📜 Deployed keys:", Object.keys(deployed));
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
