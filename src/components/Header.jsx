import React from 'react';
import logoSvg from '../assets/LogoMiamMap.svg';
import '../styles/Header.css';

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-brand">
        <img
          src={logoSvg}
          alt="Logo MiamMap"
          className="header-logo"
        />
        <h1>MiamMap</h1>
      </div>
    </header>
  );
}