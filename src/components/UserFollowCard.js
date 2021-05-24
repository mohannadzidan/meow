import React from 'react';
import * as meow from '../Meow.js';
import './UserFollowCard.scss';

class UserFollowCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            followed: props.user.followed
        }
    }
    render() {
        return (
            <div className='suggestion d-flex justify-content-between'>
                <div className='d-flex'>
                    <img className="rounded-circle wh-px-40 p-0 me-1" src={this.state.user.displayImageUrl} />
                    <div className='m-0'>
                        <div className="font-weight-bold text-primary">
                            {this.state.user.displayName}
                        </div>
                        <div className="font-weight text-secondary">
                            @{this.state.user.username}
                        </div>
                    </div>
                </div>
                <button className={this.state.followed ? 'follow-btn followed' : 'follow-btn'} onClick={() => {
                    meow.follow.toggle(this.state.user.uid).then(e => {
                        this.setState({ followed: e.followed });
                    }).catch(e => {
                        console.error(e);
                    });
                }}></button>
            </div>
        );
    }
}

export default UserFollowCard;