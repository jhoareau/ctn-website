/* React & style */
import React from 'react';
import {render} from 'react-dom';
import 'bootstrap-loader';
import 'font-awesome-webpack';
import '~/browser/styles/mediapiston.sass';

/* Components */
import Header from "./header.jsx";
import VideoList from "./video.jsx";
import MatosList from "./materiel.jsx";


render(<Header />, document.getElementById('reactHeader'));
render(<MatosList />, document.getElementById('videos'));
