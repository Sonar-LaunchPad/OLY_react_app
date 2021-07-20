import classes from './airdrop.module.css';
import { AiOutlineGift } from 'react-icons/ai';
import { ImSpinner4 } from 'react-icons/im';
import { useWallet } from 'use-wallet';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import logo from '../../assets/olimpics.png';

const tokenAbi = [
    {
        "inputs": [],
        "name": "airdropValue",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimAirdrop",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const Airdrop = ({ }) => {
    const [airdropStatus, setAirdropStatus] = useState('idle');
    const { account } = useWallet();
    const [airdropAmount, setAirdropAmount] = useState(-1)

    useEffect(() => {
        const web3 = new Web3(window.ethereum);
        (async () => {
            const tokenContract = await new web3.eth.Contract(tokenAbi, process.env.REACT_APP_TOKEN_ADDRESS);
            const tokenAirdropAmount = await tokenContract.methods.airdropValue().call();
            setAirdropAmount(tokenAirdropAmount / (10 ** 18))
        })();
    }, []);

    const pickAirdrop = async () => {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const tokenContract = await new web3.eth.Contract(tokenAbi, process.env.REACT_APP_TOKEN_ADDRESS);
        setAirdropStatus('loading');
        try {
            await tokenContract.methods.claimAirdrop().send({ from: accounts[0] });
            setAirdropStatus('success');
        } catch (e) {
            if (e.code) {
                setAirdropStatus('rejected');
            } else {
                setAirdropStatus('arleadyClaimed');
            }
        }
    }

    return (
        <div className={classes.Airdrop}>
            <div className={classes.Card}>
                <div>
                    <div className={classes.Title}>Airdrop</div>
                    <div className={classes.Description}>
                        You can claim your airdrop only once
                    </div>
                </div>

                <img src={logo} className={classes.LogoImage} alt='logo' />
                {!!account && <span className={classes.Amount}>{airdropAmount} $OLY</span>}
                <button disabled={airdropStatus === 'loading' || !account} className={classes.AirdropButton} onClick={pickAirdrop}>
                    {
                        airdropStatus === 'loading' ? <ImSpinner4 className={classes.Spinner} /> : <AiOutlineGift />
                    }
                    claim airdrop</button>
                <span className={classes.Feedback}>
                    {airdropStatus === 'loading' && <span className={classes.Info}>processing transaction...</span>}
                    {airdropStatus === 'success' && <span className={classes.Success}><FaCheck />{airdropAmount} $OLY sent to your wallet</span>}
                    {airdropStatus === 'rejected' && <span className={classes.Fail}> <FaTimes /> Transaction rejected by user</span>}
                    {airdropStatus === 'arleadyClaimed' && <span className={classes.Fail}> <FaTimes />User arleady claimed airdrop</span>}
                    {!account && <span className={classes.Info}>connect wallet</span>}
                </span>
            </div>
        </div>
    )
}

export default Airdrop;