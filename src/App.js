import React, { useState, useRef, useEffect } from "react";

import screenfull from "screenfull";

import "./App.css";
import { STREAMS } from "./util/streams";
import ReactPlayer from "react-player";
import { config } from "react-spring";
import axios from "axios";

import { findDOMNode } from "react-dom";

import Carousel from "./react-spring-3d-carousel/src/components/Carousel";

const LIVE_URL = "https://thetastudio.netlify.app";

const carouselState = {
  goToSlide: 0,
  offsetRadius: 2,
  showNavigation: true,
  config: config.gentle,
};

function App() {
  const [index, setIndex] = useState(0);
  const [streams, setStreams] = useState([]);
  const [muted, setMuted] = useState(false);
  const videoEl = useRef(null);

  const refreshChannels = async (e) => {
    e.preventDefault();
    const url = "https://api.theta.tv/v1/theta/channel/list?number=100";
    try {
      const result = await axios.get(url);
      const { data } = result;
      setStreams(data.body);
    } catch (e) {
      alert("Unable to get streams: " + e);
      console.error(e);
    }
  };

  useEffect(() => {
    if (window.location.origin === LIVE_URL) {
      refreshChannels();
    } else {
      setStreams(STREAMS);
    }
  }, []);

  const slides = streams.map((stream, i) => ({
    key: i,
    content: (
      <div>
        <h1>
          #{i + 1}: {stream.live_stream.game.name}
        </h1>
        <p>
          Streamer:&nbsp;
          <a
            href={`https://www.theta.tv/${stream.alias}`}
            target="_blank"
            className="orange"
          >
            {stream.name}
          </a>
        </p>
        <div onClick={() => setMuted(!muted)}>
          <ReactPlayer
            height={480}
            width={720}
            muted={muted}
            url={stream.live_stream.video_url_map["2d"].master}
            playing={index === i}
          />
        </div>
      </div>
    ),
  }));

  const onClickFullscreen = () => {
    screenfull.request(findDOMNode(videoEl));
  };

  return (
    <div className="content-area">
      <div className="header-area">
        <h1 className="header-title">Theta Studio</h1>
        <p>Discover and contribute to your favorite Theta.tv Channels</p>
        <p>
          Blank streams?&nbsp;
          <a href="#" onClick={refreshChannels} className="orange">
            Refresh Streams
          </a>
        </p>
        <p>
          <span className="orange">{streams.length}</span> streams found
        </p>
      </div>
      <Carousel
        onChange={setIndex}
        slides={slides}
        goToSlide={carouselState.goToSlide}
        offsetRadius={carouselState.offsetRadius}
        showNavigation={carouselState.showNavigation}
        animationConfig={carouselState.config}
      />
      {/* <button onClick={onClickFullscreen}>Fullscreen</button> */}
    </div>
  );
}

export default App;
