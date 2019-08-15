async function loadNextWallpaper() {
    const rootEntry = await getRoot();

    const folderContent = await readFolderContent(rootEntry);

    const nextId = await _getNextId(folderContent.images.length);

    await _setWallpaper(folderContent.images[nextId]);

    await SharedPreferences.set(Constants.Key.current_file_id, nextId);
}

async function _setWallpaper(fileEntry) {
    return new Promise(async (resolve, reject) => {
        if (!isdef(fileEntry)) {
            reject();
            return;
        }

        const modeId = await SharedPreferences.get(Constants.Key.layout_mode, Constants.Defaults.Wallpaper.layout);

        const layout = Constants.Defaults.Wallpaper.layout_mode[modeId];

        const data = await _readFileAsArrayBuffer(fileEntry);

        const filename = fileEntry.name;
        console.log("New wallpaper(" + layout + "): " + filename);
        chrome.wallpaper.setWallpaper(
            {
                data,
                filename,
                layout
            },
            resolve
        );
    });
}

async function _getNextId(fileCount) {
    return new Promise(async resolve => {
        const isRandom = await SharedPreferences.get(Constants.Key.choose_random, Constants.Defaults.Wallpaper.choose_random);
        if (isRandom) {
            resolve(randomMinMax(0, fileCount - 1));
        } else {
            const currentId = await SharedPreferences.get(Constants.Key.current_file_id);
            if (isdef(currentId)) {
                resolve((currentId + 1) % fileCount);
            } else {
                resolve(0);
            }
        }
    });
}

async function _readFileAsArrayBuffer(fileEntry) {
    return new Promise((resolve, reject) => {
        if (fileEntry.isFile) {
            fileEntry.file(file => {
                const fileReader = new FileReader();
                fileReader.onloadend = buffer => {
                    resolve(buffer.target.result);
                };
                fileReader.readAsArrayBuffer(file);
            });
        } else {
            reject();
        }
    });
}
