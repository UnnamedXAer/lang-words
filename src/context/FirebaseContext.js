import React from 'react';
import Firebase from '../firebase/Firebase';

export const FirebaseContext = React.createContext();
let cnt = 0;
const FirebaseContextProvider = (props) => {
	if (++cnt > 1) {
		throw new Error('Created more than one firebase object');
	}
	return (
		<FirebaseContext.Provider value={new Firebase()}>
			{props.children}
		</FirebaseContext.Provider>
	);
};

export default FirebaseContextProvider;
