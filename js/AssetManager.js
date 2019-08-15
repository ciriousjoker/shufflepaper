async function getAsset(id, resolution, extension, remote) {
    if (remote) {
        let uri;
        try {
            uri = await _getRemoteAsset(id, resolution);
            await SharedPreferences.set(Constants.Key.cached_profile_picture, uri, "local");
        } catch (e) {
            uri = await SharedPreferences.get(Constants.Key.cached_profile_picture, undefined, "local");
        }

        if (isdef(uri)) {
            return uri;
        }
    }

    return `/assets/${_getAssetFilename(id, resolution, extension)}`;
}

// ## Internal Functions ## //

function _getAssetFilename(id, resolution, extension) {
    const separator = isdef(resolution) ? "_" : "";
    return `${id}${separator}${resolution || ""}.${_getAssetExtension(resolution, extension)}`;
}
function _getAssetExtension(resolution, extension) {
    return isdef(resolution) ? extension || "png" : "svg";
}

async function _getRemoteAsset(id, resolution, extension) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        const url = `${Constants.Defaults.url_server}/assets/${id}/${_getAssetFilename(id, resolution, extension)}`;
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Cache-Control", "max-age=0");
        xhr.responseType = "blob";
        xhr.onload = async e => {
            if (e.target.status !== 200) {
                reject();
                return;
            }
            const obj = window.URL.createObjectURL(e.target.response);
            const uri = await _getDataUriFromBlobOrUrl(obj);

            resolve(uri);
        };
        xhr.onerror = () => {
            reject();
        };
        xhr.send();
    });
}

async function _getDataUriFromBlobOrUrl(blob) {
    return new Promise(resolve => {
        var image = new Image();

        image.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

            canvas.getContext("2d").drawImage(this, 0, 0);

            // Get raw image data
            // callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

            // ... or get as Data URI
            resolve(canvas.toDataURL("image/png"));
        };

        image.src = blob;
    });
}
