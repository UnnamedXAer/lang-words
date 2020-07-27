import React from 'react';
import './WordsListItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../../UI/Card/Card';
import Button from '../../UI/Button';

const WordListItem = ({ word, actions }) => {
	return (
		<Card className={word.collapse ? 'words-list-item-hide' : ''}>
			<div className="words-list-item">
				<div className="words-list-item-content">
					<div className="words-list-item-header">
						<h3>{word.word}</h3>
					</div>
					<hr />
					<div className="words-list-item-translations">
						<ul>
							{word.translations.map((translation) => (
								<li key={translation}>{translation}</li>
							))}
						</ul>
					</div>
				</div>
				<div className="words-list-item-actions">
					{actions.map((action) => (
						<Button
							key={action.icon}
							title={action.title}
							onClick={() => action.action(word.id)}
						>
							<FontAwesomeIcon icon={action.icon} />
						</Button>
					))}
				</div>
			</div>
		</Card>
	);
};

export default WordListItem;
