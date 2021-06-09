import React from 'react';
import Post from './Post';

class PostsList extends React.Component {
    constructor(props) {
        super(props);
        this.postsSource = props.source;
        this.state = {
            posts: [],
            isLoadingOlderPosts: true
        }
        this.onDeletePost = this.onDeletePost.bind(this);
        this.onAddPost = this.onAddPost.bind(this);
        this.refresh = this.refresh.bind(this);

        if (typeof props.out === 'object') {
            props.out.remove = this.onDeletePost;
            props.out.add = this.onAddPost;
            props.out.refresh = this.refresh;
        }

    }
    refresh(){
        this.setState({posts: []});
        this.postsSource().then(e => {
            this.setState({ posts: this.state.posts.concat(e) });
        }).catch(e => {
            console.error(e);
        });
    }
    onAddPost(...posts){
        this.setState({ posts: posts.concat(this.state.posts) });
    }
    onDeletePost(post){
        this.setState({ posts: this.state.posts.filter(p => p !== post) });
    }
    componentDidUpdate(){
        console.log('Postslist updated!');
    }
    componentDidMount() {
        this.scrollListener = (e) => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                if (this.state.posts.length > 0) {
                    window.removeEventListener('scroll', this.scrollListener); // remove the event
                    this.setState({ isLoadingOlderPosts: true });
                    this.postsSource({ before: this.state.posts[this.state.posts.length - 1].timestamp }).then(olderPosts => {
                        if (olderPosts.length > 0) {
                            console.log('add posts ', this.state.posts.length + olderPosts.length);

                            this.setState({ posts: this.state.posts.concat(olderPosts), isLoadingOlderPosts: false });
                            window.addEventListener('scroll', this.scrollListener); // add the event
                        } else {
                            console.log('all caught');
                            this.setState({ isAllCaught: true, isLoadingOlderPosts: false });
                        }
                    }).catch(console.error);
                }
            }
        };
        window.addEventListener('scroll', this.scrollListener);
        this.refresh();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollListener);
    }

    render() {
        return (
            <div>
                <ul className=" list-group p-0 ">
                    {
                        this.state.posts.map((post) => (<li className="list-group-item rounded-0" key={post.id} ><Post post={post} onDeletePost={this.onDeletePost} /></li>))
                    }
                </ul>
                {this.state.isAllCaught ? <div>
                    <div className="newsfeed-separator" />
                    <div className='py-2 text-center text-muted border'>All caught up!</div>
                </div> : undefined}
            </div>
        );
    }
}
export default PostsList;