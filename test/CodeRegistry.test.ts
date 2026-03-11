import { expect } from "chai";
import hre from "hardhat";

describe("CodeRegistry", function () {
  let codeRegistry: any;
  let owner: any;

  beforeEach(async function () {
    const CodeRegistry = await hre.ethers.getContractFactory("CodeRegistry");
    codeRegistry = await CodeRegistry.deploy();
    [owner] = await hre.ethers.getSigners();
  });

  describe("Register Code", function () {
    it("Should register a code hash successfully", async function () {
      const hash = "abc123def456";
      const metadata = JSON.stringify({ 
        projectName: "Test Project", 
        description: "A test code" 
      });

      await expect(codeRegistry.registerCode(hash, metadata))
        .to.emit(codeRegistry, "CodeRegistered")
        .withArgs(hash, owner.address, expect.any(Number), metadata);
    });

    it("Should prevent duplicate hash registration", async function () {
      const hash = "abc123def456";
      const metadata = JSON.stringify({ projectName: "Test" });

      await codeRegistry.registerCode(hash, metadata);

      await expect(
        codeRegistry.registerCode(hash, metadata)
      ).to.be.revertedWith("Code hash already registered");
    });

    it("Should reject empty hash", async function () {
      const metadata = JSON.stringify({ projectName: "Test" });

      await expect(
        codeRegistry.registerCode("", metadata)
      ).to.be.revertedWith("Hash cannot be empty");
    });

    it("Should reject empty metadata", async function () {
      const hash = "abc123def456";

      await expect(
        codeRegistry.registerCode(hash, "")
      ).to.be.revertedWith("Metadata cannot be empty");
    });
  });

  describe("Verify Code", function () {
    it("Should verify a registered code hash", async function () {
      const hash = "abc123def456";
      const metadata = JSON.stringify({ projectName: "Test" });

      await codeRegistry.registerCode(hash, metadata);

      const [author, timestamp, returnedMetadata] =
        await codeRegistry.verifyCode(hash);

      expect(author).to.equal(owner.address);
      expect(returnedMetadata).to.equal(metadata);
      expect(timestamp).to.be.greaterThan(0);
    });

    it("Should fail to verify unregistered hash", async function () {
      const hash = "nonexistent";

      await expect(
        codeRegistry.verifyCode(hash)
      ).to.be.revertedWith("Code hash not found");
    });
  });

  describe("Check Registration Status", function () {
    it("Should return true for registered hash", async function () {
      const hash = "abc123def456";
      const metadata = JSON.stringify({ projectName: "Test" });

      await codeRegistry.registerCode(hash, metadata);

      const isRegistered = await codeRegistry.isCodeRegistered(hash);
      expect(isRegistered).to.be.true;
    });

    it("Should return false for unregistered hash", async function () {
      const isRegistered = await codeRegistry.isCodeRegistered("nonexistent");
      expect(isRegistered).to.be.false;
    });
  });

  describe("Registration Count", function () {
    it("Should track registration count correctly", async function () {
      const metadata = JSON.stringify({ projectName: "Test" });

      expect(await codeRegistry.getRegistrationCount()).to.equal(0);

      await codeRegistry.registerCode("hash1", metadata);
      expect(await codeRegistry.getRegistrationCount()).to.equal(1);

      await codeRegistry.registerCode("hash2", metadata);
      expect(await codeRegistry.getRegistrationCount()).to.equal(2);
    });
  });
});
