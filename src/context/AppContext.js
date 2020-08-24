import React, { useReducer, useEffect, useContext } from 'react';
import { FirebaseContext } from './FirebaseContext';

export const AppContext = React.createContext();

const initialState = {
	user: null,
	authLoading: false,
};

export const AppContextActions = {
	REDIRECT: 'APP_REDIRECT',
	AUTHENTICATE: 'APP_AUTHENTICATE',
	LOGOUT: 'APP_LOGOUT',
};

const reducer = (state, action) => {
	switch (action.type) {
		case AppContextActions['REDIRECT']:
			return {
				...state,
				activeRoute: action.payload,
			};
		case AppContextActions['AUTHENTICATE']:
			const { user } = action.payload;

			return {
				...state,
				user,
			};

		case AppContextActions['LOGOUT']:
			return {
				...initialState,
			};
		default:
			return state;
	}
};

const AppContextProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const firebase = useContext(FirebaseContext);

	useEffect(() => {
		const listener = firebase.auth.onAuthStateChanged((authUser) => {
			let user = null;
			firebase.setLoggedUserId();
			if (authUser) {
				user = {
					email: authUser.email,
					emailVerified: authUser.emailVerified,
					lastLoginTime: new Date(authUser.metadata.lastSignInTime),
					creationTime: new Date(authUser.metadata.creationTime),
					refreshToken: authUser.refreshToken,
					id: authUser.uid,
				};
			}

			dispatch({
				type: AppContextActions.AUTHENTICATE,
				payload: {
					user,
				},
			});
		});
		return () => {
			listener();
		};
	}, [firebase]);

	return (
		<AppContext.Provider value={[state, dispatch]}>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
