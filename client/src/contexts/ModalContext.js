import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
	const [showSignup, setShowSignup] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [showLogout, setShowLogout] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	return (
		<ModalContext.Provider
			value={{
				showSignup,
				setShowSignup,
				showLogin,
				setShowLogin,
				showLogout,
				setShowLogout,
				showEdit,
				setShowEdit,
				showDelete,
				setShowDelete,
			}}>
			{children}
		</ModalContext.Provider>
	);
};
