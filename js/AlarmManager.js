function ALARM() {}

// Used as an identifier for the alarm used
// to change the wallpaper every x minutes
ALARM.WALLPAPER_INTERVAL = "wallpaper_change_interval";


function AlarmManager() {}

AlarmManager.set = function(id, interval) {
  chrome.alarms.create(id, {
   delayInMinutes: interval,
   periodInMinutes: interval
  });
  console.log("Alarm created.");
};

AlarmManager.clear = function(id) {
  chrome.alarms.clear(id);
};