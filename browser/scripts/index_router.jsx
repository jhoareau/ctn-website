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
import Carousel from "./carousel.jsx";
import {VideoList, RelatedVideoList} from "./video.jsx";
import AdminFeatures from "./admin_features.jsx";
import MatosList from "./materiel.jsx";
import VideoPlayer from "./video_player.jsx";
import UploadForm from "./upload.jsx";

import { BrowserRouter, Match, Miss, Link, browserHistory } from 'react-router';
import CustomLink from './custom-link.jsx';

const App = () => (
  <BrowserRouter>
    <div>
      <header>
        <nav className="navbar navbar-light navbar-full"><CustomLink href="/" className="navbar-brand" root={true}><img src="/defaults/ctn.svg"/></CustomLink>
          <div className="float-xs-right">
            <Header route='/ajax/header' root={true} />
          </div>
        </nav>
      </header>
      <section className="container-fluid">
        <Match exactly pattern="/" component={Carousel_Router} />
        <Match pattern="/mediapiston" component={Mediapiston_Router} />
        <Match pattern="/matos" component={Matos_Router} />
    
        <Miss component={NoMatch}/>
      </section>
    </div>
  </BrowserRouter>
)

const stylesheets = {
  cards: require('~/browser/styles/cards.useable.sass'),
  cards_animations: require('~/browser/styles/cards_animations.useable.sass'),
  search: require('~/browser/styles/search.useable.sass'),
  admin_features: require('~/browser/styles/admin_features.useable.sass'),
  video_player: require('~/browser/styles/video_player.useable.sass'),
  forms: require('~/browser/styles/forms.useable.sass'),
  carousel: require('~/browser/styles/carousel.useable.sass')
}
let stylesheetsUsed = {
  cards: false,
  search: false,
  admin_features: false,
  video_player: false,
  forms: false,
  carousel: false,
}

const activateStylesheets = (names) => {
  for (name in stylesheets) {
    if (names.indexOf(name) > -1) {
      if (stylesheetsUsed[name]) continue;
      stylesheets[name].use();
      stylesheetsUsed[name] = true;
    } else {
      if (!stylesheetsUsed[name]) continue;
      stylesheets[name].unuse();
      stylesheetsUsed[name] = false;
    }
  }
}

const Mediapiston_Router = ({ pathname }) => (
  <div>
    <Match exactly pattern={pathname} component={VideoList_Router} />
    <Match pattern={`${pathname}/watch/:id`} component={VideoPlayer_Router} />
    <Match pattern={`${pathname}/upload`} component={Upload_Router} />
    <Match pattern={`${pathname}/update/:id`} component={Update_Router} />

    <Miss component={NoMatch}/>
  </div>
)

const Matos_Router = ({ pathname }) => (
  <div>
    <Match exactly pattern={pathname} component={MatosList_Router} />
    <Match pattern="/add" component={AddMatos_Router} />

    <Miss component={NoMatch}/>
  </div>
)

const Carousel_Router = () => {
  activateStylesheets(['carousel', 'admin_features']);

  return (
    <div>
      <div id="adminFeatures">
        <AdminFeatures route='/ajax/news/adminFeatures' root={true} />
      </div>
      <div id="videosList">
        <Carousel route='/ajax/newsList' />
      </div>
    </div>
  );
}


const VideoList_Router = () => {
  activateStylesheets(['cards', 'search', 'admin_features']);

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

const MatosList_Router = () => {
  activateStylesheets(['cards', 'cards_animations', 'search', 'admin_features']);

  return (
    <div>
      <div id="adminFeatures">
        <AdminFeatures route='/ajax/matos/adminFeatures' root={true} />
      </div>
      <div id="videosList">
        <MatosList route='/ajax/matosList' root={true} />
      </div>
    </div>
  );
};

const VideoPlayer_Router = ({ params }) => {
  activateStylesheets(['video_player']);

  return (
    <div className="row">
      <div className="col-xl-8"><VideoPlayer route={'/ajax/video/' + params.id} _id={params.id} root={true} /></div>
      <div className="col-xl-4"><RelatedVideoList route={'/ajax/videoList/related/' + params.id} root={true} /></div>
    </div>
  );
}

const Upload_Router = () => {
  if (stylesheetsUsed.cards) {stylesheets.cards.unuse(); stylesheetsUsed.cards = false;}
  if (stylesheetsUsed.search) {stylesheets.search.unuse(); stylesheetsUsed.search = false;}
  if (stylesheetsUsed.admin_features) {stylesheets.admin_features.unuse(); stylesheetsUsed.admin_features = false;}
  if (stylesheetsUsed.video_player) {stylesheets.video_player.unuse(); stylesheetsUsed.video_player = false;}
  if (!stylesheetsUsed.forms) {stylesheets.forms.use(); stylesheetsUsed.forms = true;}

  return <UploadForm />;
}

const Update_Router = ({ params }) => {
  if (stylesheetsUsed.cards) {stylesheets.cards.unuse(); stylesheetsUsed.cards = false;}
  if (stylesheetsUsed.search) {stylesheets.search.unuse(); stylesheetsUsed.search = false;}
  if (stylesheetsUsed.admin_features) {stylesheets.admin_features.unuse(); stylesheetsUsed.admin_features = false;}
  if (stylesheetsUsed.video_player) {stylesheets.video_player.unuse(); stylesheetsUsed.video_player = false;}
  if (!stylesheetsUsed.forms) {stylesheets.forms.use(); stylesheetsUsed.forms = true;}

  return <UploadForm update={true} route={'/ajax/video/' + params.id} _id={params.id} />;
}

const AddMatos_Router = () => {
  if (stylesheetsUsed.cards) {stylesheets.cards.unuse(); stylesheetsUsed.cards = false;}
  if (stylesheetsUsed.search) {stylesheets.search.unuse(); stylesheetsUsed.search = false;}
  if (stylesheetsUsed.admin_features) {stylesheets.admin_features.unuse(); stylesheetsUsed.admin_features = false;}
  if (stylesheetsUsed.video_player) {stylesheets.video_player.unuse(); stylesheetsUsed.video_player = false;}
  if (!stylesheetsUsed.forms) {stylesheets.forms.use(); stylesheetsUsed.forms = true;}

  return <UploadForm />;
}


const NoMatch = ({location}) => (
  <Error err="Page non trouvée (React) !" />
)

render(<App />, document.querySelector('#reactApp'))