import { auth, user, comment, like, post } from '../MeowV2.js';
import * as C from '../../../server/console-colors.js';
var userData = {
    email: 'dsa11@gmail.com', password: 'dsadsadsa', username: '1CloraFedora2311', displayName: 'Clora Fedora'
};
let postUid = null;
let commentUid = null;
user.signUp(userData).then(res => {
    console.log(C.yellow, "Created User: " + res.uid);
    return auth.signIn({ email: userData.email, password: userData.password });
}).then(user => {
    console.log(C.yellow, "Signed In: " + user.displayName + '::' + user.uid);
    return auth.signInWithToken(user.token);
}).then(res => {
    console.log(C.yellow, "Signed In With Token: " + res.displayName + '::' + res.uid);
    return user.getByUid(res.uid);
}).then(res => {
    console.log(C.yellow, "Get User By Uid: " + res.displayName + '::' + res.uid);
    return user.getByUsername(res.username);
}).then(res => {
    console.log(C.yellow, "Get User By Username: " + res.displayName + '::' + res.uid);
    return post.create({ content: 'My first post!' });
}).then(post => {
    postUid = post.uid;
    console.log(C.yellow, "Created Post: " + postUid);
    return comment.create({ content: 'My first comment!', postUid: post.uid });
}).then(comment => {
    console.log(C.yellow, "Created Comment: " + comment.uid);
    commentUid = comment.uid;
    return like.comment(comment.uid);
}).then(li => {
    console.log(C.yellow, "Liked Comment: " + li.uid + '::' + li.itemUid);
    return like.post(postUid);
}).then(li => {
    console.log(C.yellow, "Liked Post: " + li.uid + '::' + li.itemUid);
    return comment.delete(commentUid);
}).then(res => {
    console.log(C.yellow, "Deleted Comment: " + commentUid);
    return post.delete(postUid);
}).then(res => {
    console.log(C.yellow, "Deleted Post: " + postUid);
}).then(discarded => {
    return user.delete(auth.user.uid);
}).then(() => {
    console.log(C.magenta, "Deleted User");
    console.log(C.green, 'All tasks finished successfully!')
}).catch(response => {
    if (auth.user)
        user.delete(auth.user.uid);
    console.error(C.red, 'Error:' + response.url)
    if (response.headers?.get('content-type')?.includes('application/json'))
        response.clone().json().then(console.error);
    else console.error(response);
});

