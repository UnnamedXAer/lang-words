import React, { useEffect, useRef } from 'react';
import './Dialog.css';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';
import Button from '../Button';

const dialogRoot = document.getElementById('dialog-root');

const Dialog = ({ open, content, title, actions, onClose, error, onExited }) => {
	const backdropRef = useRef(null);

	return ReactDOM.createPortal(
		<Transition
			timeout={150}
			in={open}
			mountOnEnter
			unmountOnExit
			onExited={onExited}
			appear
			nodeRef={backdropRef}
		>
			{(status) => {
				return (
					<div
						className={['dialog-backdrop', ' dialog-backdrop-', status].join(
							''
						)}
						onClose={onClose}
					>
						<div className={['dialog', ' dialog-', status].join('')}>
							<div className="dialog-title">{title}</div>
							<hr />
							<div className="dialog-content">{content}</div>
							<hr />
							{error && <div className="dialog-error">{error}</div>}
							<div className="dialog-actions">
								{actions ? (
									actions.map((action) => (
										<Button
											key={action.label}
											btnType={action.btnType}
											onClick={action.action}
											disabled={action.disabled}
											loading={action.loading}
										>
											{action.label}
										</Button>
									))
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
	);
};

export default Dialog;
