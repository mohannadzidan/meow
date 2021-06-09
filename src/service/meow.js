import 'node-fetch';
import { EventEmitter } from 'events';
//import fetch from "node-fetch";
/**
 * @typedef {Object} MeowAuthenticationResult
 * @property {string} idToken 
 * @property {string} refreshToken
 * @property {string} email
 * @property {number} localId
 * @property {number} expiresIn
 */
/**
 * @typedef {Object} User
 * @property {number} id 
 * @property {string} email
 * @property {string} username
 * @property {string} displayName
 * @property {string} displayImageUrl
 * @property {number} registrationTimestamp
 * @property {number} followersCount
 * @property {number} followingsCount
 */
/**
 * @typedef {Object} MeowConfiguration
 * @property {string} root 
 */
/**
 * @typedef {Object} Post
 * @property {number} id The id of the post.
 * @property {number} sharedPostId The id of the original post that this post shared.
 * @property {number} userId The id of the user that posted this post.
 * @property {string} content The content of the post.
 * @property {number} timestamp The timestamp in seconds.
 * @property {number} likesCount the number of likes on this post.
 * @property {number} commentsCount the number of comments on this post.
 * @property {number} sharesCount the number of shares for this post.
 */
/**
 * @typedef {Object} Comment
 * @property {number} id The id of the comment.
 * @property {number} postId The id of the post.
 * @property {number} userId The id of the user.
 * @property {string} content The content of the comment.
 * @property {number} timestamp The timestamp in seconds.
 */
/**
 * @typedef {Object} TimestampLimit
 * @property {number} before 
 * @property {number} after 
 */

/**
* @type {MeowAuthenticationResult}
*/
let authData = {};
const eventEmitter = new EventEmitter();

const auth = {
    root: undefined,
    /**
     * @type User
     */
    user: null,
    onStateChange: {
        addListener: (listener) => {
            eventEmitter.addListener('user-state-change', listener);
            listener(auth.user);
        },
        removeListener: (listener) => eventEmitter.removeListener('user-state-change', listener),
    },
    /**
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {string} username 
     * @param {string} displayName 
     * @return {Promise<MeowAuthenticationResult>}
     */
    signUp: async function (email, password, username, displayName) {
        const res = await fetch(auth.root + '/accounts:signUp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username,
                displayName: displayName
            })
        });
        if (res.status === 201) {
            authData = await res.clone().json();
            auth.user = await auth.getUserData();
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                window.localStorage.setItem('refreshToken', authData.refreshToken);
                setCookie('idToken', authData.idToken);
            }
            eventEmitter.emit('user-state-change', auth.user);
            return Promise.resolve(authData);
        }
        throw new Error(await res.clone().json());
    },
    signIn: async function (email, password) {
        const res = await fetch(auth.root + '/accounts:signInWithPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        if (res.status === 200) {
            authData = await res.clone().json();
            auth.user = await auth.getUserData();
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                window.localStorage.setItem('refreshToken', authData.refreshToken);
                setCookie('idToken', authData.idToken);
            }
            eventEmitter.emit('user-state-change', auth.user);
            return Promise.resolve(authData);
        }
        console.log(res);
        throw new Error(await res.clone().json());
    },
    signOut: function () {
        window.localStorage.removeItem('refreshToken');
        eraseCookie('idToken');
        auth.user = null;
        eventEmitter.emit('user-state-change', auth.user);
    },
    getUserData: async function (idToken = undefined) {
        const res = await fetch(auth.root + '/accounts:lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: idToken ?? authData.idToken })
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    deleteAccount: async function () {
        const res = await fetch(auth.root + '/accounts:delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: authData.idToken })
        });
        if (res.status === 204) {
            return Promise.resolve(null);
        }
        throw new Error(await res.clone().json());
    },
    /**
     * 
     * @param {string} refreshToken 
     * @returns {Promise<MeowAuthenticationResult}
     */
    refreshIdToken: async function (refreshToken) {
        const res = await fetch(auth.root + '/token:refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refreshToken })
        });
        const body = res.clone().json();
        if (res.status === 200) return body;
        return Promise.reject(body);
    }
}

const newsfeed = {
    root: undefined,
    /**
     * 
     * @param {number} postId 
     * @returns {Promise<Post>}
     */
    getPost: async function (postId) {
        const res = await fetch(newsfeed.root + '/posts/' + postId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    /**
     * 
     * @param {string} content 
     * @returns {Promise<Post>}
     */
    createPost: async function (content) {
        const res = await fetch(newsfeed.root + '/posts:create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            },
            body: JSON.stringify({
                content: content,
            })
        });
        if (res.status === 201) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    deletePost: async function (postId) {
        const res = await fetch(newsfeed.root + '/posts/' + postId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 204) {
            return null;
        }
        throw new Error(await res.clone().json());
    },
    /**
     * @param {number} postId 
     * @param {string} content 
     * @returns {Promise<Post>}
     */
    editPost: async function (postId, content) {
        throw new Error('Not implemented function!');
    },

    /**
     * @param {TimestampLimit} options
     * @returns {Promise<Post[]>}
     */
    getNewsfeedPosts: async function (options) {
        const query = options ? Object.keys(options).map(x => x + '=' + options[x]).join('&') : '';
        const res = await fetch(newsfeed.root + '/posts?' + query, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        console.log(res.url);
        const body = await res.clone().json();
        if (res.status === 200) {
            return body;
        }
        throw new Error(body);
    },
    /**
     * @param {number} postId 
     * @param {string} content 
     * @returns {Promise<Comment>}
     */
    createComment: async function (postId, content) {
        const res = await fetch(newsfeed.root + '/posts/' + postId + '/comments:create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            },
            body: JSON.stringify({
                content: content,
            })
        });
        if (res.status === 201) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    /**
     * 
     * @param {number} postId 
     * @param {number} commentId 
     * @returns {Promise<Comment>}
     */
    getComment: async function (postId, commentId) {
        const res = await fetch(newsfeed.root + '/posts/' + postId + '/comments/' + commentId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    /**
     * 
     * @param {number} postId 
     * @param {TimestampLimit} options 
     * @returns {Promise<Comment[]>}
     */
    getPostComments: async function (postId, options = undefined) {
        const query = options ? Object.keys(options).map(x => x + '=' + options[x]).join('&') : '';
        const res = await fetch(newsfeed.root + '/posts/' + postId + '/comments?' + query, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    deleteComment: async function (postId, commentId) {
        const res = await fetch(newsfeed.root + '/posts/' + postId + '/comments/' + commentId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 204) {
            return null;
        }
        throw new Error(await res.clone().json());
    },
    togglePostLike: async function (postId) {
        const res = await fetch(newsfeed.root + '/posts/' + postId + '/likes:toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    toggleCommentLike: async function (postId, commentId) {
        const res = await fetch(newsfeed.root + '/posts/' + postId + '/comments/' + commentId + '/likes:toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    }
}

const people = {
    root: undefined,

    findUserByUsername: async function (username) {
        const res = await fetch(people.root + '/users:lookup?username=' + username, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    findUserById: async function (userId) {
        const res = await fetch(people.root + '/users:lookup?id=' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    /**
     * 
     * @param {number} userId 
     * @param {TimestampLimit} options
     * @returns {Promise<Post[]>}
     */
    getUserPosts: async function (userId, options = undefined) {
        const query = options ? Object.keys(options).map(x => x + '=' + options[x]).join('&') : '';
        const res = await fetch(people.root + '/' + userId + '/posts?' + query, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    /**
     * 
     * @param {number} userId 
     * @returns {Promise<User[]>}
     */
    getUserFollowers: async function (userId) {
        const res = await fetch(people.root + '/' + userId + '/followers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    /**
     * 
     * @param {number} userId 
     * @returns {Promise<User[]>}
     */
    getUserFollowings: async function (userId) {
        const res = await fetch(people.root + '/' + userId + '/followings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    /**
     * 
     * @param {number} userId 
     * @returns {Promise<null>}
     */
    followUser: async function (userId) {
        const res = await fetch(people.root + '/' + auth.user.id + '/followings/' + userId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 204) {
            return null;
        }
        throw new Error(await res.clone().json());
    },
    /**
         * 
         * @param {number} userId 
         * @returns {Promise<null>}
         */
    unFollowUser: async function (userId) {
        const res = await fetch(people.root + '/' + auth.user.id + '/followings/' + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 204) {
            return null;
        }
        throw new Error(await res.clone().json());
    },
    /**
         * 
         * @param {number} userId 
         * @returns {Promise<null>}
         */
    toggleFollowUser: async function (userId) {
        const res = await fetch(people.root + '/' + auth.user.id + '/followings:toggle/' + userId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 201) {
            return res.clone().json();
        }
        throw new Error(await res.clone().json());
    },
    //{{meowServer}}/api/people/{{lastAuthId}}/followings:suggest
    getFollowSuggestions: async function () {
        const res = await fetch(people.root + '/' + auth.user.id + '/followings:suggest', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.idToken,
            }
        });
        if (res.status === 200) {
            return await res.clone().json();
        }
        throw new Error(await res.clone().json());
    }

}

/**
 * 
 * @param {MeowConfiguration} config 
 */
function initialize(config) {
    auth.root = config.root + '/api/auth';
    newsfeed.root = config.root + '/api/newsfeed';
    people.root = config.root + '/api/people';
    // sign in
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const idToken = getCookie('idToken');
        console.log('Check', idToken)
        if (idToken) {
            authData.idToken = idToken;
            auth.getUserData().then(user => {
                auth.user = user;
                eventEmitter.emit('user-state-change', auth.user);
            }).catch(err => {
                if (err.message === 'EXPIRED_ID_TOKEN') {
                    let refreshToken = window.localStorage.getItem('refreshToken');
                    if (refreshToken) return auth.refreshIdToken(refreshToken);
                }
                console.error(idToken);
                auth.signOut();
            });
        } else auth.signOut(); // emit event
    }
}
console.log(document.cookie);
export const meow = {
    initialize: initialize,
    auth: auth,
    newsfeed: newsfeed,
    people: people
};

function setCookie(name, value, days = 1000) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


