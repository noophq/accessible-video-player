import * as React from "react";

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
import VolumeMutedIcon from "app/assets/icons/volume_muted.svg";

import { toPlayerTime } from "app/utils/time";

import * as styles from "app/assets/styles/player.css";

import ProgressBar from "./ProgressBar";

import * as classnames from "classnames";

interface PlayerControlBarProps {
    duration: number; // in milliseconds
    currentTime: number; // in milliseconds
    currentVolume: number; // Volume in percent
    muted: boolean; // Is the video muted
    playing: boolean; // Is video playing
    fullscreen: boolean; // Is video in fullscreen
    playHandler: any;
    pauseHandler: any;
    stopHandler?: any;
    rewindHandler?: any;
    forwardHandler?: any;
    seekHandler: any;
    volumeHandler: any;
    mutedHandler?: any;
    fullscreenHandler: any;
    markerHandler: any;
}

export default class PlayerControlBar extends React.Component<PlayerControlBarProps, undefined> {
    public constructor(props: PlayerControlBarProps) {
        super(props);

        this.handleSeek = this.handleSeek.bind(this);
        this.handleVideoProgressTooltip = this.handleVideoProgressTooltip.bind(this);
        this.handleVolume = this.handleVolume.bind(this);
        this.handleVolumeTooltip = this.handleVolumeTooltip.bind(this);
    }

    /** Returns progress value in percent */
    public getProgress() {
        return (this.props.currentTime / this.props.duration) * 100;
    }

    public getRemainingTime() {
        return this.props.duration - this.props.currentTime;
    }

    public handleSeek(progressValue: number) {
        // Get timecode in ms from progress value (in percent)
        const timecode = Math.round((this.props.duration * progressValue) / 100);
        this.props.seekHandler(timecode);
    }

    public handleVideoProgressTooltip(progressValue: number) {
        const timecode = Math.round((this.props.duration * progressValue) / 100);
        return toPlayerTime(timecode);
    }

    public handleVolume(value: number) {
        this.props.volumeHandler(value);
    }

    public handleVolumeTooltip(progressValue: number) {
        return Math.round(progressValue) + "%";
    }

    public render() {
        return (
            <div className="control-bar">
                <ProgressBar
                    className={styles['video-progress-bar']}
                    seekHandler={this.handleSeek}
                    tooltipHandler={this.handleVideoProgressTooltip}
                    currentValue={this.getProgress()}
                />
                <div className="bottom">
                    <div className="left">
                        {this.props.rewindHandler && (
                            <button onClick={this.props.rewindHandler.bind(this)}>
                                <svg viewBox={RewindIcon.viewBox}>
                                    <title>Fast Rewind</title>
                                    <use xlinkHref={"#" + RewindIcon.id} />
                                </svg>
                            </button>
                        )
                        }
                        {(this.props.playing) ? (
                            <button onClick={this.props.pauseHandler.bind(this)}>
                                <svg viewBox={PauseIcon.viewBox}>
                                    <title>Pause</title>
                                    <use xlinkHref={"#" + PauseIcon.id} />
                                </svg>
                            </button>
                        ) : (
                                <button onClick={this.props.playHandler.bind(this)}>
                                    <svg viewBox={PlayIcon.viewBox}>
                                        <title>Play</title>
                                        <use xlinkHref={"#" + PlayIcon.id} />
                                    </svg>
                                </button>
                            )
                        }
                        {this.props.forwardHandler && (
                            <button onClick={this.props.forwardHandler.bind(this)}>
                                <svg viewBox={ForwardIcon.viewBox}>
                                    <title>Fast Forward</title>
                                    <use xlinkHref={"#" + ForwardIcon.id} />
                                </svg>
                            </button>
                        )
                        }
                        {this.props.rewindHandler && (
                            <button onClick={this.props.rewindHandler.bind(this)}>
                                <svg viewBox={StopIcon.viewBox}>
                                    <title>Stop</title>
                                    <use xlinkHref={"#" + StopIcon.id} />
                                </svg>
                            </button>
                        )}


                        <div className="time">
                            <span className="start">
                                {toPlayerTime(this.props.currentTime)}
                            </span>
                            <span className="separator">/</span>
                            <span className="end">
                                {toPlayerTime(this.props.duration)}
                            </span>
                        </div>

                        <button
                            className={(this.props.muted) ? classnames("volume", "muted") : classnames("volume", "open")}
                            onClick={this.props.mutedHandler}
                        >
                            {(this.props.muted) ? (
                                <svg viewBox={VolumeMutedIcon.viewBox}>
                                    <title>Volume</title>
                                    <use xlinkHref={"#" + VolumeMutedIcon.id} />
                                </svg>
                            ) : (
                                    <svg viewBox={VolumeUpIcon.viewBox}>
                                        <title>Volume</title>
                                        <use xlinkHref={"#" + VolumeUpIcon.id} />
                                    </svg>
                                )
                            }
                        </button>

                        <ProgressBar
                            className={styles['volume-bar']}
                            seekHandler={this.handleVolume}
                            tooltipHandler={this.handleVolumeTooltip}
                            currentValue={this.props.currentVolume}
                        />
                    </div>

                    <div className="right">
                        <button onClick={this.props.fullscreenHandler}>
                            <svg viewBox={FullscreenIcon.viewBox}>
                                <title>Fullscreen</title>
                                <use xlinkHref={"#" + FullscreenIcon.id} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
