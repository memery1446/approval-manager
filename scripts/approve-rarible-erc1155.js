const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();

  // Rarible's ERC-1155 contract
  const tokenAddress = "0xB66a603f4cFe17e3D27B87a8BfCaD319856518B8";

  // Rarible's proxy operator (can vary slightly; this is commonly used)
  const operatorAddress = "0xfac7bea255a6990f749363002136af6556b31e04"; // Rarible v2 operator

  console.log(`Setting approval for Rarible ERC-1155 contract ${tokenAddress}`);
  console.log(`Owner address: ${signer.address}`);
  console.log(`Operator address: ${operatorAddress}`);

  const erc1155Abi = [
    "function setApprovalForAll(address operator, bool approved) external",
    "function isApprovedForAll(address account, address operator) external view returns (bool)"
  ];

  const contract = new ethers.Contract(tokenAddress, erc1155Abi, signer);

  const isApproved = await contract.isApprovedForAll(signer.address, operatorAddress);
  console.log(`Current approval status: ${isApproved ? "Approved" : "Not approved"}`);

  if (isApproved) {
    console.log("✅ Already approved, no need to send transaction");
    return;
  }

  const feeData = await ethers.provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas * BigInt(2);
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(2);

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

  const newApprovalStatus = await contract.isApprovedForAll(signer.address, operatorAddress);
  console.log(`New approval status: ${newApprovalStatus ? "Approved" : "Not approved"}`);
}

main().catch(error => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
