const SocksClient = require('socks').SocksClient;
const { ethers } = require("ethers");

//--------------------- Configurations ------------------------
const BANDTokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";      
const VPNMarketplaceAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const BANDTokenABI = require('../../../artifacts/contracts/BANDToken.sol/BANDToken.json').abi;
const VPNMarketplaceABI = require('../../../artifacts/contracts/VPNMarketplace.sol/VPNMarketplace.json').abi;

// Connect to the local Hardhat node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Get the signer (first account as the Consumer)
async function getSigner() {  
  return provider.getSigner(0); // Use account index 0 (first account)
}

// Function to pay the Provider via the VPNMarketplace contract
async function payProvider(providerAddress, amount) {
  try {
    const signer = await getSigner();
    const bandToken = new ethers.Contract(BANDTokenAddress, BANDTokenABI, signer);
    const vpnMarketplace = new ethers.Contract(VPNMarketplaceAddress, VPNMarketplaceABI, signer);

    // Approve the VPNMarketplace to spend tokens
    console.log("Approving tokens...");
    const approveTx = await bandToken.approve(VPNMarketplaceAddress, amount);
    await approveTx.wait();
    console.log("Approval successful.");

    // Pay the Provider
    console.log("Paying provider...");
    const payTx = await vpnMarketplace.payProvider(providerAddress, amount);
    await payTx.wait();
    console.log(`Paid ${amount} tokens to ${providerAddress}`);
  } catch (error) {
    console.error("Payment failed:", error);
    throw error; // Re-throw to halt execution if payment fails
  }
}

//--------------------- P2P Connection ------------------------
const providerIP = 'localhost';
const providerPort = 1080;

// Consumer configuration for SOCKS5 proxy
const consumerConfig = {
  proxy: {
    host: providerIP,
    port: providerPort,
    type: 5, // SOCKS5    
  },
  command: 'connect',
  destination: {
    host: 'httpbin.org', // Target server
    port: 80 // HTTP port
  }
};

// Connect to the Provider
const connectToProvider = async () => {
  try {
    // Pay the Provider with 10 tokens
    await payProvider("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 10);

    // Establish SOCKS5 connection
    const { socket } = await SocksClient.createConnection(consumerConfig);
    console.log('Connected to Provider!');

    
    const httpRequest = [
      'GET / HTTP/1.1',
      'Host: httpbin.org',
      'Connection: close',
      '', // End of headers
      ''  // End of request
    ].join('\r\n');

    socket.write(httpRequest);

    // Handle response
    socket.on('data', (data) => {
      console.log('Received:', data.toString());
    });

    socket.on('close', () => {
      console.log('Connection closed.');
    });
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

connectToProvider();