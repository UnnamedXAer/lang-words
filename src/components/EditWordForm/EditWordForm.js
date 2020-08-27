import React, { useState, useEffect, useRef } from 'react';
import './EditFormWord.css';
import Input from '../UI/Input/Input';
import Button from '../UI/Button';

const EditWordForm = ({ word, onWordUpdate, update }) => {
	const [untranslatedWord, setUntranslatedWord] = useState(word ? word.word : '');
	const [translations, setTranslations] = useState(
		word && word.translations.length > 0 ? word.translations : ['']
	);
	const [focusIdx, setFocusIdx] = useState(null);
	const wordInpRef = useRef(null);
	const translationRefs = useRef([]);

	useEffect(() => {
		if (update) {
			setTranslations(
				word && word.translations.length > 0 ? word.translations : ['']
			);
			setUntranslatedWord(word ? word.word : '');
		}
	}, [update, word]);

	useEffect(() => {
		if (update) {
			wordInpRef.current.focus();
		} else {
			if (wordInpRef.current) {
				wordInpRef.current.blur();
			}
		}
	}, [update]);

	useEffect(() => {
		if (focusIdx !== null && translationRefs.current[focusIdx]) {
			translationRefs.current[focusIdx].focus();
			setFocusIdx(null);
		}
	}, [focusIdx]);

	const valueChangeHandler = (ev) => {
		const { value, name } = ev.target;
		if (name === 'word') {
			setUntranslatedWord(value);
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

	const inputBlurHandler = (ev) => {
		onWordUpdate(untranslatedWord, translations);
	};

	const wordKeyUpHandler = (ev) => {
		if (ev.keyCode === 13 || ev.keyCode === 40) {
			setFocusIdx(0);
		}
	};

	const translationKeyUpHandler = (ev) => {
		if (ev.keyCode === 13) {
			const idx = +ev.target.getAttribute('data-index');
			if (translations.length - 1 === idx) {
				setTranslations((prevState) => prevState.concat(''));
			}
			setFocusIdx(idx + 1);
		} else if (ev.keyCode === 38) {
			const idx = +ev.target.getAttribute('data-index');
			if (idx > 0) {
				setFocusIdx(idx - 1);
			} else {
				wordInpRef.current.focus();
			}
		} else if (ev.keyCode === 40) {
			const idx = +ev.target.getAttribute('data-index');
			if (idx < translationRefs.current.length - 1) {
				setFocusIdx(idx + 1);
			}
		}
	};

	const toggleTranslationInputHandler = (i) => {
		setTranslations((prevState) => {
			if (translations.length - 1 === i) {
				return prevState.concat('');
			} else {
				const updatedState = [...prevState];
				updatedState.splice(i, 1);
				return updatedState;
			}
		});
	};

	return (
		<div>
			<Input
				name="word"
				value={untranslatedWord}
				ref={wordInpRef}
				onBlur={inputBlurHandler}
				autoComplete="false"
				autoCorrect="false"
				autoCapitalize="false"
				onKeyUp={wordKeyUpHandler}
				onChange={valueChangeHandler}
				placeholder="Enter word"
			/>
			<fieldset>
				<label className="edit-word-form-translations-label">Translations</label>
				{translations.map((value, i) => (
					<span key={i} className="edit-word-form-translations-inp-wrapper">
						<Input
							autoComplete="false"
							autoCorrect="false"
							autoCapitalize="false"
							name={'translation-' + i}
							data-index={i}
							ref={(el) => (translationRefs.current[i] = el)}
							value={value}
							onChange={valueChangeHandler}
							onBlur={inputBlurHandler}
							onKeyUp={translationKeyUpHandler}
						/>
						<Button onClick={() => toggleTranslationInputHandler(i)}>
							{translations.length - 1 === i ? '+' : '-'}
						</Button>
					</span>
				))}
			</fieldset>
		</div>
	);
};

export default EditWordForm;
