const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Oui Market Protocol", function () {
  let OuiScore, ouiScore, OuiEscrow, ouiEscrow, MockToken, cNGN;
  let owner, poster, doer, arbiter1, arbiter2, arbiter3, arbiter4, arbiter5, treasury;
  const initialAmount = ethers.parseEther("1000"); // 1000 cNGN
  const taskAmount = ethers.parseEther("100"); // 100 cNGN
  const disputeFee = ethers.parseEther("500");

  beforeEach(async function () {
    [owner, poster, doer, arbiter1, arbiter2, arbiter3, arbiter4, arbiter5, treasury] = await ethers.getSigners();

    // Deploy Mock cNGN
    const ERC20 = await ethers.getContractFactory("MockERC20");
    cNGN = await ERC20.deploy("Naira Stablecoin", "cNGN", 18);
    await cNGN.waitForDeployment();

    // Deploy OuiScore
    OuiScore = await ethers.getContractFactory("OuiScore");
    ouiScore = await OuiScore.deploy();
    await ouiScore.waitForDeployment();

    // Deploy OuiEscrow
    OuiEscrow = await ethers.getContractFactory("OuiEscrow");
    ouiEscrow = await OuiEscrow.deploy(await cNGN.getAddress(), await ouiScore.getAddress(), await treasury.getAddress());
    await ouiEscrow.waitForDeployment();

    // Authorize Escrow
    await ouiScore.authorizeContract(await ouiEscrow.getAddress());

    // Setup balances
    await cNGN.mint(poster.address, initialAmount);
    await cNGN.mint(doer.address, initialAmount);
    await cNGN.mint(arbiter1.address, initialAmount);
    await cNGN.mint(treasury.address, initialAmount);
  });

  describe("OuiScore", function () {
    it("Should initialize with Starter tier", async function () {
      expect(await ouiScore.getTier(poster.address)).to.equal(0); // STARTER
    });

    it("Should only allow authorized contracts to mutate scores", async function () {
      await expect(ouiScore.connect(poster).incrementCompletion(poster.address))
        .to.be.revertedWith("OuiScore: Not authorized");
    });
  });

  describe("OuiEscrow - Happy Path", function () {
    it("Should create, accept, submit, and approve a task", async function () {
      const escrowFee = (taskAmount * 15n) / 1000n;
      const platformFee = (taskAmount * 80n) / 1000n;

      // 1. Create
      await cNGN.connect(poster).approve(await ouiEscrow.getAddress(), taskAmount + escrowFee);
      await ouiEscrow.connect(poster).createTask(taskAmount, 3600);
      
      const task = await ouiEscrow.tasks(1);
      expect(task.state).to.equal(0); // OPEN

      // 2. Accept
      await ouiEscrow.connect(doer).acceptTask(1);
      expect((await ouiEscrow.tasks(1)).state).to.equal(1); // LOCKED

      // 3. Submit
      await ouiEscrow.connect(doer).submitWork(1);
      expect((await ouiEscrow.tasks(1)).state).to.equal(2); // SUBMITTED

      // 4. Approve
      const initialDoerBalance = await cNGN.balanceOf(doer.address);
      await ouiEscrow.connect(poster).approveWork(1);
      
      expect((await ouiEscrow.tasks(1)).state).to.equal(3); // APPROVED
      expect(await cNGN.balanceOf(doer.address)).to.equal(initialDoerBalance + taskAmount - platformFee);
      
      // Check score updates
      expect(await ouiScore.getScore(doer.address)).to.be.gt(0);
      expect(await ouiScore.getScore(poster.address)).to.be.gt(0);
    });
  });

  describe("OuiEscrow - Disputes", function () {
    it("Should resolve dispute via community voting", async function () {
      // Setup task
      await cNGN.connect(poster).approve(await ouiEscrow.getAddress(), ethers.parseEther("200"));
      await ouiEscrow.connect(poster).createTask(taskAmount, 3600);
      await ouiEscrow.connect(doer).acceptTask(1);
      await ouiEscrow.connect(doer).submitWork(1);

      // Raise dispute
      await cNGN.connect(poster).approve(await ouiEscrow.getAddress(), disputeFee);
      await ouiEscrow.connect(poster).raiseDispute(1);

      // Setup arbiters (need Diamond tier)
      // For testing, we'll manually recalculate scores or just mock the threshold check
      // In a real test we'd perform enough tasks to reach Diamond
      // For this script, let's authorize owner to manually bump scores
      await ouiScore.authorizeContract(owner.address);
      const arbiters = [arbiter1, arbiter2, arbiter3, arbiter4, arbiter5];
      for (let arb of arbiters) {
        for(let i=0; i<80; i++) await ouiScore.incrementCompletion(arb.address); // Reach 800+
      }

      // Voting
      for (let i = 0; i < 3; i++) {
        // Treasury needs to approve escrow to pay arbiters
        await cNGN.connect(treasury).approve(await ouiEscrow.getAddress(), ethers.parseEther("1000"));
        await ouiEscrow.connect(arbiters[i]).castDisputeVote(1, true); // Vote for doer
      }
      for (let i = 3; i < 5; i++) {
        await ouiEscrow.connect(arbiters[i]).castDisputeVote(1, false); // Vote for poster
      }

      expect((await ouiEscrow.tasks(1)).state).to.equal(5); // RESOLVED
    });
  });
});
