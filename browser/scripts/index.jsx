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
import {VideoList, RelatedVideoList} from "./video.jsx";
import MatosList from "./materiel.jsx";
import VideoPlayer from "./video_player.jsx";
import UploadForm from "./upload.jsx";

/* Common to all pages */
$.get('/ajax/header', (data) => {
  render(<Header links={data} />, document.getElementById('reactHeader'));
});

/* Home page */
if (window.location.pathname === '/') {
  require('~/browser/styles/carousel.sass');

  render(<Carousel />, document.getElementById('mainCarousel'));
}

/* Common to other pages than Home */
if (window.location.pathname.indexOf('mediapiston') > -1 && window.location.pathname.indexOf('upload') < 0
    || window.location.pathname.indexOf('/pret-matos') > -1 ) {
  require('~/browser/styles/cards.sass');
  require('~/browser/styles/search.sass');
}

/* Pages with Admin Features */
if (window.location.pathname === '/mediapiston' || window.location.pathname === '/mediapiston/'
    || window.location.pathname === '/pret-matos' ||  window.location.pathname === '/pret-matos/') {

      $.get('/ajax/' + window.location.pathname.match(/(mediapiston|pret-matos)/)[0] + '/adminFeatures', (data) => {
        // Fonctions Admin
        if (data.length > 0) {
          let AdminFeatures = require("./admin_features.jsx").default;
          require('~/browser/styles/admin_features.sass');
          render(<AdminFeatures links={data} />, document.getElementById('adminFeatures'));
        }
      });


}


if (window.location.pathname === '/mediapiston' || window.location.pathname === '/mediapiston/') {
  //render(<VideoList />, document.getElementById('videosList'));
  // Récupération liste des vidéos
  $.get('/ajax/videoList', (data) => {
    // VideoList React
    render(<VideoList videoList={data} />, document.getElementById('videosList'));
  });

}

if (window.location.pathname === '/pret-matos' || window.location.pathname === '/pret-matos/') {
  require('~/browser/styles/cards_animations.sass');

  render(<MatosList />, document.getElementById('matosList'));
}

if (window.location.pathname.indexOf('/mediapiston/watch') > -1) {
  // Lecteur Vidéo HTML5
  let Plyr = require('~/node_modules/plyr/dist/plyr.js');
  require('~/node_modules/plyr/src/scss/plyr.scss');

  require('~/browser/styles/video_player.sass');
  require('~/browser/styles/mediapiston.sass');

  let videoID = window.location.pathname.split('/').pop();

  $.get('/ajax/video/' + videoID, (data) => {
    // VideoPlayer React
    render(<VideoPlayer {...data} />, document.getElementById('videoContent'));
    // Attacher lecteur à la balise <video>
    require('./videoplayer_setup')(Plyr);
  });
  $.get('/ajax/videoList/related/' + videoID, (data) => {
    // RelatedVideoList React
    render(<RelatedVideoList videoList={data} />, document.getElementById('relatedContent'));
  });

}

if (window.location.pathname.indexOf('/mediapiston/upload') > -1) {
  require('~/browser/styles/forms.sass');

  render(<UploadForm />, document.getElementById('uploadForm'));
}

if (window.location.pathname.indexOf('/mediapiston/update') > -1) {
  require('~/browser/styles/forms.sass');

  let videoID = window.location.pathname.split('/').pop();

  $.get('/ajax/video/' + videoID, (data) => {
    // UploadForm update mode
    render(<UploadForm update={true} {...data} />, document.getElementById('uploadForm'));
  });
}

MaterialComponentHandler.componentHandler.upgradeDom();
