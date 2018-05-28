import * as React from "react";

import * as styles from "app/assets/styles/player.css";

import Loader from "app/assets/icons/loader.svg";

import { Marker } from "app/models/marker";

import PlayerControlBar from "./PlayerControlBar";

import * as classnames from "classnames";

interface PlayerState {
    lsf: boolean;
    subtitle: boolean;
    fullscreen: boolean;
    currentTime: number;  // in ms
    currentVolume: number; // from 0 to 100
    muted: boolean; // Is the video muted?
    mouseActivity: boolean; // true if there is mouse activity
    playing: boolean;
    buffering: boolean;
    mainVideoInitialized: boolean; // main video is ready to play
    secondaryVideoInitialized: boolean; // secondary video is ready to play
}

export class Player extends React.Component<undefined, PlayerState> {
    private mainVideoElement: HTMLVideoElement;
    private secondaryVideoElement: HTMLVideoElement;

    private playerElement: HTMLDivElement;

    private mouseActivityTimer: any;

    private textTrackUrl =
        "https://raw.githubusercontent.com/noophq/html5-video-subtitle/master/test/resources/subtitles/test.xml";

    // private markerList: Marker[] = [
    //     {
    //         timecode: 0,
    //         image: "./images/classe.jpg",
    //         title: "start",
    //     },
    //     {
    //         timecode: 60,
    //         image: "./images/livre.jpg",
    //         title: "other",
    //     },
    //     {
    //         timecode: 600,
    //         image: "./images/cantine.jpg",
    //         title: "???",
    //     },
    // ];

    public constructor() {
        super(undefined);

        this.state = {
            lsf: false,
            subtitle: false,
            fullscreen: false,
            currentTime: 0,
            currentVolume: 0,
            muted: false,
            buffering: true,
            playing: false,
            mouseActivity: true,
            mainVideoInitialized: false,
            secondaryVideoInitialized: false,
        };

        this.setPlayerElement = this.setPlayerElement.bind(this);
        this.setMainVideoElement = this.setMainVideoElement.bind(this);
        this.setSecondaryVideoElement = this.setSecondaryVideoElement.bind(this);
        this.addListeners = this.addListeners.bind(this);
        this.removeListeners = this.removeListeners.bind(this);
        this.handleNone = this.handleNone.bind(this);
        this.handleCanPlay = this.handleCanPlay.bind(this);
        this.handleDocumentFullscreen = this.handleDocumentFullscreen.bind(this);
        this.handleProgress = this.handleProgress.bind(this);
        this.handlePlaying = this.handlePlaying.bind(this);
        this.handleFullscreen = this.handleFullscreen.bind(this);
        this.initMainVideo = this.initMainVideo.bind(this);
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.handleVolume = this.handleVolume.bind(this);
        this.handleMuted = this.handleMuted.bind(this);
        this.handleMouseActivity = this.handleMouseActivity.bind(this);
    }

    public handleNone(event: any) {
        // Handler that stops the event
        event.preventDefault();
    }

    public setMainVideoElement(element: any) {
        this.mainVideoElement = element;
    }

    public setPlayerElement(element: any) {
        this.playerElement = element;
    }

    public setSecondaryVideoElement(element: any) {
        this.secondaryVideoElement = element;
    }

    public handleMouseActivity() {
        clearTimeout(this.mouseActivityTimer);
        this.setState({
            mouseActivity: true,
        });
        this.mouseActivityTimer = setTimeout(() => {
                this.setState({
                    mouseActivity: false
                });
            },
            5000
        );
    }

    public removeListeners() {
        document.removeEventListener(
            "fullscreenchange",
            this.handleDocumentFullscreen
        );
        document.removeEventListener(
            "mousemove",
            this.handleMouseActivity
        );

        this.mainVideoElement.removeEventListener(
            "loadedmetadata",
            this.initMainVideo,
        );
        this.mainVideoElement.removeEventListener(
            "contextmenu",
            this.handleNone,
        );
        this.mainVideoElement.removeEventListener(
            "timeupdate",
            this.handleProgress,
        );
        this.mainVideoElement.removeEventListener(
            "playing",
            this.handlePlaying,
        );
        this.mainVideoElement.removeEventListener(
            "pause",
            this.handlePlaying,
        );
        this.mainVideoElement.removeEventListener(
            "ended",
            this.handlePlaying,
        );
        this.mainVideoElement.removeEventListener(
            "canplay",
            this.handleCanPlay,
        );
    }

    public addListeners() {
        document.addEventListener(
            "fullscreenchange",
            this.handleDocumentFullscreen
        );
        document.addEventListener(
            "mousemove",
            this.handleMouseActivity
        );

        this.mainVideoElement.addEventListener(
            "contextmenu",
            this.handleNone,
        );
        this.mainVideoElement.addEventListener(
            "timeupdate",
            this.handleProgress,
        );
        this.mainVideoElement.addEventListener(
            "playing",
            this.handlePlaying,
        );
        this.mainVideoElement.addEventListener(
            "pause",
            this.handlePlaying,
        );
        this.mainVideoElement.addEventListener(
            "ended",
            this.handlePlaying,
        );
        this.mainVideoElement.addEventListener(
            "canplay",
            this.handleCanPlay,
        );
    }

    public initMainVideo() {
        console.log("init main video");
        this.setState({
            mainVideoInitialized: true,
            currentVolume: Math.round(this.mainVideoElement.volume * 100),
            muted: this.mainVideoElement.muted,
        })
        this.addListeners();
    }

    public handleDocumentFullscreen() {
        if (document.fullscreenElement &&
            document.fullscreenElement != this.playerElement
        ) {
            // Another element than the player is in fullscreen
            // so pass
            return;
        }

        this.setState({
            fullscreen: !!document.fullscreenElement,
        });
    }

    public handlePlaying() {
        const playing = (
            !this.mainVideoElement.paused &&
            !this.mainVideoElement.ended &&
            this.mainVideoElement.readyState > 2
        );
        this.setState({
            playing,
        });
    }

    public handleCanPlay() {
        this.setState({
            buffering: false,
        });
    }

    public handleFullscreen() {
        if (!this.state.fullscreen) {
            // Switch to full screen
            this.playerElement.requestFullscreen();
        } else {
            // Exit fullscreen
            document.exitFullscreen();
        }
    }

    public handleSeek(timecode: number) {
        this.setState({
            buffering: true,
        });
        this.mainVideoElement.currentTime = timecode / 1000;
    }

    public handlePlayPause() {
        if (this.state.playing) {
            this.mainVideoElement.pause();
        } else {
            this.mainVideoElement.play();
        }
    }

    public handleVolume(value: number) {
        this.mainVideoElement.volume = value / 100;
        this.setState({
            currentVolume: value,
        });
    }

    public handleMuted() {
        this.mainVideoElement.muted = !this.state.muted;
        this.setState({
            muted: !this.state.muted,
        });
    }

    public handleProgress() {
        this.setState({
            currentTime: Math.round(this.mainVideoElement.currentTime * 1000),
        });
    }

    public componentDidMount() {
        this.mainVideoElement.addEventListener(
            "loadedmetadata",
            this.initMainVideo,
        );

        // Launch mouse activity timer
        this.handleMouseActivity();
    }

    public componentWillUnmount() {
        this.removeListeners();
    }

    public render(): React.ReactElement<{}> {
        const { fullscreen } = this.state;

        const progressBar = document.getElementById("progressBar");
        const playerClassnames = [styles.player];

        if (this.state.fullscreen) {
            playerClassnames.push(styles.fullscreen);
        } else {
            playerClassnames.push(styles.minimal);
        }

        if (!this.state.mouseActivity) {
            playerClassnames.push(styles["no-mouse-activity"]);
        }

        if (this.state.buffering) {
            playerClassnames.push(styles["buffering"]);
        }

        return (
            <>
            <div ref={this.setPlayerElement}
                className={classnames(playerClassnames)}>
                <div className="video-wrapper">
                    <video ref={this.setMainVideoElement}>
                        <source src="https://asset-qa.womba.io/fovea/main.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="loader">
                        <svg viewBox={Loader.viewBox}>
                            <title>Buffering</title>
                            <use xlinkHref={"#" + Loader.id} />
                        </svg>
                    </div>
                </div>

                {this.state.mainVideoInitialized && (
                    <div style={{ width: "100%" }}>
                        <PlayerControlBar
                            duration={Math.round(this.mainVideoElement.duration * 1000)}
                            currentTime={this.state.currentTime}
                            currentVolume={this.state.currentVolume}
                            muted={this.state.muted}
                            playing={this.state.playing}
                            fullscreen={this.state.fullscreen}
                            playHandler={this.handlePlayPause}
                            pauseHandler={this.handlePlayPause}
                            seekHandler={this.handleSeek}
                            volumeHandler={this.handleVolume}
                            mutedHandler={this.handleMuted}
                            fullscreenHandler={this.handleFullscreen}
                            markerHandler={this.handleSeek}
                        />
                    </div>
                )}
            </div>
            </>
        );
        //             {/* <div className={classnames(this.state.lsf ? styles.player + " " + styles.lsf_player
        //                 : styles.lsf_player_hidden)}
        //             >
        //                 <video ref={this.setSecondaryVideoElement.bind(this)}>
        //                     <source src="https://asset-qa.womba.io/fovea/lsf.mp4" type="video/mp4" />
        //                     Your browser does not support the video tag.
        //                 </video>
        //             </div>
        //         </div> */}
        //         {false && (
        //             <div className={styles.options_root}>
        //                 <button onClick={this.handleSwitchLsf.bind(this)}>
        //                     LSF
        //                 </button>
        //                 <button>
        //                     Audio Description
        //                 </button>
        //                 <button onClick={this.handleSubtitleClick.bind(this)}>
        //                     ST
        //                 </button>
        //                 <button>
        //                     A a
        //                 </button>
        //                 <button>
        //                     Couleur
        //                 </button>
        //                 <div>
        //                     <label>Speed : {this.player.speed}</label>
        //                     <input
        //                         value={this.player.speed}
        //                         onChange={this.handleChangeSpeed.bind(this)}
        //                         max="200" min="50" type="range" />
        //                 </div>
        //                 <button>
        //                     Exercice
        //                 </button>
        //                 <button>
        //                     Voir aussi
        //                 </button>
        //                 <button>
        //                     Aide
        //                 </button>
        //             </div>
        //         )}
        // );
    }

    // private handleSwitchPlay(event: any) {
    //     if (!this.player.started) {
    //         this.player.play();
    //     } else {
    //         this.player.pause();
    //     }
    // }

    // private handleTimebarClick(event: any) {
    //     const x: number = event.pageX - event.target.getBoundingClientRect().left;
    //     const width: number = event.target.offsetWidth;
    //     const duration: number = this.player.duration;

    //     const newTimer: number = Math.floor(duration * (x / width));

    //     this.player.currentTime = newTimer;
    // }

    // private handleChangeSpeed(event: any) {
    //     const speed = event.target.value;

    //     this.player.speed = speed / 100;
    // }

    // private handleSwitchLsf() {
    //     if (this.state.lsf) {
    //         this.setState({ lsf: false });
    //     } else {
    //         this.setState({ lsf: true });
    //     }
    // }

    // private handleSubtitleClick() {
    //     this.subPlayer.displayTextTrack(this.textTrackUrl);
    // }

    // private handleMarkerClick(marker: Marker) {
    //     this.player.currentTime = marker.timecode;
    // }

    // private ticCallback(currentTime: number) {
    //     this.forceUpdate();
    // }
}
