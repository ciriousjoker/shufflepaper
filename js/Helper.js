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