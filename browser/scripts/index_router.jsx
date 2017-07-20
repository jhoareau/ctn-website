/* React & libraries & style */
import React from 'react';
import {render} from 'react-dom';
import Request from 'superagent';
import 'bootstrap-loader';
import 'font-awesome-webpack2';
import * as MaterialComponentHandler from 'exports?componentHandler&MaterialRipple!material-design-lite/material'; // Google material-design-lite V1 workaround
import '~/browser/styles/material-design-lite.scss'; // Custom variables needed
import 'webpack-material-design-icons';
import '~/browser/styles/global.sass';

/* Components */
import Error from "./error.jsx";
import SearchBox from "./search.jsx";
import Header from "./header.jsx";
import Carousel from "./carousel.jsx";
import { VideoList, RelatedVideoList } from "./video.jsx";
import AdminFeatures from "./admin_features.jsx";
import MatosList from "./materiel.jsx";
import VideoPlayer from "./video_player.jsx";
import UploadForm from "./upload.jsx";
import { NewsAdmin, NewsForm } from "./news.jsx";

import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
//import { TransitionMotion, spring } from 'react-motion';
import CustomLink from './custom-link.jsx';

// Animations
// Not used for the moment
/*
const MatchWithFade = ({ component:Component, ...rest }) => {
  const willLeave = () => ({ zIndex: 1, opacity: spring(0) })

  return (
    <Match {...rest} children={({ matched, ...props }) => (
      <TransitionMotion
        willLeave={willLeave}
        styles={matched ? [ {
          key: props.location.match,
          style: { opacity: 1 },
          data: props
        } ] : []}
      >
        {interpolatedStyles => (
          <div>
            {interpolatedStyles.map(config => (
              <div
                key={config.key}
                style={{ ...config.style }}
              >
                <Component {...config.data}/>
              </div>
            ))}
          </div>
        )}
      </TransitionMotion>
    )}/>
  )
}
*/
const App = () => (
  <BrowserRouter>
    <div>
      <header>
        <nav className="navbar navbar-light navbar-full mdl-shadow--3dp"><CustomLink href="/" className="navbar-brand" root={true}><img src="/defaults/header.svg"/></CustomLink>
          <Route path="/(mediapiston|matos)(/*.*)" component={Search_Router} />
          <div className="float-xs-right">
            <Header route='/ajax/header' root={true} />
          </div>
        </nav>
      </header>
      <section className="container-fluid">
        <Switch>
          <Route exact path="/" component={Carousel_Router} />
          <Route path="/news" component={News_Router} />
          <Route path="/mediapiston" component={Mediapiston_Router} />
          <Route path="/matos" component={Matos_Router} />
          <Route path="/a-propos" component={APropos_Router} />

          <Route component={NoMatch}/>
        </Switch>
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
  carousel: require('~/browser/styles/carousel.useable.sass'),
  news_admin: require('~/browser/styles/news_admin.useable.sass'),
  a_propos: require('~/browser/styles/a_propos.useable.sass')
}
let stylesheetsUsed = {
  cards: false,
  cards_animations: false,
  admin_features: false,
  video_player: false,
  forms: false,
  carousel: false,
  news_admin: false,
  a_propos: false
}

const activateStylesheets = (names) => {
  for (name in stylesheetsUsed) {
    if (names.includes(name)) {
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

const Search_Router = ({ location }) => {
  stylesheets.search.use();

  return (
    <SearchBox route='/mediapiston/search/' />
  );
}

const Carousel_Router = () => {
  activateStylesheets(['carousel', 'admin_features']);

  return (
    <div>
      <div id="adminFeatures">
        <AdminFeatures route='/ajax/news/adminFeatures' root={true} />
      </div>
      <Carousel route='/ajax/news' />
    </div>
  );
}

const News_Router = ({ match }) => (
  <div>
    <Switch>
      <Route path={`${match.url}/add`} component={NewsFormComponent_Add} />
      <Route path={`${match.url}/admin`} component={News_AdminComponent} />
      <Route path={`${match.url}/update/:id`} component={NewsFormComponent_Edit} />

      <Route component={NoMatch}/>
    </Switch>
  </div>
)

const NewsFormComponent_Add = () => {
  activateStylesheets(['forms']);

  return <NewsForm />;
}

const News_AdminComponent = () => {
  activateStylesheets(['news_admin']);

  return <NewsAdmin route='/ajax/news' />;
}

const NewsFormComponent_Edit = ({ match }) => {
  activateStylesheets(['forms']);

  return <NewsForm update={true} route={'/ajax/news/' + match.params.id} _id={match.params.id} />;
}

const Mediapiston_Router = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={match.url} component={VideoList_Router} />
      <Route path={`${match.url}/watch/:id`} component={VideoPlayer_Router} />
      <Route path={`${match.url}/upload`} component={Upload_Router} />
      <Route path={`${match.url}/update/:id`} component={Update_Router} />
      <Route path={`${match.url}/search/:term`} component={VideoListSearch_Router} />

      <Route component={NoMatch}/>
    </Switch>
  </div>
)

const Matos_Router = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={match.url} component={MatosList_Router} />
      <Route path="/add" component={AddMatos_Router} />

      <Route component={NoMatch}/>
    </Switch>
  </div>
)


const VideoList_Router = () => {
  activateStylesheets(['cards', 'search', 'admin_features']);

  return (
    <div>
      <div id="adminFeatures">
        <AdminFeatures route='/ajax/mediapiston/adminFeatures' root={true} />
      </div>
      <div id="videosList">
        <VideoList route='/ajax/videos' root={true} />
      </div>
    </div>
  );
};

const VideoListSearch_Router = ({ match }) => {
  activateStylesheets(['cards', 'search']);

  return (
    <div>
      <div id="videosList" style={{marginTop: '10px'}}>
        <VideoList route={'/ajax/videos/search/' + match.params.term} root={true} />
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
        <MatosList route='/ajax/items' root={true} />
      </div>
    </div>
  );
};

const VideoPlayer_Router = ({ match }) => {
  activateStylesheets(['video_player']);

  return (
    <div className="row">
      <div className="col-xl-8"><VideoPlayer route={'/ajax/videos/' + match.params.id} _id={match.params.id} root={true} /></div>
      <div className="col-xl-4"><RelatedVideoList route={'/ajax/videos/related/' + match.params.id} root={true} /></div>
    </div>
  );
}

const Upload_Router = () => {
  activateStylesheets(['forms']);

  return <UploadForm />;
}

const Update_Router = ({ match }) => {
  activateStylesheets(['forms']);

  return <UploadForm update={true} route={'/ajax/videos/' + match.params.id} _id={match.params.id} />;
}

const AddMatos_Router = () => {
  activateStylesheets(['forms']);

  return <UploadForm />;
}

const APropos_Router = () => {
  activateStylesheets(['a_propos']);
  return (
          <div className="apropos">
            <div className="apropos_left">
              <h1>CTN - Centrale Television Network</h1>
              <h3>L'association vidéo de l'Ecole Centrale de Lyon, qui est aussi une section de l'AEECL - Association des Elèves de l'Ecole Centrale de Lyon.</h3>
            </div>
            <div className="apropos_right">
              <p>À CTN, on s'occupe de la couverture vidéo de tous les évènements majeurs auxquels les étudiants de l'Ecole participent (le Gala Eclyps, le Challenge Centrale Lyon, etc...) mais aussi des évènements de la vie étudiante sur le campus, notamment en soirée. Après avoir filmé, on s'amuse à monter des zaps et des recaps des évènements afin de pouvoir les proposer aux Centraliens et aux associations. Parallèlement à l'activité liée à Centrale, CTN est parfois amenée à filmer des évènements extérieurs tels que la Fête des Lumières sur Lyon.</p>
            </div>
          </div>
  );
}


const NoMatch = ({location}) => {
  //activateStylesheets(Object.keys(stylesheetsUsed)); // Workaround React-router bug
  console.error('Error 404', location);
  //return <Redirect to='/' />;
  return <Error err="Page non trouvée !" />;
}


render(<App />, document.querySelector('#reactApp'))
