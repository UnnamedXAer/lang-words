import React, { useReducer, useEffect, useContext } from 'react';
import { FirebaseContext } from './FirebaseContext';

export const AppContext = React.createContext();

const initialState = {
	splashScreenOpen: true,
	user: null,
	authLoading: false,
	drawerOpen: false,
};

export const AppContextActions = {
	REDIRECT: 'APP_REDIRECT',
	AUTHENTICATE: 'APP_AUTHENTICATE',
	LOGOUT: 'APP_LOGOUT',
	TOGGLE_DRAWER: 'APP_TOGGLE_DRAWER',
	CLOSE_SPLASH_SCREEN: 'APP_CLOSE_SPLASH_SCREEN',
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
				splashScreenOpen: state.splashScreenOpen,
			};
		case AppContextActions['TOGGLE_DRAWER']:
			return {
				...state,
				drawerOpen: !state.drawerOpen,
			};
		case AppContextActions['CLOSE_SPLASH_SCREEN']:
			return {
				...state,
				splashScreenOpen: false,
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
			dispatch({
				type: AppContextActions['CLOSE_SPLASH_SCREEN'],
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
