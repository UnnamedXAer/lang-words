import React from 'react';
import './withAuthContainer.css';

const withAuthContainer = (WrapperFormComponent) => {
	return class extends React.Component {
		render() {
			return (
				<div className="auth-container">
					<div className="auth">
						<WrapperFormComponent />
					</div>
				</div>
			);
		}
	};
};

export default withAuthContainer;
