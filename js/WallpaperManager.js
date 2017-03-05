// Load a new wallpaper
function loadNextWallpaper() {
  getRoot(function(rootDir) {
    // Pick a new id to use as a wallpaper
      prefs.get(Key.current_file_id, function(_currentId) {
        readFolderFileCount(rootDir, function(numbertotal) {
          getNextId(_currentId, numbertotal, function(nextId) {
            readFolder(rootDir, function(fileEntry, number) {
              if(number == nextId) {
                // Read the file as an arraybuffer
                readFileAsArrayBuffer(fileEntry, function(buf) {
                  var regCheckFileExtension = new RegExp('(.jpg|.jpeg|.jfif|.png)', 'i');
                  if(regCheckFileExtension.test(fileEntry.name) && isdef(buf)) {
                    // Set the arraybuffer as a wallpaper
                    console.log("New wallpaper: " + fileEntry.name);
                    chrome.wallpaper.setWallpaper(
                    {
                      'data': buf.target.result,
                      'filename': fileEntry.name,
                      'layout': 'CENTER_CROPPED'
                    }, function() {
                      // Store the new current_id as a SharedPreference
                      prefs.set(Key.current_file_id, nextId);
                      prefs.apply();
                    }); 
                  } else {
                    // Store the new current_id as a SharedPreference so that it doesn't try the same file over and over
                    prefs.set(Key.current_file_id, nextId);
                    prefs.apply();
                  }
                }); 
              }
            });
          });
        });
      },
      // optional flag to return even if the result would be "undefined"
      true);
  });
}

// Pick the next file id based on the user's preferences
function getNextId(currentId, filecount, callback) {
  prefs.get(Key.choose_random, function(is_random) {
    if(isdef(is_random) && is_random === true) {
      callback(randomMinMax(0, filecount - 1));
    } else {
      if(!isdef(currentId)) {
        callback(0);
      } else {
        var newId = currentId + 1;
        if(newId > (filecount -1)) {
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
function readFileAsArrayBuffer(fileEntry, callback) {
  if(fileEntry.isFile) {
    fileEntry.file(function(file) {
      var fileReader = new FileReader();
      fileReader.onloadend = function(arybf) {
        callback(arybf);
      };
      fileReader.readAsArrayBuffer(file);
    });
  } else {
    callback();
  }
}

// Returns the file count of the folder
function readFolderFileCount(dir, callback) {
  if (dir && dir.isDirectory) {
    var reader = dir.createReader();
    var handlefile = function (entries) {
      callback(entries.length);
    };
    var handleerror = function() {
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
        (function(number) {
          callback(entries[i], number);
        })(i);
      }
    };
    
    var handleerror = function() {
      console.log("Error while reading the directory content.");
    };
    reader.readEntries(handlefile, handleerror);
  }
}