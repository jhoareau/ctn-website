/* React & libraries & style */
import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import 'bootstrap-loader';
import 'font-awesome-webpack';
import '~/browser/styles/global.sass';

/* Components */
import Header from "./header.jsx";
import VideoList from "./video.jsx";
import MatosList from "./materiel.jsx";
import VideoPlayer from "./video_player.jsx";


$.get('/ajax/header', (data) => {
  render(<Header links={data} />, document.getElementById('reactHeader'));
});

if (window.location.pathname === '/mediapiston' | window.location.pathname === '/mediapiston/') {
  require('~/browser/styles/cards.sass');
  require('~/browser/styles/search.sass');

  // Récupération liste des vidéos
  $.get('/ajax/videoList', (data) => {
    // VideoList React
    render(<VideoList videoList={data} />, document.getElementById('videosList'));
  });

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

if (window.location.pathname === '/pret-matos' | window.location.pathname === '/pret-matos/') {
  require('~/browser/styles/cards.sass');
  require('~/browser/styles/search.sass');
  render(<MatosList />, document.getElementById('matosList'));
}
