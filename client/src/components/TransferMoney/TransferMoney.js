import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BankingContract from "../../contracts/Banking.json";
import getWeb3 from "../../getWeb3";
import bankImg from "../assets/payment.png";
import "./TransferMoney.css";

const TransferMoney = () => {
  const [contract, setContract] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);

  const [transferAmount, setTransferAmount] = useState("");
  const [transferSerial, setTransferSerial] = useState("");

  const { id } = useParams();
  useEffect(() => {
    const getBasicDetails = async () => {
      try {
        const web3 = await getWeb3();

        const accounts = await web3.eth.getAccounts();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = BankingContract.networks[networkId];
        const instance = new web3.eth.Contract(
          BankingContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3);
        setAccount(accounts[0]);
        setContract(instance);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    getBasicDetails();
  });

  useEffect(() => {
    const getContractDetails = async () => {};
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      getContractDetails();
    }
  }, []);

  const handleTransaction = async (e) => {
    e.preventDefault(
      await contract.methods
        .transactAmount(
          web3.utils.toWei(transferAmount, "ether"),
          transferSerial,
          id
        )
        .send({ from: account, to: contract.options.address })

        .then((res) => {
          console.log("Received");
          setTransferAmount("")
          setTransferSerial("");
        })
        
        .catch((err) => {
          console.log(err);
        })
    );
  };

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <section>
      <div className="imgBx">
        <img src={bankImg} alt=""></img>
      </div>
      <div className="contentBx">
        <div className="formBx">
          <h2>TRANSFER MONEY</h2>
          <form onSubmit={handleTransaction}>
            <div className="inputBx">
              <span>Amount</span>
              <input
                className="form-input-field"
                type="text"
                placeholder="Enter Amount"
                value={transferAmount}
                onChange={(e) => {
                  setTransferAmount(e.target.value);
                }}
              ></input>
            </div>
            <div className="inputBx">
              <span>Account id</span>
              <input
                className="form-input-field"
                type="text"
                placeholder="Enter account id"
                value={transferSerial}
                onChange={(e) => {
                  setTransferSerial(e.target.value);
                }}
              ></input>
            </div>
            <div className="inputBx">
              <input type="submit" value="Initiate Transfer" name=""></input>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TransferMoney;
