import React from 'react';
import './SideDrawer.css';

const SideDrawer = () => {
	return (
		<div className="side-drawer">
			<div className="side-drawer-header">
				{/* <img
					style={{ maxWidth: '100%', maxHeight: '100%' }}
					src="https://abc.jpg"
					alt="lang word"
				/> */}
			</div>
			<nav className="drawer-navigation">
				<ul>
					<li className="drawer-navigation-item">Words</li>
					<li className="drawer-navigation-item">Known Words</li>
				</ul>
			</nav>
		</div>
	);
};

export default SideDrawer;
