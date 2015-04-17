var dest = './ComicsScroller/',
  src = './src',
  mui = './node_modules/material-ui/src';

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
      outputName: 'app_sf.js'
    },{
      entries: src + '/app/app_ali.jsx',
      dest: dest+'/js',
      outputName: 'app_ali.js'
    },{
      entries: src + '/app/app_8.jsx',
      dest: dest+'/js',
      outputName: 'app_8.js'
    },{
      entries: src + '/app/app_dm5.jsx',
      dest: dest+'/js',
      outputName: 'app_dm5.js'

    }]
  }
};
