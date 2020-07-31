import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import './Words.css';
import WordsList from '../WordsList/WordsList';
import {
	WordsContext,
	WordsContextActions,
	wordsExample,
} from '../../context/WordsContext';
import Dialog, { getInitialDialogData } from '../UI/Dialog/Dialog';
import EditWordForm from '../EditWordForm/EditWordForm';
import { sanitizeWord } from '../../utils/wordValidator';
import Snackbar from '../UI/Snackbar/Snackbar';
import Spinner from '../UI/Spinner/Spinner';
import Alert from '../UI/Alert/Alert';

const Words = () => {
	const [
		{ words, wordsMarkedAsNew, wordsMarkedAsDeleted, fetchingWords },
		dispatch,
	] = useContext(WordsContext);
	const [error, setError] = useState(null);
	const [loadingWords, setLoadingWords] = useState({});
	const [actionError, setActionError] = useState('error');
	const [editedWord, setEditedWord] = useState(null);
	const [dialogData, setDialogData] = useState(getInitialDialogData());

	const isMounted = useRef(false);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const loadWords = async () => {
			setError(null);
			try {
				dispatch({
					type: WordsContextActions.FETCH_WORDS_START,
				});
				await asyncFunc(1200);

				dispatch({
					type: WordsContextActions.FETCH_WORDS_FINISH,
					payload: { words: wordsExample },
				});
			} catch (err) {
				setError(err.message);
			}
		};

		loadWords();
	}, [dispatch]);

	const deleteHandler = (id) => {
		setDialogData({
			open: true,
			loading: false,
			error: null,
			title: 'Delete word',
			content: (
				<p>
					Are you sure you want to delete{' '}
					<strong>{words.find((x) => x.id === id).word}</strong>
				</p>
			),
			actions: [
				{
					label: 'Yes',
					btnType: 'success',
					action: () => deleteWord(id),
				},
				{
					label: 'Cancel',
					btnType: 'danger',
					action: closeDialog,
				},
			],
			onClose: closeDialog,
		});
	};

	const deleteWord = async (id) => {
		setActionError(null);
		closeDialog();
		setLoadingWords((prevState) => ({ ...prevState, [id]: true }));
		try {
			await asyncFunc(1200, 0, 0);
			dispatch({
				type: WordsContextActions.DELETE_WORD_START,
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
						type: WordsContextActions.DELETE_WORD,
						payload: { id },
					});
				}, 500);
			} else {
				dispatch({
					type: WordsContextActions.DELETE_WORD,
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
	};

	const closeDialog = () =>
		setDialogData((prevState) => ({ ...prevState, open: false }));

	const editHandler = (id) => {
		const word = words.find((x) => x.id === id);
		setEditedWord(word);
		setDialogData({
			open: true,
			loading: false,
			error: null,
			title: 'Edit word',
			content: (
				<EditWordForm
					onWordUpdate={wordUpdateHandler}
					update={true}
					word={word}
				/>
			),
			actions: [
				{
					label: 'Save',
					btnType: 'success',
					action: saveEditedWordHandler,
				},
				{
					label: 'Cancel',
					btnType: 'danger',
					action: closeDialog,
				},
			],
			onClose: closeDialog,
			onExited: setDialogData(getInitialDialogData()),
		});
	};

	const markAsKnownHandler = (id) => {
		markAsKnown(id);
	};

	const markAsKnown = async (id) => {
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
	};

	const asyncFunc = (timeout = 1000, func, shouldReject = false) => {
		return new Promise((resolve, reject) => {
			const t = setTimeout(() => {
				typeof func === 'function'
					? func()
					: ((t) => {
							console.log('timeout executed', t);
					  })(t);
				if (shouldReject) {
					reject(new Error('Async rejected :('));
				} else {
					resolve();
				}
			}, timeout);
		});
	};

	const acknowledgeHandler = async (id) => {
		setActionError(null);
		setLoadingWords((pS) => ({ ...pS, [id]: true }));
		try {
			await asyncFunc(111, 0, 1);
			dispatch({
				type: WordsContextActions.ACKNOWLEDGE_WORD,
				payload: { id },
			});
		} catch (err) {
			setActionError(err.message);
		}
		if (isMounted.current) {
			setLoadingWords((pS) => ({ ...pS, [id]: false }));
		}
	};

	const wordUpdateHandler = (word, translations) => {
		setEditedWord((prevState) => ({
			...prevState,
			word,
			translations: [...translations],
		}));
	};

	const editWord = useCallback(
		(id, word, translations) =>
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
			}),
		[dispatch]
	);

	const saveEditedWordHandler = useCallback(async () => {
		let sanitizedWord;
		try {
			sanitizedWord = sanitizeWord(editedWord.word, editedWord.translations);
		} catch (err) {
			return setDialogData((prevState) => ({ ...prevState, error: err.message }));
		}
		setDialogData((prevState) => ({ ...prevState, loading: true, error: null }));
		try {
			await editWord(editedWord.id, sanitizedWord.word, sanitizedWord.translations);
		} catch (err) {
			if (isMounted.current) {
				setDialogData((prevState) => ({ ...prevState, error: err.message }));
			}
		}
		if (isMounted) {
			closeDialog();
			setEditedWord(null);
		}
	}, [editWord, editedWord]);

	useEffect(() => {
		if (editedWord) {
			setDialogData((prevState) => ({
				...prevState,
				actions: [
					{
						label: 'Save',
						btnType: 'success',
						action: saveEditedWordHandler,
					},
					{
						label: 'Cancel',
						btnType: 'danger',
						action: closeDialog,
					},
				],
			}));
		}
	}, [editedWord, saveEditedWordHandler]);

	const actions = [
		{ title: 'Edit word', icon: 'edit', action: editHandler },
		{ title: 'Delete word', icon: 'trash-alt', action: deleteHandler },
		{ title: 'Mark as known', icon: 'check-double', action: markAsKnownHandler },
		{ title: 'Acknowledge', icon: 'check', action: acknowledgeHandler },
	];

	return (
		<>
			{error ? (
				<Alert onClick={() => setError(null)} severity="error">
					{error}
				</Alert>
			) : fetchingWords ? (
				<Spinner size="large" />
			) : (
				<WordsList
					words={words}
					wordsMarkedAsNew={wordsMarkedAsNew}
					wordsMarkedAsDeleted={wordsMarkedAsDeleted}
					actions={actions}
					loadingWords={loadingWords}
				/>
			)}
			<Dialog data={dialogData} />
		</>
	);
};

export default Words;
