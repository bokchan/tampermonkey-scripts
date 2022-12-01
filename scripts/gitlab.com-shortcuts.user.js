// ==UserScript==
// @name         Gitlab custom shortcuts
// @namespace    https://github.com/bokchan
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @author       Andreas Bok Andersen
// @description  Github custom shortcuts
// @version      0.0.33
// @match        https://*.gitlab.com/*
// @downloadURL  https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/gitlab.com-shortcuts.user.js
// @homepageURL  https://github.com/bokchan/tampermonkey-scripts
// @updateURL    https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/gitlab.com-shortcuts.meta.js
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/picomodal/3.0.0/picoModal.min.js
// @require      https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/bokchan.shortcuts.util.js
// ==/UserScript==

const repoRegex = "(https?://gitlab.com/[^/]+/[^/]+)";
const issuePageRegex = "(/issues/[0-9]+)";
const issuePageListRegex = "/issues(\\?(scope|state)=.+)?";
const mergeRequestRegex = "/merge_requests/([0-9]+)";
const mergeRequestListRegex = "/merge_requests(\\?(scope|state)=.+)?";
let mergeRequestCommitListRegex = "/merge_requests/[0-9]+/commits.*";
const repoUrl = window.location.href.match(repoRegex);

/**
 * Util function to check if the redirect url is equal to the current url
 *
 * @param      {string}     urlSuffix  The suffix to the current url to match
 *                          against
 * @return     {boolean}    True if same url, False otherwise.
 */
function isSameUrl(urlSuffix) {
  return window.location.href.match(repoUrl[0] + urlSuffix);
}

function currentUrlMatches(urlRegex) {
  return window.location.href.match(urlRegex) != null;
}

function clickElement(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.click();
  }
}

function handleShortcut(urlRegex, selector) {
  if (currentUrlMatches(urlRegex)) {
    clickElement(selector);
  }
}

function handleShortcutMultiple(urlElementSelectorPairs) {
  for (const pair of urlElementSelectorPairs) {
    if (handleShortcut(pair[0], pair[1])) break;
  }
}

function switchTab(keyEvent) {
  let tab_index = keyEvent.keyCode - 48; // make the keycode a zero-indexed value
  let tab = document
    .querySelector("ul.gl-tabs-nav,ul.nav-tabs")
    .querySelector(`li:nth-child(${tab_index})`);
  if (tab && tab.classList.contains("active") == false) {
    tab.querySelector("a").click();
  }
}

/**
 * @brief Switch to tab by index
 */
Mousetrap.bind(["shift+1", "shift+2", "shift+3", "shift+4"], function (e) {
  switchTab(e);
});

/**
 * @brief Changes to bulk edit mode
 */
Mousetrap.bind("ctrl+shift+e", function () {
  handleShortcut(repoRegex, ".js-bulk-update-toggle");
});

/**
 * @brief Toggle the recent searches dropdown
 */
Mousetrap.bind("r", function () {
  clickElement(".gl-search-box-by-click-history button");
});

/**
 * @brief Sidebar shortcuts on issues
 */
Mousetrap.bind(["E", "ctrl+w", "ctrl+i"], function (e) {
  console.log("sidebar", currentUrlMatches(issuePageListRegex));
  if (currentUrlMatches(issuePageListRegex)) {
    switch (e.key) {
      case "E":
        clickElement(
          "div[data-testid='epic-edit'] button[data-testid='edit-button']"
        );
        break;
      case "i":
        if (e.ctrlKey) {
          clickElement("button#iteration-edit span");
        }
        break;
      case "w":
        if (e.ctrlKey) {
          clickElement("a.js-weight-edit-link");
          var sidebar_weight_block = document.querySelector(
            "div.block.weight > div:nth-child(3)"
          );
          sidebar_weight_block.style.display = "block";
        }
        break;
      default:
        break;
    }
  }
});

function getlistSelectors() {
  var ret = [null, null];
  if (currentUrlMatches(issuePageListRegex)) {
    ret = ["issue", "div.issuable-main-info a"];
  } else if (currentUrlMatches(mergeRequestListRegex)) {
    ret = ["merge-request", "div.issuable-main-info a"];
  } else if (currentUrlMatches(mergeRequestCommitListRegex)) {
    ret = ["commit", "div.commit-content a"];
  }
  return ret;
}

/**
 * Navigate a list with shortcut keys
 *
 * 'j': select next item
 * 'k': select previous item
 * 'o': open the selected item in same tab
 * 'shift+o': open the selected item in new tab
 *
 * @param {Event} e
 */
Mousetrap.bind(["j", "k", "o", "shift+o"], function (e) {
  const [listItemType, linkSelector] = getlistSelectors();
  console.log(listItemType, linkSelector);
  let contentListItems = document.querySelectorAll(
    `ul.content-list li.${listItemType}`
  );

  if (contentListItems) {
    let nodeList = Array.from(contentListItems);
    var selectedItem = null;
    var nextSelected = contentListItems[0];
    selectedItem = document.querySelector("li.selected-item.active");
    if (selectedItem) {
      let selectedItemIndex = nodeList.indexOf(selectedItem);
      switch (e.key) {
        case "k":
          nextSelected =
            selectedItemIndex > 0
              ? nodeList[selectedItemIndex - 1]
              : nodeList[-1];
          break;
        case "j":
          nextSelected =
            selectedItemIndex < nodeList.length - 1
              ? nodeList[selectedItemIndex + 1]
              : nodeList[0];
          break;
        case "o":
        case "O":
          if (currentUrlMatches(mergeRequestCommitListRegex)) {
            store_merge_request_commits();
          }
          var target = e.shiftKey ? "_blank" : "_self";
          var link = selectedItem.querySelector(linkSelector);
          window.open(link.href, target);
          return;
        default:
          break;
      }
    }

    if (selectedItem) {
      selectedItem.classList.remove("selected-item");
      selectedItem.classList.remove("active");
    }
    if (nextSelected) {
      nextSelected.classList.add("selected-item");
      nextSelected.classList.add("active");
    }
  }
});

function commit_ids_from_dom() {
  let elems = document.querySelectorAll("a.commit-row-message");
  let commits = Array.prototype.map.call(elems, function (obj) {
    let url = obj.getAttribute("href");
    let query_params = url.slice(url.indexOf("?") + 1);
    let url_params = new URLSearchParams(query_params);
    return url_params.get("commit_id");
  });
  return commits;
}

function store_merge_request_commits() {
  let commits = localStorage.getItem("merge_request_commits");
  let merge_request_id = window.location.href.match(mergeRequestRegex)[1];
  if (commits == null || merge_request_id != commits["merge_request_id"]) {
    localStorage.setItem(
      "merge_request_commits",
      JSON.stringify({
        commit_ids: commit_ids_from_dom(),
        merge_request_id: merge_request_id,
      })
    );
  }
}

Mousetrap.bind(["shift+w", "shift+e"], function (e) {
  let merge_request_diffs_url = window.location.href.match(
    mergeRequestRegex + "/diffs"
  );
  if (merge_request_diffs_url == null) return;

  let merge_request_id = merge_request_diffs_url[1];
  let search_params = new URLSearchParams(window.location.search.substring(1));
  let commit_id = search_params.get("commit_id");
  let commits_list_dict = JSON.parse(
    localStorage.getItem("merge_request_commits")
  );
  if (commits_list_dict["merge_request_id"] != merge_request_id) {
    localStorage.setItem("merge_request_commits", null);
    return;
  }
  let commit_ids = commits_list_dict["commit_ids"];
  let commit_index = commit_ids.indexOf(commit_id);
  if (commit_index < 0) return;

  var commit = null;
  switch (e.key) {
    case "W":
      commit = commit_index > 0 ? commit_ids[commit_index - 1] : null;
      break;
    case "E":
      commit =
        commit_index < commit_ids.length - 1
          ? commit_ids[commit_index + 1]
          : null;
      break;
    default:
      break;
  }

  if (commit != null) {
    search_params.set("commit_id", commit);
    window.open(
      window.location.pathname + "?" + search_params.toString(),
      "_self"
    );
  }
});

/**

Edit merge commit message

*/
Mousetrap.bind("ctrl+m", function (e) {
  let edit_commit_message = document.querySelector(
    "input[data-testid=widget_edit_commit_message]"
  );

  if (currentUrlMatches(mergeRequestRegex) && edit_commit_message != null) {
    edit_commit_message.click();
    document.querySelector("#squash-message-edit").focus();
  }
});

/**

Finish review

*/
Mousetrap.bind(["ctrl+meta+s"], function (e) {
  let btn_finish_review = document.querySelector(
    "div[data-qa-selector='submit_review_dropdown'] button"
  );
  if (currentUrlMatches(mergeRequestRegex) && btn_finish_review) {
    if (confirm("Finish review?")) {
      btn_finish_review.click();
      document
        .querySelector("button[data-qa-selector='submit_review_button']")
        .click();
    }
  }
});

/**

Goto line in file view
*/
Mousetrap.bind("l", function (e) {
  let file_holder = document.querySelector("div.file-content.code div div div");
  if (file_holder != null && currentUrlMatches(repoRegex + "/-/blob/")) {
    let lines = document.querySelectorAll("div.line-numbers a");
    var line_no = parseInt(prompt(`goto line [1:${lines.length}]`));
    if (isNaN(line_no)) {
      alert("invalid input");
    } else {
      clickElement(`#L${line_no}`);
    }
  }
});

/**

Navigate to previous and next page
*/
Mousetrap.bind(["p", "n"], function (e) {
  let btn_group = document.querySelectorAll("div.gl-keyset-pagination button");
  let page_link_prev = btn_group[0];
  let page_link_next = btn_group[1];
  if (!page_link_prev.disabled && e.key == "p") {
    page_link_prev.click();
  }
  if (!page_link_next.disabled && e.key == "n") {
    page_link_next.click();
  }
});

Mousetrap.bind(["ctrl+p"], function (e) {
  console.log(currentUrlMatches(repoRegex));
  if (currentUrlMatches(repoRegex) && e.ctrlKey) {
    window.open(repoUrl[0] + "/-/pipelines", "_self");
  }
});

var shortcuts = [
  ["<b>Issue page</b>", ""],
  ["Edit Weight", "ctrl+w"],
  ["Edit Epic", "shift+e"],
  ["Edit Iteration", "ctrl+i"],
  ["<b>Pages with tabs</b>", ""],
  ["Switch tab", "shift+[tab number]"],
  ["<b>List views page</b>", ""],
  ["Edit bulk", "ctrl+shift+e"],
  ["Focus recent searches", "r"],
  ["Select <code>prev/next</code> list item", "k/j"],
  ["Open selected list item in <code>same/new</code> tab", "o/shift+o"],
  ["Goto (p)rev/(n)ext page", "p/n"],
  ["<b>Merge requests</b>", ""],
  ["Edit merge commit message", "ctrl+m"],
  ["Navigate to <code>prev/next</code> commit", "shift+w/shift+e"],
  ["Submit review", "ctrl+meta+s"],
  ["Edit milestone", "m"],
  ["<b>File viewer</b>", ""],
  ["Goto line", "l"],
  ["<b>Any page in repo</b>", ""],
  ["Goto CI/CD pipelines", "ctrl+p"],
];

var helpContent = create_shortcut_help(shortcuts);

/**
 * Show shortcuts
 */
Mousetrap.bind("shift+h", function () {
  picoModal(helpContent).show();
});
