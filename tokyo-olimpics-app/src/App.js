import React from 'react';
import classes from './App.module.css';
import Header from './components/header/header';
import Token from './components/main/pages/token';
import { useWallet, UseWalletProvider } from 'use-wallet'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Airdrop from './components/airdrop/airdrop';
import Footer from './components/footer/footer';
import Main from './components/main/main';
import Vote from './components/your-proposal/your-proposal';
import Proposal from './components/proposal/proposal';
const App = () => {
  return (
    <UseWalletProvider chainId={97}>
      <Router>
        <div className={classes.App}>
          <Header />
          <main className={classes.Main}>
            <Switch>
              <Route path="/airdrop">
                <Airdrop />
              </Route>
              <Route path="/nfc-proposal/:address">
                <Proposal />
              </Route>
              <Route path="/nfc-proposal">
                <Vote />
              </Route>
              <Route path="/">
                <Main />
              </Route>
            </Switch>
          </main>
          <Footer />
        </div>
      </Router>
    </UseWalletProvider>
  );
}

export default App;
