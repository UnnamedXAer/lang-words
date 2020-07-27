import React, { useState, useContext, useRef, useEffect } from 'react';
import './AddWord.css';
import Button from '../UI/Button';
import DropDown from '../UI/DropDown/DropDown';
import Input from '../UI/Input/Input';
import { WordsContext } from '../../context/WordsContext';

const AddWord = ({ open, onClose }) => {
	const [word, setWord] = useState('');
	const [translations, setTranslations] = useState(['']);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [state, dispatch] = useContext(WordsContext);
	const wordInpRef = useRef(null);

	useEffect(() => {
		if (open) {
			wordInpRef.current.focus();
		}
	}, [open]);

	const valueChangeHandler = (ev) => {
		const { value, name } = ev.target;
		if (name === 'word') {
			setWord(value);
		} else {
			const idx = +name.split('-')[1];
			setTranslations((prevState) => {
				const updatedState = [...prevState];
				if (updatedState[idx] !== undefined) {
					updatedState[idx] = value;
				} else {
					updatedState.push(value);
				}
				return updatedState;
			});
		}
	};

	const cancelHandler = () => closePanel();

	const closePanel = () => {
		onClose();
		setError(null);
		setWord('');
		setTranslations(['']);
	};

	const addWord = (word, translations) =>
		new Promise((resolve, reject) => {
			setTimeout(() => {
				dispatch({
					type: 'ADD_WORD',
					payload: {
						word,
						translations,
					},
				});
				resolve();
			}, 2000);
		});

	const submitHandler = async (ev) => {
		const newWord = word.trim();
		if (
			state.words.findIndex((x) => x.word.toLowerCase() === newWord.toLowerCase()) >
			-1
		) {
			return setError('Word exists');
		}
		const newWordTranslations = [];
		for (let i = 0; i < translations.length; i++) {
			const wordTranslation = translations[i].trim();
			if (
				wordTranslation !== '' &&
				newWordTranslations.findIndex(
					(x) => x.toLowerCase() === wordTranslation.toLowerCase()
				) === -1
			) {
				newWordTranslations.push(wordTranslation);
			}
		}

		if (newWordTranslations.length === 0) {
			return setError('Enter at least one translation');
		}

		setError(null);
		setLoading(true);

		try {
			await addWord(newWord, translations);
			closePanel();
		} catch (err) {
			setError(err.toString());
			setLoading(false);
		}
	};

	return (
		<DropDown className="add-word" open={open} onClose={onClose}>
			<Input
				name="word"
				value={word}
				ref={wordInpRef}
				autoComplete={'false'}
				autoCorrect={'false'}
				autoCapitalize={'false'}
				onChange={valueChangeHandler}
				placeholder="Enter word"
			/>
			<fieldset>
				<label className="add-word-translations-label">Translations</label>
				{translations.map((value, i) => (
					<span key={i} className="add-word-translations-inp-wrapper">
						<Input
							autoComplete={'false'}
							autoCorrect={'false'}
							autoCapitalize={'false'}
							name={'translation-' + i}
							value={value}
							onChange={valueChangeHandler}
						/>
						<Button
							onClick={() =>
								setTranslations((prevState) => {
									if (translations.length - 1 === i) {
										return prevState.concat('');
									} else {
										const updatedState = [...prevState];
										updatedState.splice(i, 1);
										return updatedState;
									}
								})
							}
						>
							{translations.length - 1 === i ? '+' : '-'}
						</Button>
					</span>
				))}
			</fieldset>
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
