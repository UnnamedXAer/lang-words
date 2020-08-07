import React, { useContext } from 'react';
import './SideDrawer.css';
import { AppContext, AppContextActions } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../App/AppContent';

const routesKeys = Object.keys(ROUTES);
const SideDrawer = () => {
	const [appState, appDispatch] = useContext(AppContext);

	const navItemClickHandler = (route) => {
		appDispatch({
			type: AppContextActions.REDIRECT,
			payload: route,
		});
	};

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
					{routesKeys.map((key) => (
						<li key={key}>
							<NavLink
								activeClassName="drawer-navigation-active"
								to={`${ROUTES[key].path}/${ROUTES[key].param}`}
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
