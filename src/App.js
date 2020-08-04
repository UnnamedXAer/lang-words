import React from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faPlus,
	faCog,
	faEdit,
	faTrashAlt,
	faCheck,
	faCheckDouble,
	faExclamationTriangle,
	faExclamationCircle,
	faTimesCircle,
	faCheckCircle,
	faTimes,
} from '@fortawesome/free-solid-svg-icons';
import AppContextProvider from './context/AppContext';
import WordContextProvider from './context/WordsContext';
import AppContent from './components/App/AppContent';

library.add(
	faPlus,
	faCog,
	faEdit,
	faTrashAlt,
	faCheck,
	faCheckDouble,
	faTimesCircle,
	faCheckCircle,
	faExclamationTriangle,
	faExclamationCircle,
	faTimes
);

function App() {
	return (
		<div className="app">
			<AppContextProvider>
				<WordContextProvider>
					<AppContent />
				</WordContextProvider>
			</AppContextProvider>
		</div>
	);
}

export default App;
