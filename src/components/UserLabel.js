import { Clock, ThreeDots } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { formatDate } from './TimeUtils';
import './UserLabel.scss';
function UserLabel(props) {
    let usernameContent;
    let displayImageContent;
    let displayNameContent;
    let timestampContent;
    let optionsContent;
    if (props.displayImageUrl) {
        displayImageContent =
            <Link to={"/profile?user=" + props.id}>
                <img className="rounded-circle mr-2 me-2" width={props.size} height={props.size} src={props.displayImageUrl} />
            </Link>
            ;
    }
    if (props.options) {
        optionsContent = <ThreeDots className='hover-boka' size={30} onClick={props.options[0].callback} />
    }
    if (props.displayName) {
        displayNameContent =
            <Link to={"/profile?user=" + props.id} style={{ textDecoration: 'none' }}>
                <span className="user-display-name">
                    {props.displayName}
                </span>
            </Link>
            ;
    }
    if (props.username && props.timestamp) {
        usernameContent =
            <span className="font-weight text-secondary">
                @{props.username}
            </span>
            ;
    } else if (props.username) {
        usernameContent =
            <div className="font-weight text-secondary">
                @{props.username}
            </div>
            ;
    }
    if (props.timestamp) {
        timestampContent =
            <div className="row align-items-center gx-1 mb-2">
                <Clock className='col-auto' size={12} />
                <span className="col-auto text-secondary small">
                    {formatDate(props.timestamp * 1000)}
                </span>
            </div>
            ;
    }
    return (
        <div className={['d-flex'].concat(props.className).join(' ')}>
            {displayImageContent}
            <div className="flex-grow-1">
                <div className='d-flex flex-row justify-content-between align-items-center'>
                    <div>
                        {displayNameContent}
                        {usernameContent}
                        {timestampContent}
                    </div>
                    {optionsContent}
                </div>
                {props.children}
            </div>
        </div>
    );
}
export default UserLabel;