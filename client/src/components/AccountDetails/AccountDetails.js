import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BankingContract from "../../contracts/Banking.json";
import getWeb3 from "../../getWeb3";
import Loader from "react-loader-spinner";
import "./AccountDetails.css";

const AccountDetails = () => {
  const [contract, setContract] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [contractAddress, setContractAddress] = useState(undefined);

  const [bankingAccount, setBankingAccount] = useState(undefined);
  const [createdDate, setCreatedDate] = useState(undefined);

  const [loading, setLoading] = useState(true);
  const [bankingAccountBalance, setBankingAccountBalance] = useState(undefined);

  const [balanceAdded, setBalanceAdded] = useState("");

  const [balanceWithdrawn, setBalanceWithdrawn] = useState("");

  const { id } = useParams();

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
        setContractAddress(deployedNetwork.address);
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
  });

  useEffect(() => {
    const getContractDetails = async () => {
      // console.log("Done");

      await contract.methods
        .accounts(id)
        .call()
        .then((res) => {
          setBankingAccount(res);
          setBankingAccountBalance(res.balance);

          setCreatedDate(new Date(res.createdAt * 1000).toLocaleString());

          // console.log("Done");
          // console.log("Done");
        })
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });

      await contract.methods
        .getContractBalance()
        .call()
        .then((res) => {
          // console.log("Done");
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      // console.log(contract);
      // console.log(contract.options.address);
      // console.log(contractAddress);
      getContractDetails();
    }
  });

  const addBalance = async (e) => {
    e.preventDefault();
    // console.log(`${id}`);
    // console.log(balanceAdded);
    // console.log("add");

    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      await contract.methods
        .addBalance(id, web3.utils.toWei(balanceAdded, "ether"), account)
        .send({ from: account, value: web3.utils.toWei(balanceAdded, "ether") })

        .then(async (res) => {
          await contract.methods
            .accounts(id)
            .call()
            .then((res) => {
              setBankingAccountBalance(res.balance);
            })
            .catch((err) => {
              console.log(err);
            });
          console.log(res);
          setBalanceAdded("");
        });
    }
  };

  const withdrawBalance = async (e) => {
    e.preventDefault();
    console.log(`${id}`);
    console.log(balanceWithdrawn);
    console.log("withdraw");
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      console.log(contract.options.address);

      await contract.methods
        .withdrawBalance(
          id,
          web3.utils.toWei(balanceWithdrawn, "ether"),
          account
        )
        .send({ from: account, to: contract.options.address })
        .then(async (res) => {
          await contract.methods
            .accounts(id)
            .call()
            .then((res) => {
              setBankingAccountBalance(res.balance);
            })
            .catch((err) => {
              console.log(err);
            });
          console.log(res);
          setBalanceWithdrawn("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (!web3) {
    return (
      <div className="default">
        <Loader
          type="TailSpin"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={10000}
        />
      </div>
    );
  }
  return (
    <div className="account-details-section">
      <div className="account-details-grid-wrapper">
        <div className="account-card flex">
          {!loading ? (
            <div className="inner-wrapper">
              <h3>Account No. : {id}</h3>
              <h3>Account Holder : {bankingAccount.name}</h3>
              <h3>Account Balance : {bankingAccountBalance} ETH</h3>
              <h3>Account Location : {bankingAccount.location}</h3>
              <h3>Account Created At : {createdDate}</h3>
            </div>
          ) : null}
        </div>
        <div className="add-balance-card flex">
          <div classname="inner-wrapper2">
            <h3>Add Balance to your account</h3>
            <div className="child">
              <form onSubmit={addBalance} className="transact-form">
                <input
                  className="form-input-field"
                  type="number"
                  placeholder="Add amount"
                  value={balanceAdded}
                  onChange={(e) => {
                    setBalanceAdded(e.target.value);
                  }}
                ></input>
                <button className="submit-button" type="submit">
                  ADD
                </button>
              </form>
            </div>
          </div>
          <div classname="inner-wrapper2">
            <h3>Withdraw Balance from your account</h3>
            <div className="child">
              <form onSubmit={withdrawBalance} className="transact-form">
                <input
                  className="form-input-field"
                  type="number"
                  placeholder="Add amount"
                  value={balanceWithdrawn}
                  onChange={(e) => {
                    setBalanceWithdrawn(e.target.value);
                  }}
                ></input>
                <button className="submit-button" type="submit">
                  WITHDRAW
                </button>
              </form>
            </div>
          </div>
          <div classname="inner-wrapper2">
            <h3>Transfer Money to another account</h3>
            <div className="child">
              <form onSubmit={withdrawBalance} className="transact-form">
                <button
                  className="submit-button-2"
                  type="submit"
                  onClick={() => {
                    window.location = `/transfer/${id}`;
                  }}
                >
                  TRANSFER
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* <div className="withdraw-balance-card">
          <h3>Withdraw the balance from your existing account</h3>
          <form onSubmit={withdrawBalance} className="transact-form">
            <input
              className="form-input-field"
              type="number"
              placeholder="Add amount"
              value={balanceWithdrawn}
              onChange={(e) => {
                setBalanceWithdrawn(e.target.value);
                // setBankingAccountBalance(bankingAccountBalance-e.target.value);
              }}
            ></input>
            <button className="approve-button" type="submit">
              WITHDRAW
            </button>
          </form>
        </div> */}

        {/* <div className="transfer-balance-card">
          <h1>
            Now you can easily transfer your virtual balance from your account
          </h1>
          <button
            className="approve-button"
            onClick={() => {
              window.location = `/transfer/${id}`;
            }}
          >
            TRANSFER TO OTHER ACCOUNTS
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AccountDetails;
