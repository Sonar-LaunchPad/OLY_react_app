import classes from './sideMenu.module.css';

const SideMenu = () => (
    <div className={classes.SideMenu}>
        <div className={classes.Container}>
            <a href='#token'>Token</a>
            <a href='#token'>Voting</a>
            <a href='#token'>Mission</a>
            <a href='#token'>Community</a>
            <a href='#token'>Tokenomics</a>
            <a href='#token'>Roadmap</a>
            <a href='#token'>Whitepaper</a>
        </div>
    </div>
);

export default SideMenu;