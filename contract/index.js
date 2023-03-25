const ethers = require("ethers");
const tabCompileResult = require("./artifacts/contracts/TAB.sol/TAB.json");
class TAB {
  constructor(address, signerOrProvider) {
    this.address = address;
    this.contract = new ethers.Contract(
      address,
      tabCompileResult.abi,
      signerOrProvider
    );
  }

  async setTab(slot, address, blockHash) {
    return await this.contract.setTab(slot, address, blockHash);
  }

  async setTabs(slot, addresses, blockHashs) {
    return await this.contract.setTabs(slot, addresses, blockHashs);
  }

  async hasBlock(slot, address, blockHash) {
    return await this.contract.hasBlock(slot, address, blockHash);
  }
}
module.exports = TAB;
