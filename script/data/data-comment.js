let comment = (function () {
    "use strict";
    function getComments(postId) {
        $.ajax({
            url: requestData.postCommentsUrl(postId),
            method: 'GET',
            headers: requestData.userAuth(),
            contentType: requestData.contentType()
        })
            .then(buildDomComments)
            .catch(handler.basicError);
    }

    function buildDomComments(comments) {
        let view = $('#viewComments');
        view.find('article').remove();
        for (let prop in comments) {
            if (comments.hasOwnProperty(prop)) {
                let comment = comments[prop];
                let article = $('<article>').addClass('post').addClass('post-content').attr('data-comment-id', comment._id);
                article.append($('<p>').text(comment.content));
                let submitter = `${format.formatDate(comment._kmd.ect)} ago by ${comment.author}`;
                let info = $('<div>').addClass('info');
                if (userHasRights(comment._acl.creator)) {
                    let deleteLink = $('<a href="#" class="deleteLink">delete</a>').on('click', deleteComment);
                    info.text(`${submitter} | `).append(deleteLink);
                    article.append(info);
                } else {
                    info.text(submitter);
                    article.append(info);
                }
                view.append(article);
            }
        }
        page.postDetailsPage();
    }

    function deleteComment() {
        let commentId = $(this).parent().parent().attr('data-comment-id');
        const message = 'Comment delete.';
        $('#loadingBox').show();
        $.ajax({
            url: requestData.commentUrl(commentId),
            method: 'DELETE',
            headers: requestData.userAuth(),
            contentType: requestData.contentType()
        })
            .then(function () {
                successDeleteComment(message);
                let postId = $('#postDetails').attr('data-post-id');
                getComments(postId);
            })
            .catch(handler.basicError);
    }

    function successDeleteComment(message) {
        accessor.hideStatusMsg();
        $('#infoBox').show().find('span').text(message);
        setTimeout(accessor.hideStatusMsg, 3000);
    }

    function userHasRights(authorId) {
        return sessionStorage.getItem('userId') === authorId;
    }

    function addComment(submit) {
        submit.preventDefault();
        let textArea = $('#postComment');
        let commentText = textArea.val();
        let author = sessionStorage.getItem('username');

        let postId = $('#postDetails').attr('data-post-id');
        let data = {
            author: author,
            content: commentText,
            postId: postId
        };

        const message = 'Comment created.';
        $('#loadingBox').show();
        $.ajax({
            url: requestData.commentsUrl(),
            method: 'POST',
            headers: requestData.userAuth(),
            data: JSON.stringify(data),
            contentType: requestData.contentType()
        })
            .then(function () {
                successCommentPost(message);
                getComments(postId);
            })
            .catch(handler.basicError);
        textArea.val('');
    }

    function successCommentPost(message) {
        accessor.hideStatusMsg();
        $('#infoBox').show().find('span').text(message);
        setTimeout(accessor.hideStatusMsg, 3000);
    }

    return {
        getComments: getComments,
        addComment: addComment
    };
})();