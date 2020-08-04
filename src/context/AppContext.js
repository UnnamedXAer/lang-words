import React, { useReducer, useEffect } from 'react';

export const AppContext = React.createContext();

export const ROUTES = {
	WORDS: { label: 'Words', hash: '#words' },
	KNOWN_WORDS: { label: 'Know Words', hash: '#known-words' },
};

const getInitialRoute = () => {
	let route;
	switch (window.location.hash) {
		case ROUTES['KNOWN_WORDS'].hash:
			route = ROUTES['KNOWN_WORDS'];
			break;
		case ROUTES['WORDS'].hash:
			route = ROUTES['WORDS'];
			break;
		default:
			route = ROUTES['WORDS'];
			break;
	}
	return route;
};

const initialState = {
	activeRoute: getInitialRoute(),
};

export const AppContextActions = {
	REDIRECT: 'APP_REDIRECT',
};

const reducer = (state, action) => {
	switch (action.type) {
		case AppContextActions['REDIRECT']:
			return {
				...state,
				activeRoute: action.payload,
			};

		default:
			return state;
	}
};

const AppContextProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		document.title = 'LANG WORD - ' + state.activeRoute.label;
	}, [state.activeRoute]);

	return (
		<AppContext.Provider value={[state, dispatch]}>
			{props.children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
