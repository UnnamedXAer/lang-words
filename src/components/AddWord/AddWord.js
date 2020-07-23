import React, { useState } from 'react';
import './AddWord.css';
import Button from '../UI/Button';
import DropDown from '../UI/DropDown/DropDown';
import Input from '../UI/Input/Input';

const AddWord = (props) => {
	const [word, setWord] = useState('word');
	const [translation, setTranslation] = useState('desktop');
	const [loading, setLoading] = useState(false);

	const valueChangeHandler = (ev) => {
		if (ev.target.name === 'word') {
			setWord(ev.target.value);
		} else {
			setTranslation(ev.target.value);
		}
	};

	const cancelHandler = () => {
		setLoading(false);
		props.onClose();
	};

	const submitHandler = (ev) => {
		setLoading(true);
		setTimeout(() => {
			props.onClose();
			setLoading(false);
		}, 1000);
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
			<div className="add-word-actions">
				<Button btnType="danger" onClick={cancelHandler}>
					Cancel
				</Button>
				<Button btnType="success" onClick={submitHandler} loading={loading}>
					Add
				</Button>
			</div>
		</DropDown>
	);
};

export default AddWord;
