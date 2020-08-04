import React from 'react';
import ReactDOM from 'react-dom';
import './assets/fonts/Open_Sans/OpenSans-Regular.ttf';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ROUTES } from './context/AppContext';

(() => {
	const {
		location: { origin, hash, pathname },
	} = window;

	if (hash !== ROUTES.WORDS.hash && hash !== ROUTES.KNOWN_WORDS.hash) {
		window.location.href = origin + '/' + ROUTES.WORDS.hash;
	} else if (pathname !== '/') {
		window.location.href = origin + '/' + hash;
	}
})();

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
