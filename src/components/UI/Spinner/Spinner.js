import React from 'react';
import './Spinner.css';

/**
 * Loading indicator
 *
 * @param {{
 		size: "large" | "medium" | "small"
	}} props
 * @returns
 */
const Spinner = (props) => {
	return <div className="spinner" data-size={props.size || 'medium'} />;
};

export default Spinner;
