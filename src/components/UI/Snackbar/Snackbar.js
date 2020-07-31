import React, { useRef, useEffect } from 'react';
import './Snackbar.css';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const snackbarRoot = document.getElementById('snackbar-root');

/**
 * Floating alert showing at the bottom of window.
 *
 * @param { {data:{
	open: boolean,
	severity: "info" | "error" | "warning" | "success"
	timeout?: number,
	onClose: (args: any) => void | Promise<void>
	onExited: (args: any) => void | Promise<void>
	content: React.ReactNode,
  }}} props
 */
const Snackbar = (props) => {
	const ref = useRef(null);

	const {
		open,
		content,
		severity = 'info',
		timeout = 4000,
		onClose,
		onExited,
	} = props.data;

	useEffect(() => {
		let t;
		if (open && onClose) {
			// t = setTimeout(onClose, timeout);
		}
		return () => {
			if (t) clearTimeout(t);
		};
	}, [onClose, timeout, open]);

	let icon;
	switch (severity) {
		case 'error':
			icon = 'times-circle';
			break;
		case 'warning':
			icon = 'exclamation-triangle';
			break;
		case 'info':
			icon = 'exclamation-circle';
			break;
		case 'success':
			icon = 'check-circle';
			break;
		default:
			icon = 'exclamation-circle';
	}

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
					<div className="snackbar-icon">
						<FontAwesomeIcon icon={icon} size="lg" edgeMode="" />
					</div>
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
