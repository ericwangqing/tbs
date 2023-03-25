const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const TAB = require("../index.js");
describe("TAB", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [account1, account2, account3, account4, account5] =
      await ethers.getSigners();

    const TAB = await ethers.getContractFactory("TAB");
    const tab = await TAB.deploy();

    return { tab, account1, account2, account3, account4, account5 };
  }

  it("set tab", async function () {
    const { tab, account1 } = await loadFixture(deployFixture);
    expect(
      await tab.setTab(100, account1.address, ethers.utils.randomBytes(32))
    ).not.to.be.reverted;
  });

  it("set tabs", async function () {
    const { tab, account1, account2, account3, account4, account5 } =
      await loadFixture(deployFixture);
    expect(
      await tab.setTabs(
        100,
        [
          account1.address,
          account2.address,
          account3.address,
          account4.address,
          account5.address,
        ],
        [
          ethers.utils.randomBytes(32),
          ethers.utils.randomBytes(32),
          ethers.utils.randomBytes(32),
          ethers.utils.randomBytes(32),
          ethers.utils.randomBytes(32),
        ]
      )
    ).not.to.be.reverted;
  });

  it("hasBlock", async function () {
    const { tab, account1 } = await loadFixture(deployFixture);
    const blockHash = ethers.utils.randomBytes(32);
    await tab.setTab(100, account1.address, blockHash);
    expect(await tab.hasBlock(100, account1.address, blockHash)).to.be.true;
    expect(
      await tab.hasBlock(100, account1.address, ethers.utils.randomBytes(32))
    ).to.be.false;
  });

  it("module TAB", async function () {
    // contract instance
    const { tab, account1 } = await loadFixture(deployFixture);
    const tabContract = new TAB(tab.address, account1);
    expect(
      await tabContract.setTab(
        100,
        account1.address,
        ethers.utils.randomBytes(32)
      )
    ).not.to.be.reverted;
  });
});
