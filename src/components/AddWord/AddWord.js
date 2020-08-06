import React, { useState, useContext } from 'react';
import './AddWord.css';
import DropDown from '../UI/DropDown/DropDown';
import EditWordForm from '../EditWordForm/EditWordForm';
import Button from '../UI/Button';
import { WordsContext, WordsContextActions } from '../../context/WordsContext';
import { sanitizeWord } from '../../utils/wordValidator';
import Snackbar, { getInitialSnackbarData } from '../UI/Snackbar/Snackbar';
import { FirebaseContext } from '../../context/FirebaseContext';

const AddWord = ({ open, onClose }) => {
	const [loading, setLoading] = useState(false);
	const firebase = useContext(FirebaseContext);
	const [state, dispatch] = useContext(WordsContext);
	const [word, setWord] = useState({ word: '', translations: [''] });
	const [snackbarData, setSnackbarData] = useState(getInitialSnackbarData());

	const cancelHandler = () => closePanel();

	const closePanel = () => {
		onClose();
		setLoading(false);
		setWord({ word: '', translations: [''] });
	};

	const addWord = async (word, translations) => {
		const newWord = {
			id: Math.round(Math.random() * 1000000000000000).toString(),
			word,
			translations: [...translations],
			createAt: new Date(),
			lastAcknowledge: null,
			acknowledgesCnt: 0,
			known: false,
		};
		firebase.addWord(newWord);
		document
			.querySelector('.work-section')
			.scroll({ top: 0, left: 0, behavior: 'smooth' });
		dispatch({
			type: WordsContextActions.ADD_WORD,
			payload: {
				word: newWord,
			},
		});
		setTimeout(() => {
			dispatch({
				type: WordsContextActions.SET_MARKED_AS_NEW,
				payload: {
					id: newWord.id,
					isNew: false,
				},
			});
		}, 600);
	};

	const showSnackbarMessage = (msg, severity = 'error') =>
		setSnackbarData({
			open: true,
			severity: severity,
			onClose: () =>
				setSnackbarData((prevState) => ({ ...prevState, open: false })),
			onExited: () => setSnackbarData(getInitialSnackbarData()),
			content: msg,
		});

	const submitHandler = async (ev) => {
		setSnackbarData((prevState) => ({ ...prevState, open: false }));
		if (
			state.words.find(
				(x) => x.word.toLowerCase() === word.word.trim().toLowerCase()
			)
		) {
			return showSnackbarMessage('Word already exists', 'warning');
		}
		let sanitizedWord;
		try {
			sanitizedWord = sanitizeWord(word.word, word.translations);
		} catch (err) {
			return showSnackbarMessage(err.message);
		}
		setLoading(true);
		try {
			await addWord(sanitizedWord.word, sanitizedWord.translations);
			showSnackbarMessage('Word added', 'success');
			closePanel();
		} catch (err) {
			setLoading(false);
			return showSnackbarMessage(err.message);
		}
	};

	return (
		<>
			<DropDown className="add-word" open={open} onClose={closePanel}>
				<EditWordForm
					update={open}
					word={word}
					onWordUpdate={(word, translations) => {
						setWord({ word, translations: [...translations] });
					}}
				/>
				<div className="add-word-actions">
					<Button btnType="danger" onClick={cancelHandler} disabled={loading}>
						Cancel
					</Button>
					<Button btnType="success" onClick={submitHandler} loading={loading}>
						Save
					</Button>
				</div>
			</DropDown>
			<Snackbar data={snackbarData} />
		</>
	);
};

export default AddWord;
