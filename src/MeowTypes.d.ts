export type Credentials = {
    email: string,
    password: string
}
export type UserInfo = {
    email: string,
    username: string
    displayName: string
    displayImageUrl: string | null
}

export type UserRegistrationData = UserInfo & Credentials;

export type User = UserInfo & {
    uid: string
    registrationTimestamp: Date
    followed: boolean
}

export type SuggestedUser = User & {
    connectionsCount: number
    connections: string[]
}

export type AuthenticatedUser = User & { token: string };

export type Like = {
    uid: string
    userUid: string
    itemUid: string
    timestamp: Date
}

export type LikeResponse = {
    liked: boolean
    likes: number
}

export type AbstractComment = {
    postUid: string
    content: string
}

export type Comment = AbstractComment & {
    uid: string
    userUid: string
    timestamp: Date,
    liked: boolean,
    likes: number
}

export type AbstractPost = {
    sharedPostUid: string | null
    content: string | null
}
export type Post = AbstractPost & {
    uid: string
    timestamp: Date
    userUid: string | null,
    commentsSnapshot: Comment[]
}

export type FollowToggleResponse = {
    userUid: string,
    followed: boolean
}