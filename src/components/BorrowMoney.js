import React, { useState } from "react";
import Web3 from "web3";
import LendingPlatform from "../abis/LendingPlatform.json";
import "./BorrowMoney.css";

const BorrowMoney = () => {
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBorrow = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      setLoading(false);
      return;
    }

    if (!interestRate || isNaN(interestRate) || Number(interestRate) <= 0) {
      setError("Please enter a valid interest rate.");
      setLoading(false);
      return;
    }

    try {
      // Check for Web3 provider
      if (window.ethereum) {
        await window.ethereum.enable(); // Request account access if needed
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const networkData = LendingPlatform.networks[networkId];

        if (networkData) {
          const lendingPlatform = new web3.eth.Contract(
            LendingPlatform.abi,
            networkData.address
          );
          await lendingPlatform.methods
            .requestLoan(web3.utils.toWei(amount, "ether"), interestRate)
            .send({ from: accounts[0] });
          alert("Loan request created!");
        } else {
          setError("Smart contract not deployed to detected network.");
        }
      } else {
        setError("MetaMask is not installed or not detected.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="borrow-money">
      <h2>Borrow Money</h2>
      <form onSubmit={handleBorrow}>
        <div>
          <label>Amount (ETH): </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label>Interest Rate (%): </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Borrow"}
        </button>
      </form>
    </div>
  );
};

export default BorrowMoney;
