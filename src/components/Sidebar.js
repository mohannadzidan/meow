import React from 'react';
import { House, HouseFill, Person, PersonFill, ThreeDots } from 'react-bootstrap-icons';
import * as meow from '../Meow.js';
import './Sidebar.scss';
import {
    BrowserRouter as Router,
    NavLink,
} from "react-router-dom";

class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: props.query,
        }
    }
    render() {

        return <div className={['side-bar', this.props.className].join(' ')}  >
            <img src="svg/paw.svg" className='boka' />

            <NavLink exact to="/" activeClassName="selected" className='sidebar-btn'>
                <House />
                <HouseFill />
                <span className='d-none d-lg-inline-block'>Newsfeed</span>
            </NavLink >
            <NavLink exact to="/profile" activeClassName="selected" className='sidebar-btn'>
                <Person />
                <PersonFill />
                <span className='d-none d-lg-inline-block'>Profile</span>
            </NavLink >

            <div className='d-flex align-items-center'>
                <img className="rounded-circle wh-px-40 p-0" src={meow.auth.user.displayImageUrl} />
                <div className='flex-grow-1 d-none d-lg-flex justify-content-between align-items-center ms-2'>
                    <div>
                        <div className="font-weight-bold text-primary">
                            {meow.auth.user.displayName}
                        </div>
                        <div className="font-weight text-secondary">
                            @{meow.auth.user.username}
                        </div>
                    </div>
                    <ThreeDots size={22} />
                </div>
            </div>
        </div>
    }
}

export default Sidebar;