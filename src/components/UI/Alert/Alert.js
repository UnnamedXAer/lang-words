import React from 'react';
import './Alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Button';

/**
 * Alert box
 *
 * @param { {
	severity: "info" | "error" | "warning" | "success";
	children: React.ReactNode;
	onClose?: (args: any) => void | Promise<void>;
	onClick: (args: any) => void | Promise<void>;
	className?: string;
  }} props
 */
const Alert = (props) => {
	const { severity = 'info', onClick, onClose, children, className } = props;

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

	return (
		<div
			className={`alert alert-${severity} ${className}`}
			onClick={onClick}
			role="alert"
		>
			<div className="alert-content">
				<div className="alert-icon">
					<FontAwesomeIcon icon={icon} size="lg" edgeMode="" />
				</div>
				{typeof message === 'string' ? <p>{children}</p> : <div>{children}</div>}
			</div>
			{onClose && <Button>{'&times;'}</Button>}
		</div>
	);
};

export default Alert;
