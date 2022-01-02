var Banking = artifacts.require("./Banking.sol");

module.exports = function(deployer) {
  deployer.deploy(Banking);
};
