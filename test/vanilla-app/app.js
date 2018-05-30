var mainManifestUrl = "https://dpk3dq0d69joz.cloudfront.net/origin/HLS_182427_0-VF-cenc.ism/stream.mpd";
var cuedSpeechManifestUrl = "https://s3-eu-west-1.amazonaws.com/vodstorage.arte.tv/fovea/182427/HLS_182427_0-LPC-16_9.mpd";
var signedLanguageManifestUrl = null;
var transcriptionUrl = "https://vodstorage.arte.tv/movies/VTT/182427/HLS_182427_0-VF-RETR.sjson";

var playerData = {
    mainVideo: {
        url: mainManifestUrl,
        player: "SHAKA",
        playerOptions: {
            shakaConfig: {
                drm: {
                    servers: {
                        "com.widevine.alpha": "http://widevine-dash.ezdrm.com/proxy?pX=BA5EDC",
                        "com.microsoft.playready": "http://playready.ezdrm.com/cency/preauth.aspx?pX=ED14D7"
                    }
                }
            },
            drmConfig: {
                additionalParams: {
                    contentId: "182427_0-VF",
                    username: "educarte_UaSYh1C0zi265k0wFaCDgw_14",
                }
            }
        }
    },
    cuedSpeechVideo: {
        url: cuedSpeechManifestUrl,
        player: "SHAKA",
    },
    transcription: {
        url: transcriptionUrl,
    },
    markers: [
        {
            id: "marker-1",
            title: "Marker 1",
            timecode: 21000,
        },
        {
            id: "marker-2",
            title: "Marker 2",
            timecode: 200000,
        },
    ]
};
var playerSettings = {
    locale: "fr",
};

avp
    .init(document.getElementById("player"), playerData, playerSettings)
        .then((avpInstance) => {
            avpInstance.markerManager.removeMarker("marker-2");
            avpInstance.settings.player.transcription.enabled = true;
        })
        .catch((err) => {;
            console.log(err);
        });
