var Constants = {
    Key: {
        // File system
        dir_id: "dir_id",
        current_file_id: "current_file_id",

        // Wallpaper preferences
        choose_random: "choose_random",
        use_interval: "use_interval",
        interval: "interval",
        interval_mode: "interval_mode",
        layout_mode: "layout_mode"
    },
    Defaults: {
        Wallpaper: {
            // Wallpaper defaults
            interval_mode: 0,
            retry_delay: 100,
            layout: 2,
            layout_mode: ["STRETCH", "CENTER", "CENTER_CROPPED"],
            file_extensions: new RegExp("(.jpg|.jpeg|.jfif|.png)", "i")
        },

        WindowDimensions: {
            width: 700,
            height: 400,
            min_width: 680,
            min_height: 400
        },

        frame_color: "#D32F2F",
        window_id: "shufflepaper_mainActivity",

        // Other
        copyright:
            chrome.i18n.getMessage("copyright", ["Philipp Bauer", new Date().getFullYear()]) +
            "<br />v" +
            chrome.runtime.getManifest().version,
        share_url: "https://chrome.google.com/webstore/detail/shufflepaper/ghcndibmdbeipgggdddmecagpkllglpj/"
    }
};
