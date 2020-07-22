import React from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import AppContent from './components/App/AppContent';

library.add(faPlus, faCog);

function App() {
	return (
		<div className="app">
			<AppContent />
		</div>
	);
}

export default App;
