function randomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isdef(o) {
    if (typeof o !== "undefined") {
        return true;
    }
    return false;
}

function getRoot(callback, return_anyway) {
    prefs.get(
        Constants.Key.dir_id,
        result => {
            if (isdef(result)) {
                // Try to load the folder using the key
                chrome.fileSystem.isRestorable(result, is_recoverable => {
                    if (is_recoverable) {
                        chrome.fileSystem.restoreEntry(result, rootDir => {
                            callback(rootDir);
                        });
                    }
                });
            } else {
                if (return_anyway) {
                    callback();
                }
            }
        },
        // Flag to return even if the result would be 'undefined'
        true
    );
}

function getFormattedPath(dir, callback) {
    // TODO: Create constants for folder prefixes
    chrome.fileSystem.getDisplayPath(dir, path => {
        // eg. /special/drive-[SOME ID]/root/
        var regIsMyDrive = new RegExp("/special/drive-\\w*/root");

        // eg. /special/drive-[SOME ID]/other/
        var regIsShared = new RegExp("/special/drive-\\w*/other/");

        // eg. /media/removable/My Usb/subfolder
        var regIsExternal = new RegExp("/media/removable/");

        // eg /provided/[SOME ID]:chrome-extension_[SOME ID]_[SOME STORAGE NUMBER]:Persistent::::::::::::::chrome_extension:::::::::::::::[MOUNTED FOLDER NAME]:[SOME ID]/subfolders
        var regIsProvided = new RegExp("/provided/.*::::::::::::::chrome_extension:::::::::::::::");

        // eg /provided/[SOME ID]:[ESCAPED ZIP PATH]:[SOME ID]/subfolders
        var regIsCompressed = new RegExp("/provided/.*:");

        // eg ~/Downloads/subfolders
        var regIsDownloads = new RegExp("~/Downloads/");

        var formatted_path;
        var SubPath;
        var isValid = true;

        if (regIsMyDrive.test(path)) {
            formatted_path = path.replace(regIsMyDrive, "My Drive");
        } else if (regIsShared.test(path)) {
            formatted_path = path.replace(regIsShared, "Shared/");
        } else if (regIsExternal.test(path)) {
            formatted_path = path.replace(regIsExternal, "");
        } else if (regIsProvided.test(path)) {
            var FormattedStart = path.replace(regIsProvided, ""); // Returns [MOUNTED FOLDER NAME]:[SOME ID]/subfolders
            var StorageName = FormattedStart.substring(0, FormattedStart.lastIndexOf(":")); // Returns [MOUNTED FOLDER NAME]
            SubPath = FormattedStart.replace(new RegExp("[^/]*"), ""); // Returns /subfolders
            formatted_path = StorageName + SubPath;
        } else if (regIsCompressed.test(path)) {
            var RemovedBeginning = path.replace(new RegExp("/provided/[^:]*:"), ""); // Returns [ESCAPED ZIP PATH]:[SOME ID]/subfolders
            var ZipLocation = unescape(RemovedBeginning.replace(new RegExp(":.*"), "")); // Returns [UNESCAPED ZIP PATH]
            var ZipName = ZipLocation.replace(new RegExp(".*/"), ""); // Returns [ZIP NAME]
            SubPath = path.replace(new RegExp(".*:[^/]*"), ""); // Returns /subfolders
            formatted_path = ZipName + SubPath;
            isValid = false;
        } else if (regIsDownloads.test(path)) {
            formatted_path = path.replace(new RegExp("~/"), "");
        } else {
            formatted_path = path;
        }

        formatted_path = formatted_path.replace(
            /\//g,
            '<i class="material-icons" style="font-size: 18px;">keyboard_arrow_right</i>'
        );
        callback(formatted_path, isValid);
    });
}
