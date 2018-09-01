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
// @require      https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js
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
 * Shortcut for navigating to the list of milestones
 */
Mousetrap.bind('g m', function(){
    if (repo_url && !is_same_url('/milestones\/?'))
    {
        window.location.href = repo_url[0] + '/milestones/';
    }
});


/**
 * Shortcut for showing closed issues for a milestone
 */
Mousetrap.bind('shift+m', function(){
    if (repo_url && is_same_url('\/milestone\/[0-9]+') && ! window.location.href.match('closed=1$'))
    {
        window.location.href = window.location.href + "?closed=1";
    }
});


/**
 * Shortcut for navigating to the list of releases
 */
Mousetrap.bind('g r', function(){
    if (repo_url && !is_same_url('/releases\/?'))
    {
        window.location.href = repo_url[0] + '/releases';
    }
});


/**
 * Shortcut to show closed pull requests
 */
Mousetrap.bind('p shift+c', function(){
    if ( repo_url && ! is_same_url('.+is%3Aclosed.*') )
    {
        window.location.href = repo_url[0] + '/pulls' + '?q=is%3Apr+is%3Aclosed';
    }
});


/**
 * Shortcut for the list of commits for a pull request
 */
Mousetrap.bind('shift+c', function(){
    const pr_url = window.location.href.match('(/pull\/[0-9]+)');
    if (pr_url )
    {
        window.location.href = repo_url[0] + pr_url[0] + '/commits';
    }
});


/**
 * Shortcut expanding outdated comments
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
 * Shortcut collapsing outdated comments
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
