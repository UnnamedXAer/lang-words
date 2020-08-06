import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import './Words.css';
import WordsList from '../WordsList/WordsList';
import {
	WordsContext,
	WordsContextActions,
	wordsSortFunc,
} from '../../context/WordsContext';
import Dialog, { getInitialDialogData } from '../UI/Dialog/Dialog';
import EditWordForm from '../EditWordForm/EditWordForm';
import { sanitizeWord } from '../../utils/wordValidator';
import Snackbar from '../UI/Snackbar/Snackbar';
import Spinner from '../UI/Spinner/Spinner';
import Alert from '../UI/Alert/Alert';
import { AppContext, ROUTES } from '../../context/AppContext';
import { FirebaseContext } from '../../context/FirebaseContext';

const Words = () => {
	const [
		{
			activeRoute: { hash },
		},
	] = useContext(AppContext);
	const isInWords = hash === ROUTES['WORDS'].hash;
	const [
		{
			words,
			knownWords,
			wordsMarkedAsNew,
			wordsMarkedAsDeleted,
			fetchingWords,
			fetchingKnownWords,
			wordsFetched,
			knownWordsFetched,
		},
		dispatch,
	] = useContext(WordsContext);
	const firebase = useContext(FirebaseContext);
	const loading = isInWords ? fetchingWords : fetchingKnownWords;
	const [error, setError] = useState(null);
	const [loadingWords, setLoadingWords] = useState({});
	const [actionError, setActionError] = useState(null);
	const [editedWord, setEditedWord] = useState(null);
	const [dialogData, setDialogData] = useState(getInitialDialogData());

	const isMounted = useRef(false);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const loadWords = useCallback(
		async (_isInWords) => {
			setError(null);
			try {
				dispatch({
					type: WordsContextActions['FETCH_WORDS_START'],
				});
				dispatch({
					type: WordsContextActions['FETCH_KNOWN_WORDS_START'],
				});
				const snapshot = await firebase.words().once('value');
				const values = snapshot.val();
				const receivedWords = [];
				const receivedKnownWords = [];
				if (values !== null) {
					const keys = Object.keys(values);
					keys.forEach((key) => {
						const word = { ...values[key] };
						word.id = key;
						word.lastAcknowledgeAt = word.lastAcknowledgeAt
							? new Date(word.lastAcknowledgeAt)
							: null;
						word.createAt = new Date(values[key].createAt);

						if (word.known) {
							receivedKnownWords.push(word);
						} else {
							receivedWords.push(word);
						}
					});
				}
				receivedWords.sort(wordsSortFunc);
				receivedKnownWords.sort(wordsSortFunc);

				dispatch({
					type: WordsContextActions['FETCH_WORDS_FINISH'],
					payload: { words: receivedWords },
				});
				dispatch({
					type: WordsContextActions['FETCH_KNOWN_WORDS_FINISH'],
					payload: { words: receivedKnownWords },
				});
			} catch (err) {
				setError(err.message.split(': ')[1] || err.message);
			}
		},
		[dispatch, firebase]
	);

	useEffect(() => {
		if ((isInWords && !wordsFetched) || (!isInWords && !knownWordsFetched)) {
			loadWords(isInWords);
		}
	}, [dispatch, isInWords, knownWordsFetched, loadWords, wordsFetched]);

	const deleteHandler = (id) => {
		setDialogData({
			open: true,
			loading: false,
			error: null,
			title: 'Delete word',
			content: (
				<p className="words-delete-word">
					Are you sure you want to delete word{' '}
					<strong className="words-delete-word-highlight">
						{(isInWords ? words : knownWords).find((x) => x.id === id).word}
					</strong>
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
			await firebase.words().child(`/${id}`).remove();
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
				setActionError(err.message.split(': ')[1] || err.message);
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
			await firebase
				.words()
				.child(`/${id}`)
				.update({
					lastAcknowledgeAt: firebase.ServerValueNS.TIMESTAMP,
					acknowledgesCnt: firebase.ServerValueNS.increment(1),
					known: true,
				});
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
				setActionError(err.message.split(': ')[1] || err.message);
				setLoadingWords((prevState) => ({
					...prevState,
					[id]: false,
				}));
			}
		}
	};

	const acknowledgeHandler = async (id) => {
		setActionError(null);
		setLoadingWords((pS) => ({ ...pS, [id]: true }));
		try {
			await firebase
				.words()
				.child(`/${id}`)
				.update({
					lastAcknowledgeAt: firebase.ServerValueNS.TIMESTAMP,
					acknowledgesCnt: firebase.ServerValueNS.increment(1),
				});
			dispatch({
				type: WordsContextActions.ACKNOWLEDGE_WORD,
				payload: { id },
			});
		} catch (err) {
			setActionError(err.message.split(': ')[1] || err.message);
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
		async (id, word, translations) => {
			setLoadingWords((prevState) => ({ ...prevState, [id]: true }));
			try {
				await firebase.words().child(`/${id}`).update({
					word,
					translations,
				});
				dispatch({
					type: WordsContextActions.UPDATE_WORD,
					payload: {
						id,
						word,
						translations,
					},
				});
			} catch (err) {
				if (isMounted.current) {
					setActionError(err.message.split(': ')[1] || err.message);
				}
			}
			if (isMounted.current) {
				setLoadingWords((prevState) => ({
					...prevState,
					[id]: false,
				}));
			}
		},
		[dispatch, firebase]
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

	const unMarkAsWordHandler = (id) => {
		unMarkAsWord(id);
	};

	const unMarkAsWord = async (id) => {
		setLoadingWords((prevState) => ({ ...prevState, [id]: true }));
		try {
			await firebase.words().child(`/${id}`).update({
				known: false,
			});
			dispatch({
				type: WordsContextActions.UN_MARK_WORD_START,
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
						type: WordsContextActions.UN_MARK_WORD,
						payload: { id },
					});
				}, 500);
			} else {
				dispatch({
					type: WordsContextActions.UN_MARK_WORD,
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

	const actions = [
		{ title: 'Edit word', icon: 'edit', action: editHandler },
		{ title: 'Delete word', icon: 'trash-alt', action: deleteHandler },
	];

	if (isInWords) {
		actions.push(
			{ title: 'Mark as known', icon: 'check-double', action: markAsKnownHandler },
			{ title: 'Acknowledge', icon: 'check', action: acknowledgeHandler }
		);
	} else {
		actions.push({
			title: 'Move to Words',
			icon: ['check-double', 'times'],
			action: unMarkAsWordHandler,
		});
	}

	return (
		<>
			{error ? (
				<Alert onClick={() => setError(null)} severity="error">
					{error}
				</Alert>
			) : loading ? (
				<Spinner size="large" containerClass="words-spinner-container">
					Loading...
				</Spinner>
			) : (
				<WordsList
					words={isInWords ? words : knownWords}
					wordsMarkedAsNew={wordsMarkedAsNew}
					wordsMarkedAsDeleted={wordsMarkedAsDeleted}
					actions={actions}
					loadingWords={loadingWords}
				/>
			)}
			<Dialog data={dialogData} />
			<Snackbar
				data={{
					onClose: () => setActionError(null),
					open: actionError !== null,
					content: actionError,
					severity: 'error',
				}}
			/>
		</>
	);
};

export default Words;
