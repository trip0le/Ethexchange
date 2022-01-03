import React, { useState, useEffect } from "react";
import BankingContract from "../../contracts/Banking.json";
import getWeb3 from "../../getWeb3";
import bankImg from "../assets/profile.png";

import "./CreateAccount.css";

const CreateAccount = () => {
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
      console.log(contract);
      console.log(account);
      web3.eth.defaultAccount = account;
      getContractDetails();
    }
  }, [web3, account, contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(contract.methods);
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      await contract.methods
        .createAccount(account, accountHolder, accountLocation)
        .send({
          from: account,
          to: contract.options.address,
          value: web3.utils.toWei("2", "ether"),
        })
        .then((res) => {
          console.log(res);
          window.location.href = "/accounts";
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  if (!web3) {
    return <div>Loading web3, accounts, and contracts...</div>;
  }
  return (
    // <div className="create-account">
    //   <div className="form-wrapper-container">
    //     <div className="form-wrapper">
    //       <h1>REGISTER HERE</h1>
    //       <h2>
    //         Your main ethereum wallet will be deducted with 2 ETH by default
    //         when you open an account and this 2ETH will be deposited in your
    //         bank account.
    //       </h2>
    //       <form onSubmit={handleSubmit} className="create-form">
    //         <input
    //           className="form-input-field"
    //           type="text"
    //           placeholder="Name of the Account Holder"
    //           value={accountHolder}
    //           onChange={(e) => {
    //             setAccountHolder(e.target.value);
    //           }}
    //         ></input>
    //         <input
    //           className="form-input-field"
    //           type="text"
    //           placeholder="Home Address of the Account Holder"
    //           value={accountLocation}
    //           onChange={(e) => {
    //             setAccountLocation(e.target.value);
    //           }}
    //         ></input>
    //         <button className="submit-button" type="submit">
    //           CREATE A NEW ACCOUNT
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <section>
      <div className="imgBx">
        <img src={bankImg} alt=""></img>
      </div>
      <div className="contentBx">
        <div className="formBx">
          <h2>REGISTER</h2>
          <form onSubmit={handleSubmit}>
            <div className="inputBx">
              <span>Name</span>
              <input
                className="form-input-field"
                type="text"
                placeholder="Name"
                value={accountHolder}
                onChange={(e) => {
                  setAccountHolder(e.target.value);
                }}
              ></input>
            </div>
            <div className="inputBx">
              <span>Account Address</span>
              <input
                className="form-input-field"
                type="text"
                placeholder="Account Address"
                value={accountLocation}
                onChange={(e) => {
                  setAccountLocation(e.target.value);
                }}
              ></input>
            </div>
            <div className="inputBx">
              <input type="submit" value="Create Account" name=""></input>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateAccount;
