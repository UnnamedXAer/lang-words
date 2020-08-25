import React, { useContext } from 'react';
import './SideDrawer.css';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/route';
import { AppContext } from '../../context/AppContext';

const routesKeys = Object.keys(ROUTES);
const SideDrawer = () => {
	const [{ user }] = useContext(AppContext);
	return (
		<div className="side-drawer">
			<div className="side-drawer-header">
				{/* <img
					style={{ maxWidth: '100%', maxHeight: '100%' }}
					src="https://abc.jpg"
					alt="lang word"
				/> */}
			</div>
			<div className="side-drawer-user">
				<p>Hello</p>
				<p>{user.email}</p>
			</div>
			<div className="side-drawer-divider" />
			<nav className="drawer-navigation">
				<ul>
					{routesKeys.map((key) => (
						<li key={key}>
							<NavLink
								activeClassName="drawer-navigation-active"
								to={{
									pathname: `/${ROUTES[key].path}/${ROUTES[key].param}`,
									state: {
										key: key,
									},
								}}
							>
								{ROUTES[key].label}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default SideDrawer;
