const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const tokenAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; // UNI
  const spender = "0x11111112542d85b3ef69ae05771c2dccff4faa26"; // 1inch

  const token = await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
    tokenAddress,
    signer
  );

  // Get current gas price and add a buffer
  const feeData = await ethers.provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas * BigInt(2); // Double it to be safe
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(2);

  const tx = await token.approve(
    spender,
    ethers.parseUnits("1000000", 18), // approve 1M UNI
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    }
  );

  await tx.wait();
  console.log("✅ Approved 1inch for UNI.");
}

main().catch(console.error);