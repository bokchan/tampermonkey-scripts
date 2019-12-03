// ==UserScript==
// @name         Gitlab custom shortcuts
// @namespace    https://github.com/bokchan
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @author       Andreas Bok Andersen
// @description  Github custom shortcuts
// @date         02.12.2019
// @version      0.0.1
// @match        https://*.gitlab.com/*
// @downloadURL  https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/gitlab.com-shortcuts.user.js
// @homepageURL  https://github.com/bokchan/tampermonkey-scripts
// @supportUrl   https://github.com/bokchan/tampermonkey-scripts/wiki
// @updateURL    https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/gitlab.com-shortcuts.meta.js
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/picomodal/3.0.0/picoModal.min.js
// @require      https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/bokchan.shortcuts.util.js
// ==/UserScript==

const repo_regex = '(https?:\/\/gitlab.com\/[^/]+\/[^/]+)';
const repo_url = window.location.href.match(repo_regex);


/**
 * Util function to check if the redirect url is equal to the current url
 *
 * @param      {string}     url_suffix  The suffix to the current url to match
 *                          against
 * @return     {boolean}    True if same url, False otherwise.
 */
function is_same_url(url_suffix) {
    return window.location.href.match(repo_url[0] + url_suffix);
}



/**
 * @brief Switch to discussion tab on merge requests
 */
Mousetrap.bind('shift+1', function () {
    const pr_url = window.location.href.match('(/merge_requests\/[0-9]+)');
    if (pr_url) {
        document.querySelector('.notes-tab a').click()
    }
});


/**
 * @brief Switch to changes tab on merge requests
 */
Mousetrap.bind('shift+4', function () {
    const pr_url = window.location.href.match('(/merge_requests\/[0-9]+)');
    if (pr_url) {
        document.querySelector('.diffs-tab a').click()
    }
});


/**
 * @brief Switch to the commits tab on merge requests
 */
Mousetrap.bind('shift+2', function () {
    const pr_url = window.location.href.match('(/merge_requests\/[0-9]+)');
    if (pr_url) {
        document.querySelector('.commits-tab a').click()
    }
});


/**
 * @brief Sets the focus on the sub search input on the issues and pull requests
 *        listing page
 */
Mousetrap.bind('b f', function () {
    const the_url = is_same_url('/(merge_requests|issues|boards)');
    if (the_url) {
        var subnav_search = document.querySelector("input[class='form-control filtered-search']");
        subnav_search.focus();
    }
});


var shortcuts = [
    ['Discussion tab', 'shift+1'], 
    ['Commits tab', 'shift+2'], 
    ['Changes tab', 'shift+4'], 
    ['Focus filtered search', 'b f'],    
]

var help_content = create_shortcut_help(shortcuts);

/**
* Show shortcuts
*/
Mousetrap.bind('shift+i', function(){
    picoModal(help_content).show();
});
