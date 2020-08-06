import React, { useRef, useEffect } from 'react';
import './Snackbar.css';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';
import Alert from '../Alert/Alert';

const snackbarRoot = document.getElementById('snackbar-root');
/**
 *
 * @return { {
	open: boolean,
	severity: "info" | "error" | "warning" | "success"
	timeout?: number,
	onClose: (args: any) => void | Promise<void>
	onExited?: (args: any) => void | Promise<void>
	content: React.ReactNode,
  }}
 */
export const getInitialSnackbarData = () => ({
	open: false,
	severity: 'info',
	timeout: 4000,
	onClose: () => {},
	onExited: void 0,
	content: null,
});

/**
 * Floating alert showing at the bottom of window.
 *
 * @param { {data:{
	open: boolean,
	severity: "info" | "error" | "warning" | "success"
	timeout?: number,
	onClose: (args: any) => void | Promise<void>
	onExited?: (args: any) => void | Promise<void>
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
					className={`snackbar snackbar-${status} `}
					onClick={onClose}
				>
					<Alert severity={severity} onClick={onClose}>
						{content}
					</Alert>
				</div>
			)}
		</Transition>,
		snackbarRoot
	);
};

export default Snackbar;
