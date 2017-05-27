function AlarmManager() {}
AlarmManager.ID = function() {};
AlarmManager.INTERVAL = function() {};



// Used as an identifier for the alarm used
// to change the wallpaper every x minutes
AlarmManager.ID.WALLPAPER = "wallpaper_change_interval";
AlarmManager.INTERVAL.WALLPAPER_DEFAULT = 15;


AlarmManager.set = function(id, interval) {
  chrome.alarms.create(id, {
   delayInMinutes: interval,
   periodInMinutes: interval
  });
  console.log("Started the wallpaper service.");
};

AlarmManager.clear = function(id) {
  chrome.alarms.clear(id);
};