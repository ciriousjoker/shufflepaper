var AlarmManager = {};
AlarmManager.ID = {};
AlarmManager.INTERVAL = {};

AlarmManager.ID.WALLPAPER = "wallpaper_change_interval";
AlarmManager.INTERVAL.WALLPAPER_DEFAULT = 15;

AlarmManager.set = (id, interval) => {
    chrome.alarms.create(id, {
        delayInMinutes: interval,
        periodInMinutes: interval
    });
    console.log("Started the wallpaper service.");
};

AlarmManager.clear = id => {
    chrome.alarms.clear(id);
};

AlarmManager.toggle = async active => {
    const seconds = await _calculateAlarmInterval();
    if (active) {
        AlarmManager.set(AlarmManager.ID.WALLPAPER, seconds);
    } else {
        AlarmManager.clear(AlarmManager.ID.WALLPAPER);
    }
};

async function _calculateAlarmInterval() {
    return new Promise(async resolve => {
        const interval = await SharedPreferences.get(Constants.Key.interval, Constants.Defaults.Wallpaper.alarm_interval);
        const intervalUnit = await SharedPreferences.get(Constants.Key.delay_unit, Constants.Defaults.Wallpaper.delay_unit);

        let retInterval = interval;

        if (intervalUnit >= 1) {
            retInterval *= 60;
        }
        if (intervalUnit >= 2) {
            retInterval *= 24;
        }

        resolve(retInterval);
    });
}
