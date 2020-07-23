import React from 'react';
import './Spinner.css';

const Spinner = (props) => {
	return <div className="spinner" data-size={props.size}></div>;
};

export default Spinner;
