function AlarmManager() {}
AlarmManager.ID = function() {};
AlarmManager.INTERVAL = function() {};



// Used as an identifier for the alarm used
// to change the wallpaper every x minutes
AlarmManager.ID.Wallpaper = "wallpaper_change_interval";
AlarmManager.INTERVAL.Wallpaper = 15;


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