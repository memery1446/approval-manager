const { ethers, network } = require("hardhat");

async function main() {
  const [receiver] = await ethers.getSigners();
  console.log("Receiver address:", receiver.address);

  const whale = ethers.getAddress("0x28C6c06298d514Db089934071355E5743bf21d60");

  // Resolve checksum **dynamically and correctly**
  const tokenAddress = ethers.getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [whale],
  });

  const signer = await ethers.getSigner(whale);

  const token = await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
    tokenAddress,
    signer
  );

const tx = await token.transfer(
  receiver.address,
  ethers.parseUnits("1000", 6),
  {
    maxFeePerGas: ethers.parseUnits("40", "gwei"),           // reasonable for fork
    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")     // normal tip
  }
);
await tx.wait();


  const balance = await token.balanceOf(receiver.address);
  console.log("✅ USDC balance of dev wallet:", ethers.formatUnits(balance, 6));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
