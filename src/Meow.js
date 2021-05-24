import fetch from "node-fetch";

var root = 'http://192.168.1.33:3000/api';
var cache = {
    users: {}
}
var events = {
    onUserStateChange: {
        handlers: [],
        isFirstInsert: true,
        onFirstInsert: undefined
    },

    addListener(eventName, handler) {
        if (typeof handler !== 'function') throw 'A function is expected as a callback!';
        if (!events[eventName]) throw new Error('no such an event called "' + eventName + '"!');
        const event = events[eventName];
        event.handlers.push(handler);
        if (event.isFirstInsert) {
            event.isFirstInsert = false;
            event.onFirstInsert.call(event);
        }
        return handler;
    },

    removeListener(eventName, handler) {
        if (typeof handler !== 'function') throw 'A function is expected as a callback!';
        if (!events[eventName]) throw new Error('no such an event called "' + eventName + '"!');
        const event = events[eventName];
        event.handlers = event.handlers.filter(e => e !== handler);
    },

    dispatch(eventName, args) {
        events[eventName].handlers.forEach(e => {
            e.call(this, args);
        });
    }
}

export var auth = {
    /**
     * @type {import("./MeowTypes").AuthenticatedUser}
     */
    user: null,
    url: root + '/auth',
    /**
     * 
     * @param {import("./MeowTypes").Credentials} credentials 
     * @returns {Promise<import("./MeowTypes").AuthenticatedUser>}
     */
    async signIn(credentials, remember = false) {
        eraseCookie('id-token');
        const response = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            this.user = await response.clone().json();
            if (remember) setCookie('id-token', this.user.token, 100);
            events.dispatch('onUserStateChange', this.user);
            return this.user;
        } else if (response.status === 409) {
            throw new Error('Wrong email or password!');
        } else if (response.status === 400) {
            throw new Error('Invalid data!')
        } else if (response.status === 500) {
            throw new Error('An internal server error occurred! please try again later')
        } else {
            throw new Error('An unknown error occurred! please try again later')
        }
    },
    /**
     * 
     * @param {string}} token 
     * @returns {Promise<import("./MeowTypes").AuthenticatedUser>}
     */
    async signInWithToken(token) {
        eraseCookie('id-token');
        const response = await fetch(this.url, {
            method: 'GET',
            headers: {
                'ID-Token': token
            }
        });
        if (response.status !== 200) {
            eraseCookie('id-token');
            throw response.clone();
        } else {

            this.user = await response.clone().json();
            setCookie('id-token', this.user.token, 100);
            events.dispatch('onUserStateChange', this.user);
            return this.user;
        }
    },
    signOut() {
        eraseCookie('id-token');
        this.user = null;
        events.dispatch('onUserStateChange', this.user);
    }
}
export var user = {
    url: root + '/user',
    /**
     * 
     * @param {Promise<import("./MeowTypes").UserRegistrationData>} userData 
     * @returns {Promise<import("./MeowTypes").User>}
     */
    async signUp(userData) {
        const response = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 201) {
            throw response.clone();
        } else {
            return response.clone().json();
        }
    },
    /**
     * 
     * @param {string} uid 
     * @returns {Promise<import("./MeowTypes").User>}
     */
    async getByUid(uid) {
        if (cache.users[uid]) {
            return cache.users[uid];
        }
        const response = await fetch(this.url + '?uid=' + uid, {
            method: 'GET',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response.clone();
        } else {
            let user = await response.clone().json();
            cache.users[user.uid] = user;
            return user;
        }
    },
    /**
     * 
     * @param {string} username 
     * @returns {Promise<import("./MeowTypes").User>}
     */
    async getByUsername(username) {
        const response = await fetch(this.url + '?username=' + username, {
            method: 'GET',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response.clone();
        } else {
            return response.clone().json();
        }
    },

    /**
     * 
     * @returns {import("./MeowTypes").User}
     */
    async delete() {
        const response = await fetch(this.url, {
            method: 'DELETE',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response.clone();
        } else {
            let a = auth.user;
            auth.user = null;
            return a;
        }
    }
}
export var post = {
    url: root + '/newsfeed/post',
    /**
     * 
     * @param {import("./MeowTypes").AbstractPost} post 
     * @returns {Promise<import("./MeowTypes").Post>}
     */
    async create(post) {
        const response = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(post),
            headers: {
                'Content-Type': 'application/json',
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 201) {
            throw response.clone();
        }
        return await response.json();
    },
    /**
     * 
     * @param {string} uid 
     * @returns {Promise<import("./MeowTypes").Post>}
     */
    async get(uid) {
        const response = await fetch(this.url + '?uid=' + uid, {
            method: 'GET',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response.clone();
        }
        let r = await response.json();
        r.liked = r.liked === 1 ? true : false;
        return r;
    },
    /**
     * 
     * @param {string} uid
     * @returns {Promise<Response>} 
     */
    delete(uid) {
        return fetch(this.url + '?uid=' + uid, {
            method: 'DELETE',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
    },

    /**
     * 
     * @param {number} offset
     * @returns {Promise<Response>} 
     */
    async getNewsfeedPosts(timestamp) {
        const response = await fetch(this.url + '?timestamp=' + timestamp, {
            method: 'GET',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response.clone();
        }

        return response.json();
    },
}
export var comment = {
    url: root + '/newsfeed/comment',
    /**
    * 
    * @param {import("./MeowTypes").AbstractComment} comment
    * @returns {Promise<import("./MeowTypes").Comment>} 
    */
    async create(comment) {
        const response = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json',
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 201) {
            throw response.clone();
        }
        return response.json();
    },
    /**
     * 
     * @param {string} uid 
     * @returns {Promise<import("./MeowTypes").Comment>}
     */
    async get(uid) {
        const response = await fetch(this.url + '?uid=' + uid, {
            method: 'GET',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response.clone();
        }
        let r = await response.json();
        r.liked = r.liked === 1 ? true : false;
        return r;
    },
    /**
     * 
     * @param {string} uid 
     * @returns {Promise<Response>}
     */
    async delete(uid) {
        const response = await fetch(this.url + '?uid=' + uid, {
            method: 'DELETE',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response;
        }
        return response;
    },
}


export var like = {
    url: root + '/newsfeed/like',
    /**
     * 
     * @param {string} uid 
     * @returns {Promise<import("./MeowTypes").LikeResponse>}
     */
    async toggle(uid) {
        const response = await fetch(this.url + '?uid=' + uid, {
            method: 'POST',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 201) {
            throw response.clone();
        }
        return await response.json();
    }
}

export var follow = {
    url: root + '/follow',
    /**
    * 
    * @returns {Promise<import("./MeowTypes").User[]>}
    */
    async followers(uid, offset) {
        const response = await fetch(this.url + '/followers?uid='+uid+'&offset='+offset, {
            method: 'GET',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response.clone();
        }
        let json = await response.json();
        json.forEach(element => {
            element.followed = element.followed === 1;
        });
        return json;
    },
    /**
        * 
        * @returns {Promise<import("./MeowTypes").User[]>}
        */
    async followings(uid, offset) {
        const response = await fetch(this.url + '/followings?uid='+uid+'&offset='+offset, {
            method: 'GET',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response.clone();
        }
        let json = await response.json();
        json.forEach(element => {
            element.followed = element.followed === 1;
        });
        return json;
    },

    /**
     * 
     * @returns {Promise<import("./MeowTypes").SuggestedUser[]>}
     */
    async suggestions() {
        const response = await fetch(this.url + '/suggestions', {
            method: 'GET',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 200) {
            throw response.clone();
        }
        let json = await response.json();
        json.forEach(element => {
            element.followed = element.followed === 1;
        });
        return json;
    },

    /**
     * @param {string} uid
     * @returns {Promise<import("./MeowTypes").FollowToggleResponse>}
     */
    async toggle(uid) {
        const response = await fetch(this.url + '?uid=' + uid, {
            method: 'POST',
            headers: {
                'ID-Token': auth.user?.token
            }
        });
        if (response.status !== 201) {
            throw response.clone();
        }
        return await response.json();
    }
}
export var addEventListener = events.addListener;
export var removeEventListener = events.removeListener;


function setCookie(name, value, days) {
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

events.onUserStateChange.onFirstInsert = () => {
    const idToken = getCookie('id-token');
    if (idToken) {
        auth.signInWithToken(idToken).then(e => { });
    } else {
        events.dispatch('onUserStateChange', null);
    }
}

