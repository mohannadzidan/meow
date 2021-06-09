import React from 'react';
import Navbar from './components/Navbar';
import Newsfeed from './components/Newsfeed';
import './AuthPage';
import AuthPage from './AuthPage';
import { MeowLoader } from './components/MeowLoader';
import Sidebar from './components/Sidebar';
import {
    BrowserRouter as Router,
    Route,
    withRouter
} from "react-router-dom";
import Profile from './components/Profile';
import FollowSuggestionsPanel from './components/FollowSuggestionsPanel';
import { meow } from './service/meow';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            user: undefined
        }
        this.render.bind(this);
    }

    componentDidMount() {

        this.onUserStateChangeHandler = (user) => {
            this.setState({ user: user, loaded: true });
        };
        meow.auth.onStateChange.addListener(this.onUserStateChangeHandler);
    }
    componentWillUnmount() {
        meow.auth.onStateChange.removeListener(this.onUserStateChangeHandler);
    }

    render() {
        if (!this.state.loaded) return null;
        const query = new URLSearchParams(this.props.location.search);
        let content = undefined;
        if (this.state.user) {
            content = (
                <div className='row'>
                    <div className='col-auto'>
                        <Sidebar className='sticky-top' query={query} />
                    </div>
                    <div className='col'>

                        <Route exact path="/" component={Newsfeed} />
                        <Route exact path="/profile" component={Profile} />
                    </div>

                    <div className='col-auto'>
                        <div className="pt-2 sticky-top bg-white" style={{ height: 52 }}>
                            <input type="text" className='form-control rounded-pill mb-2' placeholder="Search meow.." />
                        </div>
                        <div className="pt-2 bg-white" style={{top:'0' , bottom:'0' }}>
                            <FollowSuggestionsPanel className='sticky-top'/>
                        </div>

                    </div>
                </div>
            );
        } else {
            content = <AuthPage />;
        }

        return content;

    }
}
export default withRouter(App);
