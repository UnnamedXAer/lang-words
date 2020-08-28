import React, { useRef } from 'react';
import './Dialog.css';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';
import Button from '../Button';
import Spinner from '../Spinner/Spinner';
import Backdrop from '../Backdrop/Backdrop';
import Divider from '../Divider/Divider';

const dialogRoot = document.getElementById('dialog-root');

export const getInitialDialogData = () => ({
	open: false,
	error: null,
	loading: false,
	title: null,
	content: null,
	actions: null,
	onClose: void 0,
	onExited: void 0,
});

const Dialog = ({ data }) => {
	const {
		open,
		error,
		loading,
		disabled,
		title,
		content,
		actions,
		onClose,
		onExited,
	} = data;
	const ref = useRef(null);

	const keyUpHandler = (ev) => {
		if (ev.keyCode === 27) {
			onClose();
		}
	};

	const enteringHandler = () => {
		if (!ref.current.contains(document.activeElement)) {
			ref.current.focus();
		}
	};

	return (
		<>
			<Backdrop onClose={loading ? void 0 : onClose} open={open} timeout={200} />
			{ReactDOM.createPortal(
				<Transition
					timeout={200}
					in={open}
					mountOnEnter
					unmountOnExit
					onExited={onExited}
					appear
					nodeRef={ref}
					onEntering={enteringHandler}
				>
					{(status) => {
						return (
							<div
								tabIndex={-1}
								role="dialog"
								ref={ref}
								className={['dialog-backdrop'].join('')}
								onKeyUp={keyUpHandler}
							>
								<div className={['dialog', ' dialog-', status].join('')}>
									<div className="dialog-title">{title}</div>
									<div className="dialog-content">{content}</div>
									<Divider />
									{error && <div className="dialog-error">{error}</div>}
									<div className="dialog-actions">
										{actions ? (
											<>
												{loading && <Spinner size="small" />}
												{actions.map((action) => (
													<Button
														key={action.label}
														btnType={action.btnType}
														onClick={action.action}
														disabled={disabled || loading}
													>
														{action.label}
													</Button>
												))}
											</>
										) : (
											<Button>OK</Button>
										)}
									</div>
								</div>
							</div>
						);
					}}
				</Transition>,
				dialogRoot
			)}
		</>
	);
};

export default Dialog;
