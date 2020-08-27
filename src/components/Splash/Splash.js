import React from 'react';
import './Splash.css';
import Spinner from '../UI/Spinner/Spinner';

const Splash = () => {
	return (
		<div className="splash">
			<div className="splash-app-name-container">
				<p className="splash-app-name">Lang - Word</p>
			</div>
			<Spinner size="large">Please wait...</Spinner>
		</div>
	);
};

export default Splash;
