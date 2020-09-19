import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/NavBar';
import SignupModal from './components/auth/SignupModal';
import LoginModal from './components/auth/LoginModal';
import LogoutModal from './components/auth/LogoutModal';
import { AuthContextProvider } from './contexts/AuthContext';
import { ModalContextProvider } from './contexts/ModalContext';
import { UserContextProvider } from './contexts/UserContext';
import Home from './components/routes/Home';
import Users from './components/routes/Users';

const App = () => (
	<AuthContextProvider>
		<ModalContextProvider>
			<UserContextProvider>
				<Router>
					<Navbar />
					<SignupModal />
					<LoginModal />
					<LogoutModal />
					<Switch>
						<Route exact path='/' component={Home} />
						<Route exact path='/users' component={Users} />
					</Switch>
				</Router>
			</UserContextProvider>
		</ModalContextProvider>
	</AuthContextProvider>
);

export default App;
