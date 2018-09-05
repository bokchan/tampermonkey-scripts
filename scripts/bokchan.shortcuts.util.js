var picoModalScript = document.createElement('script');
picoModalScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/picomodal/3.0.0/picoModal.min.js';
document.head.appendChild(picoModalScript);

var help_content_style = `
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
`

/**
 * @brief Create help modal for a list of shortcuts
 * @details
 *
 * @param shortcuts array of shortcuts
 * @return help content formatted as html
 */
function create_shortcut_help ( shortcuts )
{
var help_content = `
<div>
    <table id=modal_table>
        <thead id=modal_header><tr>
            <td>shortcut</td>
            <td class="modal_divider"></td>
            <td>description</td>
        </tr></thead>
        `;
        shortcuts.forEach(function(e) {
        help_content = help_content.concat(`
        <tr>
            <td><code>` + e[1] + `</code></td>
            <td class="modal_divider"></td>
            <td>` + e[0] + `</td>
        </tr>
        `)
        };
        help_content += `
    </table>
</div>
`

return help_content;
};
