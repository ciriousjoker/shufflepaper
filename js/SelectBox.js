const DROPDOWN__PREFIX_SELECTBOXWRAPPER = "selectbox_wrapper_";
const DROPDOWN__PREFIX_SELECTBOX = "selectbox_";
const DROPDOWN__PREFIX_STRING_ARRAY = "array_";

const mapDropdownCallbacks = new Map();

function setDropdownCallback(type, callback) {
    mapDropdownCallbacks.set(type, callback);
}

function clearDropdownCallback(type) {
    mapDropdownCallbacks.delete(type);
}

function setupDropdown(type, indexActive) {
    const arrStrings = JSON.parse(getString(`${DROPDOWN__PREFIX_STRING_ARRAY}${type}`));

    const elemWrapper = document.getElementById(`${DROPDOWN__PREFIX_SELECTBOX}${type}`);
    elemWrapper.innerHTML = "";
    for (const [index, value] of arrStrings.entries()) {
        // add each item to the list
        const elemListItem = document.createElement("li");
        elemListItem.setAttribute("class", "mdl-menu__item");
        elemListItem.dataset.val = index;

        // NOTE: Only one item can have data-selected set to true, the rest must not have the attribute at all
        if (isdef(indexActive) && index == indexActive) {
            elemListItem.dataset.selected = true;
        }
        elemListItem.innerHTML = arrStrings[index];

        $(elemListItem).on("click", function() {
            const selectedValue = this.dataset.val;
            if (mapDropdownCallbacks.has(type)) {
                mapDropdownCallbacks.get(type)(selectedValue);
            }
        });

        elemWrapper.appendChild(elemListItem);
    }

    getmdlSelect.init(`#${DROPDOWN__PREFIX_SELECTBOXWRAPPER}${type}`);

    $(`#${DROPDOWN__PREFIX_SELECTBOX}${type}`)
        .css("visibility", "visible")
        .hide()
        .fadeIn();
}

// Initialize all dropdowns
(() => {
    for (const elemDropdown of $(".getmdl-select")) {
        setupDropdown(elemDropdown.dataset.type);
    }
})();
