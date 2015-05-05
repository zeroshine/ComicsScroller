var dest = './ComicsScroller/',
  src = './src',
  mui = './node_modules/material-ui/src';
var ffdest="./ComicsScroller_ff/";
module.exports = {
  browserSync: {
    files: [
      dest + '/**'
    ]
  },
  less: {
    src: src + '/less/main.less',
    watch: [
      src + '/less/**',
      mui + '/less/**'
    ],
    dest: dest+'/css'
  },
  markup: {
    src: src + "/www/**",
    dest: dest
  },
  browserify: {
    // Enable source maps
    debug: true,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/app/app_sf.jsx',
      dest: dest+'/js',
      outputName: 'app_sf_min.js'
    },{
      entries: src + '/app/app_8.jsx',
      dest: dest+'/js',
      outputName: 'app_8_min.js'
    },{
      entries: src + '/app/app_dm5.jsx',
      dest: dest+'/js',
      outputName: 'app_dm5_min.js'
    },{
      entries: src+'/background.js',
      dest: dest,
      outputName: 'background.js'
    },{
      entries: src+'/popup.jsx',
      dest: dest,
      outputName: 'popup.js'
    }]
  }
};
