import EventHandler from '../event-handler'
import {getUrlForApp, arrayToString, stringToArray} from '../utils/PlayerUtils'
import {fairplayCertUrl, events as Event, CONTENT_URLS} from '../constants'

export default class FairplayExtension extends EventHandler {
    constructor(player) {
        super(player)

        this.mediaElement = player.skin.getVideoElement();
        this.fairplayId = null
        this.certificate = null
        this.keySession = null
        this.mediaUrl = null
        this.licenseUrl = null
        this.keySystem = 'com.apple.fps.1_0'

        this.init()
    }

    init() {
        this.mediaUrl = `${getUrlForApp(this.player.config)}${this.player.config.contentId}-fairplay.ism/stream.m3u8`
        this.getContentId().then(() => {
            this.licenseUrl = `https://fps.ezdrm.com/api/licenses/${this.fairplayId}?nothing=nothing&${this.player.config.licenceAdditionalParamQueryString}`
            this.getCertificate().then(() => {
                this.mediaElement.addEventListener('webkitneedkey', this.onWebkitNeedkey.bind(this))
                this.mediaElement.addEventListener('error', this.onError.bind(this))
                this.mediaElement.src = this.mediaUrl
            }).catch((err) => {
                console.error('Failed to load Fairplay cert', err)
            })
        }).catch((err) => {
            console.error('Failed to load Fairplay contentId', err)
        })
    }

    getContentId() {
        return new Promise((res, rej) => {

            let url = CONTENT_URLS[this.player.config.applicationDomain] + 'movies/FP/' + this.player.config.contentId  +'-fairplay.ism.id'

            let request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = () => {
                this.fairplayId = request.responseText;
                res(request.responseText)
            }
            request.onerror = (err) => { rej(err) }
            request.send();
        })
    }

    getCertificate() {
        return new Promise((res, rej) => {
            let req = new XMLHttpRequest()

            req.responseType = 'arraybuffer'
            req.open('GET', fairplayCertUrl, true)
            req.setRequestHeader('Pragma', 'Cache-Control: no-cache')
            req.setRequestHeader('Cache-Control', 'max-age=0')
            req.onload = () => {
                this.certificate = new Uint8Array(req.response)
                res()
            }
            req.onerror = (err) => { rej(err) }
            req.send()

        })
    }

    onWebkitNeedkey(e) {
        let initData = e.initData,
            contentId = this.extractContentId(initData)

        initData = this.concatInitDataIdAndCertificate(initData, contentId)

        if (!this.mediaElement.webkitKeys)
            this.mediaElement.webkitSetMediaKeys(new WebKitMediaKeys(this.keySystem));

        if (!this.mediaElement.webkitKeys)
            throw new Error("Could not create MediaKeys")

        this.keySession = this.mediaElement.webkitKeys.createSession("video/mp4", initData);
        if (!this.keySession)
            throw new Error("Could not create key session")

        this.keySession.contentId = contentId;
        this.keySession.addEventListener('webkitkeymessage', this.onKeyMessage.bind(this))
        this.keySession.addEventListener('webkitkeyadded', () => { this.player.trigger(Event.PLAYER_READY) })
    }

    onKeyMessage(e) {
        let message = e.message,
            blob = new Blob([message], { type: 'application/octet-binary' }),
            req = new XMLHttpRequest()

        req.session = e.target
        req.open('POST', `${this.licenseUrl}&p1=${Date.now()}`, true)
        req.setRequestHeader('Content-type', 'application/octet-stream')
        req.responseType = 'blob'

        req.onload = () => {
            if (req.status === 200) {
                let blob = req.response,
                    reader = new FileReader()

                reader.addEventListener('loadend', () => {
                    let arr = new Uint8Array(reader.result)
                    req.session.update(arr)
                    this.player.trigger(Event.TRACKS_LOADED, { tracks: [] })
                })

                reader.readAsArrayBuffer(blob)
            }
        }

        req.send(blob)
    }

    onError(e) {
        console.log('[FAIRPLAY] Error => ', e)
        console.error('[FairPlay] Video Error => ', e.srcElement.error);
    }

    extractContentId(initData) {
        let uri = arrayToString(initData),
            uriParts = uri.split('://', 1),
            protocol = uriParts[0].slice(-3)

        uriParts = uri.split(';', 2);
        let contentId = uriParts.length > 1 ? uriParts[1] : '';

        return protocol.toLowerCase() === 'skd' ? contentId : '';
    }

    concatInitDataIdAndCertificate(initData, id) {
        if (typeof id === "string")
            id = stringToArray(id);

        // layout is [initData][4 byte: idLength][idLength byte: id][4 byte:certLength][certLength byte: cert]
        let offset = 0,
            buffer = new ArrayBuffer(initData.byteLength + 4 + id.byteLength + 4 + this.certificate.byteLength),
            dataView = new DataView(buffer),
            initDataArray = new Uint8Array(buffer, offset, initData.byteLength);

        initDataArray.set(initData);
        offset += initData.byteLength;

        dataView.setUint32(offset, id.byteLength, true);
        offset += 4;

        let idArray = new Uint16Array(buffer, offset, id.length);
        idArray.set(id);
        offset += idArray.byteLength;

        dataView.setUint32(offset, this.certificate.byteLength, true);
        offset += 4;

        let certArray = new Uint8Array(buffer, offset, this.certificate.byteLength);
        certArray.set(this.certificate);

        return new Uint8Array(buffer, 0, buffer.byteLength);
    }
}
