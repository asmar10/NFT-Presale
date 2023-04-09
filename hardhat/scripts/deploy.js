
const hre = require("hardhat");
require("dotenv").config()

const { metdataURL, whitelistAdd } = require("../constants/index.js")

async function main() {

  const CryptoDevs = await hre.ethers.getContractFactory("CryptoDevs");
  const cryptodevs = await CryptoDevs.deploy(metdataURL, whitelistAdd)
  await cryptodevs.deployed()

  console.log("cryptodevs deployed at: ", cryptodevs.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
