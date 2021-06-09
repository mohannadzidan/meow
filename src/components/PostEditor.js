import { meow } from "../service/meow";
import UserLabel from "./UserLabel";
import './PostEditor.scss';

import React from 'react';

class PostEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPosting: false,
            isEmpty: true,
        }
        this.textAreaRef = React.createRef();
        this.post = this.post.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }
    post() {
        this.setState({ isPosting: true, isEmpty: true });
        meow.newsfeed.createPost(this.textAreaRef.current.value).then(post => {
            this.setState({ isPosting: false });
            this.props.onPostCreated(post);
        }).catch(console.error);
        this.textAreaRef.current.value = '';
    }
    onTextChange() {
        if (this.state.isEmpty && this.textAreaRef.current.value.length > 0) this.setState({ isEmpty: false });
        else if (!this.state.isEmpty && this.textAreaRef.current.value.length === 0) this.setState({ isEmpty: true });
    }
    componentDidMount() { }

    componentWillUnmount() { }

    render() {
        return (
            <div className="post-editor p-3">

                <UserLabel
                    className="w-100"
                    displayImageUrl={meow.auth.user.displayImageUrl}
                    size={40}
                >
                    <div className="w-100">
                        <textarea ref={this.textAreaRef} placeholder="What's happening?" className="border-bottom" onChange={this.onTextChange} />
                        <div className="d-flex ">
                            <div className="flex-grow-1"></div>

                            <button className="btn btn-primary rounded-pill fw-bold px-4 align-self-end" disabled={this.state.isPosting || this.state.isEmpty} onClick={this.post}>
                                {this.state.isPosting ? <div className="text-white small spinner-border spinner-border-sm" /> : 'Post'}
                            </button>
                        </div>
                    </div>
                </UserLabel>

            </div>
        );
    }
}
export default PostEditor;