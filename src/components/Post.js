import React from 'react';
import "./Post.scss";
import { meow } from "../service/meow";
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
            likes: props.post.likesCount,
            shares: props.post.sharesCount,
            comments: props.post.commentsCount,
        }
        this.like = this.like.bind(this);
        this.delete = this.delete.bind(this);
    }

    like() {
        meow.newsfeed.togglePostLike(this.state.post.id).then(state => {
            const likes = state.liked ? this.state.likes + 1 : this.state.likes - 1;
            this.setState({ liked: state.liked, likes: likes });
        }).catch(e => {
            console.error(e);
        });
    }

    componentDidMount() {
        const post = this.props.post;
        const promises = [];
        promises.push(
            meow.people.findUserById(post.userId)
                .then(user => {
                    this.setState({ user: user });
                })
        );
        if (post.sharedPostId && post.sharedPostId !== null) {
            promises.push(
                meow.newsfeed.getPost(post.sharedPostId).then(sharedPost => {
                    this.setState({ sharedPost: sharedPost });
                }));
        }
        Promise.all(promises).then(e => {
            this.setState({ isLoaded: true });
        });
    }

    delete() {
        meow.newsfeed.deletePost(this.state.post.id).then(d => {
            this.props.onDeletePost(this.state.post);
        }).catch(console.error);
    }
    render() {
        const post = this.state.post;
        const user = this.state.user;
        if (!this.state.isLoaded) {
            return (
                <div >
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


        const options = meow.auth.user.id ===this.state.post.userId? [{name: 'Delete', callback: () => this.delete()}]: undefined;

        return (
            <div ref={(c) => { this.container = c }} className={this.props.share ? "post border border-gray rounded rounded-3 p-2" : "post"} >
                <UserLabel
                    id={user.id}
                    displayImageUrl={user.displayImageUrl}
                    timestamp={post.timestamp}
                    displayName={user.displayName}
                    username={user.username}
                    size={40}  
                    options={options}
                    >
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
                                    <span className='mx-2'>{this.state.post.sharesCount}</span>
                                </div>
                            </div>
                        </div>
                        : undefined}
                    {/* comments section */}
                    {this.props.share === undefined ? <CommentsSection post={post}></CommentsSection> : undefined}
                </UserLabel>

            </div>
        );
    }
}

export default Post;