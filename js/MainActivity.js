window.onload = function() {
  loadDirPath();
};

function callbackCreator() {
    var functionToCall = arguments[0];
    var argumentsOfFunctionToCall = Array.prototype.slice.apply(arguments, [1]);
    return function () {
        var argumentsOfCallback = Array.prototype.slice.apply(arguments, [0]);
        functionToCall.apply(this, argumentsOfFunctionToCall.concat(argumentsOfCallback));
    };
}

var directory;

$(document).ready(function() {
  // Show the body once it's ready
  $('#body').show();
  
  // Load DirPath on startup
  loadPreferences();
  
  // Button handler for the "Choose a folder" - button
  $('#btn_choose_folder').click(function(e) {
    chrome.fileSystem.chooseEntry( {
      type: 'openDirectory',
      acceptsAllTypes: true
    }, function(entry, fileentries) {
      if(entry.isDirectory) {
        // Directory was selected, store the key (to retain it) and the 
        prefs.set(Key.dir_id, chrome.fileSystem.retainEntry(entry));
        prefs.apply();
        loadDirPath();
      }
    });
  });
  
  // Button handler for the refresh-button
  $('#btn_refresh').click(function(e) {
    loadNextWallpaper();
  });
  
  // Handler for the "random mode" - switch
  $('#cb_choose_random_checkbox').change(function() {
    console.log(this.checked);
    prefs.set(Key.choose_random, this.checked);
    prefs.apply();
  });
  
  // Handler for the "interval mode" - switch
  $('#cb_use_interval_checkbox').change(function() {
    console.log(this.checked);
    prefs.set(Key.use_interval, this.checked);
    prefs.apply();
    
    if(!this.checked) {
      AlarmManager.clear(AlarmManager.ID.Wallpaper);
    } else {
      AlarmManager.set(AlarmManager.ID.Wallpaper, AlarmManager.INTERVAL.Wallpaper);
    }
  });
});

// Functions to load preferences
function loadPreferences() {
  // Load the random mode checkbox
  prefs.get(Key.choose_random, function(result) {
    console.log("Random mode: " + result);
    if(result === true) {
      $('#cb_choose_random')[0].MaterialSwitch.on();
    }
  });
  
  // Load the interval checkbox
  prefs.get(Key.use_interval, function(result) {
    console.log("Interval mode: " + result);
    if(result === true) {
      $('#cb_use_interval')[0].MaterialSwitch.on();
    }
  });
}

// Functions to store specific preferences
function loadDirPath() {
  getRoot(function(rootDir) {
    if(!isdef(rootDir)) {
      $('#tv_chosen_folder').html("Please speficy a folder <i class=\"material-icons\">keyboard_arrow_right</i>");
      $('#tv_chosen_folder').fadeIn();
    } else {
      getFormattedPath(rootDir, function(path) {
        $('#tv_chosen_folder').html(path);
        $('#tv_chosen_folder').fadeIn();
      });
    }
  },
  // flag to return even if the result would be 'undefined'
  true);
}