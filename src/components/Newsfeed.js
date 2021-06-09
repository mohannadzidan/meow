import React from 'react';
import Post from './Post.js';
import { meow } from '../service/meow';
import PostEditor from './PostEditor.js';
import "./Newsfeed.scss";
import PostsList from './PostsList.js';
class Newsfeed extends React.Component {
    constructor(props) {
        super(props);
        this.postsList = {
            add: undefined,
            remove: undefined
        }
    }

    onCreatePost(...posts) {
        this.setState({ posts: posts.concat(this.state.posts) });
    }

    componentDidMount() {
        
       
    }

    componentWillUnmount() {
    }

    render() {

        return (
            <div className={this.props.className}>
                <nav className="navbar navbar-light bg-white sticky-top border px-3">
                        <span className="navbar-brand mb-0 h1 fw-bold">Home</span>
                </nav>
                <PostEditor onPostCreated={(post) => this.postsList.add(post)} />
                <div className="newsfeed-separator" />
                <PostsList source={meow.newsfeed.getNewsfeedPosts} out={this.postsList}/>
            </div >

        );
    }
}

export default Newsfeed;