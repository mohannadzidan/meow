import React from 'react';
import './LikeButton.scss';

class LikeButton extends React.Component {
    render() {
        return (
            <div className='like-button'>
                <input type="checkbox"  />
                <div/>
            </div>
        );
    }
}

export default LikeButton;