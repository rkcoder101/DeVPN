// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Deploy BANDToken
  const BANDToken = await hre.ethers.getContractFactory("BANDToken");
  const bandToken = await BANDToken.deploy();
  await bandToken.waitForDeployment();
  console.log("BANDToken deployed to:", await bandToken.getAddress());

  // Deploy VPNMarketplace
  const VPNMarketplace = await hre.ethers.getContractFactory("VPNMarketplace");
  const vpnMarketplace = await VPNMarketplace.deploy(bandToken.getAddress());
  await vpnMarketplace.waitForDeployment();
  console.log("VPNMarketplace deployed to:", await vpnMarketplace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});