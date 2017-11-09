let requestData = (function () {
    "use strict";
    const baseUrl = 'https://baas.kinvey.com';
    const appId = 'kid_rkfwqWvdb';
    const appSecret = '7cc67dbd43724e43a0b7b262097d4ca0';
    const authHeaders = {
        'Authorization': 'Basic ' + btoa(appId + ':' + appSecret)
    };
    const contentType = 'application/json';

    const baseUserUrl = baseUrl + '/user' + `/${appId}`;
    const loginUrl = baseUserUrl + '/login';
    const logoutUrl = baseUserUrl + '/_logout';

    const postsUrl = baseUrl + '/appdata' + `/${appId}` + '/posts';
    const commentsUrl = baseUrl + '/appdata' + `/${appId}` + '/comments';

    return {
        registrationUrl: function () {
            return baseUserUrl;
        },
        loginUrl: function () {
            return loginUrl;
        },
        logoutUrl: function () {
            return logoutUrl;
        },
        appAuth: function () {
            return authHeaders;
        },
        userAuth: function () {
            return {
                'Authorization': "Kinvey " + sessionStorage.getItem('authToken')
            };
        },
        contentType: function () {
            return contentType;
        },
        postUrl: function () {
            return postsUrl;
        },
        changePostUrl: function (postId) {
            return postsUrl + `/${postId}`;
        },
        userPostsUrl: function (userId) {
            return postsUrl + `?query={"_acl.creator":"${userId}"}`;
        },
        commentsUrl: function () {
            return commentsUrl;
        },
        commentUrl: function (commentId) {
            return commentsUrl + `/${commentId}`;
        },
        postCommentsUrl: function (postId) {
            return commentsUrl + `?query={"postId":"${postId}"}`;
        }
    }
})();