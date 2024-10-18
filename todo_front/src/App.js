import React, { useState } from 'react';
import { register, login, logout } from './auth';
import TaskManager from './TaskManager';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            await register(registerUsername, registerEmail, registerPassword);
            setRegisterUsername('');
            setRegisterEmail('');
            setRegisterPassword('');
            setIsRegistering(false);
        } catch (error) {
            console.error('Registration error details:', error.response?.data || error);
    
            if (error.message.includes("User already exists")) {
                setError("A user with that username already exists. Please choose a different username.");
            } else {
                setError(error.message || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(loginUsername, loginPassword);
            setIsLoggedIn(true);
        } catch (err) {
            setError(err.response?.data.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
    };

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div style={{ width: '700px', margin: '200px auto' }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!isLoggedIn ? (
                <div className='card py-5 px-3'>
                    {loading ? (
                        <p>Loading...</p>
                    ) : isRegistering ? (
                        <>
                            <h2 className='text-center'>Register</h2>
                            <p className='mt-1 text-center'>Already have an account? <span className='text-primary' style={{ cursor: 'pointer' }} onClick={toggleForm}>Login</span></p>

                            <form onSubmit={handleRegister}>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <input className='form-control mb-3'
                                            type="text"
                                            value={registerUsername}
                                            onChange={(e) => setRegisterUsername(e.target.value)}
                                            placeholder="Username"
                                            required
                                        />
                                    </div>
                                    <div className='col-md-12'>
                                        <input
                                            type="email" className='form-control mb-3'
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    <div className='col-md-12'>
                                        <input
                                            type="password" className='form-control mb-3'
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                    <div className='col-md-12'>
                                        <button type="submit" className='btn btn-success mt-4 w-100'>Register</button>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className='text-center'>Login to your account</h2>
                            <p className='mt-1 text-center'>Don't have an account? <span className='text-primary' style={{ cursor: 'pointer' }} onClick={toggleForm}>Sign up</span></p>

                            <form onSubmit={handleLogin}>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <input
                                            type="text" className='form-control mb-3'
                                            value={loginUsername}
                                            onChange={(e) => setLoginUsername(e.target.value)}
                                            placeholder="Username"
                                            required
                                        />
                                    </div>
                                    <div className='col-md-12'>
                                        <input
                                            type="password" className='form-control'
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                    <div className='col-md-12 d-flex justify-content-center'>
                                        <button type="submit" className='btn btn-success mt-4 w-100'>Login</button>
                                    </div>
                                </div>
                            </form>

                        </>
                    )}
                </div>
            ) : (
                <div className='card py-5 px-3'>
                    <TaskManager onLogout={handleLogout} />
                    <div className='text-end border-top'>
                    <button className='btn btn-danger mt-4 w-25' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
