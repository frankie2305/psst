import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/NavBar';
import SignupModal from './components/auth/SignupModal';
import LoginModal from './components/auth/LoginModal';
import LogoutModal from './components/auth/LogoutModal';
import EditModal from './components/misc/EditModal';
import DeleteModal from './components/misc/DeleteModal';
import { AuthContextProvider } from './contexts/AuthContext';
import { ModalContextProvider } from './contexts/ModalContext';
import { UserContextProvider } from './contexts/UserContext';
import Home from './components/routes/Home';
import Users from './components/routes/Users';
import Profile from './components/routes/Profile';

const App = () => (
	<AuthContextProvider>
		<ModalContextProvider>
			<UserContextProvider>
				<Router>
					<SignupModal />
					<LoginModal />
					<LogoutModal />
					<EditModal />
					<DeleteModal />
					<Navbar />
					<Switch>
						<Route exact path='/' component={Home} />
						<Route exact path='/users' component={Users} />
						<Route path='/users/:id' component={Profile} />
					</Switch>
				</Router>
			</UserContextProvider>
		</ModalContextProvider>
	</AuthContextProvider>
);

export default App;
