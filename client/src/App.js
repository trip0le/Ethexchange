import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import CreateAccount from "./components/CreateAccount/CreateAccount.js";
import DisplayAccounts from "./components/DisplayAccounts/DisplayAccounts.js";
import MainSection from "./components/MainSection/MainSection.js";
import AccountDetails from "./components/AccountDetails/AccountDetails.js";
import TransferMoney from "./components/TransferMoney/TransferMoney.js";
import TransactionHistory from "./components/Transactions/TransactionHistory.js"
import "./App.css";

export default function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <MainSection />
          </Route>

          <Route exact path="/transfer/:id">
            <TransferMoney />
          </Route>

          <Route exact path="/create">
            <CreateAccount />
          </Route>

          <Route exact path="/accounts">
            <DisplayAccounts />
          </Route>

          <Route exact path="/accounts/:id">
            <AccountDetails />
          </Route>

          <Route exact path="/transactions">
            <TransactionHistory/>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

// https://kovan.infura.io/v3/da1a7b0f15bc41da9c0e4f834fec56ef
