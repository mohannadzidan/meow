import React from 'react';
import { House, HouseFill, Person, PersonFill, ThreeDots } from 'react-bootstrap-icons';
import { meow } from '../service/meow';
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

        return <nav className={['side-bard', this.props.className].join(' ')}  >
            <img src="svg/paw.svg" className='boka' />
            <div className=''>
                <NavLink exact to="/" activeClassName="selected" className='sidebar-btn'>
                    <House />
                    <HouseFill />
                    <span className='d-none d-lg-inline-block'>Newsfeed</span>
                </NavLink >
                <NavLink exact to={"/profile?user=" + meow.auth.user.id} activeClassName="selected" className='sidebar-btn'>
                    <Person />
                    <PersonFill />
                    <span className='d-none d-lg-inline-block'>Profile</span>
                </NavLink >
            </div>
            <div className='flex-shrink-0 d-flex align-items-center boga x'>
                <img className="rounded-circle wh-px-40 p-0 me-2" src={meow.auth.user.displayImageUrl} />
                <div className='d-none d-lg-block'>
                    <div className="font-weight-bold text-primary" style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "120px"
                    }}>
                        {meow.auth.user.displayName}
                    </div>
                    <div className="font-weight text-secondary">
                        @{meow.auth.user.username}
                    </div>
                </div>
            </div>
        </nav>
    }
}

export default Sidebar;