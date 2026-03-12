/// <reference types="hardhat/types" />
import hre from "hardhat";

async function main() {
  console.log("Deploying CodeRegistry contract...");

  const codeRegistry = await hre.ethers.deployContract("CodeRegistry");
  await codeRegistry.waitForDeployment();

  const contractAddress = await codeRegistry.getAddress();
  console.log(`✓ CodeRegistry deployed to: ${contractAddress}`);
  console.log(`\nSave this address in your .env file as NEXT_PUBLIC_CONTRACT_ADDRESS`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
