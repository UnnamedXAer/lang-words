import React, { useState, useContext, useRef, useEffect } from 'react';
import './Words.css';
import WordsList from '../WordsList/WordsList';
import { WordsContext, WordsContextActions } from '../../context/WordsContext';
import Dialog from '../UI/Dialog/Dialog';
import EditWordForm from '../EditWordForm/EditWordForm';
import { sanitizeWord } from '../../utils/wordValidator';

const Words = () => {
	const [state, dispatch] = useContext(WordsContext);
	const [loadingWords, setLoadingWords] = useState({});
	const [actionError, setActionError] = useState(null);
	const [openEdit, setOpenEdit] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [editError, setEditError] = useState(null);
	const [editedWord, setEditedWord] = useState(null);

	const isMounted = useRef(false);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

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
		const word = state.words.find((x) => x.id === id);
		setEditedWord(word);
		setOpenEdit(true);
	};

	const markAsKnownHandler = async (id) => {
		const sure = window.confirm('sure to mark as known?, ' + id);
		if (sure) {
			setLoadingWords((prevState) => ({ ...prevState, [id]: true }));
			try {
				await asyncFunc(1000);
				dispatch({
					type: WordsContextActions.MARK_AS_KNOWN_START,
					payload: { id },
				});
				if (isMounted.current) {
					setTimeout(() => {
						if (isMounted.current) {
							setLoadingWords((prevState) => ({
								...prevState,
								[id]: false,
							}));
						}
						dispatch({
							type: WordsContextActions.MARK_AS_KNOWN,
							payload: { id },
						});
					}, 500);
				} else {
					dispatch({
						type: WordsContextActions.MARK_AS_KNOWN,
						payload: { id },
					});
				}
			} catch (err) {
				if (isMounted.current) {
					setActionError(err.message);
					setLoadingWords((prevState) => ({
						...prevState,
						[id]: false,
					}));
				}
			}
		}
	};

	const asyncFunc = (
		timeout = 1000,
		func = (t) => {
			console.log('timeout executed', t);
		},
		shouldReject = false
	) =>
		new Promise((resolve, reject) => {
			const t = setTimeout(() => {
				func(t);
				if (shouldReject) {
					reject(new Error('Async rejected :('));
				} else {
					resolve();
				}
			}, timeout);
		});

	const acknowledgeHandler = (id) => {
		dispatch({
			type: WordsContextActions.ACKNOWLEDGE_WORD,
			payload: { id },
		});
	};

	const wordUpdateHandler = (word, translations) => {
		setEditedWord((prevState) => ({
			...prevState,
			word,
			translations: [...translations],
		}));
	};

	const saveEditedWordHandler = async () => {
		setEditError(null);
		let sanitizedWord;
		try {
			sanitizedWord = sanitizeWord(editedWord.word, editedWord.translations);
		} catch (err) {
			return setEditError(err.message);
		}
		setEditLoading(true);
		try {
			await editWord(editedWord.id, sanitizedWord.word, sanitizedWord.translations);
			if (isMounted.current) {
				setEditedWord(null);
			}
		} catch (err) {
			if (isMounted.current) {
				setEditError(err.message);
			}
		}
		if (isMounted) {
			setOpenEdit(false);
			setEditLoading(false);
		}
	};

	const editWord = (id, word, translations) =>
		new Promise((resolve, reject) => {
			setTimeout(() => {
				dispatch({
					type: WordsContextActions.UPDATE_WORD,
					payload: {
						id,
						word,
						translations,
					},
				});
				resolve();
			}, 2000);
		});

	const actions = [
		{ title: 'Edit word', icon: 'edit', action: editHandler },
		{ title: 'Delete word', icon: 'trash-alt', action: deleteHandler },
		{ title: 'Mark as known', icon: 'check-double', action: markAsKnownHandler },
		{ title: 'Acknowledge', icon: 'check', action: acknowledgeHandler },
	];

	return (
		<>
			{actionError && <div className="errorPanel">{actionError}</div>}
			<WordsList
				words={state.words}
				actions={actions}
				loadingWords={loadingWords}
			/>
			<Dialog
				open={openEdit}
				onClose={() => setOpenEdit(false)}
				title="Edit word"
				error={editError}
				content={
					<EditWordForm
						onWordUpdate={wordUpdateHandler}
						update={openEdit}
						word={editedWord}
					/>
				}
				actions={[
					{
						label: 'Save',
						action: saveEditedWordHandler,
						loading: editLoading,
					},
					{
						label: 'Cancel',
						btnType: 'danger',
						action: () => setOpenEdit(false),
						disabled: editLoading,
					},
				]}
			/>
		</>
	);
};

export default Words;
