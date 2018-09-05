/**
* @brief Create help modal for a list of shortcuts
* @details
*
* @param shortcuts array of shortcuts
* @return help content formatted as html
*/
function create_shortcut_help(shortcuts) {
    "use strict";
    var help_content_style = '<style type="text/css">#modal_header{font-weight: bold;}.modal_divider{width: 20px;}</style>';

    var help_content = help_content_style.concat('<div><tableid=modal_table><theadid=modal_header><tr><td>shortcut</td><tdclass="modal_divider"></td><td>description</td></tr></thead>');
        shortcuts.forEach(function(e)
        {

        help_content = help_content + '<tr><td><code>' + e[1] + '</code></td>' +
            '<td class="modal_divider"></td>' +
            '<td>' + e[0] + '</td>' +
            '</tr>';

        });
        help_content += '</table></div>';

return help_content;
}
