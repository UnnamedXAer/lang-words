import React from 'react';
import './Backdrop.css';

const Backdrop = ({ children, onClose }) => {
	return (
		<div className="backdrop" onClick={onClose}>
			{children}
		</div>
	);
};

export default Backdrop;
