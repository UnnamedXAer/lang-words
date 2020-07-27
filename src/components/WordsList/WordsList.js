import React, { useState, useContext } from 'react';
import './WordsList.css';
import WordListItem from './WordsListItem/WordListItem';
import { WordsContext, WordsContextActions } from '../../context/WordsContext';

const WordsList = () => {
	const [state, dispatch] = useContext(WordsContext);
	const [openEdit, setOpenEdit] = useState(false);
	const [editedWordId, setEditedWordId] = useState(null);

	const deleteHandler = (id) => {
		const sure = window.confirm('sure to delete>, ' + id);
		if (sure) {
			dispatch({
				type: WordsContextActions.DELETE_WORD,
				payload: { id },
			});
		}
	};

	const editHandler = (id) => {
		setEditedWordId(id);
		setOpenEdit(true);
	};

	const markAsKnownHandler = (id) => {
		const sure = window.confirm('sure to mark as known?, ' + id);
		if (sure) {
			dispatch({
				type: WordsContextActions.MARK_AS_KNOWN,
				payload: { id },
			});
		}
	};

	const acknowledgeHandler = (id) => {
		dispatch({
			type: WordsContextActions.ACKNOWLEDGE_WORD,
			payload: { id },
		});
	};

	const actions = [
		{ title: 'Edit word', icon: 'edit', action: editHandler },
		{ title: 'Delete word', icon: 'trash-alt', action: deleteHandler },
		{ title: 'Mark as known', icon: 'check-double', action: markAsKnownHandler },
		{ title: 'Acknowledge', icon: 'check', action: acknowledgeHandler },
	];

	return (
		<section className="words-list">
			{state.words
				.filter((x) => !x.known)
				.map((word) => (
					<WordListItem key={word.id} word={word} actions={actions} />
				))}{' '}
		</section>
	);
};

export default WordsList;
