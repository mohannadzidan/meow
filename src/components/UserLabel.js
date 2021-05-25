import { Clock } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { formatDate } from './TimeUtils';
function UserLabel(props) {
    let usernameContent;
    let displayImageContent;
    let displayNameContent;
    let timestampContent;
    if (props.displayImageUrl) {
        displayImageContent =
            <Link to={"/profile?user=" + props.uid}>
                <img className="rounded-circle mr-2 me-2" width={props.size} height={props.size} src={props.displayImageUrl} />
            </Link>
            ;
    }
    if (props.displayName) {
        displayNameContent =
            <Link to={"/profile?user=" + props.uid}>
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
                    {formatDate(props.timestamp)}
                </span>
            </div>
            ;
    }
    return (
        <div className="d-flex">
            {displayImageContent}
            <div>
                {displayNameContent}
                {usernameContent}
                {timestampContent}

            </div>
        </div>
    );
}
export default UserLabel;