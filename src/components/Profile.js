import React from 'react';
import { withRouter } from 'react-router';
import Post from './Post';
import './Profile.scss'
import PropTypes from 'prop-types'
import { meow } from '../service/meow';
import { ArrowLeft, CalendarDate, GeoAlt } from 'react-bootstrap-icons';
import { formatDate } from './TimeUtils';
import PostsList from './PostsList';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            userId: undefined
        }
        this.postsList = {};
    }
    componentDidMount() {
        this.__isMounted = true;

        const params = new URLSearchParams(this.props.location.search);
        const userId = params.get('user');
        meow.people.findUserById(userId).then(user => {
            if (this.__isMounted) this.setState({ user: user, followed: user.followed });
        });
    }

    componentWillUnmount() {
        this.__isMounted = false;
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }
    onRouteChanged() {
        const params = new URLSearchParams(this.props.location.search);
        const userId = params.get('user');
        meow.people.findUserById(userId).then(user => {
            if (this.__isMounted) this.setState({ user: user, followed: user.followed });
            this.postsList.refresh();
        });

    }

    render() {
        let content;
        if (this.state.user !== undefined) {
            content = <div>
                <div className="border">
                    <div className='header-photo'>
                        <img src='../img/charmaine.jpg' />
                        <img src={this.state.user.displayImageUrl} />
                        {this.state.user.id !== meow.auth.user.id ?
                            <button style={{ position: 'absolute', right: "20px", bottom: '0' }} className={this.state.followed ? 'follow-btn followed' : 'follow-btn'} onClick={() => {
                                meow.people.toggleFollowUser(this.state.user.id).then(e => {
                                    this.setState({ followed: e.state });
                                }).catch(e => {
                                    console.error(e);
                                });
                            }}></button> : undefined}
                    </div>

                    <div className="p-2">
                        <div>
                            <div className='fw-bold'>{this.state.user.displayName}</div>
                            <div className='text-muted'>@{this.state.user.username}</div>
                        </div>
                        <div className='d-flex my-1 text-secondary align-items-center '>
                            {this.state.user.location ? <div className='me-2'>
                                <GeoAlt size={20} />
                                <span>{this.state.user.location}</span>
                            </div> : undefined}

                            {this.state.user.birthdate ? <div className='me-2'>
                                <CalendarDate size={20} className='me-1' />
                                <span>Born {formatDate(this.state.user.birthdate * 1000, 'mmmm dd, YYYY')}</span>
                            </div> : undefined}
                        </div>
                        <div className='d-flex'>
                            <span className='boga'><span className="fw-bold me-1">{this.state.user.followingsCount}</span>Following</span>
                            <span className='boga'><span className="fw-bold me-1">{this.state.user.followersCount}</span>Followers</span>
                        </div>
                    </div>

                </div>
                <div className='newsfeed-separator' />
                <PostsList source={(timestampOptions) => meow.people.getUserPosts(this.state.user.id, timestampOptions)} out={this.postsList} />

            </div>;
        }
        return (
            <div>
                <nav className="navbar navbar-light bg-white sticky-top border px-3 justify-content-start">
                <ArrowLeft size={30} className='me-1 hover-boka text-primary'/>

                    <span className="navbar-brand mb-0 h1 fw-bold">
                        {this.state.user?.displayName ?? <div className='spinner-border mx-auto text-primary' />}</span>
                </nav>
                {content ? content : <div className='w-100 d-flex py-4'><div className='spinner-border mx-auto text-primary' /></div>}
            </div>
        );
    }
}



export default Profile;