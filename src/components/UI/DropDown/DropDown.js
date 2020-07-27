import React, { useRef, useEffect } from 'react';
import './DropDown.css';

const DropDown = ({ open, children, onClose, className }) => {
	const dropDownRef = useRef(null);

	useEffect(() => {
		const clickOutsideHandler = (ev) => {
			if (dropDownRef.current && !dropDownRef.current.contains(ev.target)) {
				onClose();
			}
		};

		const keyPressHandler = (ev) => {
			console.log(ev.keyCode);
			if (ev.keyCode === 27) {
				onClose();
			}
		};

		if (open) {
			document.addEventListener('click', clickOutsideHandler);
			document.addEventListener('keyup', keyPressHandler);
		}

		return () => {
			document.removeEventListener('click', clickOutsideHandler);
			document.removeEventListener('keyup', keyPressHandler);
		};
	}, [onClose, open]);

	return (
		<div
			tabIndex={1}
			ref={dropDownRef}
			className={['drop-down', open ? 'drop-down-open' : '', className].join(' ')}
		>
			{children}
		</div>
	);
};

export default DropDown;
