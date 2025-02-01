const { expect } = require("chai");

describe("VPNMarketplace", function () {
  let BANDToken, bandToken, VPNMarketplace, vpnMarketplace;
  let owner, provider, consumer;

  before(async function () {
    [owner, provider, consumer] = await ethers.getSigners();

    // Deploy BANDToken
    BANDToken = await ethers.getContractFactory("BANDToken");
    bandToken = await BANDToken.deploy(1000000); // 1 million tokens
    console.log("BANDToken deployed to:", bandToken.target); // Use .target instead of .address in ethers.js v6

    // Deploy VPNMarketplace
    VPNMarketplace = await ethers.getContractFactory("VPNMarketplace");
    vpnMarketplace = await VPNMarketplace.deploy(bandToken.target); // Use .target instead of .address
    console.log("VPNMarketplace deployed to:", vpnMarketplace.target);
    console.log("BANDToken address used:", bandToken.target);

    // Transfer some tokens to the consumer
    await bandToken.transfer(consumer.address, 100);
  });

  it("Should register a provider", async function () {
    await vpnMarketplace.connect(provider).registerProvider(100);
    const registeredProvider = await vpnMarketplace.providers(provider.address);
    expect(registeredProvider.addr).to.equal(provider.address);
    expect(registeredProvider.bandwidth).to.equal(100);
  });

  it("Should allow a consumer to pay a provider", async function () {
    // Approve the VPNMarketplace to spend the consumer's tokens
    await bandToken.connect(consumer).approve(vpnMarketplace.target, 10);

    // Pay the provider
    await vpnMarketplace.connect(consumer).payProvider(provider.address, 10);

    // Check balances
    const providerBalance = await bandToken.balanceOf(provider.address);
    const consumerBalance = await bandToken.balanceOf(consumer.address);

    expect(providerBalance).to.equal(10); // Provider received 10 tokens
    expect(consumerBalance).to.equal(90); // Consumer spent 10 tokens
  });
});