// ==UserScript==
// @name         Github custom shortcuts
// @namespace    https://github.com/bokchan
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @author       Andreas Bok Andersen
// @description  Github custom shortcuts
// @date         29.08.2018
// @version      0.0.1
// @match        https://*.github.com/*
// @downloadURL  https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/github.com-shortcuts.user.js
// @homepageURL  https://github.com/bokchan/tampermonkey-scripts
// @supportUrl   https://github.com/bokchan/tampermonkey-scripts/wiki
// @updateURL    https://openuserjs.org/meta/bok_chan/github.com-shortcuts.meta.js
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/picomodal/3.0.0/picoModal.min.js
// @require      https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/bokchan.shortcuts.util.js
// ==/UserScript==

const github_repo_regex = '(https?://github.com/[a-z0-9-]+\/[a-z0-9-]+)';
const repo_url = window.location.href.match(github_repo_regex);


/**
 * Util function to check if the redirect url is equal to the current url
 *
 * @param      {string}     url_suffix  The suffix to the current url to match
 *                          against
 * @return     {boolean}    True if same url, False otherwise.
 */
function is_same_url ( url_suffix )
{
    return window.location.href.match(repo_url[0] + url_suffix );
}


/**
 * @brief Shortcut for navigating to the list of milestones
 */
Mousetrap.bind('g m', function(){
    if (repo_url && !is_same_url('/milestones\/?'))
    {
        window.location.href = repo_url[0] + '/milestones/';
    }
});


/**
 * @brief Shortcut for toggling closed and open issues for a milestone
 */
Mousetrap.bind('shift+m', function(){
    var milestone = is_same_url('(\/milestone\/[0-9]+)');
    console.log(milestone);
    if (repo_url && is_same_url('(\/milestone\/[0-9]+)') )
    {
        if ( window.location.href.match('closed=1$') )
        {
            window.location.href = (window.location.href).replace('?closed=1', '');
        }
        else
        {
            window.location.href = window.location.href + "?closed=1";
        }
    }
});


/**
 * @brief Shortcut for navigating to the list of releases
 */
Mousetrap.bind('g r', function(){
    if (repo_url && !is_same_url('/releases\/?'))
    {
        window.location.href = repo_url[0] + '/releases';
    }
});


/**
 * @brief Shortcut to show closed pull requests
 */
Mousetrap.bind('p shift+c', function(){
    if ( repo_url && ! is_same_url('.+is%3Aclosed.*') )
    {
        window.location.href = repo_url[0] + '/pulls' + '?q=is%3Apr+is%3Aclosed';
    }
});


/**
 * @brief Shortcut for the list of commits for a pull request
 */
Mousetrap.bind('shift+2', function(){
    const pr_url = window.location.href.match('(/pull\/[0-9]+)');
    if (pr_url )
    {
        window.location.href = repo_url[0] + pr_url[0] + '/commits';
    }
});


/**
 * @brief Shortcut expanding outdated comments
 */
Mousetrap.bind('o e', function(){
    const pr_url = window.location.href.match('(/pull\/[0-9]+)');

    console.log(pr_url);

    if (pr_url )
    {
        var list = document.getElementsByClassName("outdated-comment");
        for (var i = 0; i < list.length; i++) {
            list[i].setAttribute("open", "");
        }
    }
});


/**
 * @brief Shortcut collapsing outdated comments
 */
Mousetrap.bind('o c', function(){
    const pr_url = window.location.href.match('(/pull\/[0-9]+)');

    console.log(pr_url);

    if (pr_url )
    {
        var list = document.getElementsByClassName("outdated-comment");
        for (var i = 0; i < list.length; i++) {
            list[i].removeAttribute("open");
        }
    }
});


/**
 * @brief Shortcut for navigating to next page
 */
Mousetrap.bind('o n', function(){
    var next_page = document.getElementsByClassName('next_page');
    if (next_page && ! next_page[0].classList.contains('disabled'))
        next_page[0].click();
});


/**
 * @brief Shortcut for navigating to previous page
 */
Mousetrap.bind('o p', function(){
    var previous_page = document.getElementsByClassName('previous_page');
    if (previous_page && ! previous_page[0].classList.contains('disabled'))
        previous_page[0].click();
});


/**
 * @brief Shortcut for navigating to the PR Conversations tab
 */

Mousetrap.bind('shift+1', function(){
    const pr_url = window.location.href.match('(/pull\/[0-9]+)');
    if (pr_url)
    {
        window.location.href = repo_url[0] + pr_url[0];
    }
});


/**
 * @brief Shortcut for navigating to the PR "Files changed" tab
 */
Mousetrap.bind('shift+4', function(){
    const pr_url = window.location.href.match('(/pull\/[0-9]+)');
    if (pr_url)
    {
        window.location.href = repo_url[0] + pr_url[0] + '/files';
    }
});


/**
 * @brief Sets the focus on the sub search input on the issues and pull requests
 *        listing page
 */
Mousetrap.bind('ctrl ctrl', function () {
    const the_url = is_same_url('/(pull|issues)(.*q=.*|/?$)');
    if ( the_url )
    {
        var subnav_search = document.querySelector(".subnav-search input[type='text']");
        var curr_search = subnav_search.getAttribute('value');
        subnav_search.focus();
        setCaretPosition(subnav_search, curr_search.length);
    }
});


var shortcuts = [
['list milestones', 'g m'],
['toggle closed/open milestone issues', 'shift+m'],
['list releases', 'g r'],
['list closed pull requests', 'g shift+c'],
['list commits on PR', 'shift+2'],
['expand outdated PR comments', 'o e'],
['collapse outdated PR comments', 'o c'],
['goto next page', 'o n'],
['goto next previous', 'o p'],
['goto PR "Conversations" tab', 'shift+1'],
['goto PR "Files changed"', 'shift+4'],
['focus on sub search field on PR and Issues listing', 'ctrl ctrl']
];

var help_content = create_shortcut_help(shortcuts);

/**
* Show shortcuts
*/
Mousetrap.bind('shift+i', function(){
    picoModal(help_content).show();
});
