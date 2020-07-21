import React from 'react'
import './Header.css';

const Header = () => {
	return (
		<header className="header">
			<div className="header-title">
				<span className="header-title-text">
					new words
				</span>
				<span className="header-title-caption">
					11 new words today
				</span>
			</div>
			<div className="header-actions">
				<button className="header-actions-button" title="Add word">+</button>
				<button className="header-actions-button" title="Settings">:</button>
			</div>
		</header>
	)
}

export default Header
