import React from 'react';
import './Spinner.css';

/**
 * Loading indicator
 *
 * @param {{
		 size: "large" | "medium" | "small";
		 containerClass?: string
	}} props
 * @returns
 */
const Spinner = (props) => {
	return (
		<div className={['spinner-container', props.containerClass].join(' ')}>
			<div className="spinner" data-size={props.size || 'medium'} />
			{props.children && <p>{props.children}</p>}
		</div>
	);
};

export default Spinner;
