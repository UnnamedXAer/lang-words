import React, { useRef } from 'react';
import './Backdrop.css';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';

const backdropRoot = document.getElementById('backdrop-root');

const Backdrop = ({ onClose, open, onExited, timeout = 200 }) => {
	const backdropRef = useRef(null);

	return ReactDOM.createPortal(
		<Transition
			timeout={timeout}
			in={open}
			mountOnEnter
			unmountOnExit
			onExited={onExited}
			appear
			nodeRef={backdropRef}
		>
			{(status) => (
				<div
					ref={backdropRef}
					className={`backdrop backdrop-${status}`}
					onClick={onClose}
				></div>
			)}
		</Transition>,
		backdropRoot
	);
};

export default Backdrop;
