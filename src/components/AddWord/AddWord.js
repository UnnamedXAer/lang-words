import React, { useState, useContext } from 'react';
import './AddWord.css';
import DropDown from '../UI/DropDown/DropDown';
import EditWordForm from '../EditWordForm/EditWordForm';
import Button from '../UI/Button';
import { WordsContext, WordsContextActions } from '../../context/WordsContext';
import { sanitizeWord } from '../../utils/wordValidator';

const AddWord = ({ open, onClose }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [state, dispatch] = useContext(WordsContext);
	const [word, setWord] = useState({ word: '', translations: [''] });

	const cancelHandler = () => closePanel();

	const closePanel = () => {
		onClose();
		setError(null);
		setLoading(false);
		setWord({ word: '', translations: [''] });
	};

	const addWord = (word, translations) =>
		new Promise((resolve, reject) => {
			setTimeout(() => {
				const newWord = {
					id: Math.round(Math.random() * 1000000000000000).toString(),
					word,
					translations: [...translations],
					createAt: new Date(),
					acknowledges: [],
					known: false,
				};
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
				resolve();
			}, 1000);
		});

	const submitHandler = async (ev) => {
		setError(null);
		if (
			state.words.find(
				(x) => x.word.toLowerCase() === word.word.trim().toLowerCase()
			)
		) {
			return setError('Word already exists');
		}
		let sanitizedWord;
		try {
			sanitizedWord = sanitizeWord(word.word, word.translations);
		} catch (err) {
			return setError(err.message);
		}
		setLoading(true);
		try {
			await addWord(sanitizedWord.word, sanitizedWord.translations);
			closePanel();
		} catch (err) {
			setError(err.message);
			setLoading(false);
		}
	};

	return (
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
			<div>
				<p>{error}</p>
			</div>
		</DropDown>
	);
};

export default AddWord;
