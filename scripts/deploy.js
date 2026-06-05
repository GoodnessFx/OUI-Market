const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of Oui Market Contracts...");

  // 1. Deploy OuiScore
  const OuiScore = await hre.ethers.getContractFactory("OuiScore");
  const ouiScore = await OuiScore.deploy();
  await ouiScore.waitForDeployment();
  const ouiScoreAddress = await ouiScore.getAddress();
  console.log(`OuiScore deployed to: ${ouiScoreAddress}`);

  // 2. Deploy OuiEscrow
  const cNGNAddress = process.env.CNGN_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000"; // Replace with actual or mock
  const treasuryAddress = process.env.TREASURY_ADDRESS || "0x0000000000000000000000000000000000000000";
  
  const OuiEscrow = await hre.ethers.getContractFactory("OuiEscrow");
  const ouiEscrow = await OuiEscrow.deploy(cNGNAddress, ouiScoreAddress, treasuryAddress);
  await ouiEscrow.waitForDeployment();
  const ouiEscrowAddress = await ouiEscrow.getAddress();
  console.log(`OuiEscrow deployed to: ${ouiEscrowAddress}`);

  // 3. Authorize OuiEscrow in OuiScore
  console.log("Authorizing OuiEscrow in OuiScore...");
  await ouiScore.authorizeContract(ouiEscrowAddress);
  console.log("Authorization complete.");

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log(`OuiScore: ${ouiScoreAddress}`);
  console.log(`OuiEscrow: ${ouiEscrowAddress}`);
  console.log(`cNGN Token: ${cNGNAddress}`);
  console.log(`Treasury: ${treasuryAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
