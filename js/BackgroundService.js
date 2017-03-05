chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    '../MainActivity.html',
    {
      id: 'shufflepaper_mainActivity',
      bounds: {
        width: 630,
        height: 350
      },
      innerBounds: {
        minWidth: 600,
        minHeight: 350
      },
      frame: {
        type: "chrome",
        color: "#323232"
      }
    }
  );
});

chrome.alarms.onAlarm.addListener(function( alarm ) {
  console.log("Changing wallpaper!", alarm);
  loadNextWallpaper();
});