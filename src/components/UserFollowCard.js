import React from 'react';
import { meow } from '../service/meow';
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
                    id={user.id}
                    displayImageUrl={user.displayImageUrl}
                    displayName={user.displayName}
                    username={user.username}
                    size={40}
                >
                    <span className='text-muted small'>{this.state.user.connections} Mutual friends</span>
                </UserLabel>
                <button className={this.state.followed ? 'follow-btn followed' : 'follow-btn'} onClick={() => {
                    meow.people.toggleFollowUser(this.state.user.id).then(e => {
                        this.setState({ followed: e.state });
                    }).catch(e => {
                        console.error(e);
                    });
                }}></button>
            </div>
        );
    }
}

export default UserFollowCard;