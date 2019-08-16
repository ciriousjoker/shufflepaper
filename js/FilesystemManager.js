async function getRoot() {
    return new Promise(async (resolve, reject) => {
        const restoreKey = await SharedPreferences.get(Constants.Key.dir_id);
        if (isdef(restoreKey)) {
            // Try to load the folder using the key
            chrome.fileSystem.isRestorable(restoreKey, isRestorable => {
                if (isRestorable) {
                    chrome.fileSystem.restoreEntry(restoreKey, rootDir => {
                        resolve(rootDir);
                    });
                } else {
                    reject();
                }
            });
        } else {
            reject();
        }
    });
}

async function readFolderContent(entry) {
    return new Promise((resolve, reject) => {
        entry.createReader().readEntries(
            async result => {
                const arrImages = [];
                const arrSkipped = [];

                for (const entry of result) {
                    if (entry.isDirectory) {
                        const contentSubfolder = await readFolderContent(entry);
                        arrImages.push(...contentSubfolder.images);
                        arrSkipped.push(...contentSubfolder.skipped);
                    } else {
                        if (_isAllowedImage(entry)) {
                            arrImages.push(entry);
                        } else {
                            arrSkipped.push(entry);
                        }
                    }
                }

                resolve({
                    images: arrImages,
                    skipped: arrSkipped
                });
            },
            async err => {
                NotificationManager.show(
                    Constants.NotificationIds.error__folder_unreadable,
                    {
                        type: "basic",
                        title: getString("notification_error__folder_unreadable_title"),
                        iconUrl: await getAsset("warning", 48),
                        message: getString("notification_error__folder_unreadable_message"),
                        requireInteraction: true
                    },
                    () => {
                        showMainWindow(Constants.Key.onload_trigger_folder_dialog);
                    }
                );
                console.error("DOMException: ", err);
                reject();
            }
        );
    });
}

function getStringFolderInfo(folderContent) {
    // Number of images and skipped files
    const images = folderContent.images.length;
    const skipped = folderContent.skipped.length;

    // String ids
    const idImages = "info_found_images";
    const idSkipped = "info_skipped_files";

    let stringImages = "";
    switch (images) {
        case 0:
            stringImages = getString(idImages + "_none");
            break;
        case 1:
            stringImages = getString(idImages + "_singular");
            break;
        default:
            stringImages = getString(idImages + "_plural", [images]);
    }

    let ret = stringImages;

    switch (skipped) {
        case 1:
            ret += ` ${getString(idSkipped + "_singular")}`;
            break;
        default:
            ret += ` ${getString(idSkipped + "_plural", [skipped])}`;
            break;
    }

    return ret;
}

function getFormattedPath(dir, callback) {
    // TODO: Create constants for folder prefixes
    chrome.fileSystem.getDisplayPath(dir, path => {
        /// Special folders (@deprecated)
        // MyDrive: /special/drive-[SOME ID]/root/ @deprecated
        const regIsSpecialMyDrive = new RegExp("/special/drive-\\w*/root");

        // Shared files: /special/drive-[SOME ID]/other/ @deprecated
        const regIsSpecialShared = new RegExp("/special/drive-\\w*/other/");

        // MyFiles: ~/MyFiles/subfolder
        const regIsMyFiles = new RegExp("~/MyFiles");

        // Removable: /media/removable/DeviceName/
        const regIsMediaRemovable = new RegExp("/media/removable/");

        // USB Devices: /usb:[SOME ID]/subfolders"
        // NOTE: If the root is selected, there is no / after the id
        const regIsUSB = /\/usb:.*/;

        // MyDrive root: /media/fuse/drivefs-[SOME ID]/root/
        const regIsMediaFuseMyDriveRoot = new RegExp("/media/fuse/drivefs-\\w*/root");

        // MyDrive Devices: /media/fuse/drivefs-[SOME ID]/
        const regIsMediaFuseMyDriveDevices = new RegExp("/media/fuse/drivefs-\\w*/");

        // MyDrive by ID (through "Shared with me"): /media/fuse/drivefs-[SOME ID]/.files-by-id/[SOME ID]/
        const regIsMediaFuseMyDriveByID = new RegExp("/media/fuse/drivefs-\\w*/.files-by-id/\\w*/");

        // Linux: /media/fuse/crostini_[SOME ID]/
        // NOTE: If the root is selected, there is no / after the id
        const regIsMediaFuseLinux = /\/media\/fuse\/crostini_\w*/;

        // Android
        const regIsAndroid = /\/run\/arc\/sdcard\/write\/emulated\/0/;

        // Android Provided Folders: /special/arc-documents-provider/com.android.providers.media.documents/[ROOTNAME]
        // NOTE: [ROOTNAME] can be "audio_root", "images_root" or ""
        const regIsAndroidProvided = /\/special\/arc-documents-provider\/com\.android\.providers\.media\.documents\//;

        // Provided: /provided/[SOME ID]"
        const regIsProvided = new RegExp("/provided/.*");

        // eg /provided/[SOME ID]:[ESCAPED ZIP PATH]:[SOME ID]/subfolders
        // NOTE: If the root is selected, there is no / after the id
        const regIsCompressed = /\/provided\/.*\.zip:\w*/;

        // Results
        let formatted_path;
        let isValid = true;
        let addTilde = false;

        // TODO: Language constants
        if (regIsSpecialMyDrive.test(path)) {
            formatted_path = path.replace(regIsSpecialMyDrive, `${getString("prefix__google_drive")}/`);
        } else if (regIsSpecialShared.test(path)) {
            formatted_path = path.replace(regIsSpecialShared, `${getString("prefix__google_drive_shared")}/`);
        } else if (regIsMyFiles.test(path)) {
            formatted_path = path.replace(regIsMyFiles, getString("prefix__my_files"));
        } else if (regIsMediaRemovable.test(path)) {
            formatted_path = path.replace(regIsMediaRemovable, "");
        } else if (regIsUSB.test(path)) {
            formatted_path = _formatRoot(regIsUSB, path, getString("prefix__usb_device"));
        } else if (regIsMediaFuseMyDriveRoot.test(path)) {
            formatted_path = path.replace(regIsMediaFuseMyDriveRoot, getString("prefix__google_drive"));
        } else if (regIsMediaFuseMyDriveDevices.test(path)) {
            formatted_path = path.replace(regIsMediaFuseMyDriveDevices, `${getString("prefix__google_drive")}/`);
        } else if (regIsMediaFuseMyDriveByID.test(path)) {
            formatted_path = path.replace(regIsMediaFuseMyDriveByID, "");
        } else if (regIsMediaFuseLinux.test(path)) {
            formatted_path = _formatRoot(regIsMediaFuseLinux, path, "Linux");
        } else if (regIsAndroid.test(path)) {
            formatted_path = _formatRoot(regIsAndroid, path, "Android");
        } else if (regIsAndroidProvided.test(path)) {
            const type = path.replace(regIsAndroidProvided, "");
            switch (type) {
                case "audio_root":
                    formatted_path = getString("prefix__android_audio");
                    break;
                case "images_root":
                    formatted_path = getString("prefix__android_images");
                    break;
                case "videos_root":
                    formatted_path = getString("prefix__android_videos");
                    break;
                default:
                    formatted_path = getString("prefix__android_media");
            }
            // formatted_path = formatRoot(regIsAndroidProvided, path, "Android");
        } else if (regIsCompressed.test(path)) {
            var pathWithoutBeginning = path.replace(new RegExp("/provided/[^:]*:"), ""); // Returns [ESCAPED ZIP PATH]:[SOME ID]/subfolders
            var pathToZip = unescape(pathWithoutBeginning.replace(new RegExp(":.*"), "")); // Returns [UNESCAPED ZIP PATH]
            var zipFilename = pathToZip.replace(new RegExp(".*/"), ""); // Returns [ZIP NAME]

            formatted_path = _formatRoot(regIsCompressed, path, zipFilename);
        } else if (regIsProvided.test(path)) {
            formatted_path = _formatRoot(regIsProvided, path, getString("prefix__provided"));
        } else {
            formatted_path = path;
        }

        // Add ~/ to the beginning if suitable
        if (addTilde) {
            formatted_path = "~/" + formatted_path;
        }

        // Replace / with >
        formatted_path = formatted_path.replace(
            /\//g,
            '<i class="material-icons" style="font-size: 18px;">keyboard_arrow_right</i>'
        );

        callback(formatted_path, isValid);
    });
}

function _formatRoot(regex, path, replacement) {
    var regexNonRoot = new RegExp(regex.source + "/.*");
    if (regexNonRoot.test(path)) {
        return path.replace(new RegExp(regex.source + "/"), replacement + "/");
    } else {
        return path.replace(regex, replacement);
    }
}

function _getFileExtension(path) {
    var regFileExtension = /(?:\.([^.]+))?$/;
    return regFileExtension.exec(path)[1];
}

function _isAllowedImage(entry) {
    return entry.isFile && Constants.Defaults.Wallpaper.file_extensions.test(entry.name);
}
