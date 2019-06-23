const mix = require('laravel-mix');

const src_path = 'src/';
const dest_path = 'site';
const dest_path_assets = dest_path + '/assets';

mix
  .setPublicPath(dest_path)
  .js(src_path + 'js/app.js', dest_path_assets)
  .sass(src_path + 'sass/app.scss', dest_path_assets)
  .copy(src_path + 'html', dest_path)
  .version();
