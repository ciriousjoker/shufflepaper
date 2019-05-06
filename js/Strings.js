// Replace all the placeholders in the .html with the strings from messages.json
$(document).ready(() => {
    $(".i18n").each(function entry() {
        $(this).html(getString($(this).data("id")));
    });
});

function getString(id, replacement) {
    //console.log(chrome.i18n.getMessage(id, replacement));
    return chrome.i18n.getMessage(id, replacement);
}
