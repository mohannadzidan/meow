import React from 'react';
import * as meow from '../Meow.js';
import './UserFollowCard.scss';
import UserLabel from './UserLabel.js';

class UserFollowCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            followed: props.user.followed
        }
    }
    render() {
        const user = this.state.user;
        return (
            <div className='suggestion d-flex justify-content-between'>
                <UserLabel
                    uid={user.uid}
                    displayImageUrl={user.displayImageUrl}
                    displayName={user.displayName}
                    username={user.username}
                    size={40}
                />
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