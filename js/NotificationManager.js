const NotificationManager = {
    show: async (id, options, callback) => {
        return new Promise(resolve => {
            chrome.notifications.create(id, options, id => {
                if (isdef(callback)) {
                    _listenNotificationClick(id, callback);
                }
                resolve();
            });
        });
    }
};

function _listenNotificationClick(id, callback) {
    chrome.notifications.onClicked.addListener(idClicked => {
        if (idClicked === id) {
            callback();
        }
    });
}
