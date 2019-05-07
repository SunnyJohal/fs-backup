// import external dependencies
import 'jquery';
// Import everything from autoload
import './autoload/**/*';
import './page-builder/mscroll-reveal';
import './page-builder/owl-carousel';
import './page-builder/parallax';
import './page-builder/scripts';
import aboutUs from './routes/about';
import common from './routes/common';
import home from './routes/home';
// import local dependencies
import Router from './util/Router';

/** Populate Router instance with DOM routes */
const routes = new Router({
  // All pages
  common,
  // Home page
  home,
  // About Us page, note the change from about-us to aboutUs.
  aboutUs
});

// Load Events
jQuery(document).ready(() => routes.loadEvents());
