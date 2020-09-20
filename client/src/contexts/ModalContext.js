import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
	const [showSignup, setShowSignup] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [showLogout, setShowLogout] = useState(false);
	const [postId, setPostId] = useState('');
	const [initialContent, setInitialContent] = useState('');
	const [editedContent, setEditedContent] = useState('');
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
				postId,
				setPostId,
				initialContent,
				setInitialContent,
				editedContent,
				setEditedContent,
				showEdit,
				setShowEdit,
				showDelete,
				setShowDelete,
			}}>
			{children}
		</ModalContext.Provider>
	);
};
