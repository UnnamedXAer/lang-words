import React, { useContext, useEffect } from 'react';
import './AppContent.css';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import SideDrawer from '../SideDrawer/SideDrawer';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Words from '../Words/Words';
import { AppContext } from '../../context/AppContext';
import { ROUTES } from '../../constants/route';
import ForgotPasswordForm from '../Auth/ForgotPasswordForm/ForgotPasswordForm';
import AuthForm from '../Auth/AuthForm/AuthForm';
import Profile from '../Profile/Profile';
import UpdatePassword from '../Profile/UpdatePassword/UpdatePassword';

export const AuthRoutes = ({ dispatchApp }) => {
	return (
		<Switch>
			<Route path="/forgot-password">
				<ForgotPasswordForm />
			</Route>
			<Route path="/">
				<AuthForm dispatchApp={dispatchApp} />
			</Route>
		</Switch>
	);
};

export const WorkSectionRoutes = () => {
	const location = useLocation();

	useEffect(() => {
		const route =
			location.state && location.state.key ? ROUTES[location.state.key] : null;
		document.title = 'LANG-WORD ' + (route ? ' - ' + route.label : '');

		return () => {
			document.title = 'LANG-WORD';
		};
	}, [location.pathname, location.state]);

	return (
		<Switch>
			<Route path="/words">
				<Words />
			</Route>
			<Route path="/profile">
				<Profile />
			</Route>
			<Route path="/update-Password">
				<UpdatePassword />
			</Route>
		</Switch>
	);
};

const AppContent = () => {
	const [appState, dispatchApp] = useContext(AppContext);
	return (
		<div className="app-content">
			<div className="app-content-work-section-container">
				<Router>
					{appState.user ? (
						<>
							<SideDrawer />
							<div className="app-content-work-section">
								<Header appState={appState} dispatchApp={dispatchApp} />
								<main className="app-content-main">
									<WorkSectionRoutes />
								</main>
							</div>
						</>
					) : (
						<AuthRoutes dispatchApp={dispatchApp} />
					)}
				</Router>
			</div>
			<Footer />
		</div>
	);
};

export default AppContent;
