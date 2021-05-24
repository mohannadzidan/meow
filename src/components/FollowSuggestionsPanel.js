import React from 'react';
import * as meow from '../Meow.js';
import './FollowSuggestionsPanel.scss';
import UserFollowCard from './UserFollowCard.js';
class FollowSuggestionsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            showAll: false
        }
        this.renderSuggestions.bind(this);
    }

    componentDidMount() {
        meow.follow.suggestions().then(suggestions => {
            this.setState({ suggestions: suggestions });
        }).catch(e => {
            console.error(e);
        })
    }

    renderSuggestions() {
        const limit = Math.min(this.state.showAll ? 10 : 3, this.state.suggestions.length);
        const res = [];
        for (let i = 0; i < limit; i++) {
            const s = this.state.suggestions[i];
            res.push(
                <UserFollowCard key={i} user={s} />
            );
        }
        return res;
    }

    render() {

        return (
            <div className={'follow-suggestions-panel ' + this.props.className}>

                <div className='header'>
                    Who to follow
                </div>
                {this.renderSuggestions()}
                <div className='footer'>
                    <span className='click-here' onClick={() => this.setState({ showAll: !this.state.showAll })}>{this.state.showAll ? 'Show less' : 'View all'}</span>

                </div>

            </div>

        );
    }
}
export default FollowSuggestionsPanel;