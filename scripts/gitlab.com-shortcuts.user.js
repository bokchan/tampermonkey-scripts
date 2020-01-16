// ==UserScript==
// @name         Gitlab custom shortcuts
// @namespace    https://github.com/bokchan
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @author       Andreas Bok Andersen
// @description  Github custom shortcuts
// @date         16.01.2020
// @version      0.0.13
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
const issuePageRegex = '(/issues/[0-9]+)'
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

function switchTab (keyEvent) {
  let tab_index = keyEvent.keyCode - 48 // make the keycode a zero-indexed value
  let tab = document.querySelector(`ul.nav-tabs li:nth-child(${tab_index})`)
  if (tab && tab.classList.contains('active') == false) {
      tab.querySelector('a').click()
  }
}

/**
 * @brief Switch to tab by index
 */
Mousetrap.bind(['shift+1', 'shift+2', 'shift+3', 'shift+4'], function(e){
  switchTab(e)
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
 * @brief Toggle the recent searches dropdown
 */
Mousetrap.bind('shift+r', function(){
  clickElement('.filtered-search-history-dropdown-toggle-button')
})

/**
 * @brief Edit weight on issues
 */
Mousetrap.bind('w', function(){
  if (currentUrlMatches(issuePageRegex)) {
    clickElement('a.js-weight-edit-link')
  }
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
  ['<b>Issue page</b>', ''],
  ['Edit weight', 'w'],
  ['<b>Pages with tabs</b>', ''],
  ['Switch tab', 'shift+[tab number]'],
  ['<b>List views page</b>', ''],
  ['Edit bulk', 'shift+e'],
  ['Focus recent searches', 'shift+r'],
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
