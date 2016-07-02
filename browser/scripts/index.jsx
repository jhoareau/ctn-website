/* React & libraries & style */
import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import 'bootstrap-loader';
import 'font-awesome-webpack';
import '~/browser/styles/mediapiston.sass';

/* Components */
import Header from "./header.jsx";
import VideoList from "./video.jsx";
import MatosList from "./materiel.jsx";
import VideoPlayer from "./video_player.jsx";


$.get('/ajax/header', (data) => {
  render(<Header links={data} />, document.getElementById('reactHeader'));
})

if (window.location.pathname === '/mediapiston' | window.location.pathname === '/mediapiston/')
  render(<VideoList />, document.getElementById('videosList'));

if (window.location.pathname.indexOf('/mediapiston/watch') > -1)
  render(<VideoPlayer />, document.getElementById('videoContent'));

if (window.location.pathname === '/pret-matos' | window.location.pathname === '/pret-matos/')
  render(<MatosList />, document.getElementById('matosList'));
