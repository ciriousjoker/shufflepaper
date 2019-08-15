const SharedPreferences = {};

SharedPreferences.loadPreferences = async (type) => {
    return new Promise((resolve, reject) => {
        chrome.storage[type || 'sync'].get("shared_prefs", obj => {
            if (!chrome.runtime.lastError) {
                resolve(obj.shared_prefs || {});
            } else {
                reject();
            }
        });
    });
};

SharedPreferences.clearPreferences = async (type) => {
    return new Promise(resolve => {
        chrome.storage[type || 'sync'].set({ shared_prefs: {} }, () => {
            console.log("Settings cleared.");
            resolve();
        });
    });
};

SharedPreferences.get = async (id, defaultValue, type) => {
    return new Promise(async resolve => {
        const prefs = await SharedPreferences.loadPreferences(type);
        const ret = prefs[id];
        if (isdef(ret)) {
            resolve(ret);
        } else {
            resolve(defaultValue);
        }
    });
};

SharedPreferences.set = async (id, value, type) => {
    return new Promise(async resolve => {
        const prefs = await SharedPreferences.loadPreferences(type);
        prefs[id] = value;

        chrome.storage[type || 'sync'].set({ shared_prefs: prefs }, () => {
            console.log("Settings saved.");
            resolve();
        });
    });
};
