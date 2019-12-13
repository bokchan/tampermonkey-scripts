// ==UserScript==
// @name         Gitlab custom shortcuts
// @namespace    https://github.com/bokchan
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @author       Andreas Bok Andersen
// @description  Github custom shortcuts
// @date         13.12.2019
// @version      0.0.9
// @match        https://*.gitlab.com/*
// @downloadURL  https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/gitlab.com-shortcuts.user.js
// @homepageURL  https://github.com/bokchan/tampermonkey-scripts
// @supportUrl   https://github.com/bokchan/tampermonkey-scripts/wiki
// @updateURL    https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/gitlab.com-shortcuts.meta.js
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/picomodal/3.0.0/picoModal.min.js
// @require      https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/bokchan.shortcuts.util.js
// ==/UserScript==

const repoRegex = '(https?://gitlab.com/[^/]+/[^/]+)';
const mergeRequestRegex = '(/merge_requests/[0-9]+)'
const mergeRequestListRegex = '/merge_requests(\\?scope=.+)?$'
const repoUrl = window.location.href.match(repoRegex)

/**
 * Util function to check if the redirect url is equal to the current url
 *
 * @param      {string}     urlSuffix  The suffix to the current url to match
 *                          against
 * @return     {boolean}    True if same url, False otherwise.
 */
function isSameUrl (urlSuffix) {
  return window.location.href.match(repoUrl[0] + urlSuffix)
}

function currentUrlMatches (urlRegex) {
  return window.location.href.match(urlRegex)
}

function clickElement (selector) {
  const el = document.querySelector(selector)
  if (el) { el.click() }
}

function handleShortcut (urlRegex, selector) {
  if (currentUrlMatches(urlRegex)) {
    clickElement(selector)
  }
}

function handleShortcutMultiple (urlElementSelectorPairs) {
  for (const pair of urlElementSelectorPairs) {
    if (handleShortcut(pair[0], pair[1])) break
  }
}

/**
 * @brief Switch to 'discussion' tab on merge requests
 */
Mousetrap.bind('shift+1', function () {
  handleShortcutMultiple([
    [mergeRequestRegex, '.notes-tab a'],
    [mergeRequestListRegex, '#state-opened']
  ])
})

/**
 * @brief Switch to the 'commits' tab on merge requests
 */
Mousetrap.bind('shift+2', function () {
  handleShortcutMultiple([
    [mergeRequestRegex, '.commits-tab a'],
    [mergeRequestListRegex, '#state-merged']
  ])
})

/**
 * @brief Switch to the 'pipelines' tab on merge requests
 */
Mousetrap.bind('shift+3', function () {
  handleShortcutMultiple([
    [mergeRequestRegex, '.pipelines-tab a'],
    [mergeRequestListRegex, '#state-closed']
  ])
})

/**
 * @brief Switch to 'changes' tab on merge requests
 */
Mousetrap.bind('shift+4', function () {
  handleShortcutMultiple([
    [mergeRequestRegex, '.diffs-tab a'],
    [mergeRequestListRegex, '#state-all']
  ])
})

/**
 * @brief Sets the focus on the sub search input on the issues and pull requests
 *        listing page
 */
Mousetrap.bind('f', function () {
  var filteredSearch = document.querySelector(
    "input[class='form-control filtered-search']"
  )
  if (filteredSearch != null) {
    filteredSearch.focus()
  }
})

/**
 * @brief Changes to bulk edit mode
 */
Mousetrap.bind('shift+e', function () {
  handleShortcut(repoRegex, '.js-bulk-update-toggle')
})

/**
 * Navigate a list with shortcut keys
 *
 * 'j': select next item
 * 'k': select previous item
 * 'o': open the selected item in a new tab
 *
 * @param {Event} e
 */
Mousetrap.bind(['j', 'k', 'o', 'shift+o'],
  function (e) {
    const contentList = document.querySelector('ul.content-list')

    if (contentList) {
      var selectedItem = null
      var nextSelected = contentList.firstElementChild
      selectedItem = contentList.querySelector('li.selected-item')

      if (selectedItem) {
        switch (e.key) {
          case 'k':
            nextSelected = selectedItem.previousElementSibling != null
              ? selectedItem.previousElementSibling : contentList.lastElementChild
            break
          case 'j':
            nextSelected = selectedItem.nextElementSibling != null
              ? selectedItem.nextElementSibling : contentList.firstElementChild
            break
          case 'o':
          case 'O':
            var target = e.shiftKey ? '_blank' : '_self'
            var link = selectedItem.querySelector('div.issuable-main-info a')
            window.open(link.href, target)
            return
          default:
            break
        }
      }

      if (selectedItem) {
        selectedItem.classList.remove('selected-item')
        selectedItem.classList.remove('active')
      }
      if (nextSelected) {
        nextSelected.classList.add('selected-item')
        nextSelected.classList.add('active')
      }
    }
  }
)

var shortcuts = [
  ['<b>Merge request page</b>', ''],
  ['Discussion', 'shift+1'],
  ['Commits', 'shift+2'],
  ['Pipelines', 'shift+3'],
  ['Changes', 'shift+4'],
  ['<b>Merge request list page</b>', ''],
  ['Opened', 'shift+1'],
  ['Merged', 'shift+2'],
  ['Closed', 'shift+3'],
  ['All', 'shift+4'],
  ['<b>List views page</b>', ''],
  ['Edit bulk', 'shift+e'],
  ['Focus filtered search', 'f'],
  ['Select next list item', 'j'],
  ['Select prev list item', 'k'],
  ['Open selected list item in new tab', 'o']
]

var helpContent = create_shortcut_help(shortcuts)

/**
 * Show shortcuts
 */
Mousetrap.bind('shift+h', function () {
  picoModal(helpContent).show()
})
