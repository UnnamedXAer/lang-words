import React, { useState, useEffect, useRef } from 'react';
import './EditFormWord.css';
import Input from '../UI/Input/Input';
import Button from '../UI/Button';

const EditWordForm = ({ word, onWordUpdate, update }) => {
	const [untranslatedWord, setUntranslatedWord] = useState(word ? word.word : '');
	const [translations, setTranslations] = useState(
		word && word.translations.length > 0 ? word.translations : ['']
	);
	const wordInpRef = useRef(null);

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
							value={value}
							onChange={valueChangeHandler}
							onBlur={inputBlurHandler}
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
		</div>
	);
};

export default EditWordForm;
