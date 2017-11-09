let page = (function () {
    "use strict";
    function submitPostPage() {
        if (!user.isLogged()) {
            return;
        }
        accessor.hideSections();
        $('#viewSubmit').show();
    }

    function catalogPage() {
        accessor.hideSections();
        accessor.hideStatusMsg();
        accessor.showHideMenuBar();
        $('#viewCatalog').show();
        post.showAllPosts();
    }

    function editPostPage() {
        accessor.hideSections();
        accessor.hideStatusMsg();
        accessor.showHideMenuBar();
        $('#viewEdit').show();
        post.showPostData();
    }

    function myPostsPage() {
        accessor.hideSections();
        accessor.hideStatusMsg();
        accessor.showHideMenuBar();
        $('#viewMyPosts').show();
        post.showUserPosts();
    }

    function postDetailsPage() {
        accessor.hideSections();
        accessor.hideStatusMsg();
        accessor.showHideMenuBar();
        $('#viewComments').show();
    }

    return {
        submitPostPage: submitPostPage,
        catalogPage: catalogPage,
        editPostPage: editPostPage,
        myPostsPage: myPostsPage,
        postDetailsPage: postDetailsPage
    };
})();