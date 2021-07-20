import { useEffect, useState } from 'react';
import Web3 from 'web3';
import classes from './your-proposal.module.css';
import { ImSpinner4 } from 'react-icons/im';
import { useWallet } from 'use-wallet';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { MdCreate } from 'react-icons/md';
import { BiLinkExternal } from 'react-icons/bi';
import { FiCopy } from 'react-icons/fi';
import { HiOutlineTrash } from 'react-icons/hi'
import { SiNfc } from 'react-icons/si';

const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimAirdrop",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "body",
                "type": "string"
            }
        ],
        "name": "createNFTProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "NFTProposalAddress",
                "type": "address"
            }
        ],
        "name": "fulfillNFTProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "NFTProposalAddress",
                "type": "address"
            }
        ],
        "name": "removeNFTProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newValue",
                "type": "uint256"
            }
        ],
        "name": "setAirdropValue",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newValue",
                "type": "uint256"
            }
        ],
        "name": "setNFTProposalPrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newValue",
                "type": "uint256"
            }
        ],
        "name": "setNFTProposalVoteMinBalance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "NFTProposalAddress",
                "type": "address"
            }
        ],
        "name": "voteForNFTProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "airdropValue",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner_",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender_",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
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
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "proposalAddress",
                "type": "address"
            }
        ],
        "name": "getNFTProposal",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "NFTProposalPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "NFTProposalVoteMinBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
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
]

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if the element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a
    // flash, so some of these are just precautions. However in
    // Internet Explorer the element is visible whilst the popup
    // box asking the user for permission for the web page to
    // copy to the clipboard.
    //

    // Place in the top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of the white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}

const Vote = () => {
    const [body, setBody] = useState('');
    const [createStatus, setCreateStatus] = useState('idle');
    const [userProposal, setUserProposal] = useState('none');
    const [proposalPrice, setProposalPrice] = useState(0);
    const [copied, setCopied] = useState(false);
    const { account } = useWallet();

    useEffect(() => {
        const getProposalPrice = async () => {
            const web3 = new Web3(window.ethereum);
            const tokenContract = await new web3.eth.Contract(abi, process.env.REACT_APP_TOKEN_ADDRESS);
            const price = await tokenContract.methods.NFTProposalPrice().call();
            setProposalPrice(price / (10 ** 18))
        }
        const getUserProposal = async () => {
            const web3 = new Web3(window.ethereum);
            const tokenContract = await new web3.eth.Contract(abi, process.env.REACT_APP_TOKEN_ADDRESS);
            const accounts = await web3.eth.getAccounts();
            try {
                const result = await tokenContract.methods.getNFTProposal(accounts[0]).call();
                const body = result[0];
                const voters = result[1];
                setUserProposal({ body, voters });
            } catch (e) {
                console.log(e);
                setUserProposal('notYet')
            }
            //setProposalPrice(price / (10 ** 18))
        }
        getProposalPrice();
        getUserProposal();
    }, []);


    const createNFCProposal = async () => {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const tokenContract = await new web3.eth.Contract(abi, process.env.REACT_APP_TOKEN_ADDRESS);
        setCreateStatus('loading');
        try {
            await tokenContract.methods.createNFTProposal(body).send({ from: accounts[0] });
            setCreateStatus('success');
        } catch (e) {
            console.log(e);
            if (e.code) {
                setCreateStatus('rejected');
            } else {
                setCreateStatus('arleadyClaimed');
            }
        }
    }

    const copyLink = async () => {
        setCopied(true);
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        copyTextToClipboard(`${window.location.href}/${accounts[0]}`);
        setTimeout(() => {
            setCopied(false);
        }, 500);
    }

    const goToProposal = async () => {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        window.open(`${window.location.href}/${accounts[0]}`, '_blank').focus();
    }

    if (userProposal === 'none') {
        return <div className={classes.Vote}>
            <div className={classes.BitTitle}>Loading</div><ImSpinner4 className={classes.BigSpinner} />
        </div>
    }

    if (userProposal === 'notYet') {
        return <div className={classes.Vote}>
            <div className={classes.Card}>
                <div>
                    <div className={classes.Title}>NEW Proposal</div>
                    <div className={classes.Description}>
                        account haven't created proposal yet
                    </div>
                </div>
                <textarea className={classes.TextArea} onChange={e => setBody(e.target.value)} placeholder="Write Your NFC proposal here">
                </textarea>
                <span className={classes.Price}>price: {proposalPrice} $OLY</span>
                <button className={classes.CreateButton} onClick={createNFCProposal} disabled={!account || createStatus === 'loading'}>
                    {
                        createStatus === 'loading' ? <ImSpinner4 className={classes.Spinner} /> : <MdCreate />
                    }Create NFT Proposal
                </button>
                <span className={classes.Feedback}>
                    {createStatus === 'loading' && <span className={classes.Info}>processing transaction...</span>}
                    {createStatus === 'success' && <span className={classes.Success}><FaCheck />NFC proposal created!</span>}
                    {createStatus === 'rejected' && <span className={classes.Fail}> <FaTimes /> Transaction rejected by user</span>}
                    {createStatus === 'arleadyClaimed' && <span className={classes.Fail}> <FaTimes />User arleady created NFC proposal</span>}
                    {!account && <span className={classes.Info}>connect wallet</span>}
                </span>
            </div>
        </div>
    }

    return (
        <div className={classes.Vote}>
            <div className={classes.Card}>
                <div>
                    <div className={classes.Title}><SiNfc /> your nfc Proposal</div>
                </div>
                <div className={classes.Body}>
                    {userProposal.body}
                </div>
                <div className={classes.VotesAndRemove}>
                    <div className={classes.Votes}>Votes: {userProposal.voters}</div>
                    <a href='#'><HiOutlineTrash /> delete this proposal</a>
                </div>
                <div className={classes.Description}> </div>
                <div className={classes.Buttons}>
                    <button className={classes.CreateButton} disabled={copied} onClick={copyLink}>
                        <FiCopy className={classes.Copy} /> {copied ? 'Copied!' : 'Copy link'}
                    </button>   <button className={classes.CreateButton} onClick={goToProposal}>
                        <BiLinkExternal className={classes.Copy} /> go to proposal
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Vote;