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
import AdminFeatures from "./admin_features.jsx";
//import MatosList from "./materiel.jsx";
import VideoPlayer from "./video_player.jsx";
import UploadForm from "./upload.jsx";

import { BrowserRouter, Match, Miss, Link, browserHistory } from 'react-router';
import CustomLink from './custom-link.jsx';

const App = () => (
  <BrowserRouter basename='/mediapiston'>
    <div>
      <header>
        <nav className="navbar navbar-light navbar-full"><a href="/" className="navbar-brand"><img src="/defaults/ctn.svg"/></a>
          <div className="float-xs-right">
            <Header route='/ajax/header' root={true} />
          </div>
        </nav>
      </header>
      <section className="container-fluid">
        <Match exactly pattern="/" component={VideoList_Router} />
        <Match pattern="/watch/:id" component={VideoPlayer_Router} />
        <Match pattern="/upload" component={Upload_Router} />
    
        <Miss component={NoMatch}/>
      </section>
    </div>
  </BrowserRouter>
)

const VideoList_Router = () => {
  require('~/browser/styles/cards.sass');
  require('~/browser/styles/search.sass');
  require('~/browser/styles/admin_features.sass');
  
  return (
    <div>
      <div id="adminFeatures">
        <AdminFeatures route='/ajax/mediapiston/adminFeatures' root={true} />
      </div>
      <div id="videosList">
        <VideoList route='/ajax/videoList' root={true} />
      </div>
    </div>
  );
};

const VideoPlayer_Router = ({ params }) => {
  require('~/browser/styles/video_player.sass');

  return (
    <div className="row">
      <div className="col-xl-8"><VideoPlayer route={'/ajax/video/' + params.id} _id={params.id} root={true} /></div>
      <div className="col-xl-4"><RelatedVideoList route={'/ajax/videoList/related/' + params.id} root={true} /></div>
    </div>
  );
}

const Upload_Router = () => (
  <Error err="Upload" />
)

const NoMatch = ({location}) => (
  <Error err="Page non trouvée !" />
)

render(<App />, document.querySelector('#reactApp'))