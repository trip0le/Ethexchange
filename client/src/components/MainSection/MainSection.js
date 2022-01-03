import React, { useState, useEffect } from "react";
import BankingContract from "../../contracts/Banking.json";
import getWeb3 from "../../getWeb3";
import bankImg from "../assets/bank.svg"

import "./MainSection.css";

const MainSection = () => {
  const [contract, setContract] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);

  const [accountHolder, setAccountHolder] = useState("");
  const [accountLocation, setAccountLocation] = useState("");

  useEffect(() => {
    const getBasicDetails = async () => {
      try {
        // Get network provider and web3 instance.*
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.*
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.*
        const networkId = await web3.eth.net.getId();

        const deployedNetwork = BankingContract.networks[networkId];

        console.log(deployedNetwork.address);

        const instance = new web3.eth.Contract(
          BankingContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3);
        setAccount(accounts[0]);
        setContract(instance);
      } catch (error) {
        // Catch any errors for any of the above operations.*
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    getBasicDetails();
  }, []);

  useEffect(() => {
    const getContractDetails = async () => {};
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      localStorage.setItem("logged", true);
      getContractDetails();
    }
  }, [web3, account, contract]);

  if (!web3) {
    return <div>Loading web3, accounts, and contracts...</div>;
  }
  return (
    <div className="i">
      <div className="i-left">
        <div className="i-left-wrapper">
          <h2 className="i-introduction">Welcome to</h2>
          <h1 className="i-name">Ethexchange</h1>
          <div className="i-title">
            <div className="i-title-wrapper">
              <div className="i-title-item">Deposit</div>
              <div className="i-title-item">Transact</div>
            </div>
          </div>
          <p className="i-desc">
            With Ethexchange - A Banking System based on Ethereum Blockchain, transfer money in a secure, smooth and hassle-free manner. Buckle up for a great user experience ahead!
          </p>
          <button className="get-started"><a href="/create">GET STARTED</a></button>
        </div>
      </div>
      <div className="i-right">
        <div className="i-bg"></div>
        <img src={bankImg} alt="" className="i-img"></img>
      </div>
    </div>
  );
};

export default MainSection;
