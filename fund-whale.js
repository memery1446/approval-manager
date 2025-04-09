const { ethers } = require("hardhat");

async function main() {
  const [sender] = await ethers.getSigners();
  const whale = "0xfe9e8709d3215310075d67e3ed32a380ccf451c8";

  const tx = await sender.sendTransaction({
    to: whale,
    value: ethers.parseEther("2.0"),
  });

  await tx.wait();
  console.log("✅ Funded RFI whale with 2 ETH");
}

main().catch(console.error);
