import React, { useState } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import AppContent from './components/App/AppContent';

library.add(faPlus, faCog);

export const CounterContext = React.createContext();

function App() {
	const [counter, setCounter] = useState({
		value: 0,
		prevValue: 0,
	});
	return (
		<div className="app">
			<CounterContext.Provider value={[counter, setCounter]}>
				<AppContent />
			</CounterContext.Provider>
		</div>
	);
}

export default App;
