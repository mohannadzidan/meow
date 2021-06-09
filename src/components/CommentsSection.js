import React from 'react';
import { meow } from "../service/meow";
import { Comment } from "./Comment";

export class CommentsSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: props.post,
            comments: []
        };
        this.commentInput = React.createRef()
        this.comment = this.comment.bind(this);
    }

    componentDidMount(){
        meow.newsfeed.getPostComments(this.state.post.id).then(comments=>{
            this.setState({comments: comments});
        }).catch(console.error);
    }
    comment() {
        const ref = this.commentInput;
        const content = ref.current.value.trim();
        if (content.length > 0) {
            meow.newsfeed.createComment(this.state.post.id, content).then(comment => {
                console.log(comment);
                this.setState({ comments: [comment].concat(this.state.comments) });
            });
            ref.current.value = '';
        }
    }
    render() {
        return (
            <div>
                {/* comment input */}
                <div className="my-2 d-flex align-items-center">
                    <img className="rounded-circle me-2" src={meow.auth.user.displayImageUrl} width="30" height="30" />
                    <input ref={this.commentInput} type="text" className="form-control rounded-pill" placeholder="Write a comment..." onKeyPress={(e) => {
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
                {this.state.share ? undefined : this.state.comments.map((e, i) => <Comment comment={e} key={e.id} />)}
                {/* show more comments */}
                {this.state.share || this.state.comments.length === this.state.post.commentsCount? undefined : <span className="interaction text-primary px-4 py-1">Show more {this.state.post.commentsCount - this.state.comments.length } comments</span>}
            </div>);
    }
}
