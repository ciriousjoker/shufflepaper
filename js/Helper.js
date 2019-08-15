function randomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isdef(o) {
    if (typeof o !== "undefined") {
        return true;
    }
    return false;
}

function compareVersion(v1, v2) {
    if (typeof v1 !== "string") return false;
    if (typeof v2 !== "string") return false;
    v1 = v1.split(".");
    v2 = v2.split(".");
    const k = Math.min(v1.length, v2.length);
    for (let i = 0; i < k; ++i) {
        v1[i] = parseInt(v1[i], 10);
        v2[i] = parseInt(v2[i], 10);
        if (v1[i] > v2[i]) return 1;
        if (v1[i] < v2[i]) return -1;
    }
    return v1.length == v2.length ? 0 : v1.length < v2.length ? -1 : 1;
}

function isVersionJump(version, currentVersion, previousVersion) {
    return compareVersion(previousVersion, currentVersion) == -1 && compareVersion(version, currentVersion) >= 0;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getString(id, replacement) {
    return chrome.i18n.getMessage(id, replacement);
}
