const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const tokenAddress = "0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E"; // FLOKI
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
    ethers.parseUnits("1000000", 9), // approve 1M FLOKI (9 decimals)
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    }
  );

  await tx.wait();
  console.log("✅ Approved 1inch for FLOKI.");
}

main().catch(console.error);


