import React, { useLayoutEffect } from 'react';
import './Register.scss';
import './css/sizes.scss';
import { At, EnvelopeFill, ExclamationTriangleFill, Eye, KeyFill, PersonFill } from 'react-bootstrap-icons';
import * as meow from './Meow';
class AuthPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'login', // login | register
            isPasswordShown: false,
            errorMessage: undefined,
        }
        this.login = {
            showPasswordCheckbox: React.createRef(),
            emailField: React.createRef(),
            passwordField: React.createRef(),

        }
        this.register = {
            showPasswordCheckbox: React.createRef(),
        }

        this.loginContent.bind(this);
        this.registerContent.bind(this);
    }
    registerContent() {
        const showPasswordCheckbox = this.register.showPasswordCheckbox.current;
        const errorMessage = this.state.errorMessage;
        const isPasswordShown = this.state.isPasswordShown;
        return (
            <div className="registration-container">
                <div className="background" />
                <div className='form-card  shadow-lg p-4'>
                    <div>

                        <div className='big-icon'>
                            <PersonFill className='big-icon' />
                        </div>
                        <h2 className='text-center'>REGISTER</h2>
                        <div className='text-center'>
                            already have an account?
                            <span className='click-here' onClick={() =>
                                this.setState({
                                    content: 'login', // login | register
                                    isPasswordShown: false,
                                    errorMessage: undefined,
                                })
                            }>Click here</span>
                        </div>
                    </div>

                    <div className='spacer-vertical-mid'>

                        <div className='text-field'>
                            <input type='email' placeholder='Display name' />
                            <PersonFill className='icon' />
                        </div>
                        <div className='text-field'>
                            <input type='text' placeholder='Username' />
                            <At className='icon' />
                        </div>
                        <div className='text-field'>
                            <input type='email' placeholder='Email' />
                            <EnvelopeFill className='icon' />
                        </div>
                        <div className='spacer-md-vertical-mid d-md-flex gx-1'>
                            <div className='text-field me-md-2'>
                                <input type={isPasswordShown ? 'text' : 'password'} placeholder='Password' name="password" />
                                <KeyFill className='icon' />
                                <input ref={this.register.showPasswordCheckbox} className='check' type='checkbox' onClick={() => this.setState({ isPasswordShown: showPasswordCheckbox?.checked })} />
                                <Eye className='icon' />
                            </div>
                            <div className='text-field'>
                                <input type='password' placeholder='Confirm password' name="confirm-password" />
                                <KeyFill className='icon' />
                            </div>
                        </div>
                        {errorMessage && errorMessage !== null ?
                            <div className="error-message" role="alert"> <ExclamationTriangleFill className='icon' /> {errorMessage} </div> : undefined}

                        <button type="button" >Register</button>

                        <div className='d-flex align-items-center justify-content-between'>
                            <div>
                                <input type='checkbox' id="remember-me" name="remember-me"></input>
                                <label htmlFor="remember-me">Remember me</label>
                            </div>
                            <a href='#' >forgot password?</a >

                        </div>
                    </div>
                </div>
            </div >
        );
    }
    loginContent() {
        const showPasswordCheckbox = this.login.showPasswordCheckbox.current;
        const errorMessage = this.state.errorMessage;
        const isPasswordShown = this.state.isPasswordShown;
        return (
            <div className="registration-container">
                <div className="background" />
                <div className='form-card shadow-lg p-4'>
                    <div className='big-icon'>
                        <PersonFill className='big-icon' />
                    </div>
                    <h2 className='text-center'>LOG IN</h2>
                    <div className='text-center'>
                        don't have an account yet?
                            <span className='click-here' onClick={() =>
                            this.setState({
                                content: 'register', // login | register
                                isPasswordShown: false,
                                errorMessage: undefined,
                            })
                        }>Click here</span>
                    </div>

                    <form className='spacer-vertical-md' onSubmit={(e) => {
                        console.log(e);
                        const email = e.currentTarget.querySelector('[name="email"]').value;
                        const password = e.currentTarget.querySelector('[name="password"]').value;
                        const rememberMe = e.currentTarget.querySelector('[name="remember-me"]').checked;
                        console.log(password);
                        console.log(email);
                        meow.auth.signIn({
                            email: email,
                            password: password,
                        }, rememberMe).then(e => {
                            console.log(e);
                        }).catch(e => {
                            this.setState({ errorMessage: e.message });
                        });
                        e.preventDefault();
                        return false;
                    }}>
                        <div className='text-field'>
                            <input ref={this.login.emailField} type='email' placeholder='Email' name='email' maxLength={64} required />
                            <EnvelopeFill className='icon' />
                        </div>
                        <div className='text-field'>
                            <input type={isPasswordShown ? 'text' : 'password'} placeholder='Password' name="password" maxLength={32} minLength={8} required />
                            <KeyFill className='icon' />
                            <input ref={this.login.showPasswordCheckbox} className='check' type='checkbox' name='rememberMe' onClick={() => this.setState({ isPasswordShown: showPasswordCheckbox?.checked })} />
                            <Eye className='icon' />
                        </div>
                        {errorMessage && errorMessage !== null ?
                            <div className="error-message" role="alert"> <ExclamationTriangleFill className='icon' /> {errorMessage} </div> : undefined}
                        <button type="submit">Log in</button>

                        <div className='d-flex align-items-center justify-content-between'>
                            <div>
                                <input type='checkbox' name="remember-me"></input>
                                <label htmlFor="remember-me">Remember me</label>
                            </div>
                            <a href='#' >forgot password?</a >

                        </div>
                    </form>
                </div>
            </div >
        );
    }
    render() {
        return this.state.content === 'login' ? this.loginContent() : this.registerContent();
    }
}

export default AuthPage;