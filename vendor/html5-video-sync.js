var videoSynchronizer=function(e){function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n,t){"use strict";function i(e,n){return new o.a(e,n)}Object.defineProperty(n,"__esModule",{value:!0}),n.sync=i;var o=t(1)},function(e,n,t){"use strict";t.d(n,"a",function(){return o});var i=t(2),o=(t.n(i),function(){function e(e,n){this.mainVideoElement=e,this.syncedVideoElements=n,this.syncDeviationThreshold=80,this.lastActions=[],this.rafCountSinceLastSyncFix=0,this.synchronizing=!1,this.handlePlay=this.handlePlay.bind(this),this.handlePause=this.handlePause.bind(this),this.handleSeek=this.handleSeek.bind(this),this.handleSynchronized=this.handleSynchronized.bind(this),this.handleSynchronizing=this.handleSynchronizing.bind(this),this.handleFixVideoSynchronization=this.handleFixVideoSynchronization.bind(this),this.initialize()}return e.prototype.initialize=function(){this.addMainVideoListeners(),this.addSyncedVideoListeners(),this.refresh()},e.prototype.destroy=function(){this.removeMainVideoListeners(),this.removeSyncedVideoListeners()},e.prototype.dispatchEvent=function(e,n){var t;"function"==typeof Event?t=new Event(n):(t=document.createEvent("Event"),t.initEvent(n,!1,!0)),e.dispatchEvent(t)},e.prototype.isSynced=function(){if(this.mainVideoElement.readyState<4)return!1;for(var e=0,n=this.syncedVideoElements;e<n.length;e++){var t=n[e],i=this.processSyncedVideoDeviation(t);if(console.log(i,t.readyState),i>this.syncDeviationThreshold)return!1;if(t.readyState<4)return!1}return!0},e.prototype.registerAction=function(e){this.synchronizing||(this.lastActions.unshift({timecode:1e3*this.mainVideoElement.currentTime,action:e}),this.lastActions=this.lastActions.slice(0,5))},e.prototype.dispatchSyncEvent=function(e){var n=this;this.dispatchEvent(this.mainVideoElement,e),this.syncedVideoElements.forEach(function(t){n.dispatchEvent(t,e)})},e.prototype.pauseAll=function(){console.log("pause all"),this.syncedVideoElements.forEach(function(e){e.pause()}),this.mainVideoElement.paused||this.mainVideoElement.pause()},e.prototype.playAll=function(){console.log("play all"),this.mainVideoElement.paused&&this.mainVideoElement.play(),this.syncedVideoElements.forEach(function(e){e.play()})},e.prototype.processSyncedVideoDeviation=function(e){return Math.abs(1e3*(this.mainVideoElement.currentTime-e.currentTime))},e.prototype.refresh=function(){var e=this;this.rafCountSinceLastSyncFix++>25&&(this.rafCountSinceLastSyncFix=0,this.testAndFixSync()),i(function(){e.refresh()})},e.prototype.testAndFixSync=function(){if(this.isSynced()){if(!this.synchronizing)return;return this.synchronizing=!1,this.dispatchSyncEvent("synchronized")}this.synchronizing||(this.synchronizing=!0,this.dispatchSyncEvent("synchronizing"));for(var e=0,n=this.syncedVideoElements;e<n.length;e++){var t=n[e];this.processSyncedVideoDeviation(t)>200&&this.pauseAll(),this.dispatchEvent(t,"fix-synchronization")}},e.prototype.handleFixVideoSynchronization=function(e){e.target.pause(),e.target.currentTime=this.mainVideoElement.currentTime},e.prototype.handleSynchronizing=function(){console.log("synchronizing")},e.prototype.wasPlayingBeforeSync=function(){if(0==this.lastActions.length)return!1;if("play"===this.lastActions[0].action)return!0;if(this.lastActions.length>2&&"seek"===this.lastActions[0].action)for(var e=this.lastActions[0].timecode,n=0,t=this.lastActions.slice(1);n<t.length;n++){var i=t[n];if(Math.abs(e-i.timecode)>500)return"play"===i.action}return!1},e.prototype.handleSynchronized=function(){console.log("synchronized",this.lastActions),this.wasPlayingBeforeSync()?this.mainVideoElement.play():this.mainVideoElement.pause()},e.prototype.handleSeek=function(){console.log("#seek"),this.registerAction("seek")},e.prototype.handlePlay=function(e){this.registerAction("play"),this.synchronizing&&e.preventDefault(),this.playAll()},e.prototype.handlePause=function(){this.registerAction("pause"),this.pauseAll()},e.prototype.addMainVideoListeners=function(){this.mainVideoElement.addEventListener("synchronizing",this.handleSynchronizing),this.mainVideoElement.addEventListener("synchronized",this.handleSynchronized),this.mainVideoElement.addEventListener("play",this.handlePlay),this.mainVideoElement.addEventListener("pause",this.handlePause),this.mainVideoElement.addEventListener("seeking",this.handleSeek)},e.prototype.removeMainVideoListeners=function(){this.mainVideoElement.removeEventListener("synchronizing",this.handleSynchronizing),this.mainVideoElement.removeEventListener("synchronized",this.handleSynchronized),this.mainVideoElement.removeEventListener("play",this.handlePlay),this.mainVideoElement.removeEventListener("pause",this.handlePause),this.mainVideoElement.removeEventListener("seeking",this.handleSeek)},e.prototype.addSyncedVideoListener=function(e){e.addEventListener("fix-synchronization",this.handleFixVideoSynchronization)},e.prototype.addSyncedVideoListeners=function(){var e=this;this.syncedVideoElements.forEach(function(n){e.addSyncedVideoListener(n)})},e.prototype.removeSyncedVideoListener=function(e){e.removeEventListener("fix-synchronization",this.handleFixVideoSynchronization)},e.prototype.removeSyncedVideoListeners=function(){var e=this;this.syncedVideoElements.forEach(function(n){e.removeSyncedVideoListener(n)})},e}())},function(e,n,t){(function(n){for(var i=t(4),o="undefined"==typeof window?n:window,r=["moz","webkit"],s="AnimationFrame",a=o["request"+s],c=o["cancel"+s]||o["cancelRequest"+s],h=0;!a&&h<r.length;h++)a=o[r[h]+"Request"+s],c=o[r[h]+"Cancel"+s]||o[r[h]+"CancelRequest"+s];if(!a||!c){var l=0,u=0,d=[];a=function(e){if(0===d.length){var n=i(),t=Math.max(0,1e3/60-(n-l));l=t+n,setTimeout(function(){var e=d.slice(0);d.length=0;for(var n=0;n<e.length;n++)if(!e[n].cancelled)try{e[n].callback(l)}catch(e){setTimeout(function(){throw e},0)}},Math.round(t))}return d.push({handle:++u,callback:e,cancelled:!1}),u},c=function(e){for(var n=0;n<d.length;n++)d[n].handle===e&&(d[n].cancelled=!0)}}e.exports=function(e){return a.call(o,e)},e.exports.cancel=function(){c.apply(o,arguments)},e.exports.polyfill=function(e){e||(e=o),e.requestAnimationFrame=a,e.cancelAnimationFrame=c}}).call(n,t(3))},function(e,n){var t;t=function(){return this}();try{t=t||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(t=window)}e.exports=t},function(e,n,t){(function(n){(function(){var t,i,o,r,s,a;"undefined"!=typeof performance&&null!==performance&&performance.now?e.exports=function(){return performance.now()}:void 0!==n&&null!==n&&n.hrtime?(e.exports=function(){return(t()-s)/1e6},i=n.hrtime,t=function(){var e;return e=i(),1e9*e[0]+e[1]},r=t(),a=1e9*n.uptime(),s=r-a):Date.now?(e.exports=function(){return Date.now()-o},o=Date.now()):(e.exports=function(){return(new Date).getTime()-o},o=(new Date).getTime())}).call(this)}).call(n,t(5))},function(e,n){function t(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function o(e){if(l===setTimeout)return setTimeout(e,0);if((l===t||!l)&&setTimeout)return l=setTimeout,setTimeout(e,0);try{return l(e,0)}catch(n){try{return l.call(null,e,0)}catch(n){return l.call(this,e,0)}}}function r(e){if(u===clearTimeout)return clearTimeout(e);if((u===i||!u)&&clearTimeout)return u=clearTimeout,clearTimeout(e);try{return u(e)}catch(n){try{return u.call(null,e)}catch(n){return u.call(this,e)}}}function s(){p&&f&&(p=!1,f.length?y=f.concat(y):m=-1,y.length&&a())}function a(){if(!p){var e=o(s);p=!0;for(var n=y.length;n;){for(f=y,y=[];++m<n;)f&&f[m].run();m=-1,n=y.length}f=null,p=!1,r(e)}}function c(e,n){this.fun=e,this.array=n}function h(){}var l,u,d=e.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:t}catch(e){l=t}try{u="function"==typeof clearTimeout?clearTimeout:i}catch(e){u=i}}();var f,y=[],p=!1,m=-1;d.nextTick=function(e){var n=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)n[t-1]=arguments[t];y.push(new c(e,n)),1!==y.length||p||o(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=h,d.addListener=h,d.once=h,d.off=h,d.removeListener=h,d.removeAllListeners=h,d.emit=h,d.prependListener=h,d.prependOnceListener=h,d.listeners=function(e){return[]},d.binding=function(e){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(e){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}}]);