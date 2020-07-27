import React from 'react';
import './Input.css';

const Input = React.forwardRef((props, ref) => {
	return (
		<input {...props} ref={ref} className={['input', props.className].join(' ')} />
	);
});

export default Input;
