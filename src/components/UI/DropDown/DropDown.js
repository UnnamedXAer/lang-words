import React, { useRef, useEffect } from 'react';
import './DropDown.css';

const DropDown = ({ open, children, onClose, className }) => {
	const ref = useRef(null);

	useEffect(() => {
		const clickOutsideHandler = (ev) => {
			if (ref.current && !ref.current.contains(ev.target)) {
				onClose();
			}
		};

		const keyPressHandler = (ev) => {
			console.log(ev.keyCode);
			if (ev.keyCode === 27) {
				onClose();
			}
		};
		const element = ref.current;
		if (open) {
			document.addEventListener('click', clickOutsideHandler);
			element.addEventListener('keypress', keyPressHandler);
		}

		return () => {
			document.removeEventListener('click', clickOutsideHandler);
			element.addEventListener('keypress', keyPressHandler);
		};
	}, [onClose, open]);

	return (
		<div
			tabIndex={1}
			
			ref={ref}
			className={['drop-down', open ? 'drop-down-open' : '', className].join(' ')}
		>
			{children}
		</div>
	);
};

export default DropDown;
