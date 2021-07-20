import classes from './header.module.css';
import { useWallet } from 'use-wallet'
import { useEffect } from 'react';
import Balance from './balance';
import { AiOutlineGift } from 'react-icons/ai';
import { SiNfc } from 'react-icons/si';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/olimpics.png'
let inited = false;
const Header = ({ }) => {
    const { account, status, reset, connect } = useWallet();
    const history = useHistory();

    useEffect(() => {
        if (status !== 'connected') return;
        window.ethereum.enable()
    }, [status]);
    useEffect(() => {
        const disconnected = localStorage.getItem('disconnected') === 'true';
        if (!connect || inited || disconnected) return;
        connect();
        inited = true;
    }, [connect]);

    const connectWallet = () => {
        localStorage.setItem('disconnected', false)
        connect();
    }
    const disconnectWallet = () => {
        localStorage.setItem('disconnected', true)
        reset();
    }

    const accountAddress = account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : '';
    return (
        <header className={classes.Header}>
            <nav>
                <ul className={classes.Ul}>
                    <li className={classes.FirstLi} onClick={() => history.push('/')}><img src={logo} className={classes.LogoImage} alt='logo' />
                        <div className={classes.Name}>Olympic token</div>
                    </li>
                    <li><button className={classes.AirdropButton} onClick={() => history.push('/nfc-proposal')}><SiNfc />NFC Proposal</button></li>
                    {/*} <li>Roadmap</li>
                    <li>Voting</li>*/}
                    <li><button className={classes.Airdrop} onClick={() => history.push('/airdrop')}><AiOutlineGift color="#ff4136" /> Airdrop</button></li>
                </ul>
            </nav>
            <div className={classes.Wallet}>
                {
                    account
                        ? <div className={classes.Connected}>
                            <div className={classes.Info}>
                                <div className={classes.Address}>{accountAddress}</div>
                                <div className={classes.Balance}><Balance account={account} /></div>
                            </div>
                            <div>
                                <button className={classes.WalletConnect} onClick={disconnectWallet}>
                                    Disconnect
                                </button>
                            </div>
                        </div>
                        : <div className={classes.Disconnected}>
                            <button className={classes.WalletConnect} onClick={connectWallet}>
                                Connect wallet
                            </button>
                        </div>
                }

            </div>
        </header>

    )
}

export default Header;