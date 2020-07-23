import React, { useContext } from 'react';
import './WorkSection.css';
import { CounterContext } from '../../App';
import Button from '../UI/Button';

const WorkSection = () => {
	const [counter, setCounter] = useContext(CounterContext);

	return (
		<main className="work-section">
			<h1>content</h1>
			<p>{JSON.stringify(counter, null, '\t')}</p>
			<Button
				onClick={() => {
					setCounter((prevState) => ({
						value: prevState.value + 1,
						prevValue: prevState.value,
					}));
				}}
			>
				i++
			</Button>
			<hr />
			<button>i++</button>
		</main>
	);
};

export default WorkSection;
