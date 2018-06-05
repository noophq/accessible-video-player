var mainManifestUrl = "https://dpk3dq0d69joz.cloudfront.net/origin/HLS_182427_0-VF-cenc.ism/stream.mpd";
var mainAudioDescriptionManifestUrl = "https://dpk3dq0d69joz.cloudfront.net/origin/HLS_182427_0-VFAUD-cenc.ism/stream.mpd";
var cuedSpeechManifestUrl = "https://s3-eu-west-1.amazonaws.com/vodstorage.arte.tv/fovea/182427/HLS_182427_0-LPC-16_9.mpd";
var signedLanguageManifestUrl = null;
var transcriptionUrl = "https://vodstorage.arte.tv/movies/VTT/182427/HLS_182427_0-VF-RETR.sjson";
var closedCaptionUrl = "https://s3-eu-west-1.amazonaws.com/vodstorage.arte.tv/movies/VTT/182427/HLS_182427_0-VF-STSM.xml";

function buildUrlWithQueryParams(url, params) {
    // Add additionalParams
    const queryStringParams = [];

    for (const key of Object.keys(params)) {
        queryStringParams.push(key + "=" + encodeURIComponent(params[key]))
    }

    const queryString = queryStringParams.join("&");

    if (url.indexOf("?") >= 0) {
        return url + "&" + queryString;
    } else {
        return url + "?" + queryString;
    }
}

var widevineRequestFilter = function(shakaPlayer, videoSource) {
    return function (type, request) {
        if (type !== shaka.net.NetworkingEngine.RequestType.LICENSE) {
            return
        }

        const drmServerUrl = videoSource.playerOptions.config.drm.servers["com.widevine.alpha"];

        if (!request.uris || request.uris[0] !== drmServerUrl) {
            return
        }

        if (shakaPlayer.drmInfo().keyIds.length <= 0) {
            throw new Error('No KID found in manifest.')
        }

        request.uris[0] = buildUrlWithQueryParams(
            request.uris[0],
            videoSource.additionalMetadata
        );
    }
 }

var playreadyRequestFilter = function(shakaPlayer, videoSource) {
    return function (type, request) {
        if (type !== shaka.net.NetworkingEngine.RequestType.LICENSE) {
            return
        }

        const drmServerUrl = videoSource.playerOptions.config.drm.servers["com.microsoft.playready"];

        if (!request.uris || request.uris[0] !== drmServerUrl) {
            return
        }
    }
 }

var shakaPlayerOptions = {
    requestFilters: [
        widevineRequestFilter,
        playreadyRequestFilter
    ],
    config: {
        drm: {
            servers: {
                "com.widevine.alpha": "http://widevine-dash.ezdrm.com/proxy?pX=BA5EDC",
                "com.microsoft.playready": "http://playready.ezdrm.com/cency/preauth.aspx?pX=ED14D7"
            }
        },
        streaming: {
            bufferingGoal: 60
        }
    }
};

var playerData = {
    mainVideo: {
        url: mainManifestUrl,
        player: "SHAKA",
        playerOptions: shakaPlayerOptions,
        additionalMetadata: {
            contentId: "182427_0-VF",
            username: "educarte_UaSYh1C0zi265k0wFaCDgw_14",
        }
    },
    mainAudioDescriptionVideo: {
        url: mainAudioDescriptionManifestUrl,
        player: "SHAKA",
        playerOptions: shakaPlayerOptions,
        additionalMetadata: {
            contentId: "182427_0-VFAUD",
            username: "educarte_UaSYh1C0zi265k0wFaCDgw_14",
        }
    },
    cuedSpeechVideo: {
        url: cuedSpeechManifestUrl,
        player: "SHAKA",
        playerOptions: {
            config: {
                abr: {
                    restrictions: {
                        maxHeight: 240
                    }
                },
                streaming: {
                    bufferingGoal: 60
                }
            }
        }
    },
    closedCaption: {
        url: closedCaptionUrl,
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
    player: {
        transcription: {
            enabled: false
        },
        thumbnail: {
            enabled: false
        }
    },
    language: {
        type: "DEFAULT"
    },
    subtitle: {
        type: "CLOSED_CAPTION"
    }
};

avp
    .init(document.getElementById("player"), playerSettings)
        .then((avpInstance) => {
            // avpInstance.markerManager.removeMarker("marker-2");
            // avpInstance.settingsManager.settings.player.transcription.enabled = true;
            // avpInstance.settingsManager.settings.language.type = "CUED_SPEECH";
            // avpInstance.settingsManager.settings.video.playbackSpeed = 1.5;
            // avpInstance.player.refreshUi();
            avpInstance.player.load(
                playerData
            );
        })
        .catch((err) => {;
            console.log(err);
        });
