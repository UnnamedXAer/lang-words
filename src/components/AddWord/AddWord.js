import React, { useState } from 'react';
import './AddWord.css';
import Button from '../UI/Button';
import DropDown from '../UI/DropDown/DropDown';
import Input from '../UI/Input/Input';

const AddWord = (props) => {
	const [word, setWord] = useState('word');
	const [translation, setTranslation] = useState('desktop');

	const valueChangeHandler = (ev) => {
		if (ev.target.name === 'word') {
			setWord(ev.target.value);
		} else {
			setTranslation(ev.target.value);
		}
	};

	const submitHandler = (ev) => {
		props.onClose();
	};

	return (
		<DropDown className="add-word" open={props.open} onClose={props.onClose}>
			<Input
				name="word"
				value={word}
				onChange={valueChangeHandler}
				placeholder="Enter word"
			/>
			<Input
				name="translation"
				value={translation}
				onChange={valueChangeHandler}
				placeholder="Enter translation"
			/>
			<Button onClick={submitHandler}>Add</Button>
		</DropDown>
	);
};

export default AddWord;
