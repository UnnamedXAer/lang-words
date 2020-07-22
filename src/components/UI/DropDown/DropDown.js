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

		if (open) {
			document.addEventListener('click', clickOutsideHandler);
		}

		return () => {
			document.removeEventListener('click', clickOutsideHandler);
		};
	}, [onClose, open]);

	return (
		<div
			ref={ref}
			className={['drop-down', open ? 'drop-down-open' : '', className].join(' ')}
		>
			{children}
		</div>
	);
};

export default DropDown;
