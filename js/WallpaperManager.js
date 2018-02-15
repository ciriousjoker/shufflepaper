// Load a new wallpaper
function loadNextWallpaper() {
  getRoot(function (rootDir) {
    // Check how many files there are in the folder
    readFolderFileCount(rootDir, function (fileCount) {
      // Read the current id
      prefs.get(Constants.Key.current_file_id, function (_currentId) {
        // Calls itself until a valid wallpaper is found
        (function retry(retries, delay, currentId) {
          delay = delay || 1000;
          // Pick a new id to use as a wallpaper
          getNextId(currentId, fileCount, function (nextId) {
            setWallpaper(rootDir, nextId, function (id) {
              if (retries > 0) {
                setTimeout(function () {
                  retry(--retries, delay, id);
                }, delay);
              }
            });
          });
        })(fileCount, Constants.Defaults.Wallpaper.retry_delay, _currentId);
      },
        // optional flag to return even if the result would be "undefined"
        true);
    });
  });
}

function setWallpaper(rootDir, nextId, callbackFailure) {
  readFolder(rootDir, function (fileEntry, number) {
    if (number == nextId) {
      // Read the file as an arraybuffer
      readFileAsArrayBuffer(fileEntry, function (buf) {
        var regCheckFileExtension = Constants.Defaults.Wallpaper.file_extensions;
        if (regCheckFileExtension.test(fileEntry.name) && isdef(buf)) {
          // Get the layout mode
          prefs.get(Constants.Key.layout_mode, function (mode) {
            var layout_mode = Constants.Defaults.Wallpaper.layout;
            if (isdef(mode)) {
              layout_mode = mode;
            }

            // Set the arraybuffer as a wallpaper
            console.log("New wallpaper(" + Constants.Defaults.Wallpaper.layout_mode[layout_mode] + "): " + fileEntry.name);
            chrome.wallpaper.setWallpaper({
              'data': buf.target.result,
              'filename': fileEntry.name,
              'layout': Constants.Defaults.Wallpaper.layout_mode[layout_mode]
            }, function () {
              // Store the new current_id as a SharedPreference
              prefs.set(Constants.Key.current_file_id, nextId);
              prefs.apply();
            });

          },
            // optional flag to return even if the result would be "undefined"
            true);
        } else {
          prefs.set(Constants.Key.current_file_id, nextId);
          prefs.apply();
          // Current file wasn't a valid image, let's try again
          callbackFailure(nextId);
        }
      }, function () {
        prefs.set(Constants.Key.current_file_id, nextId);
        prefs.apply();
        // Current file wasn't a valid image, let's try again
        callbackFailure(nextId);
      });
    }
  });
}

// Pick the next file id based on the user's preferences
function getNextId(currentId, filecount, callback) {
  prefs.get(Constants.Key.choose_random, function (is_random) {
    if (isdef(is_random) && is_random === true) {
      callback(randomMinMax(0, filecount - 1));
    } else {
      if (!isdef(currentId)) {
        callback(0);
      } else {
        var newId = currentId + 1;
        if (newId > (filecount - 1)) {
          newId -= filecount;
        }
        callback(newId);
      }
    }
  },
    // optional flag to return even if the result would be "undefined"
    true);
}

// Returns an ArrayBuffer with the file's content
function readFileAsArrayBuffer(fileEntry, callback, errcallback) {
  if (fileEntry.isFile) {
    fileEntry.file(function (file) {
      var fileReader = new FileReader();
      fileReader.onloadend = function (arybf) {
        callback(arybf);
      };
      fileReader.readAsArrayBuffer(file);
    });
  } else {
    errcallback();
  }
}

// Returns the file count of the folder
function readFolderFileCount(dir, callback) {
  if (dir && dir.isDirectory) {
    var reader = dir.createReader();
    var handlefile = function (entries) {
      callback(entries.length);
    };
    var handleerror = function () {
      console.log("Error while reading the directory file count.");
    };
    reader.readEntries(handlefile, handleerror);
  }
}

// Call the callback for every file in the folder
function readFolder(dir, callback) {
  if (dir && dir.isDirectory) {
    var reader = dir.createReader();
    var handlefile = function (entries) {
      for (var i = 0; i < entries.length; i++) {
        (function (number) {
          callback(entries[i], number);
        })(i);
      }
    };

    var handleerror = function () {
      console.log("Error while reading the directory content.");
    };
    reader.readEntries(handlefile, handleerror);
  }
}