import React from 'react';

import Twitter from './twitter.svg';
import Github from './github.svg';

import styles from './footer.module.scss';

function Footer(){
    return (
        <footer className={ styles.footer }>
            <span className={ styles.author }>Yusof Bandar</span>
            <a href='https://twitter.com/BandarYusof' target='_blank' rel='noopener noreferrer'>
                <img className={ styles.icon } src={ Twitter } alt='twitter'/>
            </a>
            <a href='https://github.com/YusofBandar' target='_blank' rel='noopener noreferrer'>
                <img className={ styles.icon } src={ Github } alt='github'/>
            </a>
        </footer>
    );
}

export default Footer;
