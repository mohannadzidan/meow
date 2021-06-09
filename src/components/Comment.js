import React from 'react';
import { meow } from "../service/meow";
import '../css/sl-loader.scss';
import '../css/sizes.scss';
import { randomSkeletonLines } from '../skeleton.js';
import { formatDate } from './TimeUtils';
import { Clock, Heart, HeartFill } from 'react-bootstrap-icons';
import UserLabel from './UserLabel.js';




export class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: props.comment,
            liked: props.comment.liked,
            likesCount: props.comment.likesCount,
        };
        this.like = this.like.bind(this);
    }

    componentDidMount() {
        meow.people.findUserById(this.state.comment.userId).then(e => {
            this.setState({ user: e });
        });
    }
    like() {
        meow.newsfeed.toggleCommentLike(this.state.comment.postId, this.state.comment.id).then(res => {
            const likesCount = res.liked ? this.state.likesCount + 1 : this.state.likesCount - 1;
            this.setState({
                liked: res.liked, likesCount:likesCount
            });
        }).catch(console.error);
    }

    render() {
        const user = this.state.user;
        if (!user || user === null) {
            return (
                <div className="d-flex p-1">
                    <div className="mr-2">
                        <div className="skeleton-circle wh-px-30" />
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-md-flex">
                            <div className="skeleton w-px-80 h-px-18 m-1"></div>
                            <div className="skeleton w-px-100 h-px-18 m-1"></div>
                        </div>
                        {randomSkeletonLines(1, 3)}
                    </div>
                </div>

            );
        }
        return (
            <UserLabel
                id={user.id}
                displayImageUrl={user.displayImageUrl}
                displayName={user.displayName}
                username={user.username}
                size={30}
            >
                <div >{this.state.comment.content}</div>
                <div className="d-flex align-items-center">
                    <div onClick={this.like} className={this.state.liked ? 'interaction interaction-danger notify px-2 py-1' : 'interaction interaction-danger px-2 py-1'}>
                        {this.state.liked ? <HeartFill size={18} /> : <Heart size={18} />}
                        <span className='mx-2'>{this.state.likesCount}</span>
                    </div>
                    <span className="col-auto text-secondary small">
                        {formatDate(this.state.comment.timestamp*1000)}
                    </span>
                </div>
            </UserLabel>

        );
    }
}
