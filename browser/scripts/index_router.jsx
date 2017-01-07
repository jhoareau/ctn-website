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

import { BrowserRouter, Match, Miss, Link } from 'react-router';
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
          key: props.location.pathname,
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
        <Match pattern="/(mediapiston|matos)" component={Search_Router} />
          <div className="float-xs-right">
            <Header route='/ajax/header' root={true} />
          </div>
        </nav>
      </header>
      <section className="container-fluid">
        <Match exactly pattern="/" component={Carousel_Router} />
        <Match pattern="/news" component={News_Router} />
        <Match pattern="/mediapiston" component={Mediapiston_Router} />
        <Match pattern="/matos" component={Matos_Router} />
        <Match pattern="/a-propos" component={APropos_Router} />
    
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
    <SearchBox />
  );
}

const Carousel_Router = () => {
  activateStylesheets(['carousel', 'admin_features']);

  return (
    <div>
      <div id="adminFeatures">
        <AdminFeatures route='/ajax/news/adminFeatures' root={true} />
      </div>
      <Carousel route='/ajax/newsList' />
    </div>
  );
}

const News_Router = ({ pathname }) => (
  <div>
    <Match pattern={`${pathname}/add`} component={NewsFormComponent_Add} />
    <Match pattern={`${pathname}/admin`} component={News_AdminComponent} />
    <Match pattern={`${pathname}/update/:id`} component={NewsFormComponent_Edit} />

    <Miss component={NoMatch}/>
  </div>
)

const NewsFormComponent_Add = () => {
  activateStylesheets(['forms']);

  return <NewsForm />;
}

const News_AdminComponent = () => {
  activateStylesheets(['news_admin']);

  return <NewsAdmin route='/ajax/newsList/no_images' />;
}

const NewsFormComponent_Edit = ({ params }) => {
  activateStylesheets(['forms']);

  return <NewsForm update={true} route={'/ajax/news/' + params.id} _id={params.id} />;
}

const Mediapiston_Router = ({ pathname }) => (
  <div>
    <Match exactly pattern={pathname} component={VideoList_Router} />
    <Match pattern={`${pathname}/watch/:id`} component={VideoPlayer_Router} />
    <Match pattern={`${pathname}/upload`} component={Upload_Router} />
    <Match pattern={`${pathname}/update/:id`} component={Update_Router} />
    <Match pattern={`${pathname}/search/:term`} component={VideoListSearch_Router} />

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

const VideoListSearch_Router = ({ params }) => {
  activateStylesheets(['cards', 'search']);

  return (
    <div>
      <div id="videosList" style={{marginTop: '10px'}}>
        <VideoList route={'/ajax/videoList/search/' + params.term} root={true} />
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
  activateStylesheets(['forms']);

  return <UploadForm />;
}

const Update_Router = ({ params }) => {
  activateStylesheets(['forms']);

  return <UploadForm update={true} route={'/ajax/video/' + params.id} _id={params.id} />;
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
  activateStylesheets(Object.keys(stylesheetsUsed)); // Workaround React-router bug
  console.error('Bad location', location);

  return <Error err="Page non trouvée !" />;
}
  

render(<App />, document.querySelector('#reactApp'))