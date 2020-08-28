import React, { useState, useContext } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../UI/Button';
import AddWord from '../AddWord/AddWord';
import { WordsContext, WordsContextActions } from '../../context/WordsContext';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/route';

const Header = ({ appState: { user } }) => {
	const location = useLocation();
	const title =
		user && location.state && location.state.key && location.state.key
			? ROUTES[location.state.key].label
			: '';
	const [addWordOpen, setAddWordOpen] = useState(false);
	const [
		{ words, fetchingWords, fetchingKnownWords, wordsFetched },
		dispatchWords,
	] = useContext(WordsContext);

	const refreshWordsHandler = () => {
		dispatchWords({
			type: WordsContextActions['TRIGGER_REFRESH'],
		});
	};

	return (
		<header className="header">
			<div className="header-title">
				<span className="header-title-text">{title}</span>
				<span className="header-title-caption">
					{!fetchingWords &&
						wordsFetched &&
						location.pathname === ROUTES['WORDS'].path &&
						words.length + ' word' + (words.length === 1 ? '' : 's')}
				</span>
			</div>
			<div className="header-actions">
				{location.pathname.startsWith('/words') && (
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
				)}
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
