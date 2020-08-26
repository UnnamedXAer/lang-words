import React, { useContext } from 'react';
import './SideDrawer.css';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/route';
import { AppContext, AppContextActions } from '../../context/AppContext';
import { FirebaseContext } from '../../context/FirebaseContext';
import { WordsContextActions } from '../../context/WordsContext';
import Button from '../UI/Button';
import Backdrop from '../UI/Backdrop/Backdrop';

const routesKeys = Object.keys(ROUTES);
const SideDrawer = () => {
	const [{ user, drawerOpen }, dispatchApp] = useContext(AppContext);
	const [, dispatchWords] = useContext(AppContext);
	const firebase = useContext(FirebaseContext);

	const logoutHandler = async () => {
		try {
			await firebase.logOut();
		} catch (err) {
			console.log('logOut err: ', err);
		}
		dispatchApp({
			type: AppContextActions['LOGOUT'],
		});
		dispatchWords({
			type: WordsContextActions['CLEAR_STATE'],
		});
	};

	const drawerToggleHandler = () => {
		dispatchApp({
			type: AppContextActions['TOGGLE_DRAWER'],
		});
	};

	return (
		<div className={`side-drawer ${drawerOpen ? 'side-drawer-open' : ''}`}>
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
			<Backdrop open={drawerOpen} onClose={drawerToggleHandler} />
		</div>
	);
};

export default SideDrawer;
