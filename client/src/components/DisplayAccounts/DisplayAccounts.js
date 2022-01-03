import React, { useState, useEffect } from "react";
import BankingContract from "../../contracts/Banking.json";
import getWeb3 from "../../getWeb3";
import Table from "react-bootstrap/Table";

import "./DisplayAccounts.css";

const DisplayAccount = () => {
  const [contract, setContract] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const [bankAccounts, setBankAccounts] = useState([]);

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
    const getContractDetails = async () => {
      const serialNumber = await contract.methods.serialNumber().call();
      console.log(serialNumber);

      for (let i = 1; i <= serialNumber; i++) {
        await contract.methods
          .accounts(i)
          .call()

          .then((res) => {
            var bankAcc = bankAccounts;
            if (res.creator === account) {
              bankAcc.push({
                name: res.name,
                location: res.location,
                serialNumber: res.serial,
                balance: res.balance,
              });
            }
            setBankAccounts(bankAcc);
            console.log(res);
            console.log(bankAccounts);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      setLoading(false);
    };
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      getContractDetails();
    }
  }, [web3, account, contract]);

  if (!web3) {
    return <div>Loading web3, accounts, and contracts...</div>;
  }
  return (
    <div className="trasaction-history-table">
      {/* <div className="accounts">
           <h1>YOUR REGISTERED ACCOUNTS</h1>
           <div className="account-bars-container">

               {

                    !loading?bankAccounts.map((account)=>{
                        return(
                            <div className="account-bars"
                                onClick={()=>(window.location = `/accounts/${account.serialNumber}`)}
                            >
                                <h1 className="account-bars-title">{account.name}</h1>
                                <h1 className="account-bars-title">{account.serialNumber}</h1>
                            </div>)


                    }):null

               }
       </div>

       </div> */}
      <h3 className="Heading">Display Accounts</h3>
      <Table striped hover responsive="md" variant="bordered" size="sm">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Account Holder's Name</th>
          </tr>
        </thead>
        <tbody>
          {!loading
            ? bankAccounts.map((account) => {
                return (
                  // <div
                  //   className="account-bars"
                  //   onClick={() =>
                  //     (window.location = `/accounts/${account.serialNumber}`)
                  //   }
                  // >
                  //   <h1 className="account-bars-title">{account.name}</h1>
                  //   <h1 className="account-bars-title">
                  //     {account.serialNumber}
                  //   </h1>
                  // </div>
                  <tr key={account._id}>
                    <div
                    className="account-bars"
                      onClick={() =>
                        (window.location = `/accounts/${account.serialNumber}`)
                      }
                    >
                      <td>{account.serialNumber}</td>
                    </div>
                      <td>{account.name}</td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </Table>
    </div>
  );
};

export default DisplayAccount;
