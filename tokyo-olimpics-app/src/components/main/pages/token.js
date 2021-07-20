import { useEffect, useState } from 'react';
import classes from './token.module.css';
import logo from '../../../assets/olimpics.png';
import pancakeLogo from '../../../assets/pancake.svg';
import bscscanLogo from '../../../assets/bscscan.svg';
import poocoinLogo from '../../../assets/poocoin.png';
import telegramLogo from '../../../assets/telegram.webp';
import discordLogo from '../../../assets/discord.svg';
import dxsaleLogo from '../../../assets/dxsale.png';

const Token = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const scrollListener = document.addEventListener('scroll', e => {
            const scrollPosition = window.scrollY;
            if (scrollPosition >= 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        });
        return () => document.removeEventListener('scroll', scrollListener);
    }, []);

    return (
        <div className={[classes.Token, isScrolled ? classes.Scrolled : ''].join(' ')}>
            <img src={logo} className={classes.LogoImage} alt='logo' />
            <div className={classes.Name}>Olympic token</div>
            <div className={classes.Description}>connect with athletes, fans and sport charities accross the globe</div>
            <div className={classes.Container}>
                <div><img src={dxsaleLogo} alt='pancake' />presale</div>
                <div><img src={pancakeLogo} alt='pancake' />trade</div>
                <div><img src={bscscanLogo} alt='bscscan' />Contract</div>
                <div><img src={telegramLogo} alt='telegram' />Talk</div>
                <div><img src={discordLogo} alt='discord' />Discuss</div>
                <div><img src={poocoinLogo} alt='poocoin' />Charts</div>
            </div>
        </div>
    )
}

export default Token;