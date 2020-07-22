import React from 'react';
import './Button.css';

const Button = (props) => {
	return (
		<button
			{...props}
			disabled={props.disabled}
			className={['button', props.className].join(' ')}
		/>
	);
};

export default Button;
