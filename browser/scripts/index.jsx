/* React & style */
import React from 'react';
import {render} from 'react-dom';
import 'bootstrap-loader';
import 'font-awesome-webpack';
import '~/browser/styles/mediapiston.sass';

/* Components */
import Header from "./header.jsx";
import VideoList from "./video.jsx";
import CameraList from "./camera-pret.jsx";


render(<Header />, document.getElementById('reactHeader'));
render(<CameraList />, document.getElementById('videos'));
