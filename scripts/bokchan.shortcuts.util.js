/**
* @brief Create help modal for a list of shortcuts
* @details
*
* @param shortcuts array of shortcuts
* @return help content formatted as html
*/
function create_shortcut_help(shortcuts) {
  'use strict'
  var helpContentStyle = '<style type="text/css">#modal_header{font-weight: bold;}.modal_divider{width: 20px;}</style>';

  var helpContent = helpContentStyle + '<div style="background=gray"><table id="modal_table"><thead id="modal_header"><tr><td>shortcut</td><td class="modal_divider"></td><td>description</td></tr></thead>';
  shortcuts.forEach(function (e) {
    helpContent = helpContent + '<tr><td><code>' + e[1] + '</code></td>' +
      '<td class="modal_divider"></td>' +
      '<td>' + e[0] + '</td>' +
      '</tr>'
  })

  helpContent += '</table></div>'

  return helpContent
}

/**
 * Sets the caret position in a text input
 *
 * @param      elem      The element
 * @param      caretPos  The length of the current value of elem
 */
function setCaretPosition(elem, caretPos) {
  var range;

  if (elem.createTextRange) {
    range = elem.createTextRange();
    range.move('character', caretPos);
    range.select()
  } else {
    elem.focus()
    if (elem.selectionStart !== undefined) {
      elem.setSelectionRange(caretPos, caretPos);
    }
  }
}
