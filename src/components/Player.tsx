import * as React from "react";

import * as Styles from "app/assets/styles/player.css";

import EqualizerIcon from "app/assets/icons/equalizer.svg";
import ForwardIcon from "app/assets/icons/fast_forward.svg";
import RewindIcon from "app/assets/icons/fast_rewind.svg";
import FullscreenIcon from "app/assets/icons/fullscreen.svg";
import FullscreenOffIcon from "app/assets/icons/fullscreen_off.svg";
import MarkerIcon from "app/assets/icons/marker.svg";
import PauseIcon from "app/assets/icons/pause.svg";
import PlayIcon from "app/assets/icons/play.svg";
import StopIcon from "app/assets/icons/stop.svg";
import VolumeDownIcon from "app/assets/icons/volume_down.svg";
import VolumeUpIcon from "app/assets/icons/volume_up.svg";

import { SubtitlePlayer, wrap } from "app/video-subtitle/lib";

import { VideoManager } from "app/utils/video-manager";

import { Marker } from "app/models/marker";

import * as classnames from "classnames";

interface States {
    lsf: boolean;
    subtitle: boolean;
    fullscreen: boolean;
}

export class Player extends React.Component<undefined, States> {
    private subPlayer: SubtitlePlayer;

    private player: VideoManager;

    private textTrackUrl =
    "https://raw.githubusercontent.com/noophq/html5-video-subtitle/master/test/resources/subtitles/test.xml";

    private markerList: Marker[] = [
        {
            timecode: 0,
            image: "https://cdn.pixabay.com/photo/2018/01/04/18/58/cats-3061372_960_720.jpg",
            title: "start",
        },
        {
            timecode: 60,
            image: "https://cdn.pixabay.com/photo/2017/10/01/00/43/rat-2804058_960_720.jpg",
            title: "other",
        },
        {
            timecode: 600,
            image: "https://cdn.pixabay.com/photo/2017/02/27/12/11/rat-2103087_960_720.jpg",
            title: "???",
        },
    ];

    public constructor() {
        super(undefined);

        this.state = {
            lsf: false,
            subtitle: false,
            fullscreen: false,
        };
    }

    public componentDidMount() {
        const video: any = document.getElementById("player");
        const lsfVideo = document.getElementById("lsfPlayer");
        this.subPlayer = wrap(video);

        this.player = new VideoManager(video, this.ticCallback.bind(this));
        this.player.setLSFVideo(lsfVideo);
    }

    public render(): React.ReactElement<{}> {
        const { fullscreen } = this.state;

        const progressBar = document.getElementById("progressBar");

        return (
            <div className={Styles.root}>
                <div id="video_container"
                    className={!fullscreen ? Styles.players_container : Styles.players_container_fullscreen}>
                    <div className={classnames(Styles.player, Styles.main_player,
                        this.state.lsf && !fullscreen && Styles.main_player_minified)}>
                        <video id="player">
                            <source src="https://asset-qa.womba.io/fovea/main.mp4" type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                        {this.player && (
                            <>
                                <div className={classnames(Styles.controls, fullscreen && Styles.controls_fullscreen)}>
                                    <button>
                                        <svg viewBox={RewindIcon.fast_rewind}>
                                            <title>Fast Rewind</title>
                                            <use xlinkHref={"#" + RewindIcon.id} />
                                        </svg>
                                    </button>
                                    <button onClick={this.handleSwitchPlay.bind(this)}>
                                        {this.player.started ? (
                                            <svg viewBox={PauseIcon.pause}>
                                                <title>Pause</title>
                                                <use xlinkHref={"#" + PauseIcon.id} />
                                            </svg>
                                        ) : (
                                            <svg viewBox={PlayIcon.play}>
                                                <title>Play</title>
                                                <use xlinkHref={"#" + PlayIcon.id} />
                                            </svg>
                                        )}
                                    </button>
                                    <button>
                                        <svg viewBox={ForwardIcon.fast_forward}>
                                            <title>Fast Forward</title>
                                            <use xlinkHref={"#" + ForwardIcon.id} />
                                        </svg>
                                    </button>

                                    <button>
                                        <svg viewBox={StopIcon.stop}>
                                            <title>Stop</title>
                                            <use xlinkHref={"#" + StopIcon.id} />
                                        </svg>
                                    </button>
                                    <button>
                                        <svg viewBox={PlayIcon.content_table}>
                                            <title>Menu</title>
                                            <use xlinkHref={"#" + PlayIcon.id} />
                                        </svg>
                                    </button>
                                    <div>
                                        <progress
                                            id="progressBar"
                                            onClick={this.handleTimebarClick.bind(this)}
                                            value={this.player.currentTime} max={this.player.duration}/>
                                        {progressBar && this.markerList.map((marker: Marker) => {
                                            const width: number = progressBar.offsetWidth;
                                            const duration: number = this.player.duration;

                                            return (
                                                <svg
                                                    className={Styles.marker}
                                                    viewBox={MarkerIcon.marker}
                                                    style={{
                                                        left: "calc(" +
                                                        (marker.timecode * width / duration) +
                                                        "px - 1.5rem)",
                                                    }}
                                                    onClick={this.handleMarkerClick.bind(this, marker)}
                                                >
                                                    <title>{marker.title}</title>
                                                    <use xlinkHref={"#" + MarkerIcon.id} />
                                                </svg>
                                            );
                                        })}
                                    </div>
                                    <span>
                                        {" -" + this.timeFormat(this.player.duration - this.player.currentTime)}
                                    </span>

                                    <svg viewBox={VolumeDownIcon.equalizer}>
                                        <title>Volume min</title>
                                        <use xlinkHref={"#" + VolumeDownIcon.id} />
                                    </svg>
                                    <input
                                        type="range"
                                        value={this.player.volume}
                                        min="0" max="100"
                                        onChange={this.handleVolumeChange.bind(this)}/>
                                    <svg viewBox={VolumeUpIcon.volume_up}>
                                        <title>Volume max</title>
                                        <use xlinkHref={"#" + VolumeUpIcon.id} />
                                    </svg>

                                    <button>
                                        <svg viewBox={EqualizerIcon.equalizer}>
                                            <title>Equalizer</title>
                                            <use xlinkHref={"#" + EqualizerIcon.id} />
                                        </svg>
                                    </button>
                                    <button onClick={this.handleSwitchFullscreen.bind(this)}>
                                    <svg viewBox={FullscreenIcon.fullscreen}>
                                        <title>Fullscreen</title>
                                        <use xlinkHref={"#" + FullscreenIcon.id} />
                                    </svg> </button>
                                </div>
                                <div className={Styles.marker_container}>
                                    {
                                        this.markerList.map((marker: Marker) => {
                                            return (
                                                <img
                                                    onClick={this.handleMarkerClick.bind(this, marker)}
                                                    src={marker.image}
                                                />
                                            );
                                        })
                                    }
                                </div>
                            </>
                        )}
                    </div>
                    <div className={classnames(this.state.lsf ? Styles.player + " " + Styles.lsf_player
                         : Styles.lsf_player_hidden)}
                    >
                        <video id="lsfPlayer">
                            <source src="https://asset-qa.womba.io/fovea/lsf.mp4" type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                {this.player && (
                    <div className={Styles.options_root}>
                        <button onClick={this.handleSwitchLsf.bind(this)}>
                            LSF
                        </button>
                        <button>
                            Audio Description
                        </button>
                        <button onClick={this.handleSubtitleClick.bind(this)}>
                            ST
                        </button>
                        <button>
                            A a
                        </button>
                        <button>
                            Couleur
                        </button>
                        <div>
                            <label>Speed : {this.player.speed}</label>
                            <input
                                value={this.player.speed}
                                onChange={this.handleChangeSpeed.bind(this)}
                                max="200" min="50" type="range"/>
                        </div>
                        <button>
                            Exercice
                        </button>
                        <button>
                            Voir aussi
                        </button>
                        <button>
                            Aide
                        </button>
                    </div>
                )}
            </div>
        );
    }

    private handleSwitchPlay(event: any) {
        if (!this.player.started) {
            this.player.play();
        } else {
            this.player.pause();
        }
    }

    private handleSwitchFullscreen() {
        const video: any = document.getElementById("video_container");

        if (this.state.fullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else {
                console.log("Fullscreen API is not supported.");
            }
        } else {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            } else {
                console.log("Fullscreen API is not supported.");
            }
        }

        this.setState({fullscreen: this.state.fullscreen});
    }

    private handleVolumeChange(event: any) {
        const volume = event.target.value;
        this.player.volume = volume / 100;
    }

    private timeFormat(time: number) {
        const hour: number = Math.floor(time / 3600);
        const minute: number = Math.floor(time / 60) - (hour * 60);
        const seconde: number = Math.floor(time - (hour * 3600) - (minute * 60));

        let str = "";

        if (hour > 0) {
            str += hour + ":";
        }

        if (minute.toString().length === 1 ) {
            str += "0";
        }

        str += minute + ":";

        if (seconde.toString().length === 1 ) {
            str += "0";
        }

        str += seconde;

        return str;
    }

    private handleTimebarClick(event: any) {
        const x: number = event.pageX - event.target.getBoundingClientRect().left;
        const width: number = event.target.offsetWidth;
        const duration: number = this.player.duration;

        const newTimer: number = Math.floor(duration * (x / width));

        this.player.currentTime = newTimer;
    }

    private handleChangeSpeed(event: any) {
        const speed = event.target.value;

        this.player.speed = speed / 100;
    }

    private handleSwitchLsf() {
        if (this.state.lsf) {
            this.setState({lsf: false});
        } else {
            this.setState({lsf: true});
        }
    }

    private handleSubtitleClick() {
        this.subPlayer.displayTextTrack(this.textTrackUrl);
    }

    private handleMarkerClick(marker: Marker) {
        this.player.currentTime = marker.timecode;
    }

    private ticCallback(currentTime: number) {
        this.forceUpdate();
    }
}
