async function showSnackbar(message, actionText, actionHandler, duration, backgroundColor) {
    const elemSnackbar = $("#snackbar").get(0);
    elemSnackbar.style.backgroundColor = backgroundColor;

    var data = {
        message,
        actionText
    };

    if (isdef(duration) || isdef(actionText)) {
        data.timeout = duration || 2000;
    }

    const timeoutResetBackground = setTimeout(() => {
        elemSnackbar.style.backgroundColor = "";
    }, data.timeout + 500);

    if (isdef(actionText)) {
        data.actionHandler = () => {
            clearTimeout(timeoutResetBackground);
            elemSnackbar.style.backgroundColor = "";
            $(elemSnackbar).removeClass("mdl-snackbar--active");
            actionHandler();
        };
    }

    elemSnackbar.MaterialSnackbar.showSnackbar(data);
}
