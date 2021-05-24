import { createPopper } from '@popperjs/core/dist/esm/popper';
import React from 'react';
import { BoxArrowRight, Braces, Gear, Person, PersonCircle, PersonFill } from 'react-bootstrap-icons';
import '../css/navbar-button.scss';
import { auth } from '../Meow';
import './Navbar.scss';
class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        this.ui = {
            accountPopper: React.createRef(),
            accountPopperReference: React.createRef(),
        };
        this.popover = {
            account: null,
        };
    }

    componentDidMount() {
        this.popover.account = createPopper(this.ui.accountPopperReference.current, this.ui.accountPopper.current, {
            placement: 'bottom-end',
            modifiers: [

            ]
        });

    }
    componentWillUnmount() {

    }

    render() {
        if (this.popover.account)
            this.popover.account.destroy();
        if (this.ui.accountPopperReference.current && this.ui.accountPopper.current)
            this.popover.account = createPopper(this.ui.accountPopperReference.current, this.ui.accountPopper.current, {
                placement: 'bottom-end',
                modifiers: [

                ]
            });

        // const { styles, attributes } = usePopper(this.ui.accountPopperReference, this.ui.accountPopper, {
        //     modifiers: [
        //         //{ name: 'arrow', options: { element: arrowElement } }
        //     ],
        // });
        return (
            <nav className="navbar fixed-top navbar-light bg-light" >
                <div className="container-fluid">

                    <div className="navbar-brand d-flex align-items-center" href="#">
                        
                        <div className="meow-logo-medium"/>
                        <div className="ms-1">Meow</div>
                    </div>
                    <div className="d-flex">

                        <div onClick={
                            () => {
                                const p = this.ui.accountPopper.current;
                                if (p) {
                                    p.classList.toggle("show");
                                }
                            }
                        } ref={this.ui.accountPopperReference} className='nav-btn-secondary'>
                            <div><PersonCircle size={18} /></div>
                        </div>
                        <div className={'nav-btn-secondary ' + 'notify'}>
                            <div>
                                {/* <Bell size={18}></Bell> */}
                                    3
                                </div>
                        </div>
                    </div>
                </div>
                <div ref={this.ui.accountPopper} className="hide account-popover card shadow-sm m-2" >
                    <div className='card-body bg-primary row align-items-center gx-1'>
                        <img className="col-auto rounded-circle wh-px-40" src={auth.user.displayImageUrl} />
                        <div className='ms-2 col-auto'>
                            <span className="text-light fw-bold m-0">{auth.user.displayName}</span>
                            <div className="text-light small m-0">@{auth.user.username}</div>
                        </div>
                    </div>
                    <div className='d-flex border-bottom align-content-center'>
                        <div className='col interaction border-end'>
                            <PersonFill size={32} />
                            <div>My Profile</div>
                        </div>
                        <div className='col interaction '>
                            <Gear size={32} />
                            <div>Settings</div>
                        </div>
                    </div>
                    <div className='d-flex align-items-center'>
                        <div className='col interaction border-end'>
                            <Braces size={32} />
                            <div>Code</div>
                        </div>
                        <div onClick={
                            () => {
                                console.log('sign out');
                                auth.signOut();
                            }
                        } className='col interaction'>
                            <BoxArrowRight size={32} />
                            <div>Sign out</div>
                        </div>
                    </div>

                </div>

            </nav >
        );
    }
}

export default Navbar;