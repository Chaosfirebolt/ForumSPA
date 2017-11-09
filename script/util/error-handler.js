let handler = (function () {
    "use strict";
    function basicError(err) {
        action(err.responseJSON.description);
    }

    function validationError(err) {
        action(err.message)
    }

    function action(message) {
        accessor.hideStatusMsg();
        $('#errorBox').show().find('span').text(message);
        setTimeout(accessor.hideStatusMsg, 3000);
    }

    return {
        basicError: basicError,
        validationError: validationError
    };
})();