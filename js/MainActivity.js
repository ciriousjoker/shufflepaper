window.onload = function() {
  loadDirPath();
  insertCopyright();
  
  hideUnloadedItems();
};

document.addEventListener("contextmenu", function(e) {
  //e.preventDefault();
});

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
  $('body').fadeIn();
  
  // Button handler for the "Choose a folder" - button
  $('#btn_choose_folder').click(function(e) {
    chrome.fileSystem.chooseEntry( {
      type: 'openDirectory',
      acceptsAllTypes: true
    }, function(entry, fileentries) {
      if(!chrome.runtime.lastError && entry.isDirectory) {
        // Directory was selected, store the key (to retain it) and the 
        prefs.set(Constants.Key.dir_id, chrome.fileSystem.retainEntry(entry));
        prefs.apply();
        loadDirPath();
      }
    });
  });
  
  // Button handler for the refresh-button
  $("#btn_refresh_wallpaper").click(function (){
    loadNextWallpaper();
    
    // Change the data-id (where the i18n id is stored) and replace it's innerHtml with the new value from messages.json
    $("#btn_refresh_wallpaper_tooltip").data("id", "tooltip_refresh_clicked");
    $("#btn_refresh_wallpaper_tooltip").html(getString($("#btn_refresh_wallpaper_tooltip").data("id")));
    
    function resetTooltip() {
      $("#btn_refresh_wallpaper_tooltip").data("id", "tooltip_refresh");
      $("#btn_refresh_wallpaper_tooltip").html(getString($("#btn_refresh_wallpaper_tooltip").data("id")));
    }
    
    // Reset the tooltip after 1.5 secs
    setTimeout(resetTooltip, 1500);
  });
  
  // Button handler for the share-button
  $("#btn_share_app").click(function (){
    copyTextToClipboard(Constants.Defaults.share_url);
    
    // Change the data-id (where the i18n id is stored) and replace it's innerHtml with the new value from messages.json
    $("#btn_share_app_tooltip").data("id", "tooltip_share_clicked");
    $("#btn_share_app_tooltip").html(getString($("#btn_share_app_tooltip").data("id")));
    
    function resetTooltip() {
      $("#btn_share_app_tooltip").data("id", "tooltip_share");
      $("#btn_share_app_tooltip").html(getString($("#btn_share_app_tooltip").data("id")));
    }
    
    // Reset the tooltip after 1.5 secs
    setTimeout(resetTooltip, 1500);
  });
  
  // Handler for the "random mode" - switch
  $('#cb_choose_random_checkbox').change(function() {
    prefs.set(Constants.Key.choose_random, this.checked);
    prefs.apply();
  });
  
  // Handler for the "interval mode" - switch
  $('#cb_use_interval_checkbox').change(function() {
    storeIntervalPreferences();
  });
  
  // Handler for when the user changes the interval duration
  $('#textfield_Interval').change(function() {
    storeIntervalPreferences();
  });
  
  // Load DirPath on startup
  loadPreferences();
  
  //$('body').fadeIn();
});

// Functions to load preferences
function loadPreferences() {
  // Load the interval
  prefs.get(Constants.Key.interval, function(result) {
    if(isdef(result)) {
      $('#textfield_Interval').val(result);
      $('#textfield_Interval').parent().addClass('is-dirty');
      $('#textfield_Interval').parent()[0].MaterialTextfield.checkValidity();
    }
    $('#textfield_Interval').parent().css('visibility','visible').hide().fadeIn();
  },
  // flag to return even if the result would be 'undefined'
  true);
  
  // Load the interval mode
  prefs.get(Constants.Key.interval_mode, function(result) {
    if(isdef(result)) {
      loadIntervalMode(result);
    } else {
      loadIntervalMode(0);
    }
  },
  // flag to return even if the result would be 'undefined'
  true);
  
  // Load the interval checkbox
  prefs.get(Constants.Key.use_interval, function(result) {
    if(result === true) {
      $('#cb_use_interval')[0].MaterialSwitch.on();
    }
  });
  
  // Load the random mode checkbox
  prefs.get(Constants.Key.choose_random, function(result) {
    if(result === true) {
      $('#cb_choose_random')[0].MaterialSwitch.on();
    }
  });
}

// Functions to store specific preferences
function loadDirPath() {
  getRoot(function(rootDir) {
    if(!isdef(rootDir)) {
      $('#tv_chosen_folder').html(getString("error_no_folder_specified"));
      $('#tv_chosen_folder').fadeIn();
    } else {
      getFormattedPath(rootDir, function(path, isValid) {
        $('#tv_chosen_folder').html(path);
        $('#tv_chosen_folder').fadeIn();
        
        if(!isValid) {
          $('#tv_chosen_folder_tooltip').fadeIn();
        } else {
          $('#tv_chosen_folder_tooltip').fadeOut();
        }
      });
    }
  },
  // flag to return even if the result would be 'undefined'
  true);
}

function storeIntervalPreferences() {
  prefs.set(Constants.Key.use_interval, $('#cb_use_interval_checkbox')[0].checked);
  if($.trim($('#textfield_Interval').val()).length === 0) {
    prefs.set(Constants.Key.interval, AlarmManager.INTERVAL.WALLPAPER_DEFAULT);
  } else if($.trim($('#textfield_Interval').val()) > 0 && $.trim($('#textfield_Interval').val()) < 100) {
    prefs.set(Constants.Key.interval, $('#textfield_Interval')[0].value);
  }
  
  prefs.set(Constants.Key.interval_mode, intervalMode);
  prefs.apply();
  
  if(!$('#cb_use_interval_checkbox')[0].checked) {
    AlarmManager.clear(AlarmManager.ID.WALLPAPER);
  } else {
    startAlarm();
  }
}

function startAlarm() {
  var currentValue;
  if($.trim($('#textfield_Interval').val()).length > 0 && $.trim($('#textfield_Interval').val()) > 0) {
    currentValue = parseInt($.trim($('#textfield_Interval').val()));
  } else {
    currentValue = AlarmManager.INTERVAL.WALLPAPER_DEFAULT;
  }
  
  if(intervalMode >= 1) {
    currentValue *= 60;
  }
  if(intervalMode >= 2) {
    currentValue *= 24;
  }
  AlarmManager.set(AlarmManager.ID.WALLPAPER, currentValue);
}


function hideUnloadedItems() {
  $('#textfield_Interval').parent().css("visibility", "hidden");
}

function insertCopyright() {
  $("#insertCopyright").html(Constants.Defaults.copyright);
}

function copyTextToClipboard(text) {
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  document.body.removeChild(copyFrom);
}



















