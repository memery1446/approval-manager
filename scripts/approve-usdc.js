const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
  const spender = "0x11111112542d85b3ef69ae05771c2dccff4faa26"; // 1inch

  const token = await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
    tokenAddress,
    signer
  );

  const tx = await token.approve(
    spender,
    ethers.parseUnits("1000000", 6) // approve 1M USDC
  );

  await tx.wait();
  console.log("✅ Approved 1inch for USDC.");
}

main().catch(console.error);
