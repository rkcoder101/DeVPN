const { ethers } = require("ethers");
const socks5 = require('socksv5');

// ----- CONFIGURATION -----
const VPNMarketplaceAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; 
const VPNMarketplaceABI = require('../../../artifacts/contracts/VPNMarketplace.sol/VPNMarketplace.json').abi;

// Connect to the local Hardhat node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Get the signer (second account)
async function getSigner() {  
  const signer = await provider.getSigner(1); // Use account index 1
  console.log("Signer address:", await signer.getAddress());
  return signer;
}

// Register the provider with the smart contract
async function registerProvider(bandwidth) {
  try {
    const signer = await getSigner();
    const vpnMarketplace = new ethers.Contract(VPNMarketplaceAddress, VPNMarketplaceABI, signer);

    console.log("Registering provider...");
    const tx = await vpnMarketplace.registerProvider(bandwidth);
    await tx.wait();
    console.log(`Provider registered with bandwidth: ${bandwidth}`);
  } catch (error) {
    console.error("Registration failed:", error);
  }
}

// Start the SOCKS5 proxy server
const server = socks5.createServer((info, accept, deny) => {
  console.log(`Incoming connection from ${info.srcAddr}:${info.srcPort}`);
  accept();
});

server.useAuth(socks5.auth.None());
server.listen(1080, '0.0.0.0', () => {
  console.log("SOCKS5 proxy server running on port 1080");
});

// Register the provider on startup
registerProvider(100);