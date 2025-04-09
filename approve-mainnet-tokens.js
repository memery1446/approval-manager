const { ethers, network } = require("hardhat");

const TOKENS = {
  USDC: {
    name: "USDC",
    tokenAddress: ethers.getAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
    whale: ethers.getAddress("0x28C6c06298d514Db089934071355E5743bf21d60")
  },
  DAI: {
    name: "DAI",
    tokenAddress: ethers.getAddress("0x6B175474E89094C44Da98b954EedeAC495271d0F"),
    whale: ethers.getAddress("0x28C6c06298d514Db089934071355E5743bf21d60")
  },
  RFI: {
    name: "RFI",
    tokenAddress: ethers.getAddress("0x6f259637dcd74c767781e37bc6133cd6a68aa161"),
    whale: ethers.getAddress("0xfe9e8709d3215310075d67e3ed32a380ccf451c8")
  }
};

const spender = ethers.getAddress("0x11111112542d85b3ef69ae05771c2dccff4faa26"); // 1inch

async function approve(tokenKey) {
  const { tokenAddress, whale, name } = TOKENS[tokenKey];

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

  console.log(`⏳ Approving ${name}...`);

  try {
    const tx = await token.approve(
      spender,
      ethers.parseUnits("1000000", 18), // 18 decimals for DAI/RFI
      {
        maxFeePerGas: ethers.parseUnits("40", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
      }
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log(`✅ Approved ${name} to ${spender}`);
    } else {
      console.error(`❌ ${name} approval failed:`, receipt);
    }
  } catch (err) {
    console.error(`❌ Error approving ${name}:`, err.message);
  }
}

async function main() {
  await approve("USDC");
  await approve("DAI");
  await approve("RFI");
}

main().catch(console.error);
