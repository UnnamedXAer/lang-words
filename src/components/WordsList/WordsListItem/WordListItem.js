import React from 'react';
import './WordsListItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../../UI/Card/Card';
import Button from '../../UI/Button';
import Spinner from '../../UI/Spinner/Spinner';

const WordListItem = ({ word, isNew, isDeleted, actions, loading }) => {
	return (
		<Card
			className={[
				'words-list-item-card',
				word.collapse
					? `words-list-item-hide words-list-item-hide-${
							isDeleted ? 'danger' : 'success'
					  }`
					: '',
				isNew ? 'word-list-item-new' : '',
			].join(' ')}
		>
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
							key={action.title}
							title={action.title}
							onClick={() => action.action(word.id)}
							disabled={loading}
						>
							{loading ? (
								<Spinner size="small" />
							) : typeof action.icon === 'string' ? (
								<FontAwesomeIcon icon={action.icon} />
							) : (
								<span className="fa-layers fa-fw">
									<FontAwesomeIcon icon={action.icon[0]} />
									<FontAwesomeIcon
										icon={action.icon[1]}
										transform="shrink-5 down-7 right-9"
									/>
								</span>
							)}
						</Button>
					))}
				</div>
			</div>
			<div className="words-list-item-footer">
				<p>
					Added at: <span>{word.createAt.toLocaleString()}</span>
				</p>
				<p>
					Acknowledges count: <span>{word.acknowledgesCnt}</span>
				</p>
				{word.lastAcknowledgeAt && (
					<p>
						Last acknowledged at{' '}
						<span>{word.lastAcknowledgeAt.toLocaleString()}</span>
					</p>
				)}
			</div>
		</Card>
	);
};

export default WordListItem;
