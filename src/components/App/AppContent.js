import React, { useContext } from 'react';
import './AppContent.css';
import SideDrawer from '../SideDrawer/SideDrawer';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import WorkSection from '../WorkSection/WorkSection';
import { AppContext } from '../../context/AppContext';
import Auth from '../Auth/Auth';

const AppContent = () => {
	const [appState, dispatchApp] = useContext(AppContext);

	return (
		<div className="app-content">
			<div className="app-content-work-section-container">
				{appState.user ? (
					<>
						<SideDrawer />
						<div className="app-content-work-section">
							<Header appState={appState} dispatchApp={dispatchApp} />
							<WorkSection />
						</div>
					</>
				) : (
					<Auth dispatchApp={dispatchApp} />
				)}
			</div>
			<Footer />
		</div>
	);
};

export default AppContent;
