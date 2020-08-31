import { ROUTES } from '../constants/route';

export function getRouteTitle(location) {
	let route;
	if (location.state && location.state.key) {
		route = ROUTES[location.state.key];
	} else {
		const path = location.pathname.replace(/[/]/g, '');
		if (path === 'words') route = ROUTES['WORDS'];
		else if (path === 'wordsknown') route = ROUTES['KNOWN_WORDS'];
		else if (path === 'profile') route = ROUTES['PROFILE'];
		else route = null;
	}

	return route ? route.label : '';
}
