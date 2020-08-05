import React, { useState, useEffect } from 'react';
import Firebase from '../firebase/Firebase';

export const FirebaseContext = React.createContext();

const FirebaseContextProvider = (props) => {
	const [state, setState] = useState(null);

	useEffect(() => {
		setState(new Firebase());
	}, []);

	return (
		<FirebaseContext.Provider value={state}>
			{props.children}
		</FirebaseContext.Provider>
	);
};

export default FirebaseContextProvider;
