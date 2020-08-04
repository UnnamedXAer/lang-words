import React, { useContext } from 'react';
import './SideDrawer.css';
import { AppContext, ROUTES, AppContextActions } from '../../context/AppContext';

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
						<li key={key} onClick={() => navItemClickHandler(ROUTES[key])}>
							<a
								href={`${ROUTES[key].hash}`}
								data-active={
									ROUTES[key].hash === appState.activeRoute.hash
										? 'true'
										: 'false'
								}
							>
								{ROUTES[key].label}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default SideDrawer;
