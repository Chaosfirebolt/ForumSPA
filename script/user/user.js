let user = (function () {
    "use strict";
    function loginUser(submit) {
        submit.preventDefault();
        if (isLogged()) {
            return;
        }
        let data = userCredentials('#loginForm', false);

        const message = 'Login successful.';
        $('#loadingBox').show();
        $.ajax({
            url: requestData.loginUrl(),
            method: 'POST',
            headers: requestData.appAuth(),
            data: JSON.stringify(data),
            contentType: requestData.contentType()
        })
            .then(function (userInfo) {
                regLoginSuccess(userInfo, message);
            })
            .catch(handler.basicError);
    }

    function logout() {
        if (!isLogged()) {
            return;
        }

        $('#loadingBox').show();
        $.ajax({
            url: requestData.logoutUrl(),
            method: 'POST',
            headers: requestData.userAuth()
        })
            .then(logoutSuccess)
            .catch(handler.basicError);
    }

    function logoutSuccess() {
        sessionStorage.clear();
        accessor.hideStatusMsg();
        accessor.hideSections();
        accessor.showHideMenuBar();
        const message = 'Logout successful.';
        $('#infoBox').show().find('span').text(message);
        setTimeout(accessor.hideStatusMsg, 3000);
    }

    function registerUser(submit) {
        submit.preventDefault();
        if (isLogged()) {
            return;
        }
        let data;
        try {
            data = userCredentials('#registerForm', true);
        } catch (err) {
            handler.validationError(err);
            return;
        }

        const message = 'User registration successful.';
        $.ajax({
            url: requestData.registrationUrl(),
            method: 'POST',
            headers: requestData.appAuth(),
            data: JSON.stringify(data),
            contentType: requestData.contentType()
        })
            .then(function (userInfo) {
                regLoginSuccess(userInfo, message);
            })
            .catch(handler.basicError);;
    }

    function userCredentials(selector, shouldValidate) {
        let form = $(selector);
        let username = form.find('input[name=username]');
        let password = form.find('input[name=password]');
        let repeatPass = form.find('input[name=repeatPass]');

        if (shouldValidate) {
            validator.validateCredentials(username.val(), password.val(), repeatPass.val());
        }
        let data = {
            username: username.val(),
            password: password.val()
        };
        username.val('');
        password.val('');
        repeatPass.val('');
        return data;
    }

    function regLoginSuccess(userInfo, message) {
        let username = userInfo.username;
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('name', userInfo.name);

        page.catalogPage();
        $('#profile').show().find('span').text(username);
        $('#infoBox').show().find('span').text(message);
        setTimeout(accessor.hideStatusMsg, 3000);
    }

    function isLogged() {
        return sessionStorage.getItem('authToken');
    }

    return {
        register: registerUser,
        login: loginUser,
        logout: logout,
        isLogged: isLogged
    };
})();