// ==UserScript==
// @name         inbox.google.com shortcuts
// @namespace    https://github.com/bokchan
// @description  Shortcuts for inbox.google.com
// @copyright    2018, Andreas Bok Andersen
// @author       Andreas Bok Andersen
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @include      https://inbox.google.com/*
// @match        https://inbox.google.com/*
// @downloadURL  https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/inbox.google-shortcuts.user.js
// @updateURL    https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/inbox.google-shortcuts.user.js
// @homepageURL  https://github.com/bokchan/tampermonkey-scripts
// @supportURL   https://github.com/bokchan/tampermonkey-scripts/wiki
// @version      0.0.1
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/picomodal/3.0.0/picoModal.min.js
// @require      https://raw.githubusercontent.com/bokchan/tampermonkey-scripts/master/scripts/bokchan.shortcuts.util.js
// ==/UserScript==

/**
 * @brief Maybe not use this as updateURL
 * @updateURL    https://openuserjs.org/meta/bok_chan/inbox.google-shortcuts.meta.js
 */

/**
 * Goto reminders
 */
Mousetrap.bind('shift+r', function() {
    window.location.href = 'https://inbox.google.com/reminders?pli=1';
});


/**
 * @brief Open Google contacts in new tab
 */
Mousetrap.bind('shift+c', function() {
    var contacts = window.open('https://contacts.google.com/', '_blank');
    contacts.focus();
});


/**
 * @brief Show all mails
 */
Mousetrap.bind('a', function() {
    window.location.href = 'https://inbox.google.com/search/label%3Aall?pli=1';
});


/**
 * @brief Show category social
 */
Mousetrap.bind('s', function() {
    window.location.href = 'https://inbox.google.com/cluster/%23%5Esmartlabel_social?pli=1';
});


/**
 * @brief Show category promos
 */
Mousetrap.bind('p', function() {
    window.location.href = 'https://inbox.google.com/cluster/%23%5Esmartlabel_promo?pli=1';
});


/**
 * @brief Show category forums
 */
Mousetrap.bind('shift+g', function() {
    window.location.href = 'https://inbox.google.com/cluster/%23%5Esmartlabel_group?pli=1';
});


/**
 * @brief Show category updates
 */
Mousetrap.bind('shift+u', function() {
    window.location.href = 'https://inbox.google.com/cluster/%23%5Esmartlabel_pure_notif?pli=1';
});

var shortcuts = [
['Goto reminders', 'shift+r'],
['Open Google contacts in new tab', 'shift+c'],
['Show all mails', 'a'],
['Show category social', 's'],
['Show category promos', 'p'],
['Show category forums', 'shift+g'],
['Show category updates', 'shift+u'],
];

var help_content = create_shortcut_help(shortcuts);

Mousetrap.bind('shift+i', function(){
    picoModal(help_content).show();
});
