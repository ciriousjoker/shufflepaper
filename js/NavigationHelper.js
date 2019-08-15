const NAVIGATION__PREFIX_PAGE = "page_";
const NAVIGATION__CLASS_FADE_IN = "fade-in-bottom";
const NAVIGATION__CLASS_FADE_OUT = "fade-out-top";

const NavigationHelper = {
    currentPage: "",
    navigate: async (id, fresh) => {
        if (id == NavigationHelper.currentPage) {
            _closeDrawer();
            return;
        }

        const currentPageBackup = NavigationHelper.currentPage;

        try {
            NavigationHelper.currentPage = id;

            const elemPageEnter = $(`#${NAVIGATION__PREFIX_PAGE}${id}`);
            const pageIds = Object.keys(Constants.Pages);

            _closeDrawer();
            if (!fresh) {
                await _handleSpecialAnimationsBefore(id);

                // Fade out all pages
                for (const pageId of pageIds) {
                    const elemPageLeave = $(`#${NAVIGATION__PREFIX_PAGE}${pageId}`);

                    if (elemPageLeave.hasClass(NAVIGATION__CLASS_FADE_IN)) {
                        elemPageLeave.removeClass(NAVIGATION__CLASS_FADE_IN);
                        elemPageLeave.addClass(NAVIGATION__CLASS_FADE_OUT);
                    }
                }

                // Wait for fade out
                await sleep(600);

                await _handleSpecialAnimationsMiddle(id);
            }

            for (const pageId of pageIds) {
                const elemPageLeave = $(`#${NAVIGATION__PREFIX_PAGE}${pageId}`);
                elemPageLeave.hide();
            }

            elemPageEnter.removeClass(NAVIGATION__CLASS_FADE_OUT);
            elemPageEnter.addClass(NAVIGATION__CLASS_FADE_IN);
            elemPageEnter.show();

            // Wait for entry animation
            await sleep(600);

            await _handleSpecialAnimationsAfter(id);
        } catch (e) {
            NavigationHelper.currentPage = currentPageBackup;
        }
    }
};

async function _handleSpecialAnimationsBefore(to) {
    switch (to) {
        case Constants.Pages.main:
            break;
        case Constants.Pages.about:
            _setAppBarVisible(false);
            break;
    }
}

async function _handleSpecialAnimationsMiddle(to) {
    switch (to) {
        case Constants.Pages.main:
            await _setBackgroundFilled(false);
            break;
        case Constants.Pages.about:
            await _setBackgroundFilled(true);
            break;
    }
}

async function _handleSpecialAnimationsAfter(to) {
    switch (to) {
        case Constants.Pages.main:
            await _setAppBarVisible(true);
            break;
        case Constants.Pages.about:
            break;
    }
}

async function _setBackgroundFilled(filled) {
    $("#background").removeClass("active");
    await sleep(300);
    $("#background").toggleClass("filled", filled);
    $("#background").addClass("active");
    return sleep(300);
}

async function _setAppBarVisible(visible) {
    $(".appbar").toggleClass("appbar--invisible", !visible);
    return sleep(300);
}

async function _closeDrawer() {
    if ($("#NavigationDrawer").hasClass("is-visible")) {
        $(".container__app_bar")[0].MaterialLayout.toggleDrawer();
    }
}
