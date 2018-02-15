function Constants() {}
Constants.Key = function() {};
Constants.Defaults = function() {};
Constants.Defaults.WindowDimensions = function() {};
Constants.Defaults.Wallpaper = function() {};

// File system
Constants.Key.dir_id = "dir_id";
Constants.Key.current_file_id = "current_file_id";

// Wallpaper preferences
Constants.Key.choose_random = "choose_random";
Constants.Key.use_interval  = "use_interval";
Constants.Key.interval      = "interval";
Constants.Key.interval_mode = "interval_mode";
Constants.Key.layout_mode = "layout_mode";

// Other
Constants.Defaults.copyright  = chrome.i18n.getMessage("copyright", ["Philipp Bauer", new Date().getFullYear()]) + "<br />v" + chrome.runtime.getManifest().version;
Constants.Defaults.share_url  = "https://chrome.google.com/webstore/detail/shufflepaper/ghcndibmdbeipgggdddmecagpkllglpj/"; // + chrome.runtime.id + "/"; // chrome.runtime.id seems to return a false value, hence it's hardcoded here

// Wallpaper defaults
Constants.Defaults.Wallpaper.interval_mode    = 0;
Constants.Defaults.Wallpaper.retry_delay      = 100;
Constants.Defaults.Wallpaper.layout           = 2;
Constants.Defaults.Wallpaper.layout_mode      = ["STRETCH", "CENTER", "CENTER_CROPPED"];
Constants.Defaults.Wallpaper.file_extensions  = new RegExp('(.jpg|.jpeg|.jfif|.png)', 'i');

// Window preferences
Constants.Defaults.frame_color  = "#D32F2F";
Constants.Defaults.window_id    = "shufflepaper_mainActivity";
Constants.Defaults.WindowDimensions.width       = 700;
Constants.Defaults.WindowDimensions.height      = 400;
Constants.Defaults.WindowDimensions.min_width   = 680;
Constants.Defaults.WindowDimensions.min_height  = 400;