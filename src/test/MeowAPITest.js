import { auth, user, comment, like, post } from '../MeowV2.js';
import * as C from '../../../server/console-colors.js';
var userData = {
    email: 'dsa11@gmail.com', password: 'dsadsadsa', username: '1CloraFedora2311', displayName: 'Clora Fedora'
};
let postUid = null;
let commentUid = null;
user.signUp(userData).then(res => {
    console.log(C.yellow, "Created User: " + res.id);
    return auth.signIn({ email: userData.email, password: userData.password });
}).then(user => {
    console.log(C.yellow, "Signed In: " + user.displayName + '::' + user.id);
    return auth.signInWithToken(user.token);
}).then(res => {
    console.log(C.yellow, "Signed In With Token: " + res.displayName + '::' + res.id);
    return user.getByUid(res.id);
}).then(res => {
    console.log(C.yellow, "Get User By id: " + res.displayName + '::' + res.id);
    return user.getByUsername(res.username);
}).then(res => {
    console.log(C.yellow, "Get User By Username: " + res.displayName + '::' + res.id);
    return post.create({ content: 'My first post!' });
}).then(post => {
    postUid = post.id;
    console.log(C.yellow, "Created Post: " + postUid);
    return comment.create({ content: 'My first comment!', postUid: post.id });
}).then(comment => {
    console.log(C.yellow, "Created Comment: " + comment.id);
    commentUid = comment.id;
    return like.comment(comment.id);
}).then(li => {
    console.log(C.yellow, "Liked Comment: " + li.id + '::' + li.itemUid);
    return like.post(postUid);
}).then(li => {
    console.log(C.yellow, "Liked Post: " + li.id + '::' + li.itemUid);
    return comment.delete(commentUid);
}).then(res => {
    console.log(C.yellow, "Deleted Comment: " + commentUid);
    return post.delete(postUid);
}).then(res => {
    console.log(C.yellow, "Deleted Post: " + postUid);
}).then(discarded => {
    return user.delete(auth.user.id);
}).then(() => {
    console.log(C.magenta, "Deleted User");
    console.log(C.green, 'All tasks finished successfully!')
}).catch(response => {
    if (auth.user)
        user.delete(auth.user.id);
    console.error(C.red, 'Error:' + response.url)
    if (response.headers?.get('content-type')?.includes('application/json'))
        response.clone().json().then(console.error);
    else console.error(response);
});

