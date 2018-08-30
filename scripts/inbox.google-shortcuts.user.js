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
// @homepageURL  https://github.com/bokchan/tampermonkey-scripts
// @supportURL   https://github.com/bokchan/tampermonkey-scripts/wiki
// @version      0.0.1
// @updateURL    https://openuserjs.org/meta/bok_chan/inbox.google-shortcuts.meta.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js
// ==/UserScript==

/**
 * Goto reminders
 */
key('g+r', function() {
    window.location.href = 'https://inbox.google.com/reminders?pli=1';
});


/**
 * Open google contacts in new tab
 */
key('shift+C', function() {
    var contacts = window.open('https://contacts.google.com/', '_blank');
    contacts.focus();
});
