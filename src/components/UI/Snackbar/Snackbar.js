import React, { useRef, useEffect } from 'react';
import './Snackbar.css';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';

const snackbarRoot = document.getElementById('snackbar-root');

const Snackbar = (props) => {
	const ref = useRef(null);

	const { open, content, severity, timeout = 4000, onClose, onExited } = props.data;

	useEffect(() => {
		let t;
		if (open && onClose) {
			t = setTimeout(onClose, timeout);
		}
		return () => {
			if (t) clearTimeout(t);
		};
	}, [onClose, timeout, open]);

	return ReactDOM.createPortal(
		<Transition
			timeout={200}
			in={open}
			mountOnEnter
			unmountOnExit
			onExited={onExited}
			appear
			nodeRef={ref}
		>
			{(status) => (
				<div
					ref={ref}
					className={`snackbar snackbar-${status} snackbar-${severity}`}
					onClick={onClose}
					role="alert"
				>
					<div className="snackbar-icon"></div>
					{typeof message === 'string' ? (
						<p>{content}</p>
					) : (
						<div>{content}</div>
					)}
				</div>
			)}
		</Transition>,
		snackbarRoot
	);
};

export default Snackbar;
