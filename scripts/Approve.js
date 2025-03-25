const hre = require("hardhat");
const { ethers } = require("hardhat"); // Import ethers explicitly
const fs = require("fs");
const path = require("path");

async function main() {
  const signers = await ethers.getSigners();
  const deployer = signers[0]; 
  console.log(`📌 Approving tokens as: ${deployer.address}`);

  // 🔹 Load deployed addresses from JSON file
  let tokenAddresses;
  const addressesPath = path.join(__dirname, "../src/constants/deployedAddresses.json");
  
  try {
    tokenAddresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
    console.log("✅ Loaded addresses from deployedAddresses.json");
  } catch (error) {
    console.error("❌ Error loading deployedAddresses.json:", error.message);
    console.log("⚠️ Using hardcoded fallback addresses instead");
    
    // Fallback to hardcoded addresses if JSON file is not available
    tokenAddresses = {
      TK1: "0xa85EffB2658CFd81e0B1AaD4f2364CdBCd89F3a1",
      TK2: "0x8aAC5570d54306Bb395bf2385ad327b7b706016b",
      PermitToken: "0x64f5219563e28EeBAAd91Ca8D31fa3b36621FD4f",
      FeeToken: "0x1757a98c1333B9dc8D408b194B2279b5AFDF70Cc",
      TestNFT: "0x6484EB0792c646A4827638Fc1B6F20461418eB00",
      UpgradeableNFT: "0xf201fFeA8447AB3d43c98Da3349e0749813C9009",
      DynamicNFT: "0xA75E74a5109Ed8221070142D15cEBfFe9642F489",
      TestERC1155: "0x26291175Fa0Ea3C8583fEdEB56805eA68289b105",
      UpgradeableERC1155: "0x840748F7Fd3EA956E5f4c88001da5CC1ABCBc038",
      MockSpender: "0x1bEfE2d8417e22Da2E0432560ef9B2aB68Ab75Ad",
      BridgeSpender: "0x04f1A5b9BD82a5020C49975ceAd160E98d8B77Af",
      DexSpender: "0xde79380FBd39e08150adAA5C6c9dE3146f53029e",
      LendingSpender: "0xbFD3c8A956AFB7a9754C951D03C9aDdA7EC5d638",
      MiscSpender: "0x38F6F2caE52217101D7CA2a5eC040014b4164E6C",
      NftMarketplaceSpender: "0xc075BC0f734EFE6ceD866324fc2A9DBe1065CBB1"
    };
  }

  // ✅ Load all available spenders
  const spenders = {
    MockSpender: tokenAddresses.MockSpender || "",
    BridgeSpender: tokenAddresses.BridgeSpender || "",
    DexSpender: tokenAddresses.DexSpender || "",
    LendingSpender: tokenAddresses.LendingSpender || "",
    MiscSpender: tokenAddresses.MiscSpender || "",
    NftMarketplaceSpender: tokenAddresses.NftMarketplaceSpender || ""
  };

  // Filter out any spenders that aren't available (empty strings)
  const availableSpenders = Object.entries(spenders)
    .filter(([_, address]) => address !== "")
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  console.log(`📌 Found ${Object.keys(availableSpenders).length} spender contracts`);
  
  // ✅ Load deployed contracts using correct provider syntax
  const tk1 = await ethers.getContractAt("TestToken", tokenAddresses.TK1, deployer);
  const tk2 = await ethers.getContractAt("TestToken", tokenAddresses.TK2, deployer);
  const permitToken = await ethers.getContractAt("PermitToken", tokenAddresses.PermitToken, deployer);
  const feeToken = await ethers.getContractAt("FeeToken", tokenAddresses.FeeToken, deployer);

  const testNFT = await ethers.getContractAt("TestNFT", tokenAddresses.TestNFT, deployer);
  const upgradeableNFT = await ethers.getContractAt("UpgradeableNFT", tokenAddresses.UpgradeableNFT, deployer);
  const dynamicNFT = await ethers.getContractAt("DynamicNFT", tokenAddresses.DynamicNFT, deployer);

  const testERC1155 = await ethers.getContractAt("TestERC1155", tokenAddresses.TestERC1155, deployer);
  const upgradeableERC1155 = await ethers.getContractAt("UpgradeableERC1155", tokenAddresses.UpgradeableERC1155, deployer);

  // ✅ Fix `parseUnits` by explicitly referencing `ethers.utils`
  const amount = ethers.utils ? ethers.utils.parseUnits("1000", 18) : ethers.parseUnits("1000", 18);

  // Configure which spenders get which approvals
  const spenderConfig = {
    // Default spender gets all approvals
    MockSpender: {
      erc20: [tk1, tk2, permitToken, feeToken],
      erc721: [testNFT, upgradeableNFT, dynamicNFT],
      erc1155: [testERC1155, upgradeableERC1155]
    },
    // Bridge gets ERC20 and NFT approvals
    BridgeSpender: {
      erc20: [tk1, tk2, permitToken, feeToken],
      erc721: [testNFT, upgradeableNFT, dynamicNFT],
      erc1155: [testERC1155, upgradeableERC1155]
    },
    // DEX gets ERC20 approvals
    DexSpender: {
      erc20: [tk1, tk2, permitToken, feeToken],
      erc721: [],
      erc1155: []
    },
    // Lending gets ERC20 approvals
    LendingSpender: {
      erc20: [tk1, tk2, permitToken, feeToken],
      erc721: [],
      erc1155: []
    },
    // Misc gets small ERC20 approvals
    MiscSpender: {
      erc20: [tk1, tk2, permitToken, feeToken],
      erc721: [],
      erc1155: []
    },
    // NFT Marketplace gets NFT approvals
    NftMarketplaceSpender: {
      erc20: [],
      erc721: [testNFT, upgradeableNFT, dynamicNFT],
      erc1155: [testERC1155, upgradeableERC1155]
    }
  };

  const transactionHashes = [];

  // ✅ Approve ERC-20 tokens
  async function approveERC20(token, name, spenderName, spenderAddress) {
    console.log(`🔄 Approving ERC-20: ${name} for ${spenderName}...`);
    const tx = await token.approve(spenderAddress, amount);
    console.log(`✅ Approved ${name} for ${spenderName} | TX: ${tx.hash}`);
    await tx.wait();
    transactionHashes.push({ type: "ERC-20", asset: name, spender: spenderName, hash: tx.hash });
  }

  // ✅ Approve ERC-721 NFTs
  async function approveERC721(nft, name, spenderName, spenderAddress) {
    console.log(`🔄 Approving ERC-721: ${name} for ${spenderName}...`);
    const tx = await nft.setApprovalForAll(spenderAddress, true);
    console.log(`✅ Approved ${name} for ${spenderName} | TX: ${tx.hash}`);
    await tx.wait();
    transactionHashes.push({ type: "ERC-721", asset: name, spender: spenderName, hash: tx.hash });
  }

  // ✅ Approve ERC-1155 tokens
  async function approveERC1155(erc1155, name, spenderName, spenderAddress) {
    console.log(`🔄 Approving ERC-1155: ${name} for ${spenderName}...`);
    const tx = await erc1155.setApprovalForAll(spenderAddress, true);
    console.log(`✅ Approved ${name} for ${spenderName} | TX: ${tx.hash}`);
    await tx.wait();
    transactionHashes.push({ type: "ERC-1155", asset: name, spender: spenderName, hash: tx.hash });
  }

  // Process approvals for each available spender
  for (const [spenderName, spenderAddress] of Object.entries(availableSpenders)) {
    if (spenderConfig[spenderName]) {
      console.log(`\n📌 Processing approvals for ${spenderName}...`);
      
      // ERC-20 approvals
      const erc20Tokens = spenderConfig[spenderName].erc20;
      if (erc20Tokens.length > 0) {
        for (let i = 0; i < erc20Tokens.length; i++) {
          if (erc20Tokens[i] === tk1) {
            await approveERC20(tk1, "TK1", spenderName, spenderAddress);
          } else if (erc20Tokens[i] === tk2) {
            await approveERC20(tk2, "TK2", spenderName, spenderAddress);
          } else if (erc20Tokens[i] === permitToken) {
            await approveERC20(permitToken, "Permit Token", spenderName, spenderAddress);
          } else if (erc20Tokens[i] === feeToken) {
            await approveERC20(feeToken, "Fee Token", spenderName, spenderAddress);
          }
        }
      }
      
      // ERC-721 approvals
      const erc721Tokens = spenderConfig[spenderName].erc721;
      if (erc721Tokens.length > 0) {
        for (let i = 0; i < erc721Tokens.length; i++) {
          if (erc721Tokens[i] === testNFT) {
            await approveERC721(testNFT, "Test NFT", spenderName, spenderAddress);
          } else if (erc721Tokens[i] === upgradeableNFT) {
            await approveERC721(upgradeableNFT, "Upgradeable NFT", spenderName, spenderAddress);
          } else if (erc721Tokens[i] === dynamicNFT) {
            await approveERC721(dynamicNFT, "Dynamic NFT", spenderName, spenderAddress);
          }
        }
      }
      
      // ERC-1155 approvals
      const erc1155Tokens = spenderConfig[spenderName].erc1155;
      if (erc1155Tokens.length > 0) {
        for (let i = 0; i < erc1155Tokens.length; i++) {
          if (erc1155Tokens[i] === testERC1155) {
            await approveERC1155(testERC1155, "Test ERC-1155", spenderName, spenderAddress);
          } else if (erc1155Tokens[i] === upgradeableERC1155) {
            await approveERC1155(upgradeableERC1155, "Upgradeable ERC-1155", spenderName, spenderAddress);
          }
        }
      }
    }
  }

  console.log("\n🎉 All approvals completed successfully!");
  console.log(`📜 Total transactions: ${transactionHashes.length}`);
  
  // Write transaction summary to file
  const txSummaryPath = path.join(__dirname, "../approval-summary.json");
  fs.writeFileSync(
    txSummaryPath,
    JSON.stringify({
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      transactions: transactionHashes
    }, null, 2)
  );
  console.log(`📄 Transaction summary written to: ${txSummaryPath}`);
}

main().catch((error) => {
  console.error("❌ Approval Error:", error);
  process.exit(1);
});