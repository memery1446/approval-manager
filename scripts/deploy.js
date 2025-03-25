const hre = require("hardhat");
const { ethers } = require("hardhat"); // Explicitly import ethers
const fs = require("fs");
const path = require("path");

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0]; // Use the first signer
  console.log(`📌 Deploying contracts as: ${deployer.address}`);

  // Object to store all deployed addresses
  const deployedAddresses = {};

  // 🔹 Fetch gas price (avoids EIP-1559 issues)
  const provider = ethers.provider; // Hardhat provider
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.utils.parseUnits("10", "gwei"); // Use a default if undefined

  console.log(`📌 Gas Price: ${gasPrice.toString()} wei`);

  // ✅ Deploy ERC-20 Test Tokens
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const tk1 = await TestToken.deploy("Test Token 1", "TK1", 18, { gasPrice });
  await tk1.waitForDeployment();
  const tk1Address = await tk1.getAddress();
  deployedAddresses.TK1 = tk1Address;
  console.log(`✅ TK1 deployed at: ${tk1Address}`);

  const tk2 = await TestToken.deploy("Test Token 2", "TK2", 18, { gasPrice });
  await tk2.waitForDeployment();
  const tk2Address = await tk2.getAddress();
  deployedAddresses.TK2 = tk2Address;
  console.log(`✅ TK2 deployed at: ${tk2Address}`);

  const PermitToken = await hre.ethers.getContractFactory("PermitToken");
  const permitToken = await PermitToken.deploy("Permit Token", "PTK", 18, { gasPrice });
  await permitToken.waitForDeployment();
  const permitTokenAddress = await permitToken.getAddress();
  deployedAddresses.PermitToken = permitTokenAddress;
  console.log(`✅ PermitToken deployed at: ${permitTokenAddress}`);

  const FeeToken = await hre.ethers.getContractFactory("FeeToken");
  const feeToken = await FeeToken.deploy("Fee Token", "FTK", 18, deployer.address, { gasPrice });
  await feeToken.waitForDeployment();
  const feeTokenAddress = await feeToken.getAddress();
  deployedAddresses.FeeToken = feeTokenAddress;
  console.log(`✅ FeeToken deployed at: ${feeTokenAddress}`);

  // ✅ Deploy ERC-721 Contracts
  const TestNFT = await hre.ethers.getContractFactory("TestNFT");
  const testNFT = await TestNFT.deploy({ gasPrice });
  await testNFT.waitForDeployment();
  const testNFTAddress = await testNFT.getAddress();
  deployedAddresses.TestNFT = testNFTAddress;
  console.log(`✅ TestNFT deployed at: ${testNFTAddress}`);

  const UpgradeableNFT = await hre.ethers.getContractFactory("UpgradeableNFT");
  const upgradeableNFT = await UpgradeableNFT.deploy({ gasPrice });
  await upgradeableNFT.waitForDeployment();
  const upgradeableNFTAddress = await upgradeableNFT.getAddress();
  deployedAddresses.UpgradeableNFT = upgradeableNFTAddress;
  console.log(`✅ UpgradeableNFT deployed at: ${upgradeableNFTAddress}`);

  const DynamicNFT = await hre.ethers.getContractFactory("DynamicNFT");
  const dynamicNFT = await DynamicNFT.deploy({ gasPrice });
  await dynamicNFT.waitForDeployment();
  const dynamicNFTAddress = await dynamicNFT.getAddress();
  deployedAddresses.DynamicNFT = dynamicNFTAddress;
  console.log(`✅ DynamicNFT deployed at: ${dynamicNFTAddress}`);

  // ✅ Deploy ERC-1155 Contracts
  const TestERC1155 = await hre.ethers.getContractFactory("TestERC1155");
  const testERC1155 = await TestERC1155.deploy(deployer.address, { gasPrice });
  await testERC1155.waitForDeployment();
  const testERC1155Address = await testERC1155.getAddress();
  deployedAddresses.TestERC1155 = testERC1155Address;
  console.log(`✅ TestERC1155 deployed at: ${testERC1155Address}`);

  const UpgradeableERC1155 = await hre.ethers.getContractFactory("UpgradeableERC1155");
  const upgradeableERC1155 = await UpgradeableERC1155.deploy({ gasPrice });
  await upgradeableERC1155.waitForDeployment();
  const upgradeableERC1155Address = await upgradeableERC1155.getAddress();
  deployedAddresses.UpgradeableERC1155 = upgradeableERC1155Address;
  console.log(`✅ UpgradeableERC1155 deployed at: ${upgradeableERC1155Address}`);

  // ✅ Deploy Spender Contracts
  console.log("🚀 Deploying Spender contracts...");
  
  // Original MockSpender
  const MockSpender = await hre.ethers.getContractFactory("MockSpender");
  const mockSpender = await MockSpender.deploy({ gasPrice });
  await mockSpender.waitForDeployment();
  const mockSpenderAddress = await mockSpender.getAddress();
  deployedAddresses.MockSpender = mockSpenderAddress;
  console.log(`✅ MockSpender deployed at: ${mockSpenderAddress}`);

  // Additional spender contracts
  const BridgeSpender = await hre.ethers.getContractFactory("BridgeSpender");
  const bridgeSpender = await BridgeSpender.deploy({ gasPrice });
  await bridgeSpender.waitForDeployment();
  const bridgeSpenderAddress = await bridgeSpender.getAddress();
  deployedAddresses.BridgeSpender = bridgeSpenderAddress;
  console.log(`✅ BridgeSpender deployed at: ${bridgeSpenderAddress}`);

  const DexSpender = await hre.ethers.getContractFactory("DexSpender");
  const dexSpender = await DexSpender.deploy({ gasPrice });
  await dexSpender.waitForDeployment();
  const dexSpenderAddress = await dexSpender.getAddress();
  deployedAddresses.DexSpender = dexSpenderAddress;
  console.log(`✅ DexSpender deployed at: ${dexSpenderAddress}`);

  const LendingSpender = await hre.ethers.getContractFactory("LendingSpender");
  const lendingSpender = await LendingSpender.deploy({ gasPrice });
  await lendingSpender.waitForDeployment();
  const lendingSpenderAddress = await lendingSpender.getAddress();
  deployedAddresses.LendingSpender = lendingSpenderAddress;
  console.log(`✅ LendingSpender deployed at: ${lendingSpenderAddress}`);

  const MiscSpender = await hre.ethers.getContractFactory("MiscSpender");
  const miscSpender = await MiscSpender.deploy({ gasPrice });
  await miscSpender.waitForDeployment();
  const miscSpenderAddress = await miscSpender.getAddress();
  deployedAddresses.MiscSpender = miscSpenderAddress;
  console.log(`✅ MiscSpender deployed at: ${miscSpenderAddress}`);

  const NftMarketplaceSpender = await hre.ethers.getContractFactory("NftMarketplaceSpender");
  const nftMarketplaceSpender = await NftMarketplaceSpender.deploy({ gasPrice });
  await nftMarketplaceSpender.waitForDeployment();
  const nftMarketplaceSpenderAddress = await nftMarketplaceSpender.getAddress();
  deployedAddresses.NftMarketplaceSpender = nftMarketplaceSpenderAddress;
  console.log(`✅ NftMarketplaceSpender deployed at: ${nftMarketplaceSpenderAddress}`);

  // Ensure the directory exists
  const filePath = path.join(__dirname, "../src/constants/deployedAddresses.json");
  const dirPath = path.dirname(filePath);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Write the addresses to the JSON file
  fs.writeFileSync(
    filePath,
    JSON.stringify(deployedAddresses, null, 2)
  );
  console.log(`✅ Addresses written to: ${filePath}`);

  console.log("🎉 Deployment successful!");
}

main().catch((error) => {
  console.error("❌ Deployment Error:", error);
  process.exit(1);
});

