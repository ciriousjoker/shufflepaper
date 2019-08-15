$(document).ready(() => {
    loadDirPath();

    loadDynamicUI();
    setupNavigation();

    handleLoadParameters();

    setupOnClickHandlers();

    $("body").fadeIn();

    loadPreferences();
});

function setupNavigation() {
    $(".link").each(function() {
        $(this).on("click", () => {
            NavigationHelper.navigate($(this).data("page"));
        });
    });
    NavigationHelper.navigate(Constants.Pages.default, true);
}

async function loadDynamicUI() {
    // Load all general strings
    $(".i18n").each(function() {
        $(this).html(getString($(this).data("id")));
    });

    // Version number in about page
    $("#placeholderInsertVersion").html(`v${chrome.runtime.getManifest().version}`);

    // Profile picture in about page
    const url = await getAsset("profilepicture", 96, "png", true);
    $(".profile_picture_img").attr("src", `${url}`);
}

function handleLoadParameters() {
    const loadFunction = window[Constants.Key.parameter_function];
    if (isdef(window[loadFunction])) {
        window[loadFunction]();
    }
}

function onClickChooseFolder() {
    chrome.fileSystem.chooseEntry(
        {
            type: "openDirectory",
            acceptsAllTypes: true
        },
        async (entry, _entries) => {
            if (!chrome.runtime.lastError && entry.isDirectory) {
                await SharedPreferences.set(Constants.Key.dir_id, chrome.fileSystem.retainEntry(entry));
                loadDirPath();
            }
        }
    );
}

// #region [Red] OnClick
async function onClickRefreshWallpaper() {
    if ((await SharedPreferences.get(Constants.Key.dir_id)) == undefined) {
        showSnackbar(getString("snackbar_no_folder_selected_message"), getString("snackbar_no_folder_selected_action"), () => {
            onClickChooseFolder();
        });
        return;
    }
    loadNextWallpaper();
}

function onClickShareApp() {
    showSnackbar(
        getString("snackbar_shared_message"),
        getString("snackbar_shared_action"),
        () => {
            window.open(Constants.Defaults.url_homepage);
        },
        4000
    );
    copyTextToClipboard(Constants.Defaults.url_homepage);
}

async function onClickDonate(event) {
    const url = `${Constants.Defaults.url_paypal}/${event.target.dataset.amount}`;
    window.open(url, "blank");

    NotificationManager.show("donation_thanks", {
        type: "basic",
        title: getString("notification_donation_thanks_title"),
        message: getString("notification_donation_thanks_message"),
        iconUrl: await getAsset("profilepicture", 48, "png", true)
    });
}

async function onClickReview() {
    window.open(Constants.Defaults.url_reviews, "blank");
}

async function onClickDelayUnit(value) {
    await SharedPreferences.set(Constants.Key.delay_unit, value);
    console.log("Selected unit id: ", value);
    storeAlarmPreferences();
}

async function onClickLayoutMode(value) {
    console.log("Selected layout mode: ", value);
    await SharedPreferences.set(Constants.Key.layout_mode, value);
}

function setupOnClickHandlers() {
    // Dropdowns
    setDropdownCallback(Constants.Key.dropdown_delay_unit, onClickDelayUnit);
    setDropdownCallback(Constants.Key.dropdown_layout_mode, onClickLayoutMode);

    // Buttons
    $("#btn_choose_folder").on("click", e => {
        onClickChooseFolder();
    });

    $("#btn_refresh_wallpaper").on("click", () => {
        onClickRefreshWallpaper();
    });

    $("#btn_share_app").on("click", () => {
        onClickShareApp();
    });

    $("#btn_share_app_about").on("click", () => {
        onClickShareApp();
    });

    $(".btn_donate").on("click", element => {
        onClickDonate(element);
    });

    $(".fab__review").on("click", () => {
        onClickReview();
    });

    $("#cb_choose_random_checkbox").on("change", () => {
        storePreferences();
    });

    $("#cb_use_interval_checkbox").on("change", e => {
        storePreferences();
        storeAlarmPreferences();
    });

    $("#textfield_interval").on("change", () => {
        storePreferences();
    });
}
// #endregion OnClick

// Functions to load preferences
async function loadDelayTime() {
    const interval = await SharedPreferences.get(Constants.Key.interval);
    if (isdef(interval)) {
        $("#textfield_interval").val(interval);
        $("#textfield_interval")
            .parent()
            .addClass("is-dirty");
    }
}

async function loadDelayUnit() {
    const delayUnit = await SharedPreferences.get(Constants.Key.delay_unit, Constants.Defaults.Wallpaper.delay_unit);
    setupDropdown(Constants.Key.dropdown_delay_unit, delayUnit);
}

async function loadLayoutMode() {
    const layoutMode = await SharedPreferences.get(Constants.Key.layout_mode, Constants.Defaults.Wallpaper.layout);
    setupDropdown(Constants.Key.dropdown_layout_mode, layoutMode);
}

async function loadPreferences() {
    loadDelayTime();

    $("#textfield_interval")
        .parent()
        .css("visibility", "visible")
        .hide()
        .fadeIn();

    loadDelayUnit();
    loadLayoutMode();

    // Load the interval checkbox
    const isAlarmEnabled = await SharedPreferences.get(Constants.Key.use_interval, Constants.Defaults.Wallpaper.use_interval);
    if (isAlarmEnabled === true) {
        $("#cb_use_interval")[0].MaterialSwitch.on();
    }

    // Load the random mode checkbox
    const isRandom = await SharedPreferences.get(Constants.Key.choose_random, Constants.Defaults.Wallpaper.choose_random);
    if (isRandom === true) {
        $("#cb_choose_random")[0].MaterialSwitch.on();
    }
}

async function loadDirPath() {
    try {
        const rootDir = await getRoot();

        getFormattedPath(rootDir, (path, isValid) => {
            $("#tv_chosen_folder").html(path);
            $("#tv_chosen_folder").fadeIn();

            if (!isValid) {
                $("#tv_chosen_folder_tooltip").fadeIn();
            } else {
                $("#tv_chosen_folder_tooltip").fadeOut();
            }
        });

        try {
            const folderContent = await readFolderContent(rootDir);
            console.log("Folder content: ", folderContent);

            const infoString = getStringFolderInfo(folderContent);

            $("#tv_info_folder_content").html(infoString);
        } catch (e) {
            $("#tv_chosen_folder").html(getString("placeholder_no_folder_specified"));
            $("#tv_chosen_folder").fadeIn();
        }
    } catch (e) {
        $("#tv_chosen_folder").html(getString("placeholder_no_folder_specified"));
        $("#tv_chosen_folder").fadeIn();
    }
}

async function storePreferences() {
    // Parse interval
    const inputInterval = parseInt($.trim($("#textfield_interval").val()) || Constants.Defaults.Wallpaper.alarm_interval, 10);
    console.log("Interval: ", inputInterval);

    // Store interval
    if (inputInterval > 0 && inputInterval < 100) {
        await SharedPreferences.set(Constants.Key.interval, inputInterval);
    } else {
        console.log("Invalid delay wasn't saved.");
    }

    const prefRandom = $("#cb_choose_random_checkbox")[0].checked;
    await SharedPreferences.set(Constants.Key.choose_random, prefRandom);
}

async function storeAlarmPreferences() {
    const isAlarmEnabled = $("#cb_use_interval_checkbox")[0].checked;
    AlarmManager.toggle(isAlarmEnabled);
}

function storeLayoutPreferences() {
    console.log("Saved layout mode: ", layoutMode);
    SharedPreferences.set(Constants.Key.layout_mode, layoutMode);
}

function hideUnloadedItems() {
    $("#textfield_interval")
        .parent()
        .css("visibility", "hidden");
}

function copyTextToClipboard(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand("copy");
    document.body.removeChild(copyFrom);
}
