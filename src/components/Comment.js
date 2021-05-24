import React from 'react';
import * as meow from "../Meow.js";
import '../css/sl-loader.scss';
import '../css/sizes.scss';
import { randomSkeletonLines } from '../skeleton.js';
import { formatDate } from './TimeUtils';
import { Clock, Heart, HeartFill } from 'react-bootstrap-icons';




export class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentUid: props.comment.uid,
            userUid: props.comment.userUid,
            likes: props.comment.likes,
            liked: props.comment.liked,
            content: props.comment.content,
            timestamp: props.comment.timestamp,
        };
        this.like = this.like.bind(this);
    }

    componentDidMount() {
        meow.user.getByUid(this.state.userUid).then(e => {
            this.setState({ user: e });
        });
    }
    like() {
        meow.like.toggle(this.state.commentUid).then(e => {
            this.setState(e);
        });
        this.setState({
            liked: !this.state.liked
        });
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
            <div className="d-flex p-1">
                <div className="mr-2">
                    <img alt={user.displayName} className="rounded-circle wh-px-30 -2" src={user.displayImageUrl} />
                </div>
                <div className="flex-grow-1">
                    <div className="d-md-flex">
                        <div className="mr-2">
                            <span className="font-weight-bold text-primary">
                                {user.displayName}
                            </span>
                            <span className="font-weight text-secondary">
                                @{user.username}
                            </span>
                        </div>

                    </div>
                    <div>{this.state.content}</div>
                    <div className="d-flex align-items-center">
                        <div onClick={this.like} className={this.state.liked ? 'interaction interaction-danger notify px-2 py-1' : 'interaction interaction-danger px-2 py-1'}>
                            {this.state.liked ? <HeartFill size={18}></HeartFill> : <Heart size={18}></Heart>}
                            <span className='mx-2'>{this.state.likes}</span>
                        </div>
                        <span className="col-auto text-secondary small">
                            {formatDate(this.state.timestamp)}
                        </span>
                    </div>

                </div>
            </div>

        );
    }
}
