import React from 'react';
import "./Post.scss";
import * as meow from "../Meow.js";
import { CommentsSection } from './CommentsSection';
import { randomSkeletonLines } from '../skeleton.js';

import { Clock, Heart, HeartFill, Share } from 'react-bootstrap-icons';
import LikeButton from './LikeButton';
import { Link } from 'react-router-dom';
import UserLabel from './UserLabel';
class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: props.post,
            isLoaded: false,
            liked: props.post.liked,
            likes: props.post.likes,
            shares: props.post.shares,
            comments: props.post.comments,
        }
        this.like = this.like.bind(this);
    }

    like() {
        meow.like.toggle(this.state.post.uid).then(e => {
            this.setState(e);
        });
        this.setState({
            liked: !this.state.liked,
        });
    }

    componentDidMount() {
        const post = this.props.post;
        const promises = [];
        promises.push(
            meow.user.getByUid(post.userUid)
                .then(user => {
                    this.setState({ user: user });
                })
        );
        if (post.sharedPostUid && post.sharedPostUid !== null) {
            promises.push(
                meow.post.get(post.sharedPostUid).then(sharedPost => {
                    this.setState({ sharedPost: sharedPost });
                }));
        }
        Promise.all(promises).then(e => this.setState({ isLoaded: true }));

    }

    render() {
        if (!this.state.isLoaded) {
            return (
                <div  >
                    <div className="d-flex">
                        <div className="skeleton-circle mr-2 wh-px-50" />
                        <div className="flex-grow-1">
                            <div className="d-md-flex">
                                <div className="skeleton w-px-80 h-px-18 m-1"></div>
                                <div className="skeleton w-px-100 h-px-18 m-1"></div>
                            </div>
                            {randomSkeletonLines(1, 3)}
                        </div>
                    </div>
                </div>
            );
        }
        const post = this.state.post;
        const user = this.state.user;
        return (
            <div className={this.props.share ? "post border border-secondary rounded rounded-3 p-2" : "post"} >
                <UserLabel
                    uid={user.uid}
                    displayImageUrl={user.displayImageUrl}
                    timestamp={post.timestamp}
                    displayName={user.displayName}
                    username={user.username}
                    size={40}
                />
                <div>

                    <div>
                        {this.state.post.content}
                    </div>
                    {/* post content */}
                    {this.state.sharedPost ? <Post post={this.state.sharedPost} share /> : undefined}
                    {/* interactions */}
                    {!this.props.share
                        ?
                        <div className="my-2">
                            <div className="d-flex">
                                <div onClick={this.like} className={this.state.liked ? 'interaction-danger notify px-2 py-1' : 'interaction interaction-danger px-2 py-1'}>
                                    {this.state.liked ? <HeartFill className='icon' size={18} /> : <Heart className='icon' size={18} />}
                                    <span className='mx-2'>{this.state.likes}</span>
                                </div>
                                <div className='interaction-success px-2 py-1'>
                                    <Share size={18} />
                                    <span className='mx-2'>{this.state.shares}</span>
                                </div>
                            </div>
                        </div>
                        : undefined}
                    {/* comments section */}
                    {this.props.share === undefined ? <CommentsSection post={post}></CommentsSection> : undefined}


                </div>
            </div>
        );
    }
}

export default Post;