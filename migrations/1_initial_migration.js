const Migrations1 = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations1);
};
