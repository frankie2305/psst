import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
	const [showSignup, setShowSignup] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [showLogout, setShowLogout] = useState(false);

	return (
		<ModalContext.Provider
			value={{
				showSignup,
				setShowSignup,
				showLogin,
				setShowLogin,
				showLogout,
				setShowLogout,
			}}>
			{children}
		</ModalContext.Provider>
	);
};
