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
 * Shortcut for toggling closed and open issues for a milestone
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


/**
 * Show shortcuts
 */
Mousetrap.bind('u', function(){
    console.log('showhelp');
    var help_content = `
<style type="text/css">
#modal_header
{
   font-weight: bold;
}
.modal_divider
{
   width: 20px;
}
</style>
<div>
    <table id=modal_table>
        <thead id=modal_header><tr>
            <td>shortcut</td>
            <td class="modal_divider"></td>
            <td>description</td>
        </tr></thead>
        <tr>
            <td><code>g m</code></td>
            <td class="modal_divider"></td>
            <td>list milestones</td>
        </tr>
        <tr>
            <td><code>shift+m</code></td>
            <td class="modal_divider"></td>
            <td>toggle closed/open milestone issues</td>
        </tr>
        <tr>
            <td><code>g r</code></td>
            <td class="modal_divider"></td>
            <td>list releases</td>
        </tr>
        <tr>
            <td><code>g shift+c</code></td>
            <td class="modal_divider"></td>
            <td>list closed pull requests</td>
        </tr>
        <tr>
            <td><code>shift+c</code></td>
            <td class="modal_divider"></td>
            <td>list commits on PR</td>
        </tr>
        <tr>
            <td><code>o e</code></td>
            <td class="modal_divider"></td>
            <td>expand outdated PR comments</td>
        </tr>
        <tr>
            <td><code>shift+c</code></td>
            <td class="modal_divider"></td>
            <td>collapse outdated PR comments</td>
        </tr>
    </table>
</div>`;
    picoModal(help_content).show();
});
