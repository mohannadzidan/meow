import React from 'react';
import Post from './Post.js';
import * as meow from '../Meow.js';
import { MeowLoader } from './MeowLoader';
import FollowSuggestionsPanel from './FollowSuggestionsPanel.js';

class Newsfeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
        }
    }

    componentDidMount() {

        meow.post.getNewsfeedPosts((Date.now() / 1000).toFixed(0)).then(e => {
            this.setState({ posts: this.state.posts.concat(e) });
        }).catch(e => {
            console.error(e);
        })
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div className={['row m-1 px-1', this.props.className].join(' ')}>
                <ul className="col list-group">
                    {
                        this.state.posts.map((post) => (<li className="list-group-item" key={post.uid} ><Post post={post} /></li>))
                    }
                </ul>
            </div>

        );
    }
}

export default Newsfeed;