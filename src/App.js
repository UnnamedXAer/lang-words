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
	faRedoAlt,
} from '@fortawesome/free-solid-svg-icons';
import AppContextProvider from './context/AppContext';
import WordContextProvider from './context/WordsContext';
import AppContent from './components/App/AppContent';
import FirebaseContextProvider from './context/FirebaseContext';

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
	faTimes,
	faRedoAlt
);

function App() {
	return (
		<div className="app">
			<FirebaseContextProvider>
				<AppContextProvider>
					<WordContextProvider>
						<AppContent />
					</WordContextProvider>
				</AppContextProvider>
			</FirebaseContextProvider>
		</div>
	);
}

export default App;
