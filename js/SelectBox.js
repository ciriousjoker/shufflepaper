var SELECT_FIELD_PREFIX = "select_field_";

//region IntervalMode
var intervalMode = 0;

var optionsIntervalMode = JSON.parse(getString("array_interval_unit"));// ["minutes", "hours", "days"];

function setupSelectIntervalMode(initial_mode) {
  
  var onSelectIntervalMode = ()=> {
    this.button.value = optionsIntervalMode[this.id];
    intervalMode = this.id;
    storeIntervalPreferences();
  };

  var insertPoint = 'select_Interval';
  var numberOfDropdowns = 0;
  
  // Create the button to open the select box
  var button = document.createElement('INPUT');
  button.id = SELECT_FIELD_PREFIX + "IntervalMode";// + numberOfDropdowns; // this is how Material Design associates option/button
  button.setAttribute('class', 'mdl-textfield__input');
  button.setAttribute('readonly', 'true');
  button.setAttribute('style', 'visibility: hidden;');
  
  //button.value = optionsIntervalMode[0];
  document.getElementById(insertPoint).appendChild(button);
  
  
  var ul = document.createElement('UL');
  ul.setAttribute('class', 'mdl-menu menu--top-left mdl-js-menu mdl-js-ripple-effect');
  ul.setAttribute('for', SELECT_FIELD_PREFIX + "IntervalMode");
  for (var index in optionsIntervalMode) {
      // add each item to the list
      var li = document.createElement('LI');
      li.setAttribute('class', 'mdl-menu__item');
      li.innerHTML = optionsIntervalMode[index];
      li.id = index;
      li.button = button;
      li.onclick = onSelectIntervalMode;
      ul.appendChild(li);
  }
  document.getElementById(insertPoint).appendChild(ul);
  numberOfDropdowns++;
}

function loadIntervalMode(id) {
  $("#" + SELECT_FIELD_PREFIX + "IntervalMode").val(optionsIntervalMode[id]);
  $("#" + SELECT_FIELD_PREFIX + "IntervalMode").css('visibility','visible').hide().fadeIn();
}

setupSelectIntervalMode();
//endregion IntervalMode

//region LayoutMode
var layoutMode = 0;

var optionsLayoutMode = JSON.parse(getString("options_layout"));// ["stretched", "centered", "cropped"];

function setupSelectLayoutMode(initial_mode) {
  
  var onSelectLayoutMode = ()=> {
    this.button.value = optionsLayoutMode[this.id];
    layoutMode = this.id;
    storeLayoutPreferences();
  };

  var insertPoint = 'select_Layout';
  var numberOfDropdowns = 0;
  
  // Create the button to open the select box
  var button = document.createElement('INPUT');
  button.id = SELECT_FIELD_PREFIX + "LayoutMode";// + numberOfDropdowns; // this is how Material Design associates option/button
  button.setAttribute('class', 'mdl-textfield__input');
  button.setAttribute('readonly', 'true');
  button.setAttribute('style', 'visibility: hidden;');

  document.getElementById(insertPoint).appendChild(button);
  
  
  var ul = document.createElement('UL');
  ul.setAttribute('class', 'mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect');
  ul.setAttribute('for', SELECT_FIELD_PREFIX + "LayoutMode");
  for (var index in optionsLayoutMode) {
      // add each item to the list
      var li = document.createElement('LI');
      li.setAttribute('class', 'mdl-menu__item');
      li.innerHTML = optionsLayoutMode[index];
      li.id = index;
      li.button = button;
      li.onclick = onSelectLayoutMode;
      ul.appendChild(li);
  }
  document.getElementById(insertPoint).appendChild(ul);
  numberOfDropdowns++;
}

function loadLayoutMode(id) {
  $("#" + SELECT_FIELD_PREFIX + "LayoutMode").val(optionsLayoutMode[id]);
  $("#" + SELECT_FIELD_PREFIX + "LayoutMode").css('visibility','visible').hide().fadeIn();
}

setupSelectLayoutMode();
//endregion LayoutMode