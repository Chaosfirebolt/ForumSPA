let post = (function () {
    "use strict";
    function submitPost(submit) {
        submit.preventDefault();
        let url = $('#url');
        let title = $('#title');
        let image = $('#image');
        let comment = $('#comment');

        let data = {
            author: sessionStorage.getItem('username'),
            title: title.val(),
            url: url.val(),
            imageUrl: image.val(),
            description: comment.val()
        };

        try {
            validator.validateUrl(data.url);
            validator.validateTitle(data.title);
        } catch (err) {
            handler.validationError(err);
            return;
        }

        const message = 'Post created.';

        $.ajax({
            url: requestData.postUrl(),
            method: 'POST',
            headers: requestData.userAuth(),
            data: JSON.stringify(data),
            contentType: requestData.contentType()
        })
            .then(function () {
                successPostRequest(message);
                clearInputFields(url, title, image, comment);
            })
            .catch(handler.basicError);
    }

    function editPost(submit) {
        submit.preventDefault();
        let btn = $('#btnEditPost');
        let postId = btn.attr('post-post-id');
        btn.removeAttr('post-post-id');

        let url = $('#editUrl');
        let title = $('#editTitle');
        let image = $('#editImage');
        let comment = $('#editDescription');

        let data = {
            author: sessionStorage.getItem('username'),
            title: title.val(),
            url: url.val(),
            imageUrl: image.val(),
            description: comment.val()
        };

        try {
            validator.validateUrl(data.url);
            validator.validateTitle(data.title);
        } catch (err) {
            handler.validationError(err);
            return;
        }

        const message = `Post ${data.title} updated.`;

        $.ajax({
            url: requestData.changePostUrl(postId),
            method: 'PUT',
            headers: requestData.userAuth(),
            data: JSON.stringify(data),
            contentType: requestData.contentType()
        })
            .then(function () {
                successPostRequest(message);
                clearInputFields(url, title, image, comment);
            })
            .catch(handler.basicError);
    }

    function clearInputFields(url, title, image, description) {
        url.val('');
        title.val('');
        image.val('');
        description.val('');
    }

    function successPostRequest(message) {
        $('#infoBox').show().find('span').text(message);
        setTimeout(accessor.hideStatusMsg, 3000);
    }

    function showAllPosts() {
        $.ajax({
            url: requestData.postUrl(),
            method: 'GET',
            headers: requestData.userAuth(),
            contentType: requestData.contentType()
        })
            .then(function (posts) {
                buildDomPosts(posts, '#viewCatalog');
            })
            .catch(handler.basicError);
    }

    function buildDomPosts(posts, selector) {
        const clickEvent = 'click';
        let count = 0;
        let catalog = $(selector).find('.posts');
        catalog.empty();
        for (let prop in posts) {
            if (posts.hasOwnProperty(prop)) {
                count++;
                let post = posts[prop];
                let article = $('<article>').addClass('post');

                article
                    .append($('<div>').addClass('col rank')
                        .append($('<span>').text(count)));

                article
                    .append($('<div>').addClass('col thumbnail')
                        .append($('<a>').attr('href', post.url).attr('target', '_blank')
                            .append($('<img>').attr('src', post.imageUrl))));

                let authorId = post._acl.creator;
                let controls = $('<ul>').attr('post-post-id', post._id).attr('post-author-id', authorId);
                let commentsLink = $('<a class="commentsLink" href="#">comments</a>').on(clickEvent, showPostDetails);
                controls.append($('<li class="action"></li>').append(commentsLink));
                if (userHasRights(authorId)) {
                    let editLink = $('<a class="editLink" href="#">edit</a>').on(clickEvent, showPostData);
                    controls.append($('<li class="action"></li>').append(editLink));

                    let deleteLink = $('<a class="deleteLink" href="#">delete</a>').on(clickEvent, deletePost);
                    controls.append($('<li class="action"></li>').append(deleteLink));
                }

                let postContent = $('<div>').addClass('post-content');
                postContent
                    .append($('<div>').addClass('title')
                        .append($('<a>').attr('href', post.url).attr('target', '_blank').text(post.title)));
                postContent
                    .append($('<div>').addClass('details')
                        .append($('<div>').addClass('info').text(`submitted ${format.formatDate(post._kmd.ect)} ago by ${post.author}`))
                        .append($('<div>').addClass('controls')
                            .append(controls)));

                article.append(postContent);
                catalog.append(article);
            }
        }
    }

    function showPostDetails() {
        let controls = $(this).parent().parent();
        $.ajax({
            url: requestData.changePostUrl(controls.attr('post-post-id')),
            method: 'GET',
            headers: requestData.userAuth(),
            contentType: requestData.contentType()
        })
            .then(showDetailsBuildDom)
            .catch(handler.basicError);
    }

    function showDetailsBuildDom(post) {
        let postDiv = $('#postDetails');
        postDiv.empty();
        postDiv.attr('data-post-id', post._id);

        postDiv
            .append($('<div>').addClass('col').addClass('thumbnail')
                .append($('<a>').attr('href', post.url).attr('target', '_blank')
                    .append($('<img>').attr('src', post.imageUrl))));

        let postContent = $('<div>').addClass('post-content');
        postContent
            .append($('<div>').addClass('title')
                .append($('<a>').attr('href', post.url).attr('target', '_blank').text(post.title)));

        let details = $('<div>').addClass('details');
        let description = post.description;
        if (description.length === 0) {
            description = 'No description';
        }
        details.append($('<p>').text(description));
        details.append($('<div>').addClass('info').text(`${format.formatDate(post._kmd.ect)} ago by ${post.author}`));
        if (userHasRights(post._acl.creator)) {
            const clickEvent = 'click';
            let list = $('<ul>');
            list
                .append($('<li class="action"></li>')
                    .append($('<a class="editLink" href="#">edit</a>').on(clickEvent, showPostData)));
            list
                .append($('<li class="action"></li>')
                    .append($('<a class="deleteLink" href="#">delete</a>').on(clickEvent, deletePost)));
            details
                .append($('<div>')
                    .addClass('controls').append(list));
        }
        postContent.append(details);
        postDiv.append(postContent);
        postDiv.append($('<div>').addClass('clear'));
        comment.getComments(post._id);
    }

    function userHasRights(authorId) {
        return sessionStorage.getItem('userId') === authorId;
    }

    function deletePost() {
        const message = 'Post deleted.';
        let controls = $(this).parent().parent();
        if (!userHasRights(controls.attr('post-author-id'))) {
            return;
        }

        $('#loadingBox').show();
        setTimeout(accessor.hideStatusMsg, 3000);

        $.ajax({
            url: requestData.changePostUrl(controls.attr('post-post-id')),
            method: 'DELETE',
            headers: requestData.userAuth(),
            contentType: requestData.contentType()
        })
            .then(function () {
                accessor.hideStatusMsg();
                showAllPosts();
                $('#infoBox').show().find('span').text(message);
                setTimeout(accessor.hideStatusMsg, 3000);
            })
            .catch(handler.basicError);
    }

    function showPostData() {
        let controls = $(this).parent().parent();
        if (!userHasRights(controls.attr('post-author-id'))) {
            return;
        }

        $.ajax({
            url: requestData.changePostUrl(controls.attr('post-post-id')),
            method: 'GET',
            headers: requestData.userAuth(),
            contentType: requestData.contentType()
        })
            .then(buildDomEditPostData)
            .catch(handler.basicError);
    }

    function buildDomEditPostData(post) {
        $('#editUrl').val(post.url);
        $('#editTitle').val(post.title);
        $('#editImage').val(post.imageUrl);
        $('#editDescription').val(post.description);
        $('#btnEditPost').attr('post-post-id', post._id);
        page.editPostPage();
    }

    function showUserPosts() {
        $.ajax({
            url: requestData.userPostsUrl(sessionStorage.getItem('userId')),
            method: 'GET',
            headers: requestData.userAuth(),
            contentType: requestData.contentType()
        })
            .then(function (posts) {
                buildDomPosts(posts, '#viewMyPosts');
            })
            .catch(handler.basicError);
    }

    return {
        submitPost: submitPost,
        editPost: editPost,
        showAllPosts: showAllPosts,
        showPostData: showPostData,
        showUserPosts: showUserPosts,
        showPostDetails: showPostDetails
    };
})();