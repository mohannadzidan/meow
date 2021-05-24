import React from 'react';
import * as meow from "../Meow.js";
import { Comment } from "./Comment";

export class CommentsSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postUid: props.post.uid,
            commentsSnapshot: props.post.commentsSnapshot,
            share: props.post.share !== undefined,
            comments: props.post.comments,
            commentInput: "Comment haha"
        };

        this.comment = this.comment.bind(this);
    }
    comment() {
        const content = this.state.commentInput.trim();
        if (content.length > 0) {
            meow.comment.create({ postUid: this.state.postUid, content: content }).then(comment => {
                this.setState({ comments: [comment].concat(this.state.comments) });
            });
        }
    }
    render() {
        return (
            <div>
                {/* comment input */}
                <div className="mt-2 p-1 d-flex">
                    <img alt={meow.auth.user.displayName} className="rounded-circle mr-2" src={meow.auth.user.displayImageUrl} width="30" height="30" />
                    <input type="text" className="form-control rounded-pill" placeholder="Write a comment..." onKeyPress={(e) => {
                        if (!e)
                            e = window.event;
                        const keyCode = e.code || e.key;

                        if (keyCode === 'Enter' || keyCode === 'NumpadEnter') {
                            // Enter pressed
                            this.comment();
                            e.preventDefault();
                        }
                    }} />

                </div>
                {/* comments */}
                {this.state.share || !this.state.commentsSnapshot ? undefined : this.state.commentsSnapshot.map((e) => <Comment comment={e} key={e.uid} />)}
                {/* show more comments */}
                {this.state.share && this.state.comments.length ? undefined : <span className="interaction text-primary px-4 py-1">Show more comments</span>}
            </div>);
    }
}
