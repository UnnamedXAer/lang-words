import React, { useContext } from 'react';
import './SideDrawer.css';
import { NavLink, useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/route';
import { AppContext, AppContextActions } from '../../context/AppContext';
import { FirebaseContext } from '../../context/FirebaseContext';
import { WordsContextActions } from '../../context/WordsContext';
import Button from '../UI/Button';
import Backdrop from '../UI/Backdrop/Backdrop';
import Divider from '../UI/Divider/Divider';

const routesKeys = Object.keys(ROUTES);
const SideDrawer = () => {
	const history = useHistory();
	const [{ user, drawerOpen }, dispatchApp] = useContext(AppContext);
	const [, dispatchWords] = useContext(AppContext);
	const firebase = useContext(FirebaseContext);

	const logoutHandler = async () => {
		try {
			await firebase.logOut();
		} catch (err) {}
		dispatchApp({
			type: AppContextActions['LOGOUT'],
		});
		dispatchWords({
			type: WordsContextActions['CLEAR_STATE'],
		});
		history.push('/');
	};

	const drawerToggleHandler = () => {
		dispatchApp({
			type: AppContextActions['TOGGLE_DRAWER'],
		});
	};

	return (
		<div className={`side-drawer ${drawerOpen ? 'side-drawer-open' : ''}`}>
			<div className="side-drawer-header">
				<p className="side-drawer-header-text">Lang Word</p>
			</div>
			<div className="side-drawer-user">
				<p>Hello</p>
				<p>{user.email}</p>
			</div>
			<Divider />
			<nav className="drawer-navigation">
				<ul>
					{routesKeys.map((key) => (
						<li key={key}>
							<NavLink
								onClick={() => drawerOpen && drawerToggleHandler()}
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
			<Button className="side-drawer-logout" title="Logout" onClick={logoutHandler}>
				Logout
			</Button>
			<div className="side-drawer-toggler" onClick={drawerToggleHandler}>
				<div />
				<div />
				<div />
			</div>
			<Backdrop open={drawerOpen} onClose={drawerToggleHandler} zIndex={998} />
		</div>
	);
};

export default SideDrawer;
