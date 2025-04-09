const { ethers } = require("hardhat");

async function main() {
  // Input address (we'll get the correct checksum format)
  const inputAddress = "0x0dB30c6cC6440E2B534D06edF2969fcaEd1C6B2B";
  const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
  const spender = "0x11111112542d85b3ef69ae05771c2dccff4faa26"; // 1inch
  
  // Get the default signer
  const [signer] = await ethers.getSigners();
  
  // Get the correct checksum format - rather than validating, we'll just convert
  let whaleAddress;
  try {
    // This will throw an error if the address is invalid
    whaleAddress = ethers.getAddress(inputAddress.toLowerCase());
    console.log(`✅ Converted to checksum address: ${whaleAddress}`);
  } catch (error) {
    console.error(`❌ Invalid address format: ${inputAddress}`);
    return;
  }
  
  // Fund the whale with ETH
  console.log(`💸 Funding whale address with ETH...`);
  const fundTx = await signer.sendTransaction({
    to: whaleAddress,
    value: ethers.parseEther("10")
  });
  await fundTx.wait();
  console.log(`✅ Funded whale with 10 ETH: ${fundTx.hash}`);
  
  // Now get the USDC token contract and approve
  const token = await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
    tokenAddress,
    signer
  );
  
  // Get current gas price and add a buffer
  const feeData = await ethers.provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas * BigInt(2); // Double it to be safe
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(2);
  
  // Approve USDC for 1inch
  console.log(`🔑 Approving 1inch to spend USDC...`);
  const tx = await token.approve(
    spender,
    ethers.parseUnits("1000000", 6), // approve 1M USDC
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    }
  );
  
  await tx.wait();
  console.log(`✅ Approved 1inch for USDC. Transaction: ${tx.hash}`);
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});