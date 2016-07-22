/* React & libraries & style */
import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import 'bootstrap-loader';
import 'font-awesome-webpack';
import * as MaterialComponentHandler from 'exports?componentHandler&MaterialRipple!material-design-lite/material'; // Google material-design-lite V1 workaround
import '~/browser/styles/material-design-lite/material-design-lite.scss'; // Custom variables needed
import 'webpack-material-design-icons';
import '~/browser/styles/global.sass';

/* Components */
import Header from "./header.jsx";
import Carousel from "./carousel.jsx";
import VideoList from "./video.jsx";
import MatosList from "./materiel.jsx";
import VideoPlayer from "./video_player.jsx";
import AdminFeatures from "./admin_features.jsx";


$.get('/ajax/header', (data) => {
  render(<Header links={data} />, document.getElementById('reactHeader'));
});
if (window.location.pathname === '/') {
  require('~/browser/styles/carousel.sass');

  render(<Carousel />, document.getElementById('mainCarousel'));
}

if (window.location.pathname === '/mediapiston' | window.location.pathname === '/mediapiston/') {
  require('~/browser/styles/cards.sass');
  require('~/browser/styles/search.sass');

  $.get('/ajax/mediapiston/adminFeatures', (data) => {
    // Fonctions Admin
    if (data.length > 0) require('~/browser/styles/admin_features.sass');
    render(<AdminFeatures links={data} />, document.getElementById('adminFeatures'));
  });
  render(<VideoList />, document.getElementById('videosList'));
  // Récupération liste des vidéos
  /*$.get('/ajax/videoList', (data) => {
    // VideoList React
    render(<VideoList videoList={data} />, document.getElementById('videosList'));
  });*/

}

if (window.location.pathname.indexOf('/mediapiston/watch') > -1) {
  require('~/browser/styles/cards.sass');
  require('~/browser/styles/search.sass');

  // Lecteur Vidéo HTML5
  let Plyr = require('~/node_modules/plyr/dist/plyr.js');
  require('~/node_modules/plyr/src/scss/plyr.scss');

  // VideoPlayer React
  render(<VideoPlayer />, document.getElementById('videoContent'));

  // Attacher lecteur à la balise <video>
  require('./videoplayer_setup')(Plyr);
}

if (window.location.pathname.indexOf('/mediapiston/upload') > -1) {
  require('~/browser/styles/forms.sass');
}

/*if(window.location.pathname.match(/pret-matos/gi)) {

}*/

if (window.location.pathname === '/pret-matos' | window.location.pathname === '/pret-matos/') {
  require('~/browser/styles/cards.sass');
  require('~/browser/styles/search.sass');
  require('~/browser/styles/cards_animations.sass');

  $.get('/ajax/pret-matos/adminFeatures', (data) => {
    // Fonctions Admin
    if (data.length > 0) require('~/browser/styles/admin_features.sass');
    render(<AdminFeatures links={data} />, document.getElementById('adminFeatures'));
  });

  render(<MatosList />, document.getElementById('matosList'));
}

MaterialComponentHandler.componentHandler.upgradeDom();
