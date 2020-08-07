import React, { useState, useContext } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../UI/Button';
import AddWord from '../AddWord/AddWord';
import { ROUTES, AppContextActions } from '../../context/AppContext';
import { WordsContext, WordsContextActions } from '../../context/WordsContext';
import { FirebaseContext } from '../../context/FirebaseContext';

const Header = ({ appState: { activeRoute, user }, dispatchApp }) => {
	const [addWordOpen, setAddWordOpen] = useState(false);
	const [
		{ words, fetchingWords, fetchingKnownWords, wordsFetched },
		dispatchWords,
	] = useContext(WordsContext);
	const firebase = useContext(FirebaseContext);

	const logoutHandler = async () => {
		try {
			await firebase.logOut();
		} catch (err) {
			console.log('logOut err: ', err);
		}
		dispatchApp({
			type: AppContextActions['LOGOUT'],
		});
		dispatchWords({
			type: WordsContextActions['CLEAR_STATE'],
		});
	};

	const refreshWordsHandler = () => {
		dispatchWords({
			type: WordsContextActions['TRIGGER_REFRESH'],
		});
	};

	return (
		<header className="header">
			<div className="header-title">
				<span className="header-title-text">{activeRoute.label}</span>
				<span className="header-title-caption">
					{!fetchingWords &&
						wordsFetched &&
						activeRoute.hash === ROUTES['WORDS'].hash &&
						words.length + ' word' + (words.length === 1 ? '' : 's')}
				</span>
			</div>
			<div className="header-actions">
				<span>
					<p>{user.email}</p>
				</span>
				<span>
					<Button
						className="header-actions-button"
						title="Logout"
						onClick={logoutHandler}
					>
						Logout
					</Button>
				</span>
				<span>
					<Button
						loading={fetchingWords || fetchingKnownWords}
						className="header-actions-button"
						title="Refresh Words"
						onClick={refreshWordsHandler}
					>
						<FontAwesomeIcon icon="redo-alt" />
					</Button>
				</span>
				<span>
					<Button
						className="header-actions-button"
						title="Add word"
						onClick={() => setAddWordOpen(true)}
						disabled={addWordOpen}
						style={{ cursor: 'pointer' }}
					>
						<FontAwesomeIcon icon="plus" size="lg" />
					</Button>
					<span className="header-add-word-placeholder">
						<AddWord
							open={addWordOpen}
							onClose={() => {
								setAddWordOpen(false);
							}}
						/>
					</span>
				</span>
			</div>
		</header>
	);
};

export default Header;
