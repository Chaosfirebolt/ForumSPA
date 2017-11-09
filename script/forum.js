function startApp() {
    "use strict";
    accessor.hideSections();
    accessor.showHideMenuBar();
    attachEvents();

    function attachEvents() {
        const clickEvent = 'click';
        const submitBtnSelector = 'input[type=submit]';

        $('#loginForm').find(submitBtnSelector).on(clickEvent, user.login);
        $('#registerForm').find(submitBtnSelector).on(clickEvent, user.register);

        $('#profile').find('a').on(clickEvent, user.logout);
        $('#notifications').find('span').trigger(clickEvent).on(clickEvent, accessor.hideStatusMsg);

        $('#submitPostLink').on(clickEvent, page.submitPostPage);
        $('#btnSubmitPost').on(clickEvent, post.submitPost);
        $('#btnEditPost').on(clickEvent, post.editPost);
        $('#showCatalogLink').on(clickEvent, page.catalogPage);

        $('#showMyPostsLink').on(clickEvent, page.myPostsPage);
        $('#commentForm').find(submitBtnSelector).on(clickEvent, comment.addComment);
    }
}