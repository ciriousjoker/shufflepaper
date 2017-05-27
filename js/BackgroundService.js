chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    '../MainActivity.html',
    {
      id: Constants.Defaults.window_id,
      bounds: {
        width: Constants.Defaults.WindowDimensions.width,
        height: Constants.Defaults.WindowDimensions.height
      },
      innerBounds: {
        minWidth: Constants.Defaults.WindowDimensions.min_width,
        minHeight: Constants.Defaults.WindowDimensions.min_height
      },
      frame: {
        type: "chrome",
        color: Constants.Defaults.frame_color
      }
    }
  );
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log("Changing wallpaper!", alarm);
  loadNextWallpaper();
});

// This isn't functional yet, but I'll keep it there in case the commands api will work anytime soon
chrome.commands.onCommand.addListener(function(command) {
   console.log("Command triggered: " + command);

chrome.app.window.create(
'../MainActivity.html'
   );
});