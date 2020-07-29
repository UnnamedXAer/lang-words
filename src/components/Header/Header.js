import React, { useState } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../UI/Button';
import AddWord from '../AddWord/AddWord';

const Header = () => {
	const [addWordOpen, setAddWordOpen] = useState(false);

	return (
		<header className="header">
			<div className="header-title">
				<span className="header-title-text">new words</span>
				<span className="header-title-caption">{12} new words today</span>
			</div>
			<div className="header-actions">
				<span>
					<Button className="header-actions-button" title="Settings">
						<FontAwesomeIcon icon="cog" size="lg" />
					</Button>
				</span>
				<span>
					<Button
						className="header-actions-button"
						title="Add word"
						onClick={() => setAddWordOpen(true)}
						disabled={addWordOpen}
						style={{ cursor: 'pointer' }}
					>
						<FontAwesomeIcon icon="plus" size="lg" />
					</Button>
					<span className="header-add-word-placeholder">
						<AddWord
							open={addWordOpen}
							onClose={() => {
								setAddWordOpen(false);
							}}
						/>
					</span>
				</span>
			</div>
		</header>
	);
};

export default Header;
