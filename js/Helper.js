function randomMinMax(min, max)
{
  return Math.floor(Math.random()*(max-min+1)+min);
}

function isdef(o) {
  if(typeof o !== 'undefined') {
    return true;
  }
  return false;
}

function getRoot(callback, return_anyway) {
  prefs.get(Key.dir_id, function(result) {
    if(isdef(result)) {
      // Try to load the folder using the key
      chrome.fileSystem.isRestorable(result, function (is_recoverable) {
        if(is_recoverable) {
          chrome.fileSystem.restoreEntry(result, function(rootDir) {
            callback(rootDir);
          });
        }
      });
    } else {
      if(return_anyway) {
        callback();
      }
    }
  },
  // Flag to return even if the result would be 'undefined'
  true);
}

function getFormattedPath(dir, callback) {
  chrome.fileSystem.getDisplayPath(dir, function(path) {
    // eg. /special/drive-[SOME ID]/root/
    var regIsMyDrive = new RegExp('\/special\/drive-\\w*\/root\/');
    
    // eg. /special/drive-[SOME ID]/other/
    var regIsShared = new RegExp('\/special\/drive-\\w*\/other\/');
    
    // eg. /media/removable/My Usb/subfolder
    var regIsExternal = new RegExp('\/media\/removable');
    
    // eg /provided/[SOME ID]:chrome-extension_[SOME ID]_[SOME STORAGE NUMBER]:Persistent::::::::::::::chrome_extension:::::::::::::::[MOUNTED FOLDER NAME]:[SOME ID]/subfolders
    var regIsProvided = new RegExp('\/provided\/.*::::::::::::::chrome_extension:::::::::::::::');
    
    if (regIsMyDrive.test(path)) {
      callback(path.replace(regIsMyDrive, "~/My Drive/"));
    } else if (regIsShared.test(path)) {
      callback(path.replace(regIsShared, "~/Shared/"));
    } else if (regIsExternal.test(path)) {
      callback(path.replace(regIsExternal, "~"));
    } else if (regIsProvided.test(path)) {
      var FormattedStart = path.replace(regIsProvided, "~/");                         // Returns [MOUNTED FOLDER NAME]:[SOME ID]/subfolders
      var StorageName = FormattedStart.substring(0, FormattedStart.lastIndexOf(":")); // Returns [MOUNTED FOLDER NAME]
      var SubPath = FormattedStart.replace(new RegExp('~\/[^\/]*'), "");              // Returns /subfolders
      callback(StorageName + SubPath);
    } else {
      callback(path);
    }
  }); 
}