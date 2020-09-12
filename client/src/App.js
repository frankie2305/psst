import React from 'react';
import Navbar from './components/layout/NavBar';
import SignupModal from './components/auth/SignupModal';
import LoginModal from './components/auth/LoginModal';
import LogoutModal from './components/auth/LogoutModal';
import { AuthContextProvider } from './contexts/AuthContext';
import { ModalContextProvider } from './contexts/ModalContext';

const App = () => (
	<AuthContextProvider>
		<ModalContextProvider>
			<Navbar />
			<SignupModal />
			<LoginModal />
			<LogoutModal />
		</ModalContextProvider>
	</AuthContextProvider>
);

export default App;
