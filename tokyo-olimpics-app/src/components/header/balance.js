import { useEffect, useState } from "react";
import Web3 from "web3";
import Spinner from "../ui/spinner";
const Big = require('big.js');

const pancakePairABI =
    [
        {
            "constant": true,
            "inputs": [],
            "name": "getReserves",
            "outputs": [
                { "internalType": "uint112", "name": "_reserve0", "type": "uint112" },
                { "internalType": "uint112", "name": "_reserve1", "type": "uint112" },
                {
                    "internalType": "uint32",
                    "name": "_blockTimestampLast",
                    "type": "uint32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];
const tokenAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const getBnbUsdPrice = async (web3) => {
    const bnbBusdPairContract = await new web3.eth.Contract(pancakePairABI, process.env.REACT_APP_BNB_BUSD_PAIR);
    const reserves = await bnbBusdPairContract.methods.getReserves().call();
    const _reserve0 = new Big(reserves._reserve0);
    const _reserve1 = new Big(reserves._reserve1);
    return _reserve1.div(_reserve0);
}

const getTokenUsdPrice = async (web3, bnbUsdPrice) => {
    const tokenBnbPairContract = await new web3.eth.Contract(pancakePairABI, process.env.REACT_APP_TOKEN_BNB_PAIR_ADDRESS);
    const reserves = await tokenBnbPairContract.methods.getReserves().call();
    const _reserve0 = new Big(reserves._reserve0);
    const _reserve1 = new Big(reserves._reserve1);
    const tokenBnbPrice = _reserve1.div(_reserve0);
    return tokenBnbPrice.times(bnbUsdPrice);

}

const Balance = ({ account }) => {
    const [balance, setBalance] = useState(0);
    const [usdBalance, setUsdBalance] = useState(0);

    useEffect(() => {
        const storageBalance = localStorage.getItem('balance');
        if (storageBalance) {
            setBalance(storageBalance);
        }
        const storageUsdBalance = localStorage.getItem('usdBalance');
        if (storageUsdBalance) {
            setUsdBalance(storageUsdBalance);
        }
        const web3 = new Web3(process.env.REACT_APP_PROVIDER);
        const decimals = parseInt(process.env.REACT_APP_TOKEN_DECIMALS);
        let balanceInterval;
        const checkBalance = async (tokenContract) => {
            const rawBalance = await tokenContract.methods.balanceOf(account).call();
            const balance = rawBalance / (10 ** decimals);
            setBalance(balance.toFixed(0));
            localStorage.setItem('balance', balance);
            const bnbBusdPrice = await getBnbUsdPrice(web3);
            const tokenBusdPrice = await getTokenUsdPrice(web3, bnbBusdPrice);
            setUsdBalance(tokenBusdPrice.toFixed(2));
            localStorage.setItem('usdBalance', tokenBusdPrice.toFixed(2))
        }
        (async () => {
            const tokenContract = await new web3.eth.Contract(tokenAbi, process.env.REACT_APP_TOKEN_ADDRESS);
            checkBalance(tokenContract)
            balanceInterval = setInterval(async () => {
                checkBalance(tokenContract)
            }, 1 * 3000);
        })();

        return () => balanceInterval && clearInterval(balanceInterval);
    }, []);

    return (
        <span>{balance} $OLY {/*(${usdBalance})*/}</span>
    );
}

export default Balance;