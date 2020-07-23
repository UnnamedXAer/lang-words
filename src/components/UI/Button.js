import React from 'react';
import './Button.css';
import Spinner from './Spinner/Spinner';

const Button = (props) => {
	return (
		<button
			disabled={props.disabled || props.loading}
			className={['button', props.btnType, props.className].join(' ')}
			onClick={props.onClick}
		>
			{props.loading && (
				<div className="button-spinner-wrapper">
					<Spinner size="small" />
				</div>
			)}
			{props.children}
		</button>
	);
};

export default Button;
