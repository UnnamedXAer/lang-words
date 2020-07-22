import React from 'react';
import './AppContent.css';
import SideDrawer from '../SideDrawer/SideDrawer';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import WorkSection from '../WorkSection/WorkSection';

const AppContent = () => {
	return (
		<div className="app-content">
			<div className="app-content-work-section-container">
				<SideDrawer />
				<div className="app-content-work-section">
					<Header />
					<WorkSection />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default AppContent;
