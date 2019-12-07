// ==UserScript==
// @name         Gitlab custom shortcuts
// @namespace    https://github.com/bokchan
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @author       Andreas Bok Andersen
// @description  Github custom shortcuts
// @date         06.12.2019
// @version      0.0.6
// @match        https://*.gitlab.com/*
// @downloadURL  https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/gitlab.com-shortcuts.user.js
// @homepageURL  https://github.com/bokchan/tampermonkey-scripts
// @supportUrl   https://github.com/bokchan/tampermonkey-scripts/wiki
// @updateURL    https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/gitlab.com-shortcuts.meta.js
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/picomodal/3.0.0/picoModal.min.js
// @require      https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/bokchan.shortcuts.util.js
// ==/UserScript==

const repo_regex = "(https?://gitlab.com/[^/]+/[^/]+)";
const merge_request_regex = "(/merge_requests/[0-9]+)"
const merge_request_list_regex = "/merge_requests(\\?scope=.+)?$"
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

function match_url(url) {
  return window.location.href.match(url);
}

function click_element(selector) {
  var el = document.querySelector(selector)
  if (el) { el.click(); }
}

function handle_shortcut(url, selector) {
  if (match_url(url)) {
    click_element(selector)
  }
}

function handle_shortcut_multiple(urls_selectors) {
  for (url_selector of urls_selectors) {
    if (handle_shortcut(url_selector[0], url_selector[1])) break;
  }
}

/**
 * @brief Switch to 'discussion' tab on merge requests
 */
Mousetrap.bind("shift+1", function() {
  handle_shortcut_multiple([
    [merge_request_regex, ".notes-tab a"],
    [merge_request_list_regex, "#state-opened"],
  ])
});

/**
 * @brief Switch to the 'commits' tab on merge requests
 */
Mousetrap.bind("shift+2", function() {
  handle_shortcut_multiple([
    [merge_request_regex, ".commits-tab a"],
    [merge_request_list_regex, "#state-merged"],
  ]);
});

/**
 * @brief Switch to the 'pipelines' tab on merge requests
 */
Mousetrap.bind("shift+3", function() {
  handle_shortcut_multiple([
    [merge_request_regex, ".pipelines-tab a"],
    [merge_request_list_regex, '#state-closed'],
  ]);
});

/**
 * @brief Switch to 'changes' tab on merge requests
 */
Mousetrap.bind("shift+4", function() {
  handle_shortcut_multiple([
    [merge_request_regex, ".diffs-tab a"],
    [merge_request_list_regex, '#state-all'],
  ]);
});

/**
 * @brief Sets the focus on the sub search input on the issues and pull requests
 *        listing page
 */
Mousetrap.bind("f", function() {
  var subnav_search = document.querySelector(
    "input[class='form-control filtered-search']"
  );
  if (subnav_search != null) {
    subnav_search.focus();
  }
});

/**
 * @brief Changes to bulk edit mode
 */
Mousetrap.bind('shift+e', function () {
  handle_shortcut(repo_regex, '.js-bulk-update-toggle')
});

var shortcuts = [
  ["Discussion| Opened", "shift+1"],
  ["Commits | Merged", "shift+2"],
  ["Pipelines | Closed", "shift+3"],
  ["Changes | All", "shift+4"],
  ['Edit bulk', 'shift+e'],
  ["Focus filtered search", "f"]
];

var help_content = create_shortcut_help(shortcuts);

/**
 * Show shortcuts
 */
Mousetrap.bind("shift+h", function() {
  picoModal(help_content).show();
});
