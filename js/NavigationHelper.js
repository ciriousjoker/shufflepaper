$(document).ready(function() {
  
  // Open general settings
  $('#link_to_general_settings').click(function(e) {
    $('#page_about').hide();
    $('#page_settings_keyboard_shortcuts').hide();
    if($('#NavigationDrawer').hasClass("is-visible")) {
      $('#AppBar')[0].MaterialLayout.toggleDrawer();
    }
    $('#page_settings_general').fadeIn();
  }); 
  
  // Open keyboard shortcuts
  $('#link_to_keyboard_shortcuts').click(function(e) {
    $('#page_settings_general').hide();
    $('#page_about').hide();
    if($('#NavigationDrawer').hasClass("is-visible")) {
      $('#AppBar')[0].MaterialLayout.toggleDrawer();
    }
    $('#page_settings_keyboard_shortcuts').fadeIn();
  });
  
  // Open about page
  $('#link_to_about').click(function(e) {
    $('#page_settings_general').hide();
    $('#page_settings_keyboard_shortcuts').hide();
    if($('#NavigationDrawer').hasClass("is-visible")) {
      $('#AppBar')[0].MaterialLayout.toggleDrawer();
    }
    $('#page_about').fadeIn();
  });
  
  // Close window
  $('#btn_close').click(function(e) {
    if($('#NavigationDrawer').hasClass("is-visible")) {
      $('#AppBar')[0].MaterialLayout.toggleDrawer();
    }
    window.close();
  });
  
});