import * as raf from "raf";

export class VideoManager {
    public started: boolean;

    private video: HTMLVideoElement;
    private LSFVideo: HTMLVideoElement;
    private ticCallback: (currentTime: number) => void;

    // Last timer bar refresh with raf
    private lastRefresh: number;

    public constructor(video: any, ticCallback: (currentTime: number) => void) {
        this.video = video;
        this.lastRefresh = Date.now();
        this.ticCallback = ticCallback;
    }

    public setLSFVideo(LSFVideo: any) {
        this.LSFVideo = LSFVideo;
        this.syncLSF();
    }

    public play() {
        raf(this.refreshVideo.bind(this));
        this.video.play();
        this.started = true;
        this.syncLSF();
    }

    public pause() {
        this.video.pause();
        this.started = false;
        this.syncLSF();
    }

    public syncLSF() {
        this.ticCallback(this.currentTime);
        if (this.LSFVideo) {
            if (this.started) {
                this.LSFVideo.play();
            } else {
                this.LSFVideo.pause();
            }
            this.LSFVideo.playbackRate = this.video.playbackRate;
            this.LSFVideo.currentTime = this.video.currentTime;
        }
    }

    public set currentTime(time: number) {
        this.video.currentTime = time;
        this.syncLSF();
    }
    public get currentTime() {
        return this.video.currentTime;
    }

    public set speed(speed: number) {
        this.video.playbackRate = speed;
        this.syncLSF();
    }

    public set volume(volume: number) {
        this.video.volume = volume;
    }

    public get duration() {
        return this.video.duration;
    }

    private refreshVideo() {
        if (this.lastRefresh < Date.now() - 500) {
            this.ticCallback(this.currentTime);
            this.lastRefresh = Date.now();
        }
        raf(this.refreshVideo.bind(this));
    }
}
