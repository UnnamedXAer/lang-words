import React, { useContext } from 'react';
import './WorkSection.css';
import Button from '../UI/Button';
import { WordsContext } from '../../context/WordsContext';

const WorkSection = () => {
	const [state] = useContext(WordsContext);

	return (
		<main className="work-section">
			<h1>content</h1>
			{state.words.map((word) => (
				<section key={word.word}>
					<h3>{word.word}</h3>
					<ul>
						{word.translations.map((translation) => (
							<li key={translation}>{translation}</li>
						))}
					</ul>
				</section>
			))}
		</main>
	);
};

export default WorkSection;
