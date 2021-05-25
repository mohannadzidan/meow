import React from 'react';
import { withRouter } from 'react-router';
import { post, user } from '../Meow'
import Post from './Post';
import './Profile.scss'
import PropTypes from 'prop-types'

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }
    componentDidMount() {
        this.__isMounted = true;

        const params = new URLSearchParams(this.props.location.search);
        const userUid = params.get('user');
        user.getByUid(userUid).then(user => {
            if (this.__isMounted) this.setState({ user: user });
        });
        post.getPostsBy(userUid, new Date().getTime() / 1000).then(posts => {
            if (this.__isMounted) this.setState({ posts: posts });
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
        const userUid = params.get('user');
        user.getByUid(userUid).then(user => {
            if (this.__isMounted) this.setState({ user: user });
        });
        post.getPostsBy(userUid, new Date().getTime() / 1000).then(posts => {
            if (this.__isMounted) this.setState({ posts: posts });
        });
    }

    render() {
        const user = this.state.user;
        if (!user) {
            return <div>Loading</div>;
        }
        return (
            <div className='px-1'>
                <div>
                    <div className='header-photo'>
                        <img src='../img/charmaine.jpg' />
                        <img src={user.displayImageUrl} />
                    </div>

                    <div>
                        <div className='fw-bold'>{user.displayName}</div>
                        <div className='text-muted'>@{user.username}</div>
                    </div>
                    <div className='d-flex'>
                        <span className='boga'><span className="fw-bold me-1">{this.state.user.followings}</span>Following</span>
                        <span className='boga'><span className="fw-bold me-1">{this.state.user.followers}</span>Followers</span>
                    </div>
                </div>
                <ul className="col list-group">
                    {
                        this.state.posts.map((post) => (<li className="list-group-item" key={post.uid} ><Post post={post} /></li>))
                    }
                </ul>
            </div>
        );
    }
}
export default Profile;