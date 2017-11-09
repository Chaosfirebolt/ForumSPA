let validator = (function () {
    "use strict";
    let usernameRegex = /^[a-zA-Z]{3,}$/;
    let passwordRegex = /^[a-zA-Z0-9]{6,}$/;
    let urlRegex = /^http.*/;

    function validate(username, pass, repeatPass) {
        let match = usernameRegex.exec(username);
        if (match === null) {
            throw new Error('Invalid username. It can contain only english alphabet letters and must be at least 3 symbols long.');
        }

        match = passwordRegex.exec(pass);
        if (match === null) {
            throw new Error('Invalid password. It must contain only english alphabet letters and digits and must be at least 6 symbols long.');
        }

        if (pass !== repeatPass) {
            throw new Error('Passwords must match.');
        }
    }

    function validateUrl(url) {
        let match = urlRegex.exec(url);
        if (match === null) {
            throw new Error('Invalid url');
        }
    }

    function validateTitle(title) {
        if (title === undefined || title === null || title.trim().length === 0) {
            throw new Error('You must enter title.');
        }
    }

    return {
        validateCredentials: validate,
        validateUrl: validateUrl,
        validateTitle: validateTitle
    };
})();