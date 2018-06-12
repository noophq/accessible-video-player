var mainManifestUrl = "https://dpk3dq0d69joz.cloudfront.net/origin/HLS_182427_0-VF-cenc.ism/stream.mpd";
var mainAudioDescriptionManifestUrl = "https://dpk3dq0d69joz.cloudfront.net/origin/HLS_182427_0-VFAUD-cenc.ism/stream.mpd";
var cuedSpeechManifestUrl = "https://s3-eu-west-1.amazonaws.com/vodstorage.arte.tv/fovea/182427/HLS_182427_0-LPC-16_9.mpd";
var signedLanguageManifestUrl = "https://vodstorage.arte.tv/fovea/182427/HLS_182427_0-LPC-16_9_240p_dash.mpd";
var transcriptionUrl = "https://vodstorage.arte.tv/movies/VTT/182427/HLS_182427_0-VF-RETR.sjson";
var thumbnailCollectionUrl = "https://demo.noop.fr/fovea/avp/data/thumbnails.json";
var subtitleClosedCaptionUrl = "https://s3-eu-west-1.amazonaws.com/vodstorage.arte.tv/movies/VTT/182427/HLS_182427_0-VF-STSM.xml";
var subtitleTranscriptionUrl = "https://demo.noop.fr/fovea/avp/data/HLS_182427_0-VF-RETR.xml";

function buildUrlWithQueryParams(url, params) {
    // Add additionalParams
    var queryStringParams = [];
    var keys = Object.keys(params);

    for (var i=0; i<keys.length; i++) {
        var key = keys[i];
        queryStringParams.push(key + "=" + encodeURIComponent(params[key]))
    }

    var queryString = queryStringParams.join("&");

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

        var drmServerUrl = videoSource.playerOptions.config.drm.servers["com.widevine.alpha"];

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

        var drmServerUrl = videoSource.playerOptions.config.drm.servers["com.microsoft.playready"];

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

var shakaPlayerOptions = {
    requestFilters: [
        widevineRequestFilter,
        playreadyRequestFilter
    ],
    config: {
        drm: {
            servers: {
                "com.widevine.alpha": "https://widevine-dash.ezdrm.com/proxy?pX=BA5EDC",
                "com.microsoft.playready": "https://playready.ezdrm.com/cency/preauth.aspx?pX=ED14D7"
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
    signedLanguageVideo: {
        url: signedLanguageManifestUrl,
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
    subtitles: [
        {
            type: "CLOSED_CAPTION",
            url: subtitleClosedCaptionUrl,
        },
        {
            type: "TRANSCRIPTION",
            url: subtitleTranscriptionUrl,
        },
    ],
    transcription: {
        url: transcriptionUrl,
    },
    thumbnailCollection: {
        url: thumbnailCollectionUrl,
    }
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
    }
};

avp
    .init(document.getElementById("player"), playerSettings)
        .then(function(avpInstance) {
            // avpInstance.markerManager.removeMarker("marker-2");
            // avpInstance.settingsManager.settings.player.transcription.enabled = true;
            // avpInstance.settingsManager.settings.language.type = "CUED_SPEECH";
            // avpInstance.settingsManager.settings.video.playbackSpeed = 1.5;
            // avpInstance.player.refreshUi();
            avpInstance.player.load(
                playerData
            );
        })
        .catch(function(err) {;
            console.log(err);
        });
