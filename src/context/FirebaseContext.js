import React from 'react';
import Firebase from '../firebase/Firebase';

const firebaseObj = new Firebase();

export const FirebaseContext = React.createContext();

const FirebaseContextProvider = (props) => {
	return (
		<FirebaseContext.Provider value={firebaseObj}>
			{props.children}
		</FirebaseContext.Provider>
	);
};

export default FirebaseContextProvider;
