let accessor = (function () {
    "use strict";
    function hideStatusMsg() {
        $('#loadingBox').hide();
        $('#infoBox').hide();
        $('#errorBox').hide();
    }

    function hideSections() {
        $('section').hide();
    }

    function showHideMenuBar() {
        if (!user.isLogged()) {
            $('#profile').hide().find('span').text('');
            $('#viewWelcome').show();
            $('#menu').hide();
        } else {
            $('#profile').show();
            hideSections();
            $('#menu').show();
        }
    }

    return {
        hideStatusMsg: hideStatusMsg,
        hideSections: hideSections,
        showHideMenuBar: showHideMenuBar
    };
})();