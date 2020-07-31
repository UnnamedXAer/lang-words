import React from 'react';
import './WordsList.css';
import WordListItem from './WordsListItem/WordListItem';

const WordsList = ({
	words,
	wordsMarkedAsNew,
	wordsMarkedAsDeleted,
	loadingWords,
	actions,
}) => {
	return (
		<section className="words-list">
			{words.map((word) => (
				<WordListItem
					key={word.id}
					word={word}
					isNew={wordsMarkedAsNew[word.id]}
					isDeleted={wordsMarkedAsDeleted[word.id]}
					actions={actions}
					loading={loadingWords[word.id]}
				/>
			))}
		</section>
	);
};

export default WordsList;
