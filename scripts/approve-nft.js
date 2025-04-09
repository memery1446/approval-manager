const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();

  // Your deployed TestNFT address (already in deployedAddresses.json)
  const tokenAddress = "0x6484EB0792c646A4827638Fc1B6F20461418eB00";
  const tokenId = 1; // Minted to deployer (signer)
  const spender = "0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101"; // Your UI or mock approval target

  console.log(`🔐 Approving ${spender} for TestNFT #${tokenId}`);

  const abi = [
    "function approve(address to, uint256 tokenId) external",
    "function getApproved(uint256 tokenId) view returns (address)"
  ];

  const nft = new ethers.Contract(tokenAddress, abi, signer);

  const currentApproval = await nft.getApproved(tokenId);
  console.log(`👁 Current approved: ${currentApproval}`);

  if (currentApproval.toLowerCase() === spender.toLowerCase()) {
    console.log("✅ Already approved — skipping transaction");
    return;
  }

  const tx = await nft.approve(spender, tokenId);
  console.log(`⛓ Sent TX: ${tx.hash}`);
  await tx.wait();

  const finalApproval = await nft.getApproved(tokenId);
  console.log(`✅ Final approved address: ${finalApproval}`);
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
