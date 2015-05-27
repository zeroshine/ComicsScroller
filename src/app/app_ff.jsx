require('../less/main.less');
// (function () {
  var React = require('react'),
    injectTapEventPlugin = require("react-tap-event-plugin"),
    
    Main_sf = require('./components/main_sf_ff.jsx'), // Our custom react component
    Main_dm5 = require('./components/main_dm5_ff.jsx'), // Our custom react component
    Main_8 = require('./components/main_8_ff.jsx');
  
  var site= /site\/(\w*)\//.exec(window.location.hash)[1];
  var Main;
  switch (site){
    case 'sf':
      Main=Main_sf;
      break;
    case 'comics8':
      Main=Main_8;
      break;
    case 'dm5':
      Main=Main_dm5;
      break;    
  }


  //Needed for React Developer Tools
  window.React = React;

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  // Render the main app react component into the document body. 
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  React.render(<Main />, document.body);
  