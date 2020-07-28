import React, { useEffect, useRef } from 'react';
import './Dialog.css';
import ReactDOM from 'react-dom';
import Button from '../Button';

const dialogRoot = document.getElementById('dialog-root');

const Dialog = ({ open, content, title, actions, onClose, error }) => {
	const ref = useRef(document.createElement('div'));

	useEffect(() => {
		const el = ref.current;
		dialogRoot.appendChild(el);
		return () => {
			ref.current = null;
			setTimeout(() => {
				dialogRoot.removeChild(el);
			}, 500);
		};
	}, []);

	return ReactDOM.createPortal(
		<div
			className={['dialog-backdrop', open ? 'dialog-backdrop-open' : ''].join(' ')}
			onClose={onClose}
			open={open}
		>
			<div className={['dialog', open ? 'dialog-open' : ''].join(' ')}>
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
		</div>,
		ref.current
	);
};

export default Dialog;
