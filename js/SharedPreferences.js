var prefs = {};

// Cache for the settings
prefs.SharedPreferences = {};

// Load specific preference either from memory or from storage
prefs.get = (name, callback, return_anyway) => {
    prefs.load(() => {
        if (isdef(prefs.SharedPreferences) && isdef(prefs.SharedPreferences[name])) {
            callback(prefs.SharedPreferences[name]);
        } else {
            console.log("Couldn't load: " + name);
            if (return_anyway) {
                callback();
            }
        }
    });
};

// Loads the database in the memory
prefs.load = callback => {
    if (isdef(prefs.SharedPreferences)) {
        chrome.storage.sync.get("shared_prefs", obj => {
            if (!chrome.runtime.lastError) {
                prefs.SharedPreferences = obj.shared_prefs;
                callback();
            }
        });
    } else {
        callback();
    }
};

// Set a specific preference in memory
prefs.set = (name, value) => {
    if (!isdef(prefs.SharedPreferences)) {
        prefs.SharedPreferences = {};
    }
    prefs.SharedPreferences[name] = value;
};

// Apply all the changes made to the in-memory version
prefs.apply = callback => {
    chrome.storage.sync.set({ shared_prefs: prefs.SharedPreferences }, () => {
        console.log("Settings saved");
        if (callback) {
            callback();
        }
    });
};
