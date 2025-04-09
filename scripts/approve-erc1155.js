const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  
  // Use a well-known ERC-1155 contract - OpenSea's Shared Storefront
  // This will be visible by your approval-manager scanner
  const tokenAddress = "0x495f947276749Ce646f68AC8c248420045cb7b5e"; 
  
  // OpenSea's proxy contract - a common ERC-1155 operator
  const operatorAddress = "0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101";
  
  console.log(`Setting approval for ERC-1155 contract ${tokenAddress}`);
  console.log(`Owner address: ${signer.address}`);
  console.log(`Operator address: ${operatorAddress}`);
  
  // ERC-1155 interface with just the functions we need
  const erc1155Abi = [
    "function setApprovalForAll(address operator, bool approved) external",
    "function isApprovedForAll(address account, address operator) external view returns (bool)"
  ];
  
  const contract = new ethers.Contract(tokenAddress, erc1155Abi, signer);
  
  // Check current approval status
  const isApproved = await contract.isApprovedForAll(signer.address, operatorAddress);
  console.log(`Current approval status: ${isApproved ? "Approved" : "Not approved"}`);
  
  if (isApproved) {
    console.log("✅ Already approved, no need to send transaction");
    return;
  }
  
  // Get current gas price and add a buffer
  const feeData = await ethers.provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas * BigInt(2);
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(2);
  
  // Set approval for all tokens
  console.log("Setting approval for all tokens...");
  const tx = await contract.setApprovalForAll(
    operatorAddress,
    true,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    }
  );
  
  console.log(`Transaction sent: ${tx.hash}`);
  await tx.wait();
  console.log(`✅ Approval set successfully`);
  
  // Verify approval was set correctly
  const newApprovalStatus = await contract.isApprovedForAll(signer.address, operatorAddress);
  console.log(`New approval status: ${newApprovalStatus ? "Approved" : "Not approved"}`);
}

main().catch(error => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
