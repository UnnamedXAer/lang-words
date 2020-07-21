import React from 'react';
import './SideDrawer.css';

const SideDrawer = () => {
	return (
		<div className="side-drawer">
			<div className="side-drawer-header">
				<img
					style={{ maxWidth: '100%', maxHeight: '100%' }}
					src="https://abc.jpg"
					alt="lang word"
				/>
			</div>
			<nav>
				<ul>
					<li>new words</li>
					<li>words</li>
					<li>known words</li>
				</ul>
			</nav>
		</div>
	)
}

export default SideDrawer;
