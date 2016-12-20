/* React & libraries & style */
import React from 'react';
import {render} from 'react-dom';
import Request from 'superagent';
import 'bootstrap-loader';
import 'font-awesome-webpack2';
import * as MaterialComponentHandler from 'exports?componentHandler&MaterialRipple!material-design-lite/material'; // Google material-design-lite V1 workaround
import '~/browser/styles/material-design-lite/material-design-lite.scss'; // Custom variables needed
import 'webpack-material-design-icons';
import '~/browser/styles/global.sass';

/* Components */
import Error from "./error.jsx"
import Header from "./header.jsx";
//import Carousel from "./carousel.jsx";
import {VideoList, RelatedVideoList} from "./video.jsx";
//import MatosList from "./materiel.jsx";
import VideoPlayer from "./video_player.jsx";
import UploadForm from "./upload.jsx";
//import MatosForm from "./addMateriel.jsx"

/* Common to all pages */
Request.get('/ajax/header').end((err, data) => {
  data = data.body;
  render(<Header links={data} />, document.getElementById('reactHeader'));
});

/* Home page */
if (window.location.pathname === '/') {
  //require('~/browser/styles/carousel.sass');

  //render(<Carousel />, document.getElementById('mainCarousel'));
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

      Request.get('/ajax/' + window.location.pathname.match(/(mediapiston|pret-matos)/)[0] + '/adminFeatures').end((err, data) => {
        data = data.body;
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
  Request.get('/ajax/videoList').end((err, data) => {
    data = data.body;
    // VideoList React
    render(<VideoList videoList={data} />, document.getElementById('videosList'));
  });

}

// <https://stackoverflow.com/questions/8486099/how-do-i-parse-a-url-query-parameters-in-javascript>
function getJsonFromUrl(hashBased) {
  var query;
  if(hashBased) {
    var pos = location.href.indexOf("?");
    if(pos==-1) return [];
    query = location.href.substr(pos+1);
  } else {
    query = location.search.substr(1);
  }
  var result = {};
  query.split("&").forEach(function(part) {
    if(!part) return;
    part = part.split("+").join(" "); // replace every + with space, regexp-free version
    var eq = part.indexOf("=");
    var key = eq>-1 ? part.substr(0,eq) : part;
    var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
    var from = key.indexOf("[");
    if(from==-1) result[decodeURIComponent(key)] = val;
    else {
      var to = key.indexOf("]");
      var index = decodeURIComponent(key.substring(from+1,to));
      key = decodeURIComponent(key.substring(0,from));
      if(!result[key]) result[key] = [];
      if(!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}

if (window.location.pathname === '/mediapiston/search') {
  //render(<VideoList />, document.getElementById('videosList'));
  // Récupération liste des vidéos
  Request.get('/ajax/videoList/search/' + getJsonFromUrl()['q']).end((err, data) => {
    data = data.body;
    if (err) data = [];
    // VideoList React
    render(<VideoList videoList={data} />, document.getElementById('videosList'));
  });

}

/*if (window.location.pathname === '/pret-matos' || window.location.pathname === '/pret-matos/') {
  require('~/browser/styles/cards_animations.sass');

  $.get('/ajax/pret-matos/public', (data) => {
    // VideoList React
    render(<MatosList matosList={data} />, document.getElementById('matosList'));
  });
}

if (window.location.pathname === '/pret-matos/add' || window.location.pathname === '/pret-matos/add/') {
  require('~/browser/styles/forms.sass');

  render(<MatosForm />, document.getElementById('matosForm'));
}*/

if (window.location.pathname.indexOf('/mediapiston/watch') > -1) {
  // Lecteur Vidéo HTML5
  let Plyr = require('~/node_modules/plyr/dist/plyr.js');
  require('~/node_modules/plyr/src/scss/plyr.scss');

  require('~/browser/styles/video_player.sass');
  require('~/browser/styles/mediapiston.sass');

  let videoID = window.location.pathname.split('/').pop();

  Request.get('/ajax/video/' + videoID).end((err, data) => {
    if (err) return render(<Error err="Vidéo non trouvée !" />, document.getElementById('videoContent'));
    data = data.body;
    // VideoPlayer React
    render(<VideoPlayer {...data} />, document.getElementById('videoContent'));
    // Attacher lecteur à la balise <video>
    require('./videoplayer_setup')(Plyr);

    Request.get('/ajax/videoList/related/' + videoID).end((err, data_related) => {
      data_related = data_related.body;
      // RelatedVideoList React
      render(<RelatedVideoList videoList={data_related} />, document.getElementById('relatedContent'));
    });
  });

}

if (window.location.pathname === '/mediapiston/upload' || window.location.pathname === '/mediapiston/upload/') {
  require('~/browser/styles/forms.sass');

  render(<UploadForm />, document.getElementById('uploadForm'));
}

if (window.location.pathname.indexOf('/mediapiston/update') > -1) {
  require('~/browser/styles/forms.sass');

  let videoID = window.location.pathname.split('/').pop();

  Request.get('/ajax/video/' + videoID).end((err, data) => {
    data = data.body;
    // UploadForm update mode
    render(<UploadForm update={true} {...data} />, document.getElementById('uploadForm'));
  });
}

MaterialComponentHandler.componentHandler.upgradeDom();
