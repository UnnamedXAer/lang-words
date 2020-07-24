import React from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import AppContent from './components/App/AppContent';
import WordContextProvider from './context/WordsContext';

library.add(faPlus, faCog);

function App() {
	return (
		<div className="app">
			<WordContextProvider>
				<AppContent />
			</WordContextProvider>
		</div>
	);
}

export default App;
