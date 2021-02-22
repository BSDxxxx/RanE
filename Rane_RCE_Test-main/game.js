define("adapter-min.js", function(require, module, exports){
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function i(a, c, u) {
  function s(t, e) {
    if (!c[t]) {
      if (!a[t]) {
        var n = "function" == typeof require && require;if (!e && n) return n(t, !0);if (l) return l(t, !0);var r = new Error("Cannot find module '" + t + "'");throw r.code = "MODULE_NOT_FOUND", r;
      }var o = c[t] = { exports: {} };a[t][0].call(o.exports, function (e) {
        return s(a[t][1][e] || e);
      }, o, o.exports, i, a, c, u);
    }return c[t].exports;
  }for (var l = "function" == typeof require && require, e = 0; e < u.length; e++) {
    s(u[e]);
  }return s;
}({ 1: [function (e, t, n) {}, {}], 2: [function (e, t, n) {
    "use strict";
    var r = window.fsUtils,
        o = r.getUserDataPath,
        i = r.readJsonSync,
        c = r.makeDirSync,
        a = r.writeFileSync,
        s = r.copyFile,
        l = r.downloadFile,
        u = r.writeFile,
        f = r.deleteFile,
        d = r.rmdirSync,
        p = r.unzip,
        h = !1,
        m = null,
        g = !1,
        y = [],
        v = [],
        b = !1,
        w = /the maximum size of the file storage/,
        _ = 0,
        E = /^https?:\/\/.*/,
        x = { cacheDir: "gamecaches", cachedFileName: "cacheList.json", cacheEnabled: !0, autoClear: !0, cacheInterval: 500, deleteInterval: 500, writeFileInterval: 2e3, outOfStorage: !1, tempFiles: null, cachedFiles: null, cacheQueue: {}, version: "1.0", getCache: function getCache(e) {
        return this.cachedFiles.has(e) ? this.cachedFiles.get(e).url : "";
      }, getTemp: function getTemp(e) {
        return this.tempFiles.has(e) ? this.tempFiles.get(e) : "";
      }, init: function init() {
        this.cacheDir = o() + "/" + this.cacheDir;var e = this.cacheDir + "/" + this.cachedFileName,
            t = i(e);t instanceof Error || !t.version ? (t instanceof Error || d(this.cacheDir, !0), this.cachedFiles = new cc.AssetManager.Cache(), c(this.cacheDir, !0), a(e, JSON.stringify({ files: this.cachedFiles._map, version: this.version }), "utf8")) : this.cachedFiles = new cc.AssetManager.Cache(t.files), this.tempFiles = new cc.AssetManager.Cache();
      }, updateLastTime: function updateLastTime(e) {
        this.cachedFiles.has(e) && (this.cachedFiles.get(e).lastTime = Date.now());
      }, _write: function _write() {
        g = !(m = null), u(this.cacheDir + "/" + this.cachedFileName, JSON.stringify({ files: this.cachedFiles._map, version: this.version }), "utf8", function () {
          g = !1;for (var e = 0, t = v.length; e < t; e++) {
            v[e]();
          }v.length = 0, v.push.apply(v, y), y.length = 0;
        });
      }, writeCacheFile: function writeCacheFile(e) {
        m ? e && v.push(e) : (m = setTimeout(this._write.bind(this), this.writeFileInterval), !0 === g ? e && y.push(e) : e && v.push(e));
      }, _cache: function _cache() {
        var t = this;for (var n in this.cacheQueue) {
          var e = function e(_e) {
            if (h = !1, _e) {
              if (w.test(_e.message)) return t.outOfStorage = !0, void (t.autoClear && t.clearLRU());
            } else t.cachedFiles.add(n, { bundle: a, url: u, lastTime: c }), delete t.cacheQueue[n], t.writeCacheFile();cc.js.isEmptyObject(t.cacheQueue) || (h = !0, setTimeout(t._cache.bind(t), t.cacheInterval));
          },
              r = this.cacheQueue[n],
              o = r.srcUrl,
              i = r.isCopy,
              a = r.cacheBundleRoot,
              c = Date.now().toString(),
              u = "",
              u = a ? "".concat(this.cacheDir, "/").concat(a, "/").concat(c).concat(_++).concat(cc.path.extname(n)) : "".concat(this.cacheDir, "/").concat(c).concat(_++).concat(cc.path.extname(n));return void (i ? s(o, u, e) : l(o, u, null, e));
        }h = !1;
      }, cacheFile: function cacheFile(e, t, n, r, o) {
        !(n = void 0 !== n ? n : this.cacheEnabled) || this.cacheQueue[e] || this.cachedFiles.has(e) || (this.cacheQueue[e] = { srcUrl: t, cacheBundleRoot: r, isCopy: o }, h || (h = !0, this.outOfStorage ? h = !1 : setTimeout(this._cache.bind(this), this.cacheInterval)));
      }, clearCache: function clearCache() {
        var t = this;d(this.cacheDir, !0), this.cachedFiles = new cc.AssetManager.Cache(), c(this.cacheDir, !0);var e = this.cacheDir + "/" + this.cachedFileName;this.outOfStorage = !1, a(e, JSON.stringify({ files: this.cachedFiles._map, version: this.version }), "utf8"), cc.assetManager.bundles.forEach(function (e) {
          E.test(e.base) && t.makeBundleFolder(e.name);
        });
      }, clearLRU: function clearLRU() {
        if (!b) {
          b = !0;var n = [],
              r = this;if (this.cachedFiles.forEach(function (e, t) {
            "internal" !== e.bundle && (r._isZipFile(t) && cc.assetManager.bundles.has(e.bundle) || n.push({ originUrl: t, url: e.url, lastTime: e.lastTime }));
          }), n.sort(function (e, t) {
            return e.lastTime - t.lastTime;
          }), n.length = Math.floor(this.cachedFiles.count / 3), 0 !== n.length) {
            for (var e = 0, t = n.length; e < t; e++) {
              this.cachedFiles.remove(n[e].originUrl);
            }this.writeCacheFile(function () {
              setTimeout(function e() {
                var t = n.pop();r._isZipFile(t.originUrl) ? (d(t.url, !0), r._deleteFileCB()) : f(t.url, r._deleteFileCB.bind(r)), 0 < n.length ? setTimeout(e, r.deleteInterval) : b = !1;
              }, r.deleteInterval);
            });
          }
        }
      }, removeCache: function removeCache(e) {
        var t, n;this.cachedFiles.has(e) && (n = (t = this).cachedFiles.remove(e).url, this.writeCacheFile(function () {
          t._isZipFile(e) ? (d(n, !0), t._deleteFileCB()) : f(n, t._deleteFileCB.bind(t));
        }));
      }, _deleteFileCB: function _deleteFileCB(e) {
        e || (this.outOfStorage = !1);
      }, makeBundleFolder: function makeBundleFolder(e) {
        c(this.cacheDir + "/" + e, !0);
      }, unzipAndCacheBundle: function unzipAndCacheBundle(t, e, n, r) {
        var o = Date.now().toString(),
            i = "".concat(this.cacheDir, "/").concat(n, "/").concat(o).concat(_++),
            a = this;c(i, !0), p(e, i, function (e) {
          return e ? (d(i, !0), void (r && r(e))) : (a.cachedFiles.add(t, { bundle: n, url: i, lastTime: o }), a.writeCacheFile(), void (r && r(null, i)));
        });
      }, _isZipFile: function _isZipFile(e) {
        return ".zip" === e.slice(-4);
      } };cc.assetManager.cacheManager = t.exports = x;
  }, {}], 3: [function (e, t, n) {
    "use strict";
    var o,
        i,
        f = e("../cache-manager"),
        r = window.fsUtils,
        d = r.fs,
        p = r.downloadFile,
        a = r.readText,
        c = r.readArrayBuffer,
        u = r.readJson,
        h = r.loadSubpackage,
        m = r.getUserDataPath,
        g = /^https?:\/\/.*/,
        s = cc.assetManager.downloader,
        l = cc.assetManager.parser,
        y = cc.assetManager.presets,
        v = __globalAdapter.isSubContext;s.maxConcurrency = 8, s.maxRequestsPerFrame = 64, y.scene.maxConcurrency = 10, y.scene.maxRequestsPerFrame = 64;var b = {},
        w = {};function _(e, t, n) {
      "function" == typeof t && (n = t, t = null), g.test(e) ? n && n(new Error("Can not load remote scripts")) : (__cocos_require__(e), n && n(null));
    }function E(e, t, n) {
      "function" == typeof t && (n = t, t = null);var r = document.createElement("audio");r.src = e, n && n(null, r);
    }function x(r, t, o, e, i) {
      var n = F(r, o);n.inLocal ? t(n.url, o, i) : n.inCache ? (f.updateLastTime(r), t(n.url, o, function (e, t) {
        e && f.removeCache(r), i(e, t);
      })) : p(r, null, o.header, e, function (e, n) {
        e ? i(e, null) : t(n, o, function (e, t) {
          e || (f.tempFiles.add(r, n), f.cacheFile(r, n, o.cacheEnabled, o.__cacheBundleRoot__, !0)), i(e, t);
        });
      });
    }function S(e, t, n) {
      c(e, n);
    }function T(e, t, n) {
      a(e, n);
    }function N(e, t, n) {
      u(e, n);
    }var O = v ? function (e, t, n) {
      e = (e = F(e, t).url).slice(o.length + 1);var r = __cocos_require__(cc.path.changeExtname(e, ".js"));n && n(null, r);
    } : function (e, t, n) {
      x(e, N, t, t.onFileProgress, n);
    },
        M = v ? function (e, t, n) {
      n(null, "Arial");
    } : function (e, t, n) {
      n(null, __globalAdapter.loadFont(e) || "Arial");
    };function C(e, t, n) {
      n(null, e);
    }function A(e, t, n) {
      x(e, C, t, t.onFileProgress, n);
    }function D(e, n, r) {
      c(e, function (e, t) {
        return e ? r(e) : void I(t, n, r);
      });
    }function P(e, n, r) {
      c(e, function (e, t) {
        return e ? r(e) : void R(t, n, r);
      });
    }var I = l.parsePVRTex,
        R = l.parsePKMTex;var j = v ? function (e, t, n) {
      n(null, e = F(e, t).url);
    } : A;s.downloadDomAudio = E, s.downloadScript = _, l.parsePVRTex = D, l.parsePKMTex = P, s.register({ ".js": _, ".mp3": A, ".ogg": A, ".wav": A, ".m4a": A, ".png": j, ".jpg": j, ".bmp": j, ".jpeg": j, ".gif": j, ".ico": j, ".tiff": j, ".image": j, ".webp": j, ".pvr": A, ".pkm": A, ".font": A, ".eot": A, ".ttf": A, ".woff": A, ".svg": A, ".ttc": A, ".txt": A, ".xml": A, ".vsh": A, ".fsh": A, ".atlas": A, ".tmx": A, ".tsx": A, ".plist": A, ".fnt": A, ".json": O, ".ExportJson": A, ".binary": A, ".bin": A, ".dbbin": A, ".skel": A, ".mp4": A, ".avi": A, ".mov": A, ".mpg": A, ".mpeg": A, ".rm": A, ".rmvb": A, bundle: function bundle(e, u, s) {
        var t,
            l,
            n,
            r = cc.path.basename(e),
            o = u.version || cc.assetManager.downloader.bundleVers[r];b[r] ? (n = "subpackages/".concat(r, "/config.").concat(o ? o + "." : "", "json"), h(r, u.onFileProgress, function (e) {
          e ? s(e, null) : O(n, u, function (e, t) {
            t && (t.base = "subpackages/".concat(r, "/")), s(e, t);
          });
        })) : (g.test(e) || !v && e.startsWith(m()) ? (l = e, t = "src/scripts/".concat(r, "/index.js"), f.makeBundleFolder(r)) : w[r] ? (l = "".concat(i, "remote/").concat(r), t = "src/scripts/".concat(r, "/index.js"), f.makeBundleFolder(r)) : (l = "assets/".concat(r), t = "assets/".concat(r, "/index.js")), __cocos_require__(t), u.__cacheBundleRoot__ = r, n = "".concat(l, "/config.").concat(o ? o + "." : "", "json"), O(n, u, function (e, o) {
          var t, n, r, i, a, c;e ? s && s(e) : o.isZip ? (t = o.zipVersion, n = "".concat(l, "/res.").concat(t ? t + "." : "", "zip"), r = n, i = u, a = function a(e, t) {
            var n, r;e ? s && s(e) : (o.base = t + "/res/", (n = cc.sys).platform === n.ALIPAY_GAME && n.os === n.OS_ANDROID && (r = t + "res/", d.accessSync({ path: r }) && (o.base = r)), s && s(null, o));
          }, (c = f.cachedFiles.get(r)) ? (f.updateLastTime(r), a && a(null, c.url)) : g.test(r) ? p(r, null, i.header, i.onFileProgress, function (e, t) {
            e ? a && a(e) : f.unzipAndCacheBundle(r, t, i.__cacheBundleRoot__, a);
          }) : f.unzipAndCacheBundle(r, r, i.__cacheBundleRoot__, a)) : (o.base = l + "/", s && s(null, o));
        }));
      }, default: function _default(e, t, n) {
        x(e, T, t, t.onFileProgress, n);
      } }), l.register({ ".png": s.downloadDomImage, ".jpg": s.downloadDomImage, ".bmp": s.downloadDomImage, ".jpeg": s.downloadDomImage, ".gif": s.downloadDomImage, ".ico": s.downloadDomImage, ".tiff": s.downloadDomImage, ".image": s.downloadDomImage, ".webp": s.downloadDomImage, ".pvr": D, ".pkm": P, ".font": M, ".eot": M, ".ttf": M, ".woff": M, ".svg": M, ".ttc": M, ".mp3": E, ".ogg": E, ".wav": E, ".m4a": E, ".txt": T, ".xml": T, ".vsh": T, ".fsh": T, ".atlas": T, ".tmx": T, ".tsx": T, ".fnt": T, ".plist": function plist(e, t, r) {
        a(e, function (e, t) {
          var n = null;e || (n = cc.plistParser.parse(t)) || (e = new Error("parse failed")), r && r(e, n);
        });
      }, ".binary": S, ".bin": S, ".dbbin": S, ".skel": S, ".ExportJson": N });var L,
        F = v ? function (e, t) {
      return g.test(e) || (e = o + "/" + e), { url: e };
    } : function (e, t) {
      var n,
          r,
          o = !1,
          i = !1;return !e.startsWith(m()) && g.test(e) ? t.reload || ((n = f.cachedFiles.get(e)) ? (i = !0, e = n.url) : (r = f.tempFiles.get(e)) && (o = !0, e = r)) : o = !0, { url: e, inLocal: o, inCache: i };
    };v ? (L = cc.assetManager.init, cc.assetManager.init = function (e) {
      L.call(cc.assetManager, e), o = e.subContextRoot || "";
    }) : (cc.assetManager.transformPipeline.append(function (e) {
      for (var t = e.output = e.input, n = 0, r = t.length; n < r; n++) {
        var o = t[n],
            i = o.options;if (o.config) i.__cacheBundleRoot__ = o.config.name;else {
          if ("bundle" === o.ext) continue;i.cacheEnabled = void 0 !== i.cacheEnabled && i.cacheEnabled;
        }
      }
    }), L = cc.assetManager.init, cc.assetManager.init = function (e) {
      L.call(cc.assetManager, e), e.subpackages && e.subpackages.forEach(function (e) {
        return b[e] = "subpackages/" + e;
      }), e.remoteBundles && e.remoteBundles.forEach(function (e) {
        return w[e] = !0;
      }), (i = e.server || "") && !i.endsWith("/") && (i += "/"), f.init();
    });
  }, { "../cache-manager": 2 }], 4: [function (e, t, n) {
    "use strict";
    var r,
        o = cc._Audio;o && (r = o.prototype.getDuration, Object.assign(o.prototype, { _createElement: function _createElement() {
        var e = this._src._nativeAsset;this._element || (this._element = __globalAdapter.createInnerAudioContext()), this._element.src = e.src;
      }, destroy: function destroy() {
        this._element && (this._element.destroy(), this._element = null);
      }, setCurrentTime: function setCurrentTime(e) {
        var t = this;this._src && this._src._ensureLoaded(function () {
          t._element.seek(e);
        });
      }, stop: function stop() {
        var e = this;this._src && this._src._ensureLoaded(function () {
          e._element.seek(0), e._element.stop(), e._unbindEnded(), e.emit("stop"), e._state = o.State.STOPPED;
        });
      }, _bindEnded: function _bindEnded() {
        var e = this._element;e && e.onEnded && e.onEnded(this._onended);
      }, _unbindEnded: function _unbindEnded() {
        var e = this._element;e && e.offEnded && e.offEnded();
      }, getDuration: function getDuration() {
        return r.call(this) || (this._element ? this._element.duration : 0);
      }, _touchToPlay: function _touchToPlay() {}, _forceUpdatingState: function _forceUpdatingState() {} }));
  }, {}], 5: [function (e, t, n) {
    "use strict";
    cc && cc.audioEngine && (cc.audioEngine._maxAudioInstance = 10);
  }, {}], 6: [function (e, t, n) {
    "use strict";
    var r = cc.internal.inputManager,
        o = window.__globalAdapter;Object.assign(r, { setAccelerometerEnabled: function setAccelerometerEnabled(e) {
        var t = cc.director.getScheduler();t.enableForTarget(this), e ? (this._registerAccelerometerEvent(), t.scheduleUpdate(this)) : (this._unregisterAccelerometerEvent(), t.unscheduleUpdate(this));
      }, _registerAccelerometerEvent: function _registerAccelerometerEvent() {
        this._accelCurTime = 0;var t = this;this._acceleration = new cc.Acceleration(), o.startAccelerometer(function (e) {
          t._acceleration.x = e.x, t._acceleration.y = e.y, t._acceleration.z = e.y;
        });
      }, _unregisterAccelerometerEvent: function _unregisterAccelerometerEvent() {
        this._accelCurTime = 0, o.stopAccelerometer();
      } });
  }, {}], 7: [function (e, t, n) {
    "use strict";
    function r() {
      s.call(this), this._eventListeners = { onKeyboardInput: null, onKeyboardConfirm: null, onKeyboardComplete: null };
    }var o, i, a, c, u, s;cc && cc.EditBox && (o = cc.EditBox, i = cc.js, a = o.KeyboardReturnType, u = c = null, s = o._ImplClass, i.extend(r, s), o._ImplClass = r, Object.assign(r.prototype, { init: function init(e) {
        e ? this._delegate = e : cc.error("EditBox init failed");
      }, beginEditing: function beginEditing() {
        var t = this;this._editing || this._ensureKeyboardHide(function () {
          var e = t._delegate;t._showKeyboard(), t._registerKeyboardEvent(), t._editing = !0, u = t, e.editBoxEditingDidBegan();
        });
      }, endEditing: function endEditing() {
        this._hideKeyboard();var e = this._eventListeners;e.onKeyboardComplete && e.onKeyboardComplete();
      }, _registerKeyboardEvent: function _registerKeyboardEvent() {
        var n = this,
            r = this._delegate,
            e = this._eventListeners;e.onKeyboardInput = function (e) {
          r._string !== e.value && r.editBoxTextChanged(e.value);
        }, e.onKeyboardConfirm = function (e) {
          r.editBoxEditingReturn();var t = n._eventListeners;t.onKeyboardComplete && t.onKeyboardComplete();
        }, e.onKeyboardComplete = function () {
          n._editing = !1, u = null, n._unregisterKeyboardEvent(), r.editBoxEditingDidEnded();
        }, __globalAdapter.onKeyboardInput(e.onKeyboardInput), __globalAdapter.onKeyboardConfirm(e.onKeyboardConfirm), __globalAdapter.onKeyboardComplete(e.onKeyboardComplete);
      }, _unregisterKeyboardEvent: function _unregisterKeyboardEvent() {
        var e = this._eventListeners;e.onKeyboardInput && (__globalAdapter.offKeyboardInput(e.onKeyboardInput), e.onKeyboardInput = null), e.onKeyboardConfirm && (__globalAdapter.offKeyboardConfirm(e.onKeyboardConfirm), e.onKeyboardConfirm = null), e.onKeyboardComplete && (__globalAdapter.offKeyboardComplete(e.onKeyboardComplete), e.onKeyboardComplete = null);
      }, _otherEditing: function _otherEditing() {
        return !!u && u !== this && u._editing;
      }, _ensureKeyboardHide: function _ensureKeyboardHide(e) {
        var t = this._otherEditing();if (!t && !c) return e();c && clearTimeout(c), t && u.endEditing(), c = setTimeout(function () {
          c = null, e();
        }, 600);
      }, _showKeyboard: function _showKeyboard() {
        var e = this._delegate,
            t = e.inputMode === o.InputMode.ANY,
            n = e.maxLength < 0 ? 65535 : e.maxLength;__globalAdapter.showKeyboard({ defaultValue: e._string, maxLength: n, multiple: t, confirmHold: !1, confirmType: function (e) {
            switch (e) {case a.DEFAULT:case a.DONE:
                return "done";case a.SEND:
                return "send";case a.SEARCH:
                return "search";case a.GO:
                return "go";case a.NEXT:
                return "next";}return "done";
          }(e.returnType), success: function success() {}, fail: function fail(e) {
            cc.warn(e.errMsg);
          } });
      }, _hideKeyboard: function _hideKeyboard() {
        __globalAdapter.hideKeyboard({ success: function success() {}, fail: function fail(e) {
            cc.warn(e.errMsg);
          } });
      } }));
  }, {}], 8: [function (e, t, n) {
    "use strict";
    var r = cc.internal.inputManager,
        o = cc.renderer,
        i = cc.game,
        a = cc.dynamicAtlasManager,
        c = i.run;Object.assign(i, { _banRunningMainLoop: __globalAdapter.isSubContext, _firstSceneLaunched: !1, run: function run() {
        var e = this;cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
          e._firstSceneLaunched = !0;
        }), c.apply(this, arguments);
      }, setFrameRate: function setFrameRate(e) {
        this.config.frameRate = e, __globalAdapter.setPreferredFramesPerSecond ? __globalAdapter.setPreferredFramesPerSecond(e) : (this._intervalId && window.cancelAnimFrame(this._intervalId), this._intervalId = 0, this._paused = !0, this._setAnimFrame(), this._runMainLoop());
      }, _runMainLoop: function _runMainLoop() {
        var e, _t, n, r, o, i;this._banRunningMainLoop || (n = (e = this).config, r = cc.director, o = !0, i = n.frameRate, cc.debug.setDisplayStats(n.showFPS), _t = function t() {
          if (!e._paused) {
            if (e._intervalId = window.requestAnimFrame(_t), 30 === i && !__globalAdapter.setPreferredFramesPerSecond && (o = !o)) return;r.mainLoop();
          }
        }, e._intervalId = window.requestAnimFrame(_t), e._paused = !1);
      }, _initRenderer: function _initRenderer() {
        var e, t;this._rendererInitialized || (this.frame = this.container = document.createElement("DIV"), e = __globalAdapter.isSubContext ? window.sharedCanvas || __globalAdapter.getSharedCanvas() : canvas, this.canvas = e, this._determineRenderType(), this.renderType === this.RENDER_TYPE_WEBGL && (t = { stencil: !0, antialias: cc.macro.ENABLE_WEBGL_ANTIALIAS, alpha: cc.macro.ENABLE_TRANSPARENT_CANVAS, preserveDrawingBuffer: !1 }, o.initWebGL(e, t), this._renderContext = o.device._gl, !cc.macro.CLEANUP_IMAGE_CACHE && a && (a.enabled = !0)), this._renderContext || (this.renderType = this.RENDER_TYPE_CANVAS, o.initCanvas(e), this._renderContext = o.device._ctx), this._rendererInitialized = !0);
      }, _initEvents: function _initEvents() {
        this.config.registerSystemEvent && r.registerSystemEvent(this.canvas);var t = !1;function e() {
          t || (t = !0, i.emit(i.EVENT_HIDE));
        }function n(e) {
          t && (t = !1, i.emit(i.EVENT_SHOW, e));
        }__globalAdapter.onAudioInterruptionEnd && __globalAdapter.onAudioInterruptionEnd(n), __globalAdapter.onAudioInterruptionBegin && __globalAdapter.onAudioInterruptionBegin(e), __globalAdapter.onShow && __globalAdapter.onShow(n), __globalAdapter.onHide && __globalAdapter.onHide(e), this.on(i.EVENT_HIDE, function () {
          i.pause();
        }), this.on(i.EVENT_SHOW, function () {
          i.resume();
        });
      }, end: function end() {} });
  }, {}], 9: [function (e, t, n) {
    "use strict";
    var r = cc.internal.inputManager,
        o = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };r && Object.assign(r, { _updateCanvasBoundingRect: function _updateCanvasBoundingRect() {}, registerSystemEvent: function registerSystemEvent() {
        if (!this._isRegisterEvent) {
          this._glView = cc.view;var n = this,
              r = { onTouchStart: this.handleTouchesBegin, onTouchMove: this.handleTouchesMove, onTouchEnd: this.handleTouchesEnd, onTouchCancel: this.handleTouchesCancel };for (var e in r) {
            !function (e) {
              var t = r[e];__globalAdapter[e](function (e) {
                e.changedTouches && t.call(n, n.getTouchesByEvent(e, o));
              });
            }(e);
          }this._isRegisterEvent = !0;
        }
      } });
  }, {}], 10: [function (e, t, n) {
    "use strict";
    Object.assign(cc.screen, { autoFullScreen: function autoFullScreen() {} });
  }, {}], 11: [function (e, t, n) {
    "use strict";
    var r = cc.Texture2D;r && Object.assign(r.prototype, { initWithElement: function initWithElement(e) {
        e && (this._image = e, this.handleLoadedTexture());
      } });
  }, {}], 12: [function (e, t, n) {
    "use strict";
    t.exports = function (e, t) {
      t = t || __globalAdapter.getSystemInfoSync(), e.isNative = !1, e.isBrowser = !1, e.isMobile = !0, e.language = t.language.substr(0, 2), e.languageCode = t.language.toLowerCase();var n = t.system.toLowerCase(),
          r = t.platform;"android" === (r = r.toLowerCase()) ? e.os = e.OS_ANDROID : "ios" === r && (e.os = e.OS_IOS), "android p" === n && (n = "android p 9.0");var o = /[\d\.]+/.exec(n);e.osVersion = o ? o[0] : n, e.osMainVersion = parseInt(e.osVersion), e.browserType = null, e.browserVersion = null;var i = t.windowWidth,
          a = t.windowHeight,
          c = t.pixelRatio || 1;e.windowPixelResolution = { width: c * i, height: c * a }, e.localStorage = window.localStorage;var u = !__globalAdapter.isSubContext,
          s = !1;try {
        s = document.createElement("canvas").toDataURL("image/webp").startsWith("data:image/webp");
      } catch (e) {}e.capabilities = { canvas: !0, opengl: !!u, webp: s }, e.__audioSupport = { ONLY_ONE: !1, WEB_AUDIO: !1, DELAY_CREATE_CTX: !1, format: [".mp3"] };
    };
  }, {}], 13: [function (e, t, n) {
    "use strict";
    t.exports = function (e) {
      e._setupContainer = function (e, t, n) {
        var r,
            o = e._devicePixelRatio = 1;e.isRetinaEnabled() && (o = e._devicePixelRatio = Math.min(e._maxPixelRatio, window.devicePixelRatio || 1)), __globalAdapter.isSubContext || (t *= o, n *= o, (r = cc.game.canvas).width === t && r.height === n || (r.width = t, r.height = n));
      };
    };
  }, {}], 14: [function (e, t, n) {
    "use strict";
    t.exports = function (e) {
      Object.assign(e, { _adjustViewportMeta: function _adjustViewportMeta() {}, setRealPixelResolution: function setRealPixelResolution(e, t, n) {
          this.setDesignResolutionSize(e, t, n);
        }, enableAutoFullScreen: function enableAutoFullScreen() {
          cc.warn("cc.view.enableAutoFullScreen() is not supported on minigame platform.");
        }, isAutoFullScreenEnabled: function isAutoFullScreenEnabled() {
          return !1;
        }, setCanvasSize: function setCanvasSize() {
          cc.warn("cc.view.setCanvasSize() is not supported on minigame platform.");
        }, setFrameSize: function setFrameSize() {
          cc.warn("frame size is readonly on minigame platform.");
        }, _initFrameSize: function _initFrameSize() {
          var e,
              t = this._frameSize;__globalAdapter.isSubContext ? (e = window.sharedCanvas || __globalAdapter.getSharedCanvas(), t.width = e.width, t.height = e.height) : (t.width = window.innerWidth, t.height = window.innerHeight);
        } });
    };
  }, {}], 15: [function (e, t, n) {
    "use strict";
    var r = window.__globalAdapter;Object.assign(r, { adaptSys: e("./BaseSystemInfo"), adaptView: e("./View"), adaptContainerStrategy: e("./ContainerStrategy") });
  }, { "./BaseSystemInfo": 12, "./ContainerStrategy": 13, "./View": 14 }], 16: [function (e, t, n) {
    "use strict";
    e("./Audio"), e("./AudioEngine"), e("./DeviceMotionEvent"), e("./Editbox"), e("./Game"), e("./InputManager"), e("./AssetManager"), e("./Screen"), e("./Texture2D"), e("./misc");
  }, { "./AssetManager": 3, "./Audio": 4, "./AudioEngine": 5, "./DeviceMotionEvent": 6, "./Editbox": 7, "./Game": 8, "./InputManager": 9, "./Screen": 10, "./Texture2D": 11, "./misc": 17 }], 17: [function (e, t, n) {
    "use strict";
    cc.macro.DOWNLOAD_MAX_CONCURRENT = 10;
  }, {}], 18: [function (e, t, n) {
    "use strict";
    t.exports = { cloneMethod: function cloneMethod(e, t, n, r) {
        t[n] && (e[r = r || n] = t[n].bind(t));
      } };
  }, {}], 19: [function (e, t, n) {
    "use strict";
    function r(e) {
      this.options = e || { locator: {} };
    }function l() {
      this.cdata = !1;
    }function f(e, t) {
      t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber;
    }function d(e) {
      if (e) return "\n@" + (e.systemId || "") + "#[line:" + e.lineNumber + ",col:" + e.columnNumber + "]";
    }function o(e, t, n) {
      return "string" == typeof e ? e.substr(t, n) : e.length >= t + n || t ? new java.lang.String(e, t, n) + "" : e;
    }function p(e, t) {
      e.currentElement ? e.currentElement.appendChild(t) : e.doc.appendChild(t);
    }r.prototype.parseFromString = function (e, t) {
      var n = this.options,
          r = new m(),
          o = n.domBuilder || new l(),
          i = n.errorHandler,
          a = n.locator,
          c = n.xmlns || {},
          u = /\/x?html?$/.test(t),
          s = u ? h.entityMap : { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" };return a && o.setDocumentLocator(a), r.errorHandler = function (r, e, o) {
        if (!r) {
          if (e instanceof l) return e;r = e;
        }var i = {},
            a = r instanceof Function;function t(t) {
          var n = r[t];!n && a && (n = 2 == r.length ? function (e) {
            r(t, e);
          } : r), i[t] = n ? function (e) {
            n("[xmldom " + t + "]\t" + e + d(o));
          } : function () {};
        }return o = o || {}, t("warning"), t("error"), t("fatalError"), i;
      }(i, o, a), r.domBuilder = n.domBuilder || o, u && (c[""] = "http://www.w3.org/1999/xhtml"), c.xml = c.xml || "http://www.w3.org/XML/1998/namespace", e ? r.parse(e, c, s) : r.errorHandler.error("invalid doc source"), o.doc;
    }, l.prototype = { startDocument: function startDocument() {
        this.doc = new i().createDocument(null, null, null), this.locator && (this.doc.documentURI = this.locator.systemId);
      }, startElement: function startElement(e, t, n, r) {
        var o = this.doc,
            i = o.createElementNS(e, n || t),
            a = r.length;p(this, i), this.currentElement = i, this.locator && f(this.locator, i);for (var c = 0; c < a; c++) {
          var e = r.getURI(c),
              u = r.getValue(c),
              n = r.getQName(c),
              s = o.createAttributeNS(e, n);this.locator && f(r.getLocator(c), s), s.value = s.nodeValue = u, i.setAttributeNode(s);
        }
      }, endElement: function endElement() {
        var e = this.currentElement;e.tagName;this.currentElement = e.parentNode;
      }, startPrefixMapping: function startPrefixMapping() {}, endPrefixMapping: function endPrefixMapping() {}, processingInstruction: function processingInstruction(e, t) {
        var n = this.doc.createProcessingInstruction(e, t);this.locator && f(this.locator, n), p(this, n);
      }, ignorableWhitespace: function ignorableWhitespace() {}, characters: function characters(e, t, n) {
        var r;(e = o.apply(this, arguments)) && (r = this.cdata ? this.doc.createCDATASection(e) : this.doc.createTextNode(e), this.currentElement ? this.currentElement.appendChild(r) : /^\s*$/.test(e) && this.doc.appendChild(r), this.locator && f(this.locator, r));
      }, skippedEntity: function skippedEntity() {}, endDocument: function endDocument() {
        this.doc.normalize();
      }, setDocumentLocator: function setDocumentLocator(e) {
        (this.locator = e) && (e.lineNumber = 0);
      }, comment: function comment(e, t, n) {
        e = o.apply(this, arguments);var r = this.doc.createComment(e);this.locator && f(this.locator, r), p(this, r);
      }, startCDATA: function startCDATA() {
        this.cdata = !0;
      }, endCDATA: function endCDATA() {
        this.cdata = !1;
      }, startDTD: function startDTD(e, t, n) {
        var r,
            o = this.doc.implementation;o && o.createDocumentType && (r = o.createDocumentType(e, t, n), this.locator && f(this.locator, r), p(this, r));
      }, warning: function warning(e) {
        console.warn("[xmldom warning]\t" + e, d(this.locator));
      }, error: function error(e) {
        console.error("[xmldom error]\t" + e, d(this.locator));
      }, fatalError: function fatalError(e) {
        throw console.error("[xmldom fatalError]\t" + e, d(this.locator)), e;
      } }, "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function (e) {
      l.prototype[e] = function () {
        return null;
      };
    });var h = e("./entities"),
        m = e("./sax").XMLReader,
        i = n.DOMImplementation = e("./dom").DOMImplementation;n.XMLSerializer = e("./dom").XMLSerializer, n.DOMParser = r;
  }, { "./dom": 20, "./entities": 21, "./sax": 22 }], 20: [function (e, t, n) {
    "use strict";
    function d(e) {
      return (d = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }function r(e, t) {
      for (var n in e) {
        t[n] = e[n];
      }
    }function o(e, t) {
      var n = e.prototype;if (!(n instanceof t)) {
        var r = function r() {};for (var o in r.prototype = t.prototype, r = new r(), n) {
          r[o] = n[o];
        }e.prototype = n = r;
      }n.constructor != e && ("function" != typeof e && console.error("unknow Class:" + e), n.constructor = e);
    }var y = "http://www.w3.org/1999/xhtml",
        i = {},
        v = i.ELEMENT_NODE = 1,
        b = i.ATTRIBUTE_NODE = 2,
        w = i.TEXT_NODE = 3,
        _ = i.CDATA_SECTION_NODE = 4,
        E = i.ENTITY_REFERENCE_NODE = 5,
        x = (i.ENTITY_NODE = 6, i.PROCESSING_INSTRUCTION_NODE = 7),
        S = i.COMMENT_NODE = 8,
        T = i.DOCUMENT_NODE = 9,
        N = i.DOCUMENT_TYPE_NODE = 10,
        O = i.DOCUMENT_FRAGMENT_NODE = 11,
        a = (i.NOTATION_NODE = 12, {}),
        c = {};a.INDEX_SIZE_ERR = (c[1] = "Index size error", 1), a.DOMSTRING_SIZE_ERR = (c[2] = "DOMString size error", 2), a.HIERARCHY_REQUEST_ERR = (c[3] = "Hierarchy request error", 3), a.WRONG_DOCUMENT_ERR = (c[4] = "Wrong document", 4), a.INVALID_CHARACTER_ERR = (c[5] = "Invalid character", 5), a.NO_DATA_ALLOWED_ERR = (c[6] = "No data allowed", 6), a.NO_MODIFICATION_ALLOWED_ERR = (c[7] = "No modification allowed", 7), a.NOT_FOUND_ERR = (c[8] = "Not found", 8), a.NOT_SUPPORTED_ERR = (c[9] = "Not supported", 9), a.INUSE_ATTRIBUTE_ERR = (c[10] = "Attribute in use", 10), a.INVALID_STATE_ERR = (c[11] = "Invalid state", 11), a.SYNTAX_ERR = (c[12] = "Syntax error", 12), a.INVALID_MODIFICATION_ERR = (c[13] = "Invalid modification", 13), a.NAMESPACE_ERR = (c[14] = "Invalid namespace", 14), a.INVALID_ACCESS_ERR = (c[15] = "Invalid access", 15);function u(e, t) {
      var n;return t instanceof Error ? n = t : (n = this, Error.call(this, c[e]), this.message = c[e], Error.captureStackTrace && Error.captureStackTrace(this, u)), n.code = e, t && (this.message = this.message + ": " + t), n;
    }function p() {}function s(e, t) {
      this._node = e, this._refresh = t, l(this);
    }function l(e) {
      var t = e._node._inc || e._node.ownerDocument._inc;if (e._inc != t) {
        var n = e._refresh(e._node);for (var r in Z(e, "length", n.length), n) {
          e[r] = n[r];
        }e._inc = t;
      }
    }function h() {}function f(e, t) {
      for (var n = e.length; n--;) {
        if (e[n] === t) return n;
      }
    }function m(e, t, n, r) {
      var o, i, a, c;r ? t[f(t, r)] = n : t[t.length++] = n, !e || (o = (n.ownerElement = e).ownerDocument) && (r && I(o, e, r), a = e, c = n, (i = o) && i._inc++, "http://www.w3.org/2000/xmlns/" == c.namespaceURI && (a._nsMap[c.prefix ? c.localName : ""] = c.value));
    }function g(e, t, n) {
      var r = f(t, n);if (!(0 <= r)) throw u(8, new Error(e.tagName + "@" + n));for (var o, i = t.length - 1; r < i;) {
        t[r] = t[++r];
      }t.length = i, !e || (o = e.ownerDocument) && (I(o, e, n), n.ownerElement = null);
    }function M(e) {
      if (this._features = {}, e) for (var t in e) {
        this._features = e[t];
      }
    }function C() {}function A(e) {
      return ("<" == e ? "&lt;" : ">" == e && "&gt;") || "&" == e && "&amp;" || '"' == e && "&quot;" || "&#" + e.charCodeAt() + ";";
    }function D(e, t) {
      if (t(e)) return 1;if (e = e.firstChild) do {
        if (D(e, t)) return 1;
      } while (e = e.nextSibling);
    }function P() {}function I(e, t, n) {
      e && e._inc++, "http://www.w3.org/2000/xmlns/" == n.namespaceURI && delete t._nsMap[n.prefix ? n.localName : ""];
    }function R(e, t, n) {
      if (e && e._inc) {
        e._inc++;var r = t.childNodes;if (n) r[r.length++] = n;else {
          for (var o = t.firstChild, i = 0; o;) {
            o = (r[i++] = o).nextSibling;
          }r.length = i;
        }
      }
    }function j(e, t) {
      var n = t.previousSibling,
          r = t.nextSibling;return n ? n.nextSibling = r : e.firstChild = r, r ? r.previousSibling = n : e.lastChild = n, R(e.ownerDocument, e), t;
    }function L(e, t, n) {
      var r = t.parentNode;if (r && r.removeChild(t), t.nodeType === O) {
        var o = t.firstChild;if (null == o) return t;var i = t.lastChild;
      } else o = i = t;var a = n ? n.previousSibling : e.lastChild;for (o.previousSibling = a, i.nextSibling = n, a ? a.nextSibling = o : e.firstChild = o, null == n ? e.lastChild = i : n.previousSibling = i; o.parentNode = e, o !== i && (o = o.nextSibling);) {}return R(e.ownerDocument || e, e), t.nodeType == O && (t.firstChild = t.lastChild = null), t;
    }function F() {
      this._nsMap = {};
    }function k() {}function H() {}function B() {}function U() {}function W() {}function V() {}function K() {}function G() {}function q() {}function z() {}function $() {}function X() {}function Y(e, t) {
      var n,
          r = [],
          o = 9 == this.nodeType && this.documentElement || this,
          i = o.prefix,
          a = o.namespaceURI;return a && null == i && null == (i = o.lookupPrefix(a)) && (n = [{ namespace: a, prefix: null }]), Q(this, r, e, t, n), r.join("");
    }function J(e, t, n) {
      var r = e.prefix || "",
          o = e.namespaceURI;if ((r || o) && ("xml" !== r || "http://www.w3.org/XML/1998/namespace" !== o) && "http://www.w3.org/2000/xmlns/" != o) {
        for (var i = n.length; i--;) {
          var a = n[i];if (a.prefix == r) return a.namespace != o;
        }return 1;
      }
    }function Q(e, t, n, r, o) {
      if (r) {
        if (!(e = r(e))) return;if ("string" == typeof e) return void t.push(e);
      }switch (e.nodeType) {case v:
          o = o || [];var i = e.attributes,
              a = i.length,
              c = e.firstChild,
              u = e.tagName;n = y === e.namespaceURI || n, t.push("<", u);for (var s = 0; s < a; s++) {
            "xmlns" == (l = i.item(s)).prefix ? o.push({ prefix: l.localName, namespace: l.value }) : "xmlns" == l.nodeName && o.push({ prefix: "", namespace: l.value });
          }for (var l, f, d, p, s = 0; s < a; s++) {
            J(l = i.item(s), 0, o) && (f = l.prefix || "", d = l.namespaceURI, p = f ? " xmlns:" + f : " xmlns", t.push(p, '="', d, '"'), o.push({ prefix: f, namespace: d })), Q(l, t, n, r, o);
          }if (J(e, 0, o) && (f = e.prefix || "", d = e.namespaceURI, p = f ? " xmlns:" + f : " xmlns", t.push(p, '="', d, '"'), o.push({ prefix: f, namespace: d })), c || n && !/^(?:meta|link|img|br|hr|input)$/i.test(u)) {
            if (t.push(">"), n && /^script$/i.test(u)) for (; c;) {
              c.data ? t.push(c.data) : Q(c, t, n, r, o), c = c.nextSibling;
            } else for (; c;) {
              Q(c, t, n, r, o), c = c.nextSibling;
            }t.push("</", u, ">");
          } else t.push("/>");return;case T:case O:
          for (c = e.firstChild; c;) {
            Q(c, t, n, r, o), c = c.nextSibling;
          }return;case b:
          return t.push(" ", e.name, '="', e.value.replace(/[<&"]/g, A), '"');case w:
          return t.push(e.data.replace(/[<&]/g, A));case _:
          return t.push("<![CDATA[", e.data, "]]>");case S:
          return t.push("\x3c!--", e.data, "--\x3e");case N:
          var h,
              m = e.publicId,
              g = e.systemId;return t.push("<!DOCTYPE ", e.name), void (m ? (t.push(' PUBLIC "', m), g && "." != g && t.push('" "', g), t.push('">')) : g && "." != g ? t.push(' SYSTEM "', g, '">') : ((h = e.internalSubset) && t.push(" [", h, "]"), t.push(">")));case x:
          return t.push("<?", e.target, " ", e.data, "?>");case E:
          return t.push("&", e.nodeName, ";");default:
          t.push("??", e.nodeName);}
    }function Z(e, t, n) {
      e[t] = n;
    }u.prototype = Error.prototype, r(a, u), p.prototype = { length: 0, item: function item(e) {
        return this[e] || null;
      }, toString: function toString(e, t) {
        for (var n = [], r = 0; r < this.length; r++) {
          Q(this[r], n, e, t);
        }return n.join("");
      } }, s.prototype.item = function (e) {
      return l(this), this[e];
    }, o(s, p), h.prototype = { length: 0, item: p.prototype.item, getNamedItem: function getNamedItem(e) {
        for (var t = this.length; t--;) {
          var n = this[t];if (n.nodeName == e) return n;
        }
      }, setNamedItem: function setNamedItem(e) {
        var t = e.ownerElement;if (t && t != this._ownerElement) throw new u(10);var n = this.getNamedItem(e.nodeName);return m(this._ownerElement, this, e, n), n;
      }, setNamedItemNS: function setNamedItemNS(e) {
        var t,
            n = e.ownerElement;if (n && n != this._ownerElement) throw new u(10);return t = this.getNamedItemNS(e.namespaceURI, e.localName), m(this._ownerElement, this, e, t), t;
      }, removeNamedItem: function removeNamedItem(e) {
        var t = this.getNamedItem(e);return g(this._ownerElement, this, t), t;
      }, removeNamedItemNS: function removeNamedItemNS(e, t) {
        var n = this.getNamedItemNS(e, t);return g(this._ownerElement, this, n), n;
      }, getNamedItemNS: function getNamedItemNS(e, t) {
        for (var n = this.length; n--;) {
          var r = this[n];if (r.localName == t && r.namespaceURI == e) return r;
        }return null;
      } }, M.prototype = { hasFeature: function hasFeature(e, t) {
        var n = this._features[e.toLowerCase()];return !(!n || t && !(t in n));
      }, createDocument: function createDocument(e, t, n) {
        var r,
            o = new P();return o.implementation = this, o.childNodes = new p(), (o.doctype = n) && o.appendChild(n), t && (r = o.createElementNS(e, t), o.appendChild(r)), o;
      }, createDocumentType: function createDocumentType(e, t, n) {
        var r = new V();return r.name = e, r.nodeName = e, r.publicId = t, r.systemId = n, r;
      } }, C.prototype = { firstChild: null, lastChild: null, previousSibling: null, nextSibling: null, attributes: null, parentNode: null, childNodes: null, ownerDocument: null, nodeValue: null, namespaceURI: null, prefix: null, localName: null, insertBefore: function insertBefore(e, t) {
        return L(this, e, t);
      }, replaceChild: function replaceChild(e, t) {
        this.insertBefore(e, t), t && this.removeChild(t);
      }, removeChild: function removeChild(e) {
        return j(this, e);
      }, appendChild: function appendChild(e) {
        return this.insertBefore(e, null);
      }, hasChildNodes: function hasChildNodes() {
        return null != this.firstChild;
      }, cloneNode: function cloneNode(e) {
        return function e(t, n, r) {
          var o = new n.constructor();for (var i in n) {
            var a = n[i];"object" != d(a) && a != o[i] && (o[i] = a);
          }n.childNodes && (o.childNodes = new p());o.ownerDocument = t;switch (o.nodeType) {case v:
              var c = n.attributes,
                  u = o.attributes = new h(),
                  s = c.length;u._ownerElement = o;for (var l = 0; l < s; l++) {
                o.setAttributeNode(e(t, c.item(l), !0));
              }break;case b:
              r = !0;}if (r) for (var f = n.firstChild; f;) {
            o.appendChild(e(t, f, r)), f = f.nextSibling;
          }return o;
        }(this.ownerDocument || this, this, e);
      }, normalize: function normalize() {
        for (var e = this.firstChild; e;) {
          var t = e.nextSibling;t && t.nodeType == w && e.nodeType == w ? (this.removeChild(t), e.appendData(t.data)) : (e.normalize(), e = t);
        }
      }, isSupported: function isSupported(e, t) {
        return this.ownerDocument.implementation.hasFeature(e, t);
      }, hasAttributes: function hasAttributes() {
        return 0 < this.attributes.length;
      }, lookupPrefix: function lookupPrefix(e) {
        for (var t = this; t;) {
          var n = t._nsMap;if (n) for (var r in n) {
            if (n[r] == e) return r;
          }t = t.nodeType == b ? t.ownerDocument : t.parentNode;
        }return null;
      }, lookupNamespaceURI: function lookupNamespaceURI(e) {
        for (var t = this; t;) {
          var n = t._nsMap;if (n && e in n) return n[e];t = t.nodeType == b ? t.ownerDocument : t.parentNode;
        }return null;
      }, isDefaultNamespace: function isDefaultNamespace(e) {
        return null == this.lookupPrefix(e);
      } }, r(i, C), r(i, C.prototype), P.prototype = { nodeName: "#document", nodeType: T, doctype: null, documentElement: null, _inc: 1, insertBefore: function insertBefore(e, t) {
        if (e.nodeType != O) return null == this.documentElement && e.nodeType == v && (this.documentElement = e), L(this, e, t), e.ownerDocument = this, e;for (var n = e.firstChild; n;) {
          var r = n.nextSibling;this.insertBefore(n, t), n = r;
        }return e;
      }, removeChild: function removeChild(e) {
        return this.documentElement == e && (this.documentElement = null), j(this, e);
      }, importNode: function importNode(e, t) {
        return function e(t, n, r) {
          var o;switch (n.nodeType) {case v:
              (o = n.cloneNode(!1)).ownerDocument = t;case O:
              break;case b:
              r = !0;}o = o || n.cloneNode(!1);o.ownerDocument = t;o.parentNode = null;if (r) for (var i = n.firstChild; i;) {
            o.appendChild(e(t, i, r)), i = i.nextSibling;
          }return o;
        }(this, e, t);
      }, getElementById: function getElementById(t) {
        var n = null;return D(this.documentElement, function (e) {
          if (e.nodeType == v && e.getAttribute("id") == t) return n = e, !0;
        }), n;
      }, createElement: function createElement(e) {
        var t = new F();return t.ownerDocument = this, t.nodeName = e, t.tagName = e, t.childNodes = new p(), (t.attributes = new h())._ownerElement = t;
      }, createDocumentFragment: function createDocumentFragment() {
        var e = new z();return e.ownerDocument = this, e.childNodes = new p(), e;
      }, createTextNode: function createTextNode(e) {
        var t = new B();return t.ownerDocument = this, t.appendData(e), t;
      }, createComment: function createComment(e) {
        var t = new U();return t.ownerDocument = this, t.appendData(e), t;
      }, createCDATASection: function createCDATASection(e) {
        var t = new W();return t.ownerDocument = this, t.appendData(e), t;
      }, createProcessingInstruction: function createProcessingInstruction(e, t) {
        var n = new $();return n.ownerDocument = this, n.tagName = n.target = e, n.nodeValue = n.data = t, n;
      }, createAttribute: function createAttribute(e) {
        var t = new k();return t.ownerDocument = this, t.name = e, t.nodeName = e, t.localName = e, t.specified = !0, t;
      }, createEntityReference: function createEntityReference(e) {
        var t = new q();return t.ownerDocument = this, t.nodeName = e, t;
      }, createElementNS: function createElementNS(e, t) {
        var n = new F(),
            r = t.split(":"),
            o = n.attributes = new h();return n.childNodes = new p(), n.ownerDocument = this, n.nodeName = t, n.tagName = t, n.namespaceURI = e, 2 == r.length ? (n.prefix = r[0], n.localName = r[1]) : n.localName = t, o._ownerElement = n;
      }, createAttributeNS: function createAttributeNS(e, t) {
        var n = new k(),
            r = t.split(":");return n.ownerDocument = this, n.nodeName = t, n.name = t, n.namespaceURI = e, n.specified = !0, 2 == r.length ? (n.prefix = r[0], n.localName = r[1]) : n.localName = t, n;
      } }, o(P, C), P.prototype.getElementsByTagName = (F.prototype = { nodeType: v, hasAttribute: function hasAttribute(e) {
        return null != this.getAttributeNode(e);
      }, getAttribute: function getAttribute(e) {
        var t = this.getAttributeNode(e);return t && t.value || "";
      }, getAttributeNode: function getAttributeNode(e) {
        return this.attributes.getNamedItem(e);
      }, setAttribute: function setAttribute(e, t) {
        var n = this.ownerDocument.createAttribute(e);n.value = n.nodeValue = "" + t, this.setAttributeNode(n);
      }, removeAttribute: function removeAttribute(e) {
        var t = this.getAttributeNode(e);t && this.removeAttributeNode(t);
      }, appendChild: function appendChild(e) {
        return e.nodeType === O ? this.insertBefore(e, null) : function (e, t) {
          var n = t.parentNode;n && (r = e.lastChild, n.removeChild(t), r = e.lastChild);var r = e.lastChild;return t.parentNode = e, t.previousSibling = r, t.nextSibling = null, r ? r.nextSibling = t : e.firstChild = t, e.lastChild = t, R(e.ownerDocument, e, t), t;
        }(this, e);
      }, setAttributeNode: function setAttributeNode(e) {
        return this.attributes.setNamedItem(e);
      }, setAttributeNodeNS: function setAttributeNodeNS(e) {
        return this.attributes.setNamedItemNS(e);
      }, removeAttributeNode: function removeAttributeNode(e) {
        return this.attributes.removeNamedItem(e.nodeName);
      }, removeAttributeNS: function removeAttributeNS(e, t) {
        var n = this.getAttributeNodeNS(e, t);n && this.removeAttributeNode(n);
      }, hasAttributeNS: function hasAttributeNS(e, t) {
        return null != this.getAttributeNodeNS(e, t);
      }, getAttributeNS: function getAttributeNS(e, t) {
        var n = this.getAttributeNodeNS(e, t);return n && n.value || "";
      }, setAttributeNS: function setAttributeNS(e, t, n) {
        var r = this.ownerDocument.createAttributeNS(e, t);r.value = r.nodeValue = "" + n, this.setAttributeNode(r);
      }, getAttributeNodeNS: function getAttributeNodeNS(e, t) {
        return this.attributes.getNamedItemNS(e, t);
      }, getElementsByTagName: function getElementsByTagName(r) {
        return new s(this, function (t) {
          var n = [];return D(t, function (e) {
            e === t || e.nodeType != v || "*" !== r && e.tagName != r || n.push(e);
          }), n;
        });
      }, getElementsByTagNameNS: function getElementsByTagNameNS(r, o) {
        return new s(this, function (t) {
          var n = [];return D(t, function (e) {
            e === t || e.nodeType !== v || "*" !== r && e.namespaceURI !== r || "*" !== o && e.localName != o || n.push(e);
          }), n;
        });
      } }).getElementsByTagName, P.prototype.getElementsByTagNameNS = F.prototype.getElementsByTagNameNS, o(F, C), k.prototype.nodeType = b, o(k, C), H.prototype = { data: "", substringData: function substringData(e, t) {
        return this.data.substring(e, e + t);
      }, appendData: function appendData(e) {
        e = this.data + e, this.nodeValue = this.data = e, this.length = e.length;
      }, insertData: function insertData(e, t) {
        this.replaceData(e, 0, t);
      }, appendChild: function appendChild() {
        throw new Error(c[3]);
      }, deleteData: function deleteData(e, t) {
        this.replaceData(e, t, "");
      }, replaceData: function replaceData(e, t, n) {
        n = this.data.substring(0, e) + n + this.data.substring(e + t), this.nodeValue = this.data = n, this.length = n.length;
      } }, o(H, C), B.prototype = { nodeName: "#text", nodeType: w, splitText: function splitText(e) {
        var t = (n = this.data).substring(e),
            n = n.substring(0, e);this.data = this.nodeValue = n, this.length = n.length;var r = this.ownerDocument.createTextNode(t);return this.parentNode && this.parentNode.insertBefore(r, this.nextSibling), r;
      } }, o(B, H), U.prototype = { nodeName: "#comment", nodeType: S }, o(U, H), W.prototype = { nodeName: "#cdata-section", nodeType: _ }, o(W, H), V.prototype.nodeType = N, o(V, C), K.prototype.nodeType = 12, o(K, C), G.prototype.nodeType = 6, o(G, C), q.prototype.nodeType = E, o(q, C), z.prototype.nodeName = "#document-fragment", z.prototype.nodeType = O, o(z, C), $.prototype.nodeType = x, o($, C), X.prototype.serializeToString = function (e, t, n) {
      return Y.call(e, t, n);
    }, C.prototype.toString = Y;try {
      Object.defineProperty && (Object.defineProperty(s.prototype, "length", { get: function get() {
          return l(this), this.$$length;
        } }), Object.defineProperty(C.prototype, "textContent", { get: function get() {
          return function e(t) {
            switch (t.nodeType) {case v:case O:
                var n = [];for (t = t.firstChild; t;) {
                  7 !== t.nodeType && 8 !== t.nodeType && n.push(e(t)), t = t.nextSibling;
                }return n.join("");default:
                return t.nodeValue;}
          }(this);
        }, set: function set(e) {
          switch (this.nodeType) {case v:case O:
              for (; this.firstChild;) {
                this.removeChild(this.firstChild);
              }(e || String(e)) && this.appendChild(this.ownerDocument.createTextNode(e));break;default:
              this.data = e, this.value = e, this.nodeValue = e;}
        } }), Z = function Z(e, t, n) {
        e["$$" + t] = n;
      });
    } catch (e) {}n.DOMImplementation = M, n.XMLSerializer = X;
  }, {}], 21: [function (e, t, n) {
    "use strict";
    n.entityMap = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'", Agrave: "À", Aacute: "Á", Acirc: "Â", Atilde: "Ã", Auml: "Ä", Aring: "Å", AElig: "Æ", Ccedil: "Ç", Egrave: "È", Eacute: "É", Ecirc: "Ê", Euml: "Ë", Igrave: "Ì", Iacute: "Í", Icirc: "Î", Iuml: "Ï", ETH: "Ð", Ntilde: "Ñ", Ograve: "Ò", Oacute: "Ó", Ocirc: "Ô", Otilde: "Õ", Ouml: "Ö", Oslash: "Ø", Ugrave: "Ù", Uacute: "Ú", Ucirc: "Û", Uuml: "Ü", Yacute: "Ý", THORN: "Þ", szlig: "ß", agrave: "à", aacute: "á", acirc: "â", atilde: "ã", auml: "ä", aring: "å", aelig: "æ", ccedil: "ç", egrave: "è", eacute: "é", ecirc: "ê", euml: "ë", igrave: "ì", iacute: "í", icirc: "î", iuml: "ï", eth: "ð", ntilde: "ñ", ograve: "ò", oacute: "ó", ocirc: "ô", otilde: "õ", ouml: "ö", oslash: "ø", ugrave: "ù", uacute: "ú", ucirc: "û", uuml: "ü", yacute: "ý", thorn: "þ", yuml: "ÿ", nbsp: " ", iexcl: "¡", cent: "¢", pound: "£", curren: "¤", yen: "¥", brvbar: "¦", sect: "§", uml: "¨", copy: "©", ordf: "ª", laquo: "«", not: "¬", shy: "­­", reg: "®", macr: "¯", deg: "°", plusmn: "±", sup2: "²", sup3: "³", acute: "´", micro: "µ", para: "¶", middot: "·", cedil: "¸", sup1: "¹", ordm: "º", raquo: "»", frac14: "¼", frac12: "½", frac34: "¾", iquest: "¿", times: "×", divide: "÷", forall: "∀", part: "∂", exist: "∃", empty: "∅", nabla: "∇", isin: "∈", notin: "∉", ni: "∋", prod: "∏", sum: "∑", minus: "−", lowast: "∗", radic: "√", prop: "∝", infin: "∞", ang: "∠", and: "∧", or: "∨", cap: "∩", cup: "∪", int: "∫", there4: "∴", sim: "∼", cong: "≅", asymp: "≈", ne: "≠", equiv: "≡", le: "≤", ge: "≥", sub: "⊂", sup: "⊃", nsub: "⊄", sube: "⊆", supe: "⊇", oplus: "⊕", otimes: "⊗", perp: "⊥", sdot: "⋅", Alpha: "Α", Beta: "Β", Gamma: "Γ", Delta: "Δ", Epsilon: "Ε", Zeta: "Ζ", Eta: "Η", Theta: "Θ", Iota: "Ι", Kappa: "Κ", Lambda: "Λ", Mu: "Μ", Nu: "Ν", Xi: "Ξ", Omicron: "Ο", Pi: "Π", Rho: "Ρ", Sigma: "Σ", Tau: "Τ", Upsilon: "Υ", Phi: "Φ", Chi: "Χ", Psi: "Ψ", Omega: "Ω", alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", omicron: "ο", pi: "π", rho: "ρ", sigmaf: "ς", sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", chi: "χ", psi: "ψ", omega: "ω", thetasym: "ϑ", upsih: "ϒ", piv: "ϖ", OElig: "Œ", oelig: "œ", Scaron: "Š", scaron: "š", Yuml: "Ÿ", fnof: "ƒ", circ: "ˆ", tilde: "˜", ensp: " ", emsp: " ", thinsp: " ", zwnj: "‌", zwj: "‍", lrm: "‎", rlm: "‏", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", sbquo: "‚", ldquo: "“", rdquo: "”", bdquo: "„", dagger: "†", Dagger: "‡", bull: "•", hellip: "…", permil: "‰", prime: "′", Prime: "″", lsaquo: "‹", rsaquo: "›", oline: "‾", euro: "€", trade: "™", larr: "←", uarr: "↑", rarr: "→", darr: "↓", harr: "↔", crarr: "↵", lceil: "⌈", rceil: "⌉", lfloor: "⌊", rfloor: "⌋", loz: "◊", spades: "♠", clubs: "♣", hearts: "♥", diams: "♦" };
  }, {}], 22: [function (e, t, n) {
    "use strict";
    var r = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
        o = new RegExp("[\\-\\.0-9" + r.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]"),
        i = new RegExp("^" + r.source + o.source + "*(?::" + r.source + o.source + "*)?$"),
        A = 0,
        D = 1,
        P = 2,
        I = 3,
        R = 4,
        j = 5,
        L = 6,
        F = 7;function a() {}function k(e, t) {
      return t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber, t;
    }function H(e, t, n) {
      for (var r = e.tagName, o = null, i = e.length; i--;) {
        var a = e[i],
            c = a.qName,
            u = a.value,
            s = 0 < (f = c.indexOf(":")) ? (l = a.prefix = c.slice(0, f), d = c.slice(f + 1), "xmlns" === l && d) : (l = null, "xmlns" === (d = c) && "");a.localName = d, !1 !== s && (null == o && (o = {}, h(n, n = {})), n[s] = o[s] = u, a.uri = "http://www.w3.org/2000/xmlns/", t.startPrefixMapping(s, u));
      }for (var l, i = e.length; i--;) {
        (l = (a = e[i]).prefix) && ("xml" === l && (a.uri = "http://www.w3.org/XML/1998/namespace"), "xmlns" !== l && (a.uri = n[l || ""]));
      }var f,
          d = 0 < (f = r.indexOf(":")) ? (l = e.prefix = r.slice(0, f), e.localName = r.slice(f + 1)) : (l = null, e.localName = r),
          p = e.uri = n[l || ""];if (t.startElement(p, d, r, e), !e.closed) return e.currentNSMap = n, e.localNSMap = o, 1;if (t.endElement(p, d, r), o) for (l in o) {
        t.endPrefixMapping(l);
      }
    }function h(e, t) {
      for (var n in e) {
        t[n] = e[n];
      }
    }function B(e) {}a.prototype = { parse: function parse(e, t, n) {
        var r = this.domBuilder;r.startDocument(), h(t, t = {}), function (n, e, r, o, i) {
          function a(e) {
            var t = e.slice(1, -1);return t in r ? r[t] : "#" === t.charAt(0) ? function (e) {
              if (65535 < e) {
                var t = 55296 + ((e -= 65536) >> 10),
                    n = 56320 + (1023 & e);return String.fromCharCode(t, n);
              }return String.fromCharCode(e);
            }(parseInt(t.substr(1).replace("x", "0x"))) : (i.error("entity not found:" + e), e);
          }function t(e) {
            var t;h < e && (t = n.substring(h, e).replace(/&#?\w+;/g, a), f && c(h), o.characters(t, 0, e - h), h = e);
          }function c(e, t) {
            for (; s <= e && (t = l.exec(n));) {
              u = t.index, s = u + t[0].length, f.lineNumber++;
            }f.columnNumber = e - u + 1;
          }var u = 0,
              s = 0,
              l = /.*(?:\r\n?|\n)|.*$/g,
              f = o.locator,
              d = [{ currentNSMap: e }],
              p = {},
              h = 0;for (;;) {
            try {
              var m,
                  g,
                  y = n.indexOf("<", h);if (y < 0) return n.substr(h).match(/^\s*$/) || (m = o.doc, g = m.createTextNode(n.substr(h)), m.appendChild(g), o.currentElement = g);switch (h < y && t(y), n.charAt(y + 1)) {case "/":
                  var v = n.indexOf(">", y + 3),
                      b = n.substring(y + 2, v),
                      w = d.pop();v < 0 ? (b = n.substring(y + 2).replace(/[\s<].*/, ""), i.error("end tag name: " + b + " is not complete:" + w.tagName), v = y + 1 + b.length) : b.match(/\s</) && (b = b.replace(/[\s<].*/, ""), i.error("end tag name: " + b + " maybe not complete"), v = y + 1 + b.length);var _ = w.localNSMap,
                      E = w.tagName == b;if (E || w.tagName && w.tagName.toLowerCase() == b.toLowerCase()) {
                    if (o.endElement(w.uri, w.localName, b), _) for (var x in _) {
                      o.endPrefixMapping(x);
                    }E || i.fatalError("end tag name: " + b + " is not match the current start tagName:" + w.tagName);
                  } else d.push(w);v++;break;case "?":
                  f && c(y), v = function (e, t, n) {
                    var r = e.indexOf("?>", t);if (r) {
                      var o = e.substring(t, r).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);if (o) {
                        o[0].length;return n.processingInstruction(o[1], o[2]), r + 2;
                      }return -1;
                    }return -1;
                  }(n, y, o);break;case "!":
                  f && c(y), v = function (e, t, n, r) {
                    switch (e.charAt(t + 2)) {case "-":
                        if ("-" !== e.charAt(t + 3)) return -1;var o = e.indexOf("--\x3e", t + 4);return t < o ? (n.comment(e, t + 4, o - t - 4), o + 3) : (r.error("Unclosed comment"), -1);default:
                        if ("CDATA[" == e.substr(t + 3, 6)) {
                          o = e.indexOf("]]>", t + 9);return n.startCDATA(), n.characters(e, t + 9, o - t - 9), n.endCDATA(), o + 3;
                        }var i = function (e, t) {
                          var n,
                              r = [],
                              o = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;o.lastIndex = t, o.exec(e);for (; n = o.exec(e);) {
                            if (r.push(n), n[1]) return r;
                          }
                        }(e, t),
                            a = i.length;if (1 < a && /!doctype/i.test(i[0][0])) {
                          var c = i[1][0],
                              u = 3 < a && /^public$/i.test(i[2][0]) && i[3][0],
                              s = 4 < a && i[4][0],
                              l = i[a - 1];return n.startDTD(c, u && u.replace(/^(['"])(.*?)\1$/, "$2"), s && s.replace(/^(['"])(.*?)\1$/, "$2")), n.endDTD(), l.index + l[0].length;
                        }}return -1;
                  }(n, y, o, i);break;default:
                  f && c(y);var S = new B(),
                      T = d[d.length - 1].currentNSMap,
                      v = function (e, t, n, r, o, i) {
                    var a,
                        c = ++t,
                        u = A;for (;;) {
                      var s = e.charAt(c);switch (s) {case "=":
                          if (u === D) a = e.slice(t, c), u = I;else {
                            if (u !== P) throw new Error("attribute equal must after attrName");u = I;
                          }break;case "'":case '"':
                          if (u === I || u === D) {
                            if (u === D && (i.warning('attribute value must after "="'), a = e.slice(t, c)), t = c + 1, !(0 < (c = e.indexOf(s, t)))) throw new Error("attribute value no end '" + s + "' match");l = e.slice(t, c).replace(/&#?\w+;/g, o), n.add(a, l, t - 1), u = j;
                          } else {
                            if (u != R) throw new Error('attribute value must after "="');l = e.slice(t, c).replace(/&#?\w+;/g, o), n.add(a, l, t), i.warning('attribute "' + a + '" missed start quot(' + s + ")!!"), t = c + 1, u = j;
                          }break;case "/":
                          switch (u) {case A:
                              n.setTagName(e.slice(t, c));case j:case L:case F:
                              u = F, n.closed = !0;case R:case D:case P:
                              break;default:
                              throw new Error("attribute invalid close char('/')");}break;case "":
                          return i.error("unexpected end of input"), u == A && n.setTagName(e.slice(t, c)), c;case ">":
                          switch (u) {case A:
                              n.setTagName(e.slice(t, c));case j:case L:case F:
                              break;case R:case D:
                              "/" === (l = e.slice(t, c)).slice(-1) && (n.closed = !0, l = l.slice(0, -1));case P:
                              u === P && (l = a), u == R ? (i.warning('attribute "' + l + '" missed quot(")!!'), n.add(a, l.replace(/&#?\w+;/g, o), t)) : ("http://www.w3.org/1999/xhtml" === r[""] && l.match(/^(?:disabled|checked|selected)$/i) || i.warning('attribute "' + l + '" missed value!! "' + l + '" instead!!'), n.add(l, l, t));break;case I:
                              throw new Error("attribute value missed!!");}return c;case "":
                          s = " ";default:
                          if (s <= " ") switch (u) {case A:
                              n.setTagName(e.slice(t, c)), u = L;break;case D:
                              a = e.slice(t, c), u = P;break;case R:
                              var l = e.slice(t, c).replace(/&#?\w+;/g, o);i.warning('attribute "' + l + '" missed quot(")!!'), n.add(a, l, t);case j:
                              u = L;} else switch (u) {case P:
                              n.tagName;"http://www.w3.org/1999/xhtml" === r[""] && a.match(/^(?:disabled|checked|selected)$/i) || i.warning('attribute "' + a + '" missed value!! "' + a + '" instead2!!'), n.add(a, a, t), t = c, u = D;break;case j:
                              i.warning('attribute space is required"' + a + '"!!');case L:
                              u = D, t = c;break;case I:
                              u = R, t = c;break;case F:
                              throw new Error("elements closed character '/' and '>' must be connected to");}}c++;
                    }
                  }(n, y, S, T, a, i),
                      N = S.length;if (!S.closed && function (e, t, n, r) {
                    var o = r[n];null == o && ((o = e.lastIndexOf("</" + n + ">")) < t && (o = e.lastIndexOf("</" + n)), r[n] = o);return o < t;
                  }(n, v, S.tagName, p) && (S.closed = !0, r.nbsp || i.warning("unclosed xml attribute")), f && N) {
                    for (var O = k(f, {}), M = 0; M < N; M++) {
                      var C = S[M];c(C.offset), C.locator = k(f, {});
                    }o.locator = O, H(S, o, T) && d.push(S), o.locator = f;
                  } else H(S, o, T) && d.push(S);"http://www.w3.org/1999/xhtml" !== S.uri || S.closed ? v++ : v = function (e, t, n, r, o) {
                    if (/^(?:script|textarea)$/i.test(n)) {
                      var i = e.indexOf("</" + n + ">", t),
                          a = e.substring(t + 1, i);if (/[&<]/.test(a)) return (/^script$/i.test(n) || (a = a.replace(/&#?\w+;/g, r)), o.characters(a, 0, a.length), i
                      );
                    }return t + 1;
                  }(n, v, S.tagName, a, o);}
            } catch (e) {
              i.error("element parse error: " + e), v = -1;
            }h < v ? h = v : t(Math.max(y, h) + 1);
          }
        }(e, t, n, r, this.errorHandler), r.endDocument();
      } }, B.prototype = { setTagName: function setTagName(e) {
        if (!i.test(e)) throw new Error("invalid tagName:" + e);this.tagName = e;
      }, add: function add(e, t, n) {
        if (!i.test(e)) throw new Error("invalid attribute:" + e);this[this.length++] = { qName: e, value: t, offset: n };
      }, length: 0, getLocalName: function getLocalName(e) {
        return this[e].localName;
      }, getLocator: function getLocator(e) {
        return this[e].locator;
      }, getQName: function getQName(e) {
        return this[e].qName;
      }, getURI: function getURI(e) {
        return this[e].uri;
      }, getValue: function getValue(e) {
        return this[e].value;
      } }, n.XMLReader = a;
  }, {}], 23: [function (e, t, n) {
    "use strict";
    var r = GameGlobal,
        o = r.__globalAdapter = {};Object.assign(o, { init: function init() {
        e("./wrapper/builtin"), r.DOMParser = e("../../common/xmldom/dom-parser").DOMParser, e("./wrapper/unify"), e("./wrapper/fs-utils"), e("../../common/engine/globalAdapter"), e("./wrapper/systemInfo");
      }, adaptEngine: function adaptEngine() {
        e("./wrapper/error-reporter"), e("../../common/engine"), e("./wrapper/engine"), e("./wrapper/sub-context-adapter");
      } });
  }, { "../../common/engine": 16, "../../common/engine/globalAdapter": 15, "../../common/xmldom/dom-parser": 19, "./wrapper/builtin": 46, "./wrapper/engine": 52, "./wrapper/error-reporter": 54, "./wrapper/fs-utils": 55, "./wrapper/sub-context-adapter": 1, "./wrapper/systemInfo": 56, "./wrapper/unify": 57 }], 24: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r,
        i = (r = e("./HTMLAudioElement")) && r.__esModule ? r : { default: r };function c(e) {
      return (c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }function a(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }function u(e, t, n) {
      return (u = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (e, t, n) {
        var r = function (e, t) {
          for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = f(e));) {}return e;
        }(e, t);if (r) {
          var o = Object.getOwnPropertyDescriptor(r, t);return o.get ? o.get.call(n) : o.value;
        }
      })(e, t, n || e);
    }function s(e, t) {
      return (s = Object.setPrototypeOf || function (e, t) {
        return e.__proto__ = t, e;
      })(e, t);
    }function l(i) {
      var a = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;if (Reflect.construct.sham) return !1;if ("function" == typeof Proxy) return !0;try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }();return function () {
        var e,
            t,
            n,
            r,
            o = f(i);return t = a ? (e = f(this).constructor, Reflect.construct(o, arguments, e)) : o.apply(this, arguments), n = this, !(r = t) || "object" !== c(r) && "function" != typeof r ? function (e) {
          if (void 0 !== e) return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }(n) : r;
      };
    }function f(e) {
      return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
        return e.__proto__ || Object.getPrototypeOf(e);
      })(e);
    }var d = 0,
        p = 1,
        h = 2,
        m = 3,
        g = 4,
        y = 1,
        v = {},
        o = function () {
      !function (e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && s(e, t);
      }(o, i["default"]);var e,
          t,
          n,
          r = l(o);function o(e) {
        var t;!function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, o), (t = r.call(this))._$sn = y++, t.HAVE_NOTHING = d, t.HAVE_METADATA = p, t.HAVE_CURRENT_DATA = h, t.HAVE_FUTURE_DATA = m, t.HAVE_ENOUGH_DATA = g, t.readyState = d;var n = wx.createInnerAudioContext();return v[t._$sn] = n, t._canplayEvents = ["load", "loadend", "canplay", "canplaythrough", "loadedmetadata"], n.onCanplay(function () {
          t._loaded = !0, t.readyState = t.HAVE_CURRENT_DATA, t._canplayEvents.forEach(function (e) {
            t.dispatchEvent({ type: e });
          });
        }), n.onPlay(function () {
          t._paused = v[t._$sn].paused, t.dispatchEvent({ type: "play" });
        }), n.onPause(function () {
          t._paused = v[t._$sn].paused, t.dispatchEvent({ type: "pause" });
        }), n.onEnded(function () {
          t._paused = v[t._$sn].paused, !1 === v[t._$sn].loop && t.dispatchEvent({ type: "ended" }), t.readyState = g;
        }), n.onError(function () {
          t._paused = v[t._$sn].paused, t.dispatchEvent({ type: "error" });
        }), e ? t.src = e : t._src = "", t._loop = n.loop, t._autoplay = n.autoplay, t._paused = n.paused, t._volume = n.volume, t._muted = !1, t;
      }return e = o, (t = [{ key: "addEventListener", value: function value(e, t, n) {
          var r = 2 < arguments.length && void 0 !== n ? n : {};u(f(o.prototype), "addEventListener", this).call(this, e, t, r), e = String(e).toLowerCase(), this._loaded && -1 !== this._canplayEvents.indexOf(e) && this.dispatchEvent({ type: e });
        } }, { key: "load", value: function value() {} }, { key: "play", value: function value() {
          v[this._$sn].play();
        } }, { key: "resume", value: function value() {
          v[this._$sn].resume();
        } }, { key: "pause", value: function value() {
          v[this._$sn].pause();
        } }, { key: "stop", value: function value() {
          v[this._$sn].stop();
        } }, { key: "destroy", value: function value() {
          v[this._$sn].destroy();
        } }, { key: "canPlayType", value: function value(e) {
          var t = 0 < arguments.length && void 0 !== e ? e : "";return "string" == typeof t && (-1 < t.indexOf("audio/mpeg") || t.indexOf("audio/mp4")) ? "probably" : "";
        } }, { key: "cloneNode", value: function value() {
          var e = new o();return e.loop = this.loop, e.autoplay = this.autoplay, e.src = this.src, e;
        } }, { key: "currentTime", get: function get() {
          return v[this._$sn].currentTime;
        }, set: function set(e) {
          v[this._$sn].seek(e);
        } }, { key: "duration", get: function get() {
          return v[this._$sn].duration;
        } }, { key: "src", get: function get() {
          return this._src;
        }, set: function set(e) {
          this._src = e, this._loaded = !1, this.readyState = this.HAVE_NOTHING, v[this._$sn].src = e;
        } }, { key: "loop", get: function get() {
          return this._loop;
        }, set: function set(e) {
          this._loop = e, v[this._$sn].loop = e;
        } }, { key: "autoplay", get: function get() {
          return this.autoplay;
        }, set: function set(e) {
          this._autoplay = e, v[this._$sn].autoplay = e;
        } }, { key: "paused", get: function get() {
          return this._paused;
        } }, { key: "volume", get: function get() {
          return this._volume;
        }, set: function set(e) {
          this._volume = e, this._muted || (v[this._$sn].volume = e);
        } }, { key: "muted", get: function get() {
          return this._muted;
        }, set: function set(e) {
          this._muted = e, v[this._$sn].volume = e ? 0 : this._volume;
        } }]) && a(e.prototype, t), n && a(e, n), o;
    }();n.default = o, t.exports = n.default;
  }, { "./HTMLAudioElement": 32 }], 25: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = function () {
      var e = wx.createCanvas();e.type = "canvas";e.getContext;return e.getBoundingClientRect = function () {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      }, e.style = { top: "0px", left: "0px", width: r.innerWidth + "px", height: r.innerHeight + "px" }, e.addEventListener = function (e, t) {
        var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};document.addEventListener(e, t, n);
      }, e.removeEventListener = function (e, t) {
        document.removeEventListener(e, t);
      }, e.dispatchEvent = function () {
        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};console.log("canvas.dispatchEvent", e.type, e);
      }, Object.defineProperty(e, "clientWidth", { enumerable: !0, get: function get() {
          return r.innerWidth;
        } }), Object.defineProperty(e, "clientHeight", { enumerable: !0, get: function get() {
          return r.innerHeight;
        } }), e;
    };var r = e("./WindowProperties");t.exports = n.default;
  }, { "./WindowProperties": 43 }], 26: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r,
        o = (r = e("./Node")) && r.__esModule ? r : { default: r };function c(e) {
      return (c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }function i(e, t) {
      return (i = Object.setPrototypeOf || function (e, t) {
        return e.__proto__ = t, e;
      })(e, t);
    }function a(i) {
      var a = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;if (Reflect.construct.sham) return !1;if ("function" == typeof Proxy) return !0;try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }();return function () {
        var e,
            t,
            n,
            r,
            o = u(i);return t = a ? (e = u(this).constructor, Reflect.construct(o, arguments, e)) : o.apply(this, arguments), n = this, !(r = t) || "object" !== c(r) && "function" != typeof r ? function (e) {
          if (void 0 !== e) return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }(n) : r;
      };
    }function u(e) {
      return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
        return e.__proto__ || Object.getPrototypeOf(e);
      })(e);
    }var s = function () {
      !function (e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && i(e, t);
      }(n, o["default"]);var t = a(n);function n() {
        var e;return function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, n), (e = t.call(this)).className = "", e.children = [], e;
      }return n;
    }();n.default = s, t.exports = n.default;
  }, { "./Node": 40 }], 27: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;n.default = function e() {
      !function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
      }(this, e);
    }, t.exports = n.default;
  }, {}], 28: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r = e("../util/index.js");function o(e) {
      !function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
      }(this, o), this.touches = [], this.targetTouches = [], this.changedTouches = [], this.preventDefault = r.noop, this.stopPropagation = r.noop, this.type = e, this.target = window.canvas, this.currentTarget = window.canvas;
    }function i(n) {
      return function (e) {
        var t = new o(n);t.touches = e.touches, t.targetTouches = Array.prototype.slice.call(e.touches), t.changedTouches = e.changedTouches, t.timeStamp = e.timeStamp, document.dispatchEvent(t);
      };
    }n.default = o, wx.onTouchStart(i("touchstart")), wx.onTouchMove(i("touchmove")), wx.onTouchEnd(i("touchend")), wx.onTouchCancel(i("touchcancel")), t.exports = n.default;
  }, { "../util/index.js": 50 }], 29: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), Object.defineProperty(n, "TouchEvent", { enumerable: !0, get: function get() {
        return r.default;
      } }), Object.defineProperty(n, "MouseEvent", { enumerable: !0, get: function get() {
        return o.default;
      } });var r = i(e("./TouchEvent")),
        o = i(e("./MouseEvent"));function i(e) {
      return e && e.__esModule ? e : { default: e };
    }
  }, { "./MouseEvent": 27, "./TouchEvent": 28 }], 30: [function (e, t, n) {
    "use strict";
    function o(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var i = new WeakMap(),
        r = function () {
      function e() {
        !function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, e), i.set(this, {});
      }var t, n, r;return t = e, (n = [{ key: "addEventListener", value: function value(e, t, n) {
          var r = 2 < arguments.length && void 0 !== n ? n : {},
              o = i.get(this);o || (o = {}, i.set(this, o)), o[e] || (o[e] = []), o[e].push(t), r.capture, r.once, r.passive;
        } }, { key: "removeEventListener", value: function value(e, t) {
          var n = i.get(this);if (n) {
            var r = n[e];if (r && 0 < r.length) for (var o = r.length; o--;) {
              if (r[o] === t) {
                r.splice(o, 1);break;
              }
            }
          }
        } }, { key: "dispatchEvent", value: function value(e) {
          var t = 0 < arguments.length && void 0 !== e ? e : {},
              n = i.get(this)[t.type];if (n) for (var r = 0; r < n.length; r++) {
            n[r](t);
          }
        } }]) && o(t.prototype, n), r && o(t, r), e;
    }();n.default = r, t.exports = n.default;
  }, {}], 31: [function (e, t, n) {
    "use strict";
    function o(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r = function () {
      function e() {
        !function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, e);
      }var t, n, r;return t = e, (n = [{ key: "construct", value: function value() {} }]) && o(t.prototype, n), r && o(t, r), e;
    }();n.default = r, t.exports = n.default;
  }, {}], 32: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r,
        o = (r = e("./HTMLMediaElement")) && r.__esModule ? r : { default: r };function c(e) {
      return (c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }function i(e, t) {
      return (i = Object.setPrototypeOf || function (e, t) {
        return e.__proto__ = t, e;
      })(e, t);
    }function a(i) {
      var a = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;if (Reflect.construct.sham) return !1;if ("function" == typeof Proxy) return !0;try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }();return function () {
        var e,
            t,
            n,
            r,
            o = u(i);return t = a ? (e = u(this).constructor, Reflect.construct(o, arguments, e)) : o.apply(this, arguments), n = this, !(r = t) || "object" !== c(r) && "function" != typeof r ? function (e) {
          if (void 0 !== e) return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }(n) : r;
      };
    }function u(e) {
      return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
        return e.__proto__ || Object.getPrototypeOf(e);
      })(e);
    }var s = function () {
      !function (e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && i(e, t);
      }(t, o["default"]);var e = a(t);function t() {
        return function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, t), e.call(this, "audio");
      }return t;
    }();n.default = s, t.exports = n.default;
  }, { "./HTMLMediaElement": 36 }], 33: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r = o(e("./Canvas"));o(e("./HTMLElement"));function o(e) {
      return e && e.__esModule ? e : { default: e };
    }GameGlobal.screencanvas = GameGlobal.screencanvas || new r.default();var i = GameGlobal.screencanvas.constructor;n.default = i, t.exports = n.default;
  }, { "./Canvas": 25, "./HTMLElement": 34 }], 34: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r,
        i = (r = e("./Element")) && r.__esModule ? r : { default: r },
        a = e("./util/index.js"),
        c = e("./WindowProperties");function u(e) {
      return (u = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }function s(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }function l(e, t) {
      return (l = Object.setPrototypeOf || function (e, t) {
        return e.__proto__ = t, e;
      })(e, t);
    }function f(i) {
      var a = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;if (Reflect.construct.sham) return !1;if ("function" == typeof Proxy) return !0;try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }();return function () {
        var e,
            t,
            n,
            r,
            o = d(i);return t = a ? (e = d(this).constructor, Reflect.construct(o, arguments, e)) : o.apply(this, arguments), n = this, !(r = t) || "object" !== u(r) && "function" != typeof r ? function (e) {
          if (void 0 !== e) return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }(n) : r;
      };
    }function d(e) {
      return (d = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
        return e.__proto__ || Object.getPrototypeOf(e);
      })(e);
    }var o = function () {
      !function (e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && l(e, t);
      }(o, i["default"]);var e,
          t,
          n,
          r = f(o);function o() {
        var e,
            t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "";return function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, o), (e = r.call(this)).className = "", e.childern = [], e.style = { width: "".concat(c.innerWidth, "px"), height: "".concat(c.innerHeight, "px") }, e.insertBefore = a.noop, e.innerHTML = "", e.tagName = t.toUpperCase(), e;
      }return e = o, (t = [{ key: "setAttribute", value: function value(e, t) {
          this[e] = t;
        } }, { key: "getAttribute", value: function value(e) {
          return this[e];
        } }, { key: "getBoundingClientRect", value: function value() {
          return { top: 0, left: 0, width: c.innerWidth, height: c.innerHeight };
        } }, { key: "focus", value: function value() {} }, { key: "clientWidth", get: function get() {
          var e = parseInt(this.style.fontSize, 10) * this.innerHTML.length;return Number.isNaN(e) ? 0 : e;
        } }, { key: "clientHeight", get: function get() {
          var e = parseInt(this.style.fontSize, 10);return Number.isNaN(e) ? 0 : e;
        } }]) && s(e.prototype, t), n && s(e, n), o;
    }();n.default = o, t.exports = n.default;
  }, { "./Element": 26, "./WindowProperties": 43, "./util/index.js": 50 }], 35: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r;(r = e("./HTMLElement")) && r.__esModule;var o = wx.createImage().constructor;n.default = o, t.exports = n.default;
  }, { "./HTMLElement": 34 }], 36: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r,
        i = (r = e("./HTMLElement")) && r.__esModule ? r : { default: r };function c(e) {
      return (c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }function a(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }function u(e, t) {
      return (u = Object.setPrototypeOf || function (e, t) {
        return e.__proto__ = t, e;
      })(e, t);
    }function s(i) {
      var a = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;if (Reflect.construct.sham) return !1;if ("function" == typeof Proxy) return !0;try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }();return function () {
        var e,
            t,
            n,
            r,
            o = l(i);return t = a ? (e = l(this).constructor, Reflect.construct(o, arguments, e)) : o.apply(this, arguments), n = this, !(r = t) || "object" !== c(r) && "function" != typeof r ? function (e) {
          if (void 0 !== e) return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }(n) : r;
      };
    }function l(e) {
      return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
        return e.__proto__ || Object.getPrototypeOf(e);
      })(e);
    }var o = function () {
      !function (e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && u(e, t);
      }(o, i["default"]);var e,
          t,
          n,
          r = s(o);function o(e) {
        return function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, o), r.call(this, e);
      }return e = o, (t = [{ key: "addTextTrack", value: function value() {} }, { key: "captureStream", value: function value() {} }, { key: "fastSeek", value: function value() {} }, { key: "load", value: function value() {} }, { key: "pause", value: function value() {} }, { key: "play", value: function value() {} }]) && a(e.prototype, t), n && a(e, n), o;
    }();n.default = o, t.exports = n.default;
  }, { "./HTMLElement": 34 }], 37: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r,
        o = (r = e("./HTMLMediaElement")) && r.__esModule ? r : { default: r };function c(e) {
      return (c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }function i(e, t) {
      return (i = Object.setPrototypeOf || function (e, t) {
        return e.__proto__ = t, e;
      })(e, t);
    }function a(i) {
      var a = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;if (Reflect.construct.sham) return !1;if ("function" == typeof Proxy) return !0;try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }();return function () {
        var e,
            t,
            n,
            r,
            o = u(i);return t = a ? (e = u(this).constructor, Reflect.construct(o, arguments, e)) : o.apply(this, arguments), n = this, !(r = t) || "object" !== c(r) && "function" != typeof r ? function (e) {
          if (void 0 !== e) return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }(n) : r;
      };
    }function u(e) {
      return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
        return e.__proto__ || Object.getPrototypeOf(e);
      })(e);
    }var s = function () {
      !function (e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && i(e, t);
      }(t, o["default"]);var e = a(t);function t() {
        return function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, t), e.call(this, "video");
      }return t;
    }();n.default = s, t.exports = n.default;
  }, { "./HTMLMediaElement": 36 }], 38: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = function () {
      return wx.createImage();
    };var r;(r = e("./HTMLImageElement")) && r.__esModule;t.exports = n.default;
  }, { "./HTMLImageElement": 35 }], 39: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;n.default = function e() {
      !function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
      }(this, e);
    }, t.exports = n.default;
  }, {}], 40: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r,
        i = (r = e("./EventTarget.js")) && r.__esModule ? r : { default: r };function c(e) {
      return (c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }function a(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }function u(e, t) {
      return (u = Object.setPrototypeOf || function (e, t) {
        return e.__proto__ = t, e;
      })(e, t);
    }function s(i) {
      var a = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;if (Reflect.construct.sham) return !1;if ("function" == typeof Proxy) return !0;try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }();return function () {
        var e,
            t,
            n,
            r,
            o = l(i);return t = a ? (e = l(this).constructor, Reflect.construct(o, arguments, e)) : o.apply(this, arguments), n = this, !(r = t) || "object" !== c(r) && "function" != typeof r ? function (e) {
          if (void 0 !== e) return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }(n) : r;
      };
    }function l(e) {
      return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
        return e.__proto__ || Object.getPrototypeOf(e);
      })(e);
    }var o = function () {
      !function (e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && u(e, t);
      }(o, i["default"]);var e,
          t,
          n,
          r = s(o);function o() {
        var e;return function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, o), (e = r.call(this)).childNodes = [], e;
      }return e = o, (t = [{ key: "appendChild", value: function value(e) {
          this.childNodes.push(e);
        } }, { key: "cloneNode", value: function value() {
          var e = Object.create(this);return Object.assign(e, this), e;
        } }, { key: "removeChild", value: function value(t) {
          var e = this.childNodes.findIndex(function (e) {
            return e === t;
          });return -1 < e ? this.childNodes.splice(e, 1) : null;
        } }]) && a(e.prototype, t), n && a(e, n), o;
    }();n.default = o, t.exports = n.default;
  }, { "./EventTarget.js": 30 }], 41: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;n.default = function e() {
      !function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
      }(this, e);
    }, t.exports = n.default;
  }, {}], 42: [function (e, t, n) {
    "use strict";
    function r(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var i = new WeakMap(),
        o = function () {
      function o(e) {
        var t = this,
            n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [];if (!function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, o), this.binaryType = "", this.bufferedAmount = 0, this.extensions = "", this.onclose = null, this.onerror = null, this.onmessage = null, this.onopen = null, this.protocol = "", this.readyState = 3, "string" != typeof e || !/(^ws:\/\/)|(^wss:\/\/)/.test(e)) throw new TypeError("Failed to construct 'WebSocket': The URL '".concat(e, "' is invalid"));this.url = e, this.readyState = o.CONNECTING;var r = wx.connectSocket({ url: e, protocols: Array.isArray(n) ? n : [n], tcpNoDelay: !0 });return i.set(this, r), r.onClose(function (e) {
          t.readyState = o.CLOSED, "function" == typeof t.onclose && t.onclose(e);
        }), r.onMessage(function (e) {
          "function" == typeof t.onmessage && t.onmessage(e);
        }), r.onOpen(function () {
          t.readyState = o.OPEN, "function" == typeof t.onopen && t.onopen();
        }), r.onError(function (e) {
          "function" == typeof t.onerror && t.onerror(new Error(e.errMsg));
        }), this;
      }var e, t, n;return e = o, (t = [{ key: "close", value: function value(e, t) {
          this.readyState = o.CLOSING, i.get(this).close({ code: e, reason: t });
        } }, { key: "send", value: function value(e) {
          if (!("string" == typeof e || e instanceof ArrayBuffer || ArrayBuffer.isView(e))) throw new TypeError("Failed to send message: The data ".concat(e, " is invalid"));i.get(this).send({ data: e });
        } }]) && r(e.prototype, t), n && r(e, n), o;
    }();(n.default = o).CONNECTING = 0, o.OPEN = 1, o.CLOSING = 2, o.CLOSED = 3, t.exports = n.default;
  }, {}], 43: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.ontouchend = n.ontouchmove = n.ontouchstart = n.performance = n.screen = n.devicePixelRatio = n.innerHeight = n.innerWidth = void 0;var r = wx.getSystemInfoSync(),
        o = r.screenWidth,
        i = r.screenHeight,
        a = r.devicePixelRatio;n.devicePixelRatio = a;var c = o,
        u = i,
        s = { width: o, height: i, availWidth: n.innerWidth = c, availHeight: n.innerHeight = u, availLeft: 0, availTop: 0 };n.screen = s;var l = { now: Date.now };n.performance = l;n.ontouchstart = null;n.ontouchmove = null;n.ontouchend = null;
  }, {}], 44: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r,
        o = (r = e("./EventTarget.js")) && r.__esModule ? r : { default: r };function c(e) {
      return (c = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }function i(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }function a(e, t) {
      return (a = Object.setPrototypeOf || function (e, t) {
        return e.__proto__ = t, e;
      })(e, t);
    }function s(i) {
      var a = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;if (Reflect.construct.sham) return !1;if ("function" == typeof Proxy) return !0;try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (e) {
          return !1;
        }
      }();return function () {
        var e,
            t,
            n,
            r,
            o = u(i);return t = a ? (e = u(this).constructor, Reflect.construct(o, arguments, e)) : o.apply(this, arguments), n = this, !(r = t) || "object" !== c(r) && "function" != typeof r ? l(n) : r;
      };
    }function l(e) {
      if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e;
    }function u(e) {
      return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
        return e.__proto__ || Object.getPrototypeOf(e);
      })(e);
    }var f = new WeakMap(),
        d = new WeakMap(),
        p = new WeakMap(),
        h = new WeakMap(),
        m = new WeakMap();function g(e) {
      if ("function" == typeof this["on".concat(e)]) {
        for (var t = arguments.length, n = new Array(1 < t ? t - 1 : 0), r = 1; r < t; r++) {
          n[r - 1] = arguments[r];
        }this["on".concat(e)].apply(this, n);
      }
    }function y(e) {
      this.readyState = e, g.call(this, "readystatechange");
    }var v = function () {
      !function (e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && a(e, t);
      }(u, o["default"]);var e,
          t,
          n,
          r = s(u);function u() {
        var e;return function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, u), (e = r.call(this)).timeout = 0, e.onabort = null, e.onerror = null, e.onload = null, e.onloadstart = null, e.onprogress = null, e.ontimeout = null, e.onloadend = null, e.onreadystatechange = null, e.readyState = 0, e.response = null, e.responseText = null, e.responseType = "", e.responseXML = null, e.status = 0, e.statusText = "", e.upload = {}, e.withCredentials = !1, p.set(l(e), { "content-type": "application/x-www-form-urlencoded" }), h.set(l(e), {}), e;
      }return e = u, (t = [{ key: "abort", value: function value() {
          var e = m.get(this);e && e.abort();
        } }, { key: "getAllResponseHeaders", value: function value() {
          var t = h.get(this);return Object.keys(t).map(function (e) {
            return "".concat(e, ": ").concat(t[e]);
          }).join("\n");
        } }, { key: "getResponseHeader", value: function value(e) {
          return h.get(this)[e];
        } }, { key: "open", value: function value(e, t) {
          d.set(this, e), f.set(this, t), y.call(this, u.OPENED);
        } }, { key: "overrideMimeType", value: function value() {} }, { key: "send", value: function value(e) {
          var c = this,
              t = 0 < arguments.length && void 0 !== e ? e : "";if (this.readyState !== u.OPENED) throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");var n = wx.request({ data: t, url: f.get(this), method: d.get(this), header: p.get(this), dataType: "other", responseType: "arraybuffer" === this.responseType ? "arraybuffer" : "text", timeout: this.timeout || void 0, success: function success(e) {
              var t = e.data,
                  n = e.statusCode,
                  r = e.header;switch (c.status = n, h.set(c, r), g.call(c, "loadstart"), y.call(c, u.HEADERS_RECEIVED), y.call(c, u.LOADING), c.responseType) {case "json":
                  c.responseText = t;try {
                    c.response = JSON.parse(t);
                  } catch (e) {
                    c.response = null;
                  }break;case "":case "text":
                  c.responseText = c.response = t;break;case "arraybuffer":
                  c.response = t, c.responseText = "";for (var o = new Uint8Array(t), i = o.byteLength, a = 0; a < i; a++) {
                    c.responseText += String.fromCharCode(o[a]);
                  }break;default:
                  c.response = null;}y.call(c, u.DONE), g.call(c, "load"), g.call(c, "loadend");
            }, fail: function fail(e) {
              var t = e.errMsg;-1 !== t.indexOf("abort") ? g.call(c, "abort") : -1 !== t.indexOf("timeout") ? g.call(c, "timeout") : g.call(c, "error", t), g.call(c, "loadend");
            } });m.set(this, n);
        } }, { key: "setRequestHeader", value: function value(e, t) {
          var n = p.get(this);n[e] = t, p.set(this, n);
        } }, { key: "addEventListener", value: function value(e, t) {
          var n;"function" == typeof t && (n = this, this["on" + e] = function (e) {
            t.call(n, e);
          });
        } }]) && i(e.prototype, t), n && i(e, n), u;
    }();(n.default = v).UNSEND = 0, v.OPENED = 1, v.HEADERS_RECEIVED = 2, v.LOADING = 3, v.DONE = 4, t.exports = n.default;
  }, { "./EventTarget.js": 30 }], 45: [function (e, t, n) {
    "use strict";
    function a(e) {
      return (a = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r = function (e) {
      if (e && e.__esModule) return e;if (null === e || "object" !== a(e) && "function" != typeof e) return { default: e };var t = f();if (t && t.has(e)) return t.get(e);var n = {},
          r = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var o in e) {
        var i;Object.prototype.hasOwnProperty.call(e, o) && ((i = r ? Object.getOwnPropertyDescriptor(e, o) : null) && (i.get || i.set) ? Object.defineProperty(n, o, i) : n[o] = e[o]);
      }n.default = e, t && t.set(e, n);return n;
    }(e("./window")),
        o = l(e("./HTMLElement")),
        i = l(e("./HTMLVideoElement")),
        c = l(e("./Image")),
        u = l(e("./Audio")),
        s = l(e("./Canvas"));function l(e) {
      return e && e.__esModule ? e : { default: e };
    }function f() {
      if ("function" != typeof WeakMap) return null;var e = new WeakMap();return f = function f() {
        return e;
      }, e;
    }e("./EventIniter/index.js");var d = {},
        p = { readyState: "complete", visibilityState: "visible", documentElement: r, hidden: !1, style: {}, location: r.location, ontouchstart: null, ontouchmove: null, ontouchend: null, head: new o.default("head"), body: new o.default("body"), createElement: function createElement(e) {
        return "canvas" === e ? new s.default() : "audio" === e ? new u.default() : "img" === e ? new c.default() : "video" === e ? new i.default() : new o.default(e);
      }, createElementNS: function createElementNS(e, t) {
        return this.createElement(t);
      }, getElementById: function getElementById(e) {
        return e === r.canvas.id ? r.canvas : null;
      }, getElementsByTagName: function getElementsByTagName(e) {
        return "head" === e ? [p.head] : "body" === e ? [p.body] : "canvas" === e ? [r.canvas] : [];
      }, getElementsByName: function getElementsByName(e) {
        return "head" === e ? [p.head] : "body" === e ? [p.body] : "canvas" === e ? [r.canvas] : [];
      }, querySelector: function querySelector(e) {
        return "head" === e ? p.head : "body" === e ? p.body : "canvas" === e || e === "#".concat(r.canvas.id) ? r.canvas : null;
      }, querySelectorAll: function querySelectorAll(e) {
        return "head" === e ? [p.head] : "body" === e ? [p.body] : "canvas" === e ? [r.canvas] : [];
      }, addEventListener: function addEventListener(e, t) {
        d[e] || (d[e] = []), d[e].push(t);
      }, removeEventListener: function removeEventListener(e, t) {
        var n = d[e];if (n && 0 < n.length) for (var r = n.length; r--;) {
          if (n[r] === t) {
            n.splice(r, 1);break;
          }
        }
      }, dispatchEvent: function dispatchEvent(e) {
        var t = d[e.type];if (t) for (var n = 0; n < t.length; n++) {
          t[n](e);
        }
      } };n.default = p, t.exports = n.default;
  }, { "./Audio": 24, "./Canvas": 25, "./EventIniter/index.js": 29, "./HTMLElement": 34, "./HTMLVideoElement": 37, "./Image": 38, "./window": 51 }], 46: [function (e, t, n) {
    "use strict";
    function a(e) {
      return (a = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      })(e);
    }var c = function (e) {
      if (e && e.__esModule) return e;if (null === e || "object" !== a(e) && "function" != typeof e) return { default: e };var t = s();if (t && t.has(e)) return t.get(e);var n = {},
          r = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var o in e) {
        var i;Object.prototype.hasOwnProperty.call(e, o) && ((i = r ? Object.getOwnPropertyDescriptor(e, o) : null) && (i.get || i.set) ? Object.defineProperty(n, o, i) : n[o] = e[o]);
      }n.default = e, t && t.set(e, n);return n;
    }(e("./window")),
        u = r(e("./document"));r(e("./HTMLElement"));function r(e) {
      return e && e.__esModule ? e : { default: e };
    }function s() {
      if ("function" != typeof WeakMap) return null;var e = new WeakMap();return s = function s() {
        return e;
      }, e;
    }var l = GameGlobal;GameGlobal.__isAdapterInjected || (GameGlobal.__isAdapterInjected = !0, function () {
      c.document = u.default, c.addEventListener = function (e, t) {
        c.document.addEventListener(e, t);
      }, c.removeEventListener = function (e, t) {
        c.document.removeEventListener(e, t);
      }, c.dispatchEvent = c.document.dispatchEvent;var e = wx.getSystemInfoSync().platform;if ("undefined" == typeof __devtoolssubcontext && "devtools" === e) {
        for (var t in c) {
          var n = Object.getOwnPropertyDescriptor(l, t);n && !0 !== n.configurable || Object.defineProperty(window, t, { value: c[t] });
        }for (var r in c.document) {
          var o = Object.getOwnPropertyDescriptor(l.document, r);o && !0 !== o.configurable || Object.defineProperty(l.document, r, { value: c.document[r] });
        }window.parent = window;
      } else {
        for (var i in c) {
          l[i] = c[i];
        }l.window = c, window = l, window.top = window.parent = window;
      }
    }());
  }, { "./HTMLElement": 34, "./document": 45, "./window": 51 }], 47: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r = { get length() {
        return wx.getStorageInfoSync().keys.length;
      }, key: function key(e) {
        return wx.getStorageInfoSync().keys[e];
      }, getItem: function getItem(e) {
        return wx.getStorageSync(e);
      }, setItem: function setItem(e, t) {
        return wx.setStorageSync(e, t);
      }, removeItem: function removeItem(e) {
        wx.removeStorageSync(e);
      }, clear: function clear() {
        wx.clearStorageSync();
      } };n.default = r, t.exports = n.default;
  }, {}], 48: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r = { href: "game.js", reload: function reload() {} };n.default = r, t.exports = n.default;
  }, {}], 49: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.default = void 0;var r = e("./util/index.js"),
        o = wx.getSystemInfoSync();console.log(o);var i = o.system,
        a = o.platform,
        c = o.language,
        u = o.version,
        s = -1 !== i.toLowerCase().indexOf("android") ? "Android; CPU ".concat(i) : "iPhone; CPU iPhone OS ".concat(i, " like Mac OS X"),
        l = "Mozilla/5.0 (".concat(s, ") AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/").concat(u, " MiniGame NetType/WIFI Language/").concat(c),
        f = { platform: a, language: c, appVersion: "5.0 (".concat(s, ") AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"), userAgent: l, onLine: !0, geolocation: { getCurrentPosition: r.noop, watchPosition: r.noop, clearWatch: r.noop } };wx.onNetworkStatusChange && wx.onNetworkStatusChange(function (e) {
      f.onLine = e.isConnected;
    }), n.default = f, t.exports = n.default;
  }, { "./util/index.js": 50 }], 50: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 }), n.noop = function () {};
  }, {}], 51: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", { value: !0 });var r = { canvas: !0, setTimeout: !0, setInterval: !0, clearTimeout: !0, clearInterval: !0, requestAnimationFrame: !0, cancelAnimationFrame: !0, navigator: !0, XMLHttpRequest: !0, WebSocket: !0, Image: !0, ImageBitmap: !0, Audio: !0, FileReader: !0, HTMLElement: !0, HTMLImageElement: !0, HTMLCanvasElement: !0, HTMLMediaElement: !0, HTMLAudioElement: !0, HTMLVideoElement: !0, WebGLRenderingContext: !0, TouchEvent: !0, MouseEvent: !0, DeviceMotionEvent: !0, localStorage: !0, location: !0 };Object.defineProperty(n, "navigator", { enumerable: !0, get: function get() {
        return i.default;
      } }), Object.defineProperty(n, "XMLHttpRequest", { enumerable: !0, get: function get() {
        return a.default;
      } }), Object.defineProperty(n, "WebSocket", { enumerable: !0, get: function get() {
        return c.default;
      } }), Object.defineProperty(n, "Image", { enumerable: !0, get: function get() {
        return u.default;
      } }), Object.defineProperty(n, "ImageBitmap", { enumerable: !0, get: function get() {
        return s.default;
      } }), Object.defineProperty(n, "Audio", { enumerable: !0, get: function get() {
        return l.default;
      } }), Object.defineProperty(n, "FileReader", { enumerable: !0, get: function get() {
        return f.default;
      } }), Object.defineProperty(n, "HTMLElement", { enumerable: !0, get: function get() {
        return d.default;
      } }), Object.defineProperty(n, "HTMLImageElement", { enumerable: !0, get: function get() {
        return p.default;
      } }), Object.defineProperty(n, "HTMLCanvasElement", { enumerable: !0, get: function get() {
        return h.default;
      } }), Object.defineProperty(n, "HTMLMediaElement", { enumerable: !0, get: function get() {
        return m.default;
      } }), Object.defineProperty(n, "HTMLAudioElement", { enumerable: !0, get: function get() {
        return g.default;
      } }), Object.defineProperty(n, "HTMLVideoElement", { enumerable: !0, get: function get() {
        return y.default;
      } }), Object.defineProperty(n, "WebGLRenderingContext", { enumerable: !0, get: function get() {
        return v.default;
      } }), Object.defineProperty(n, "TouchEvent", { enumerable: !0, get: function get() {
        return b.TouchEvent;
      } }), Object.defineProperty(n, "MouseEvent", { enumerable: !0, get: function get() {
        return b.MouseEvent;
      } }), Object.defineProperty(n, "DeviceMotionEvent", { enumerable: !0, get: function get() {
        return b.DeviceMotionEvent;
      } }), Object.defineProperty(n, "localStorage", { enumerable: !0, get: function get() {
        return w.default;
      } }), Object.defineProperty(n, "location", { enumerable: !0, get: function get() {
        return _.default;
      } }), n.cancelAnimationFrame = n.requestAnimationFrame = n.clearInterval = n.clearTimeout = n.setInterval = n.setTimeout = n.canvas = void 0;var o = x(e("./Canvas")),
        i = x(e("./navigator")),
        a = x(e("./XMLHttpRequest")),
        c = x(e("./WebSocket")),
        u = x(e("./Image")),
        s = x(e("./ImageBitmap")),
        l = x(e("./Audio")),
        f = x(e("./FileReader")),
        d = x(e("./HTMLElement")),
        p = x(e("./HTMLImageElement")),
        h = x(e("./HTMLCanvasElement")),
        m = x(e("./HTMLMediaElement")),
        g = x(e("./HTMLAudioElement")),
        y = x(e("./HTMLVideoElement")),
        v = x(e("./WebGLRenderingContext")),
        b = e("./EventIniter/index.js"),
        w = x(e("./localStorage")),
        _ = x(e("./location")),
        E = e("./WindowProperties");function x(e) {
      return e && e.__esModule ? e : { default: e };
    }Object.keys(E).forEach(function (e) {
      "default" !== e && "__esModule" !== e && (Object.prototype.hasOwnProperty.call(r, e) || Object.defineProperty(n, e, { enumerable: !0, get: function get() {
          return E[e];
        } }));
    }), GameGlobal.screencanvas = GameGlobal.screencanvas || new o.default();var S = GameGlobal.screencanvas;n.canvas = S;var T = GameGlobal,
        N = T.setTimeout,
        O = T.setInterval,
        M = T.clearTimeout,
        C = T.clearInterval,
        A = T.requestAnimationFrame,
        D = T.cancelAnimationFrame;n.cancelAnimationFrame = D, n.requestAnimationFrame = A, n.clearInterval = C, n.clearTimeout = M, n.setInterval = O, n.setTimeout = N;
  }, { "./Audio": 24, "./Canvas": 25, "./EventIniter/index.js": 29, "./FileReader": 31, "./HTMLAudioElement": 32, "./HTMLCanvasElement": 33, "./HTMLElement": 34, "./HTMLImageElement": 35, "./HTMLMediaElement": 36, "./HTMLVideoElement": 37, "./Image": 38, "./ImageBitmap": 39, "./WebGLRenderingContext": 41, "./WebSocket": 42, "./WindowProperties": 43, "./XMLHttpRequest": 44, "./localStorage": 47, "./location": 48, "./navigator": 49 }], 52: [function (e, t, n) {
    "use strict";
    e("./VideoPlayer"), e("./pc-adapter");
  }, { "./VideoPlayer": 1, "./pc-adapter": 53 }], 53: [function (e, t, n) {
    "use strict";
    var r = wx.getSystemInfoSync(),
        i = cc.internal.inputManager,
        a = cc.internal.eventManager,
        c = cc.Event.EventKeyboard,
        u = cc.Event.EventMouse,
        o = { backspace: 8, tab: 9, enter: 13, shift: 16, control: 17, alt: 18, pause: 19, capslock: 20, escape: 27, " ": 32, pageup: 33, pagedown: 34, end: 35, home: 36, arrowleft: 37, arrowup: 38, arrowright: 39, arrowdown: 40, insert: 45, a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90, "*": 106, "+": 107, "-": 109, "/": 111, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123, numlock: 144, scrolllock: 145, ";": 186, "=": 187, ",": 188, ".": 190, "`": 192, "[": 219, "\\": 220, "]": 221, "'": 222 },
        s = { Delete: 46, Digit0: 48, Digit1: 49, Digit2: 50, Digit3: 51, Digit4: 52, Digit5: 53, Digit6: 54, Digit7: 55, Digit8: 56, Digit9: 57, Numpad0: 96, Numpad1: 97, Numpad2: 98, Numpad3: 99, Numpad4: 100, Numpad5: 101, Numpad6: 102, Numpad7: 103, Numpad8: 104, Numpad9: 105, NumpadDecimal: 110 };function l(e) {
      var t = e.key.toLowerCase(),
          n = e.code;return (/^\d$/.test(t) || "delete" === t ? s[n] : o[t] || 0
      );
    }__globalAdapter.isSubContext || "windows" !== r.platform || (i.registerSystemEvent = function () {
      var o;function e(e, n, r) {
        wx[e](function (e) {
          var t = i.getMouseEvent(e, o, n);t.setButton(e.button || 0), r(e, t), a.dispatchEvent(t);
        });
      }this._isRegisterEvent || (this._glView = cc.view, wx.onKeyDown(function (e) {
        return a.dispatchEvent(new c(l(e), !0));
      }), wx.onKeyUp(function (e) {
        return a.dispatchEvent(new c(l(e), !1));
      }), o = { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }, e("onMouseDown", u.DOWN, function (e, t) {
        i._mousePressed = !0, i.handleTouchesBegin([i.getTouchByXY(e.x, e.y, o)]);
      }), e("onMouseUp", u.UP, function (e, t) {
        i._mousePressed = !1, i.handleTouchesEnd([i.getTouchByXY(e.x, e.y, o)]);
      }), e("onMouseMove", u.MOVE, function (e, t) {
        i.handleTouchesMove([i.getTouchByXY(e.x, e.y, o)]), i._mousePressed || t.setButton(null);
      }), e("onWheel", u.SCROLL, function (e, t) {
        t.setScrollData(0, -e.deltaY);
      }), this._isRegisterEvent = !0);
    });
  }, {}], 54: [function (e, t, n) {
    "use strict";
    wx.onError && wx.onError(function e(t) {
      wx.offError && wx.offError(e);var n,
          r,
          o,
          i,
          a = Math.random() < .01;!__globalAdapter.isSubContext && a && (!(n = wx.getSystemInfoSync()) || (r = cc.Canvas.instance.node) && ((o = new cc.Node()).color = cc.Color.BLACK, i = o.addComponent(cc.Label), o.height = r.height - 60, o.width = r.width - 60, i.overflow = cc.Label.Overflow.SHRINK, i.horizontalAlign = cc.Label.HorizontalAlign.LEFT, i.verticalAlign = cc.Label.VerticalAlign.TOP, i.fontSize = 24, i.string = "出错了，请截屏发送给游戏开发者（Please send this screenshot to the game developer）\nPlatform: WeChat " + n.version + "\nEngine: Cocos Creator v" + window.CocosEngine + "\nDevice: " + n.brand + " " + n.model + " System: " + n.system + "\nError:\n" + t.message, cc.LabelOutline && (o.addComponent(cc.LabelOutline).color = cc.Color.WHITE), o.once("touchend", function () {
        o.destroy(), setTimeout(function () {
          cc.director.resume();
        }, 1e3);
      }), o.parent = r, cc.director.pause()));
    });
  }, {}], 55: [function (e, t, n) {
    "use strict";
    var o = wx.getFileSystemManager ? wx.getFileSystemManager() : null,
        c = { fs: o, getUserDataPath: function getUserDataPath() {
        return wx.env.USER_DATA_PATH;
      }, checkFsValid: function checkFsValid() {
        return !!o || (console.warn("can not get the file system!"), !1);
      }, deleteFile: function deleteFile(t, n) {
        o.unlink({ filePath: t, success: function success() {
            n && n(null);
          }, fail: function fail(e) {
            console.warn("Delete file failed: path: ".concat(t, " message: ").concat(e.errMsg)), n && n(new Error(e.errMsg));
          } });
      }, downloadFile: function downloadFile(t, e, n, r, o) {
        var i = { url: t, success: function success(e) {
            200 === e.statusCode ? o && o(null, e.tempFilePath || e.filePath) : (e.filePath && c.deleteFile(e.filePath), console.warn("Download file failed: path: ".concat(t, " message: ").concat(e.statusCode)), o && o(new Error(e.statusCode), null));
          }, fail: function fail(e) {
            console.warn("Download file failed: path: ".concat(t, " message: ").concat(e.errMsg)), o && o(new Error(e.errMsg), null);
          } };e && (i.filePath = e), n && (i.header = n);var a = wx.downloadFile(i);r && a.onProgressUpdate(r);
      }, saveFile: function saveFile(t, e, n) {
        wx.saveFile({ tempFilePath: t, filePath: e, success: function success() {
            n && n(null);
          }, fail: function fail(e) {
            console.warn("Save file failed: path: ".concat(t, " message: ").concat(e.errMsg)), n && n(new Error(e.errMsg));
          } });
      }, copyFile: function copyFile(t, e, n) {
        o.copyFile({ srcPath: t, destPath: e, success: function success() {
            n && n(null);
          }, fail: function fail(e) {
            console.warn("Copy file failed: path: ".concat(t, " message: ").concat(e.errMsg)), n && n(new Error(e.errMsg));
          } });
      }, writeFile: function writeFile(t, e, n, r) {
        o.writeFile({ filePath: t, encoding: n, data: e, success: function success() {
            r && r(null);
          }, fail: function fail(e) {
            console.warn("Write file failed: path: ".concat(t, " message: ").concat(e.errMsg)), r && r(new Error(e.errMsg));
          } });
      }, writeFileSync: function writeFileSync(t, e, n) {
        try {
          return o.writeFileSync(t, e, n), null;
        } catch (e) {
          return console.warn("Write file failed: path: ".concat(t, " message: ").concat(e.message)), new Error(e.message);
        }
      }, readFile: function readFile(t, e, n) {
        o.readFile({ filePath: t, encoding: e, success: function success(e) {
            n && n(null, e.data);
          }, fail: function fail(e) {
            console.warn("Read file failed: path: ".concat(t, " message: ").concat(e.errMsg)), n && n(new Error(e.errMsg), null);
          } });
      }, readDir: function readDir(t, n) {
        o.readdir({ dirPath: t, success: function success(e) {
            n && n(null, e.files);
          }, fail: function fail(e) {
            console.warn("Read directory failed: path: ".concat(t, " message: ").concat(e.errMsg)), n && n(new Error(e.errMsg), null);
          } });
      }, readText: function readText(e, t) {
        c.readFile(e, "utf8", t);
      }, readArrayBuffer: function readArrayBuffer(e, t) {
        c.readFile(e, "", t);
      }, readJson: function readJson(r, o) {
        c.readFile(r, "utf8", function (t, e) {
          var n = null;if (!t) try {
            n = JSON.parse(e);
          } catch (e) {
            console.warn("Read json failed: path: ".concat(r, " message: ").concat(e.message)), t = new Error(e.message);
          }o && o(t, n);
        });
      }, readJsonSync: function readJsonSync(t) {
        try {
          var e = o.readFileSync(t, "utf8");return JSON.parse(e);
        } catch (e) {
          return console.warn("Read json failed: path: ".concat(t, " message: ").concat(e.message)), new Error(e.message);
        }
      }, makeDirSync: function makeDirSync(t, e) {
        try {
          return o.mkdirSync(t, e), null;
        } catch (e) {
          return console.warn("Make directory failed: path: ".concat(t, " message: ").concat(e.message)), new Error(e.message);
        }
      }, rmdirSync: function rmdirSync(t, e) {
        try {
          o.rmdirSync(t, e);
        } catch (e) {
          return console.warn("rm directory failed: path: ".concat(t, " message: ").concat(e.message)), new Error(e.message);
        }
      }, exists: function exists(e, t) {
        o.access({ path: e, success: function success() {
            t && t(!0);
          }, fail: function fail() {
            t && t(!1);
          } });
      }, loadSubpackage: function loadSubpackage(t, e, n) {
        var r = wx.loadSubpackage({ name: t, success: function success() {
            n && n();
          }, fail: function fail(e) {
            console.warn("Load Subpackage failed: path: ".concat(t, " message: ").concat(e.errMsg)), n && n(new Error("Failed to load subpackage ".concat(t, ": ").concat(e.errMsg)));
          } });return e && r.onProgressUpdate(e), r;
      }, unzip: function unzip(t, e, n) {
        o.unzip({ zipFilePath: t, targetPath: e, success: function success() {
            n && n(null);
          }, fail: function fail(e) {
            console.warn("unzip failed: path: ".concat(t, " message: ").concat(e.errMsg)), n && n(new Error("unzip failed: " + e.errMsg));
          } });
      } };window.fsUtils = t.exports = c;
  }, {}], 56: [function (e, t, n) {
    "use strict";
    var a = window.__globalAdapter,
        r = wx.getSystemInfoSync(),
        o = a.adaptSys;Object.assign(a, { adaptSys: function adaptSys(e) {
        var t;o.call(this, e), "windows" === r.platform ? (e.isMobile = !1, e.os = e.OS_WINDOWS) : a.isDevTool && (-1 < (t = r.system.toLowerCase()).indexOf("android") ? e.os = e.OS_ANDROID : -1 < t.indexOf("ios") && (e.os = e.OS_IOS)), wx.getOpenDataContext ? e.platform = e.WECHAT_GAME : e.platform = e.WECHAT_GAME_SUB, e.glExtension = function (e) {
          return "OES_texture_float" !== e && !!cc.renderer.device.ext(e);
        }, e.getSafeAreaRect = function () {
          var e = cc.view,
              t = a.getSafeArea(),
              n = e.getFrameSize(),
              r = new cc.Vec2(t.left, t.bottom),
              o = new cc.Vec2(t.right, t.top),
              i = { left: 0, top: 0, width: n.width, height: n.height };return e.convertToLocationInView(r.x, r.y, i, r), e.convertToLocationInView(o.x, o.y, i, o), e._convertPointWithScale(r), e._convertPointWithScale(o), cc.rect(r.x, r.y, o.x - r.x, o.y - r.y);
        };
      } });
  }, {}], 57: [function (e, t, n) {
    "use strict";
    var u,
        s,
        r,
        l,
        f,
        o,
        a,
        i = e("../../../common/utils");window.__globalAdapter && (u = window.__globalAdapter, r = (s = wx.getSystemInfoSync()).windowWidth, l = s.windowHeight, f = l < r, u.isSubContext = void 0 === wx.getOpenDataContext, u.isDevTool = "devtools" === s.platform, i.cloneMethod(u, wx, "getSystemInfoSync"), i.cloneMethod(u, wx, "onTouchStart"), i.cloneMethod(u, wx, "onTouchMove"), i.cloneMethod(u, wx, "onTouchEnd"), i.cloneMethod(u, wx, "onTouchCancel"), i.cloneMethod(u, wx, "createInnerAudioContext"), i.cloneMethod(u, wx, "onAudioInterruptionEnd"), i.cloneMethod(u, wx, "onAudioInterruptionBegin"), i.cloneMethod(u, wx, "createVideo"), i.cloneMethod(u, wx, "setPreferredFramesPerSecond"), i.cloneMethod(u, wx, "showKeyboard"), i.cloneMethod(u, wx, "hideKeyboard"), i.cloneMethod(u, wx, "updateKeyboard"), i.cloneMethod(u, wx, "onKeyboardInput"), i.cloneMethod(u, wx, "onKeyboardConfirm"), i.cloneMethod(u, wx, "onKeyboardComplete"), i.cloneMethod(u, wx, "offKeyboardInput"), i.cloneMethod(u, wx, "offKeyboardConfirm"), i.cloneMethod(u, wx, "offKeyboardComplete"), i.cloneMethod(u, wx, "getOpenDataContext"), i.cloneMethod(u, wx, "onMessage"), i.cloneMethod(u, wx, "getSharedCanvas"), i.cloneMethod(u, wx, "loadFont"), i.cloneMethod(u, wx, "onShow"), i.cloneMethod(u, wx, "onHide"), i.cloneMethod(u, wx, "onError"), i.cloneMethod(u, wx, "offError"), o = !1, a = 1, wx.onDeviceOrientationChange && wx.onDeviceOrientationChange(function (e) {
      "landscape" === e.value ? a = 1 : "landscapeReverse" === e.value && (a = -1);
    }), Object.assign(u, { startAccelerometer: function startAccelerometer(i) {
        o ? wx.startAccelerometer && wx.startAccelerometer({ fail: function fail(e) {
            console.error("start accelerometer failed", e);
          } }) : (o = !0, wx.onAccelerometerChange && wx.onAccelerometerChange(function (e) {
          var t,
              n = {},
              r = e.x,
              o = e.y;f && (t = r, r = -o, o = t), n.x = r * a, n.y = o * a, n.z = e.z, i && i(n);
        }));
      }, stopAccelerometer: function stopAccelerometer() {
        wx.stopAccelerometer && wx.stopAccelerometer({ fail: function fail(e) {
            console.error("stop accelerometer failed", e);
          } });
      } }), u.getSafeArea = function () {
      var e,
          t = s.safeArea,
          n = t.top,
          r = t.left,
          o = t.bottom,
          i = t.right,
          a = t.width,
          c = t.height;return "ios" === s.platform && !u.isDevTool && f && (n = l - (e = [i, n, r, o, a, c])[0], r = e[1], o = l - e[2], i = e[3], c = e[4], a = e[5]), { top: n, left: r, bottom: o, right: i, width: a, height: c };
    });
  }, { "../../../common/utils": 18 }] }, {}, [23]);
});
define("assets/internal/index.js", function(require, module, exports){
(function r(e, n, t) {
  function i(u, f) {
    if (!n[u]) {
      if (!e[u]) {
        var _ = u.split("/");if (_ = _[_.length - 1], !e[_]) {
          var p = "function" == typeof __require && __require;if (!f && p) return p(_, !0);if (o) return o(_, !0);throw new Error("Cannot find module '" + u + "'");
        }u = _;
      }var a = n[u] = { exports: {} };e[u][0].call(a.exports, function (r) {
        return i(e[u][1][r] || r);
      }, a, a.exports, r, e, n, t);
    }return n[u].exports;
  }for (var o = "function" == typeof __require && __require, u = 0; u < t.length; u++) {
    i(t[u]);
  }return i;
})({}, {}, []);
});
define("assets/main/index.js", function(require, module, exports){
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.__require = function t(e, n, o) {
  function i(a, s) {
    if (!n[a]) {
      if (!e[a]) {
        var c = a.split("/");if (c = c[c.length - 1], !e[c]) {
          var l = "function" == typeof __require && __require;if (!s && l) return l(c, !0);if (r) return r(c, !0);throw new Error("Cannot find module '" + a + "'");
        }a = c;
      }var u = n[a] = { exports: {} };e[a][0].call(u.exports, function (t) {
        return i(e[a][1][t] || t);
      }, u, u.exports, t, e, n, o);
    }return n[a].exports;
  }for (var r = "function" == typeof __require && __require, a = 0; a < o.length; a++) {
    i(o[a]);
  }return i;
}({ AbsConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "12bde76KGJFSr//o4VoXRSJ", "AbsConfig"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./ConfigManager"),
        i = t("../Core/TextConfigRead"),
        r = function () {
      function t(t) {
        if (this._dicList = null, this._list = null, null != t) {
          this._dicList = new Map(), this._list = new Array();for (var e = new i.default(o.default.ins.getConfigString(t.cfgFile)), n = e.children.length, r = 0; r < n; r++) {
            var a = new t(e.children[r]);this._dicList.set(a.id, a), this._list.push(a);
          }
        }
      }return t.prototype.getItem = function (t) {
        return this._dicList.has(t) ? this._dicList.get(t) : null;
      }, t.prototype.getConfMap = function () {
        return this._dicList;
      }, t.prototype.getConfList = function () {
        return this._list;
      }, t.prototype.getListItem = function (t) {
        return this._list[t];
      }, t.prototype.getList = function () {
        return this._list;
      }, t;
    }();n.default = r, cc._RF.pop();
  }, { "../Core/TextConfigRead": "TextConfigRead", "./ConfigManager": "ConfigManager" }], AbsDashController: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "5694bmtdfVD4YMDACgQZh43", "AbsDashController");var _o,
        i = this && this.__extends || (_o = function o(t, e) {
      return (_o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Util/ComponentUtil"),
        a = t("../Config/GameConfig"),
        s = t("../../Common/Util/MathUtil"),
        c = t("./HeroActor"),
        l = t("./StageActor"),
        u = t("./MusicController"),
        f = t("../Manager/GameManager"),
        d = t("./HitSkyEffect"),
        h = t("./HitEffect"),
        p = t("../../Common/Sdks/GameSDK"),
        _ = t("../../Common/Manager/Logger"),
        m = t("../Manager/CommandController"),
        g = function (t) {
      function e(e) {
        var n = t.call(this) || this;return n._stages = [], n._score = 0, n._scoreRatio = 1, n._type = 0, n._hitGold = 0, n._rhythmTime = 0, n._reviveSafeTime = 0, n._stepIdx = 0, n._offsetPara = 0, n._stageLayoutIdx = Math.random() > .5 ? 1 : 3, n._nextStageLayout = 0, n._moveFx = 1, n._jiaoziIdx = 8 + s.default.randomInt(0, 5), n.initNodes(e), n._musicCtrl = u.MusicController.ins, n.lockCamera(!0), n;
      }return i(e, t), e.prototype.firstStart = function () {
        this._firstStart || (_.default.log("=>  firstStart"), m.default.fbStart(null, null), this._firstStart = !0);
      }, Object.defineProperty(e.prototype, "stepIdx", { get: function get() {
          return this._stepIdx;
        }, enumerable: !1, configurable: !0 }), e.prototype.initNodes = function (t) {
        var e = t.getChildByName("sceneNode");this._scene = new cc.Node(), this._camera = r.default.getComponent(cc.Camera, t, "camera"), this._camera.node.eulerAngles = cc.v3(-17.5, 0, 0), this._uiCamera = r.default.getComponent(cc.Camera, t, "skyCamera"), this._hero = c.default.ins, this._hero.eulerAngles = cc.v3(0, 180, 0), this._tipsNode = r.default.getNode(t, "tips"), this._tipsNode.y = -430, this._tipsNode.active = !0, this._hero.parent != e && (this._hero.removeFromParent(), e.addChild(this._hero)), e.addChild(this._scene);
      }, e.prototype.initScene = function () {
        this._rhythm = this._musicCtrl.rhythms, this._index = 0, this._stepIdx = a.default.ShowStageNum;for (var t = 0; t < a.default.ShowStageNum; t++) {
          var e = this.createStage(this._rhythm[t], t);e.actorId = t, this._scene.addChild(e), this._stages.push(e), e.appear();
        }this._isInited = !0, this.initSceneComplete();
      }, e.prototype.autoRun = function () {
        this._tipsNode.active = !1, this._running = !0, this._musicCtrl.setCurrentTime(0), this._musicCtrl.mute = !1, this._musicCtrl.rewind(), this.firstStart(), this.nextRhythm();
      }, e.prototype.initSceneComplete = function () {}, e.prototype.startGame = function () {}, e.prototype.lockCamera = function (t) {
        void 0 === t && (t = !1);var e = this._camera.node,
            n = .6 * this._hero.x;t || (n = e.position.x + .1 * (n - e.position.x)), e.position = cc.v3(n, 9, this._hero.z + 20.5);
      }, e.prototype.onTouchStartHandler = function () {
        this._isInited && this._playing && (this._isTouched || (this._running || (this._tipsNode.active = !1, this._running = !0, this._isRevive ? (this._musicCtrl.resume(), this._hero.jump(this._stepTime), this._reviveSafeTime = a.default.ReviveSafeTime) : (this._musicCtrl.setCurrentTime(0), this._musicCtrl.mute = !1, this._musicCtrl.rewind(), this.firstStart(), this.nextRhythm())), this._isTouched = !0));
      }, e.prototype.onTouchMoveHandler = function (t) {
        if (this._isTouched && this._running && !this._hero.isDizzy) {
          var e = this._hero.x + t.getDeltaX() / cc.view.getDesignResolutionSize().width * a.default.MovingDiameter * a.default.MovingDelicacy;this._hero.x = s.default.clamp(e, -a.default.MovingDiameter / 2, a.default.MovingDiameter / 2);
        }
      }, e.prototype.onTouchEndHandler = function () {
        this._isTouched = !1;
      }, e.prototype.update = function (t) {
        if (this._playing && this._running) {
          var e = this._musicCtrl.getCurrentTime();if (this._reviveSafeTime > 0 && (this._reviveSafeTime -= t), this._musicCtrl.update(t), e >= this._rhythmTime) if (this._hero.y = 0, this._isRevive) this._isRevive = !1;else {
            var n = this.getCurStage(this._index - 1);if (n) {
              var o = Math.abs(this._hero.position.x - n.position.x);if (o > 2 * n.size) {
                if (this._reviveSafeTime <= 0) return void this.gameOver(!1);this.hitSkyEffect(cc.v3(this._hero.x, 0, this._hero.z));
              } else {
                if (n.itemType == a.StageItemType.Obstacle) return void this.collide();var i = 3;o < .5 ? i = 1 : o < 1.1 && (i = 2), this.hitEffect(n, i);
              }
            }this.nextStage(), this.nextRhythm();
          }this._hero && (this._hero.update(t), this._hero.z = -e * a.default.CurHeroSpeed, this.lockCamera());
        }
      }, e.prototype.useItem = function () {
        return !0;
      }, e.prototype.revive = function () {
        this._isRevive = !0, this._tipsNode.active = !0, this._running = !1, this._playing = !0;var t = this.getCurStage(this._index - 1);t.removeItem(), t.stopMove(), this._hero.position = t.position.clone(), this._hero.idle(), this.removePastStage(), this._isRevive = !0, this.lockCamera(!0);
      }, e.prototype.collide = function () {
        this._isTouched = !1, this._running = !1, this._playing = !1, this._hero.dump(), this._musicCtrl.pause(), cc.tween(this._hero).to(.13, { position: cc.v3(this._hero.position.x, 3, this._hero.position.z + 3) }).to(.87, { position: cc.v3(this._hero.position.x, -25, this._hero.position.z + 4) }).call(this.fail.bind(this)).start();
      }, e.prototype.gameOver = function (t) {
        this._isTouched = !1, this._running = !1, this._playing = !1, this._hero.idle(), t ? (this._hero.eulerAngles = cc.v3(), this._musicCtrl.pause(), this.win()) : (this._musicCtrl.pause(), cc.tween(this._hero).to(1, { position: cc.v3(this._hero.position.x, -25, this._hero.position.z) }).call(this.fail.bind(this)).start());
      }, e.prototype.destroy = function () {
        this._scene && (this._camera.node.position = cc.v3(0, 6.8, 13), this._camera.node.eulerAngles = cc.v3(-26, 0, 0), this._camera = null, this._stages = null, this._uiCamera = null, this._hero = null, this._tipsNode.active = !1, this._tipsNode = null, this._musicCtrl = null, this._scene.removeFromParent(), this._scene.destroy(), this._scene = null);
      }, e.prototype.createStage = function (t, e) {
        var n = new l.default();return n.position = t > 0 ? cc.v3(this.getOffset(e, t), 0, -t * a.default.CurHeroSpeed) : cc.v3(), n;
      }, e.prototype.getOffset = function (t, e) {
        e > 6 ? a.default.CurStageOffset : a.default.StageStartOffset;return Math.sin(60 * t / 180 * Math.PI), this._offsetPara, 0;
      }, e.prototype.getCurStage = function (t) {
        for (var e, n = [], o = -1, i = 999, r = 0; r < this._stages.length; r++) {
          (e = this._stages[r]) && e.actorId == t && n.push(e);
        }if (n.length > 0) {
          if (1 == n.length) return n[0];for (var a = 0; a < n.length; a++) {
            var s = Math.abs(this._hero.position.x - n[a].position.x);s < i && (i = s, o = a);
          }if (-1 != o) return n[o];
        }return null;
      }, e.prototype.removePastStage = function () {
        for (var t, e = this._stages.length - 1, n = this._hero.position.z + .2; e >= 0;) {
          (t = this._stages[e]).position.z >= n && (this._stages.splice(e, 1), t.parent = null), e--;
        }
      }, e.prototype.hitSkyEffect = function (t) {
        var e = d.default.getEffect();e.group = "stage", e.position = t, this._scene.addChild(e), e.play(), this.hitStage(0);
      }, e.prototype.hitEffect = function (t, e) {
        if (1 == e) {
          var n = h.default.getEffect();n.group = "stage", n.position = t.position.clone(), this._scene.addChild(n), n.play();
        } else {
          var o = d.default.getEffect();o.group = "stage", o.position = t.position.clone(), this._scene.addChild(o), o.play();
        }this._gameFinish || (f.default.jumpNextStep(1 == e, (1 == e || 2 == e) && t.itemType == a.StageItemType.Gold), t.itemType == a.StageItemType.Gold ? (this._hitGold++, this._hitGold % 5 == 0 && this._hitGold) : t.itemType == a.StageItemType.JiaoZi && (a.default.Energy += 10 * this._scoreRatio)), t.removeItem(), p.default.vibrateShort(), this.hitStage(e);
      }, e.prototype.hitStage = function (t) {
        void 0 === t && (t = 0);
      }, e.prototype.nextRhythm = function () {
        var t = this._rhythmTime;this._index >= this._musicCtrl.rhythms.length && (this._musicCtrl.next(), this._nextStageLayout = this._nextStageLayout - this._index, this._index = 0, this._rhythm = this._musicCtrl.rhythms), this._rhythmTime = this._musicCtrl.rhythms[this._index] + this._musicCtrl.getDuration(), this._stepTime = this._rhythmTime - t, this._index++, this._running && this._hero.jump(this._stepTime);
      }, e.prototype.nextLayout = function (t) {
        var e = Math.floor(t),
            n = this._stepIdx + this._offsetPara + e;(1 == this._stageLayoutIdx || 3 == this._stageLayoutIdx) && n % 4 >= 2 ? (this._stageLayoutIdx = e % 10 >= 5 ? 4 : 5, this._nextStageLayout = this._stepIdx + 3, this._obstacleIdx = this._stepIdx + 1) : (this._nextStageLayout = this._stepIdx + 2 + e % 3, this._stageLayoutIdx > 3 ? this._stageLayoutIdx = n % 2 == 0 ? 1 : 3 : 3 == this._stageLayoutIdx ? this._stageLayoutIdx = 0 : this._stageLayoutIdx++);
      }, e.prototype.nextStage = function () {
        var t = this._index + a.default.ShowStageNum - 1,
            e = null,
            n = t;if (a.default.updateDashStep(this._stepIdx, this._offsetPara), t >= this._musicCtrl.rhythms.length ? (e = this._musicCtrl.nextRhythms[t - this._musicCtrl.rhythms.length] + this._musicCtrl.getNextDuration(), n = t - this._musicCtrl.rhythms.length) : e = this._musicCtrl.rhythms[t] + this._musicCtrl.getDuration(), this._stepIdx >= this._nextStageLayout && this.nextLayout(e), null != e) {
          var o = a.default.StageLayouts[this._stageLayoutIdx],
              i = a.default.ObstacleLayouts[a.default.ObstacleLayouts.length - 1];o.length > 1 && this._obstacleIdx == this._stepIdx && (i = 2 == o.length ? a.default.ObstacleLayouts[this._stepIdx % 2] : a.default.ObstacleLayouts[2 + this._stepIdx % 2]);for (var r = 0; r < o.length; r++) {
            var c = this._stages[0],
                l = o[r];null == c || null != c && c.z - this._hero.z < 15 ? (c = this.createStage(e, this._index), this._scene.addChild(c)) : ((c = this._stages.shift()).cleanup(), c.position = cc.v3(this.getOffset(t, e) + 4 * l, 0, -e * a.default.CurHeroSpeed - 10)), c.actorId = n, c.appear(cc.v3(this.getOffset(t, e) + 4 * l, 0, -e * a.default.CurHeroSpeed)), i[r] ? c.addItem(a.StageItemType.Obstacle) : this._stepIdx > 0 && (this._stepIdx % 30 == 0 ? c.addItem(a.StageItemType.Gold) : 1 == this._type && this._stepIdx >= this._jiaoziIdx ? (c.addItem(a.StageItemType.JiaoZi), this._jiaoziIdx = this._stepIdx + s.default.randomInt(8, 13)) : c.removeItem()), c.size = a.default.CurStageSize, 0 != a.default.CurStageSpeed && a.default.CurStageRadius > 0 && 1 == o.length && (c.startMove(a.default.CurStageRadius, a.default.CurStageSpeed, this._moveFx), this._moveFx *= -1), this._stages.push(c);
          }this._stepIdx++;
        }
      }, e.prototype.musicVolume = function (t) {
        void 0 === t && (t = 1), this._musicCtrl && (this._musicCtrl.volume = t);
      }, e.prototype.win = function () {}, e.prototype.fail = function () {}, e;
    }(cc.EventTarget);n.default = g, cc._RF.pop();
  }, { "../../Common/Manager/Logger": "Logger", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Util/ComponentUtil": "ComponentUtil", "../../Common/Util/MathUtil": "MathUtil", "../Config/GameConfig": "GameConfig", "../Manager/CommandController": "CommandController", "../Manager/GameManager": "GameManager", "./HeroActor": "HeroActor", "./HitEffect": "HitEffect", "./HitSkyEffect": "HitSkyEffect", "./MusicController": "MusicController", "./StageActor": "StageActor" }], AbsFbOverPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "94143SuRvFMaJu4c8SyF2a5", "AbsFbOverPanel");var _o2,
        i = this && this.__extends || (_o2 = function o(t, e) {
      return (_o2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o2(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../../Common/Core/GameType"),
        s = t("../../../Common/Manager/Logger"),
        c = t("../../../Common/Manager/MusicManager"),
        l = t("../../../Common/Sdks/GameSDK"),
        u = t("../../../Common/UI/UIManager"),
        f = t("../../../Common/UI/UIPanel"),
        d = t("../../Config/AchieveConfig"),
        h = t("../../Fb/FbPkMatchPanel"),
        p = t("../../Info/PlayerInfo"),
        _ = t("../../Manager/GameManager"),
        m = t("../../Scene/GameScene"),
        g = t("../MainPanel"),
        y = t("../RankPanel"),
        b = t("../RePlayAnswerConfirm"),
        C = t("../../../Common/Sdks/UmaTrackHelper"),
        v = cc._decorator,
        I = v.ccclass,
        M = (v.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return a.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onClose = function () {
        this.unRegisterNetCmd();
      }, e.prototype.registerNetCmd = function () {}, e.prototype.unRegisterNetCmd = function () {}, e.prototype.cmd0x0210Handler = function (t) {
        if (!t.isError) {
          var e = t.body;s.default.log("----------------------------cmd0x0210Handler "), s.default.log(e), u.default.show(b.default, e);
        }
      }, e.prototype.onTouchRankHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.show(y.default);
      }, e.prototype.onTouchGamerePlayHandler = function () {
        c.default.playEffect(c.default.CLICK), s.default.log("--------------onTouchGamerePlayHandler-------------------"), u.default.close(this), s.default.log(this.data), 0 == this.data.t ? u.default.show(h.default) : (u.default.show(g.default), l.default.shareInvite()), 1 == this.data.t ? C.default.trackEvent("1328") : C.default.trackEvent("1321");
      }, e.prototype.onGetAwardByAd = function () {
        s.default.log("--------------onGetAwardByAd-------------------"), c.default.playEffect(c.default.CLICK), l.default.showVideoAd(this.reviveCall, this, a.VideoAdType.Sport), 1 == this.data.t ? C.default.trackEvent("1326") : C.default.trackEvent("1319");
      }, e.prototype.reviveCall = function () {
        var t = this.data;1 == t.f ? l.default.getUid() == t.win ? _.default.fbPkVideoEnd(1) : _.default.fbPkVideoEnd(0) : _.default.fbPkVideoEnd(2), u.default.close(this), m.default.ins.closeGame(), u.default.show(g.default), 1 == this.data.t ? C.default.trackEvent("1327") : C.default.trackEvent("1320");
      }, e.prototype.upAtlInfo = function (t, e) {
        var n = p.default.ins.acl,
            o = n[0],
            i = n[1],
            r = d.default.ins.getItem(o.id),
            a = d.default.ins.getItem(i.id);t.string = "(" + o.c + "/" + r.target + ")", e.string = "(" + i.c + "/" + a.target + ")";
      }, e.prototype.onTouchCloseHandler = function () {
        s.default.log("--------------onTouchCloseHandler-------------------"), c.default.playEffect(c.default.CLICK), u.default.close(this), u.default.show(g.default);
      }, r([I], e);
    }(f.default));n.default = M, cc._RF.pop();
  }, { "../../../Common/Core/GameType": "GameType", "../../../Common/Manager/Logger": "Logger", "../../../Common/Manager/MusicManager": "MusicManager", "../../../Common/Sdks/GameSDK": "GameSDK", "../../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../../Common/UI/UIManager": "UIManager", "../../../Common/UI/UIPanel": "UIPanel", "../../Config/AchieveConfig": "AchieveConfig", "../../Fb/FbPkMatchPanel": "FbPkMatchPanel", "../../Info/PlayerInfo": "PlayerInfo", "../../Manager/GameManager": "GameManager", "../../Scene/GameScene": "GameScene", "../MainPanel": "MainPanel", "../RankPanel": "RankPanel", "../RePlayAnswerConfirm": "RePlayAnswerConfirm" }], AbsInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "fc720CQUOhEJ6ETV3hH2nhp", "AbsInfo");var _o3,
        i = this && this.__extends || (_o3 = function o(t, e) {
      return (_o3 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o3(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../Core/GameType"),
        a = t("../Manager/GlobalEventManager"),
        s = function (t) {
      function e() {
        var e = t.call(this) || this;return e._isDispatch = !1, e;
      }return i(e, t), e.prototype.getCfgData = function (t) {
        if (this._cfgData) return this._cfgData[t];
      }, Object.defineProperty(e.prototype, "isDispatch", { get: function get() {
          return this._isDispatch;
        }, set: function set(t) {
          this._isDispatch = t;
        }, enumerable: !1, configurable: !0 }), e.prototype.eventDispatch = function (t, e, n) {
        void 0 === e && (e = null), void 0 === n && (n = null), this.isDispatch && this.emit(r.InfoEvent.EVENT_CHANGE, [e, n]);
      }, e.prototype.save = function () {
        a.default.dispatchEvent(r.InfoEvent.EVENT_SAVE);
      }, e.prototype.init = function () {}, e.prototype.saveData = function () {}, e.prototype.onNewDayHandler = function () {}, e;
    }(cc.EventTarget);n.default = s, cc._RF.pop();
  }, { "../Core/GameType": "GameType", "../Manager/GlobalEventManager": "GlobalEventManager" }], AbstractSDK: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "580c287ToVGX4jB2jlrYht/", "AbstractSDK"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../Core/GameType"),
        i = t("../Manager/GlobalEventManager"),
        r = t("../Manager/SysConfig"),
        a = t("../Manager/TimeManager"),
        s = t("../Util/Base64"),
        c = t("../Util/MathUtil"),
        l = t("../Util/MD5"),
        u = t("../../Game/Tips/GeneralTips"),
        f = t("../Manager/HostManager"),
        d = t("../Manager/DataManager"),
        h = t("../Manager/Logger"),
        p = function () {
      function t(t) {
        this._vip = 0, this._ios = !1, this._roomId = null, this._invoke = !1, this._isShare = !0, this._adOpen = !0, this._adPer = 100, this._adPolicy = 0, this._bannerOpen = !0, this._isAnonymous = !1, this._banner_time = 0, this._shareUrls = ["https://rane-cdn.jwetech.com/share/share5.jpg"], this._shareTitles = ["QQ\u4F1A\u5458\u71C3\u9E45\u5411\u524D\u51B2\u51B2\u51B2\uFF0C\u5FEB\u6765PK\u4E71\u6597\u8D62\u597D\u793C\uFF01"], this._isRecStatus = !1, this._recStartTime = 0, this._recTime = 0, this._sdkId = t;var e = window.location.search,
            n = "";if (e && e.indexOf("?") >= 0) {
          var o = e.substr(1, e.length).split("&"),
              i = o.length;if (i > 0) for (var r = 0; r < i; r++) {
            var a = o[r],
                s = a.indexOf("="),
                c = a.substr(0, s),
                l = a.substr(s + 1, a.length);"uid" == c && (n = l), "roomId" == c && (this._roomId = l);
          }
        }"" != n && (this._uid = n), cc.game.on(cc.game.EVENT_SHOW, this.onShow, this), cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);
      }return t.prototype.getLoginUrl = function () {
        var t = f.default.getHost();return console.log("host:", t), t + r.default.LOGIN_URL;
      }, t.prototype.getLogoutUrl = function () {
        var t = f.default.getHost();return console.log("host:", t), t + r.default.LOGOUT_URL;
      }, t.prototype.initSDK = function () {}, t.prototype.initSdkEnd = function () {}, t.prototype.login = function () {
        i.default.dispatchEvent(o.InitStepEvent.LOGIN_FINISH);
      }, t.prototype.onShow = function () {
        h.default.debug("---------------onShow-----------------");
      }, t.prototype.onHide = function () {
        h.default.debug("---------------onHide-----------------");
      }, t.prototype.loadUserData = function () {
        var t = this.readUserData();if (this._remoteData) for (var e in this._remoteData) {
          t[e] = this._remoteData[e];
        }d.default.init(t);
      }, t.prototype.userKey = function () {
        return l.default.hex_md5(r.default.ID + r.default.NAME + "_" + this._uid);
      }, t.prototype.readUserData = function () {
        var t = cc.sys.localStorage.getItem(this.userKey());return t ? JSON.parse(s.default.decode(t)) : {};
      }, t.prototype.saveUserData = function (t) {
        var e = s.default.encode(JSON.stringify(t));cc.sys.localStorage.setItem(this.userKey(), e);
      }, t.prototype.clearUserData = function () {
        cc.sys.localStorage.removeItem(this.userKey());
      }, t.prototype.saveOpenData = function () {}, t.prototype.logout = function (t) {
        this.saveUserData(t), this.saveOpenData();
      }, Object.defineProperty(t.prototype, "sdkId", { get: function get() {
          return this._sdkId;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "uid", { get: function get() {
          return this._uid;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "nickname", { get: function get() {
          return this._nickname;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "icon", { get: function get() {
          return this._icon;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "vip", { get: function get() {
          return this._vip;
        }, enumerable: !1, configurable: !0 }), t.prototype.isIos = function () {
        return this._ios;
      }, Object.defineProperty(t.prototype, "roomId", { get: function get() {
          return this._roomId;
        }, enumerable: !1, configurable: !0 }), t.prototype.clearRoomId = function () {
        this._roomId = null, this._invoke = !1;
      }, Object.defineProperty(t.prototype, "isShare", { get: function get() {
          return this._isShare;
        }, enumerable: !1, configurable: !0 }), t.prototype.getShareImgUrl = function () {
        var t = c.default.randomInt(this._shareTitles.length - 1);return this._shareUrls[t];
      }, t.prototype.getShareTitleAndImgUrl = function () {
        if (1 == this._shareUrls.length) return [this._shareTitles[0], this._shareUrls[0]];var t = c.default.randomInt(this._shareTitles.length - 1);return [this._shareTitles[t], this._shareUrls[t]];
      }, t.prototype.share = function (t, e, n, o) {
        void 0 === t && (t = null), void 0 === e && (e = null), void 0 === n && (n = null), void 0 === o && (o = null), cc.log("\u5206\u4EAB\u4E2D"), t && e && a.default.add(t, e, 3e3, 1);
      }, t.prototype.getRankData = function (t, e) {
        void 0 === t && (t = null), void 0 === e && (e = null);
      }, t.prototype.showBannerAd = function () {}, t.prototype.hideBannerAd = function () {}, t.prototype.showVideoAd = function (t, e) {
        void 0 === t && (t = null), void 0 === e && (e = null), console.log("--------showVideoAd---------"), t && e && t.call(e);
      }, t.prototype.hideVideoAd = function () {}, t.prototype.postMessage = function () {}, t.prototype.adOpen = function () {
        return !0;
      }, t.prototype.hasInsertAd = function () {
        return !1;
      }, t.prototype.checkRankFunc = function () {
        return !0;
      }, t.prototype.showInsertAd = function () {}, t.prototype.vibrateShort = function () {
        window.navigator.vibrate && window.navigator.vibrate(15);
      }, t.prototype.vibrateLong = function () {
        window.navigator.vibrate && window.navigator.vibrate(400);
      }, t.prototype.navigateToMiniGame = function () {}, t.prototype.isVideoRec = function () {
        return this._isRecStatus;
      }, t.prototype.videoRecStart = function () {
        this.clearRecVideo(), this._isRecStatus = !0, this._recStartTime = a.default.serverTime;
      }, t.prototype.videoRecStop = function (t, e, n) {
        void 0 === t && (t = null), void 0 === e && (e = null), void 0 === n && (n = !1), this._isRecStatus && (this._isRecStatus = !1, this._recTime = a.default.serverTime - this._recStartTime, this._recStartTime = 0, this._recCallBack = t, this._recTarget = e, this._autoShare = n, null != this._recCallBack && null != this._recTarget && (n ? this.shareRecVideo(t, e) : this._recCallBack.call(this._recTarget)));
      }, t.prototype.isExistRecVideo = function () {
        return this._recTime > 3e3;
      }, t.prototype.getRecSecond = function () {
        if (0 == this._recStartTime) return 0;var t = Math.floor((a.default.serverTime - this._recStartTime) / 1e3);return t > 0 ? t : 0;
      }, t.prototype.clearRecVideo = function () {
        this._isRecStatus = !1, this._recStartTime = 0, this._recTime = 0, this._recCallBack = null, this._recTarget = null, this._autoShare = !1, i.default.dispatchEvent(o.SdkEvent.REC_VIDEO_CLEAR);
      }, t.prototype.shareRecVideo = function (t, e) {
        void 0 === t && (t = null), void 0 === e && (e = null), this.showToast("\u529F\u80FD\u4E0D\u5F00\u653E");
      }, Object.defineProperty(t.prototype, "banner_time", { get: function get() {
          return this._banner_time;
        }, enumerable: !1, configurable: !0 }), t.prototype.openUrl = function (t, e) {
        void 0 === e && (e = 0);
      }, t.prototype.showToast = function (t, e) {
        void 0 === e && (e = 2e3), u.default.show(t);
      }, t.prototype.shareInvite = function () {}, t;
    }();n.default = p, cc._RF.pop();
  }, { "../../Game/Tips/GeneralTips": "GeneralTips", "../Core/GameType": "GameType", "../Manager/DataManager": "DataManager", "../Manager/GlobalEventManager": "GlobalEventManager", "../Manager/HostManager": "HostManager", "../Manager/Logger": "Logger", "../Manager/SysConfig": "SysConfig", "../Manager/TimeManager": "TimeManager", "../Util/Base64": "Base64", "../Util/MD5": "MD5", "../Util/MathUtil": "MathUtil" }], AbstractWorker: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "e8f7bolaUNHTrl78kBR03vf", "AbstractWorker"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./MsgPackError"),
        i = function () {
      function t(t, e) {
        void 0 === t && (t = null), void 0 === e && (e = 0), this.incomplete = { toString: function toString() {
            return "incomplete";
          } }, this.factory = t, this.priority = e;
      }return Object.defineProperty(t.prototype, "factory", { get: function get() {
          return this._factory;
        }, set: function set(t) {
          this._factory = t;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "priority", { get: function get() {
          return this._priority;
        }, set: function set(t) {
          this._priority != t && (this._priority = t, this.factory && (this.factory.unassign(this), this.factory.assign(this)));
        }, enumerable: !1, configurable: !0 }), t.prototype.checkByte = function () {
        return !1;
      }, t.prototype.checkType = function () {
        return !1;
      }, t.prototype.assembly = function () {
        throw new o.default("The assembly method must be overriden by a subclass.");
      }, t.prototype.disassembly = function () {
        throw new o.default("The disassembly method must be overriden by a subclass.");
      }, t;
    }();n.default = i, cc._RF.pop();
  }, { "./MsgPackError": "MsgPackError" }], AchieveConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "07ba9oXw6RDBaERddU/u97N", "AchieveConfig");var _o4,
        i = this && this.__extends || (_o4 = function o(t, e) {
      return (_o4 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o4(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Config/AbsConfig"),
        a = t("./item/AchieveData"),
        s = function (t) {
      function e() {
        return t.call(this, a.default) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.getListByType = function (t) {
        for (var e = new Array(), n = this._list.length, o = 0; o < n; o++) {
          var i = this._list[o];i.type == t && e.push(i);
        }return e;
      }, e.prototype.getMaxTarget = function (t, e) {
        for (var n = this.getListByType(t), o = n.length, i = 0; i < o; i++) {
          var r = n[i];if (r.target >= e) return r.target;
        }return 0;
      }, e._ins = null, e.type_sd = 1, e.type_sj = 2, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../Common/Config/AbsConfig": "AbsConfig", "./item/AchieveData": "AchieveData" }], AchieveData: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "4fc9fHu/wJHfJ9W5hvMp01c", "AchieveData"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        this._id = t.attributes.id, this._name = t.attributes.name, this._type = t.attributes.type, this._target = t.attributes.target, this._spId = t.attributes.spId, this._count = t.attributes.count, this._image = t.attributes.image, this._unit = t.attributes.unit;
      }return Object.defineProperty(t.prototype, "id", { get: function get() {
          return this._id;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "name", { get: function get() {
          return this._name;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "type", { get: function get() {
          return this._type;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "target", { get: function get() {
          return this._target;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "spId", { get: function get() {
          return this._spId;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "count", { get: function get() {
          return this._count;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "image", { get: function get() {
          return this._image;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "unit", { get: function get() {
          return this._unit;
        }, enumerable: !1, configurable: !0 }), t.cfgFile = "achieve", t;
    }();n.default = o, cc._RF.pop();
  }, {}], AchievementPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "84604j2r3VH5Z7WKrn6mgNc", "AchievementPanel");var _o5,
        i = this && this.__extends || (_o5 = function o(t, e) {
      return (_o5 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o5(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Manager/CommandController"),
        d = t("../Config/ProductConfig"),
        h = t("../../Common/Manager/Logger"),
        p = t("../Config/AchieveConfig"),
        _ = cc._decorator,
        m = _.ccclass,
        g = (_.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.start = function () {}, e.prototype.onStart = function () {
        h.default.log("AchievementPanel onStart!!!"), this.contextView = s.default.getNode(this.node, "frame/contextView"), this.btn_close = s.default.getNode(this.node, "frame/btn_close"), this.btn_close.on("touchend", this.onTouchCloseHandler, this), cc.game.on("refreshAchievementList", this.refreshAchievementList, this);
      }, e.prototype.onShow = function () {
        h.default.log("AchievementPanel onShow!!!"), this.refreshAchievementList();
      }, e.prototype.refreshAchievementList = function () {
        var t = this;this.contextView.removeAllChildren(), this.achievement_item = s.default.getNode(this.node, "frame/achievement_item"), f.default.achieveList(function (e) {
          h.default.log(e.l, "\u6210\u5C31\u5217\u8868"), t.achieveList = e.l, t.orderachieveList();
        }, this, function () {});
      }, e.prototype.orderachieveList = function () {
        this.achieveList = this.achieveList.sort(this.compare("id")), h.default.log(this.achieveList), this.achieveListRow = this.group(this.achieveList, 5), h.default.log(this.achieveListRow, "achieveListRow"), this.showAchieveList();
      }, e.prototype.showAchieveList = function () {
        var t = p.default.ins.getList();for (var e in h.default.log(t, "achieveData"), this.achieveListRow) {
          for (var n in this.achieveListRow[e]) {
            if (0 == this.achieveListRow[e][n].f) {
              h.default.log(n, "jjj"), h.default.log("\u672A\u5B8C\u6210");var o = this.achieveListRow[e][n].id,
                  i = p.default.ins.getItem(o),
                  r = this.achieveListRow[e][n].c,
                  a = i.target,
                  s = i.name,
                  c = i.image,
                  l = i.count,
                  u = (g = d.default.ins.getItem(i.spId)).icon,
                  f = g.name;h.default.log(i, "\u6210\u5C31item"), (y = cc.instantiate(this.achievement_item)).active = !0, this.contextView.addChild(y);var _ = { id: o, spId: i.spId, unit: i.unit, icon_bg: null, icon: c, name_label: s, current_points: r, total_points: a, gift_icon: u, gift_count: l, gift_name: f, finished: !1, completed: !1 };y.getComponent("achievement_item").init(_);break;
            }if (1 == this.achieveListRow[e][n].f) {
              h.default.log("\u5B8C\u6210\u672A\u9886\u5956"), o = this.achieveListRow[e][n].id, i = p.default.ins.getItem(o), r = this.achieveListRow[e][n].c, a = i.target, s = i.name, c = i.image, l = i.count, u = (g = d.default.ins.getItem(i.spId)).icon, f = g.name, h.default.log(i, "\u6210\u5C31item"), (y = cc.instantiate(this.achievement_item)).active = !0, this.contextView.addChild(y);var m = { id: o, spId: i.spId, unit: i.unit, icon_bg: null, icon: c, name_label: s, current_points: r, total_points: a, gift_icon: u, gift_count: l, gift_name: f, finished: !0, completed: !1 };y.getComponent("achievement_item").init(m);break;
            }if (2 != this.achieveListRow[e][n].f) ;else if (h.default.log("\u5DF2\u9886\u5956"), n == (this.achieveListRow[e].length - 1).toString()) {
              var g, y;o = this.achieveListRow[e][n].id, i = p.default.ins.getItem(o), r = this.achieveListRow[e][n].c, a = i.target, s = i.name, c = i.image, l = i.count, u = (g = d.default.ins.getItem(i.spId)).icon, f = g.name, h.default.log(i, "\u6210\u5C31item"), (y = cc.instantiate(this.achievement_item)).active = !0, this.contextView.addChild(y);var b = { id: o, spId: i.spId, unit: i.unit, icon_bg: null, icon: c, name_label: s, current_points: r, total_points: a, gift_icon: u, gift_count: l, gift_name: f, finished: !0, completed: !0 };y.getComponent("achievement_item").init(b);
            }
          }
        }
      }, e.prototype.initAchievementItemData = function () {}, e.prototype.onClose = function () {}, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, e.prototype.onTouchReceiveGiftHandler = function () {}, e.prototype.compare = function (t) {
        return function (e, n) {
          return e[t] - n[t];
        };
      }, e.prototype.group = function (t, e) {
        for (var n = 0, o = []; n < t.length;) {
          o.push(t.slice(n, n += e));
        }return o;
      }, r([m], e);
    }(a.default));n.default = g, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/AchieveConfig": "AchieveConfig", "../Config/ProductConfig": "ProductConfig", "../Manager/CommandController": "CommandController" }], ActivePanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "f0fb4KRWExPJL5SPRFWr4uc", "ActivePanel");var _o6,
        i = this && this.__extends || (_o6 = function o(t, e) {
      return (_o6 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o6(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Fb/FbEndPanel"),
        d = cc._decorator,
        h = d.ccclass,
        p = (d.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.TopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.webView = s.default.getComponent(cc.WebView, this.node, "webView");
      }, e.prototype.onShow = function () {
        this.data && (console.log("---------", this.data), this.webView.url = this.data.url, console.log(this.webView));
      }, e.prototype.onClose = function () {
        1 == this.data.t && u.default.callClazzFunc(f.default, "reviveCall");
      }, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this);
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, r([h], e);
    }(a.default));n.default = p, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Fb/FbEndPanel": "FbEndPanel" }], AddrInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "c59ddR/HvpBWakpiQ2vBs2w", "AddrInfo");var _o7,
        i = this && this.__extends || (_o7 = function o(t, e) {
      return (_o7 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o7(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = function (t) {
      function e() {
        return t.call(this) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.init = function (t) {
        null != t && null != t.addr && (this._name = t.addr.name, this._qq = t.addr.qq, this._tel = t.addr.tel, this._addr = t.addr.addr);
      }, e.prototype.saveData = function (t) {
        t.addr = { name: this._name, qq: this._qq, tel: this._tel, addr: this._addr };
      }, Object.defineProperty(e.prototype, "name", { get: function get() {
          return this._name;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "qq", { get: function get() {
          return this._qq;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "tel", { get: function get() {
          return this._tel;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "addr", { get: function get() {
          return this._addr;
        }, enumerable: !1, configurable: !0 }), e.prototype.setAddrInfo = function (t, e, n, o) {
        this._name = t, this._qq = e, this._tel = n, this._addr = o, this.save();
      }, e;
    }(t("../../Common/Info/AbsInfo").default);n.default = r, cc._RF.pop();
  }, { "../../Common/Info/AbsInfo": "AbsInfo" }], ArrayWorker: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "731bbn6qShN6rRxB6sNnWRY", "ArrayWorker");var _o8,
        i = this && this.__extends || (_o8 = function o(t, e) {
      return (_o8 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o8(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = function (t) {
      function e(e, n) {
        return void 0 === e && (e = null), void 0 === n && (n = 0), t.call(this, e, n) || this;
      }return i(e, t), e.prototype.checkByte = function (t) {
        return 144 == (240 & t) || 220 == t || 221 == t;
      }, e.prototype.checkType = function (t) {
        return t instanceof Array;
      }, e.prototype.assembly = function (t, e) {
        var n = t.length;n < 16 ? e.writeByte(144 | n) : n < 65536 ? (e.writeByte(220), e.writeShort(n)) : (e.writeByte(221), e.writeUnsignedInt(n));for (var o = 0; o < n; o++) {
          this.factory.getWorkerByType(t[o]).assembly(t[o], e);
        }
      }, e.prototype.disassembly = function (t, e) {
        var n = -1;144 == (240 & t) ? n = 15 & t : 220 == t && e.bytesAvailable >= 2 ? n = e.readUnsignedShort() : 221 == t && e.bytesAvailable >= 4 && (n = e.readUnsignedInt());var o = [];if (o.length < n) for (var i, r = o.length; r < n && 0 != e.bytesAvailable; r++) {
          i = 255 & e.readByte();var a = this.factory.getWorkerByByte(i).disassembly(i, e);if (a == this.incomplete) break;o.push(a);
        }return o.length == n ? o : this.incomplete;
      }, e;
    }(t("./AbstractWorker").default);n.default = r, cc._RF.pop();
  }, { "./AbstractWorker": "AbstractWorker" }], Base64: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "3a795BHtktOHbZ9y7Br0JrY", "Base64"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t() {}return Object.defineProperty(t, "keystr", { get: function get() {
          return t.KEYSTR;
        }, enumerable: !1, configurable: !0 }), t.encode = function (e) {
        var n,
            o,
            i,
            r,
            a,
            s,
            c,
            l = t.KEYSTR,
            u = "",
            f = 0;for (e = this._utf8_encode(e); f < e.length;) {
          r = (n = e.charCodeAt(f++)) >> 2, a = (3 & n) << 4 | (o = e.charCodeAt(f++)) >> 4, s = (15 & o) << 2 | (i = e.charCodeAt(f++)) >> 6, c = 63 & i, isNaN(o) ? s = c = 64 : isNaN(i) && (c = 64), u = u + l.charAt(r) + l.charAt(a) + l.charAt(s) + l.charAt(c);
        }return u;
      }, t.decode = function (e) {
        var n,
            o,
            i,
            r,
            a,
            s,
            c = t.KEYSTR,
            l = "",
            u = 0;for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); u < e.length;) {
          n = c.indexOf(e.charAt(u++)) << 2 | (r = c.indexOf(e.charAt(u++))) >> 4, o = (15 & r) << 4 | (a = c.indexOf(e.charAt(u++))) >> 2, i = (3 & a) << 6 | (s = c.indexOf(e.charAt(u++))), l += String.fromCharCode(n), 64 != a && (l += String.fromCharCode(o)), 64 != s && (l += String.fromCharCode(i));
        }return this._utf8_decode(l);
      }, t.decodeBuffer = function (e, n) {
        void 0 === n && (n = !1);for (var o = n ? t.decode(e) : e, i = new ArrayBuffer(o.length), r = new Uint8Array(i), a = 0, s = o.length; a < s; a++) {
          r[a] = o.charCodeAt(a);
        }return r;
      }, t._utf8_encode = function (t) {
        t = t.replace(/\r\n/g, "\n");for (var e = "", n = 0; n < t.length; n++) {
          var o = t.charCodeAt(n);o < 128 ? e += String.fromCharCode(o) : o > 127 && o < 2048 ? (e += String.fromCharCode(o >> 6 | 192), e += String.fromCharCode(63 & o | 128)) : (e += String.fromCharCode(o >> 12 | 224), e += String.fromCharCode(o >> 6 & 63 | 128), e += String.fromCharCode(63 & o | 128));
        }return e;
      }, t._utf8_decode = function (t) {
        for (var e = "", n = 0, o = 0, i = 0, r = 0; n < t.length;) {
          (o = t.charCodeAt(n)) < 128 ? (e += String.fromCharCode(o), n++) : o > 191 && o < 224 ? (i = t.charCodeAt(n + 1), e += String.fromCharCode((31 & o) << 6 | 63 & i), n += 2) : (i = t.charCodeAt(n + 1), r = t.charCodeAt(n + 2), e += String.fromCharCode((15 & o) << 12 | (63 & i) << 6 | 63 & r), n += 3);
        }return e;
      }, t.KEYSTR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", t;
    }();n.default = o, cc._RF.pop();
  }, {}], BaseConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "01b12L1qYpMQrx3Ar9pHN6D", "BaseConfig");var _o9,
        i = this && this.__extends || (_o9 = function o(t, e) {
      return (_o9 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o9(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Config/AbsConfig"),
        a = t("./item/BaseData"),
        s = function (t) {
      function e() {
        return t.call(this, a.default) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.getLottery1 = function () {
        return this.getItem(1).lottery1;
      }, e.prototype.getLottery2 = function () {
        return this.getItem(1).lottery2;
      }, e.prototype.getLotteryGiftCount = function (t) {
        var e = this.getItem(1);return 1 == t ? e.lottery2 : e.lottery1;
      }, e.prototype.getExchangeMoney = function () {
        return this.getItem(1).exchangeMoney;
      }, e._ins = null, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../Common/Config/AbsConfig": "AbsConfig", "./item/BaseData": "BaseData" }], BaseData: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "81fb2B5znBPl6PsbClPWtZ7", "BaseData"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        this._id = t.attributes.id, this._difficulty = t.attributes.difficulty, this._lottery1 = t.attributes.lottery1, this._lottery2 = t.attributes.lottery2, this._exchangeMoney = t.attributes.exchangeMoney;
      }return Object.defineProperty(t.prototype, "id", { get: function get() {
          return this._id;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "difficulty", { get: function get() {
          return this._difficulty;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "lottery1", { get: function get() {
          return this._lottery1;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "lottery2", { get: function get() {
          return this._lottery2;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "exchangeMoney", { get: function get() {
          return this._exchangeMoney;
        }, enumerable: !1, configurable: !0 }), t.cfgFile = "base", t;
    }();n.default = o, cc._RF.pop();
  }, {}], BinaryWorker: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "e85bfwADwJGsJpNRf9wIcGX", "BinaryWorker");var _o10,
        i = this && this.__extends || (_o10 = function o(t, e) {
      return (_o10 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o10(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("./AbstractWorker"),
        a = t("../../../Common/Core/ByteArray"),
        s = function (t) {
      function e(e, n) {
        return void 0 === e && (e = null), void 0 === n && (n = 0), t.call(this, e, n) || this;
      }return i(e, t), e.prototype.checkByte = function (t) {
        return 196 == t || 197 == t || 198 == t;
      }, e.prototype.checkType = function (t) {
        return t instanceof a.default;
      }, e.prototype.assembly = function (t, e) {
        var n = t,
            o = n.length;o < 256 ? (e.writeByte(196), e.writeByte(n.length)) : o < 65536 ? (e.writeByte(197), e.writeShort(n.length)) : (e.writeByte(198), e.writeUnsignedInt(n.length)), e.writeBytes(n, 0, n.length);
      }, e.prototype.disassembly = function (t, e) {
        var n = -1;if (196 == t && e.bytesAvailable >= 1 ? n = e.readByte() : 197 == t && e.bytesAvailable >= 2 ? n = e.readUnsignedShort() : 198 == t && e.bytesAvailable >= 4 && (n = e.readUnsignedInt()), e.bytesAvailable >= n) {
          var o = new a.default();return n > 0 && e.readBytes(o, 0, n), o;
        }return this.incomplete;
      }, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../../Common/Core/ByteArray": "ByteArray", "./AbstractWorker": "AbstractWorker" }], BooleanWorker: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "c28837cVPREHrRB5z7zmaGh", "BooleanWorker");var _o11,
        i = this && this.__extends || (_o11 = function o(t, e) {
      return (_o11 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o11(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = function (t) {
      function e(e, n) {
        return void 0 === e && (e = null), void 0 === n && (n = 0), t.call(this, e, n) || this;
      }return i(e, t), e.prototype.checkByte = function (t) {
        return 195 == t || 194 == t;
      }, e.prototype.checkType = function (t) {
        return "boolean" == typeof t;
      }, e.prototype.assembly = function (t, e) {
        e.writeByte(t ? 195 : 194);
      }, e.prototype.disassembly = function (t) {
        return 195 == t;
      }, e;
    }(t("./AbstractWorker").default);n.default = r, cc._RF.pop();
  }, { "./AbstractWorker": "AbstractWorker" }], BuffConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "67b95m5K+dPVpG0G19wzodB", "BuffConfig");var _o12,
        i = this && this.__extends || (_o12 = function o(t, e) {
      return (_o12 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o12(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Config/AbsConfig"),
        a = t("./item/BuffData"),
        s = function (t) {
      function e() {
        return t.call(this, a.default) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e._ins = null, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../Common/Config/AbsConfig": "AbsConfig", "./item/BuffData": "BuffData" }], BuffController: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "b1e44kFnHZI/qXSnq+R3S5C", "BuffController");var _o13,
        i = this && this.__extends || (_o13 = function o(t, e) {
      return (_o13 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o13(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Core/GameType"),
        a = function (t) {
      function e(e) {
        var n = t.call(this) || this;return n._actor = e, n._count = 0, n._buffs = {}, n;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == this._ins && (this._ins = new e(null)), this._ins;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "actor", { get: function get() {
          return this._actor;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "buffs", { get: function get() {
          return this._buffs;
        }, enumerable: !1, configurable: !0 }), e.prototype.update = function () {
        for (var t in this._buffs) {
          var e = this._buffs[t];e && e.update();
        }
      }, e.prototype.createBuff = function () {}, e.prototype.addBuff = function (t, e) {
        var n = this.getBuff(t);null == n && (n = this.createBuff(t, e)) && (n.id = t, n.on(r.InfoEvent.EVENT_BUFF_FINISH, this.onBuffFinishHandler, this), this._buffs[t] = n, this._count++), n.reset();
      }, e.prototype.removeBuff = function (t) {
        var e = this.getBuff(t),
            n = !1;return null != e && (e.off(r.InfoEvent.EVENT_BUFF_FINISH, this.onBuffFinishHandler, this), this._buffs[e.id] = null, this._actor.emit(r.InfoEvent.EVENT_REMOVE_BUFF, e), this._count--, n = !0), n;
      }, e.prototype.removeAll = function () {
        for (var t in this._buffs) {
          var e = this._buffs[t];e && e.off(r.InfoEvent.EVENT_BUFF_FINISH, this.onBuffFinishHandler, this);
        }this._count = 0, this._buffs = {};
      }, e.prototype.getBuff = function (t) {
        return this._buffs[t];
      }, e.prototype.onBuffFinishHandler = function (t) {
        this.removeBuff(t.id);
      }, Object.defineProperty(e.prototype, "count", { get: function get() {
          return this._count;
        }, enumerable: !1, configurable: !0 }), e;
    }(cc.EventTarget);n.default = a, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType" }], BuffData: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "adcd1B6PYxGbK51WGnoOjwv", "BuffData"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        this._id = t.attributes.id, this._name = t.attributes.name, this._type = t.attributes.type, this._time = t.attributes.time, this._icon = t.attributes.icon, this._script = t.attributes.script, this._para = t.attributes.para, this._effect = t.attributes.effect;
      }return Object.defineProperty(t.prototype, "id", { get: function get() {
          return this._id;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "name", { get: function get() {
          return this._name;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "type", { get: function get() {
          return this._type;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "time", { get: function get() {
          return this._time;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "icon", { get: function get() {
          return this._icon;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "script", { get: function get() {
          return this._script;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "para", { get: function get() {
          return this._para;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "effect", { get: function get() {
          return this._effect;
        }, enumerable: !1, configurable: !0 }), t.cfgFile = "buff", t;
    }();n.default = o, cc._RF.pop();
  }, {}], BuffInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "14ac8mou+FD67npAkTdbovp", "BuffInfo");var _o14,
        i = this && this.__extends || (_o14 = function o(t, e) {
      return (_o14 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o14(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 }), n.FogBuff = n.DizzyBuff = n.BianPaoBuff = n.SnowballBuff = void 0;var r = t("../../Common/Manager/TimeManager"),
        a = t("../../Common/Core/GameType"),
        s = function (t) {
      function e(e, n, o) {
        void 0 === o && (o = 0);var i = t.call(this) || this;return i.isDispatch = !0, i._actor = e, i._cfgData = n, i._time = 1e3 * (parseInt(n.split(",")[0]) + o), i.reset(), i.start(), i;
      }return i(e, t), e.prototype.start = function () {}, e.prototype.stop = function () {}, Object.defineProperty(e.prototype, "effect", { get: function get() {
          return "";
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "time", { get: function get() {
          return this._time;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "actor", { get: function get() {
          return this._actor;
        }, enumerable: !1, configurable: !0 }), e.prototype.init = function (t) {
        void 0 === t && (t = null);
      }, e.prototype.reset = function () {
        this._curTime = r.default.serverTime + this.time;
      }, Object.defineProperty(e.prototype, "running", { get: function get() {
          return this._curTime >= r.default.serverTime;
        }, enumerable: !1, configurable: !0 }), e.prototype.update = function () {
        this.running ? this.onUpdate() : (this.stop(), this.eventDispatch(a.InfoEvent.EVENT_BUFF_FINISH));
      }, e.prototype.onUpdate = function () {}, Object.defineProperty(e.prototype, "curTime", { get: function get() {
          return Math.max(0, this._curTime - r.default.serverTime);
        }, enumerable: !1, configurable: !0 }), e.prototype.eventDispatch = function (t, e, n) {
        void 0 === e && (e = null), void 0 === n && (n = null), this.isDispatch && this.emit(t, this);
      }, e;
    }(t("../../Common/Info/AbsInfo").default);n.default = s;var c = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "effect", { get: function get() {
          return "snowball";
        }, enumerable: !1, configurable: !0 }), e;
    }(s);n.SnowballBuff = c;var l = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "effect", { get: function get() {
          return "bianpao";
        }, enumerable: !1, configurable: !0 }), e;
    }(s);n.BianPaoBuff = l;var u = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "effect", { get: function get() {
          return "dizzy";
        }, enumerable: !1, configurable: !0 }), e;
    }(s);n.DizzyBuff = u;var f = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "effect", { get: function get() {
          return "fog";
        }, enumerable: !1, configurable: !0 }), e;
    }(s);n.FogBuff = f, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Info/AbsInfo": "AbsInfo", "../../Common/Manager/TimeManager": "TimeManager" }], BufferBigEndian: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "71b5aX4YZdF17elU1F1kPG/", "BufferBigEndian"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t() {
        this.buffer = [], this.readOffset = 0;
      }return t.prototype.initWithUint8Array = function (t) {
        for (var e = 0; e < t.length; e++) {
          this.buffer[e] = t[e];
        }this.readOffset = 0;
      }, t.prototype.getUint8 = function () {
        return this.readOffset + 1 > this.buffer.length ? null : this.buffer[this.readOffset++];
      }, t.prototype.pushUint8 = function (t) {
        if (t > 255) throw Error("BufferBigEndian pushUint8 value need <= 255");this.buffer.push(t);
      }, t.prototype.getUint16 = function () {
        return this.readOffset + 2 > this.buffer.length ? null : this.getUint8() << 8 | this.getUint8();
      }, t.prototype.pushUint16 = function (t) {
        this.pushUint8(t >> 8 & 255), this.pushUint8(255 & t);
      }, t.prototype.getUint32 = function () {
        return this.readOffset + 4 > this.buffer.length ? null : 65536 * this.getUint16() + this.getUint16();
      }, t.prototype.pushUint32 = function (t) {
        this.pushUint16(t >> 16 & 65535), this.pushUint16(65535 & t);
      }, t.prototype.pushUnicodeWithUtf8 = function (t) {
        t <= 127 ? this.pushUint8(t) : t <= 255 ? (this.pushUint8(t >> 6 | 192), this.pushUint8(63 & t | 128)) : t <= 65535 ? (this.pushUint8(t >> 12 | 224), this.pushUint8(t >> 6 & 63 | 128), this.pushUint8(63 & t | 128)) : t <= 2097151 ? (this.pushUint8(t >> 18 | 240), this.pushUint8(t >> 12 & 63 | 128), this.pushUint8(t >> 6 & 63 | 128), this.pushUint8(63 & t | 128)) : t <= 67108863 ? (this.pushUint8(t >> 24 | 248), this.pushUint8(t >> 18 & 63 | 128), this.pushUint8(t >> 12 & 63 | 128), this.pushUint8(t >> 6 & 63 | 128), this.pushUint8(63 & t | 128)) : (this.pushUint8(t >> 30 & 1 | 252), this.pushUint8(t >> 24 & 63 | 128), this.pushUint8(t >> 18 & 63 | 128), this.pushUint8(t >> 12 & 63 | 128), this.pushUint8(t >> 6 & 63 | 128), this.pushUint8(63 & t | 128));
      }, t.prototype.getUnicodeWithUtf8 = function () {
        var t,
            e = this.getUint8();if (!e) return null;for (var n = 7; 1 == (e >> n & 1);) {
          n--;
        }t = 0 == (n = 7 - n) ? e : e & Math.pow(2, 7 - n) - 1;for (var o = 1; o < n; o++) {
          t = t << 6 | 63 & this.getUint8();
        }return { unicode: t, len: 0 == n ? 1 : n };
      }, t.prototype.parseUnicodeFromUtf16 = function (t, e) {
        return 55296 == (64512 & t) && 56320 == (64512 & e) ? { unicode: 65536 + ((1023 & t) << 10 | 1023 & e), ok: !0 } : { ok: !1 };
      }, t.prototype.pushStringWithUtf8 = function (t) {
        for (var e = this.buffer.length, n = 0; n < t.length; n++) {
          var o = t.charCodeAt(n);if (o < 128) this.pushUnicodeWithUtf8(o);else if (o < 2048) this.pushUnicodeWithUtf8(o);else {
            var i = t.charCodeAt(n + 1),
                r = this.parseUnicodeFromUtf16(o, i);r.ok ? (this.pushUnicodeWithUtf8(r.unicode), n++) : this.pushUnicodeWithUtf8(o);
          }
        }return this.buffer.length - e;
      }, t.prototype.getStringWithUtf8 = function (t) {
        if (t < 1) return "";if (this.readOffset + t > this.buffer.length) return "";for (var e = "", n = 0; n < t;) {
          var o = this.getUnicodeWithUtf8();if (!o) break;if (n += o.len, o.unicode < 65536) e += String.fromCharCode(o.unicode);else {
            var i = o.unicode - 65536,
                r = i >> 10 | 55296,
                a = 1023 & i | 56320;e += String.fromCharCode(r, a);
          }
        }return e;
      }, t.prototype.pushStringWithUtf16 = function (t) {
        for (var e = this.buffer.length, n = 0; n < t.length; n++) {
          var o = t[n].charCodeAt(0);this.pushUint16(o);
        }return this.buffer.length - e;
      }, t.prototype.getStringWithUtf16 = function (t) {
        if (t < 1) return "";if (this.readOffset + t > this.buffer.length || t % 2 != 0) return "";for (var e = "", n = 0; n < t; n += 2) {
          var o = this.getUint16(),
              i = this.getUint16();e += String.fromCharCode(o, i);
        }return e;
      }, t.prototype.tostring = function () {
        for (var t = "", e = 0; e < this.buffer.length; e++) {
          var n = this.buffer[e].toString(16);t += 1 == n.length ? "0" + n.toUpperCase() : n.toUpperCase();
        }return t;
      }, t.prototype.toUint8Array = function () {
        for (var t = new Uint8Array(this.buffer.length), e = 0; e < this.buffer.length; e++) {
          t[e] = this.buffer[e];
        }return t;
      }, t.prototype.toUtf8String = function () {
        return this.getStringWithUtf8(this.buffer.length);
      }, t.prototype.toJSON = function () {
        var t = this.getStringWithUtf8(this.buffer.length);return JSON.parse(t);
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], BufferUtil: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "1e500WXFBFHTbM8N19Pov12", "BufferUtil"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../Core/ByteArray"),
        i = function () {
      function t() {}return t.test01 = function (e, n, o) {
        var i = ((o & e) + (n ^ e)) % 255;t._keys.clear(), t._keys.position = 0;for (var r = 0; r < o; r++) {
          e -= (i * o ^ n) % 255, n -= i, i = e % 255, t._keys.writeByte(255 & i);
        }return t._keys.position = 0, t._keys;
      }, t.test02 = function (e, n, o, i) {
        for (var r = t.test01(e, n, o), a = 0; a < o; a++) {
          if (a < i.length) {
            var s = i.readByte(),
                c = r.readByte();i.position -= 1, i.writeByte(255 & (s ^ c));
          }
        }i.position = 0;
      }, t._keys = new o.default(), t._body = new o.default(), t._buff = new o.default(), t;
    }();n.default = i, cc._RF.pop();
  }, { "../Core/ByteArray": "ByteArray" }], ByteArray: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "0d3f4o5uORMZrj6JExxaL+a", "ByteArray"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(e) {
        this.setArrayBuffer = function (t) {
          this._setArrayBuffer(t);
        }, this.BUFFER_EXT_SIZE = 0, this.EOF_byte = -1, this.EOF_code_point = -1, this._setArrayBuffer(e || new ArrayBuffer(this.BUFFER_EXT_SIZE)), this.endian = t.BIG_ENDIAN;
      }return t.prototype._setArrayBuffer = function (t) {
        this.write_position = t.byteLength, this.data = new DataView(t), this._position = 0;
      }, Object.defineProperty(t.prototype, "buffer", { get: function get() {
          return this.data.buffer;
        }, set: function set(t) {
          this.data = new DataView(t);
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "dataView", { get: function get() {
          return this.data;
        }, set: function set(t) {
          this.data = t, this.write_position = t.byteLength;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "bufferOffset", { get: function get() {
          return this.data.byteOffset;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "position", { get: function get() {
          return this._position;
        }, set: function set(t) {
          this._position = t, this.write_position = t > this.write_position ? t : this.write_position;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "length", { get: function get() {
          return this.write_position;
        }, set: function set(t) {
          this.write_position = t;var e = new Uint8Array(new ArrayBuffer(t)),
              n = this.data.buffer.byteLength;n > t && (this._position = t);var o = Math.min(n, t);e.set(new Uint8Array(this.data.buffer, 0, o)), this.buffer = e.buffer;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "bytesAvailable", { get: function get() {
          return this.data.byteLength - this._position;
        }, enumerable: !1, configurable: !0 }), t.prototype.clear = function () {
        this._setArrayBuffer(new ArrayBuffer(this.BUFFER_EXT_SIZE));
      }, t.prototype.readBoolean = function () {
        return this.validate(t.SIZE_OF_BOOLEAN) ? 0 != this.data.getUint8(this.position++) : null;
      }, t.prototype.readByte = function () {
        return this.validate(t.SIZE_OF_INT8) ? this.data.getInt8(this.position++) : null;
      }, t.prototype.readBytes = function (e, n, o) {
        if (void 0 === n && (n = 0), void 0 === o && (o = 0), 0 == o) o = this.bytesAvailable;else if (!this.validate(o)) return null;e ? e.validateBuffer(n + o) : e = new t(new ArrayBuffer(n + o));for (var i = 0; i < o; i++) {
          e.data.setUint8(i + n, this.data.getUint8(this.position++));
        }
      }, t.prototype.readDouble = function () {
        if (!this.validate(t.SIZE_OF_FLOAT64)) return null;var e = this.data.getFloat64(this.position, this.endian == t.LITTLE_ENDIAN);return this.position += t.SIZE_OF_FLOAT64, e;
      }, t.prototype.readFloat = function () {
        if (!this.validate(t.SIZE_OF_FLOAT32)) return null;var e = this.data.getFloat32(this.position, this.endian == t.LITTLE_ENDIAN);return this.position += t.SIZE_OF_FLOAT32, e;
      }, t.prototype.readInt = function () {
        if (!this.validate(t.SIZE_OF_INT32)) return null;var e = this.data.getInt32(this.position, this.endian == t.LITTLE_ENDIAN);return this.position += t.SIZE_OF_INT32, e;
      }, t.prototype.readShort = function () {
        if (!this.validate(t.SIZE_OF_INT16)) return null;var e = this.data.getInt16(this.position, this.endian == t.LITTLE_ENDIAN);return this.position += t.SIZE_OF_INT16, e;
      }, t.prototype.readUnsignedByte = function () {
        return this.validate(t.SIZE_OF_UINT8) ? this.data.getUint8(this.position++) : null;
      }, t.prototype.readUnsignedInt = function () {
        if (!this.validate(t.SIZE_OF_UINT32)) return null;var e = this.data.getUint32(this.position, this.endian == t.LITTLE_ENDIAN);return this.position += t.SIZE_OF_UINT32, e;
      }, t.prototype.readUnsignedShort = function () {
        if (!this.validate(t.SIZE_OF_UINT16)) return null;var e = this.data.getUint16(this.position, this.endian == t.LITTLE_ENDIAN);return this.position += t.SIZE_OF_UINT16, e;
      }, t.prototype.readUTF = function () {
        if (!this.validate(t.SIZE_OF_UINT16)) return null;var e = this.data.getUint16(this.position, this.endian == t.LITTLE_ENDIAN);return this.position += t.SIZE_OF_UINT16, e > 0 ? this.readUTFBytes(e) : "";
      }, t.prototype.readUTFBytes = function (t) {
        if (!this.validate(t)) return null;var e = new Uint8Array(this.buffer, this.bufferOffset + this.position, t);return this.position += t, this.decodeUTF8(e);
      }, t.prototype.writeBoolean = function (e) {
        this.validateBuffer(t.SIZE_OF_BOOLEAN), this.data.setUint8(this.position++, e ? 1 : 0);
      }, t.prototype.writeByte = function (e) {
        this.validateBuffer(t.SIZE_OF_INT8), this.data.setInt8(this.position++, e);
      }, t.prototype.writeBytes = function (t, e, n) {
        var o;if (void 0 === e && (e = 0), void 0 === n && (n = 0), !(e < 0) && !(n < 0) && (o = 0 == n ? t.length - e : Math.min(t.length - e, n)) > 0) {
          this.validateBuffer(o);for (var i = new DataView(t.buffer), r = o; r > 4; r -= 4) {
            this.data.setUint32(this._position, i.getUint32(e)), this.position += 4, e += 4;
          }for (; r > 0; r--) {
            this.data.setUint8(this.position++, i.getUint8(e++));
          }
        }
      }, t.prototype.writeDouble = function (e) {
        this.validateBuffer(t.SIZE_OF_FLOAT64), this.data.setFloat64(this.position, e, this.endian == t.LITTLE_ENDIAN), this.position += t.SIZE_OF_FLOAT64;
      }, t.prototype.writeFloat = function (e) {
        this.validateBuffer(t.SIZE_OF_FLOAT32), this.data.setFloat32(this.position, e, this.endian == t.LITTLE_ENDIAN), this.position += t.SIZE_OF_FLOAT32;
      }, t.prototype.writeInt = function (e) {
        this.validateBuffer(t.SIZE_OF_INT32), this.data.setInt32(this.position, e, this.endian == t.LITTLE_ENDIAN), this.position += t.SIZE_OF_INT32;
      }, t.prototype.writeShort = function (e) {
        this.validateBuffer(t.SIZE_OF_INT16), this.data.setInt16(this.position, e, this.endian == t.LITTLE_ENDIAN), this.position += t.SIZE_OF_INT16;
      }, t.prototype.writeUnsignedIntpublic = function (e) {
        this.validateBuffer(t.SIZE_OF_UINT32), this.data.setUint32(this.position, e, this.endian == t.LITTLE_ENDIAN), this.position += t.SIZE_OF_UINT32;
      }, t.prototype.writeUnsignedShort = function (e) {
        this.validateBuffer(t.SIZE_OF_UINT16), this.data.setUint16(this.position, e, this.endian == t.LITTLE_ENDIAN), this.position += t.SIZE_OF_UINT16;
      }, t.prototype.writeUnsignedInt = function (e) {
        this.validateBuffer(t.SIZE_OF_UINT32), this.data.setUint32(this.position, e, this.endian == t.LITTLE_ENDIAN), this.position += t.SIZE_OF_UINT32;
      }, t.prototype.writeUTF = function (e) {
        var n = this.encodeUTF8(e),
            o = n.length;this.validateBuffer(t.SIZE_OF_UINT16 + o), this.data.setUint16(this.position, o, this.endian == t.LITTLE_ENDIAN), this.position += t.SIZE_OF_UINT16, this._writeUint8Array(n, !1);
      }, t.prototype.writeUTFBytes = function (t) {
        this._writeUint8Array(this.encodeUTF8(t));
      }, t.prototype.toString = function () {
        return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
      }, t.prototype._writeUint8Array = function (t, e) {
        void 0 === e && (e = !0), e && this.validateBuffer(this.position + t.length);for (var n = 0; n < t.length; n++) {
          this.data.setUint8(this.position++, t[n]);
        }
      }, t.prototype.validate = function (t) {
        if (this.data.byteLength > 0 && this._position + t <= this.data.byteLength) return !0;
      }, t.prototype.validateBuffer = function (t, e) {
        if (void 0 === e && (e = !1), this.write_position = t > this.write_position ? t : this.write_position, t += this._position, this.data.byteLength < t || e) {
          var n = new Uint8Array(new ArrayBuffer(t + this.BUFFER_EXT_SIZE)),
              o = Math.min(this.data.buffer.byteLength, t + this.BUFFER_EXT_SIZE);n.set(new Uint8Array(this.data.buffer, 0, o)), this.buffer = n.buffer;
        }
      }, t.prototype.encodeUTF8 = function (t) {
        for (var e = 0, n = this.stringToCodePoints(t), o = []; n.length > e;) {
          var i = n[e++];if (this.inRange(i, 55296, 57343)) this.encoderError(i);else if (this.inRange(i, 0, 127)) o.push(i);else {
            var r = void 0,
                a = void 0;for (this.inRange(i, 128, 2047) ? (r = 1, a = 192) : this.inRange(i, 2048, 65535) ? (r = 2, a = 224) : this.inRange(i, 65536, 1114111) && (r = 3, a = 240), o.push(this.div(i, Math.pow(64, r)) + a); r > 0;) {
              var s = this.div(i, Math.pow(64, r - 1));o.push(128 + s % 64), r -= 1;
            }
          }
        }return new Uint8Array(o);
      }, t.prototype.decodeUTF8 = function (t) {
        for (var e, n = 0, o = "", i = 0, r = 0, a = 0, s = 0; t.length > n;) {
          var c = t[n++];if (c == this.EOF_byte) e = 0 != r ? this.decoderError(!1) : this.EOF_code_point;else if (0 == r) this.inRange(c, 0, 127) ? e = c : (this.inRange(c, 194, 223) ? (r = 1, s = 128, i = c - 192) : this.inRange(c, 224, 239) ? (r = 2, s = 2048, i = c - 224) : this.inRange(c, 240, 244) ? (r = 3, s = 65536, i = c - 240) : this.decoderError(!1), i *= Math.pow(64, r), e = null);else if (this.inRange(c, 128, 191)) {
            if (a += 1, i += (c - 128) * Math.pow(64, r - a), a !== r) e = null;else {
              var l = i,
                  u = s;i = 0, r = 0, a = 0, s = 0, e = this.inRange(l, u, 1114111) && !this.inRange(l, 55296, 57343) ? l : this.decoderError(!1, c);
            }
          } else i = 0, r = 0, a = 0, s = 0, n--, e = this.decoderError(!1, c);null !== e && e !== this.EOF_code_point && (e <= 65535 ? e > 0 && (o += String.fromCharCode(e)) : (e -= 65536, o += String.fromCharCode(55296 + (e >> 10 & 1023)), o += String.fromCharCode(56320 + (1023 & e))));
        }return o;
      }, t.prototype.encoderError = function () {}, t.prototype.decoderError = function (t, e) {
        return e || 65533;
      }, t.prototype.inRange = function (t, e, n) {
        return e <= t && t <= n;
      }, t.prototype.div = function (t, e) {
        return Math.floor(t / e);
      }, t.prototype.stringToCodePoints = function (t) {
        for (var e = [], n = 0, o = t.length; n < t.length;) {
          var i = t.charCodeAt(n);if (this.inRange(i, 55296, 57343)) {
            if (this.inRange(i, 56320, 57343)) e.push(65533);else if (n == o - 1) e.push(65533);else {
              var r = t.charCodeAt(n + 1);if (this.inRange(r, 56320, 57343)) {
                var a = 1023 & i,
                    s = 1023 & r;n += 1, e.push(65536 + (a << 10) + s);
              } else e.push(65533);
            }
          } else e.push(i);n += 1;
        }return e;
      }, t.LITTLE_ENDIAN = "littleEndian", t.BIG_ENDIAN = "bigEndian", t.SIZE_OF_BOOLEAN = 1, t.SIZE_OF_INT8 = 1, t.SIZE_OF_INT16 = 2, t.SIZE_OF_INT32 = 4, t.SIZE_OF_UINT8 = 1, t.SIZE_OF_UINT16 = 2, t.SIZE_OF_UINT32 = 4, t.SIZE_OF_FLOAT32 = 4, t.SIZE_OF_FLOAT64 = 8, t;
    }();n.default = o, cc._RF.pop();
  }, {}], ByteUtil: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "7e8f7s5rWRE2ZOnmkg72Rve", "ByteUtil"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t() {}return t.compress = function (t) {
        var e = new Uint8Array(t);return new Zlib.Deflate(e).compress();
      }, t.uncompress = function (t) {
        var e = new Uint8Array(t);return new Zlib.Inflate(e).decompress();
      }, t.test = function () {
        console.log("------------ByteUtil-----test---------");
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], CallBackUtils: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "23e18JhlOtGqITTlp0QuHqW", "CallBackUtils"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t, e) {
        void 0 === t && (t = null), void 0 === e && (e = null), this.setData(t, e);
      }return t.triggerCallBack = function (t, e, n) {
        void 0 === n && (n = null), null != e && (null != t ? null != n ? e.call(t, n) : e.call(t) : null != n ? e(n) : e());
      }, t.prototype.setData = function (t, e) {
        this.caller = t, this.callBack = e;
      }, t.prototype.trigger = function (e) {
        void 0 === e && (e = null), t.triggerCallBack(this.caller, this.callBack, e);
      }, t.prototype.triggerByReturn = function () {
        return this.callBack.call(this.caller);
      }, t.prototype.destroy = function () {
        this.caller = null, this.callBack = null;
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], CoinExchangePanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "6f715BuUgZKNqEW+xZTks1h", "CoinExchangePanel");var _o15,
        i = this && this.__extends || (_o15 = function o(t, e) {
      return (_o15 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o15(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Manager/CommandController"),
        d = t("../Config/BaseConfig"),
        h = t("../../Common/Manager/Logger"),
        p = t("../Info/PlayerInfo"),
        _ = t("./item/ProInfoCtr"),
        m = t("./ExchangeGiftTips"),
        g = cc._decorator,
        y = g.ccclass,
        b = (g.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.start = function () {}, e.prototype.onStart = function () {
        h.default.log("CoinExchangePanel onStart!!!"), this.proInfo = s.default.getNode(this.node, "proInfo"), this.proInfoCtr = new _.default(this.proInfo), this.exchange_rate = d.default.ins.getExchangeMoney(), this.btn_exchange = s.default.getComponent(cc.Button, this.node, "frame/exchange/exchange_btn"), this.btn_close = s.default.getNode(this.node, "frame/btn_close"), this.btn_close.on("touchend", this.onTouchCloseHandler, this), this.btn_add = s.default.getComponent(cc.Button, this.node, "frame/exchange/add_img"), this.btn_minus = s.default.getComponent(cc.Button, this.node, "frame/exchange/minus_img"), this.current_coin_label = s.default.getComponent(cc.Label, this.node, "frame/current_coin_label"), this.exchange_tips = s.default.getComponent(cc.Label, this.node, "frame/exchange/exchange_tips"), this.coin_count_label = s.default.getComponent(cc.Label, this.node, "frame/exchange/coin_bg/coin_count"), this.quan_count_label = s.default.getComponent(cc.Label, this.node, "frame/exchange/quan_bg/quan_count"), this.coin_count = 0, this.quan_count = this.coin_count / this.exchange_rate, this.btn_exchange.node.on("touchend", this.onTouchExchangeHandler, this), this.btn_add.node.on("touchend", this.onTouchAddHandler, this), this.btn_minus.node.on("touchend", this.onTouchMinusHandler, this), this.btn_add.node.on("touchstart", this.onTouchStartAddHandler, this), this.btn_minus.node.on("touchstart", this.onTouchStartMinusHandler, this), cc.game.on("exchangeGiftPanelRefresh", this.refreshPanel, this);
      }, e.prototype.onShow = function () {
        this.exchange_tips.string = "\u5151\u6362\u6BD4\u4F8B\uFF1A" + this.exchange_rate + "\u91D1\u5E01=1\u5956\u5238", this.proInfoCtr.onShow(), this.refreshPanel();
      }, e.prototype.onClose = function () {}, e.prototype.refreshPanel = function () {
        this.coin_count = 0, this.quan_count = this.coin_count / this.exchange_rate, this.updateUI();
      }, e.prototype.updateUI = function () {
        this.coin_count_label.string = this.coin_count.toString(), this.quan_count_label.string = this.quan_count.toString(), this.current_coin_label.string = "\u76EE\u524D\u5DF2\u6709" + p.default.ins.money + "\u91D1\u5E01";
      }, e.prototype.onTouchAddHandler = function () {
        c.default.playEffect(c.default.CLICK), this.coin_count += this.exchange_rate, this.coin_count > p.default.ins.money && (this.coin_count -= this.exchange_rate), this.quan_count = this.coin_count / this.exchange_rate, this.updateUI(), this.unscheduleAllCallbacks();
      }, e.prototype.onTouchStartAddHandler = function () {
        this.scheduleOnce(this.longPressAdd, 1);
      }, e.prototype.longPressAdd = function () {
        this.schedule(this.beginLongAdd, .1, cc.macro.REPEAT_FOREVER, .1);
      }, e.prototype.beginLongAdd = function () {
        c.default.playEffect(c.default.CLICK), this.coin_count += this.exchange_rate, this.coin_count > p.default.ins.money && (this.coin_count -= this.exchange_rate), this.quan_count = this.coin_count / this.exchange_rate, this.updateUI();
      }, e.prototype.onTouchMinusHandler = function () {
        c.default.playEffect(c.default.CLICK), this.coin_count -= this.exchange_rate, this.coin_count <= 0 && (this.coin_count = 0), this.quan_count = this.coin_count / this.exchange_rate, this.updateUI(), this.unscheduleAllCallbacks();
      }, e.prototype.onTouchStartMinusHandler = function () {
        this.scheduleOnce(this.longPressMinus, 1);
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, e.prototype.longPressMinus = function () {
        this.schedule(this.beginLongMinus, .1, cc.macro.REPEAT_FOREVER, .1);
      }, e.prototype.beginLongMinus = function () {
        c.default.playEffect(c.default.CLICK), this.coin_count -= this.exchange_rate, this.coin_count <= 0 && (this.coin_count += this.exchange_rate), this.quan_count = this.coin_count / this.exchange_rate, this.updateUI();
      }, e.prototype.onTouchExchangeHandler = function () {
        var t = this;c.default.playEffect(c.default.CLICK), this.btn_exchange.interactable = !1, f.default.exchangeGift(this.quan_count, function (e) {
          h.default.log(e), h.default.log("\u82B1\u8D39" + t.coin_count + "\u91D1\u5E01\u5151\u6362" + t.quan_count + "\u5956\u5238"), p.default.ins.money -= t.coin_count, p.default.ins.giftCoupon += t.quan_count, t.btn_exchange.interactable = !0, t.current_coin_label.string = "\u76EE\u524D\u5DF2\u6709" + p.default.ins.money + "\u91D1\u5E01";var n = { content: "\u672C\u6B21\u5151\u6362" + t.quan_count + "\u5956\u5238" };u.default.show(m.default, n);
        }, this, function (e) {
          h.default.error("\u5151\u6362\u5956\u5238\u5931\u8D25\uFF01\uFF01", e), t.btn_exchange.interactable = !0;
        });
      }, r([y], e);
    }(a.default));n.default = b, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/BaseConfig": "BaseConfig", "../Info/PlayerInfo": "PlayerInfo", "../Manager/CommandController": "CommandController", "./ExchangeGiftTips": "ExchangeGiftTips", "./item/ProInfoCtr": "ProInfoCtr" }], CommandController: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "d61d7j9U6pELJB79EpMSEoc", "CommandController"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../../Common/Sdks/GameSDK"),
        i = t("../../Common/Util/MD5"),
        r = t("../../Common/Manager/SysConfig"),
        a = t("../../Common/Util/NetUtil"),
        s = t("../../Common/Manager/HostManager"),
        c = t("../../Common/Manager/Logger"),
        l = t("../Info/FbInfo"),
        u = function () {
      function t() {}return t.makeSign = function (e) {
        var n = { uid: o.default.getUid(), ts: t.getCommandSeq(), params: JSON.stringify(e) };return n.sign = i.default.hex_md5(n.uid + n.ts.toString() + n.params + r.default.CLIENT_KEY), n;
      }, t.commandPost = function (e, n, i, r, l) {
        var u = t.makeSign(n),
            f = s.default.getHost() + e;c.default.log("command input:", f, n), a.default.encodePost(f, u, function (t) {
          if (c.default.log("command return:", f, t), t && null != t.errCode) return 3 != t.errCode && o.default.showToast(t.errMsg), void (l && r && l.call(r, t));i && r && i.call(r, t);
        }, this);
      }, t.getCommandSeq = function () {
        return this._commandSeq++, this._commandSeq;
      }, t.nickname = function (e, n, o, i, r, a) {
        var s = { nickname: e, avatarUrl: n, encryptedData: o, iv: i };t.commandPost("/login/nickname", s, r, a);
      }, t.fbStart = function (e, n) {
        t.commandPost("/game/fbStart", {}, e, n);
      }, t.fbSingle = function (e, n, o) {
        var i = { score: l.default.ins.currentScore, step: l.default.ins.step };t.commandPost("/game/fbSingle", i, e, n, o);
      }, t.fbSingleVideo = function (e, n) {
        var o = { score: l.default.ins.currentScore, step: l.default.ins.step };t.commandPost("/game/fbSingleVideo", o, e, n);
      }, t.fbPk = function (e, n, o, i) {
        var r = { win: e, score: l.default.ins.currentScore, step: l.default.ins.step };t.commandPost("/game/fbPk", r, n, o, i);
      }, t.fbPkVideo = function (e, n, o) {
        var i = { win: e, score: l.default.ins.currentScore, step: l.default.ins.step };t.commandPost("/game/fbPkVideo", i, n, o);
      }, t.getLotteryInfo = function (e, n) {
        var i = { ios: o.default.isIos() };t.commandPost("/game/getLotteryInfo", i, e, n);
      }, t.lotteryStart = function (e, n, i) {
        var r = { t: e, ios: o.default.isIos() };t.commandPost("/game/lotteryStart", r, n, i);
      }, t.lotteryEnd = function (e, n, i, r, a, s) {
        var c = { ios: o.default.isIos() };i && (c.name = i), r && (c.qq = r), a && (c.tel = a), s && (c.addr = s), t.commandPost("/game/lotteryEnd", c, e, n);
      }, t.exchange = function (e, n, o, i, r, a, s) {
        var c = { id: e };i && (c.name = i), r && (c.qq = r), a && (c.tel = a), s && (c.addr = s), t.commandPost("/game/exchange", c, n, o);
      }, t.myExchangeList = function (e, n) {
        t.commandPost("/game/myExchange", {}, e, n);
      }, t.exchangeGift = function (e, n, o, i) {
        var r = { gift: e };t.commandPost("/game/exchangeGift", r, n, o, i);
      }, t.rankRlz = function (e, n, o) {
        t.commandPost("/game/rankRlz", {}, e, n, o);
      }, t.rankPk = function (e, n, o) {
        t.commandPost("/game/rankPk", {}, e, n, o);
      }, t.sign = function (e, n, o, i, r, a) {
        var s = { day: e, video: o, t: n };t.commandPost("/game/sign", s, i, r, a);
      }, t.saveItem = function (e, n, o, i) {
        var r = { item: e };t.commandPost("/game/saveItem", r, n, o, i);
      }, t.buyItem = function (e, n, o, i, r) {
        var a = { spId: e, item: n };t.commandPost("/game/buyItem", a, o, i, r);
      }, t.achieveList = function (e, n, o) {
        t.commandPost("/game/achieveList", {}, e, n, o);
      }, t.achieveReward = function (e, n, o, i) {
        var r = { id: e };t.commandPost("/game/achieveReward", r, n, o, i);
      }, t._commandSeq = 1, t;
    }();n.default = u, cc._RF.pop();
  }, { "../../Common/Manager/HostManager": "HostManager", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/SysConfig": "SysConfig", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Util/MD5": "MD5", "../../Common/Util/NetUtil": "NetUtil", "../Info/FbInfo": "FbInfo" }], ComponentUtil: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "ee094k6LolPCro6qMjRY5RS", "ComponentUtil"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../UI/UIPanel"),
        i = function () {
      function t() {}return t.getComponent = function (e, n, o) {
        if (void 0 === o && (o = null), n) {
          if (null == o) return n.getComponent(e);var i = t.getNode(n, o);if (i) return i.getComponent(e);
        }return null;
      }, t.getAllComponents = function (t, e) {
        var n = [];if (e) for (var o, i, r = [e], a = 0; a < r.length;) {
          (i = (o = r[a]).getComponent(t)) && n.push(i), o.children.length > 0 && (r = r.concat(o.children)), a++;
        }return n;
      }, t.getNode = function (t, e) {
        if (void 0 === e && (e = null), t && e) {
          for (var n = e.split("/"), o = t, i = 0; i < n.length && null != o; i++) {
            o = o.getChildByName(n[i]);
          }return o;
        }return null;
      }, t.getUIPanel = function (t) {
        for (var e, n = t.getComponents(cc.Component), i = 0; i < n.length; i++) {
          if ((e = n[i]) && e instanceof o.default) return e;
        }return null;
      }, t.getNodeList = function (e) {
        for (var n = [e], o = e.children, i = 0; i < o.length; i++) {
          var r = t.getNodeList(o[i]);n = n.concat(r);
        }return n;
      }, t.findNode = function (e, n) {
        for (var o = t.getNodeList(n), i = 0; i < o.length; i++) {
          if ((n = o[i]).name == e) return n;
        }return null;
      }, t.setGray = function (e, n) {
        void 0 === n && (n = !0);for (var o = t.getNodeList(e), i = 0; i < o.length; i++) {
          var r = o[i].getComponent(cc.Sprite);r && r.node.isGray != n && (n ? r.setMaterial(0, cc.Material.getBuiltinMaterial("2d-gray-sprite")) : r.setMaterial(0, cc.Material.getBuiltinMaterial("2d-sprite")), r.node.isGray = n);
        }
      }, t.setButtonEnable = function (e, n) {
        for (var o = t.getAllComponents(cc.Button, e), i = 0; i < o.length; i++) {
          o[i].interactable = n;
        }
      }, t.loadResImg = function (t, e) {
        cc.resources.load(e, cc.SpriteFrame, function (n, o) {
          n ? console.log("SpriteFrame", n, e) : t.node && (t.spriteFrame = o);
        });
      }, t.loadRemoteImg = function (t, e, n, o, i) {
        cc.assetManager.loadRemote(e, { ext: ".png" }, function (e, r) {
          if (e) return console.log("err:" + JSON.stringify(e)), void (i && o && i.call(o));t.spriteFrame = new cc.SpriteFrame(r), n && o && n.call(o);
        });
      }, t;
    }();n.default = i, cc._RF.pop();
  }, { "../UI/UIPanel": "UIPanel" }], ConfigManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "5aaf0JJJkBNmqAzH08kEJZH", "ConfigManager"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../Core/ByteArray"),
        i = function () {
      function t() {}return Object.defineProperty(t, "ins", { get: function get() {
          return null == t._ins && (t._ins = new t()), t._ins;
        }, enumerable: !1, configurable: !0 }), t.prototype.loadRequest = function (t) {
        if (this._files = {}, null != t) {
          var e,
              n,
              i,
              r,
              a,
              s = new o.default(t.slice(0, 1)).readUnsignedByte(),
              c = t.slice(1);(a = s % 2 == 1 ? this.decompress(c) : new o.default(c)).endian = o.default.LITTLE_ENDIAN, a.position = 0, e = a.readInt();for (var l = 0; l < e; l++) {
            n = a.readUTFBytes(32), i = a.readInt(), r = a.readInt(), this._files[n] = { pos: i, size: r };
          }this._buffs = new o.default(), this._buffs.endian = o.default.LITTLE_ENDIAN, this._buffs.position = 0, a.readBytes(this._buffs, 0);
        }
      }, t.prototype.decompress = function (t) {
        var e = new Uint8Array(t),
            n = (e.byteOffset, new Zlib.Inflate(e).decompress());return new o.default(new Uint8Array(n).buffer);
      }, t.prototype.getConfigString = function (t) {
        if (this._files) {
          var e = this._files[t];if (e && this._buffs && e.pos + e.size <= this._buffs.length) return this._buffs.position = e.pos, this._buffs.readUTFBytes(e.size);
        }return "";
      }, t._ins = null, t;
    }();n.default = i, cc._RF.pop();
  }, { "../Core/ByteArray": "ByteArray" }], DataManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "7dabfou1EBC4KGe4YAqOzSb", "DataManager"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../Core/GameType"),
        i = t("./GlobalEventManager"),
        r = t("./TimeManager"),
        a = t("../../Game/Manager/GameManager"),
        s = t("./Logger"),
        c = function () {
      function t() {}return t.init = function (e) {
        s.default.log(e), null != e && null != e.d && (t.lastTime = e.d), null != e && null != e.sri && (t.select_role_id = e.sri), s.default.log("------DataManager-----------init-----------------"), s.default.log(e), a.default.load(e), i.default.on(o.GlobalEvent.EVENT_NEW_DAY, t.onNewDayHandler, t), i.default.on(o.InfoEvent.EVENT_SAVE, t.save, t), t.initFinish = !0;
      }, t.onNewDayHandler = function () {
        a.default.onNewDayHandler();
      }, Object.defineProperty(t, "getSaveData", { get: function get() {
          var e = t._saveData;return a.default.save(e), e.d = r.default.serverTime, e.sri = t.select_role_id, e;
        }, enumerable: !1, configurable: !0 }), t.logout = function () {
        var e = t.getSaveData;i.default.dispatchEvent(o.SdkEvent.LOGOUT, e);
      }, t.save = function () {
        if (t.initFinish) {
          var e = t.getSaveData;s.default.log("---save-----", e), i.default.dispatchEvent(o.SdkEvent.SAVE_DATA, e);
        }
      }, t.saveOpenData = function () {
        t.initFinish && i.default.dispatchEvent(o.SdkEvent.SAVE_OPEN_DATA);
      }, t._saveData = {}, t.initFinish = !1, t.lastTime = r.default.serverTime, t.select_role_id = 0, t;
    }();n.default = c, cc._RF.pop();
  }, { "../../Game/Manager/GameManager": "GameManager", "../Core/GameType": "GameType", "./GlobalEventManager": "GlobalEventManager", "./Logger": "Logger", "./TimeManager": "TimeManager" }], DebugPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "ef508TnniVJZpK/wdITNplO", "DebugPanel");var _o16,
        i = this && this.__extends || (_o16 = function o(t, e) {
      return (_o16 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o16(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Core/GameType"),
        c = t("../../Common/Util/ComponentUtil"),
        l = t("../../Common/Manager/MusicManager"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Tips/GeneralTips"),
        d = t("../Info/PlayerInfo"),
        h = cc._decorator,
        p = h.ccclass,
        _ = (h.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return s.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = c.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_submit = c.default.getComponent(cc.Button, this.node, "frame/btn_submit"), this.btn_submit.node.on(cc.Node.EventType.TOUCH_END, this.onTouchSubmitHandler, this), this.editbox = c.default.getComponent(cc.EditBox, this.node, "frame/editbox"), this.lb_out = c.default.getComponent(cc.Label, this.node, "frame/lb_out");
      }, e.prototype.onShow = function () {}, e.prototype.onTouchCloseHandler = function () {
        l.default.playEffect(l.default.CLICK), u.default.close(this);
      }, e.prototype.onTouchSubmitHandler = function () {
        var t = this.editbox.string.split(" ");switch (t[0]) {case "money":
            isNaN(parseInt(t[1])) ? f.default.show("\u53C2\u6570\u65E0\u6548") : d.default.ins.money = parseInt(t[1]);break;case "test":
            f.default.show("XXX\u4E0EXXX\u5728\u4E00\u9053\u83DC\u4E2D\u4F1A\u5F71\u54CD\u53E3\u5473\u5594~");break;default:
            console.log(this.lb_out), f.default.show("\u547D\u4EE4\u65E0\u6548"), u.default.close(this);}
      }, e.prototype.onDestroy = function () {
        this.btn_close.node.targetOff(this), this.btn_submit.node.targetOff(this), this.lb_out = null, t.prototype.onDestroy.call(this);
      }, r([p], e);
    }(a.default));n.default = _, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Info/PlayerInfo": "PlayerInfo", "../Tips/GeneralTips": "GeneralTips" }], ExchangeAddrPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "2c61bLeoo9LJbHW8Ufh+gvd", "ExchangeAddrPanel");var _o17,
        i = this && this.__extends || (_o17 = function o(t, e) {
      return (_o17 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o17(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("./ExchangeConfirm"),
        d = t("../../Common/Sdks/GameSDK"),
        h = t("../Info/AddrInfo"),
        p = cc._decorator,
        _ = p.ccclass,
        m = (p.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubPopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_ok = s.default.getComponent(cc.Button, this.node, "frame/btn_ok"), this.btn_ok.node.on(cc.Node.EventType.TOUCH_END, this.onTouchOkHandler, this), this.edx_name = s.default.getComponent(cc.EditBox, this.node, "frame/edx_name"), this.edx_qq = s.default.getComponent(cc.EditBox, this.node, "frame/edx_qq"), this.edx_tel = s.default.getComponent(cc.EditBox, this.node, "frame/edx_tel"), this.edx_addr = s.default.getComponent(cc.EditBox, this.node, "frame/edx_addr");
      }, e.prototype.onShow = function () {
        this.refresh();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this), this.btn_ok.node.targetOff(this);
      }, e.prototype.refresh = function () {
        null != h.default.ins.name && (this.edx_name.string = h.default.ins.name), null != h.default.ins.qq && (this.edx_qq.string = h.default.ins.qq), null != h.default.ins.tel && (this.edx_tel.string = h.default.ins.tel), null != h.default.ins.addr && (this.edx_addr.string = h.default.ins.addr);
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, e.prototype.onTouchOkHandler = function () {
        c.default.playEffect(c.default.CLICK);var t = this.edx_name.string,
            e = this.edx_qq.string,
            n = this.edx_tel.string,
            o = this.edx_addr.string;"" != t && "" != e && "" != n && "" != o ? (h.default.ins.setAddrInfo(t, e, n, o), u.default.show(f.default, { exchange: this.data.exchange, name: t, qq: e, tel: n, addr: o })) : d.default.showToast("\u8BF7\u586B\u5199\u6B63\u786E\u7684\u6536\u8D27\u4EBA\u4FE1\u606F\uFF0C\u5426\u5219\u65E0\u6CD5\u6536\u5230\u7269\u54C1");
      }, r([_], e);
    }(a.default));n.default = m, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Info/AddrInfo": "AddrInfo", "./ExchangeConfirm": "ExchangeConfirm" }], ExchangeConfirm: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "328abY7eudLs5XK+xgGo3CJ", "ExchangeConfirm");var _o18,
        i = this && this.__extends || (_o18 = function o(t, e) {
      return (_o18 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o18(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Manager/CommandController"),
        d = t("./ExchangeAddrPanel"),
        h = t("./ItemMessage1"),
        p = t("./ItemMessage"),
        _ = t("../../Common/Sdks/UmaTrackHelper"),
        m = t("../Config/ProductConfig"),
        g = t("../Info/PlayerInfo"),
        y = cc._decorator,
        b = y.ccclass,
        C = (y.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubWindowLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_ok = s.default.getComponent(cc.Button, this.node, "frame/btn_ok"), this.btn_ok.node.on(cc.Node.EventType.TOUCH_END, this.onTouchOkHandler, this);
      }, e.prototype.onShow = function () {
        this.refresh();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this), this.btn_ok.node.targetOff(this);
      }, e.prototype.refresh = function () {}, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, e.prototype.onTouchOkHandler = function () {
        c.default.playEffect(c.default.CLICK);var t = this,
            e = this.data.exchange;f.default.exchange(e.exchange.id, function (n) {
          u.default.close(t), u.default.close(d.default), null != n.id && (2 == m.default.ins.getItem(e.exchange.id).type ? u.default.show(h.default, { spId: e.exchange.id }) : u.default.show(p.default, { spId: e.exchange.id }), g.default.ins.giftCoupon = n.gfc, e.useCountChange(n.num), _.default.exchange(e.exchange.id));
        }, this, this.data.name, this.data.qq, this.data.tel, this.data.addr);
      }, r([b], e);
    }(a.default));n.default = C, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/ProductConfig": "ProductConfig", "../Info/PlayerInfo": "PlayerInfo", "../Manager/CommandController": "CommandController", "./ExchangeAddrPanel": "ExchangeAddrPanel", "./ItemMessage": "ItemMessage", "./ItemMessage1": "ItemMessage1" }], ExchangeGiftTips: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "2595cNTaa9Kq4elnNiMyEay", "ExchangeGiftTips");var _o19,
        i = this && this.__extends || (_o19 = function o(t, e) {
      return (_o19 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o19(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.ExchangeGiftTipsData = void 0;var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Sdks/UmaTrackHelper"),
        d = cc._decorator,
        h = d.ccclass,
        p = (d.property, function () {});n.ExchangeGiftTipsData = p;var _ = function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.TopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.sp_count_label = s.default.getComponent(cc.Label, this.node, "frame/sp_item/sp_count"), this.sp_icon_sprite = s.default.getComponent(cc.Sprite, this.node, "frame/sp_item/sp_icon"), this.tips_content_label = s.default.getComponent(cc.Label, this.node, "frame/tips_content_label");
      }, e.prototype.onShow = function () {
        f.default.trackEvent("1001"), this.init(this.data);
      }, e.prototype.onClose = function () {}, e.prototype.init = function (t) {
        this.tips_content_label.string = t.content, cc.game.emit("exchangeGiftPanelRefresh");
      }, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this);
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), f.default.trackEvent("1002"), u.default.close(this);
      }, r([h], e);
    }(a.default);n.default = _, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil" }], ExtensionWorker: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "c8a21ZPfdxK97lcK0Z8FkdK", "ExtensionWorker");var _o20,
        i = this && this.__extends || (_o20 = function o(t, e) {
      return (_o20 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o20(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("./MsgPackError"),
        a = function (t) {
      function e(e, n) {
        return void 0 === e && (e = null), void 0 === n && (n = 0), t.call(this, e, n) || this;
      }return i(e, t), e.prototype.checkByte = function (t) {
        return 212 == t || 213 == t || 214 == t || 215 == t || 216 == t || 199 == t || 200 == t || 201 == t;
      }, e.prototype.assembly = function () {
        throw new r.default("Extension format not supported.");
      }, e.prototype.disassembly = function () {
        throw new r.default("Extension format not supported.");
      }, e;
    }(t("./AbstractWorker").default);n.default = a, cc._RF.pop();
  }, { "./AbstractWorker": "AbstractWorker", "./MsgPackError": "MsgPackError" }], FbDogfallPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "07e69UWGxpNxIRNdNhFw9lS", "FbDogfallPanel");var _o21,
        i = this && this.__extends || (_o21 = function o(t, e) {
      return (_o21 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o21(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/Core/GameType"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../Info/FbInfo"),
        l = t("./item/FbOverHeadInfo"),
        u = t("../../Common/Sdks/GameSDK"),
        f = t("./base/AbsFbOverPanel"),
        d = t("../../Common/Sdks/UmaTrackHelper"),
        h = cc._decorator,
        p = h.ccclass,
        _ = (h.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return a.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.txt_dec = s.default.getComponent(cc.Label, this.node, "frame/txt_dec"), this.txt_dec1 = s.default.getComponent(cc.Label, this.node, "frame/txt_dec1"), this.txt_cj1 = s.default.getComponent(cc.Label, this.node, "frame/txt_cj1"), this.txt_cj2 = s.default.getComponent(cc.Label, this.node, "frame/txt_cj2"), this.btn_gameEnd = s.default.getNode(this.node, "frame/btn_gameEnd"), this.btn_gamerePlay = s.default.getNode(this.node, "frame/btn_gamerePlay"), this.btn_close = s.default.getNode(this.node, "frame/btn_close"), this.btn_gameEnd.on(cc.Node.EventType.TOUCH_END, this.onTouchGamerePlayHandler, this), this.btn_gamerePlay.on(cc.Node.EventType.TOUCH_END, this.onGetAwardByAd, this), this.btn_close.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_rank = s.default.getNode(this.node, "frame/btn_rank"), this.btn_rank.on(cc.Node.EventType.TOUCH_END, this.onTouchRankHandler, this);var t = s.default.getNode(this.node, "frame/left"),
            e = s.default.getNode(this.node, "frame/right");this.head_left = new l.default(t), this.head_right = new l.default(e);
      }, e.prototype.onShow = function () {
        1 == this.data.t ? d.default.trackEvent("1325") : d.default.trackEvent("1318"), this.txt_dec.string = "" + c.default.ins.rewardMoney, this.txt_dec1.string = c.default.ins.rewardPkPoint.toString(), this.upAtlInfo(this.txt_cj1, this.txt_cj2);var t = this.data;this.head_left.setData(t.lscroe, u.default.getIcon()), this.head_right.setData(t.wscore, c.default.ins.otherPlay.icon), this.registerNetCmd();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.head_left.destroy(), this.head_right.destroy(), this.head_left = null, this.head_right = null;
      }, r([p], e);
    }(f.default));n.default = _, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Info/FbInfo": "FbInfo", "./base/AbsFbOverPanel": "AbsFbOverPanel", "./item/FbOverHeadInfo": "FbOverHeadInfo" }], FbEndPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "685f74Lbz9CiLUvv+C/K/HR", "FbEndPanel");var _o22,
        i = this && this.__extends || (_o22 = function o(t, e) {
      return (_o22 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o22(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Manager/MusicManager"),
        c = t("../../Common/Core/GameType"),
        l = t("../Manager/GameManager"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Sdks/GameSDK"),
        d = t("../../Common/Sdks/UmaTrackHelper"),
        h = t("../Scene/GameScene"),
        p = t("../Info/FbInfo"),
        _ = t("../../Common/Util/ComponentUtil"),
        m = t("../../Common/Manager/Logger"),
        g = t("../Main/item/FbHead"),
        y = t("../Config/RlzConfig"),
        b = t("./FbRewardPanel"),
        C = t("../../Common/Manager/LoadResManager"),
        v = t("../Main/RankPanel"),
        I = cc._decorator,
        M = I.ccclass,
        P = (I.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }var n;return i(e, t), n = e, Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return c.UILayerType.FbEndLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.head0 = _.default.getNode(this.node, "frame/head0"), this.head1 = _.default.getNode(this.node, "frame/head1"), this.txt_uppc = _.default.getComponent(cc.Label, this.node, "frame/txt_uppc"), this.txt_rl_value = _.default.getComponent(cc.Label, this.node, "frame/txt_rl_value"), this.btn_do = _.default.getNode(this.node, "frame/btn_do"), this.btn_ad = _.default.getNode(this.node, "frame/btn_ad"), this.btn_do.on(cc.Node.EventType.TOUCH_END, this.onTouchDoHandler, this), this.btn_ad.on(cc.Node.EventType.TOUCH_END, this.onTouchAdHandler, this), this.headCtr0 = new g.default(this.head0, !0), this.headCtr1 = new g.default(this.head1, !0), this.ad_btn_txt = _.default.getComponent(cc.Sprite, this.node, "frame/btn_ad/Background/ad_btn_txt");var t = f.default.getIcon(),
            e = f.default.getNickname();this.headCtr0.setIcon(t), this.headCtr1.setIcon(t), this.headCtr1.setTxtValue(e), this.btn_rank = _.default.getNode(this.node, "frame/btn_rank"), this.btn_rank.on(cc.Node.EventType.TOUCH_END, this.onTouchRankHandler, this);
      }, e.prototype.onTouchRankHandler = function () {
        s.default.playEffect(s.default.CLICK), u.default.show(v.default);
      }, e.prototype.onTouchDoHandler = function () {
        s.default.playEffect(s.default.CLICK), m.default.log("-------onTouchDoHandler-----------"), s.default.playEffect(s.default.CLICK), u.default.close(this), u.default.show(b.default);
      }, e.prototype.onTouchAdHandler = function () {
        if (s.default.playEffect(s.default.CLICK), m.default.log("-------onTouchAdHandler-----------"), d.default.reviveClick(p.default.ins.reviveCount), p.default.ins.reviveCount >= 2) {
          var t = "\u6211\u7684\u71C3\u529B\u503C\u5DF2\u8FBE" + p.default.ins.score + "\uFF0C\u5FEB\u6765\u4E00\u8D77\u8D62QQ\u4F1A\u5458\u514D\u8D39\u793C\u54C1\uFF01";f.default.share(this.reviveCall, this, t);
        } else f.default.showVideoAd(this.reviveCall, this, c.VideoAdType.Single);
      }, e.prototype.reviveCall = function () {
        f.default.hideBannerAd(), d.default.reviveFinish(p.default.ins.reviveCount), u.default.close(this), p.default.ins.reviveCount += 1, h.default.ins.revive();
      }, e.prototype.onShow = function () {
        this.refresh(), p.default.ins.reviveCount >= 2 ? C.default.loadSprite(this.ad_btn_txt, "Atlas/atlas_gamer_result/share_fh") : C.default.loadSprite(this.ad_btn_txt, "Atlas/atlas_gamer_result/btn_add_fh"), d.default.reviveShow(p.default.ins.reviveCount), f.default.sdkId == c.SdkType.QQ && 0 == l.default.scribeAppMsg && (f.default.sdk.subscribeAppMsg(), l.default.scribeAppMsg = 1), f.default.showBannerAd();var t = p.default.ins.currentScore.toString(),
            e = y.default.ins.getPerByRlz(p.default.ins.currentScore);this.headCtr0.setTxtValue(t), this.txt_rl_value.string = t, this.txt_uppc.string = e + "%";
      }, e.prototype.onClose = function () {
        u.default.close(n);
      }, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.headCtr0.destroy(), this.headCtr1.destroy(), this.headCtr0 = null, this.headCtr1 = null;
      }, e.prototype.refresh = function () {}, n = r([M], e);
    }(a.default));n.default = P, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/RlzConfig": "RlzConfig", "../Info/FbInfo": "FbInfo", "../Main/RankPanel": "RankPanel", "../Main/item/FbHead": "FbHead", "../Manager/GameManager": "GameManager", "../Scene/GameScene": "GameScene", "./FbRewardPanel": "FbRewardPanel" }], FbHead: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "7346fD9t41NiarlYZca3qf0", "FbHead");var _o23,
        i = this && this.__extends || (_o23 = function o(t, e) {
      return (_o23 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o23(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../../Common/UI/UIItem"),
        a = t("../../../Common/Util/ComponentUtil"),
        s = function (t) {
      function e(e, n) {
        void 0 === n && (n = !0);var o = t.call(this, e) || this;return o.txt_value = n ? a.default.getComponent(cc.Label, o.node, "txt_value") : null, o;
      }return i(e, t), e.prototype.init = function () {
        t.prototype.init.call(this), this.icon_head = a.default.getComponent(cc.Sprite, this.node, "mask/icon_head");
      }, e.prototype.setIcon = function (t) {
        null != t && "" != t && a.default.loadRemoteImg(this.icon_head, t);
      }, e.prototype.setTxtValue = function (t) {
        null == t && (t = "null"), this.txt_value && (this.txt_value.string = t);
      }, e.prototype.destroy = function () {
        t.prototype.destroy.call(this), this.icon_head = null, this.txt_value = null;
      }, e.prototype.setGray = function (t) {
        a.default.setGray(this.icon_head.node, t);
      }, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../../Common/UI/UIItem": "UIItem", "../../../Common/Util/ComponentUtil": "ComponentUtil" }], FbInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "5434aXWxndAyZ+H77P3Dlf5", "FbInfo");var _o24,
        i = this && this.__extends || (_o24 = function o(t, e) {
      return (_o24 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o24(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Info/AbsInfo"),
        a = t("../../Common/Core/NumValue"),
        s = t("../../Common/UI/UIManager"),
        c = t("../Fb/FbPanel"),
        l = t("../../Common/Sdks/GameSDK"),
        u = t("../../Common/Manager/DataManager"),
        f = t("../../Common/Core/NumValueBase64"),
        d = function (t) {
      function e() {
        var e = t.call(this) || this;return e._isNewRecord = !1, e._score = new a.default(), e._currentScore = new f.default(), e._reviveCount = new a.default(), e._rewardMoney = new a.default(), e._pkPoint = new a.default(), e._rewardPkPoint = new a.default(), e._pkWinNum = 0, e._otherPlay = null, e._otherPKPoint = 0, e._pkPointRank = 0, e._step = new a.default(), e;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.init = function (t) {
        null != t && (null != t.rlz && (this.score = t.rlz), null != t.pkp && (this.pkPoint = t.pkp), null != t.pkw && (this._pkWinNum = t.pkw), null != t.pkr && (this._pkPointRank = t.pkr));
      }, Object.defineProperty(e.prototype, "pkPointRank", { get: function get() {
          return this._pkPointRank;
        }, set: function set(t) {
          this._pkPointRank = t;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "pkWinNum", { get: function get() {
          return this._pkWinNum;
        }, set: function set(t) {
          this._pkWinNum = t;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "score", { get: function get() {
          return this._score.value;
        }, set: function set(t) {
          this._score.value != t && (this._score.value = t);
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "pkPoint", { get: function get() {
          return this._pkPoint.value;
        }, set: function set(t) {
          this._pkPoint.value != t && (this._pkPoint.value = t, u.default.saveOpenData());
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "rewardPkPoint", { get: function get() {
          return this._rewardPkPoint.value;
        }, set: function set(t) {
          this._rewardPkPoint.value != t && (this._rewardPkPoint.value = t);
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "currentScore", { get: function get() {
          return this._currentScore.value;
        }, set: function set(t) {
          this._currentScore.value != t && (this._currentScore.value = t);
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "reviveCount", { get: function get() {
          return this._reviveCount.value;
        }, set: function set(t) {
          this._reviveCount.value != t && (this._reviveCount.value = t);
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "rewardMoney", { get: function get() {
          return this._rewardMoney.value;
        }, set: function set(t) {
          this._rewardMoney.value != t && (this._rewardMoney.value = t);
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "isNewRecord", { get: function get() {
          return this._isNewRecord;
        }, set: function set(t) {
          this._isNewRecord = t;
        }, enumerable: !1, configurable: !0 }), e.prototype.set_otherPlayBy0205 = function (t) {
        this._otherPlay = null;for (var e = t.length, n = l.default.getUid(), o = 0; o < e; o++) {
          var i = t[o];if (n != i.uid) return void (this._otherPlay = i);
        }
      }, Object.defineProperty(e.prototype, "otherPlay", { get: function get() {
          return this._otherPlay;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "otherPKPoint", { get: function get() {
          return this._otherPKPoint;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "step", { get: function get() {
          return this._step.value;
        }, set: function set(t) {
          this._step.value != t && (this._step.value = t);
        }, enumerable: !1, configurable: !0 }), e.prototype.startGame = function () {
        this.currentScore = 0, this._isNewRecord = !1, this.reviveCount = 0, this.rewardMoney = 0, this.rewardPkPoint = 0, this._otherPKPoint = 0, this.step = 0;
      }, e.prototype.jumpNextStep = function (t, e) {
        void 0 === t && (t = !1), void 0 === e && (e = !1), this.currentScore += 10, t && (this.currentScore += 10), e && (this.currentScore += 10), s.default.callClazzFunc(c.default, "showData");
      }, e.prototype.buildScore = function () {
        this.currentScore > this.score && (this.isNewRecord = !0, this.score = this.currentScore);
      }, e;
    }(r.default);n.default = d, cc._RF.pop();
  }, { "../../Common/Core/NumValue": "NumValue", "../../Common/Core/NumValueBase64": "NumValueBase64", "../../Common/Info/AbsInfo": "AbsInfo", "../../Common/Manager/DataManager": "DataManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIManager": "UIManager", "../Fb/FbPanel": "FbPanel" }], FbLostPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "50e511KMnFK54Cy5meBVzIR", "FbLostPanel");var _o25,
        i = this && this.__extends || (_o25 = function o(t, e) {
      return (_o25 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o25(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/Core/GameType"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../Info/FbInfo"),
        l = t("./item/FbOverHeadInfo"),
        u = t("../../Common/Sdks/GameSDK"),
        f = t("./base/AbsFbOverPanel"),
        d = t("../../Common/Sdks/UmaTrackHelper"),
        h = cc._decorator,
        p = h.ccclass,
        _ = (h.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return a.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.txt_dec = s.default.getComponent(cc.Label, this.node, "frame/txt_dec"), this.txt_dec1 = s.default.getComponent(cc.Label, this.node, "frame/txt_dec1"), this.txt_cj1 = s.default.getComponent(cc.Label, this.node, "frame/txt_cj1"), this.txt_cj2 = s.default.getComponent(cc.Label, this.node, "frame/txt_cj2"), this.btn_gameEnd = s.default.getNode(this.node, "frame/btn_gameEnd"), this.btn_gamerePlay = s.default.getNode(this.node, "frame/btn_gamerePlay"), this.btn_gameEnd.on(cc.Node.EventType.TOUCH_END, this.onTouchGamerePlayHandler, this), this.btn_gamerePlay.on(cc.Node.EventType.TOUCH_END, this.onGetAwardByAd, this), this.btn_close = s.default.getNode(this.node, "frame/btn_close"), this.btn_close.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this);var t = s.default.getNode(this.node, "frame/left"),
            e = s.default.getNode(this.node, "frame/right");this.head_left = new l.default(t), this.head_right = new l.default(e), this.btn_rank = s.default.getNode(this.node, "frame/btn_rank"), this.btn_rank.on(cc.Node.EventType.TOUCH_END, this.onTouchRankHandler, this);
      }, e.prototype.onShow = function () {
        1 == this.data.t ? d.default.trackEvent("1325") : d.default.trackEvent("1318"), this.txt_dec.string = "" + c.default.ins.rewardMoney, this.txt_dec1.string = c.default.ins.rewardPkPoint.toString(), this.upAtlInfo(this.txt_cj1, this.txt_cj2);var t = this.data;this.head_left.setData(t.lscroe, u.default.getIcon()), this.head_right.setData(t.wscore, c.default.ins.otherPlay.icon), this.registerNetCmd();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.head_left.destroy(), this.head_right.destroy(), this.head_left = null, this.head_right = null;
      }, r([p], e);
    }(f.default));n.default = _, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Info/FbInfo": "FbInfo", "./base/AbsFbOverPanel": "AbsFbOverPanel", "./item/FbOverHeadInfo": "FbOverHeadInfo" }], FbOverHeadInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "ae45ek/t4NKuIuIaZEY1UGr", "FbOverHeadInfo");var _o26,
        i = this && this.__extends || (_o26 = function o(t, e) {
      return (_o26 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o26(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../../Common/UI/UIItem"),
        a = t("../../../Common/Util/ComponentUtil"),
        s = t("./FbHead"),
        c = function (t) {
      function e(e) {
        return t.call(this, e) || this;
      }return i(e, t), e.prototype.init = function () {
        t.prototype.init.call(this), this.mask = a.default.getNode(this.node, "mask"), this.head = new s.default(this.node), this.txt_value = a.default.getComponent(cc.Label, this.node, "txt_value");
      }, e.prototype.setData = function (t, e) {
        this.mask.active = !0, this.head.setIcon(e), this.txt_value.string = t.toString();
      }, e.prototype.destroy = function () {
        t.prototype.destroy.call(this), this.head.destroy(), this.head = null;
      }, e;
    }(r.default);n.default = c, cc._RF.pop();
  }, { "../../../Common/UI/UIItem": "UIItem", "../../../Common/Util/ComponentUtil": "ComponentUtil", "./FbHead": "FbHead" }], FbPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "4690cL4Kx1KI4QaZmcwUh5D", "FbPanel");var _o27,
        i = this && this.__extends || (_o27 = function o(t, e) {
      return (_o27 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o27(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Manager/LoadResManager"),
        u = t("../../Common/Core/GameType"),
        f = t("../Scene/GameScene"),
        d = t("../Info/SetInfo"),
        h = t("../Info/FbInfo"),
        p = t("./item/GameHeadInfo"),
        _ = t("../Net/GameClient"),
        m = t("../../Common/Manager/Logger"),
        g = t("../../Common/Sdks/GameSDK"),
        y = t("../Config/GameConfig"),
        b = t("../Info/ItemsInfo"),
        C = t("../Config/ProductConfig"),
        v = t("../../Common/Manager/TimeManager"),
        I = t("../../Common/Util/MathUtil"),
        M = cc._decorator,
        P = M.ccclass,
        S = (M.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return u.UILayerType.FuncLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_music = s.default.getComponent(cc.Button, this.node, "btn_music"), this.btn_music.node.on(cc.Node.EventType.TOUCH_END, this.onTouchMusicHandler, this), this.sp_music = s.default.getComponent(cc.Sprite, this.btn_music.node, "Background"), this.lb_score = s.default.getComponent(cc.Label, this.node, "tip_rlz/lb_score"), this.tip_rlz = s.default.getNode(this.node, "tip_rlz"), this.tip_pk = s.default.getNode(this.node, "tip_pk"), this._tips = s.default.getNode(this.node, "tips"), this._combo = s.default.getNode(this.node, "tips/combo"), this._imgGood = s.default.getNode(this._tips, "img_good"), this._imgPerfact = s.default.getNode(this._tips, "img_perfact"), this._imgBianshen = s.default.getNode(this._tips, "img_bianshen"), this._useItemTips = s.default.getComponent(cc.Label, this._tips, "use_item"), this._effBg = s.default.getComponent(cc.ParticleSystem3D, this._tips, "eff_bg"), this._effStar = s.default.getComponent(cc.ParticleSystem3D, this._tips, "eff_star"), this._lbContinue = s.default.getComponent(cc.Label, this._tips, "combo/lb_num"), this._imgGood.active = !1, this._imgPerfact.active = !1, this._imgBianshen.active = !1, this._tips.scale = 0, this._tipsTimer = 0, this.resetCombo(), this.notUse = s.default.getNode(this.node, "tip_pk/itemNode/notUse"), this.use = s.default.getNode(this.node, "tip_pk/itemNode/use"), this._itemProgress = s.default.getComponent(cc.Sprite, this.node, "tip_pk/itemNode/use/progress");var t = s.default.getNode(this.node, "tip_pk/head1"),
            e = s.default.getNode(this.node, "tip_pk/head2");this.head_left = new p.default(t), this.head_right = new p.default(e), this._state = s.default.getComponent(cc.Sprite, this.node, "tip_pk/state"), this._itemBtn = s.default.getComponent(cc.Button, this.node, "tip_pk/itemNode"), this._effItemL = s.default.getComponent(cc.Sprite, this.node, "tip_pk/effItemL"), this._effItemR = s.default.getComponent(cc.Sprite, this.node, "tip_pk/effItemR"), this._dieTips = s.default.getNode(this.node, "tip_pk/die_tips"), this._effFront = s.default.getNode(this.node, "tip_pk/effFront"), this.notUse.active = !(null != this._itemData), this._itemIcon = s.default.getComponent(cc.Sprite, this.node, "tip_pk/itemNode/use/icon"), this._itemTitle = s.default.getComponent(cc.Sprite, this.node, "tip_pk/itemNode/title"), this._itemBtn.node.on(cc.Node.EventType.TOUCH_END, this.onUserItemHandler, this), this._ready = s.default.getComponent(cc.Label, this.node, "tip_pk/ready"), this._ready.node.active = !1, this.rlz_bar1 = s.default.getComponent(cc.Sprite, this.node, "tip_pk/head1/jintutiao/bar1"), this.rlz_bar2 = s.default.getComponent(cc.Sprite, this.node, "tip_pk/head2/jintutiao copy/bar2");
      }, e.prototype.registerNetCmd = function () {
        _.default.ins.addPacketDataListener(518, this.on0206Handler, this), _.default.ins.addPacketDataListener(519, this.on0207Handler, this), _.default.ins.addPacketDataListener(521, this.on0209Handler, this);
      }, e.prototype.unRegisterNetCmd = function () {
        _.default.ins.removeAll(this);
      }, e.prototype.on0206Handler = function (t) {
        if (m.default.log("-------------onRoomHandler----------------"), m.default.log(t), !t.isError) {
          var e = t.body,
              n = e.uid,
              o = e.score;g.default.getUid() == n ? this.head_left.upTxtValue(o) : this.head_right.upTxtValue(o), v.default.remove(this.upEffect, this), v.default.add(this.upEffect, this, 200, 1);
        }
      }, e.prototype.upEffect = function () {
        this.head_left.score > this.head_right.score ? 1 != this._frontState && (l.default.loadSprite(this._state, "Atlas/atlas_pk/lingxian"), this._effFront.active = !0, this._effFront.x = this.head_left.x - 39, this._effFront.y = this.head_left.y, this._frontState = 1) : this.head_left.score < this.head_right.score ? 2 != this._frontState && (l.default.loadSprite(this._state, "Atlas/atlas_pk/luohou"), this._effFront.active = !0, this._effFront.x = this.head_right.x + 39, this._effFront.y = this.head_right.y, this._frontState = 2) : (this._state.spriteFrame = null, this._frontState = 0, this._effFront.active = !1);
      }, e.prototype.on0207Handler = function (t) {
        if (!t.isError) {
          var e,
              n,
              o,
              i = C.default.ins.getItem(t.body.itemId),
              r = t.body.uid;g.default.getUid() == r ? (e = cc.v2(this.head_left.x - 39, this.head_left.y), n = cc.v2(this.head_right.x + 39, this.head_right.y), o = this._effItemL, this.useItemTips("\u6254\u51FA" + i.name)) : (e = cc.v2(this.head_right.x + 39, this.head_right.y), n = cc.v2(this.head_left.x - 39, this.head_left.y), o = this._effItemR, this.useItemTips(i.name + "\u88AD\u6765")), l.default.loadSprite(o, "Atlas/atlas_item/" + i.icon), o.node.x = e.x, o.node.y = e.y, o.node.active = !0, cc.tween(o.node).bezierTo(.5, cc.v2(30, 80), cc.v2(30, 80), n).call(function (t) {
            t.active = !1;
          }.bind(this)).start();
        }
      }, e.prototype.on0209Handler = function (t) {
        if (!t.isError) {
          var e = t.body.uid;g.default.getUid() == e ? (this.head_left.setGray(!0), !this._playerDie && this.head_left.score > this.head_right.score && (this._dieTips.active = !0)) : (this._playerDie = !0, this.head_right.setGray(!0));
        }
      }, e.prototype.onShow = function () {
        this.resetCombo(), this.refresh(), this.registerNetCmd(), this.resetBar(), this.cancelPlayerDie();var t = this.data.isSport;this._effItemL.node.active = !1, this._effItemR.node.active = !1, this._effFront.active = !1, this._playerDie = !1, this._frontState = 0, this._canUseItem = !1, this._blStartGame = !1, t ? (s.default.setGray(this._itemBtn.node, !1), this._itemData = C.default.ins.getItem(b.default.ins.getAndUseItemForScene()), this._itemData && b.default.current_use_id > 0 && (this._itemData = C.default.ins.getItem(b.default.current_use_id)), this.tip_rlz.active = !1, this.tip_pk.active = !0, this.head_left.setData(g.default.getNickname(), g.default.getIcon()), this.head_right.setData(h.default.ins.otherPlay.name, h.default.ins.otherPlay.icon), this._ready.node.active = !0, this._dieTips.active = !1, this._state.spriteFrame = null, this._itemProgress.fillRange = 0, this._itemBtn.interactable = !0, this._itemBtn.enabled = !0, this.startReady()) : (this._itemData = null, this.tip_rlz.active = !0, this.tip_pk.active = !1, this._ready.node.active = !1, this._itemBtn.interactable = !1, this._itemBtn.enabled = !1), this.notUse.active = !(null != this._itemData), this.use.active = !this.notUse.active, this.notUse.active && s.default.setGray(this._itemBtn.node, !0), m.default.log(this._itemData, "\u9053\u5177\u6570\u636E"), this.head_left.setGray(!1), this.head_right.setGray(!1), this.refreshItemIcon();
      }, e.prototype.resetBar = function () {
        this.rlz_bar1.fillRange = 0, this.rlz_bar2.fillRange = 0;
      }, e.prototype.startReady = function () {
        this._countdown = 4, this.schedule(this.countdown, 1, 2), this.countdown(4);
      }, e.prototype.countdown = function () {
        this._countdown--, this._ready.node.scale = 0, this._countdown > 0 ? (this._ready.string = this._countdown + "", cc.tween(this._ready.node).to(.1, { scale: 1.5 }).start()) : 0 == this._countdown && (this._ready.string = this._countdown + "", cc.tween(this._ready.node).to(.1, { scale: 1 }).delay(.8).to(.1, { scale: 0 }).call(this.startGame.bind(this)).start());
      }, e.prototype.startGame = function () {
        this._blStartGame = !0, this._ready.node.active = !1, f.default.ins.startGame(), this.refreshItemIcon(), this.schedule(this.updateBar, .2, 300, 0);
      }, e.prototype.updateBar = function () {
        this.rlz_bar1.fillRange += 1 / 300, this.rlz_bar2.fillRange += 1 / 300;
      }, e.prototype.refreshItemIcon = function () {
        var t;cc.Tween.stopAllByTarget(this.use), this._itemBtn.node.scale = 1, this._itemData ? (this._itemIcon.node.active = !0, t = "Atlas/atlas_item/" + this._itemData.icon, this._canUseItem ? cc.tween(this.use).to(.2, { scale: 1.2 }).to(.2, { scale: .9 }).union().repeatForever().start() : t = "Atlas/atlas_item/" + this._itemData.icon + "_gray", this._blStartGame ? this._canUseItem ? l.default.loadSprite(this._itemTitle, "Atlas/atlas_pk/txt_ksy") : l.default.loadSprite(this._itemTitle, "Atlas/atlas_pk/txt_cnz") : l.default.loadSprite(this._itemTitle, "Atlas/atlas_pk/txt_dj"), l.default.loadSprite(this._itemIcon, t)) : (this._itemIcon.node.active = !1, l.default.loadSprite(this._itemTitle, "Atlas/atlas_pk/txt_dj"));
      }, e.prototype.onClose = function () {
        this.unRegisterNetCmd();
      }, e.prototype.cancelReady = function () {
        cc.Tween.stopAllByTarget(this._ready.node), this.unschedule(this.countdown), this.unschedule(this.updateBar), this._ready.node.active = !1;
      }, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_music.node.targetOff(this), this.head_left.destroy(), this.head_right.destroy(), this.head_left = null, this.head_right = null;
      }, e.prototype.refresh = function () {
        1 == d.default.ins.music ? (f.default.ins.musicVolume(1), l.default.loadSprite(this.sp_music, "Atlas/atlas_main/home_icon_music_on")) : (f.default.ins.musicVolume(0), l.default.loadSprite(this.sp_music, "Atlas/atlas_main/home_icon_music_off")), this.showData();
      }, e.prototype.onTouchMusicHandler = function () {
        c.default.playEffect(c.default.CLICK), 1 == d.default.ins.music ? (d.default.ins.music = 0, l.default.loadSprite(this.sp_music, "Atlas/atlas_main/home_icon_music_off"), f.default.ins.musicVolume(0)) : (d.default.ins.music = 1, l.default.loadSprite(this.sp_music, "Atlas/atlas_main/home_icon_music_on"), f.default.ins.musicVolume(1));
      }, e.prototype.showData = function () {
        this.lb_score.string = h.default.ins.currentScore.toString();
      }, e.prototype.update = function (t) {
        this._tipsTimer > 0 && (this._tipsTimer -= t, this._tipsTimer <= 0 && cc.tween(this._tips).to(.1, { scale: 0 }).start()), this._itemData && (y.default.Energy >= 50 ? this._canUseItem || (this._canUseItem = !0, this.refreshItemIcon()) : this._canUseItem && (this._canUseItem = !1, this.refreshItemIcon()), this._itemProgress.fillRange = I.default.clamp(y.default.Energy / 50, 0, 1));
      }, e.prototype.onUserItemHandler = function () {
        this._itemBtn.enabled && (c.default.playEffect(c.default.CLICK), this._itemData && y.default.Energy >= 50 && f.default.ins.useItem(this._itemData) && (y.default.Energy = 0));
      }, e.prototype.showComboTips = function () {
        this._continueNum++, this._tipsTimer <= 1 && (this._tipsTimer = 1, this._imgBianshen.active = !1, this._useItemTips.node.active = !1, this._tips.scale = 0, this._continueNum % 10 == 0 ? (this._combo.active = !1, this._continueNum / 10 < 2 ? (this._imgPerfact.active = !0, this._imgGood.active = !1) : (this._imgPerfact.active = !1, this._imgGood.active = !0), this._effBg.stop(), this._effBg.play(), this._effStar.stop(), this._effStar.play(), c.default.playEffect(c.default.PERFECT)) : (this._combo.active = !0, this._lbContinue.string = "x" + this._continueNum, this._imgPerfact.active = !1, this._imgGood.active = !1), this._tips.x = 220, cc.tween(this._tips).to(.1, { scale: 1 }).start());
      }, e.prototype.resetCombo = function () {
        this._continueNum = 0;
      }, e.prototype.playerDie = function () {
        this._tipsTimer = 3, this._imgBianshen.active = !0, this._combo.active = !1, this._imgPerfact.active = !1, this._imgGood.active = !1, this._useItemTips.node.active = !1, this._effBg.stop(), this._effBg.play(), this._effStar.stop(), this._effStar.play(), c.default.playEffect(c.default.PERFECT), this._tips.scale = 0, this._tips.x = 0, cc.tween(this._tips).to(.1, { scale: 1 }).start();
      }, e.prototype.useItemTips = function (t) {
        cc.Tween.stopAllByTarget(this._tips), this._tipsTimer = 2, this._imgBianshen.active = !1, this._combo.active = !1, this._imgPerfact.active = !1, this._imgGood.active = !1, this._useItemTips.node.active = !0, this._useItemTips.string = t, this._tips.scale = 0, this._tips.x = 0, cc.tween(this._tips).delay(.3).to(.1, { scale: 1 }).start();
      }, e.prototype.cancelPlayerDie = function () {
        cc.tween(this._tips).to(.1, { scale: 0 }).start();
      }, e.prototype.heroDie = function () {}, r([P], e);
    }(a.default));n.default = S, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../../Common/Util/MathUtil": "MathUtil", "../Config/GameConfig": "GameConfig", "../Config/ProductConfig": "ProductConfig", "../Info/FbInfo": "FbInfo", "../Info/ItemsInfo": "ItemsInfo", "../Info/SetInfo": "SetInfo", "../Net/GameClient": "GameClient", "../Scene/GameScene": "GameScene", "./item/GameHeadInfo": "GameHeadInfo" }], FbPkInvitePanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "c054b0GYAdIKZThJn5g5/TZ", "FbPkInvitePanel");var _o28,
        i = this && this.__extends || (_o28 = function o(t, e) {
      return (_o28 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o28(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Core/GameType"),
        l = t("../../Common/UI/UIManager"),
        u = t("../Net/GameClient"),
        f = t("../../Common/Manager/SysConfig"),
        d = t("../../Common/Manager/Logger"),
        h = t("../../Common/Manager/TimeManager"),
        p = t("./item/PKHeadInfo"),
        _ = t("../../Common/Sdks/GameSDK"),
        m = t("../Info/FbInfo"),
        g = t("../Scene/GameScene"),
        y = t("../../Common/Manager/MusicManager"),
        b = t("../Main/MainPanel"),
        C = t("../Main/SignPanel"),
        v = cc._decorator,
        I = v.ccclass,
        M = (v.property, function (t) {
      function e() {
        var e = null !== t && t.apply(this, arguments) || this;return e._countdown = 0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return c.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        d.default.log("---------FbPkInvitePanel---onStart---");var t = s.default.getNode(this.node, "frame/top/hinfo_left"),
            e = s.default.getNode(this.node, "frame/top/hinfo_right");this.head_left = new p.default(t), this.head_right = new p.default(e), this.btn_cancel = s.default.getNode(this.node, "frame/btn_cancel"), this.btn_cancel.on(cc.Node.EventType.TOUCH_END, this.onTouchCancelHandler, this), this.txt_dt = s.default.getComponent(cc.Label, this.node, "frame/txt_dt");
      }, e.prototype.registerNetCmd = function () {
        u.default.ins.addPacketDataListener(257, this.onLoginHandler, this), u.default.ins.addPacketDataListener(258, this.cmd0x0102Handler, this), u.default.ins.addPacketDataListener(516, this.onCancelHandler, this), u.default.ins.addPacketDataListener(517, this.onGameStartHandler, this);
      }, e.prototype.unRegisterNetCmd = function () {
        u.default.ins.removeAll(this);
      }, e.prototype.onTouchCancelHandler = function () {
        d.default.log("---------FbPkInvitePanel---onTouchCancelHandler---"), y.default.playEffect(y.default.CLICK), u.default.ins.connected ? u.default.ins.send(516, {}) : (u.default.ins.cancelReconnect(), this.onCancelHandler(null));
      }, e.prototype.onCancelHandler = function () {
        u.default.ins.close(), l.default.close(this), g.default.ins.closeGame(), l.default.show(b.default);
      }, e.prototype.onShow = function () {
        l.default.close(C.default), this.registerNetCmd(), this._roomId = _.default.getRoomId(), d.default.log("FbPkInvitePanel show roomId:", this._roomId), this.refresh(), this.head_left.onShow(), this.head_right.onShow(), this.head_left.setData(_.default.getNickname(), m.default.ins.pkWinNum, _.default.getIcon(), m.default.ins.pkPointRank), this.schedule(this.countdown, 1, 9999), this._countdown = 0, this.countdown(), this.btn_cancel.active = !1;
      }, e.prototype.countdown = function () {
        d.default.log("---------------countdown " + this._countdown), this._countdown++, this.txt_dt.string = "\u7B49\u5F85\u65F6\u95F4\uFF1A" + this._countdown + "\u79D2", this.btn_cancel.active || 10 != this._countdown || (this.btn_cancel.active = !0);
      }, e.prototype.onClose = function () {
        this.unscheduleAllCallbacks(), this.unRegisterNetCmd(), this._roomId = null, this._body = null, _.default.clearRoomId(), h.default.removeTarget(this);
      }, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this);
      }, e.prototype.refresh = function () {
        u.default.ins.connected ? (u.default.ins.close(), h.default.add(function () {
          u.default.ins.connect(f.default.SOCKET_HOST);
        }, this, 500, 1)) : u.default.ins.connect(f.default.SOCKET_HOST);
      }, e.prototype.cmd0x0102Handler = function (t) {
        l.default.close(this), _.default.showToast(t.body.m);
      }, e.prototype.onLoginHandler = function () {
        u.default.ins.send(515, { rid: this._roomId });
      }, e.prototype.onGameStartHandler = function (t) {
        t.isError || (this._body = t.body, m.default.ins.set_otherPlayBy0205(this._body.l), this.setOtherHeadInfo(), this.ready());
      }, e.prototype.ready = function () {
        g.default.ins.startSport(this._body), l.default.close(this);
      }, e.prototype.setOtherHeadInfo = function () {
        var t = m.default.ins.otherPlay;this.head_right.setData(t.name, t.pkw, t.icon, t.pkr);
      }, r([I], e);
    }(a.default));n.default = M, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Manager/SysConfig": "SysConfig", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Info/FbInfo": "FbInfo", "../Main/MainPanel": "MainPanel", "../Main/SignPanel": "SignPanel", "../Net/GameClient": "GameClient", "../Scene/GameScene": "GameScene", "./item/PKHeadInfo": "PKHeadInfo" }], FbPkMatchPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "65710nRhM5GbqAKTDWVpagd", "FbPkMatchPanel");var _o29,
        i = this && this.__extends || (_o29 = function o(t, e) {
      return (_o29 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o29(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Net/GameClient"),
        d = t("../../Common/Manager/SysConfig"),
        h = t("../../Common/Manager/Logger"),
        p = t("../../Common/Manager/TimeManager"),
        _ = t("../Scene/GameScene"),
        m = t("../../Common/Util/MTween"),
        g = t("./item/PKHeadInfo"),
        y = t("../../Common/Sdks/GameSDK"),
        b = t("../Info/FbInfo"),
        C = t("../Main/MainPanel"),
        v = t("./FbPanel"),
        I = t("../../Common/Sdks/UmaTrackHelper"),
        M = t("../Main/SignPanel"),
        P = t("../../Common/Manager/GlobalEventManager"),
        S = cc._decorator,
        T = S.ccclass,
        U = (S.property, function (t) {
      function e() {
        var e = null !== t && t.apply(this, arguments) || this;return e.stateTweem = null, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_cancel = s.default.getComponent(cc.Button, this.node, "frame/state1/btn_cancel"), this.btn_cancel.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCancelHandler, this), this.btn_cancel.node.active = !1, this.state1 = s.default.getNode(this.node, "frame/state1"), this.state2 = s.default.getNode(this.node, "frame/state2"), this.state2_ct = s.default.getNode(this.state2, "ct"), this.stateTweem = new m.default();var t = s.default.getNode(this.node, "frame/top/hinfo_left"),
            e = s.default.getNode(this.node, "frame/top/hinfo_right");this.timer = s.default.getComponent(cc.Label, this.node, "frame/timer"), this.head_left = new g.default(t), this.head_right = new g.default(e);
      }, e.prototype.registerNetCmd = function () {
        f.default.ins.addPacketDataListener(257, this.onLoginHandler, this), f.default.ins.addPacketDataListener(258, this.cmd0x0102Handler, this), f.default.ins.addPacketDataListener(513, this.onRoomHandler, this), f.default.ins.addPacketDataListener(516, this.onCancelHandler, this), f.default.ins.addPacketDataListener(517, this.onGameStartHandler, this);
      }, e.prototype.unRegisterNetCmd = function () {
        f.default.ins.removeAll(this);
      }, e.prototype.onShow = function () {
        u.default.close(M.default), this.registerNetCmd(), this.state1.active = !0, this.state2.active = !1, this.head_left.onShow(), this.head_right.onShow(), this.head_left.setData(y.default.getNickname(), b.default.ins.pkWinNum, y.default.getIcon(), b.default.ins.pkPointRank), u.default.close(v.default), this.refresh(), this.timer_count = 0, this.timer.string = "\u7B49\u5F85\u65F6\u95F4\uFF1A" + this.timer_count + "\u79D2", this.schedule(this.addTime, 1, cc.macro.REPEAT_FOREVER, 0);
      }, e.prototype.addTime = function () {
        this.timer_count += 1, this.timer.string = "\u7B49\u5F85\u65F6\u95F4\uFF1A" + this.timer_count + "\u79D2";
      }, e.prototype.onClose = function () {
        this.unRegisterNetCmd(), this._roomId = null, this._body = null, this.unschedule(this.addTime), P.default.off(l.GameEvent.Hide, this.onHideHandler, this);
      }, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_cancel.node.targetOff(this);
      }, e.prototype.refresh = function () {
        f.default.ins.connect(d.default.SOCKET_HOST);
      }, e.prototype.onTouchCancelHandler = function () {
        c.default.playEffect(c.default.CLICK), I.default.trackEvent("1322"), f.default.ins.connected ? f.default.ins.send(516, {}) : (f.default.ins.cancelReconnect(), this.onCancelHandler(null));
      }, e.prototype.cmd0x0102Handler = function () {
        u.default.close(this);
      }, e.prototype.onLoginHandler = function () {
        f.default.ins.send(513, {});
      }, e.prototype.onRoomHandler = function (t) {
        h.default.log("-------------onRoomHandler----------------"), h.default.log(t), this._roomId = t.body.rid, this.btn_cancel.node.active = !0, h.default.log(this._roomId);
      }, e.prototype.onCancelHandler = function () {
        f.default.ins.close(), u.default.close(this), _.default.ins.closeGame(), u.default.show(C.default);
      }, e.prototype.onGameStartHandler = function (t) {
        t.isError || (this._body = t.body, b.default.ins.set_otherPlayBy0205(this._body.l), this.state1.active = !1, this.state2.active = !0, this.timer.string = "", this.setOtherHeadInfo(), this.state2_ct.scaleX = .001, this.state2_ct.scaleY = .001, this.stateTweem.to(this.state2_ct, { scaleX: 1, scaleY: 1 }, 100, m.MEase.linearInOut, this, this._stateTweemComplete), p.default.add(this.toState3Hd, this, 700, 1), P.default.on(l.GameEvent.Hide, this.onHideHandler, this));
      }, e.prototype.onHideHandler = function () {
        p.default.remove(this.toState3Hd, this), this.stateTweem.stop(), this._body ? (f.default.ins.addPacketDataListener(521, this.cmd0x0209Handler, this), f.default.ins.send(521, { rid: this._body.rid })) : (u.default.close(this), u.default.show(C.default));
      }, e.prototype.cmd0x0209Handler = function () {
        f.default.ins.removePacketDataListener(521, this.cmd0x0209Handler, this), f.default.ins.close(), u.default.close(this), u.default.show(C.default);
      }, e.prototype.setOtherHeadInfo = function () {
        var t = b.default.ins.otherPlay;null == t && (t = { name: "", pkw: 0, icon: "", pkr: 0 }), this.head_right.setData(t.name, t.pkw, t.icon, t.pkr);
      }, e.prototype.update = function () {
        this.stateTweem && this.stateTweem.update();
      }, e.prototype._stateTweemComplete = function () {
        p.default.add(this.toState3Hd, this, 500, 1);
      }, e.prototype.toState3Hd = function () {
        this.state2.active && (this.state1.active = !1, this.state2.active = !1, _.default.ins.startSport(this._body), u.default.close(this));
      }, r([T], e);
    }(a.default));n.default = U, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/GlobalEventManager": "GlobalEventManager", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Manager/SysConfig": "SysConfig", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../../Common/Util/MTween": "MTween", "../Info/FbInfo": "FbInfo", "../Main/MainPanel": "MainPanel", "../Main/SignPanel": "SignPanel", "../Net/GameClient": "GameClient", "../Scene/GameScene": "GameScene", "./FbPanel": "FbPanel", "./item/PKHeadInfo": "PKHeadInfo" }], FbRewardPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "72cd92/6V1PBJpmSVMk1SFK", "FbRewardPanel");var _o30,
        i = this && this.__extends || (_o30 = function o(t, e) {
      return (_o30 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o30(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Manager/MusicManager"),
        c = t("../../Common/Core/GameType"),
        l = t("../Manager/GameManager"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Sdks/GameSDK"),
        d = t("../../Common/Sdks/UmaTrackHelper"),
        h = t("../Scene/GameScene"),
        p = t("../Info/FbInfo"),
        _ = t("../../Common/Util/ComponentUtil"),
        m = t("../../Common/Manager/Logger"),
        g = t("../Main/MainPanel"),
        y = t("../Main/item/FbHead"),
        b = t("../Config/RlzConfig"),
        C = t("../Lottery/LotteryPanel"),
        v = t("./FbPanel"),
        I = t("../Main/RankPanel"),
        M = cc._decorator,
        P = M.ccclass,
        S = (M.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return c.UILayerType.FbEndLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.head0 = _.default.getNode(this.node, "frame/head0"), this.head1 = _.default.getNode(this.node, "frame/head1"), this.txt_uppc = _.default.getComponent(cc.Label, this.node, "frame/txt_uppc"), this.txt_rl_value = _.default.getComponent(cc.Label, this.node, "frame/txt_rl_value"), this.txt_award = _.default.getComponent(cc.Label, this.node, "frame/txt_award"), this.btn_do = _.default.getNode(this.node, "frame/btn_do"), this.btn_ad = _.default.getNode(this.node, "frame/btn_ad"), this.btn_close = _.default.getNode(this.node, "frame/btn_close"), this.btn_do.on(cc.Node.EventType.TOUCH_END, this.onTouchDoHandler, this), this.btn_ad.on(cc.Node.EventType.TOUCH_END, this.onTouchAdHandler, this), this.btn_close.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.headCtr0 = new y.default(this.head0, !0), this.headCtr1 = new y.default(this.head1, !0);var t = f.default.getIcon(),
            e = f.default.getNickname();this.headCtr0.setIcon(t), this.headCtr1.setIcon(t), this.headCtr1.setTxtValue(e), this.btn_rank = _.default.getNode(this.node, "frame/btn_rank"), this.btn_rank.on(cc.Node.EventType.TOUCH_END, this.onTouchRankHandler, this);
      }, e.prototype.onTouchRankHandler = function () {
        s.default.playEffect(s.default.CLICK), u.default.show(I.default);
      }, e.prototype.onTouchDoHandler = function () {
        s.default.playEffect(s.default.CLICK), m.default.log("-------onTouchDoHandler-----------"), u.default.close(this), h.default.ins.closeGame(), u.default.show(g.default), d.default.trackEvent("1314"), u.default.show(C.default);
      }, e.prototype.onTouchAdHandler = function () {
        s.default.playEffect(s.default.CLICK), m.default.log("-------onTouchAdHandler-----------"), d.default.reviveClick(p.default.ins.reviveCount), p.default.ins.reviveCount >= 2 ? f.default.share(this.reviveCall, this) : f.default.showVideoAd(this.reviveCall, this, c.VideoAdType.Single);
      }, e.prototype.reviveCall = function () {
        f.default.hideBannerAd(), l.default.fbSingleVideoEnd(), u.default.close(this), h.default.ins.closeGame(), u.default.show(g.default), d.default.trackEvent("1313");
      }, e.prototype.onTouchCloseHandler = function () {
        f.default.hideBannerAd(), u.default.close(this), h.default.ins.closeGame(), u.default.show(g.default);
      }, e.prototype.onShow = function () {
        this.refresh(), l.default.fbSingleEnd(this.txt_award), d.default.reviveShow(p.default.ins.reviveCount), f.default.sdkId == c.SdkType.QQ && 0 == l.default.scribeAppMsg && (f.default.sdk.subscribeAppMsg(), l.default.scribeAppMsg = 1), f.default.showBannerAd();var t = p.default.ins.currentScore.toString(),
            e = b.default.ins.getPerByRlz(p.default.ins.currentScore);this.headCtr0.setTxtValue(t), this.txt_rl_value.string = t, this.txt_uppc.string = e + "%", m.default.log("-------------------lb_score " + t);
      }, e.prototype.onClose = function () {
        u.default.close(v.default);
      }, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.headCtr0.destroy(), this.headCtr1.destroy(), this.headCtr0 = null, this.headCtr1 = null;
      }, e.prototype.refresh = function () {}, r([P], e);
    }(a.default));n.default = S, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/RlzConfig": "RlzConfig", "../Info/FbInfo": "FbInfo", "../Lottery/LotteryPanel": "LotteryPanel", "../Main/MainPanel": "MainPanel", "../Main/RankPanel": "RankPanel", "../Main/item/FbHead": "FbHead", "../Manager/GameManager": "GameManager", "../Scene/GameScene": "GameScene", "./FbPanel": "FbPanel" }], FbWinPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "1d05b6eB2tM6Y1ublp6lGly", "FbWinPanel");var _o31,
        i = this && this.__extends || (_o31 = function o(t, e) {
      return (_o31 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o31(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/Core/GameType"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../Info/FbInfo"),
        l = t("./item/FbOverHeadInfo"),
        u = t("../../Common/Sdks/GameSDK"),
        f = t("./base/AbsFbOverPanel"),
        d = t("../../Common/Sdks/UmaTrackHelper"),
        h = cc._decorator,
        p = h.ccclass,
        _ = (h.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return a.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.txt_dec = s.default.getComponent(cc.Label, this.node, "frame/txt_dec"), this.txt_dec1 = s.default.getComponent(cc.Label, this.node, "frame/txt_dec1"), this.txt_cj1 = s.default.getComponent(cc.Label, this.node, "frame/txt_cj1"), this.txt_cj2 = s.default.getComponent(cc.Label, this.node, "frame/txt_cj2"), this.btn_gameEnd = s.default.getNode(this.node, "frame/btn_gameEnd"), this.btn_gamerePlay = s.default.getNode(this.node, "frame/btn_gamerePlay"), this.btn_gameEnd.on(cc.Node.EventType.TOUCH_END, this.onTouchGamerePlayHandler, this), this.btn_gamerePlay.on(cc.Node.EventType.TOUCH_END, this.onGetAwardByAd, this), this.btn_close = s.default.getNode(this.node, "frame/btn_close"), this.btn_close.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this);var t = s.default.getNode(this.node, "frame/left"),
            e = s.default.getNode(this.node, "frame/right");this.head_left = new l.default(t), this.head_right = new l.default(e), this.btn_rank = s.default.getNode(this.node, "frame/btn_rank"), this.btn_rank.on(cc.Node.EventType.TOUCH_END, this.onTouchRankHandler, this);
      }, e.prototype.onShow = function () {
        1 == this.data.t ? d.default.trackEvent("1325") : d.default.trackEvent("1318"), this.txt_dec.string = c.default.ins.rewardMoney + "", c.default.ins.rewardPkPoint > 0 ? this.txt_dec1.string = "+ " + c.default.ins.rewardPkPoint.toString() : this.txt_dec1.string = c.default.ins.rewardPkPoint.toString(), this.upAtlInfo(this.txt_cj1, this.txt_cj2);var t = this.data;this.head_left.setData(t.wscore, u.default.getIcon()), this.head_right.setData(t.lscroe, c.default.ins.otherPlay.icon), this.registerNetCmd();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.head_left.destroy(), this.head_right.destroy(), this.head_left = null, this.head_right = null;
      }, r([p], e);
    }(f.default));n.default = _, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Info/FbInfo": "FbInfo", "./base/AbsFbOverPanel": "AbsFbOverPanel", "./item/FbOverHeadInfo": "FbOverHeadInfo" }], FeedbackPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "7ccc5oJVjlCfpYKiWev6vkr", "FeedbackPanel");var _o32,
        i = this && this.__extends || (_o32 = function o(t, e) {
      return (_o32 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o32(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Sdks/GameSDK"),
        d = cc._decorator,
        h = d.ccclass,
        p = (d.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.icon_head = s.default.getComponent(cc.Sprite, this.node, "frame/sp_head/mask/icon_head"), this.lb_uid = s.default.getComponent(cc.Label, this.node, "frame/lb_uid");
      }, e.prototype.onShow = function () {
        this.lb_uid.string = f.default.getUid();var t = f.default.getIcon();if (null != t) {
          var e = this;cc.assetManager.loadRemote(t, { ext: ".png" }, function (t, n) {
            var o = new cc.SpriteFrame(n);e.icon_head.spriteFrame = o;
          });
        }
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this);
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, r([h], e);
    }(a.default));n.default = p, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil" }], FightUtil: [function (t, e) {
    "use strict";
    cc._RF.push(e, "fffeawFx/9PBb6IfEAtKm4J", "FightUtil"), cc._RF.pop();
  }, {}], GameClient: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "232c9R3Q8pEKLhasizstuHJ", "GameClient");var _o33,
        i = this && this.__extends || (_o33 = function o(t, e) {
      return (_o33 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o33(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Util/StringUtil"),
        a = t("./Buffer/TcpBuffer"),
        s = t("../../Common/Core/ByteArray"),
        c = t("./PacketDataEvent"),
        l = t("../../Common/Manager/Logger"),
        u = t("../../Common/Sdks/GameSDK"),
        f = t("../../Common/Manager/SysConfig"),
        d = t("../../Common/Core/GameType"),
        h = t("../../Common/Manager/TimeManager"),
        p = t("../../Common/Util/MD5"),
        _ = t("../Info/FbInfo"),
        m = t("../../Common/Manager/GlobalEventManager"),
        g = function (t) {
      function e() {
        var e = t.call(this) || this;return e._stamp = Math.floor(1e3 * Math.random()), e;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "connected", { get: function get() {
          return this._connected;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "connecting", { get: function get() {
          return this._connecting;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "host", { get: function get() {
          return this._host;
        }, enumerable: !1, configurable: !0 }), e.prototype.connect = function (t) {
        this._connecting || (this._host = t, this.disposeSocket(), this._socket = this.createSocket(this._host), this._isReconnect = !0, this._connected = !1, this._connecting = !0, this._tickCount = 0);
      }, e.prototype.reconnect = function () {
        this._host && (this.disposeSocket(), this._socket = this.createSocket(this._host), this._connected = !1, this._connecting = !0, this._tickCount = 0);
      }, e.prototype.close = function () {
        this._socket && this._connected ? this.send(260) : this._close();
      }, e.prototype._close = function () {
        this._isReconnect = !1, this._socket && (this.disposeSocket(), this._connected = !1, this._connecting = !1);
      }, e.prototype.createSocket = function (t) {
        var e = new WebSocket(t);return e.binaryType = "arraybuffer", e.onopen = this.onSocketOpen.bind(this), e.onerror = this.onSocketError.bind(this), e.onclose = this.onSocketClose.bind(this), e.onmessage = this.onReceiveMessage.bind(this), e;
      }, e.prototype.tick = function () {
        this._connected && this._isReconnect && (this._tickCount < 2 ? (this._tickCount++, this.send(e.TICKCMD)) : this.disposeSocket());
      }, e.prototype.cancelReconnect = function () {
        this._isReconnect && (this._isReconnect = !1, h.default.remove(this.tick, this));
      }, e.prototype.disposeSocket = function () {
        null != this._socket && ((this._connected || this._connecting) && this._socket.close(), this._socket = null);
      }, e.prototype.onReceiveMessage = function (t) {
        var n = new s.default(t.data);if (n.length > 0) {
          var o = a.default.test04(n),
              i = new c.default(o.cmd, o.stamp, o.body);this.log(1, o.cmd, o.stamp, o.body), this.dispatchEvent(i), o.cmd == e.TICKCMD && (this._tickCount = 0), 258 == o.cmd && this._close();
        }
      }, e.prototype.testServerClose = function () {
        var t = new c.default(260, 0, {});this.dispatchEvent(t);
      }, e.prototype.onSocketError = function () {
        l.default.log(">>> onSocketError"), m.default.dispatchEvent(d.SocketEvent.error);
      }, e.prototype.onSocketOpen = function () {
        this._connected = !0, this._connecting = !1, l.default.log(">>> onSocketOpen"), l.default.log(">>> host:", this._host), this.dispatchEvent(new cc.Event(d.SocketEvent.open, !1)), h.default.add(this.tick, this, e.TICKTIME), h.default.add(this.login, this, 100, 1);
      }, e.prototype.onSocketClose = function () {
        this.disposeSocket(), this._connected = !1, this._connecting = !1, l.default.log(">>> onSocketClose"), h.default.removeTarget(this), this._isReconnect ? this.reconnect() : m.default.dispatchEvent(d.SocketEvent.close);
      }, e.prototype.send = function (t, e) {
        if (void 0 === e && (e = null), this._connected && this._socket) {
          var n = this._stamp++,
              o = null != e ? e : {},
              i = a.default.test03(t, n, o);return this._socket.send(i.buffer), this.log(0, t, n, o), n;
        }return -1;
      }, e.prototype.addPacketDataListener = function (t, e, n) {
        this.on(this.formatCmdName(t), e, n);
      }, e.prototype.removePacketDataListener = function (t, e, n) {
        this.off(this.formatCmdName(t), e, n);
      }, e.prototype.formatCmdName = function (t) {
        return "cmd:0x" + r.default.toString(t, 16, 4).toUpperCase();
      }, e.prototype.log = function (t, n, o, i) {
        if (n != e.TICKCMD && f.default.DEBUG) {
          var r = this.getCurTime();switch (t) {case 0:
              r += " >>>\u524D\u7AEF\uFF1A";break;case 1:
              r += " <<<\u540E\u53F0\uFF1A";break;default:
              return;}r += this.formatCmdName(n) + " stamp:" + o + " body:" + JSON.stringify(null != i ? i : {}), l.default.log(r);
        }
      }, e.prototype.getCurTime = function () {
        var t = new Date();return r.default.toString(t.getHours(), 10, 2) + ":" + r.default.toString(t.getMinutes(), 10, 2) + ":" + r.default.toString(t.getSeconds(), 10, 2) + "." + r.default.toString(t.getMilliseconds(), 10, 3);
      }, e.prototype.login = function () {
        var t = {};t.uid = u.default.getUid(), t.name = u.default.getNickname(), t.icon = u.default.getIcon(), t.vip = u.default.getVip(), t.pkw = _.default.ins.pkWinNum, t.pkr = _.default.ins.pkPointRank, t.sign = p.default.hex_md5(t.uid + f.default.CLIENT_KEY), this.send(257, t);
      }, e.TICKTIME = 5e3, e.TICKCMD = 259, e.CLOSECMD = 259, e;
    }(cc.EventTarget);n.default = g, cc._RF.pop();
  }, { "../../Common/Core/ByteArray": "ByteArray", "../../Common/Core/GameType": "GameType", "../../Common/Manager/GlobalEventManager": "GlobalEventManager", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/SysConfig": "SysConfig", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Util/MD5": "MD5", "../../Common/Util/StringUtil": "StringUtil", "../Info/FbInfo": "FbInfo", "./Buffer/TcpBuffer": "TcpBuffer", "./PacketDataEvent": "PacketDataEvent" }], GameConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "cef1f21Nf9HFZjKiA5WXNfB", "GameConfig"), Object.defineProperty(n, "__esModule", { value: !0 }), n.StageItemType = n.DashEvent = void 0;var o = t("../../Common/Util/MathUtil"),
        i = t("../Manager/GameManager");(n.DashEvent || (n.DashEvent = {})).EVENT_CLOSE = "EVENT_DASH_CLOSE", function (t) {
      t[t.Normal = 0] = "Normal", t[t.Gold = 1] = "Gold", t[t.JiaoZi = 2] = "JiaoZi", t[t.Obstacle = 3] = "Obstacle";
    }(n.StageItemType || (n.StageItemType = {}));var r = function () {
      function t() {}return t.updateDashStep = function (e, n) {
        var r = Math.abs(Math.cos(n + e)),
            a = o.default.clamp(t.DIFFICULTY_MIN + e * i.default.difficulty, t.DIFFICULTY_MIN, t.DIFFICULTY_MAX),
            s = a / t.DIFFICULTY_MAX,
            c = 0;o.default.randomInt(t.DIFFICULTY_MIN, t.DIFFICULTY_MAX) < a && (c = 1 + 1.5 * s), t.CurStageOffset = t.StageOffset + c;var l = !1,
            u = n > 0 ? 200 : 60,
            f = n > 0 ? 10 : o.default.randomInt(1, 4);e > u ? e % f == 0 && (l = !0) : e > 30 && e <= u && e % (2 * f) == 0 && (l = !0), l ? (t.CurStageSpeed = .04 + .03 * s, t.CurStageRadius = 3 + 1 * s) : (t.CurStageSpeed = 0, t.CurStageRadius = 0);var d = .8;t.DIFFICULTY_MAX * r < a && (d = .6 + .2 * (1 - s)), t.CurStageSize = d, t.CurStageOffset = .001;
      }, t.resetDashStep = function (e) {
        void 0 === e && (e = 0), t.CurHeroSpeed = t.HeroSpeed + e, t.Energy = 0, t.CurStageOffset = t.StageOffset, t.CurStageSpeed = 0, t.CurStageRadius = 0, t.CurStageSize = .8;
      }, t.SAFETY = !0, t.HeroSpeed = 20, t.Gravity = .049, t.StageOffset = 2, t.StageSpeed = .05, t.StartsafeTime = 1, t.StageStartOffset = 1, t.ShowStageNum = 6, t.ReviveSafeTime = 2, t.MovingDiameter1 = 12, t.MovingDelicacy1 = 1.8, t.MovingDiameter = 16, t.MovingDelicacy = 1.8, t.DIFFICULTY_MIN = 1, t.DIFFICULTY_MAX = 1e3, t.StageLayouts = [[-1], [0], [1], [0], [-1, 1], [-1, 0, 1]], t.ObstacleLayouts = [[1, 0], [0, 1], [1, 1, 0], [0, 1, 1], []], t;
    }();n.default = r, cc._RF.pop();
  }, { "../../Common/Util/MathUtil": "MathUtil", "../Manager/GameManager": "GameManager" }], GameHeadInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "e79399S04hF0YZi9zQSkggK", "GameHeadInfo");var _o34,
        i = this && this.__extends || (_o34 = function o(t, e) {
      return (_o34 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o34(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../../Common/UI/UIItem"),
        a = t("../../../Common/Util/ComponentUtil"),
        s = t("../../Main/item/FbHead"),
        c = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.init = function () {
        this.head = new s.default(this.node), this.txt_value = a.default.getComponent(cc.Label, this.node, "txt_value");
      }, e.prototype.onShow = function () {}, e.prototype.setData = function (t, e) {
        this.head.setIcon(e), this.txt_value.string = "0", this._score = 0;
      }, e.prototype.upTxtValue = function (t) {
        this.txt_value.string = t.toString(), this._score = t;
      }, Object.defineProperty(e.prototype, "score", { get: function get() {
          return this._score;
        }, enumerable: !1, configurable: !0 }), e.prototype.destroy = function () {
        t.prototype.destroy.call(this), this.head.destroy(), this.head = null;
      }, e.prototype.setGray = function (t) {
        this.head && this.head.setGray(t);
      }, e;
    }(r.default);n.default = c, cc._RF.pop();
  }, { "../../../Common/UI/UIItem": "UIItem", "../../../Common/Util/ComponentUtil": "ComponentUtil", "../../Main/item/FbHead": "FbHead" }], GameInitManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "e6bb0dqiqRAgLY9UXU/iLiL", "GameInitManager"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./GlobalEventManager"),
        i = t("../Core/GameType"),
        r = t("./TimeManager"),
        a = t("../Sdks/GameSDK"),
        s = t("../UI/UIManager"),
        c = t("../../Game/Main/LoadingPanel"),
        l = t("./LoadResManager"),
        u = t("../../Game/Main/MainPanel"),
        f = t("./DataManager"),
        d = function () {
      function t() {}return t.init = function () {
        window.onbeforeunload = function () {
          f.default.logout();
        }, o.default.on(i.InitStepEvent.NET_ERROR, t.onNetErrorHandler, t), o.default.on(i.InitStepEvent.INIT_SDK_FINISH, t.onInitSdkFinishHandler, t), o.default.on(i.InitStepEvent.LOGIN_FINISH, t.onLoginFinishHandler, t), o.default.on(i.InitStepEvent.LOAD_RES_FINISH, t.onLoadResFinishHandler, t), r.default.start(), a.default.init();
      }, t.onNetErrorHandler = function () {}, t.onInitSdkFinishHandler = function () {
        a.default.login();
      }, t.onLoginFinishHandler = function () {
        l.default.start();
      }, t.onLoadResFinishHandler = function () {
        t.enterMainPanel();
      }, t.enterMainPanel = function () {
        s.default.remove(c.default), s.default.show(u.default), o.default.targetOff(t);
      }, t;
    }();n.default = d, cc._RF.pop();
  }, { "../../Game/Main/LoadingPanel": "LoadingPanel", "../../Game/Main/MainPanel": "MainPanel", "../Core/GameType": "GameType", "../Sdks/GameSDK": "GameSDK", "../UI/UIManager": "UIManager", "./DataManager": "DataManager", "./GlobalEventManager": "GlobalEventManager", "./LoadResManager": "LoadResManager", "./TimeManager": "TimeManager" }], GameManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "416c6xUq3JFsbynOy2A5Bgl", "GameManager"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./CommandController"),
        i = t("../Info/AddrInfo"),
        r = t("../Info/SetInfo"),
        a = t("../../Common/Manager/DataManager"),
        s = t("../Info/PlayerInfo"),
        c = t("../Info/FbInfo"),
        l = t("../../Common/UI/UIManager"),
        u = t("../Info/SignInfo"),
        f = t("../Info/ItemsInfo"),
        d = t("../Main/MainPanel"),
        h = function () {
      function t() {}return t.load = function (t) {
        this.sign8 = t.sign8, s.default.ins.init(t), i.default.ins.init(t), r.default.ins.init(t), c.default.ins.init(t), u.default.ins.init(t), f.default.ins.init(t), null != t && null != t.diff && (this._difficulty = t.diff), null == this.sign8 && (this.sign8 = 0), a.default.saveOpenData();
      }, t.save = function (t) {
        i.default.ins.saveData(t), r.default.ins.saveData(t);
      }, t.onNewDayHandler = function () {
        s.default.ins.onNewDayHandler();
      }, Object.defineProperty(t, "difficulty", { get: function get() {
          return this._difficulty;
        }, enumerable: !1, configurable: !0 }), t.startGame = function () {
        c.default.ins.startGame();
      }, t.jumpNextStep = function (t, e) {
        void 0 === t && (t = !1), void 0 === e && (e = !1), c.default.ins.jumpNextStep(t, e);
      }, t.buildScore = function () {
        c.default.ins.buildScore(), c.default.ins.isNewRecord && (a.default.save(), a.default.saveOpenData());
      }, t.fbSingleEnd = function (e) {
        o.default.fbSingle(function (t) {
          c.default.ins.score = t.score, c.default.ins.rewardMoney = t.amoney, s.default.ins.money = t.money, e.string = "\u672C\u5C40\u91D1\u5E01\uFF1A" + t.amoney;
        }, t);
      }, t.fbSingleVideoEnd = function () {
        o.default.fbSingleVideo(function (t) {
          c.default.ins.score = t.score, c.default.ins.rewardMoney = t.amoney, s.default.ins.money = t.money;
        }, t);
      }, t.fbPkEnd = function (e, n, i) {
        o.default.fbPk(e, function (t) {
          c.default.ins.pkPoint = t.pkp, c.default.ins.pkWinNum = t.pkw, c.default.ins.rewardPkPoint = t.apkp, c.default.ins.rewardMoney = t.amoney, c.default.ins.pkPointRank = t.pkr, s.default.ins.money = t.money, s.default.ins.acl = t.acl, l.default.show(n, i);
        }, t, function () {
          l.default.show(d.default);
        });
      }, t.fbPkVideoEnd = function (e) {
        o.default.fbPkVideo(e, function (t) {
          c.default.ins.pkPoint = t.pkp, c.default.ins.pkWinNum = t.pkw, c.default.ins.rewardPkPoint = t.apkp, c.default.ins.rewardMoney = t.amoney, c.default.ins.pkPointRank = t.pkr, s.default.ins.money = t.money, s.default.ins.acl = null;
        }, t);
      }, t.MAX_GIFT_COUPON = 50, t.MAX_REVIVE_COUNT = 3, t._difficulty = 1, t.scribeAppMsg = 0, t.sign8 = 0, t;
    }();n.default = h, cc._RF.pop();
  }, { "../../Common/Manager/DataManager": "DataManager", "../../Common/UI/UIManager": "UIManager", "../Info/AddrInfo": "AddrInfo", "../Info/FbInfo": "FbInfo", "../Info/ItemsInfo": "ItemsInfo", "../Info/PlayerInfo": "PlayerInfo", "../Info/SetInfo": "SetInfo", "../Info/SignInfo": "SignInfo", "../Main/MainPanel": "MainPanel", "./CommandController": "CommandController" }], GameSDK: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "26d73c2zH1OOYsoKbZxT220", "GameSDK"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../Manager/SysConfig"),
        i = t("./SdkDefault"),
        r = t("../Manager/GlobalEventManager"),
        a = t("../Core/GameType"),
        s = t("./SdkQQ"),
        c = t("../../Game/Info/SetInfo"),
        l = function () {
      function t() {}return Object.defineProperty(t, "sdk", { get: function get() {
          return t._sdk;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t, "sdkId", { get: function get() {
          return t._sdkId;
        }, enumerable: !1, configurable: !0 }), t.init = function () {
        window.qq ? t._sdkId = a.SdkType.QQ : t._sdkId = o.default.SDK, console.log("sdk:", t._sdkId), t.initSDK();
      }, t.initSDK = function () {
        switch (t.sdkId) {case a.SdkType.QQ:
            t._sdk = new s.default();break;default:
            t._sdk = new i.default();}t.sdk.initSDK(), r.default.on(a.SdkEvent.SAVE_DATA, t.saveDataHandler, t), r.default.on(a.SdkEvent.SAVE_OPEN_DATA, t.saveOpenDataHandler, t), r.default.on(a.SdkEvent.LOGOUT, t.logoutHandler, t);
      }, t.getUid = function () {
        return t.sdk.uid;
      }, t.getNickname = function () {
        return t.sdk.nickname;
      }, t.getIcon = function () {
        return t.sdk.icon;
      }, t.getVip = function () {
        return t.sdk.vip;
      }, t.login = function () {
        t.sdk && t.sdk.login();
      }, t.loadUserData = function () {
        t.sdk.loadUserData();
      }, t.logoutHandler = function (e) {
        if (t.sdk) {
          var n = e[0];t.sdk.logout(n);
        }
      }, t.saveDataHandler = function (e) {
        if (t.sdk) {
          var n = e[0];t.sdk.saveUserData(n);
        }
      }, t.saveOpenDataHandler = function () {
        t.sdk && t.sdk.saveOpenData();
      }, t.getRankData = function (e, n) {
        void 0 === e && (e = null), void 0 === n && (n = null), t.sdk && t.sdk.getRankData(e, n);
      }, t.postMessage = function (e) {
        t.sdk && t.sdk.postMessage(e);
      }, t.isShare = function () {
        return !!t.sdk && t.sdk.isShare;
      }, t.share = function (e, n, o, i) {
        void 0 === e && (e = null), void 0 === n && (n = null), void 0 === o && (o = null), void 0 === i && (i = null), t.sdk && t.sdk.share(e, n, o, i);
      }, t.showBannerAd = function () {
        t.sdk;
      }, t.hideBannerAd = function () {}, t.showVideoAd = function (e, n, o) {
        void 0 === e && (e = null), void 0 === n && (n = null), t.sdk && t.sdk.showVideoAd(e, n, o);
      }, t.hideVideoAd = function () {
        t.sdk.hideVideoAd();
      }, t.adOpen = function () {
        return t.sdk.adOpen();
      }, t.hasInsertAd = function () {
        return !!t.sdk && t.sdk.hasInsertAd();
      }, t.showInsertAd = function () {
        t.sdk.showInsertAd();
      }, t.vibrateShort = function () {
        1 == c.default.ins.vibrate && t.sdk.vibrateShort();
      }, t.vibrateLong = function () {
        1 == c.default.ins.vibrate && t.sdk.vibrateLong();
      }, t.navigateToMiniGame = function (e) {
        t.sdk.navigateToMiniGame(e);
      }, t.isVideoRec = function () {
        return t.sdk.isVideoRec();
      }, t.videoRecStart = function () {
        t.sdk.videoRecStart();
      }, t.videoRecStop = function (e, n, o) {
        void 0 === e && (e = null), void 0 === n && (n = null), void 0 === o && (o = !1), t.sdk.videoRecStop(e, n, o);
      }, t.shareRecVideo = function (e, n) {
        void 0 === e && (e = null), void 0 === n && (n = null), t.sdk.shareRecVideo(e, n);
      }, t.clearRecVideo = function () {
        t.sdk.clearRecVideo();
      }, t.isExistRecVideo = function () {
        return t.sdk.isExistRecVideo();
      }, t.getRecSecond = function () {
        return t.sdk.getRecSecond();
      }, t.getBannerTime = function () {
        return t.sdk.banner_time;
      }, t.getShareImgUrl = function () {
        return t.sdk.getShareImgUrl();
      }, t.openUrl = function (e, n) {
        void 0 === n && (n = 0), t.sdk.openUrl(e, n);
      }, t.isIos = function () {
        return t.sdk.isIos();
      }, t.showToast = function (e, n) {
        void 0 === n && (n = 2e3), t.sdk.showToast(e, n);
      }, t.shareInvite = function () {
        t.sdk.shareInvite();
      }, t.getRoomId = function () {
        return t.sdk.roomId;
      }, t.clearRoomId = function () {
        t.sdk.clearRoomId();
      }, t;
    }();n.default = l, cc._RF.pop();
  }, { "../../Game/Info/SetInfo": "SetInfo", "../Core/GameType": "GameType", "../Manager/GlobalEventManager": "GlobalEventManager", "../Manager/SysConfig": "SysConfig", "./SdkDefault": "SdkDefault", "./SdkQQ": "SdkQQ" }], GameScene: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "d3b445CbE5IgbCw94VHo6pn", "GameScene");var _o35,
        i = this && this.__extends || (_o35 = function o(t, e) {
      return (_o35 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o35(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../Dash/HeroActor"),
        s = t("../../Common/Manager/LoadResManager"),
        c = t("../Dash/MusicController"),
        l = t("../Dash/SingleController"),
        u = t("../Dash/SportController"),
        f = t("../../Common/Manager/MusicManager"),
        d = t("../../Common/UI/UIManager"),
        h = t("../Manager/GameManager"),
        p = t("../Fb/FbPanel"),
        _ = t("../Main/MainPanel"),
        m = t("../../Common/Util/ComponentUtil"),
        g = t("../../Common/Manager/Logger"),
        y = t("../Config/RoleConfig"),
        b = t("../../Common/Manager/DataManager"),
        C = t("../Dash/ItemActor"),
        v = cc._decorator,
        I = v.ccclass,
        M = (v.property, function (t) {
      function e() {
        var e = t.call(this) || this;return n._ins = e, e;
      }var n;return i(e, t), n = e, Object.defineProperty(e, "ins", { get: function get() {
          return this._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.start = function () {
        this._camera = m.default.getComponent(cc.Camera, this.node, "camera"), this._sceneNode = m.default.getNode(this.node, "sceneNode"), this._effSnow = m.default.getNode(this.node, "eff_snow"), this._effSnow.active = !0, c.MusicController.ins.init(0), a.default.ins.is3DNode = !0, g.default.log("----------------GameScene-- start "), 0 == b.default.select_role_id && (b.default.select_role_id = y.default.def_id, b.default.save()), a.default.ins.data = b.default.select_role_id, C.ItemEffectActor.init(), this._sceneNode.addChild(a.default.ins), this.initStage(), this.resetCamera();
      }, e.prototype.resetCamera = function () {
        this._camera.node.position = cc.v3(0, 6.8, 13), this._camera.node.eulerAngles = cc.v3(-26, 0, 0);
      }, Object.defineProperty(e.prototype, "stepIdx", { get: function get() {
          return this._dashCtrl ? (g.default.log("------------------this._dashCtrl.stepIdx " + this._dashCtrl.stepIdx), this._dashCtrl.stepIdx) : (g.default.log("------------------stepIdx 0"), 0);
        }, enumerable: !1, configurable: !0 }), e.prototype.initStage = function () {
        s.default.getPrefab("Prefab/stage");var t = this;s.default.bundle.load("Prefab/stage", cc.Prefab, function (e, n) {
          t.initStageComplete(n);
        });
      }, e.prototype.initStageComplete = function (t) {
        var e;(e = cc.instantiate(t)).is3DNode = !0, e.group = "planet", e.active = !0, e.position = cc.Vec3.ZERO, e.scale = 1, this._sceneNode.addChild(e), this._stage = e;
      }, e.prototype.registerTouchListen = function () {
        var t = this.node.getChildByName("TouchNode");t && !t.hasEventListener(cc.Node.EventType.TOUCH_START) && (t.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this), t.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this), t.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEndHandler, this), t.on(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this));
      }, e.prototype.unregisterTouchListen = function () {
        this.node.getChildByName("TouchNode").targetOff(this);
      }, e.prototype.musicVolume = function (t) {
        void 0 === t && (t = 1), this._dashCtrl && this._dashCtrl.musicVolume(t);
      }, e.prototype.update = function (t) {
        this._dashCtrl && this._dashCtrl.update(t);
      }, e.prototype.onTouchStartHandler = function (t) {
        this._dashCtrl && this._dashCtrl.onTouchStartHandler(t);
      }, e.prototype.onTouchMoveHandler = function (t) {
        this._dashCtrl && this._dashCtrl.onTouchMoveHandler(t);
      }, e.prototype.onTouchEndHandler = function (t) {
        this._dashCtrl && this._dashCtrl.onTouchEndHandler(t);
      }, e.prototype.onStartGame = function (t) {
        f.default.pauseBGM(), a.default.ins.data != b.default.select_role_id && (a.default.ins.data = b.default.select_role_id), d.default.close(_.default), h.default.startGame(), d.default.show(p.default, { isSport: t }), this._effSnow.active = !1;
      }, e.prototype.startSingle = function () {
        this._dashCtrl && (this._dashCtrl.destroy(), this._dashCtrl = null), this._dashCtrl = new l.default(this.node), this._stage.scale = 1.5, this.registerTouchListen(), this.onStartGame(!1);
      }, e.prototype.startSport = function (t) {
        void 0 === t && (t = null), this._dashCtrl && (this._dashCtrl.destroy(), this._dashCtrl = null), this._dashCtrl = new u.default(this.node, t), this._stage.scale = 1.5, this.registerTouchListen(), this.onStartGame(!0);
      }, e.prototype.startGame = function () {
        this._dashCtrl && this._dashCtrl.startGame();
      }, e.prototype.revive = function () {
        this._dashCtrl && this._dashCtrl.revive();
      }, e.prototype.useItem = function (t) {
        return !!this._dashCtrl && this._dashCtrl.useItem(t);
      }, e.prototype.closeGame = function () {
        this.unregisterTouchListen(), cc.Tween.stopAllByTarget(a.default.ins), a.default.ins.position = cc.Vec3.ZERO, a.default.ins.eulerAngles = cc.Vec3.ZERO, a.default.ins.idle(), this.resetCamera(), this._effSnow.active = !0, this._stage.scale = 1, this._dashCtrl && (this._dashCtrl.destroy(), this._dashCtrl = null);
      }, n = r([I], e);
    }(cc.Component));n.default = M, cc._RF.pop();
  }, { "../../Common/Manager/DataManager": "DataManager", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/RoleConfig": "RoleConfig", "../Dash/HeroActor": "HeroActor", "../Dash/ItemActor": "ItemActor", "../Dash/MusicController": "MusicController", "../Dash/SingleController": "SingleController", "../Dash/SportController": "SportController", "../Fb/FbPanel": "FbPanel", "../Main/MainPanel": "MainPanel", "../Manager/GameManager": "GameManager" }], GameType: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "645f9FnWF5HKqRot1/WK0YM", "GameType"), Object.defineProperty(n, "__esModule", { value: !0 }), n.VideoAdType = n.SocketEvent = n.UIEvent = n.SdkType = n.LoadResType = n.SdkEvent = n.InitStepEvent = n.InfoEvent = n.GlobalEvent = n.ActionType = n.UILayerType = n.GameEvent = n.ActorStatus = n.ActorType = void 0, function (t) {
      t[t.Hero = 1] = "Hero", t[t.Npc = 2] = "Npc", t[t.Animal = 3] = "Animal", t[t.Item = 4] = "Item";
    }(n.ActorType || (n.ActorType = {})), function (t) {
      t[t.Idle = 1] = "Idle", t[t.Run = 2] = "Run";
    }(n.ActorStatus || (n.ActorStatus = {})), function (t) {
      t.Show = "GAME_EVENT_SHOW", t.Hide = "GAME_EVENT_HIDE";
    }(n.GameEvent || (n.GameEvent = {})), function (t) {
      t[t.BackLayer = 1] = "BackLayer", t[t.MainLayer = 2] = "MainLayer", t[t.FuncLayer = 3] = "FuncLayer", t[t.FbEndLayer = 4] = "FbEndLayer", t[t.PopLayer = 5] = "PopLayer", t[t.SubPopLayer = 6] = "SubPopLayer", t[t.SubWindowLayer = 7] = "SubWindowLayer", t[t.GuideLayer = 8] = "GuideLayer", t[t.ADLayer = 9] = "ADLayer", t[t.MoneyLayer = 10] = "MoneyLayer", t[t.NoticeTipsLayer = 11] = "NoticeTipsLayer", t[t.ItemTipsLayer = 12] = "ItemTipsLayer", t[t.DanmuLayar = 13] = "DanmuLayar", t[t.TopLayer = 14] = "TopLayer", t[t.BannerAdLayer = 15] = "BannerAdLayer", t[t.InsertAdLayer = 16] = "InsertAdLayer";
    }(n.UILayerType || (n.UILayerType = {})), function (t) {
      t[t.Normal = 1] = "Normal", t[t.Block = 2] = "Block", t[t.SameBlock = 3] = "SameBlock", t[t.Joint = 4] = "Joint";
    }(n.ActionType || (n.ActionType = {})), function (t) {
      t.EVENT_NEW_DAY = "GBE_EVENT_NEW_DAY", t.LOADING_PROCESS = "LOADING_PROCESS";
    }(n.GlobalEvent || (n.GlobalEvent = {})), function (t) {
      t.EVENT_CHANGE = "IFE_EVENT_CHANGE", t.GIFT_CHANGE = "IFE_GIFT_CHANGE", t.EVENT_SAVE = "IFE_EVENT_SAVE", t.EVENT_BUFF_FINISH = "EVENT_BUFF_FINISH", t.EVENT_REMOVE_BUFF = "EVENT_REMOVE_BUFF", t.EVENT_ADD_BUFF = "EVENT_ADD_BUFF";
    }(n.InfoEvent || (n.InfoEvent = {})), function (t) {
      t.NET_ERROR = "ITE_NET_ERROR", t.INIT_SDK_FINISH = "ITE_INIT_SDK_FINISH", t.LOGIN_FINISH = "ITE_LOGIN_FINISH", t.LOAD_RES_FINISH = "ITE_LOAD_RES_FINISH";
    }(n.InitStepEvent || (n.InitStepEvent = {})), function (t) {
      t.SAVE_DATA = "SDK_SAVE_DATA", t.SAVE_OPEN_DATA = "SDK_SAVE_OPEN_DATA", t.SAVE_OPEN_DATA_COMPLETE = "SDK_SAVE_OPEN_DATA_COMPLETE", t.LOGOUT = "SDK_LOGOUT", t.BANNER_ONERROR = "SDK_BANNER_ONERROR", t.BANNER_ONLOAD = "SDK_BANNER_ONLOAD", t.REC_VIDEO_CLEAR = "REC_VIDEO_CLEAR";
    }(n.SdkEvent || (n.SdkEvent = {})), function (t) {
      t[t.ATLAS = 1] = "ATLAS", t[t.SOUND = 2] = "SOUND", t[t.CONFIG = 3] = "CONFIG", t[t.LOAD_USER_DATA = 4] = "LOAD_USER_DATA", t[t.PREFAB = 5] = "PREFAB", t[t.LOAD_FINISH = 6] = "LOAD_FINISH", t[t.BUNDLE = 7] = "BUNDLE";
    }(n.LoadResType || (n.LoadResType = {})), function (t) {
      t[t.DEFAULT = 0] = "DEFAULT", t[t.WX = 1] = "WX", t[t.TT = 2] = "TT", t[t.OPPO = 3] = "OPPO", t[t.QQ = 4] = "QQ", t[t.MEIZU = 5] = "MEIZU", t[t.SWAM = 6] = "SWAM", t[t.VIVO = 7] = "VIVO", t[t.H4399 = 8] = "H4399", t[t.OPPO_APK = 101] = "OPPO_APK", t[t.VIVO_APK = 102] = "VIVO_APK", t[t.TAP_APK = 103] = "TAP_APK";
    }(n.SdkType || (n.SdkType = {})), function (t) {
      t.EVENT_SHOW = "UI_EVENT_SHOW", t.EVENT_CLOSE = "UI_EVENT_CLOSE";
    }(n.UIEvent || (n.UIEvent = {})), function (t) {
      t.close = "se_evt_close", t.error = "se_evt_error", t.message = "se_evt_message", t.open = "se_evt_open";
    }(n.SocketEvent || (n.SocketEvent = {})), function (t) {
      t[t.Single = 1] = "Single", t[t.Sport = 2] = "Sport", t[t.ItemUpgrade = 3] = "ItemUpgrade", t[t.Sign = 4] = "Sign", t[t.Buqian = 5] = "Buqian";
    }(n.VideoAdType || (n.VideoAdType = {})), cc._RF.pop();
  }, {}], GeneralTips: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "2c292iPshFM+4Iq1jwunhQn", "GeneralTips");var _o36,
        i = this && this.__extends || (_o36 = function o(t, e) {
      return (_o36 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o36(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/UI/UIManager"),
        c = t("../../Common/Manager/TimeManager"),
        l = t("../../Common/Core/GameType"),
        u = cc._decorator,
        f = u.ccclass,
        d = (u.property, function (t) {
      function e() {
        var e = t.call(this) || this;return n._ins = e, e._time = 0, e;
      }var n;return i(e, t), n = e, e.show = function (t, e, o) {
        void 0 === e && (e = null), void 0 === o && (o = cc.Color.WHITE), n.addToTipsList(t, e, o), s.default.show(n);
      }, e.addToTipsList = function (t, e, o) {
        if (null == e) {
          for (var i = 0; i < n._curtips.length; i++) {
            if (n._curtips[i].tips == t) return;
          }for (i = 0; i < n._tipslist.length; i++) {
            if (n._tipslist[i].tips == t) return;
          }
        }n._tipslist.push({ tips: t, color: o, time: e }), n._tipsCount++;
      }, e.push = function (t) {
        t && (t.node.parent = null, n._tipsLabelPool.push(t));
      }, e.shift = function () {
        if (n._tipsLabelPool.length > 0) return n._tipsLabelPool.shift();var t = new cc.Node(),
            e = t.addComponent(cc.Label);return t.addComponent(cc.LabelOutline), e;
      }, e.prototype.onStart = function () {}, e.prototype.update = function () {
        if (n._curtips.length + n._tipslist.length > 0) {
          var t = n._tipslist[0];t && (c.default.localTime, this._time, t.tips, this._time = c.default.localTime, this.next()), c.default.localTime - this._time > 300 && (this._time = c.default.localTime, this.next());
        } else s.default.close(this);
      }, e.prototype.next = function () {
        if (n._tipslist.length > 0) {
          var t = n._tipslist.shift(),
              e = n.shift();e.string = t.tips, e.node.position = new cc.Vec3(0, 100, 0), e.node.color = t.color;var o = e.getComponent(cc.LabelOutline);o.color = t.color, o.width = 1, e.node.scale = .5, e.node.parent = this.node, n._curtips.push(t), e.node.color, cc.tween(e.node).to(2, { scale: 1.2, position: new cc.Vec3(0, 300, 0) }, { easing: "linear" }).call(function () {
            n._curtips.shift(), n.push(e);
          }).start();
        }
      }, Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.TopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), n._ins = null, n._tipslist = [], n._tipsLabelPool = [], n._curtips = [];
      }, e._tipslist = [], e._tipsCount = 0, e._tipsLabelPool = [], e._curtips = [], n = r([f], e);
    }(a.default));n.default = d, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel" }], GlobalEventManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "bdf24BswGZIBb1QdM9APskz", "GlobalEventManager");var _o37,
        i = this && this.__extends || (_o37 = function o(t, e) {
      return (_o37 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o37(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e.on = function (t, n, o) {
        return e.ins.on(t, n, o);
      }, e.off = function (t, n, o) {
        e.ins.off(t, n, o);
      }, e.targetOff = function (t) {
        e.ins.targetOff(t);
      }, e.once = function (t, n, o) {
        e.ins.once(t, n, o);
      }, e.dispatchEvent = function (t) {
        for (var n = [], o = 1; o < arguments.length; o++) {
          n[o - 1] = arguments[o];
        }e.ins.emit(t, n);
      }, e;
    }(cc.EventTarget);n.default = r, cc._RF.pop();
  }, {}], HeroActor: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "711e1htrkBJgZUUZdKlmGzq", "HeroActor");var _o38,
        i = this && this.__extends || (_o38 = function o(t, e) {
      return (_o38 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o38(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../Config/GameConfig"),
        s = t("../../Common/Util/MathUtil"),
        c = t("../../Common/Manager/LoadResManager"),
        l = t("../../Common/Util/ComponentUtil"),
        u = t("../Config/RoleConfig"),
        f = t("../../Common/Manager/Logger"),
        d = t("./ItemActor"),
        h = cc._decorator,
        p = h.ccclass,
        _ = (h.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e.group = "actor", e.is3DNode = !0, e._dizzyTime = -1, e;
      }var n;return i(e, t), n = e, Object.defineProperty(e, "ins", { get: function get() {
          return null == n._ins && (n._ins = new n()), this._ins;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "locator", { get: function get() {
          return this._locator;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "animState", { get: function get() {
          return this._aState;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "isThrow", { get: function get() {
          return this._isThrow;
        }, enumerable: !1, configurable: !0 }), e.prototype.initModel = function (t) {
        this._model && this._model.removeFromParent();var e = cc.instantiate(t);this._locator = l.default.findNode("locator", e), this._animation = e.getComponent(cc.Animation), this.addChild(e), this._model = e;
      }, Object.defineProperty(e.prototype, "data", { get: function get() {
          return this._data;
        }, set: function set(t) {
          if (f.default.log("-------- HeroActor data id " + t), this._data != t) {
            this._data = t;var e = "Prefab/" + u.default.ins.getItem(t).model,
                n = this;c.default.bundle.load(e, cc.Prefab, function (t, e) {
              n.initModel(e);
            });
          }
        }, enumerable: !1, configurable: !0 }), e.prototype.update = function (t) {
        this._dizzyTime > 0 ? (this._dizzyTime -= t, this._dizzyEffect && (this._dizzyEffect.position = this.position, this._dizzyEffect.setSiblingIndex(this._dizzyEffect.parent.childrenCount))) : this._dizzyEffect && (this._dizzyEffect.stop(), this._dizzyEffect = null), (this._isJump || this._isThrow) && (this._jumpHeight = Math.max(0, this._jumpHeight + this._jumpSpeed), this.y = s.default.clamp(this._jumpHeight, 0, 6), this._jumpSpeed -= this._gravity, this._isThrow ? this._aState.time >= this._aState.duration && (this._isThrow = !1) : (this._falling || this._aState && this._aState.time >= this._aState.duration && (this._animation.play("stay" + s.default.randomInt(1, 12)), this._falling = !0), this._jumpSpeed < 0 && !this._falling && (this._animation && this._animation.play("fall" + s.default.randomInt(1, 4)), this._falling = !0)));
      }, e.prototype.jump = function (t) {
        this._gravity = a.default.Gravity, t > .35 && (this._gravity *= .175 / t), this._space = t * a.default.CurHeroSpeed, this._jumpTime = t, this._jumpHeight = 0, this._jumpSpeed = (Math.ceil(this._space / (a.default.CurHeroSpeed / 60)) - 1) * this._gravity / 2, this._isJump = !0, this._staying = !1, this._falling = !1, this.y = 0, this._isThrow || (this._aState = this._animation.play("jump" + s.default.randomInt(1, 3)), this._model.eulerAngles = cc.Vec3.ZERO);
      }, e.prototype.idle = function () {
        this._isJump = !1, this._isThrow = !1, this._animation.play("idle"), this._model.eulerAngles = cc.Vec3.ZERO;
      }, e.prototype.dump = function () {
        this._isJump = !1, this._isThrow = !1, this._animation.play("stay6"), cc.tween(this._model).to(.5, { eulerAngles: cc.v3(-270, 0, 0) }).start();
      }, e.prototype.throw = function () {
        this._isThrow || (this._isThrow = !0, this._aState = this._animation.play("throw"), this._model.eulerAngles = cc.Vec3.ZERO);
      }, e.prototype.dizzy = function (t) {
        this._dizzyTime < 0 && null == this._dizzyEffect && (this._dizzyEffect = d.ItemEffectActor.get(t.effect), this.parent.addChild(this._dizzyEffect), this._dizzyEffect.play()), this._dizzyTime = parseInt(t.fun_para) / 1e3;
      }, Object.defineProperty(e.prototype, "isDizzy", { get: function get() {
          return this._dizzyTime > 0;
        }, enumerable: !1, configurable: !0 }), n = r([p], e);
    }(cc.Node));n.default = _, cc._RF.pop();
  }, { "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/Logger": "Logger", "../../Common/Util/ComponentUtil": "ComponentUtil", "../../Common/Util/MathUtil": "MathUtil", "../Config/GameConfig": "GameConfig", "../Config/RoleConfig": "RoleConfig", "./ItemActor": "ItemActor" }], HitEffect: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "6ca41ski1tFd5HFDRMB2JoO", "HitEffect");var _o39,
        i = this && this.__extends || (_o39 = function o(t, e) {
      return (_o39 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o39(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.HitEffectCom = void 0;var a = cc._decorator,
        s = a.ccclass,
        c = (a.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.start = function () {
        var t = this;cc.resources.load("Prefab/hitEffect1", cc.Prefab, function (e, n) {
          var o = cc.instantiate(n);o.position = cc.Vec3.ZERO, t.node.addChild(o), t._particles = o.getComponentsInChildren(cc.ParticleSystem3D), t.play();
        });
      }, e.prototype.update = function (t) {
        this._isPlay && this._particles && (this._timer += t, this._timer > this._particles[0].duration && this.stop());
      }, e.prototype.play = function () {
        this._particles && !this._isPlay && (this._play(), this._isPlay = !0, this._timer = 0);
      }, e.prototype.stop = function () {
        this._particles && this._isPlay && (this._stop(), this._isPlay = !1, l.push(this.node));
      }, e.prototype._play = function () {
        for (var t = 0; t < this._particles.length; t++) {
          this._particles[t].play();
        }
      }, e.prototype._stop = function () {
        for (var t = 0; t < this._particles.length; t++) {
          this._particles[t].stop();
        }
      }, e;
    }(cc.Component));n.HitEffectCom = c;var l = function (t) {
      function e() {
        var e = t.call(this) || this;return e.is3DNode = !0, e._act = e.addComponent(c), e;
      }var n;return i(e, t), n = e, e.getEffect = function () {
        return null != n.pools[0] ? n.pools.shift() : new n();
      }, e.push = function (t) {
        t instanceof n && (t.parent = null, n.pools.push(t));
      }, e.initEffects = function () {
        for (var t = 0; t < 7; t++) {
          n.push(new n());
        }
      }, e.prototype.play = function () {
        this._act && this._act.play();
      }, e.prototype.stop = function () {
        this._act && this._act.stop();
      }, e.pools = [], n = r([s], e);
    }(cc.Node);n.default = l, cc._RF.pop();
  }, {}], HitSkyEffect: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "a610frKfUhC/qu3PWRCwVQW", "HitSkyEffect");var _o40,
        i = this && this.__extends || (_o40 = function o(t, e) {
      return (_o40 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o40(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.HitSkyEffectCom = void 0;var a = cc._decorator,
        s = a.ccclass,
        c = (a.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.start = function () {
        var t = this;this._duration = 0, cc.resources.load("Prefab/hitEffect2", cc.Prefab, function (e, n) {
          var o = cc.instantiate(n);o.position = cc.Vec3.ZERO, t.node.addChild(o), t._particles = o.getComponentsInChildren(cc.ParticleSystem3D);for (var i = 0; i < t._particles.length; i++) {
            t._duration = Math.max(t._duration, t._particles[i].duration);
          }t.play();
        });
      }, e.prototype.update = function (t) {
        this._isPlay && this._particles && (this._timer += t, this._timer >= this._duration && this.stop());
      }, e.prototype.play = function () {
        this._particles && !this._isPlay && (this._playAll(), this._isPlay = !0, this._timer = 0);
      }, e.prototype.stop = function () {
        this._particles && this._isPlay && (this._stopAll(), this._isPlay = !1, l.push(this.node));
      }, e.prototype._playAll = function () {
        for (var t = 0; t < this._particles.length; t++) {
          this._particles[t].play();
        }
      }, e.prototype._stopAll = function () {
        for (var t = 0; t < this._particles.length; t++) {
          this._particles[t].stop();
        }
      }, e;
    }(cc.Component));n.HitSkyEffectCom = c;var l = function (t) {
      function e() {
        var e = t.call(this) || this;return e.is3DNode = !0, e._act = e.addComponent(c), e;
      }var n;return i(e, t), n = e, e.getEffect = function () {
        return null != n.pools[0] ? n.pools.shift() : new n();
      }, e.push = function (t) {
        t instanceof n && (t.parent = null, n.pools.push(t));
      }, e.prototype.play = function () {
        this._act && this._act.play();
      }, e.prototype.stop = function () {
        this._act && this._act.stop();
      }, e.pools = [], n = r([s], e);
    }(cc.Node);n.default = l, cc._RF.pop();
  }, {}], HostManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "740449qfaBPfK+R28DvJKTD", "HostManager"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./SysConfig"),
        i = t("../Util/MathUtil"),
        r = function () {
      function t() {}return t.getHost = function () {
        return -1 == this._idx && (this._idx = i.default.randomInt(o.default.SERVER_HOSTS.length - 1)), o.default.SERVER_HOSTS[this._idx];
      }, t._idx = -1, t;
    }();n.default = r, cc._RF.pop();
  }, { "../Util/MathUtil": "MathUtil", "./SysConfig": "SysConfig" }], ItemActor: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "961deiXPT5G4o0BY/fYs2fY", "ItemActor");var _o41,
        i = this && this.__extends || (_o41 = function o(t, e) {
      return (_o41 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o41(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 }), n.ItemEffectActor = n.ItemEffectCom = void 0;var r = t("../../Common/Manager/LoadResManager"),
        a = t("../../Common/Util/ComponentUtil"),
        s = t("../../Common/Util/MathUtil"),
        c = t("../Config/ProductConfig"),
        l = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.start = function () {
        var t;this._duration = 0, this._particles = this.node.getComponentsInChildren(cc.ParticleSystem3D);for (var e = this.getScale(), n = 0; n < this._particles.length; n++) {
          t = this._particles[n], this._duration = Math.max(this._duration, t.duration), t.startSize.constant *= e, t.startSize.constantMin *= e, t.startSize.constantMax *= e, t.startSpeed.constant *= e, t.startSpeed.constantMin *= e, t.startSpeed.constantMax *= e, t.shapeModule.radius *= e;
        }this.play();
      }, e.prototype.getScale = function () {
        var t = 1;switch (this.node.name) {case "xueqiuEffect2":
            t = 2;break;case "bianpaoEffect1":
            t = 1.2;break;case "bianpaoEffect2":
            t = 2;break;case "miwuEffect1":
            t = .8;break;case "miwuEffect2":
            t = 1.5;}return t;
      }, e.prototype.update = function (t) {
        this._isPlay && this._particles && (this._particles[0].capacity, this._timer += t, this._timer > this._particles[0].duration && this.stop());
      }, e.prototype.play = function () {
        if (this._particles && !this._isPlay) {
          if (this._play(), "bianpaoEffect1" == this.node.name || "bianpaoEffect2" == this.node.name) for (var t = 1; t <= 3; t++) {
            var e = a.default.findNode("eff" + t, this.node);e && (e.x = s.default.randomFloat(-1, 1), e.y = s.default.randomFloat(-1, 1));
          }this._isPlay = !0, this._timer = 0;
        }
      }, e.prototype.stop = function () {
        this._particles && this._isPlay && (this._stop(), this._isPlay = !1, u.push(this.node));
      }, e.prototype._play = function () {
        for (var t = 0; t < this._particles.length; t++) {
          this._particles[t].play();
        }
      }, e.prototype._stop = function () {
        for (var t = 0; t < this._particles.length; t++) {
          this._particles[t].stop();
        }
      }, e;
    }(cc.Component);n.ItemEffectCom = l;var u = function (t) {
      function e(e) {
        var n = t.call(this) || this;n.group = "planet", n.is3DNode = !0, n.name = e;var o = "Prefab/" + e.substr(0, e.length - 1),
            i = n;return cc.resources.load(o, cc.Prefab, function (t, e) {
          t || i.initModel(e);
        }), n;
      }return i(e, t), e.init = function () {
        for (var t, n, o = c.default.ins.getList(), i = 0; i < o.length; i++) {
          3 == (t = o[i]).type && (n = new e(t.effect), e.push(n));
        }
      }, e.get = function (t) {
        var n,
            o = this._pool[t];return (n = null == o || o && o.length < 1 ? new e(t) : o.shift()).removeFromParent(), n;
      }, e.push = function (t) {
        var e = this._pool[t.name];null == e && (e = [], this._pool[t.name] = e), t.removeFromParent(), e.push(t);
      }, e.prototype.initModel = function (t) {
        var e;t instanceof cc.Prefab ? e = cc.instantiate(t) : (e = t).parent && (e = cc.instantiate(t)), this._model = e, this.addChild(e), this._com = this.addComponent(l);
      }, e.prototype.play = function () {
        this._com && this._com.play();
      }, e.prototype.stop = function () {
        this._com && this._com.stop();
      }, e._pool = {}, e;
    }(cc.Node);n.ItemEffectActor = u;var f = function (t) {
      function e(e) {
        var n = t.call(this) || this;n.group = "planet", n.is3DNode = !0, n._data = e;var o = "Prefab/" + e.model,
            i = n;return r.default.bundle.load(o, cc.Prefab, function (t, e) {
          t || i.initModel(e);
        }), n;
      }return i(e, t), e.get = function (t) {
        var n,
            o = this._pool[t.id];return (n = null == o || o && o.length < 1 ? new e(t) : o.shift()).removeFromParent(), n;
      }, e.push = function (t) {
        var e = this._pool[t.data.id];null == e && (e = [], this._pool[t.data.id] = e), t.removeFromParent(), e.push(t);
      }, e.prototype.initModel = function (t) {
        var e;e = cc.instantiate(t), this._model = e, this.addChild(e);
      }, Object.defineProperty(e.prototype, "data", { get: function get() {
          return this._data;
        }, enumerable: !1, configurable: !0 }), e._pool = {}, e;
    }(cc.Node);n.default = f, cc._RF.pop();
  }, { "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Util/ComponentUtil": "ComponentUtil", "../../Common/Util/MathUtil": "MathUtil", "../Config/ProductConfig": "ProductConfig" }], ItemMessage1: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "fdc78H0k1NFsIYwWpWHq4ky", "ItemMessage1");var _o42,
        i = this && this.__extends || (_o42 = function o(t, e) {
      return (_o42 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o42(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Manager/LoadResManager"),
        d = t("../Config/ProductConfig"),
        h = cc._decorator,
        p = h.ccclass,
        _ = (h.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubWindowLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.sp_item = s.default.getComponent(cc.Sprite, this.node, "frame/sp_item");
      }, e.prototype.onShow = function () {
        this.refresh();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this);
      }, e.prototype.refresh = function () {
        if (this.sp_item) {
          var t = d.default.ins.getItem(this.data.spId);f.default.loadSprite(this.sp_item, "Atlas/atlas_item/" + t.icon);
        }
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, r([p], e);
    }(a.default));n.default = _, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/ProductConfig": "ProductConfig" }], ItemMessageTips: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "f0d35gFhhRID41YizzrzNtA", "ItemMessageTips");var _o43,
        i = this && this.__extends || (_o43 = function o(t, e) {
      return (_o43 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o43(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Manager/LoadResManager"),
        d = t("./ExchangeAddrPanel"),
        h = t("../Manager/CommandController"),
        p = t("./ItemMessage1"),
        _ = t("./ItemMessage"),
        m = t("../../Common/Sdks/UmaTrackHelper"),
        g = t("../../Common/Util/StringUtil"),
        y = t("../../Common/Sdks/GameSDK"),
        b = t("../Config/ProductConfig"),
        C = t("../Info/PlayerInfo"),
        v = cc._decorator,
        I = v.ccclass,
        M = (v.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubPopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_go = s.default.getComponent(cc.Button, this.node, "frame/btn_go"), this.btn_go.node.on(cc.Node.EventType.TOUCH_END, this.onTouchGoHandler, this), this.sp_txt = s.default.getComponent(cc.Sprite, this.node, "frame/btn_go/Background/sp_txt"), this.sp_item = s.default.getComponent(cc.Sprite, this.node, "frame/sp_item"), this.lb_desc = s.default.getComponent(cc.Label, this.node, "frame/lb_desc");
      }, e.prototype.onShow = function () {
        this.refresh();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this), this.btn_go.node.targetOff(this);
      }, e.prototype.refresh = function () {
        if (this.sp_item && this.data.UIExchange) {
          var t = this.data.UIExchange,
              e = b.default.ins.getItem(t.exchange.id);f.default.loadSprite(this.sp_item, "Atlas/atlas_item/" + e.icon), this.lb_desc.string = g.default.replaceNewLine(e.desc);var n = s.default.getComponent(cc.Sprite, this.btn_go.node, "Background");0 == t.exchange.total || t.getRemain() > 0 ? (f.default.loadSprite(n, "Atlas/atlas_sub/btn_yellow"), f.default.loadSprite(this.sp_txt, "Atlas/atlas_lottery/txt_dj")) : (f.default.loadSprite(n, "Atlas/atlas_sub/btn_grey"), f.default.loadSprite(this.sp_txt, "Atlas/atlas_lottery/txt_ydw"));
        }
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, e.prototype.onTouchGoHandler = function () {
        c.default.playEffect(c.default.CLICK);var t = this.data.UIExchange;if (!(t.exchange.total > 0 && t.getRemain() <= 0)) if (C.default.ins.giftCoupon < t.exchange.giftCoupon) y.default.showToast("\u5956\u5238\u4E0D\u8DB3");else {
          var e = b.default.ins.getItem(t.exchange.id);2 == e.type ? u.default.show(d.default, { exchange: t }) : (h.default.exchange(t.exchange.id, function (n) {
            null != n.id && (2 == e.type ? u.default.show(p.default, { spId: t.exchange.id }) : u.default.show(_.default, { spId: t.exchange.id }), C.default.ins.giftCoupon = n.gfc, t.useCountChange(n.num), m.default.exchange(t.exchange.id));
          }, this), u.default.close(this));
        }
      }, r([I], e);
    }(a.default));n.default = M, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../../Common/Util/StringUtil": "StringUtil", "../Config/ProductConfig": "ProductConfig", "../Info/PlayerInfo": "PlayerInfo", "../Manager/CommandController": "CommandController", "./ExchangeAddrPanel": "ExchangeAddrPanel", "./ItemMessage": "ItemMessage", "./ItemMessage1": "ItemMessage1" }], ItemMessage: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "1d059Q1WRVEEKRdKVcDmIED", "ItemMessage");var _o44,
        i = this && this.__extends || (_o44 = function o(t, e) {
      return (_o44 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o44(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Manager/LoadResManager"),
        d = t("../../Common/Sdks/GameSDK"),
        h = t("../../Common/Manager/SysConfig"),
        p = t("../Config/ProductConfig"),
        _ = t("../../Common/Util/StringUtil"),
        m = cc._decorator,
        g = m.ccclass,
        y = (m.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubWindowLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_q = s.default.getComponent(cc.Button, this.node, "frame/btn_q"), this.btn_q.node.on(cc.Node.EventType.TOUCH_END, this.onTouchQHandler, this), this.sp_item = s.default.getComponent(cc.Sprite, this.node, "frame/sp_item"), this.lb_desc1 = s.default.getNode(this.node, "frame/Sprite/lb_desc1"), this.label2 = s.default.getComponent(cc.Label, this.node, "frame/Sprite/lb_desc1/label2"), this.lb_desc2 = s.default.getComponent(cc.Label, this.node, "frame/Sprite/lb_desc2"), this.spTxt = s.default.getComponent(cc.Sprite, this.node, "frame/btn_q/Background/sp_txt");
      }, e.prototype.onShow = function () {
        this.refresh();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this), this.btn_q.node.targetOff(this);
      }, e.prototype.refresh = function () {
        if (this.sp_item) {
          var t = p.default.ins.getItem(this.data.spId);f.default.loadSprite(this.sp_item, "Atlas/atlas_item/" + t.icon), "" != t.desc ? (this.lb_desc2.string = _.default.replaceNewLine(t.desc), this.lb_desc1.active = !1, this.lb_desc2.node.active = !0) : (this.lb_desc1.active = !0, this.lb_desc2.node.active = !1, d.default.isIos() ? this.label2.string = "2.\u7528\u6237\u6240\u83B7\u5F97\u7684\u62B5\u6263\u5238\u4EC5\u9650\u5728IOS\u5E73\u53F0\u4F7F\u7528\uFF0C\u6709\u6548\u671F\u4E3A7\u5929\uFF1B" : this.label2.string = "2.\u7528\u6237\u6240\u83B7\u5F97\u7684\u62B5\u6263\u5238\u4EC5\u9650\u5728\u5B89\u5353\u5E73\u53F0\u4F7F\u7528\uFF0C\u6709\u6548\u671F\u4E3A7\u5929\uFF1B");
        }this.btn_q && (!this.data.spId || 106 != this.data.spId && 107 != this.data.spId ? f.default.loadSprite(this.spTxt, "Atlas/atlas_sub/pop_text_gw") : f.default.loadSprite(this.spTxt, "Atlas/atlas_sub/get_text_ljsy"));
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, e.prototype.onTouchQHandler = function () {
        c.default.playEffect(c.default.CLICK), !this.data.spId || 106 != this.data.spId && 107 != this.data.spId ? d.default.openUrl(h.default.QQ_VIP_URL) : d.default.openUrl(h.default.DKQ_USE_URL);
      }, r([g], e);
    }(a.default));n.default = y, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Manager/SysConfig": "SysConfig", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../../Common/Util/StringUtil": "StringUtil", "../Config/ProductConfig": "ProductConfig" }], ItemsInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "784a7lQ8SBDLo/4OlFoBEcM", "ItemsInfo");var _o45,
        i = this && this.__extends || (_o45 = function o(t, e) {
      return (_o45 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o45(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 }), n.ItemsItem = void 0;var r = t("../../Common/Info/AbsInfo"),
        a = t("../../Common/Manager/GlobalEventManager"),
        s = t("../Manager/CommandController"),
        c = t("../../Common/Core/NumValue"),
        l = function () {
      function t(t) {
        this.setData(t);
      }return t.prototype.setData = function (t) {
        var e = t.split("_");this.id = Number(e[0]), this._am = new c.default(parseInt(e[1])), this.fab = Number(e[2]);
      }, t.prototype.getData = function () {
        return this.id + "_" + this.am + "_" + this.fab;
      }, Object.defineProperty(t.prototype, "am", { get: function get() {
          return this._am.value;
        }, set: function set(t) {
          this._am.value = t;
        }, enumerable: !1, configurable: !0 }), t;
    }();n.ItemsItem = l;var u = function (t) {
      function e() {
        return t.call(this) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.init = function (t) {
        if (this.items = new Array(), null != t && null != t.item && "" != t.item) for (var e = (o = t.item.split(",")).length, n = 0; n < e; n++) {
          this.items.push(new l(o[n]));
        } else {
          var o;for (e = (o = "301_2_0,303_2_0,305_2_0,307_2_0".split(",")).length, n = 0; n < e; n++) {
            this.items.push(new l(o[n]));
          }this.saveData();
        }
      }, e.prototype.getData = function () {
        for (var t = "", e = this.items.length, n = e - 1, o = 0; o < e; o++) {
          t += o < n ? this.items[o].getData() + "," : this.items[o].getData();
        }return t;
      }, e.prototype.setFab = function (t) {
        for (var e = this.items.length, n = 0; n < e; n++) {
          this.items[n].id == t ? this.items[n].fab = 1 : this.items[n].fab = 0;
        }
      }, e.prototype.disChange = function () {
        a.default.dispatchEvent(e.event_items_change);
      }, e.prototype.addItem = function (t, e, n) {
        var o;void 0 === n && (n = !0);for (var i = this.items.length, r = 0; r < i; r++) {
          if ((o = this.items[r]).id == t) return void o.am++;
        }this.items.push(new l(t + "_" + e + "_0")), n && this.disChange();
      }, e.prototype.removeItem = function (t, e, n) {
        var o;void 0 === e && (e = 1), void 0 === n && (n = !0);for (var i = this.items.length, r = 0; r < i; r++) {
          if ((o = this.items[r]).id == t) return o.am -= e, void (o.am < 0 && (o.am = 0));
        }n && this.disChange();
      }, e.prototype.getItemsItem = function (t) {
        for (var e, n = this.items.length, o = 0; o < n; o++) {
          if ((e = this.items[o]).id == t) return e;
        }return null;
      }, e.prototype.getAndUseItemForScene = function () {
        for (var t, e = this.items.length, n = 0; n < e; n++) {
          if ((t = this.items[n]).am > 0 && 1 == t.fab) return t.am--, this.saveData(), t.id;
        }for (n = 0; n < e; n++) {
          if ((t = this.items[n]).am > 0) return t.am--, this.saveData(), t.id;
        }return 0;
      }, e.prototype.getCurrentItemId = function () {
        for (var t, e = this.items.length, n = 0; n < e; n++) {
          if ((t = this.items[n]).am > 0 && 1 == t.fab) return t.id;
        }for (n = 0; n < e; n++) {
          if ((t = this.items[n]).am > 0) return t.id;
        }return 0;
      }, e.prototype.saveData = function () {
        var t = e.ins.getData();s.default.saveItem(t, this.itemSaveHd, this, this.itemSaveFailHd);
      }, e.prototype.itemSaveHd = function () {
        this.disChange();
      }, e.prototype.itemSaveFailHd = function () {}, e.event_items_change = "event_items_change", e.id_xq = 301, e.id_bp = 303, e.id_st = 305, e.id_mw = 307, e;
    }(r.default);n.default = u, cc._RF.pop();
  }, { "../../Common/Core/NumValue": "NumValue", "../../Common/Info/AbsInfo": "AbsInfo", "../../Common/Manager/GlobalEventManager": "GlobalEventManager", "../Manager/CommandController": "CommandController" }], LoadResManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "0a2f3L2kqBFWYjMWjSe9Je5", "LoadResManager"), Object.defineProperty(n, "__esModule", { value: !0 }), n.ResManager = n.ResData = void 0;var o = t("../Core/GameType"),
        i = t("./MusicManager"),
        r = t("./GlobalEventManager"),
        a = t("../Sdks/GameSDK"),
        s = t("../Config/ConfigManager"),
        c = function () {
      function t(t, e, n) {
        void 0 === n && (n = !1), this._url = t, this._type = e, this._isBundle = n;
      }return Object.defineProperty(t.prototype, "url", { get: function get() {
          return this._url;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "type", { get: function get() {
          return this._type;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "isBundle", { get: function get() {
          return this._isBundle;
        }, enumerable: !1, configurable: !0 }), t;
    }();n.ResData = c;var l = function () {
      function t() {}return t.getFood = function (e) {
        return t.FoodUrl + e;
      }, t.getKitchen = function (e) {
        return t.KitchenUrl + e;
      }, t.getPlate = function (e) {
        return t.PlateUrl + e;
      }, t.getRole = function (e) {
        return t.roleUrl + e;
      }, t.getKnife = function (e) {
        return t.KnifeUrl + e;
      }, t.getFlavor = function (e) {
        return t.FlavorUrl + e;
      }, t.getEffect = function (e) {
        return t.EffectUrl + e;
      }, t.getMaterial = function (e) {
        return t.MaterialUrl + e;
      }, t.FoodUrl = "Prefab/food/", t.KitchenUrl = "Prefab/kitchen/", t.PlateUrl = "Prefab/plate/", t.roleUrl = "Prefab/role/", t.KnifeUrl = "Prefab/knife/", t.FlavorUrl = "Prefab/flavor/", t.EffectUrl = "Prefab/effect/", t.MaterialUrl = "Material/", t;
    }();n.ResManager = l;var u = function () {
      function t() {}return t.add = function (t, e, n) {
        void 0 === n && (n = !1), this._resList.push(new c(t, e, n));
      }, t.getPrefab = function (e) {
        return t._prefabs[e];
      }, t.addSpriteAtlas = function (e, n) {
        void 0 === n && (n = !1), t.add(e, o.LoadResType.ATLAS, n);
      }, t.addSound = function (e, n) {
        void 0 === n && (n = !1), t.add(e, o.LoadResType.SOUND, n);
      }, t.addConfig = function (e, n) {
        void 0 === n && (n = !1), t.add(e, o.LoadResType.CONFIG, n);
      }, t.addBundle = function (e) {
        t.add(e, o.LoadResType.BUNDLE);
      }, t.start = function () {
        t.addBundle("remote"), t.add("Config/Config", o.LoadResType.CONFIG), t.add("load_user_data", o.LoadResType.LOAD_USER_DATA), this.addSpriteAtlas("Atlas/atlas_main/auto_atlas_main"), this.addSpriteAtlas("Atlas/atlas_sub/auto_atlas_sub"), t.add(i.default.MUSIC, o.LoadResType.SOUND, !0), t.add("Music/11", o.LoadResType.SOUND, !0), t.add("Music/12", o.LoadResType.SOUND, !0), t.add("Music/13", o.LoadResType.SOUND, !0), t.add(i.default.CLICK, o.LoadResType.SOUND), t.add("Prefab/stage", o.LoadResType.PREFAB, !0), t.add("Prefab/qier1", o.LoadResType.PREFAB, !0), t.add("Prefab/qier2", o.LoadResType.PREFAB, !0), t.add("Prefab/gold", o.LoadResType.PREFAB, !0), this.add("load_finish", o.LoadResType.LOAD_FINISH), this.loadNext(0);
      }, t.loadBundle = function (e, n) {
        cc.assetManager.loadBundle(e, function (e, o) {
          e ? console.log("bundle remote err", e) : (t._bundle = o, t.loadNext(n + 1));
        });
      }, t.sumProcess = function (t, e, n) {
        return (100 * n + 100 * t / e) / (100 * this._resList.length);
      }, t.dispatchProcessEvent = function (e, n, i) {
        var a = t.sumProcess(e, n, i);r.default.dispatchEvent(o.GlobalEvent.LOADING_PROCESS, a);
      }, t.loadAtlas = function (e, n, o) {
        void 0 === o && (o = !1), t.load(o, e, cc.SpriteAtlas, function (e, o) {
          t.dispatchProcessEvent(e, o, n);
        }, function () {
          t.loadNext(n + 1);
        });
      }, t.loadSounds = function (e, n, o) {
        void 0 === o && (o = !1), t.load(o, e, cc.AudioClip, function (e, o) {
          t.dispatchProcessEvent(e, o, n);
        }, function (o, r) {
          o ? console.log("err:", e, o) : (i.default.initSound(e, r), t.loadNext(n + 1));
        });
      }, t.loadConfig = function (e, n, o) {
        void 0 === o && (o = !1), t.load(o, e, cc.BufferAsset, null, function (e, o) {
          e || (s.default.ins.loadRequest(o._buffer), t.dispatchProcessEvent(1, 1, n), t.loadNext(n + 1));
        });
      }, t.loadPrefab = function (e, n, o) {
        void 0 === o && (o = !1), t.load(o, e, cc.Prefab, function (e, o) {
          t.dispatchProcessEvent(e, o, n);
        }, function (o, i) {
          i && (t._prefabs[e] = cc.instantiate(i)), t.loadNext(n + 1);
        });
      }, t.loadFinish = function (e) {
        t.dispatchProcessEvent(1, 1, e), t.loadNext(e + 1), r.default.dispatchEvent(o.InitStepEvent.LOAD_RES_FINISH);
      }, t.loadNext = function (e) {
        if (e < this._resList.length) {
          var n = this._resList[e];switch (n.type) {case o.LoadResType.BUNDLE:
              t.loadBundle(n.url, e);break;case o.LoadResType.ATLAS:
              t.loadAtlas(n.url, e, n.isBundle);break;case o.LoadResType.SOUND:
              t.loadSounds(n.url, e, n.isBundle);break;case o.LoadResType.CONFIG:
              t.loadConfig(n.url, e, n.isBundle);break;case o.LoadResType.LOAD_USER_DATA:
              a.default.loadUserData(), t.dispatchProcessEvent(1, 1, e), t.loadNext(e + 1);break;case o.LoadResType.PREFAB:
              t.loadPrefab(n.url, e, n.isBundle);break;case o.LoadResType.LOAD_FINISH:
              t.loadFinish(e);}
        } else r.default.dispatchEvent(o.GlobalEvent.LOADING_PROCESS, 1);
      }, Object.defineProperty(t, "bundle", { get: function get() {
          return this._bundle;
        }, enumerable: !1, configurable: !0 }), t.load = function (e, n, o, i, r) {
        e ? t.bundle.load(n, o, i, r) : cc.resources.load(n, o, i, r);
      }, t.loadSprite = function (e, n, o) {
        void 0 === o && (o = !1), t.load(o, n, cc.SpriteFrame, null, function (t, o) {
          t ? console.log("SpriteFrame", t, n) : e.node && (e.spriteFrame = o);
        });
      }, t._prefabs = {}, t._resList = [], t;
    }();n.default = u, cc._RF.pop();
  }, { "../Config/ConfigManager": "ConfigManager", "../Core/GameType": "GameType", "../Sdks/GameSDK": "GameSDK", "./GlobalEventManager": "GlobalEventManager", "./MusicManager": "MusicManager" }], LoadingPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "fbabaJvbt9D6qlYSxNE7DNp", "LoadingPanel");var _o46,
        i = this && this.__extends || (_o46 = function o(t, e) {
      return (_o46 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o46(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/GlobalEventManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/Manager/GameInitManager"),
        f = cc._decorator,
        d = f.ccclass,
        h = (f.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.onStart = function () {
        this.load = s.default.getNode(this.node, "load"), this.progressBar = s.default.getComponent(cc.ProgressBar, this.node, "load/progressBar"), this.lb_num = s.default.getComponent(cc.Label, this.node, "load/txt_load/lb_num"), this.load.active = !1, c.default.on(l.GlobalEvent.LOADING_PROCESS, this.progressHandler, this), c.default.on(l.InitStepEvent.LOGIN_FINISH, this.onLoginFinishHandler, this), u.default.init();
      }, e.prototype.onShow = function () {
        this.load.y = -this.node.height / 4;
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.progressBar = null, this.bg = null;
      }, e.prototype.progressHandler = function (t) {
        var e = t[0];this.progressBar.progress = e, this.lb_num.string = Math.floor(100 * e) + "%";
      }, e.prototype.onLoginFinishHandler = function () {
        this.load.active = !0;
      }, r([d], e);
    }(a.default));n.default = h, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/GameInitManager": "GameInitManager", "../../Common/Manager/GlobalEventManager": "GlobalEventManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil" }], Logger: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "07ae9Nt4/lJYbXSMnzWrqkt", "Logger");var o = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }var o = Array(t),
          i = 0;for (e = 0; e < n; e++) {
        for (var r = arguments[e], a = 0, s = r.length; a < s; a++, i++) {
          o[i] = r[a];
        }
      }return o;
    };Object.defineProperty(n, "__esModule", { value: !0 });var i = t("./SysConfig"),
        r = function () {
      function t() {}return t.log = function (t) {
        for (var e = [], n = 1; n < arguments.length; n++) {
          e[n - 1] = arguments[n];
        }i.default.DEBUG && console.log.apply(console, o([t], e));
      }, t.debug = function (t) {
        for (var e = [], n = 1; n < arguments.length; n++) {
          e[n - 1] = arguments[n];
        }i.default.DEBUG && console.debug.apply(console, o([t], e));
      }, t.warn = function (t) {
        for (var e = [], n = 1; n < arguments.length; n++) {
          e[n - 1] = arguments[n];
        }i.default.DEBUG && console.warn.apply(console, o([t], e));
      }, t.info = function (t) {
        for (var e = [], n = 1; n < arguments.length; n++) {
          e[n - 1] = arguments[n];
        }i.default.DEBUG && console.info.apply(console, o([t], e));
      }, t.error = function (t) {
        for (var e = [], n = 1; n < arguments.length; n++) {
          e[n - 1] = arguments[n];
        }i.default.DEBUG && console.error.apply(console, o([t], e));
      }, t;
    }();n.default = r, cc._RF.pop();
  }, { "./SysConfig": "SysConfig" }], LotteryAddrPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "1da54g/gBdC5pWz8lUB1YeO", "LotteryAddrPanel");var _o47,
        i = this && this.__extends || (_o47 = function o(t, e) {
      return (_o47 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o47(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Sdks/GameSDK"),
        d = t("./LotteryConfirm"),
        h = t("../Info/AddrInfo"),
        p = cc._decorator,
        _ = p.ccclass,
        m = (p.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubPopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_ok = s.default.getComponent(cc.Button, this.node, "frame/btn_ok"), this.btn_ok.node.on(cc.Node.EventType.TOUCH_END, this.onTouchOkHandler, this), this.edx_name = s.default.getComponent(cc.EditBox, this.node, "frame/edx_name"), this.edx_qq = s.default.getComponent(cc.EditBox, this.node, "frame/edx_qq"), this.edx_tel = s.default.getComponent(cc.EditBox, this.node, "frame/edx_tel"), this.edx_addr = s.default.getComponent(cc.EditBox, this.node, "frame/edx_addr");
      }, e.prototype.onShow = function () {
        this.refresh();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_ok.node.targetOff(this);
      }, e.prototype.refresh = function () {
        null != h.default.ins.name && (this.edx_name.string = h.default.ins.name), null != h.default.ins.qq && (this.edx_qq.string = h.default.ins.qq), null != h.default.ins.tel && (this.edx_tel.string = h.default.ins.tel), null != h.default.ins.addr && (this.edx_addr.string = h.default.ins.addr);
      }, e.prototype.onTouchOkHandler = function () {
        c.default.playEffect(c.default.CLICK);var t = this.edx_name.string,
            e = this.edx_qq.string,
            n = this.edx_tel.string,
            o = this.edx_addr.string;"" != t && "" != e && "" != n && "" != o ? (h.default.ins.setAddrInfo(t, e, n, o), u.default.show(d.default, { spId: this.data.spId, name: t, qq: e, tel: n, addr: o })) : f.default.showToast("\u8BF7\u586B\u5199\u6B63\u786E\u7684\u6536\u8D27\u4EBA\u4FE1\u606F\uFF0C\u5426\u5219\u65E0\u6CD5\u6536\u5230\u7269\u54C1");
      }, r([_], e);
    }(a.default));n.default = m, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Info/AddrInfo": "AddrInfo", "./LotteryConfirm": "LotteryConfirm" }], LotteryConfirm: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "b89e6s0gghEjJZPqsFV56xx", "LotteryConfirm");var _o48,
        i = this && this.__extends || (_o48 = function o(t, e) {
      return (_o48 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o48(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Manager/CommandController"),
        d = t("./ItemMessage1"),
        h = t("./LotteryAddrPanel"),
        p = cc._decorator,
        _ = p.ccclass,
        m = (p.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubWindowLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_ok = s.default.getComponent(cc.Button, this.node, "frame/btn_ok"), this.btn_ok.node.on(cc.Node.EventType.TOUCH_END, this.onTouchOkHandler, this);
      }, e.prototype.onShow = function () {
        this.refresh();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this), this.btn_ok.node.targetOff(this);
      }, e.prototype.refresh = function () {}, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, e.prototype.onTouchOkHandler = function () {
        c.default.playEffect(c.default.CLICK);var t = this;f.default.lotteryEnd(function (e) {
          u.default.close(t), u.default.close(h.default), null != e.id && u.default.show(d.default, { spId: this.data.spId });
        }, this, this.data.name, this.data.qq, this.data.tel, this.data.addr);
      }, r([_], e);
    }(a.default));n.default = m, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Manager/CommandController": "CommandController", "./ItemMessage1": "ItemMessage1", "./LotteryAddrPanel": "LotteryAddrPanel" }], LotteryItemMessage: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "9e233awhQ1NdKC9r3iKfLb7", "LotteryItemMessage");var _o49,
        i = this && this.__extends || (_o49 = function o(t, e) {
      return (_o49 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o49(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Manager/LoadResManager"),
        d = t("../../Common/Util/StringUtil"),
        h = t("./LotteryAddrPanel"),
        p = cc._decorator,
        _ = p.ccclass,
        m = (p.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubWindowLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_q = s.default.getComponent(cc.Button, this.node, "frame/btn_q"), this.btn_q.node.on(cc.Node.EventType.TOUCH_END, this.onTouchQHandler, this), this.sp_item = s.default.getComponent(cc.Sprite, this.node, "frame/sp_item"), this.lb_desc2 = s.default.getComponent(cc.Label, this.node, "frame/Sprite/lb_desc2"), this.spTxt = s.default.getComponent(cc.Sprite, this.node, "frame/btn_q/Background/sp_txt");
      }, e.prototype.onShow = function () {
        this.refresh();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_q.node.targetOff(this);
      }, e.prototype.refresh = function () {
        this.sp_item && (f.default.loadSprite(this.sp_item, "Atlas/atlas_item/" + this.data.lotteryItem.icon), this.lb_desc2.string = d.default.replaceNewLine(this.data.lotteryItem.desc));
      }, e.prototype.onTouchQHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this), u.default.show(h.default, { lotteryItem: this.data.lotteryItem });
      }, r([_], e);
    }(a.default));n.default = m, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../../Common/Util/StringUtil": "StringUtil", "./LotteryAddrPanel": "LotteryAddrPanel" }], LotteryPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "7992aCK1i5DJbOMEwFYAH4E", "LotteryPanel");var _o50,
        i = this && this.__extends || (_o50 = function o(t, e) {
      return (_o50 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o50(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("./UILottery"),
        d = t("./UIExchange"),
        h = t("../../Common/Manager/LoadResManager"),
        p = t("../Manager/CommandController"),
        _ = t("../../Common/Manager/GlobalEventManager"),
        m = t("./ItemMessage"),
        g = t("../Config/BaseConfig"),
        y = t("../../Common/Sdks/GameSDK"),
        b = t("../../Common/Sdks/UmaTrackHelper"),
        C = t("./MyExchangePanel"),
        v = t("./LotteryAddrPanel"),
        I = t("../Config/ProductConfig"),
        M = t("../../Common/Manager/Logger"),
        P = t("../Info/PlayerInfo"),
        S = t("../Main/item/ProInfoCtr"),
        T = cc._decorator,
        U = T.ccclass,
        O = (T.property, function (t) {
      function e() {
        var e = null !== t && t.apply(this, arguments) || this;return e._lotteryType = 0, e._lotteryCount = 0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.bg = s.default.getComponent(cc.Sprite, this.node, "bg"), this.btn_close = s.default.getComponent(cc.Button, this.node, "frame1/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.frame2 = s.default.getNode(this.node, "frame2"), this.frame3 = s.default.getNode(this.node, "frame3"), this.frame3_bg = s.default.getNode(this.node, "frame3/frame3_bg"), this.proInfo = s.default.getNode(this.node, "proInfo"), this.proInfoCtr = new S.default(this.proInfo), this.lb_gift = s.default.getComponent(cc.Label, this.node, "frame2/lb_gift"), this.lottery_list = s.default.getNode(this.node, "frame2/lottery_node/lottery_list"), this.btn_start = s.default.getComponent(cc.Button, this.node, "frame2/lottery_node/btn_start"), this.btn_start.node.on(cc.Node.EventType.TOUCH_END, this.onTouchLotteryStartHandler, this), this.lb_lottery_gift = s.default.getComponent(cc.Label, this.node, "frame2/lottery_node/btn_start/Background/lb_lottery_gift"), this.btn_lottery1 = s.default.getComponent(cc.Button, this.node, "frame2/btn_lottery1"), this.btn_lottery1.node.on(cc.Node.EventType.TOUCH_END, this.onTouchLottery1tHandler, this), this.btn_lottery2 = s.default.getComponent(cc.Button, this.node, "frame2/btn_lottery2"), this.btn_lottery2.node.on(cc.Node.EventType.TOUCH_END, this.onTouchLottery2tHandler, this), this.lb_url = s.default.getComponent(cc.Label, this.node, "frame3/lb_url"), this.lb_url.node.on(cc.Node.EventType.TOUCH_END, this.onTouchUrlHandler, this), this.exchange_list = s.default.getComponent(cc.ScrollView, this.node, "frame3/exchange_list"), this.UIExchange = s.default.getNode(this.node, "frame3/UIExchange"), this._blockNode = s.default.getNode(this.node, "blockNode"), this._blockNode.active = !1, this.lottery_node = s.default.getNode(this.node, "frame2/lottery_node"), this.lottery_node1 = s.default.getNode(this.node, "frame2/lottery_node1"), this.btn_start_sprite = s.default.getComponent(cc.Sprite, this.node, "frame2/lottery_node/btn_start/Background"), this.quan_count = s.default.getComponent(cc.Sprite, this.node, "frame2/lottery_node/btn_start/Background/quan10"), _.default.on(l.InfoEvent.GIFT_CHANGE, this.onGiftChangeHandler, this), h.default.loadSprite(this.bg, "Texture/gift_bg", !0);var t = cc.view.getVisibleSize();this.exchange_list.node.height = this.exchange_list.node.height + (t.height - cc.view.getDesignResolutionSize().height), this.frame3_bg.height = this.exchange_list.node.height + 7;
      }, e.prototype.onShow = function () {
        y.default.hideBannerAd(), this.refresh(), b.default.trackEvent("1201"), this.proInfoCtr.onShow();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this), this.btn_start.node.targetOff(this), this.btn_lottery1.node.targetOff(this), this.btn_lottery2.node.targetOff(this), this.lb_url.node.targetOff(this), _.default.off(l.InfoEvent.GIFT_CHANGE, this.onGiftChangeHandler, this), this._list = null;
      }, e.prototype.onGiftChangeHandler = function () {
        this.lb_gift.string = "\u6211\u7684\u5956\u5238\uFF1A" + P.default.ins.giftCoupon.toString();
      }, e.prototype.refresh = function () {
        this.onGiftChangeHandler(null);var t = this;p.default.getLotteryInfo(function (e) {
          t._lotteryList1 = e.l1, t._lotteryList2 = e.l2, t._exchangeList = e.el, t.refreshLottery(1), t.refreshExchangeList();
        }, this);
      }, e.prototype.refreshLottery = function (t) {
        var e;this._list = [], this._lotteryType = t, e = 1 == t ? this._lotteryList2 : this._lotteryList1;for (var n = 0; n < this.lottery_list.childrenCount; n++) {
          var o = this.lottery_list.children[n].getComponent(f.default);o.id = e[n].id, o.productData = I.default.ins.getItem(e[n].spId), this._list.push(o);
        }var i = s.default.getComponent(cc.Sprite, this.btn_lottery1.node, "Background"),
            r = s.default.getComponent(cc.Sprite, i.node, "sp_text"),
            a = s.default.getComponent(cc.Sprite, this.btn_lottery2.node, "Background"),
            c = s.default.getComponent(cc.Sprite, a.node, "sp_text");1 == t ? (h.default.loadSprite(i, "Atlas/atlas_lottery/gift_text_bg"), h.default.loadSprite(r, "Atlas/atlas_lottery/gift_text_cjjc"), h.default.loadSprite(a, "Atlas/atlas_lottery/gift_text_bg_sel"), h.default.loadSprite(c, "Atlas/atlas_lottery/gift_text_ptjc_sel"), this.lb_lottery_gift.string = g.default.ins.getLottery2() + "\u5956\u5238/\u6B21") : (h.default.loadSprite(i, "Atlas/atlas_lottery/gift_text_bg_sel"), h.default.loadSprite(r, "Atlas/atlas_lottery/gift_text_cjjc_sel"), h.default.loadSprite(a, "Atlas/atlas_lottery/gift_text_bg"), h.default.loadSprite(c, "Atlas/atlas_lottery/gift_text_ptjc"), this.lb_lottery_gift.string = g.default.ins.getLottery1() + "\u5956\u5238/\u6B21"), this.resetLotteryList();
      }, e.prototype.refreshExchangeList = function () {
        this.exchange_list.content.removeAllChildren(!0);for (var t = 0; t < this._exchangeList.length; t++) {
          var e = cc.instantiate(this.UIExchange).getComponent(d.default);e.exchange = this._exchangeList[t], e.useCount = this._exchangeList[t].num, e.node.active = !0, this.exchange_list.content.addChild(e.node);
        }this.exchange_list.scrollToTop(0);
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, e.prototype.onTouchLotteryStartHandler = function () {
        c.default.playEffect(c.default.CLICK);var t = g.default.ins.getLotteryGiftCount(this._lotteryType);if (P.default.ins.giftCoupon < t) y.default.showToast("\u5956\u5238\u4E0D\u8DB3");else {
          this.resetLotteryList();var e = this;p.default.lotteryStart(this._lotteryType, function (t) {
            var n = t.id;P.default.ins.giftCoupon = t.gfc;for (var o = -1, i = 0; i < e._list.length; i++) {
              e._list[i].id == n && (o = i);
            }e._lotteryCount = 2 * e._list.length + o, e.runNextLotteryData(0), e._blockNode.active = !0;
          }, this), 1 == this._lotteryType ? b.default.trackEvent("1204") : b.default.trackEvent("1202");
        }
      }, e.prototype.onTouchLottery1tHandler = function () {
        c.default.playEffect(c.default.CLICK), this.refreshLottery(0), h.default.loadSprite(this.btn_start_sprite, "Atlas/atlas_lottery/gift_btn_cj"), h.default.loadSprite(this.quan_count, "Atlas/atlas_lottery/quan10");
      }, e.prototype.onTouchLottery2tHandler = function () {
        c.default.playEffect(c.default.CLICK), this.refreshLottery(1), h.default.loadSprite(this.btn_start_sprite, "Atlas/atlas_lottery/gift_btn_cj1"), h.default.loadSprite(this.quan_count, "Atlas/atlas_lottery/quan25");
      }, e.prototype.onTouchUrlHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.show(C.default);
      }, e.prototype.runNextLotteryData = function (t) {
        var e = t % this._list.length,
            n = this._list[e],
            o = this;if (t == this._lotteryCount) {
          n.sp_select.node.active = !0, cc.tween(n).delay(.1).call(function (t) {
            t.sp_select.node.active = !1;
          }).delay(.1).call(function (t) {
            t.sp_select.node.active = !0;
          }).union().repeat(5).start();var i = this._list[e].productData;101 != i.id && (M.default.log(i), 2 == i.type ? u.default.show(v.default, { spId: i.id }) : p.default.lotteryEnd(function () {
            u.default.show(m.default, { spId: i.id });
          }, this)), o._blockNode.active = !1;
        } else {
          n.sp_select.node.active = !0;var r = .01 + .01 * t;cc.tween(n).delay(r).call(function (t) {
            t.sp_select.node.active = !1;
          }).delay(r).call(function () {
            o.runNextLotteryData(t + 1);
          }).union().start();
        }
      }, e.prototype.resetLotteryList = function () {
        for (var t = 0; t < this._list.length; t++) {
          this._list[t].sp_select.node.active = 0 == t;
        }
      }, r([U], e);
    }(a.default));n.default = O, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/GlobalEventManager": "GlobalEventManager", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/BaseConfig": "BaseConfig", "../Config/ProductConfig": "ProductConfig", "../Info/PlayerInfo": "PlayerInfo", "../Main/item/ProInfoCtr": "ProInfoCtr", "../Manager/CommandController": "CommandController", "./ItemMessage": "ItemMessage", "./LotteryAddrPanel": "LotteryAddrPanel", "./MyExchangePanel": "MyExchangePanel", "./UIExchange": "UIExchange", "./UILottery": "UILottery" }], MD5: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "a85dcjCtLBE/ZU5IsL5pxcn", "MD5"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t() {
        this.hexcase = 0, this.b64pad = "";
      }return t.hex_md5 = function (e) {
        return new t().hex_md5(e);
      }, t.prototype.hex_md5 = function (t) {
        return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(t)));
      }, t.prototype.b64_md5 = function (t) {
        return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(t)));
      }, t.prototype.any_md5 = function (t, e) {
        return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(t)), e);
      }, t.prototype.hex_hmac_md5 = function (t, e) {
        return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(t), this.str2rstr_utf8(e)));
      }, t.prototype.b64_hmac_md5 = function (t, e) {
        return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(t), this.str2rstr_utf8(e)));
      }, t.prototype.any_hmac_md5 = function (t, e, n) {
        return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(t), this.str2rstr_utf8(e)), n);
      }, t.prototype.md5_vm_test = function () {
        return "900150983cd24fb0d6963f7d28e17f72" == this.hex_md5("abc").toLowerCase();
      }, t.prototype.rstr_md5 = function (t) {
        return this.binl2rstr(this.binl_md5(this.rstr2binl(t), 8 * t.length));
      }, t.prototype.rstr_hmac_md5 = function (t, e) {
        var n = this.rstr2binl(t);n.length > 16 && (n = this.binl_md5(n, 8 * t.length));for (var o = Array(16), i = Array(16), r = 0; r < 16; r++) {
          o[r] = 909522486 ^ n[r], i[r] = 1549556828 ^ n[r];
        }var a = this.binl_md5(o.concat(this.rstr2binl(e)), 512 + 8 * e.length);return this.binl2rstr(this.binl_md5(i.concat(a), 640));
      }, t.prototype.rstr2hex = function (t) {
        try {
          this.hexcase;
        } catch (r) {
          this.hexcase = 0;
        }for (var e, n = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef", o = "", i = 0; i < t.length; i++) {
          e = t.charCodeAt(i), o += n.charAt(e >>> 4 & 15) + n.charAt(15 & e);
        }return o;
      }, t.prototype.rstr2b64 = function (t) {
        try {
          this.b64pad;
        } catch (a) {
          this.b64pad = "";
        }for (var e = "", n = t.length, o = 0; o < n; o += 3) {
          for (var i = t.charCodeAt(o) << 16 | (o + 1 < n ? t.charCodeAt(o + 1) << 8 : 0) | (o + 2 < n ? t.charCodeAt(o + 2) : 0), r = 0; r < 4; r++) {
            8 * o + 6 * r > 8 * t.length ? e += this.b64pad : e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(i >>> 6 * (3 - r) & 63);
          }
        }return e;
      }, t.prototype.rstr2any = function (t, e) {
        var n,
            o,
            i,
            r,
            a,
            s = e.length,
            c = Array(Math.ceil(t.length / 2));for (n = 0; n < c.length; n++) {
          c[n] = t.charCodeAt(2 * n) << 8 | t.charCodeAt(2 * n + 1);
        }var l = Math.ceil(8 * t.length / (Math.log(e.length) / Math.log(2))),
            u = Array(l);for (o = 0; o < l; o++) {
          for (a = Array(), r = 0, n = 0; n < c.length; n++) {
            r = (r << 16) + c[n], r -= (i = Math.floor(r / s)) * s, (a.length > 0 || i > 0) && (a[a.length] = i);
          }u[o] = r, c = a;
        }var f = "";for (n = u.length - 1; n >= 0; n--) {
          f += e.charAt(u[n]);
        }return f;
      }, t.prototype.str2rstr_utf8 = function (t) {
        for (var e, n, o = "", i = -1; ++i < t.length;) {
          e = t.charCodeAt(i), n = i + 1 < t.length ? t.charCodeAt(i + 1) : 0, 55296 <= e && e <= 56319 && 56320 <= n && n <= 57343 && (e = 65536 + ((1023 & e) << 10) + (1023 & n), i++), e <= 127 ? o += String.fromCharCode(e) : e <= 2047 ? o += String.fromCharCode(192 | e >>> 6 & 31, 128 | 63 & e) : e <= 65535 ? o += String.fromCharCode(224 | e >>> 12 & 15, 128 | e >>> 6 & 63, 128 | 63 & e) : e <= 2097151 && (o += String.fromCharCode(240 | e >>> 18 & 7, 128 | e >>> 12 & 63, 128 | e >>> 6 & 63, 128 | 63 & e));
        }return o;
      }, t.prototype.str2rstr_utf16le = function (t) {
        for (var e = "", n = 0; n < t.length; n++) {
          e += String.fromCharCode(255 & t.charCodeAt(n), t.charCodeAt(n) >>> 8 & 255);
        }return e;
      }, t.prototype.str2rstr_utf16be = function (t) {
        for (var e = "", n = 0; n < t.length; n++) {
          e += String.fromCharCode(t.charCodeAt(n) >>> 8 & 255, 255 & t.charCodeAt(n));
        }return e;
      }, t.prototype.rstr2binl = function (t) {
        for (var e = Array(t.length >> 2), n = 0; n < e.length; n++) {
          e[n] = 0;
        }for (n = 0; n < 8 * t.length; n += 8) {
          e[n >> 5] |= (255 & t.charCodeAt(n / 8)) << n % 32;
        }return e;
      }, t.prototype.binl2rstr = function (t) {
        for (var e = "", n = 0; n < 32 * t.length; n += 8) {
          e += String.fromCharCode(t[n >> 5] >>> n % 32 & 255);
        }return e;
      }, t.prototype.binl_md5 = function (t, e) {
        t[e >> 5] |= 128 << e % 32, t[14 + (e + 64 >>> 9 << 4)] = e;for (var n = 1732584193, o = -271733879, i = -1732584194, r = 271733878, a = 0; a < t.length; a += 16) {
          var s = n,
              c = o,
              l = i,
              u = r;n = this.md5_ff(n, o, i, r, t[a + 0], 7, -680876936), r = this.md5_ff(r, n, o, i, t[a + 1], 12, -389564586), i = this.md5_ff(i, r, n, o, t[a + 2], 17, 606105819), o = this.md5_ff(o, i, r, n, t[a + 3], 22, -1044525330), n = this.md5_ff(n, o, i, r, t[a + 4], 7, -176418897), r = this.md5_ff(r, n, o, i, t[a + 5], 12, 1200080426), i = this.md5_ff(i, r, n, o, t[a + 6], 17, -1473231341), o = this.md5_ff(o, i, r, n, t[a + 7], 22, -45705983), n = this.md5_ff(n, o, i, r, t[a + 8], 7, 1770035416), r = this.md5_ff(r, n, o, i, t[a + 9], 12, -1958414417), i = this.md5_ff(i, r, n, o, t[a + 10], 17, -42063), o = this.md5_ff(o, i, r, n, t[a + 11], 22, -1990404162), n = this.md5_ff(n, o, i, r, t[a + 12], 7, 1804603682), r = this.md5_ff(r, n, o, i, t[a + 13], 12, -40341101), i = this.md5_ff(i, r, n, o, t[a + 14], 17, -1502002290), o = this.md5_ff(o, i, r, n, t[a + 15], 22, 1236535329), n = this.md5_gg(n, o, i, r, t[a + 1], 5, -165796510), r = this.md5_gg(r, n, o, i, t[a + 6], 9, -1069501632), i = this.md5_gg(i, r, n, o, t[a + 11], 14, 643717713), o = this.md5_gg(o, i, r, n, t[a + 0], 20, -373897302), n = this.md5_gg(n, o, i, r, t[a + 5], 5, -701558691), r = this.md5_gg(r, n, o, i, t[a + 10], 9, 38016083), i = this.md5_gg(i, r, n, o, t[a + 15], 14, -660478335), o = this.md5_gg(o, i, r, n, t[a + 4], 20, -405537848), n = this.md5_gg(n, o, i, r, t[a + 9], 5, 568446438), r = this.md5_gg(r, n, o, i, t[a + 14], 9, -1019803690), i = this.md5_gg(i, r, n, o, t[a + 3], 14, -187363961), o = this.md5_gg(o, i, r, n, t[a + 8], 20, 1163531501), n = this.md5_gg(n, o, i, r, t[a + 13], 5, -1444681467), r = this.md5_gg(r, n, o, i, t[a + 2], 9, -51403784), i = this.md5_gg(i, r, n, o, t[a + 7], 14, 1735328473), o = this.md5_gg(o, i, r, n, t[a + 12], 20, -1926607734), n = this.md5_hh(n, o, i, r, t[a + 5], 4, -378558), r = this.md5_hh(r, n, o, i, t[a + 8], 11, -2022574463), i = this.md5_hh(i, r, n, o, t[a + 11], 16, 1839030562), o = this.md5_hh(o, i, r, n, t[a + 14], 23, -35309556), n = this.md5_hh(n, o, i, r, t[a + 1], 4, -1530992060), r = this.md5_hh(r, n, o, i, t[a + 4], 11, 1272893353), i = this.md5_hh(i, r, n, o, t[a + 7], 16, -155497632), o = this.md5_hh(o, i, r, n, t[a + 10], 23, -1094730640), n = this.md5_hh(n, o, i, r, t[a + 13], 4, 681279174), r = this.md5_hh(r, n, o, i, t[a + 0], 11, -358537222), i = this.md5_hh(i, r, n, o, t[a + 3], 16, -722521979), o = this.md5_hh(o, i, r, n, t[a + 6], 23, 76029189), n = this.md5_hh(n, o, i, r, t[a + 9], 4, -640364487), r = this.md5_hh(r, n, o, i, t[a + 12], 11, -421815835), i = this.md5_hh(i, r, n, o, t[a + 15], 16, 530742520), o = this.md5_hh(o, i, r, n, t[a + 2], 23, -995338651), n = this.md5_ii(n, o, i, r, t[a + 0], 6, -198630844), r = this.md5_ii(r, n, o, i, t[a + 7], 10, 1126891415), i = this.md5_ii(i, r, n, o, t[a + 14], 15, -1416354905), o = this.md5_ii(o, i, r, n, t[a + 5], 21, -57434055), n = this.md5_ii(n, o, i, r, t[a + 12], 6, 1700485571), r = this.md5_ii(r, n, o, i, t[a + 3], 10, -1894986606), i = this.md5_ii(i, r, n, o, t[a + 10], 15, -1051523), o = this.md5_ii(o, i, r, n, t[a + 1], 21, -2054922799), n = this.md5_ii(n, o, i, r, t[a + 8], 6, 1873313359), r = this.md5_ii(r, n, o, i, t[a + 15], 10, -30611744), i = this.md5_ii(i, r, n, o, t[a + 6], 15, -1560198380), o = this.md5_ii(o, i, r, n, t[a + 13], 21, 1309151649), n = this.md5_ii(n, o, i, r, t[a + 4], 6, -145523070), r = this.md5_ii(r, n, o, i, t[a + 11], 10, -1120210379), i = this.md5_ii(i, r, n, o, t[a + 2], 15, 718787259), o = this.md5_ii(o, i, r, n, t[a + 9], 21, -343485551), n = this.safe_add(n, s), o = this.safe_add(o, c), i = this.safe_add(i, l), r = this.safe_add(r, u);
        }return [n, o, i, r];
      }, t.prototype.md5_cmn = function (t, e, n, o, i, r) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(e, t), this.safe_add(o, r)), i), n);
      }, t.prototype.md5_ff = function (t, e, n, o, i, r, a) {
        return this.md5_cmn(e & n | ~e & o, t, e, i, r, a);
      }, t.prototype.md5_gg = function (t, e, n, o, i, r, a) {
        return this.md5_cmn(e & o | n & ~o, t, e, i, r, a);
      }, t.prototype.md5_hh = function (t, e, n, o, i, r, a) {
        return this.md5_cmn(e ^ n ^ o, t, e, i, r, a);
      }, t.prototype.md5_ii = function (t, e, n, o, i, r, a) {
        return this.md5_cmn(n ^ (e | ~o), t, e, i, r, a);
      }, t.prototype.safe_add = function (t, e) {
        var n = (65535 & t) + (65535 & e);return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n;
      }, t.prototype.bit_rol = function (t, e) {
        return t << e | t >>> 32 - e;
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], MTween: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "3f71eKKJNRP258JyKEC9dS3", "MTween"), Object.defineProperty(n, "__esModule", { value: !0 }), n.MEase = void 0;var o = t("./CallBackUtils"),
        i = function () {
      function t() {}return t.linearNone = function (t, e, n, o) {
        return n * t / o + e;
      }, t.linearIn = function (t, e, n, o) {
        return n * t / o + e;
      }, t.linearInOut = function (t, e, n, o) {
        return n * t / o + e;
      }, t.linearOut = function (t, e, n, o) {
        return n * t / o + e;
      }, t.bounceIn = function (e, n, o, i) {
        return o - t.bounceOut(i - e, 0, o, i) + n;
      }, t.bounceInOut = function (e, n, o, i) {
        return e < .5 * i ? .5 * t.bounceIn(2 * e, 0, o, i) + n : .5 * t.bounceOut(2 * e - i, 0, o, i) + .5 * o + n;
      }, t.bounceOut = function (t, e, n, o) {
        return (t /= o) < 1 / 2.75 ? 7.5625 * n * t * t + e : t < 2 / 2.75 ? n * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : t < 2.5 / 2.75 ? n * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : n * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e;
      }, t.backIn = function (t, e, n, o, i) {
        return void 0 === i && (i = 1.70158), n * (t /= o) * t * ((i + 1) * t - i) + e;
      }, t.backInOut = function (t, e, n, o, i) {
        return void 0 === i && (i = 1.70158), (t /= .5 * o) < 1 ? .5 * n * t * t * ((1 + (i *= 1.525)) * t - i) + e : n / 2 * ((t -= 2) * t * ((1 + (i *= 1.525)) * t + i) + 2) + e;
      }, t.backOut = function (t, e, n, o, i) {
        return void 0 === i && (i = 1.70158), n * ((t = t / o - 1) * t * ((i + 1) * t + i) + 1) + e;
      }, t.elasticIn = function (e, n, o, i, r, a) {
        var s;return void 0 === r && (r = 0), void 0 === a && (a = 0), 0 == e ? n : 1 == (e /= i) ? n + o : (a || (a = .3 * i), !r || o > 0 && r < o || o < 0 && r < -o ? (r = o, s = a / 4) : s = a / t.PI2 * Math.asin(o / r), -r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * i - s) * t.PI2 / a) + n);
      }, t.elasticInOut = function (e, n, o, i, r, a) {
        var s;return void 0 === r && (r = 0), void 0 === a && (a = 0), 0 == e ? n : 2 == (e /= .5 * i) ? n + o : (a || (a = .3 * 1.5 * i), !r || o > 0 && r < o || o < 0 && r < -o ? (r = o, s = a / 4) : s = a / t.PI2 * Math.asin(o / r), e < 1 ? r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * i - s) * t.PI2 / a) * -.5 + n : r * Math.pow(2, -10 * (e -= 1)) * Math.sin((e * i - s) * t.PI2 / a) * .5 + o + n);
      }, t.elasticOut = function (e, n, o, i, r, a) {
        var s;return void 0 === r && (r = 0), void 0 === a && (a = 0), 0 == e ? n : 1 == (e /= i) ? n + o : (a || (a = .3 * i), !r || o > 0 && r < o || o < 0 && r < -o ? (r = o, s = a / 4) : s = a / t.PI2 * Math.asin(o / r), r * Math.pow(2, -10 * e) * Math.sin((e * i - s) * t.PI2 / a) + o + n);
      }, t.strongIn = function (t, e, n, o) {
        return n * (t /= o) * t * t * t * t + e;
      }, t.strongInOut = function (t, e, n, o) {
        return (t /= .5 * o) < 1 ? .5 * n * t * t * t * t * t + e : .5 * n * ((t -= 2) * t * t * t * t + 2) + e;
      }, t.strongOut = function (t, e, n, o) {
        return n * ((t = t / o - 1) * t * t * t * t + 1) + e;
      }, t.sineInOut = function (t, e, n, o) {
        return .5 * -n * (Math.cos(Math.PI * t / o) - 1) + e;
      }, t.sineIn = function (e, n, o, i) {
        return -o * Math.cos(e / i * t.HALF_PI) + o + n;
      }, t.sineOut = function (e, n, o, i) {
        return o * Math.sin(e / i * t.HALF_PI) + n;
      }, t.quintIn = function (t, e, n, o) {
        return n * (t /= o) * t * t * t * t + e;
      }, t.quintInOut = function (t, e, n, o) {
        return (t /= .5 * o) < 1 ? .5 * n * t * t * t * t * t + e : .5 * n * ((t -= 2) * t * t * t * t + 2) + e;
      }, t.quintOut = function (t, e, n, o) {
        return n * ((t = t / o - 1) * t * t * t * t + 1) + e;
      }, t.quartIn = function (t, e, n, o) {
        return n * (t /= o) * t * t * t + e;
      }, t.quartInOut = function (t, e, n, o) {
        return (t /= .5 * o) < 1 ? .5 * n * t * t * t * t + e : .5 * -n * ((t -= 2) * t * t * t - 2) + e;
      }, t.quartOut = function (t, e, n, o) {
        return -n * ((t = t / o - 1) * t * t * t - 1) + e;
      }, t.cubicIn = function (t, e, n, o) {
        return n * (t /= o) * t * t + e;
      }, t.cubicInOut = function (t, e, n, o) {
        return (t /= .5 * o) < 1 ? .5 * n * t * t * t + e : .5 * n * ((t -= 2) * t * t + 2) + e;
      }, t.cubicOut = function (t, e, n, o) {
        return n * ((t = t / o - 1) * t * t + 1) + e;
      }, t.quadIn = function (t, e, n, o) {
        return n * (t /= o) * t + e;
      }, t.quadInOut = function (t, e, n, o) {
        return (t /= .5 * o) < 1 ? .5 * n * t * t + e : .5 * -n * (--t * (t - 2) - 1) + e;
      }, t.quadOut = function (t, e, n, o) {
        return -n * (t /= o) * (t - 2) + e;
      }, t.expoIn = function (t, e, n, o) {
        return 0 == t ? e : n * Math.pow(2, 10 * (t / o - 1)) + e - .001 * n;
      }, t.expoInOut = function (t, e, n, o) {
        return 0 == t ? e : t == o ? e + n : (t /= .5 * o) < 1 ? .5 * n * Math.pow(2, 10 * (t - 1)) + e : .5 * n * (2 - Math.pow(2, -10 * --t)) + e;
      }, t.expoOut = function (t, e, n, o) {
        return t == o ? e + n : n * (1 - Math.pow(2, -10 * t / o)) + e;
      }, t.circIn = function (t, e, n, o) {
        return -n * (Math.sqrt(1 - (t /= o) * t) - 1) + e;
      }, t.circInOut = function (t, e, n, o) {
        return (t /= .5 * o) < 1 ? .5 * -n * (Math.sqrt(1 - t * t) - 1) + e : .5 * n * (Math.sqrt(1 - (t -= 2) * t) + 1) + e;
      }, t.circOut = function (t, e, n, o) {
        return n * Math.sqrt(1 - (t = t / o - 1) * t) + e;
      }, t.HALF_PI = .5 * Math.PI, t.PI2 = 2 * Math.PI, t;
    }();n.MEase = i;var r = function () {
      function t() {
        this.target = null, this.props = null, this.propsArr = null, this.duration = null, this.ease = null, this.callBack_complete = null, this.callBack_updateEase = null, this.delay = null, this.startTimer = null, this.callBack_complete = new o.default(null, null), this.callBack_updateEase = new o.default(null, null), this._stop = !1;
      }return t.easeNone = function (t, e, n, o) {
        return n * t / o + e;
      }, t.prototype.to = function (e, n, o, i, r, a, s, c) {
        void 0 === i && (i = null), void 0 === r && (r = null), void 0 === a && (a = null), void 0 === s && (s = 0), void 0 === c && (c = null), this.target = e, this.duration = o, this.ease = i || n.ease || t.easeNone, this.callBack_complete.setData(r, a), this.callBack_updateEase.setData(r, c), this.delay = s, this.props = n, this.propsArr = [], this.startTimer = Date.now(), this._stop = !1, this.firstStart();
      }, t.prototype.initProps = function () {
        for (var t in this.props) {
          if ("number" == typeof this.target[t]) {
            var e = this.target[t],
                n = this.props[t];this.propsArr.push([t, e, n - e]);
          }
        }
      }, t.prototype.firstStart = function () {
        this.initProps();
      }, t.prototype.stop = function () {
        this._stop = !0;
      }, t.prototype.update = function () {
        this.updateEase();
      }, t.prototype.updateEase = function () {
        if (!this._stop) {
          var t = Date.now() - this.startTimer - this.delay;if (!(t < 0)) if (t >= this.duration) {
            if (this._stop = !0, null != this.propsArr) for (var e = this.propsArr, n = 0, o = e.length; n < o; n++) {
              var i = e[n];this.target[i[0]] = this.props[i[0]];
            }this.callBack_complete.trigger();
          } else {
            var r = t > 0 ? this.ease(t, 0, 1, this.duration) : 0,
                a = this.propsArr;for (n = 0, o = a.length; n < o; n++) {
              i = a[n], this.target[i[0]] = i[1] + r * i[2];
            }this.callBack_updateEase.trigger(this.target);
          }
        }
      }, t.prototype.destroy = function () {
        this.target = null, this.duration = null, this.ease = null, this.callBack_complete.destroy(), this.callBack_complete = null, this.callBack_updateEase.destroy(), this.callBack_updateEase = null, this.delay = null, this.props = null, this.propsArr = null, this.startTimer = null;
      }, t;
    }();n.default = r, cc._RF.pop();
  }, { "./CallBackUtils": "CallBackUtils" }], MainPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "29080zEtL9P6a8L2XBSy3my", "MainPanel");var _o51,
        i = this && this.__extends || (_o51 = function o(t, e) {
      return (_o51 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o51(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Sdks/GameSDK"),
        u = t("../../Common/Manager/LoadResManager"),
        f = t("../../Common/UI/UIManager"),
        d = t("../Fb/FbPanel"),
        h = t("./RankPanel"),
        p = t("../Lottery/LotteryPanel"),
        _ = t("../../Common/Manager/SysConfig"),
        m = t("./FeedbackPanel"),
        g = t("./SubContextViewController"),
        y = t("./NoticePanel"),
        b = t("../../Common/Sdks/UmaTrackHelper"),
        C = t("../Fb/FbPkMatchPanel"),
        v = t("../Scene/GameScene"),
        I = t("../Info/SetInfo"),
        M = t("../../Common/Manager/Logger"),
        P = t("../Fb/FbPkInvitePanel"),
        S = t("./ShopPanel"),
        T = t("./AchievementPanel"),
        U = t("./SignPanel"),
        O = t("./item/ProInfoCtr"),
        w = t("../Dash/HeroActor"),
        E = t("../Config/RoleConfig"),
        k = t("../../Common/Manager/QueuePanelManager"),
        A = t("../Info/SignInfo"),
        R = t("../../Common/Manager/DataManager"),
        F = t("./UpgradePropConfirm"),
        L = t("../Info/ItemsInfo"),
        D = t("../Dash/MusicController"),
        N = t("../../Common/Manager/TimeManager"),
        x = cc._decorator,
        j = x.ccclass,
        G = (x.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.onStart = function () {
        this.sp_head = s.default.getNode(this.node, "sp_head"), this.sp_head.on(cc.Node.EventType.TOUCH_END, this.onTouchFeedbackHandler, this), this.icon_head = s.default.getComponent(cc.Sprite, this.node, "sp_head/mask/icon_head"), this.proInfo = s.default.getNode(this.node, "proInfo"), this.proInfoCtr = new O.default(this.proInfo), this.btn_music = s.default.getComponent(cc.Button, this.node, "frame/btn_music"), this.btn_music.node.on(cc.Node.EventType.TOUCH_END, this.onTouchMusicHandler, this), this.sp_music = s.default.getComponent(cc.Sprite, this.btn_music.node, "Background"), this.btn_lottery = s.default.getComponent(cc.Button, this.node, "frame/btn_lottery"), this.btn_lottery.node.on(cc.Node.EventType.TOUCH_END, this.onTouchLotteryHandler, this), this.btn_rank = s.default.getComponent(cc.Button, this.node, "frame/btn_rank"), this.btn_rank.node.on(cc.Node.EventType.TOUCH_END, this.onTouchRankHandler, this), this.btn_q = s.default.getComponent(cc.Button, this.node, "frame/btn_q"), this.btn_q.node.on(cc.Node.EventType.TOUCH_END, this.onTouchQHandler, this), this.btn_start = s.default.getComponent(cc.Button, this.node, "btn_start"), this.btn_start.node.on(cc.Node.EventType.TOUCH_END, this.onTouchStartHandler, this), this.btn_pk_friend = s.default.getComponent(cc.Button, this.node, "btn_pk_friend"), this.btn_pk_friend.node.on(cc.Node.EventType.TOUCH_END, this.onTouchPkFriendHandler, this), this.btn_pk_match = s.default.getComponent(cc.Button, this.node, "btn_pk_match"), this.btn_pk_match.node.on(cc.Node.EventType.TOUCH_END, this.onTouchPkMatchHandler, this), this.btn_sign = s.default.getComponent(cc.Button, this.node, "left/btn_sign"), this.btn_sign.node.on(cc.Node.EventType.TOUCH_END, this.onTouchSignHandler, this), this.btn_dj = s.default.getComponent(cc.Button, this.node, "left/btn_dj"), this.btn_dj.node.on(cc.Node.EventType.TOUCH_END, this.onTouchDJHandler, this), this.btn_xbz = s.default.getComponent(cc.Button, this.node, "left/btn_xbz"), this.btn_xbz.node.on(cc.Node.EventType.TOUCH_END, this.onTouchXBZHandler, this), this.btn_cj = s.default.getComponent(cc.Button, this.node, "left/btn_cj"), this.btn_cj.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCJHandler, this), this.btn_left = s.default.getNode(this.node, "role_change/btn_left"), this.btn_left.on(cc.Node.EventType.TOUCH_END, this.onTouchLeftHandler, this), this.btn_right = s.default.getNode(this.node, "role_change/btn_right"), this.btn_right.on(cc.Node.EventType.TOUCH_END, this.onTouchRightHandler, this), this.btn_openVip = s.default.getNode(this.node, "btn_openVip"), this.vip_fab = s.default.getNode(this.node, "vip_fab"), this.btn_openVip.on(cc.Node.EventType.TOUCH_END, this.onTouchOpenVipHandler, this), k.default.init(), I.default.ins.notice != N.default.timeToInt(new Date(N.default.serverTime)) && k.default.add(y.default), c.default.playerBGM(), M.default.log("-----------GameSDK.getRoomId() --------------", l.default.getRoomId()), null != l.default.getRoomId() ? (M.default.log("-----------GameSDK.getRoomId() != null--------11111------"), "match" == l.default.getRoomId() ? k.default.add(C.default) : k.default.add(P.default), b.default.trackEvent("1324")) : A.default.ins.checkCurDaySigned() || k.default.add(U.default), k.default.show(), this.btn_openVip.active = !1, this.vip_fab.active = !1;
      }, e.prototype.onShow = function () {
        D.MusicController.ins.stop(), l.default.hideBannerAd(), c.default.resumeBGM(), this.refresh(), g.default.ins.closeView(), this.proInfoCtr.onShow(), f.default.close(d.default), k.default.isShowing || U.default.isFirst && !A.default.ins.checkCurDaySigned() && f.default.show(U.default);
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_music.node.targetOff(this), this.sp_head.targetOff(this), this.btn_lottery.node.targetOff(this), this.btn_rank.node.targetOff(this), this.btn_q.node.targetOff(this), this.btn_start.node.targetOff(this), this.btn_pk_friend.node.targetOff(this), this.btn_pk_match.node.targetOff(this), this.btn_sign.node.targetOff(this);
      }, e.prototype.refresh = function () {
        1 == I.default.ins.music ? u.default.loadSprite(this.sp_music, "Atlas/atlas_main/home_icon_music_on") : u.default.loadSprite(this.sp_music, "Atlas/atlas_main/home_icon_music_off");var t = l.default.getIcon();if (null != t) {
          var e = this;cc.assetManager.loadRemote(t, { ext: ".png" }, function (t, n) {
            var o = new cc.SpriteFrame(n);e.icon_head.spriteFrame = o;
          });
        }
      }, e.prototype.onTouchMusicHandler = function () {
        c.default.playEffect(c.default.CLICK), 1 == I.default.ins.music ? (I.default.ins.music = 0, u.default.loadSprite(this.sp_music, "Atlas/atlas_main/home_icon_music_off")) : (I.default.ins.music = 1, u.default.loadSprite(this.sp_music, "Atlas/atlas_main/home_icon_music_on")), c.default.resetVolume();
      }, e.prototype.onTouchFeedbackHandler = function () {
        c.default.playEffect(c.default.CLICK), f.default.show(m.default);
      }, e.prototype.onTouchSignHandler = function () {
        c.default.playEffect(c.default.CLICK), f.default.show(U.default);
      }, e.prototype.onTouchDJHandler = function () {
        c.default.playEffect(c.default.CLICK), f.default.show(S.default);
      }, e.prototype.onTouchXBZHandler = function () {
        c.default.playEffect(c.default.CLICK), b.default.trackEvent("1315"), l.default.openUrl("https://club.vip.qq.com/vip20rebate/newbili?_wwv=68&_wv=16777221&_proxy=1");
      }, e.prototype.onTouchCJHandler = function () {
        c.default.playEffect(c.default.CLICK), f.default.show(T.default);
      }, e.prototype.onTouchLeftHandler = function () {
        c.default.playEffect(c.default.CLICK);var t = w.default.ins.data,
            e = E.default.ins.get_per_id(t);this.setRoleSelected(e);
      }, e.prototype.onTouchRightHandler = function () {
        c.default.playEffect(c.default.CLICK), M.default.log("----------onTouchRightHandler-----------------");var t = w.default.ins.data,
            e = E.default.ins.get_next_id(t);this.setRoleSelected(e);
      }, e.prototype.onTouchOpenVipHandler = function () {
        M.default.log("------------- onTouchOpenVipHandler ------------------"), l.default.openUrl(_.default.QQ_VIP_URL), b.default.trackEvent("1007");
      }, e.prototype.setRoleSelected = function (t) {
        if (w.default.ins.data = t, this.btn_openVip.active = !1, this.vip_fab.active = !1, 1 == E.default.ins.getItem(t).need_vip) {
          var e = l.default.getVip();M.default.log("-------\x3e vip " + e), 1 == e ? (R.default.select_role_id = t, this.vip_fab.active = !0) : (M.default.log("\u4E0D\u662Fvip \uFF0C\u4E0D\u80FD\u4F7F\u7528"), this.btn_openVip.active = !0);
        } else R.default.select_role_id = t;
      }, e.prototype.onTouchLotteryHandler = function () {
        c.default.playEffect(c.default.CLICK), f.default.show(p.default), b.default.trackEvent("1003");
      }, e.prototype.onTouchRankHandler = function () {
        c.default.playEffect(c.default.CLICK), f.default.show(h.default), b.default.trackEvent("1005");
      }, e.prototype.onTouchQHandler = function () {
        c.default.playEffect(c.default.CLICK), l.default.openUrl(_.default.QQ_VIP_URL), b.default.trackEvent("1007");
      }, e.prototype.onTouchStartHandler = function () {
        c.default.playEffect(c.default.CLICK), v.default.ins.startSingle(), b.default.trackEvent("1011");
      }, e.prototype.onTouchPkFriendHandler = function () {
        c.default.playEffect(c.default.CLICK), l.default.shareInvite(), b.default.trackEvent("1323");
      }, e.prototype.onTouchPkMatchHandler = function () {
        c.default.playEffect(c.default.CLICK), L.default.ins.getCurrentItemId() ? f.default.show(F.default) : f.default.show(C.default), b.default.trackEvent("1317");
      }, r([j], e);
    }(a.default));n.default = G, cc._RF.pop();
  }, { "../../Common/Manager/DataManager": "DataManager", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Manager/QueuePanelManager": "QueuePanelManager", "../../Common/Manager/SysConfig": "SysConfig", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/RoleConfig": "RoleConfig", "../Dash/HeroActor": "HeroActor", "../Dash/MusicController": "MusicController", "../Fb/FbPanel": "FbPanel", "../Fb/FbPkInvitePanel": "FbPkInvitePanel", "../Fb/FbPkMatchPanel": "FbPkMatchPanel", "../Info/ItemsInfo": "ItemsInfo", "../Info/SetInfo": "SetInfo", "../Info/SignInfo": "SignInfo", "../Lottery/LotteryPanel": "LotteryPanel", "../Scene/GameScene": "GameScene", "./AchievementPanel": "AchievementPanel", "./FeedbackPanel": "FeedbackPanel", "./NoticePanel": "NoticePanel", "./RankPanel": "RankPanel", "./ShopPanel": "ShopPanel", "./SignPanel": "SignPanel", "./SubContextViewController": "SubContextViewController", "./UpgradePropConfirm": "UpgradePropConfirm", "./item/ProInfoCtr": "ProInfoCtr" }], MainScene: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "932dbuutoVG158DGEmOk98k", "MainScene");var _o52,
        i = this && this.__extends || (_o52 = function o(t, e) {
      return (_o52 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o52(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/Manager/GlobalEventManager"),
        s = t("../../Common/Core/GameType"),
        c = t("../../Common/UI/UIManager"),
        l = t("../Main/LoadingPanel"),
        u = t("../Main/SubContextViewController"),
        f = t("../Main/MainPanel"),
        d = t("../Fb/FbPanel"),
        h = t("../../Common/Manager/Logger"),
        p = t("./GameScene"),
        _ = cc._decorator,
        m = _.ccclass,
        g = _.property,
        y = function (t) {
      function e() {
        var e = null !== t && t.apply(this, arguments) || this;return e.camera = null, e;
      }return i(e, t), e.prototype.start = function () {
        c.default.preload(f.default), a.default.on(s.InitStepEvent.LOAD_RES_FINISH, this.onLoadResFinishHandler, this), this.node.position = cc.Vec3.ZERO, this.node.eulerAngles = cc.Vec3.ZERO, c.default.init(this.node), h.default.log("mainscene"), c.default.show(l.default);
      }, e.prototype.onLoadResFinishHandler = function () {
        var t = this.node.getChildByName("GameNode");t && (t.addComponent(p.default).uiCamera = this.camera.getComponent(cc.Camera), t.active = !0);var e = this.node.getChildByName("contextView");e && (e.active = !0, e.addComponent(u.default)), a.default.targetOff(this), c.default.preload(d.default);
      }, r([g({ type: cc.Node, tooltip: "CameraNode" })], e.prototype, "camera", void 0), r([m], e);
    }(cc.Component);n.default = y, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/GlobalEventManager": "GlobalEventManager", "../../Common/Manager/Logger": "Logger", "../../Common/UI/UIManager": "UIManager", "../Fb/FbPanel": "FbPanel", "../Main/LoadingPanel": "LoadingPanel", "../Main/MainPanel": "MainPanel", "../Main/SubContextViewController": "SubContextViewController", "./GameScene": "GameScene" }], MapWorker: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "1d75cc7Yv5I3LWoObi4uKpW", "MapWorker");var _o53,
        i = this && this.__extends || (_o53 = function o(t, e) {
      return (_o53 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o53(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 }), n.MapWorker = void 0;var r = function (t) {
      function e(e, n) {
        return void 0 === e && (e = null), void 0 === n && (n = 0), t.call(this, e, n) || this;
      }return i(e, t), e.prototype.checkByte = function (t) {
        return 128 == (240 & t) || 222 == t || 223 == t;
      }, e.prototype.checkType = function (t) {
        return t instanceof Object;
      }, e.prototype.assembly = function (t, e) {
        var n = [];for (var o in t) {
          n.push(o);
        }var i = n.length;i < 16 ? e.writeByte(128 | i) : i < 65536 ? (e.writeByte(222), e.writeShort(i)) : (e.writeByte(223), e.writeUnsignedInt(i));for (var r = 0; r < i; r++) {
          var a = n[r];this.factory.getWorkerByType(a).assembly(a, e), this.factory.getWorkerByType(t[a]).assembly(t[a], e);
        }
      }, e.prototype.disassembly = function (t, e) {
        var n,
            o,
            i,
            r,
            a = -1,
            s = 0,
            c = {},
            l = this.incomplete,
            u = this.incomplete;if (128 == (240 & t) ? a = 15 & t : 222 == t && e.bytesAvailable >= 2 ? a = e.readUnsignedShort() : 223 == t && e.bytesAvailable >= 4 && (a = e.readUnsignedInt()), s < a) for (var f = s; f < a; f++) {
          if (l == this.incomplete) {
            if (!n) {
              if (0 == e.bytesAvailable) break;o = 255 & e.readByte(), n = this.factory.getWorkerByByte(o);
            }l = n.disassembly(o, e);
          }if (l != this.incomplete && u == this.incomplete) {
            if (!i) {
              if (0 == e.bytesAvailable) break;r = 255 & e.readByte(), i = this.factory.getWorkerByByte(r);
            }u = i.disassembly(r, e);
          }if (l == this.incomplete || u == this.incomplete) break;c[l.toString()] = u, n = void 0, i = void 0, l = this.incomplete, u = this.incomplete, s++;
        }return s == a ? c : this.incomplete;
      }, e;
    }(t("./AbstractWorker").default);n.MapWorker = r, cc._RF.pop();
  }, { "./AbstractWorker": "AbstractWorker" }], MathUtil: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "77ad7NnkJ5Nn4STXAUiDspe", "MathUtil"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t() {}return t.randomInt = function (t, e) {
        if (void 0 === e && (e = null), null != e) {
          var n = e - t;return Math.round(t + Math.random() * n);
        }return Math.round(Math.random() * t);
      }, t.randomFloat = function (t, e) {
        if (void 0 === e && (e = null), null != e) {
          var n = e - t;return t + Math.random() * n;
        }return Math.random() * t;
      }, t.randomArray = function (e) {
        if (e) for (var n, o, i = e.length - 1, r = 0; r < i; r++) {
          o = t.randomInt(r + 1, i), n = e[r], e[r] = e[o], e[o] = n;
        }
      }, t.clamp = function (t, e, n) {
        var o = t;return t < e ? o = e : t > n && (o = n), o;
      }, t.lerp = function (e, n, o) {
        return e + (n - e) * t.clamp(o, 0, 1);
      }, t.lerpAngle = function (e, n, o) {
        var i = t.repeat(n - e, 360);return i > 180 && (i -= 360), cc.v2(0, 0), e + i * t.clamp(o, 0, 1);
      }, t.repeat = function (t, e) {
        return t - Math.floor(t / e) * e;
      }, t.distance = function (t, e, n, o) {
        return Math.sqrt(Math.pow(t - n, 2) + Math.pow(e - o, 2));
      }, t.to = function (t, e, n, o) {
        var i = t + o * Math.cos(n),
            r = e + o * Math.sin(n);return cc.v2(i, r);
      }, t.splitInt = function (e, n) {
        for (var o = new Array(n), i = Math.floor(e / n + 1), r = e - i * n, a = r / n, s = 0; s < n; s++) {
          var c = s < n - 1 ? t.randomInt(0, a) : r;r -= c, o[s] = i + c;
        }return o;
      }, t.splitInt2 = function (t, e, n) {
        void 0 === n && (n = 1);for (var o = new Array(e), i = Math.round(e + 2 * Math.max(0, Math.min(n, 1)) * e + 1), r = Math.floor(t / i), a = t - r * e, s = a / ((e - 1) * e / 2), c = 0; c < e; c++) {
          a -= n = Math.max(1, Math.floor(c < e - 1 ? s * c : a)), o[c] = r + n;
        }return o;
      }, t.makePolygon = function (e, n, o) {
        if (void 0 === n && (n = 2), void 0 === o && (o = 50), e && e.getTextureData) {
          var i = [],
              r = e.width,
              a = e.height;e.getTextureData.prepare();var s,
              c,
              l = e.getTextureData().consumePixmap(),
              u = new Array(1020),
              f = new Array(1020),
              d = new Array(1020),
              h = 0,
              p = 0,
              _ = 0,
              m = -1,
              g = 0,
              y = 0;for (u[0] = 0, f[0] = 0, d[0] = 1, p = 0; p < r; p += n) {
            for (_ = 0; _ < a; _ += 1) {
              if (l.getPixel(p, _) >> 24 != 0) {
                u[h] = p, f[h] = a - _, d[h] = 1, h++, m < 0 && (m = _), g = p, y = _;break;
              }
            }
          }for (_ = 0; _ < a; _ += n) {
            for (p = r - 1; p >= 0; p -= 1) {
              if (l.getPixel(p, _) >> 24 != 0 && _ > y) {
                u[h] = p, f[h] = a - _, d[h] = 1, h++, g = p, y = _;break;
              }
            }
          }for (p = r - 1; p >= 0; p -= n) {
            for (_ = a - 1; _ >= 0; _ -= 1) {
              if (l.getPixel(p, _) >> 24 != 0 && p < g) {
                u[h] = p, f[h] = a - _, d[h] = 1, h++, g = p, y = _;break;
              }
            }
          }for (_ = a - 1; _ >= 0; _ -= n) {
            for (p = 0; p < r; p += 1) {
              if (l.getPixel(p, _) >> 24 != 0 && _ < y && _ > m) {
                u[h] = p, f[h] = a - _, d[h] = 1, h++, g = p, y = _;break;
              }
            }
          }for (var b = 0; b < h - 2; b++) {
            s = t._pointDirection(u[b], f[b], u[b + 1], f[b + 1]), c = t._pointDirection(u[b + 1], f[b + 1], u[b + 2], f[b + 2]), Math.abs(s - c) <= o && (d[b + 1] = 0);
          }for (s = t._pointDirection(u[h - 2], f[h - 2], u[h - 1], f[h - 1]), c = t._pointDirection(u[h - 1], f[h - 1], u[0], f[0]), Math.abs(s - c) <= o && (d[h - 1] = 0), s = t._pointDirection(u[h - 1], f[h - 1], u[0], f[0]), c = t._pointDirection(u[0], f[0], u[1], f[1]), Math.abs(s - c) <= o && (d[0] = 0), b = 0; b < h; b++) {
            if (1 == d[b]) {
              var C = cc.v2(u[b], a - f[b]);i.push(C);
            }
          }return e.getTextureData().disposePixmap(), i;
        }return null;
      }, t._pointDirection = function (t, e, n, o) {
        return 180 * Math.atan2(o - e, n - t) / Math.PI;
      }, t.randomWeight = function (e) {
        for (var n = 0, o = 0; o < e.length; o++) {
          n += e[o];
        }var i = t.randomInt(n),
            r = 0;for (o = 0; o < e.length;) {
          if (i <= (r += e[o])) return o;o += 1;
        }
      }, t.randomAverage = function (e) {
        return null == e || 0 == e.length ? null : e[t.randomInt(e.length - 1)];
      }, t.randomList = function (t, e) {
        if (e > t.length) return t;for (var n = []; n.length < e;) {
          var o = this.randomAverage(t);n.every(function (t) {
            return t != o;
          }) && n.push(o);
        }return n;
      }, t.toRandomList = function (t) {
        for (var e = t.length, n = []; n.length < e;) {
          var o = this.randomAverage(t);n.every(function (t) {
            return t != o;
          }) && n.push(o);
        }return n;
      }, t.convertColor = function (t) {
        var e = t >> 16 & 255,
            n = t >> 8 & 255,
            o = 255 & t;return new cc.Color(e, n, o, 128);
      }, t.convertToWorldSpace = function (t, e) {
        var n = cc.v3(),
            o = cc.mat4();return e.getWorldMatrix(o), cc.Vec3.transformMat4(n, t, o), n;
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], MsgPackError: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "6a13bXmNG1J7Y7KB4dO4uyk", "MsgPackError");var _o54,
        i = this && this.__extends || (_o54 = function o(t, e) {
      return (_o54 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o54(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e;
    }(Error);n.default = r, cc._RF.pop();
  }, {}], MsgPackFlags: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "40c21pxjKBBCK9FcmdkxnrT", "MsgPackFlags"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t() {}return t.READ_STRING_AS_BYTE_ARRAY = 1, t.ACCEPT_LITTLE_ENDIAN = 2, t.SPEC2013_COMPATIBILITY = 4, t;
    }();n.default = o, cc._RF.pop();
  }, {}], MsgPack: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "598b3o4pqdEL6uH/DJ9SvJH", "MsgPack"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../../../Common/Core/ByteArray"),
        i = t("./WorkerFactory"),
        r = t("./MsgPackFlags"),
        a = t("./MsgPackError"),
        s = t("./NullWorker"),
        c = t("./WorkerPriority"),
        l = t("./BooleanWorker"),
        u = t("./NumberWorker"),
        f = t("./StringWorker"),
        d = t("./ArrayWorker"),
        h = t("./BinaryWorker"),
        p = t("./MapWorker"),
        _ = function () {
      function t(t, e) {
        void 0 === t && (t = 0), void 0 === e && (e = null), this.incomplete = { toString: function toString() {
            return "incomplete";
          } }, e ? this._factory = e : (this._factory = new i.default(t), this._factory.assign(new s.default(null, c.default.DEFAULT_PRIORITY)), this._factory.assign(new l.default(null, c.default.DEFAULT_PRIORITY)), this._factory.assign(new u.default(null, c.default.DEFAULT_PRIORITY)), this._factory.assign(new f.default(null, c.default.DEFAULT_PRIORITY)), this._factory.assign(new d.default(null, c.default.DEFAULT_PRIORITY)), this._factory.assign(new h.default(null, c.default.DEFAULT_PRIORITY)), this._factory.assign(new p.MapWorker(null, c.default.DEFAULT_PRIORITY)));
      }return Object.defineProperty(t, "VERSION", { get: function get() {
          return "0.0.1";
        }, enumerable: !1, configurable: !0 }), t.write = function (e, n) {
        return void 0 === n && (n = null), new t().write(e, n);
      }, t.read = function (e) {
        return new t().read(e);
      }, Object.defineProperty(t.prototype, "factory", { get: function get() {
          return this._factory;
        }, enumerable: !1, configurable: !0 }), t.prototype.write = function (t, e) {
        void 0 === e && (e = null);var n = this._factory.getWorkerByType(t);return e || (e = new o.default()), this.checkBigEndian(e), n.assembly(t, e), e.position = 0, e;
      }, t.prototype.read = function (t) {
        if (this.checkBigEndian(t), !this.root) {
          if (0 == t.bytesAvailable) return this.incomplete;this.rootByte = 255 & t.readByte(), this.root = this._factory.getWorkerByByte(this.rootByte);
        }var e = this.root.disassembly(this.rootByte, t);return e != this.incomplete && (this.root = void 0), e;
      }, t.prototype.checkBigEndian = function (t) {
        if (t.endian == o.default.LITTLE_ENDIAN && !this._factory.checkFlag(r.default.ACCEPT_LITTLE_ENDIAN)) throw new a.default("Object uses little endian but MessagePack was designed for big endian. To avoid this error use the flag ACCEPT_LITTLE_ENDIAN.");
      }, t;
    }();n.default = _, cc._RF.pop();
  }, { "../../../Common/Core/ByteArray": "ByteArray", "./ArrayWorker": "ArrayWorker", "./BinaryWorker": "BinaryWorker", "./BooleanWorker": "BooleanWorker", "./MapWorker": "MapWorker", "./MsgPackError": "MsgPackError", "./MsgPackFlags": "MsgPackFlags", "./NullWorker": "NullWorker", "./NumberWorker": "NumberWorker", "./StringWorker": "StringWorker", "./WorkerFactory": "WorkerFactory", "./WorkerPriority": "WorkerPriority" }], MusicConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "43f8bnzLu5Jd6t2a/Nzwrew", "MusicConfig");var _o55,
        i = this && this.__extends || (_o55 = function o(t, e) {
      return (_o55 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o55(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Config/AbsConfig"),
        a = t("./item/MusicData"),
        s = function (t) {
      function e() {
        return t.call(this, a.default) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e._ins = null, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../Common/Config/AbsConfig": "AbsConfig", "./item/MusicData": "MusicData" }], MusicController: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "9337fp6lsROXKM7xsWzuDM9", "MusicController");var _o56,
        i = this && this.__extends || (_o56 = function o(t, e) {
      return (_o56 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o56(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 }), n.MusicController = void 0;var r = t("../Config/MusicConfig"),
        a = t("../../Common/Manager/TimeManager"),
        s = t("../../Common/Util/MathUtil"),
        c = t("../../Common/Manager/LoadResManager"),
        l = t("../../Common/Util/StringUtil"),
        u = t("../../Common/Manager/MusicManager"),
        f = function (t) {
      function e() {
        var e = t.call(this) || this;e._duration = 0, e._audioList = [], e._playList = [], e._durations = [], e._rhythms = [], e._audioIdx = 0, e._mute = !1, e._volume = 1, e._isPlaying = !1, e._isInit = !1, e._isPause = !1, e._currentTime = 0, e._duration = 0, e._loadIdx = 0;for (var n = r.default.ins.getList(), o = 0; o < n.length; o++) {
          var i = n[o],
              a = l.default.convertNumberArray(i.rhythm, ",");e._rhythms[o] = a, e._durations[o] = a[a.length - 1];
        }return e;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == this._ins && (this._ins = new e()), this._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.randomMusic = function (t) {
        void 0 === t && (t = 0);var e = r.default.ins.getList(),
            n = [],
            o = [];switch (t) {case 0:
            for (var i = 0; i < e.length; i++) {
              o.push(i);
            }break;case 1:
            for (n = [0, 1, 2]; n.length > 0;) {
              var a = s.default.randomInt(0, n.length - 1);o.push(n[a]), n.splice(a, 1);
            }Math.random() > .5 ? (o.push(3), o.push(4)) : (o.push(4), o.push(3));break;default:
            for (n = [5, 6, 7]; n.length > 0;) {
              a = t % n.length, o.push(n[a]), n.splice(a, 1);
            }}return o;
      }, e.prototype.init = function (t, e, n) {
        void 0 === e && (e = null), void 0 === n && (n = null);var o = r.default.ins.getList();if (this._playList = this.randomMusic(t), this._rhythm = l.default.convertNumberArray(o[this._playList[0]].rhythm, ","), 0 == this._loadIdx) for (; null != this._audioList[this._playList[this._loadIdx]];) {
          this._loadIdx++;
        }this._loadIdx < this._playList.length - 1 ? (this._loadIdx <= 0 && this.loadMusic(), this._callback = e, this._owner = n) : e && e.call(n);
      }, Object.defineProperty(e.prototype, "isInit", { get: function get() {
          return this._isInit;
        }, enumerable: !1, configurable: !0 }), e.prototype.loadMusic = function () {
        var t = r.default.ins.getList(),
            e = this._playList[this._loadIdx],
            n = t[e];if (n) {
          var o = u.default.getAudioClip("Music/" + n.file.substr(0, +n.file.length - 4));if (this._loadIdx++, o) this.initMusic(o, e);else if (null == this._audioList[e]) {
            var i = this,
                a = e;c.default.bundle.load("Music/" + n.file.substr(0, +n.file.length - 4), cc.AudioClip, null, function (t, e) {
              i.initMusic(e, a);
            });
          }
        }
      }, e.prototype.initMusic = function (t, e) {
        this._audioList[e] = t, null == this._audio && (this._audio = new cc.AudioSource(), this._audio.volume = this._volume, this._audio.clip = t, this._audio.stop()), this._playList[0] == e && (this._callback && (this._callback.call(this._owner), this._callback = null, this._owner = null), this._isInit = !0), a.default.add(this.loadMusic, this, 1, 1);
      }, e.prototype.update = function (t) {
        this._isPlaying && this._audio && !this._isPause && (this._currentTime += t);
      }, e.prototype.next = function () {
        this._currentTime = 0, this._duration += this._durations[this.getAudioIndex(this._audioIdx)], this._audioIdx < this._playList.length - 1 ? this._audioIdx++ : this._audioIdx = 0, this._audio.clip = this._audioList[this.getAudioIndex(this._audioIdx)], this._rhythm = this._rhythms[this.getAudioIndex(this._audioIdx)], this._audio.rewind(), this._audio.play(), this._audio.mute || this.emit("next_music");
      }, Object.defineProperty(e.prototype, "rhythms", { get: function get() {
          return this._rhythm;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "nextRhythms", { get: function get() {
          return this._audioIdx >= this._playList.length - 1 ? this._rhythms[this.getAudioIndex(0)] : this._rhythms[this.getAudioIndex(this._audioIdx + 1)];
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "volume", { get: function get() {
          return this._volume;
        }, set: function set(t) {
          this._volume != t && (this._volume = t, this._audio && (this._audio.volume = t));
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "mute", { get: function get() {
          return this._mute;
        }, set: function set(t) {
          this._mute = t, this._audio && (this._audio.mute = t);
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "isPlaying", { get: function get() {
          return this._isPlaying;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "clip", { get: function get() {
          return this._audio ? this._audio.clip : null;
        }, enumerable: !1, configurable: !0 }), e.prototype.setCurrentTime = function (t) {
        this._currentTime = t, this._audio && this._audio.setCurrentTime(t);
      }, e.prototype.getCurrentTime = function () {
        return this._currentTime + this._duration;
      }, e.prototype.playSingle = function (t) {
        this._currentTime = 0, this._audio && (this._audio.play(), isNaN(t) || this._audio.setCurrentTime(t), this._isPlaying = !0, this._isPause = !1);
      }, e.prototype.playLoop = function (t) {
        void 0 === t && (t = null), this._currentTime = 0, this._audio && (this._audio.play(), isNaN(t) || this._audio.setCurrentTime(t), this._isPlaying = !0, this._isPause = !1);
      }, e.prototype.stop = function () {
        if (this._currentTime = 0, this._isPlaying = !1, this._isPause = !1, this._audioIdx = 0, this._duration = 0, this._audio) {
          var t = this.getAudioIndex(0);this._audio.stop(), this._audio.clip = this._audioList[t], this._rhythm = this._rhythms[t];
        }
      }, e.prototype.pause = function () {
        this._isPause = !0, this._audio && this._audio.pause();
      }, e.prototype.resume = function () {
        this._isPause = !1, this._audio && this._audio.resume();
      }, e.prototype.rewind = function () {
        var t = this.getAudioIndex(0);this._currentTime = 0, this._audioIdx = 0, this._duration = 0, this._audio.clip = this._audioList[t], this._rhythm = this._rhythms[t], this._isPause = !1, this._audio && (this._isPlaying = !0, this._audio.rewind(), this._audio.play());
      }, e.prototype.getDuration = function () {
        return this._duration;
      }, e.prototype.getNextDuration = function () {
        var t = s.default.clamp(this.getAudioIndex(this._audioIdx), 0, this._durations.length - 1);return this._duration + this._durations[t];
      }, e.prototype.getAudioIndex = function (t) {
        return this._playList[t];
      }, Object.defineProperty(e.prototype, "audioIdx", { get: function get() {
          return this._audioIdx;
        }, enumerable: !1, configurable: !0 }), e;
    }(cc.EventTarget);n.MusicController = f, cc._RF.pop();
  }, { "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/Util/MathUtil": "MathUtil", "../../Common/Util/StringUtil": "StringUtil", "../Config/MusicConfig": "MusicConfig" }], MusicData: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "4d860bpQNdLHYFwfeE67XyA", "MusicData"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        this._id = t.attributes.id, this._name = t.attributes.name, this._timer = t.attributes.timer, this._rhythm = t.attributes.rhythm, this._file = t.attributes.file;
      }return Object.defineProperty(t.prototype, "id", { get: function get() {
          return this._id;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "name", { get: function get() {
          return this._name;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "timer", { get: function get() {
          return this._timer;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "rhythm", { get: function get() {
          return this._rhythm;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "file", { get: function get() {
          return this._file;
        }, enumerable: !1, configurable: !0 }), t.cfgFile = "music", t;
    }();n.default = o, cc._RF.pop();
  }, {}], MusicManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "7f98eW7OqFNvbwDrEEWHo+g", "MusicManager"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../../Game/Info/SetInfo"),
        i = function () {
      function t() {}return t.initSound = function (e, n) {
        if (null != n) {
          var o = new cc.AudioSource();o.clip = n, t.sounds[e] = o;
        }
      }, t.getAudioClip = function (e) {
        return t.sounds[e] ? t.sounds[e].clip : null;
      }, t.play = function (e, n) {
        void 0 === n && (n = !1);var i = t.sounds[e];null == i ? ((i = new cc.AudioSource()).loop = n, cc.resources.load(e, cc.AudioClip, function (n, r) {
          n || (i.clip = r, i.play(), i.volume = o.default.ins.music, t.sounds[e] = i);
        })) : (i.loop = n, i.play(), i.volume = o.default.ins.music);
      }, t.playEffect = function (e, n) {
        void 0 === e && (e = t.CLICK), void 0 === n && (n = !1), t.play(e, n);
      }, t.stopEffect = function (e) {
        var n = t.sounds[e];null != n && n.stop();
      }, t.playerBGM = function (e, n) {
        void 0 === e && (e = t.MUSIC), void 0 === n && (n = !1), o.default.ins.music > 0 && (n || null != e && this._bgm != e) && (null != this._bgm && this.stopBGM(), this._bgm = e, t.play(this._bgm, !0));
      }, t.stopBGM = function () {
        var e = t.sounds[this._bgm];null != e && (e.stop(), this._bgm = null);
      }, t.pauseBGM = function () {
        var e = t.sounds[this._bgm];null != e && (e.pause(), this._isPause = !0);
      }, t.resumeBGM = function () {
        if (o.default.ins.music > 0 && this._isPause) {
          this._isPause = !1;var e = t.sounds[this._bgm];null != e && e.resume();
        }
      }, t.resetVolume = function () {
        o.default.ins.music > 0 ? t.resumeBGM() : t.pauseBGM();
      }, t.CLICK = "Sounds/click", t.HIT = "Sounds/hit", t.PERFECT = "Sounds/perfect", t.THROW = "Sounds/throw", t.HITTARGET = "Sounds/hittarget", t.MUSIC = "Music/01", t.sounds = {}, t._isPause = !1, t;
    }();n.default = i, cc._RF.pop();
  }, { "../../Game/Info/SetInfo": "SetInfo" }], MyExchangePanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "0f6bbXiPyhHtqtcLX10JJnf", "MyExchangePanel");var _o57,
        i = this && this.__extends || (_o57 = function o(t, e) {
      return (_o57 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o57(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Manager/CommandController"),
        d = t("./UIExchangeLog"),
        h = cc._decorator,
        p = h.ccclass,
        _ = (h.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubWindowLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.scrollview = s.default.getComponent(cc.ScrollView, this.node, "frame/scrollview"), this.UIExchangeLog = s.default.getNode(this.node, "frame/UIExchangeLog");
      }, e.prototype.onShow = function () {
        this.refresh();
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this);
      }, e.prototype.refresh = function () {
        var t = this;this.scrollview.content.removeAllChildren(!0), f.default.myExchangeList(function (e) {
          for (var n = e.l, o = 0; o < n.length; o++) {
            var i = n[o],
                r = cc.instantiate(t.UIExchangeLog).getComponent(d.default);r.data = i, r.node.active = !0, t.scrollview.content.addChild(r.node);
          }t.scrollview.scrollToTop(0);
        }, this);
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, r([p], e);
    }(a.default));n.default = _, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Manager/CommandController": "CommandController", "./UIExchangeLog": "UIExchangeLog" }], NetUtil: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "dda96ZV84pAMahYpTF7MxfY", "NetUtil"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./StringUtil"),
        i = t("./MathUtil"),
        r = function () {
      function t() {}return t.GET = function (t, e, n, i) {
        void 0 === i && (i = null);var r = new XMLHttpRequest();r.onreadystatechange = function () {
          if (4 == r.readyState) if (r.status >= 200 && r.status < 400) {
            var t = r.responseText;if (t) {
              var e = JSON.parse(t);n.call(i, e);
            } else console.log("\u8FD4\u56DE\u6570\u636E\u4E0D\u5B58\u5728"), n.call(i, { errCode: 0, errMsg: "\u8FD4\u56DE\u6570\u636E\u4E0D\u5B58\u5728" });
          } else console.log("\u8BF7\u6C42\u5931\u8D25-" + r.status), n.call(i, { errCode: 0, errMsg: "\u7F51\u7EDC\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5" });
        }, r.open("GET", t + "?" + o.default.formatHttpParams(e), !0), r.send();
      }, t.POST = function (t, e, n, i) {
        void 0 === i && (i = null);var r = new XMLHttpRequest();r.onreadystatechange = function () {
          if (4 == r.readyState) if (r.status >= 200 && r.status < 400) {
            var t = r.responseText;if (t) {
              var e = JSON.parse(t);n.call(i, e);
            } else console.log("\u8FD4\u56DE\u6570\u636E\u4E0D\u5B58\u5728"), n.call(i, null);
          } else console.log("\u8BF7\u6C42\u5931\u8D25-" + r.status), n.call(i, { errCode: 0, errMsg: "\u7F51\u7EDC\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5" });
        }, r.open("POST", t, !0), r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), r.send(o.default.formatHttpParams(e));
      }, t.encodePost = function (e, n, r, a) {
        void 0 === a && (a = null);var s = new XMLHttpRequest();s.onreadystatechange = function () {
          if (4 == s.readyState) if (s.status >= 200 && s.status < 400) {
            var e = s.responseText;if (e) {
              var n = JSON.parse(e),
                  o = t.decode(n.t, n.v);r.call(a, o);
            } else console.log("\u8FD4\u56DE\u6570\u636E\u4E0D\u5B58\u5728"), r.call(a, null);
          } else console.log("\u8BF7\u6C42\u5931\u8D25-" + s.status), r.call(a, { errCode: 0, errMsg: "\u7F51\u7EDC\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5" });
        };var c = i.default.randomInt(1e7, 99999999),
            l = { t: c, v: t.encode(c, n) };s.open("POST", e, !0), s.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), s.send(o.default.formatHttpParams(l));
      }, t.encrypt = function (t, e) {
        for (var n, o = e.length, i = (t ^ o) % 255, r = ((o & i) + (t ^ i)) % 255, a = [], s = 0; s < o; s++) {
          i -= (r * o ^ t) % 255, t -= r, n = 255 & ((n = e[s]) ^ (r = i % 255)), a.push(n);
        }return a;
      }, t.encode = function (e, n) {
        var i = JSON.stringify(n),
            r = t.encrypt(e, o.default.stringToByte(i));return o.default.parseByte2HexStr(r);
      }, t.decode = function (e, n) {
        var i = t.encrypt(e, o.default.parseHexStr2Byte(n)),
            r = o.default.byteToString(i);return JSON.parse(r);
      }, t;
    }();n.default = r, cc._RF.pop();
  }, { "./MathUtil": "MathUtil", "./StringUtil": "StringUtil" }], NoticePanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "ea24ffGyYlBlo6IFDf8mPBs", "NoticePanel");var _o58,
        i = this && this.__extends || (_o58 = function o(t, e) {
      return (_o58 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o58(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/Sdks/UmaTrackHelper"),
        d = t("../Info/SetInfo"),
        h = t("../../Common/Manager/TimeManager"),
        p = cc._decorator,
        _ = p.ccclass,
        m = (p.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubPopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this);
      }, e.prototype.onShow = function () {
        d.default.ins.notice = h.default.timeToInt(new Date(h.default.serverTime)), f.default.trackEvent("1001");
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this);
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), f.default.trackEvent("1002"), u.default.close(this);
      }, r([_], e);
    }(a.default));n.default = m, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Info/SetInfo": "SetInfo" }], NullWorker: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "84ea048qaRPOIhaQF8lhNce", "NullWorker");var _o59,
        i = this && this.__extends || (_o59 = function o(t, e) {
      return (_o59 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o59(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = function (t) {
      function e(e, n) {
        return void 0 === e && (e = null), void 0 === n && (n = 0), t.call(this, e, n) || this;
      }return i(e, t), e.prototype.checkByte = function (t) {
        return 192 == t;
      }, e.prototype.checkType = function (t) {
        return null == t;
      }, e.prototype.assembly = function (t, e) {
        e.writeByte(192);
      }, e.prototype.disassembly = function () {
        return null;
      }, e;
    }(t("./AbstractWorker").default);n.default = r, cc._RF.pop();
  }, { "./AbstractWorker": "AbstractWorker" }], NumValueBase64: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "c135c47QfVKnIyBK5N9HxOe", "NumValueBase64"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../Util/Base64"),
        i = t("../Util/MathUtil"),
        r = function () {
      function t(t) {
        void 0 === t && (t = 0), this.value = t;var e = o.default.keystr;this._key = e.substr(0, i.default.randomInt(10, 20));
      }return Object.defineProperty(t.prototype, "value", { get: function get() {
          var t = o.default.decode(this._v).split("_"),
              e = null;if (2 == t.length) {
            var n = t[1];e = parseInt(n);
          }return e;
        }, set: function set(t) {
          var e = this._key + "_" + t;this._v = o.default.encode(e);
        }, enumerable: !1, configurable: !0 }), t;
    }();n.default = r, cc._RF.pop();
  }, { "../Util/Base64": "Base64", "../Util/MathUtil": "MathUtil" }], NumValue: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "b16acf1solDnKUVUL6SVcNn", "NumValue"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        void 0 === t && (t = 0), this.r = .6 * Math.random() + .2, this.value = t;
      }return Object.defineProperty(t.prototype, "value", { get: function get() {
          return this.v1 + this.v2;
        }, set: function set(t) {
          this.v1 = Math.floor(t * this.r), this.v2 = t - this.v1;
        }, enumerable: !1, configurable: !0 }), t;
    }();n.default = o, cc._RF.pop();
  }, {}], NumberWorker: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "35c91Q3EqNNbbvdGiOajpTF", "NumberWorker");var _o60,
        i = this && this.__extends || (_o60 = function o(t, e) {
      return (_o60 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o60(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = function (t) {
      function e(e, n) {
        return void 0 === e && (e = null), void 0 === n && (n = 0), t.call(this, e, n) || this;
      }return i(e, t), e.prototype.checkByte = function (t) {
        return 202 == t || 203 == t || 0 == (128 & t) || 224 == (224 & t) || 204 == t || 205 == t || 206 == t || 208 == t || 209 == t || 210 == t || 207 == t || 211 == t;
      }, e.prototype.checkType = function (t) {
        return "number" == typeof t;
      }, e.prototype.assembly = function (t, e) {
        Math.floor(t) != t ? (e.writeByte(203), e.writeDouble(t)) : t < -32 ? t < -(1 << 31) ? (e.writeByte(211), e.writeInt(Math.floor(t / 4294967296)), e.writeUnsignedInt(t)) : t < -32768 ? (e.writeByte(210), e.writeInt(t)) : t < -128 ? (e.writeByte(209), e.writeShort(t)) : (e.writeByte(208), e.writeByte(t)) : t < 128 ? e.writeByte(t) : t < 256 ? (e.writeByte(204), e.writeByte(t)) : t < 65536 ? (e.writeByte(205), e.writeShort(t)) : t < 1 ? (e.writeByte(206), e.writeUnsignedInt(t)) : (e.writeByte(207), e.writeUnsignedInt(Math.floor(t / 4294967296)), e.writeUnsignedInt(t));
      }, e.prototype.disassembly = function (t, e) {
        return 203 == t && e.bytesAvailable >= 8 ? e.readDouble() : 202 == t && e.bytesAvailable >= 4 ? e.readFloat() : 211 == t && e.bytesAvailable >= 8 ? 4294967296 * e.readInt() + e.readUnsignedInt() : 207 == t && e.bytesAvailable >= 8 ? 4294967296 * e.readUnsignedInt() + e.readUnsignedInt() : 0 == (128 & t) ? t : 224 == (224 & t) ? t - 255 - 1 : 204 == t && e.bytesAvailable >= 1 ? e.readUnsignedByte() : 205 == t && e.bytesAvailable >= 2 ? e.readUnsignedShort() : 206 == t && e.bytesAvailable >= 4 ? e.readUnsignedInt() : 208 == t && e.bytesAvailable >= 1 ? e.readByte() : 209 == t && e.bytesAvailable >= 2 ? e.readShort() : 210 == t && e.bytesAvailable >= 4 ? e.readInt() : 211 == t && e.bytesAvailable >= 8 ? 4294967296 * e.readInt() + e.readUnsignedInt() : 207 == t && e.bytesAvailable >= 8 ? 4294967296 * e.readUnsignedInt() + e.readUnsignedInt() : this.incomplete;
      }, e;
    }(t("./AbstractWorker").default);n.default = r, cc._RF.pop();
  }, { "./AbstractWorker": "AbstractWorker" }], ObjectActor: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "3243a3qnJ9JULblb1K/wUUn", "ObjectActor");var _o61,
        i = this && this.__extends || (_o61 = function o(t, e) {
      return (_o61 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o61(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/Manager/LoadResManager"),
        s = cc._decorator,
        c = s.ccclass,
        l = (s.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e.group = "actor", e.is3DNode = !0, e;
      }return i(e, t), e.prototype.setName = function (t) {
        var e = this;this.name = t, a.default.bundle.load("Prefab/" + t, cc.Prefab, function (t, n) {
          e.initModel(n);
        });
      }, e.prototype.initModel = function (t) {
        var e;e = cc.instantiate(t), this.addChild(e);
      }, r([c], e);
    }(cc.Node));n.default = l, cc._RF.pop();
  }, { "../../Common/Manager/LoadResManager": "LoadResManager" }], PKHeadInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "ae29dBhimdDFbRa1pzvous2", "PKHeadInfo");var _o62,
        i = this && this.__extends || (_o62 = function o(t, e) {
      return (_o62 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o62(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../../Common/Manager/Logger"),
        a = t("../../../Common/UI/UIItem"),
        s = t("../../../Common/Util/ComponentUtil"),
        c = t("../../Main/item/FbHead"),
        l = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.init = function () {
        this.txt_name = s.default.getComponent(cc.Label, this.node, "txt_name"), this.txt_sjnum = s.default.getComponent(cc.Label, this.node, "txt_sjnum"), this.txt_sjrank = s.default.getComponent(cc.Label, this.node, "txt_sjrank"), this.mask = s.default.getNode(this.node, "mask"), this.head = new c.default(this.node), this.txt_sjrank.string = "";
      }, e.prototype.onShow = function () {
        this.txt_name.string = "", this.txt_sjnum.string = "", this.txt_sjrank.string = "", this.mask.active = !1;
      }, e.prototype.setData = function (t, e, n, o) {
        null == e && (e = 0), null == t && (t = "null"), this.txt_name.string = t, this.txt_sjnum.string = e.toString(), this.txt_sjrank.string = 0 == o ? "\u672A\u4E0A\u699C" : o.toString(), r.default.log(o, "rank"), this.mask.active = !0, this.head.setIcon(n);
      }, e.prototype.destroy = function () {
        t.prototype.destroy.call(this), this.head.destroy(), this.head = null;
      }, e;
    }(a.default);n.default = l, cc._RF.pop();
  }, { "../../../Common/Manager/Logger": "Logger", "../../../Common/UI/UIItem": "UIItem", "../../../Common/Util/ComponentUtil": "ComponentUtil", "../../Main/item/FbHead": "FbHead" }], PacketDataEvent: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "89ecdsbdrRFubCNdra98OCM", "PacketDataEvent");var _o63,
        i = this && this.__extends || (_o63 = function o(t, e) {
      return (_o63 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o63(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Util/StringUtil"),
        a = function (t) {
      function e(e, n, o) {
        var i = t.call(this, "cmd:0x" + r.default.toString(e, 16, 4).toUpperCase(), !1) || this;return i._cmd = e, i._stamp = n, i._body = o, i;
      }return i(e, t), Object.defineProperty(e.prototype, "cmd", { get: function get() {
          return this._cmd;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "stamp", { get: function get() {
          return this._stamp;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "body", { get: function get() {
          return this._body;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "isError", { get: function get() {
          return null != this._body && null != this._body.errCode;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "errorCode", { get: function get() {
          return null != this._body && null != this._body.errCode ? this._body.errCode : null;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "error", { get: function get() {
          var t = this._body.errMsg;return null != this._body && 1 != this._body.errCode && null != t ? -1 != t.indexOf("\u6743\u9650") ? null : t : null;
        }, enumerable: !1, configurable: !0 }), e;
    }(cc.Event);n.default = a, cc._RF.pop();
  }, { "../../Common/Util/StringUtil": "StringUtil" }], PlayerInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "23685f8r+dGWoa1Mu0Z/sFp", "PlayerInfo");var _o64,
        i = this && this.__extends || (_o64 = function o(t, e) {
      return (_o64 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o64(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Info/AbsInfo"),
        a = t("../../Common/Core/NumValue"),
        s = t("../../Common/Core/GameType"),
        c = t("../../Common/Manager/Logger"),
        l = function (t) {
      function e() {
        var e = t.call(this) || this;return e._giftCoupon = new a.default(), e._money = new a.default(), e._todayGiftCoupon = new a.default(), e;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "giftCoupon", { get: function get() {
          return this._giftCoupon.value;
        }, set: function set(t) {
          this._giftCoupon.value != t && (this._giftCoupon.value = t, this.emit(s.InfoEvent.EVENT_CHANGE));
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "todayGiftCoupon", { get: function get() {
          return this._todayGiftCoupon.value;
        }, set: function set(t) {
          this._todayGiftCoupon.value != t && (this._todayGiftCoupon.value = t);
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "money", { get: function get() {
          return this._money.value;
        }, set: function set(t) {
          this._money.value != t && (this._money.value = t, c.default.log("--------------money ", t), this.emit(s.InfoEvent.EVENT_CHANGE));
        }, enumerable: !1, configurable: !0 }), e.prototype.init = function (t) {
        t && (null != t.money && (this.money = t.money), null != t.gfc && (this.giftCoupon = t.gfc), null != t.tgfc && (this.todayGiftCoupon = t.tgfc));
      }, e.prototype.onNewDayHandler = function () {
        this.todayGiftCoupon = 0;
      }, e;
    }(r.default);n.default = l, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Core/NumValue": "NumValue", "../../Common/Info/AbsInfo": "AbsInfo", "../../Common/Manager/Logger": "Logger" }], ProInfoCtr: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "e5297fdFKlBh4ilubv3I20p", "ProInfoCtr");var _o65,
        i = this && this.__extends || (_o65 = function o(t, e) {
      return (_o65 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o65(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../../Common/Core/GameType"),
        a = t("../../../Common/Manager/Logger"),
        s = t("../../../Common/Manager/MusicManager"),
        c = t("../../../Common/UI/UIItem"),
        l = t("../../../Common/UI/UIManager"),
        u = t("../../../Common/Util/ComponentUtil"),
        f = t("../../Info/PlayerInfo"),
        d = t("../CoinExchangePanel"),
        h = function (t) {
      function e(e) {
        return t.call(this, e) || this;
      }return i(e, t), e.prototype.init = function () {
        t.prototype.init.call(this), this.txt_money = u.default.getComponent(cc.Label, this.node, "minfo/txt_value"), this.txt_jq = u.default.getComponent(cc.Label, this.node, "jinfo/txt_value"), this.btn_add = u.default.getNode(this.node, "jinfo/btn_add"), this.btn_add.on(cc.Node.EventType.TOUCH_END, this.onTouchAddHandler, this), f.default.ins.on(r.InfoEvent.EVENT_CHANGE, this.dataChange, this);
      }, e.prototype.onTouchAddHandler = function () {
        s.default.playEffect(s.default.CLICK), a.default.log("----------onTouchAddHandler-----------------"), l.default.show(d.default);
      }, e.prototype.onShow = function () {
        this.dataChange();
      }, e.prototype.dataChange = function () {
        a.default.log("----------dataChange-----------------"), this.txt_money.string = f.default.ins.money.toString(), this.txt_jq.string = f.default.ins.giftCoupon.toString();
      }, e.prototype.destroy = function () {
        t.prototype.destroy.call(this);
      }, e;
    }(c.default);n.default = h, cc._RF.pop();
  }, { "../../../Common/Core/GameType": "GameType", "../../../Common/Manager/Logger": "Logger", "../../../Common/Manager/MusicManager": "MusicManager", "../../../Common/UI/UIItem": "UIItem", "../../../Common/UI/UIManager": "UIManager", "../../../Common/Util/ComponentUtil": "ComponentUtil", "../../Info/PlayerInfo": "PlayerInfo", "../CoinExchangePanel": "CoinExchangePanel" }], ProductConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "06feaIRXS9HFpRXA78CuTUF", "ProductConfig");var _o66,
        i = this && this.__extends || (_o66 = function o(t, e) {
      return (_o66 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o66(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Config/AbsConfig"),
        a = t("./item/ProductData"),
        s = function (t) {
      function e() {
        return t.call(this, a.default) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e._ins = null, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../Common/Config/AbsConfig": "AbsConfig", "./item/ProductData": "ProductData" }], ProductData: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "c35b0nKfc5LL4Tn6ydYAMzA", "ProductData"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        this._id = t.attributes.id, this._name = t.attributes.name, this._type = t.attributes.type, this._kind = t.attributes.kind, this._icon = t.attributes.icon, this._cmd = t.attributes.cmd, this._cmd_ios = t.attributes.cmd_ios, this._fun_script = t.attributes.fun_script, this._fun_para = t.attributes.fun_para, this._model = t.attributes.model, this._effect = t.attributes.effect, this._desc = t.attributes.desc;
      }return Object.defineProperty(t.prototype, "id", { get: function get() {
          return this._id;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "name", { get: function get() {
          return this._name;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "type", { get: function get() {
          return this._type;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "kind", { get: function get() {
          return this._kind;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "icon", { get: function get() {
          return this._icon;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "cmd", { get: function get() {
          return this._cmd;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "cmd_ios", { get: function get() {
          return this._cmd_ios;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "fun_script", { get: function get() {
          return this._fun_script;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "fun_para", { get: function get() {
          return this._fun_para;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "model", { get: function get() {
          return this._model;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "effect", { get: function get() {
          return this._effect;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "desc", { get: function get() {
          return this._desc;
        }, enumerable: !1, configurable: !0 }), t.cfgFile = "product", t;
    }();n.default = o, cc._RF.pop();
  }, {}], QueuePanelManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "e9783oOyIdJtLIuGyCNh+JM", "QueuePanelManager"), Object.defineProperty(n, "__esModule", { value: !0 }), n.QueuePanelItem = void 0;var o = t("../../Common/Manager/GlobalEventManager"),
        i = t("../../Common/UI/UIManager"),
        r = t("../../Common/Manager/TimeManager"),
        a = t("../../Common/Core/GameType"),
        s = function s(t, e, n) {
      void 0 === e && (e = null), void 0 === n && (n = 0), this.clazz = t, this.data = e, this.delay = n;
    };n.QueuePanelItem = s;var c = function () {
      function t() {}return t.init = function () {
        o.default.on(a.UIEvent.EVENT_CLOSE, t.onPanleCloseHandler, t);
      }, t.onPanleCloseHandler = function (e) {
        t._curItem && (e[0] instanceof t._curItem.clazz ? t.show() : t._curItem = null);
      }, t.add = function (e, n, o) {
        void 0 === n && (n = null), void 0 === o && (o = 0);var i = new s(e, n, o);t._list.push(i);
      }, t.show = function () {
        if (t._list.length > 0) {
          var e = t._list.shift();t._curItem = e, e.delay > 0 ? r.default.add(function () {
            i.default.show(e.clazz, e.data);
          }, t, e.delay, 1) : i.default.show(e.clazz, e.data);
        } else t._curItem = null;
      }, t.clear = function () {
        r.default.removeTarget(t), t._list.splice(0, t._list.length), t._curItem = null;
      }, Object.defineProperty(t, "isShowing", { get: function get() {
          return null != t._curItem;
        }, enumerable: !1, configurable: !0 }), t._list = [], t;
    }();n.default = c, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/GlobalEventManager": "GlobalEventManager", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/UI/UIManager": "UIManager" }], RankPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "8dd52IsIFtHbp2om0wVKraN", "RankPanel");var _o67,
        i = this && this.__extends || (_o67 = function o(t, e) {
      return (_o67 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o67(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.GRankItem = n.RankCtr = n.RankItem = n.GRankDataType = n.GRankType = void 0;var a,
        s,
        c = t("../../Common/UI/UIPanel"),
        l = t("../../Common/Util/ComponentUtil"),
        u = t("../../Common/Manager/MusicManager"),
        f = t("../../Common/Core/GameType"),
        d = t("../../Common/UI/UIManager"),
        h = t("../../Common/Sdks/GameSDK"),
        p = t("../../Common/Sdks/UmaTrackHelper"),
        _ = t("../../Common/UI/UIItem"),
        m = t("./SubContextViewController"),
        g = t("../Manager/CommandController"),
        y = cc._decorator,
        b = y.ccclass;y.property, function (t) {
      t[t.showByData = 1] = "showByData", t[t.showByOpenData = 2] = "showByOpenData";
    }(a = n.GRankType || (n.GRankType = {})), function (t) {
      t[t.none = 0] = "none", t[t.rankRlz = 1] = "rankRlz", t[t.rankPk = 2] = "rankPk";
    }(s = n.GRankDataType || (n.GRankDataType = {}));var C = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.init = function () {
        this.txt_name = l.default.getComponent(cc.Label, this.node, "txt_name"), this.txt_num = l.default.getComponent(cc.Label, this.node, "txt_num"), this.txt_index = l.default.getComponent(cc.Label, this.node, "txt_index"), this.icon_head = l.default.getComponent(cc.Sprite, this.node, "mask/icon_head"), this.selected = l.default.getNode(this.node, "selected"), this.wsb = l.default.getNode(this.node, "wsb"), this.setSelected(!1);
      }, e.prototype.setSelected = function (t) {
        this.selected.active = t;
      }, e.prototype.onShow = function () {}, e.prototype.onClose = function () {}, e.prototype.setData = function (t, e) {
        this.data = t;var n = t.id,
            o = 0;e == s.rankRlz ? o = t.rlz : e == s.rankPk && (o = t.pkp), null == o && (o = 0);var i = t.nick,
            r = (t.uid, t.atl);null == i && (i = ""), null == r && (r = "null"), n > 0 ? (null != r && "" != r && "null" != r && l.default.loadRemoteImg(this.icon_head, r), this.txt_index.string = 1 == n ? "a" : 2 == n ? "b" : 3 == n ? "c" : n.toString(), this.txt_name.string = i, this.txt_num.string = o.toString(), null != this.wsb && (this.wsb.active = !1)) : (null != this.wsb && (this.wsb.active = !0), this.txt_index.string = "", this.txt_name.string = i, this.txt_num.string = "");
      }, e.prototype.destroy = function () {
        t.prototype.destroy.call(this), this.txt_name = null, this.txt_num = null, this.txt_index = null, this.icon_head = null;
      }, e;
    }(_.default);n.RankItem = C;var v = function (t) {
      function e() {
        var e = null !== t && t.apply(this, arguments) || this;return e.hasGetDataForServer = !1, e;
      }return i(e, t), e.prototype.init = function () {
        this.contextView = l.default.getNode(this.node, "contextView"), this.scrollview = l.default.getComponent(cc.ScrollView, this.node, "scrollview"), this.UItem = l.default.getNode(this.node, "UItem"), this.UItem.active = !1, this.rankItems = Array();var t = l.default.getNode(this.node, "myItem");this._myItem = new C(t);
      }, e.prototype.setCfData = function (t, e, n) {
        this._type = t, this._dataType = n, this._showAndCloseCallId = e;
      }, e.prototype.showRank = function () {
        switch (this._showAndCloseCallId) {case 1:
            m.default.ins.showRank1(this.contextView);break;case 2:
            m.default.ins.showRank2(this.contextView);}
      }, e.prototype.closeRank = function () {
        switch (this._showAndCloseCallId) {case 1:
            m.default.ins.closeRank1(this.contextView);break;case 2:
            m.default.ins.closeRank2(this.contextView);}
      }, e.prototype.initScrollViewData = function (t, e) {
        for (var n = this.rankItems.length, o = 0; o < n; o++) {
          this.rankItems[o].destroy();
        }this.rankItems = new Array(), this.scrollview.content.removeAllChildren();var i = h.default.getUid();for (n = t.length, o = 0; o < n; o++) {
          var r = t[o],
              a = cc.instantiate(this.UItem),
              s = new C(a);s.setData(r, this._dataType), a.active = !0, this.scrollview.content.addChild(a), i == r.uid ? s.setSelected(!0) : s.setSelected(!1);
        }e.nick = h.default.getNickname(), e.atl = h.default.getIcon(), this._myItem.setSelected(!0), this._myItem.setData(e, this._dataType);
      }, e.prototype.onShow = function () {
        switch (this._type) {case a.showByData:
            this.contextView.active = !1, this.scrollview.node.active = !0, this._dataType == s.rankPk ? this.hasGetDataForServer || (g.default.rankPk(this.getRankSuccess, this, this.getRankFail), this.hasGetDataForServer = !0) : this._dataType == s.rankRlz && (this.hasGetDataForServer || (g.default.rankRlz(this.getRankSuccess, this, this.getRankFail), this.hasGetDataForServer = !0));break;case a.showByOpenData:
            this.contextView.active = !0, this.scrollview.node.active = !1, this._myItem.active = !1, this.showRank();}
      }, e.prototype.getRankSuccess = function (t) {
        var e = t.my,
            n = t.l;this.initScrollViewData(n, e);
      }, e.prototype.getRankFail = function () {}, e.prototype.onClose = function () {
        switch (this._type) {case a.showByData:
            break;case a.showByOpenData:
            this.closeRank();}
      }, e.prototype.destroy = function () {
        t.prototype.destroy.call(this);
      }, e;
    }(_.default);n.RankCtr = v;var I = function (t) {
      function e(e, n, o, i, r, a) {
        void 0 === o && (o = -1), void 0 === i && (i = -1), void 0 === r && (r = s.none), void 0 === a && (a = s.none);var c = t.call(this, e) || this;return c.ranks[0].setCfData(n, o, r), c.ranks[1].setCfData(n, i, a), c;
      }return i(e, t), e.prototype.init = function () {
        this.toggleCt = l.default.getComponent(cc.ToggleContainer, this.node, "toggleCt");var t = l.default.getNode(this.node, "rank0"),
            e = l.default.getNode(this.node, "rank1");this.ranks = new Array(), this.ranks.push(new v(t)), this.ranks.push(new v(e)), this.setOnToggleByName("toggle1");
      }, e.prototype.onToggle = function (t) {
        var e = t.node.name;this.setOnToggleByName(e);
      }, e.prototype.setOnToggleByName = function (t) {
        "toggle1" == t ? (this.ranks[0].x = 0, this.ranks[1].x = -2e3, this.ranks[0].onShow()) : "toggle2" == t && (this.ranks[0].x = -2e3, this.ranks[1].x = 0, this.ranks[1].onShow());
      }, e.prototype.onShow = function () {
        this.ranks[0].hasGetDataForServer = !1, this.ranks[1].hasGetDataForServer = !1, this.ranks[0].onShow();
      }, e.prototype.onClose = function () {
        this.ranks[0].onClose(), this.ranks[1].onClose();
      }, e.prototype.destroy = function () {
        t.prototype.destroy.call(this);for (var e = this.ranks.length, n = 0; n < e; n++) {
          this.ranks[n].destroy();
        }this.ranks = null;
      }, e;
    }(_.default);n.GRankItem = I;var M = function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return f.UILayerType.SubPopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = l.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.toggle = l.default.getComponent(cc.ToggleContainer, this.node, "frame/toggle");var t = l.default.getNode(this.node, "frame/rankG0"),
            e = l.default.getNode(this.node, "frame/rankG1");this.granks = new Array(), this.granks.push(new I(t, a.showByOpenData, 1, 2)), this.granks.push(new I(e, a.showByData, -1, -1, s.rankRlz, s.rankPk)), this._showTg(0);
      }, e.prototype.onToggle = function (t) {
        var e = t.node.name;"toggle1" == e ? this._showTg(0) : "toggle2" == e && this._showTg(1);
      }, e.prototype.onOtherToggle = function (t, e) {
        "rankG0" == e ? this.granks[0].onToggle(t) : "rankG1" == e && this.granks[1].onToggle(t);
      }, e.prototype.onShow = function () {
        h.default.hideBannerAd(), p.default.trackEvent("1101");for (var t = this.granks.length, e = 0; e < t; e++) {
          this.granks[e].onShow();
        }
      }, e.prototype._showTg = function (t) {
        for (var e = this.granks.length, n = 0; n < e; n++) {
          this.granks[n].active = n == t;
        }1 == t && (this.granks[1].onShow(), this.granks[1].ranks[0].onShow());
      }, e.prototype.onClose = function () {
        for (var t = this.granks.length, e = 0; e < t; e++) {
          this.granks[e].onClose();
        }
      }, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this);for (var e = this.granks.length, n = 0; n < e; n++) {
          this.granks[n].destroy();
        }this.granks = null;
      }, e.prototype.onTouchCloseHandler = function () {
        u.default.playEffect(u.default.CLICK), d.default.close(this);
      }, e.prototype.shareCall = function () {}, r([b], e);
    }(c.default);n.default = M, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIItem": "UIItem", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Manager/CommandController": "CommandController", "./SubContextViewController": "SubContextViewController" }], RePlayAnswerConfirm: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "71e53evCjRIMJMEYi3FYmk5", "RePlayAnswerConfirm");var _o68,
        i = this && this.__extends || (_o68 = function o(t, e) {
      return (_o68 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o68(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Core/GameType"),
        c = t("../../Common/Util/ComponentUtil"),
        l = t("../../Common/Manager/MusicManager"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Net/GameClient"),
        d = cc._decorator,
        h = d.ccclass,
        p = (d.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return s.UILayerType.SubPopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = c.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_ok = c.default.getComponent(cc.Button, this.node, "frame/btn_ok"), this.btn_ok.node.on(cc.Node.EventType.TOUCH_END, this.onTouchOKHandler, this);
      }, e.prototype.onShow = function () {
        f.default.ins.addPacketDataListener(529, this.cmd0x0211Handler, this);
      }, e.prototype.onClose = function () {
        f.default.ins.removeAll(this);
      }, e.prototype.onTouchCloseHandler = function () {
        l.default.playEffect(l.default.CLICK), this.answerRePlay(0);
      }, e.prototype.onTouchOKHandler = function () {
        l.default.playEffect(l.default.CLICK), this.answerRePlay(1);
      }, e.prototype.answerRePlay = function (t) {
        f.default.ins.send(529, { rid: this.data.rid, agree: t });
      }, e.prototype.cmd0x0211Handler = function (t) {
        t.isError || (t.body, u.default.close(this));
      }, e.prototype.onDestroy = function () {
        this.btn_close.node.targetOff(this), this.btn_ok.node.targetOff(this), t.prototype.onDestroy.call(this);
      }, r([h], e);
    }(a.default));n.default = p, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Net/GameClient": "GameClient" }], ReceiveGiftTips: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "99915gQso1JpbMDsvuLVZU9", "ReceiveGiftTips");var _o69,
        i = this && this.__extends || (_o69 = function o(t, e) {
      return (_o69 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o69(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.ReceiveGiftTipsData = n.ReceiveGiftTipType = void 0;var a,
        s = t("../../Common/UI/UIPanel"),
        c = t("../../Common/Util/ComponentUtil"),
        l = t("../../Common/Manager/MusicManager"),
        u = t("../../Common/Core/GameType"),
        f = t("../../Common/UI/UIManager"),
        d = t("../../Common/Sdks/UmaTrackHelper"),
        h = t("../../Common/Manager/LoadResManager"),
        p = cc._decorator,
        _ = p.ccclass;p.property, function (t) {
      t[t.ForSign = 1] = "ForSign", t[t.ForShop = 2] = "ForShop", t[t.ForVideoAD = 3] = "ForVideoAD";
    }(a = n.ReceiveGiftTipType || (n.ReceiveGiftTipType = {}));n.ReceiveGiftTipsData = function () {};var m = function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return u.UILayerType.TopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = c.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.sp_count_label = c.default.getComponent(cc.Label, this.node, "frame/sp_item/sp_count"), this.sp_icon_sprite = c.default.getComponent(cc.Sprite, this.node, "frame/sp_item/sp_icon"), this.lb_name0 = c.default.getNode(this.node, "frame/lb_name0"), this.lb_name1 = c.default.getNode(this.node, "frame/lb_name1");
      }, e.prototype.onShow = function () {
        d.default.trackEvent("1001"), this.init(this.data);
      }, e.prototype.onClose = function () {}, e.prototype.init = function (t) {
        switch (this.sp_count_label.string = t.name + "X" + t.count, h.default.loadSprite(this.sp_icon_sprite, "Atlas/atlas_item/" + t.icon), t.type) {case a.ForSign:
            this.lb_name0.active = !0, this.lb_name1.active = !1;break;case a.ForShop:
            this.lb_name0.active = !1, this.lb_name1.active = !0;}
      }, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this);
      }, e.prototype.onTouchCloseHandler = function () {
        l.default.playEffect(l.default.CLICK), d.default.trackEvent("1002"), f.default.close(this);
      }, r([_], e);
    }(s.default);n.default = m, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil" }], RlzConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "879105MMSxB9okUZe4zGwBv", "RlzConfig");var _o70,
        i = this && this.__extends || (_o70 = function o(t, e) {
      return (_o70 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o70(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Config/AbsConfig"),
        a = t("./item/RlzData"),
        s = function (t) {
      function e() {
        return t.call(this, a.default) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.getPerByRlz = function (t) {
        for (var e = this._list.length, n = 0; n < e; n++) {
          var o = this._list[n];if (o.rlz >= t) return o.per;
        }return this._list[0].per;
      }, e._ins = null, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../Common/Config/AbsConfig": "AbsConfig", "./item/RlzData": "RlzData" }], RlzData: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "61060vGcC9LurnF1SdWmI4A", "RlzData"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        this._id = t.attributes.id, this._rlz = t.attributes.rlz, this._per = t.attributes.per;
      }return Object.defineProperty(t.prototype, "id", { get: function get() {
          return this._id;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "rlz", { get: function get() {
          return this._rlz;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "per", { get: function get() {
          return this._per;
        }, enumerable: !1, configurable: !0 }), t.cfgFile = "rlz", t;
    }();n.default = o, cc._RF.pop();
  }, {}], RoleConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "f6497BkbNVBnJdCdkOgJx7y", "RoleConfig");var _o71,
        i = this && this.__extends || (_o71 = function o(t, e) {
      return (_o71 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o71(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Config/AbsConfig"),
        a = t("../../Common/Manager/Logger"),
        s = t("./item/RoleData"),
        c = function (t) {
      function e() {
        return t.call(this, s.default) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.get_next_id = function (t) {
        var e = this._list.length;a.default.log("------------get_next_id----0--------- len " + e);for (var n = 0; n < e; n++) {
          if (this._list[n].id == t) return a.default.log("------------get_next_id--i " + n), n < e - 1 ? (a.default.log("------------get_next_id--i+1 " + (n + 1)), this._list[n + 1].id) : (a.default.log("this._list "), a.default.log(this._list), this._list[0].id);
        }return a.default.log("------------get_next_id----0---------"), 0;
      }, e.prototype.get_per_id = function (t) {
        a.default.log("------------get_per_id----curr_id " + t);for (var e = this._list.length, n = 0; n < e; n++) {
          if (this._list[n].id == t) return n > 0 ? this._list[n - 1].id : this._list[e - 1].id;
        }return a.default.log("------------get_per_id----0---------"), 0;
      }, e._ins = null, e.def_id = 1, e;
    }(r.default);n.default = c, cc._RF.pop();
  }, { "../../Common/Config/AbsConfig": "AbsConfig", "../../Common/Manager/Logger": "Logger", "./item/RoleData": "RoleData" }], RoleData: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "85989ZjKlxNsY9eTvrvUB7l", "RoleData"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        this._id = t.attributes.id, this._name = t.attributes.name, this._model = t.attributes.model, this._need_vip = t.attributes.need_vip;
      }return Object.defineProperty(t.prototype, "id", { get: function get() {
          return this._id;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "name", { get: function get() {
          return this._name;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "model", { get: function get() {
          return this._model;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "need_vip", { get: function get() {
          return this._need_vip;
        }, enumerable: !1, configurable: !0 }), t.cfgFile = "role", t;
    }();n.default = o, cc._RF.pop();
  }, {}], SHA1: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "8ffe8bak9lO5otiwmn8OCBk", "SHA1"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t() {
        this.hexcase = 0, this.b64pad = "";
      }return Object.defineProperty(t, "ins", { get: function get() {
          return t._ins || (t._ins = new t()), t._ins;
        }, enumerable: !1, configurable: !0 }), t.prototype.hex_sha1 = function (t) {
        return this.rstr2hex(this.rstr_sha1(this.str2rstr_utf8(t)));
      }, t.prototype.b64_sha1 = function (t) {
        return this.rstr2b64(this.rstr_sha1(this.str2rstr_utf8(t)));
      }, t.prototype.any_sha1 = function (t, e) {
        return this.rstr2any(this.rstr_sha1(this.str2rstr_utf8(t)), e);
      }, t.prototype.hex_hmac_sha1 = function (t, e) {
        return this.rstr2hex(this.rstr_hmac_sha1(this.str2rstr_utf8(t), this.str2rstr_utf8(e)));
      }, t.prototype.b64_hmac_sha1 = function (t, e) {
        return this.rstr2b64(this.rstr_hmac_sha1(this.str2rstr_utf8(t), this.str2rstr_utf8(e)));
      }, t.prototype.any_hmac_sha1 = function (t, e, n) {
        return this.rstr2any(this.rstr_hmac_sha1(this.str2rstr_utf8(t), this.str2rstr_utf8(e)), n);
      }, t.prototype.sha1_vm_test = function () {
        return "a9993e364706816aba3e25717850c26c9cd0d89d" == this.hex_sha1("abc").toLowerCase();
      }, t.prototype.rstr_sha1 = function (t) {
        return this.binb2rstr(this.binb_sha1(this.rstr2binb(t), 8 * t.length));
      }, t.prototype.rstr_hmac_sha1 = function (t, e) {
        var n = this.rstr2binb(t);n.length > 16 && (n = this.binb_sha1(n, 8 * t.length));for (var o = Array(16), i = Array(16), r = 0; r < 16; r++) {
          o[r] = 909522486 ^ n[r], i[r] = 1549556828 ^ n[r];
        }var a = this.binb_sha1(o.concat(this.rstr2binb(e)), 512 + 8 * e.length);return this.binb2rstr(this.binb_sha1(i.concat(a), 672));
      }, t.prototype.rstr2hex = function (t) {
        try {
          this.hexcase;
        } catch (r) {
          this.hexcase = 0;
        }for (var e, n = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef", o = "", i = 0; i < t.length; i++) {
          e = t.charCodeAt(i), o += n.charAt(e >>> 4 & 15) + n.charAt(15 & e);
        }return o;
      }, t.prototype.rstr2b64 = function (t) {
        try {
          this.b64pad;
        } catch (a) {
          this.b64pad = "";
        }for (var e = "", n = t.length, o = 0; o < n; o += 3) {
          for (var i = t.charCodeAt(o) << 16 | (o + 1 < n ? t.charCodeAt(o + 1) << 8 : 0) | (o + 2 < n ? t.charCodeAt(o + 2) : 0), r = 0; r < 4; r++) {
            8 * o + 6 * r > 8 * t.length ? e += this.b64pad : e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(i >>> 6 * (3 - r) & 63);
          }
        }return e;
      }, t.prototype.rstr2any = function (t, e) {
        var n,
            o,
            i,
            r,
            a = e.length,
            s = Array(),
            c = Array(Math.ceil(t.length / 2));for (n = 0; n < c.length; n++) {
          c[n] = t.charCodeAt(2 * n) << 8 | t.charCodeAt(2 * n + 1);
        }for (; c.length > 0;) {
          for (r = Array(), i = 0, n = 0; n < c.length; n++) {
            i = (i << 16) + c[n], i -= (o = Math.floor(i / a)) * a, (r.length > 0 || o > 0) && (r[r.length] = o);
          }s[s.length] = i, c = r;
        }var l = "";for (n = s.length - 1; n >= 0; n--) {
          l += e.charAt(s[n]);
        }var u = Math.ceil(8 * t.length / (Math.log(e.length) / Math.log(2)));for (n = l.length; n < u; n++) {
          l = e[0] + l;
        }return l;
      }, t.prototype.str2rstr_utf8 = function (t) {
        for (var e, n, o = "", i = -1; ++i < t.length;) {
          e = t.charCodeAt(i), n = i + 1 < t.length ? t.charCodeAt(i + 1) : 0, 55296 <= e && e <= 56319 && 56320 <= n && n <= 57343 && (e = 65536 + ((1023 & e) << 10) + (1023 & n), i++), e <= 127 ? o += String.fromCharCode(e) : e <= 2047 ? o += String.fromCharCode(192 | e >>> 6 & 31, 128 | 63 & e) : e <= 65535 ? o += String.fromCharCode(224 | e >>> 12 & 15, 128 | e >>> 6 & 63, 128 | 63 & e) : e <= 2097151 && (o += String.fromCharCode(240 | e >>> 18 & 7, 128 | e >>> 12 & 63, 128 | e >>> 6 & 63, 128 | 63 & e));
        }return o;
      }, t.prototype.str2rstr_utf16le = function (t) {
        for (var e = "", n = 0; n < t.length; n++) {
          e += String.fromCharCode(255 & t.charCodeAt(n), t.charCodeAt(n) >>> 8 & 255);
        }return e;
      }, t.prototype.str2rstr_utf16be = function (t) {
        for (var e = "", n = 0; n < t.length; n++) {
          e += String.fromCharCode(t.charCodeAt(n) >>> 8 & 255, 255 & t.charCodeAt(n));
        }return e;
      }, t.prototype.rstr2binb = function (t) {
        for (var e = Array(t.length >> 2), n = 0; n < e.length; n++) {
          e[n] = 0;
        }for (n = 0; n < 8 * t.length; n += 8) {
          e[n >> 5] |= (255 & t.charCodeAt(n / 8)) << 24 - n % 32;
        }return e;
      }, t.prototype.binb2rstr = function (t) {
        for (var e = "", n = 0; n < 32 * t.length; n += 8) {
          e += String.fromCharCode(t[n >> 5] >>> 24 - n % 32 & 255);
        }return e;
      }, t.prototype.binb_sha1 = function (t, e) {
        t[e >> 5] |= 128 << 24 - e % 32, t[15 + (e + 64 >> 9 << 4)] = e;for (var n = Array(80), o = 1732584193, i = -271733879, r = -1732584194, a = 271733878, s = -1009589776, c = 0; c < t.length; c += 16) {
          for (var l = o, u = i, f = r, d = a, h = s, p = 0; p < 80; p++) {
            n[p] = p < 16 ? t[c + p] : this.bit_rol(n[p - 3] ^ n[p - 8] ^ n[p - 14] ^ n[p - 16], 1);var _ = this.safe_add(this.safe_add(this.bit_rol(o, 5), this.sha1_ft(p, i, r, a)), this.safe_add(this.safe_add(s, n[p]), this.sha1_kt(p)));s = a, a = r, r = this.bit_rol(i, 30), i = o, o = _;
          }o = this.safe_add(o, l), i = this.safe_add(i, u), r = this.safe_add(r, f), a = this.safe_add(a, d), s = this.safe_add(s, h);
        }return [o, i, r, a, s];
      }, t.prototype.sha1_ft = function (t, e, n, o) {
        return t < 20 ? e & n | ~e & o : t < 40 ? e ^ n ^ o : t < 60 ? e & n | e & o | n & o : e ^ n ^ o;
      }, t.prototype.sha1_kt = function (t) {
        return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
      }, t.prototype.safe_add = function (t, e) {
        var n = (65535 & t) + (65535 & e);return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n;
      }, t.prototype.bit_rol = function (t, e) {
        return t << e | t >>> 32 - e;
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], SHA256: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "de69c39dExKOpmrKp5bOYzs", "SHA256"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t() {
        this.hexcase = 0, this.b64pad = "", this.sha256_K = new Array(1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998);
      }return t.hex_sha256 = function (e) {
        return new t().hex_sha256(e);
      }, t.prototype.hex_sha256 = function (t) {
        return this.rstr2hex(this.rstr_sha256(this.str2rstr_utf8(t)));
      }, t.prototype.b64_sha256 = function (t) {
        return this.rstr2b64(this.rstr_sha256(this.str2rstr_utf8(t)));
      }, t.prototype.any_sha256 = function (t, e) {
        return this.rstr2any(this.rstr_sha256(this.str2rstr_utf8(t)), e);
      }, t.prototype.hex_hmac_sha256 = function (t, e) {
        return this.rstr2hex(this.rstr_hmac_sha256(this.str2rstr_utf8(t), this.str2rstr_utf8(e)));
      }, t.prototype.b64_hmac_sha256 = function (t, e) {
        return this.rstr2b64(this.rstr_hmac_sha256(this.str2rstr_utf8(t), this.str2rstr_utf8(e)));
      }, t.prototype.any_hmac_sha256 = function (t, e, n) {
        return this.rstr2any(this.rstr_hmac_sha256(this.str2rstr_utf8(t), this.str2rstr_utf8(e)), n);
      }, t.prototype.sha256_vm_test = function () {
        return "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" == this.hex_sha256("abc").toLowerCase();
      }, t.prototype.rstr_sha256 = function (t) {
        return this.binb2rstr(this.binb_sha256(this.rstr2binb(t), 8 * t.length));
      }, t.prototype.rstr_hmac_sha256 = function (t, e) {
        var n = this.rstr2binb(t);n.length > 16 && (n = this.binb_sha256(n, 8 * t.length));for (var o = Array(16), i = Array(16), r = 0; r < 16; r++) {
          o[r] = 909522486 ^ n[r], i[r] = 1549556828 ^ n[r];
        }var a = this.binb_sha256(o.concat(this.rstr2binb(e)), 512 + 8 * e.length);return this.binb2rstr(this.binb_sha256(i.concat(a), 768));
      }, t.prototype.rstr2hex = function (t) {
        try {
          this.hexcase;
        } catch (r) {
          this.hexcase = 0;
        }for (var e, n = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef", o = "", i = 0; i < t.length; i++) {
          e = t.charCodeAt(i), o += n.charAt(e >>> 4 & 15) + n.charAt(15 & e);
        }return o;
      }, t.prototype.rstr2b64 = function (t) {
        try {
          this.b64pad;
        } catch (a) {
          this.b64pad = "";
        }for (var e = "", n = t.length, o = 0; o < n; o += 3) {
          for (var i = t.charCodeAt(o) << 16 | (o + 1 < n ? t.charCodeAt(o + 1) << 8 : 0) | (o + 2 < n ? t.charCodeAt(o + 2) : 0), r = 0; r < 4; r++) {
            8 * o + 6 * r > 8 * t.length ? e += this.b64pad : e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(i >>> 6 * (3 - r) & 63);
          }
        }return e;
      }, t.prototype.rstr2any = function (t, e) {
        var n,
            o,
            i,
            r,
            a = e.length,
            s = Array(),
            c = Array(Math.ceil(t.length / 2));for (n = 0; n < c.length; n++) {
          c[n] = t.charCodeAt(2 * n) << 8 | t.charCodeAt(2 * n + 1);
        }for (; c.length > 0;) {
          for (r = Array(), i = 0, n = 0; n < c.length; n++) {
            i = (i << 16) + c[n], i -= (o = Math.floor(i / a)) * a, (r.length > 0 || o > 0) && (r[r.length] = o);
          }s[s.length] = i, c = r;
        }var l = "";for (n = s.length - 1; n >= 0; n--) {
          l += e.charAt(s[n]);
        }var u = Math.ceil(8 * t.length / (Math.log(e.length) / Math.log(2)));for (n = l.length; n < u; n++) {
          l = e[0] + l;
        }return l;
      }, t.prototype.str2rstr_utf8 = function (t) {
        for (var e, n, o = "", i = -1; ++i < t.length;) {
          e = t.charCodeAt(i), n = i + 1 < t.length ? t.charCodeAt(i + 1) : 0, 55296 <= e && e <= 56319 && 56320 <= n && n <= 57343 && (e = 65536 + ((1023 & e) << 10) + (1023 & n), i++), e <= 127 ? o += String.fromCharCode(e) : e <= 2047 ? o += String.fromCharCode(192 | e >>> 6 & 31, 128 | 63 & e) : e <= 65535 ? o += String.fromCharCode(224 | e >>> 12 & 15, 128 | e >>> 6 & 63, 128 | 63 & e) : e <= 2097151 && (o += String.fromCharCode(240 | e >>> 18 & 7, 128 | e >>> 12 & 63, 128 | e >>> 6 & 63, 128 | 63 & e));
        }return o;
      }, t.prototype.str2rstr_utf16le = function (t) {
        for (var e = "", n = 0; n < t.length; n++) {
          e += String.fromCharCode(255 & t.charCodeAt(n), t.charCodeAt(n) >>> 8 & 255);
        }return e;
      }, t.prototype.str2rstr_utf16be = function (t) {
        for (var e = "", n = 0; n < t.length; n++) {
          e += String.fromCharCode(t.charCodeAt(n) >>> 8 & 255, 255 & t.charCodeAt(n));
        }return e;
      }, t.prototype.rstr2binb = function (t) {
        for (var e = Array(t.length >> 2), n = 0; n < e.length; n++) {
          e[n] = 0;
        }for (n = 0; n < 8 * t.length; n += 8) {
          e[n >> 5] |= (255 & t.charCodeAt(n / 8)) << 24 - n % 32;
        }return e;
      }, t.prototype.binb2rstr = function (t) {
        for (var e = "", n = 0; n < 32 * t.length; n += 8) {
          e += String.fromCharCode(t[n >> 5] >>> 24 - n % 32 & 255);
        }return e;
      }, t.prototype.sha256_S = function (t, e) {
        return t >>> e | t << 32 - e;
      }, t.prototype.sha256_R = function (t, e) {
        return t >>> e;
      }, t.prototype.sha256_Ch = function (t, e, n) {
        return t & e ^ ~t & n;
      }, t.prototype.sha256_Maj = function (t, e, n) {
        return t & e ^ t & n ^ e & n;
      }, t.prototype.sha256_Sigma0256 = function (t) {
        return this.sha256_S(t, 2) ^ this.sha256_S(t, 13) ^ this.sha256_S(t, 22);
      }, t.prototype.sha256_Sigma1256 = function (t) {
        return this.sha256_S(t, 6) ^ this.sha256_S(t, 11) ^ this.sha256_S(t, 25);
      }, t.prototype.sha256_Gamma0256 = function (t) {
        return this.sha256_S(t, 7) ^ this.sha256_S(t, 18) ^ this.sha256_R(t, 3);
      }, t.prototype.sha256_Gamma1256 = function (t) {
        return this.sha256_S(t, 17) ^ this.sha256_S(t, 19) ^ this.sha256_R(t, 10);
      }, t.prototype.sha256_Sigma0512 = function (t) {
        return this.sha256_S(t, 28) ^ this.sha256_S(t, 34) ^ this.sha256_S(t, 39);
      }, t.prototype.sha256_Sigma1512 = function (t) {
        return this.sha256_S(t, 14) ^ this.sha256_S(t, 18) ^ this.sha256_S(t, 41);
      }, t.prototype.sha256_Gamma0512 = function (t) {
        return this.sha256_S(t, 1) ^ this.sha256_S(t, 8) ^ this.sha256_R(t, 7);
      }, t.prototype.sha256_Gamma1512 = function (t) {
        return this.sha256_S(t, 19) ^ this.sha256_S(t, 61) ^ this.sha256_R(t, 6);
      }, t.prototype.binb_sha256 = function (t, e) {
        var n,
            o,
            i,
            r,
            a,
            s,
            c,
            l,
            u,
            f,
            d,
            h,
            p = new Array(1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225),
            _ = new Array(64);for (t[e >> 5] |= 128 << 24 - e % 32, t[15 + (e + 64 >> 9 << 4)] = e, u = 0; u < t.length; u += 16) {
          for (n = p[0], o = p[1], i = p[2], r = p[3], a = p[4], s = p[5], c = p[6], l = p[7], f = 0; f < 64; f++) {
            _[f] = f < 16 ? t[f + u] : this.safe_add(this.safe_add(this.safe_add(this.sha256_Gamma1256(_[f - 2]), _[f - 7]), this.sha256_Gamma0256(_[f - 15])), _[f - 16]), d = this.safe_add(this.safe_add(this.safe_add(this.safe_add(l, this.sha256_Sigma1256(a)), this.sha256_Ch(a, s, c)), this.sha256_K[f]), _[f]), h = this.safe_add(this.sha256_Sigma0256(n), this.sha256_Maj(n, o, i)), l = c, c = s, s = a, a = this.safe_add(r, d), r = i, i = o, o = n, n = this.safe_add(d, h);
          }p[0] = this.safe_add(n, p[0]), p[1] = this.safe_add(o, p[1]), p[2] = this.safe_add(i, p[2]), p[3] = this.safe_add(r, p[3]), p[4] = this.safe_add(a, p[4]), p[5] = this.safe_add(s, p[5]), p[6] = this.safe_add(c, p[6]), p[7] = this.safe_add(l, p[7]);
        }return p;
      }, t.prototype.safe_add = function (t, e) {
        var n = (65535 & t) + (65535 & e);return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n;
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], SdkDefault: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "5d745jaKulELIbzfkkmeal3", "SdkDefault");var _o72,
        i = this && this.__extends || (_o72 = function o(t, e) {
      return (_o72 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o72(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../Manager/GlobalEventManager"),
        a = t("../Core/GameType"),
        s = t("./AbstractSDK"),
        c = t("../Manager/SysConfig"),
        l = t("../Manager/TimeManager"),
        u = t("../Util/MathUtil"),
        f = t("../Util/NetUtil"),
        d = t("../Util/MD5"),
        h = t("../../Game/Tips/GeneralTips"),
        p = t("../UI/UIManager"),
        _ = t("../../Game/Main/ActivePanel"),
        m = t("../Manager/Logger"),
        g = t("../../Game/Fb/FbPkInvitePanel"),
        y = t("../../Game/Main/SignPanel"),
        b = function (t) {
      function e() {
        return t.call(this, a.SdkType.DEFAULT) || this;
      }return i(e, t), e.prototype.initSDK = function () {
        t.prototype.initSDK.call(this), this._ios = !1, r.default.dispatchEvent(a.InitStepEvent.INIT_SDK_FINISH);
      }, e.prototype.onShow = function () {
        (null != this._roomId || this._invoke) && (p.default.close(y.default), p.default.show(g.default)), r.default.dispatchEvent(a.GameEvent.Show);
      }, e.prototype.onHide = function () {
        r.default.dispatchEvent(a.GameEvent.Hide);
      }, e.prototype.login = function () {
        this.getAndCheckUid(), m.default.log("uid:", this.uid);var t = this,
            e = { gid: c.default.ID, sdk: this.sdkId, uid: this.uid, ios: this._ios };e.sign = d.default.hex_md5(e.gid + e.sdk + e.uid + c.default.CLIENT_KEY), f.default.encodePost(this.getLoginUrl(), e, function (e) {
          m.default.log("login:" + JSON.stringify(e)), e.uid ? (t._uid = e.uid, e.d ? l.default.upServerTime(e.d) : l.default.upServerTime(l.default.localTime), e.data && (t._remoteData = e.data, m.default.log(t._remoteData, "self._remoteData")), r.default.dispatchEvent(a.InitStepEvent.LOGIN_FINISH)) : h.default.show("\u767B\u5F55\u5931\u8D25");
        }, this);
      }, e.prototype.getAndCheckUid = function () {
        if (null == this._uid || "" == this._uid) {
          var t = cc.sys.localStorage.getItem(c.default.ID + c.default.NAME + "_UID");null == t && (t = l.default.serverTime.toString() + u.default.randomInt(1e3, 9999).toString(), cc.sys.localStorage.setItem(c.default.ID + c.default.NAME + "_UID", t)), this._uid = t;
        }
      }, e.prototype.logout = function (e) {
        t.prototype.logout.call(this, e);var n = { gid: c.default.ID, sdk: this.sdkId, uid: this.uid };n.sign = d.default.hex_md5(n.gid + n.sdk + n.uid + c.default.CLIENT_KEY), f.default.encodePost(this.getLogoutUrl(), n, function (t) {
          m.default.log("logout:" + JSON.stringify(t));
        }, this);
      }, e.prototype.shareRecVideo = function (t, e) {
        void 0 === t && (t = null), void 0 === e && (e = null), t && e && (m.default.log("----------shareRecVideo--------------"), t.call(e, !0), this.clearRecVideo());
      }, e.prototype.navigateToMiniGame = function (t) {
        m.default.log("navigateToMiniGame", t);
      }, e.prototype.openUrl = function (t, e) {
        void 0 === e && (e = 0), p.default.show(_.default, { t: e, url: t });
      }, e.prototype.shareInvite = function () {
        var t = u.default.randomInt(1e3, 9999).toString(),
            e = window.location.origin + "?roomId=" + t;console.log("assist url:", e);var n = c.default.CENTER_HOST + "/api/roomTest";f.default.POST(n, { activity_id: t, uid: this.uid }, function (t) {
          m.default.log(t);
        }, this), this._invoke = !0;
      }, e;
    }(s.default);n.default = b, cc._RF.pop();
  }, { "../../Game/Fb/FbPkInvitePanel": "FbPkInvitePanel", "../../Game/Main/ActivePanel": "ActivePanel", "../../Game/Main/SignPanel": "SignPanel", "../../Game/Tips/GeneralTips": "GeneralTips", "../Core/GameType": "GameType", "../Manager/GlobalEventManager": "GlobalEventManager", "../Manager/Logger": "Logger", "../Manager/SysConfig": "SysConfig", "../Manager/TimeManager": "TimeManager", "../UI/UIManager": "UIManager", "../Util/MD5": "MD5", "../Util/MathUtil": "MathUtil", "../Util/NetUtil": "NetUtil", "./AbstractSDK": "AbstractSDK" }], SdkQQ: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "9bb92rKh6xCFakuGxG08ksX", "SdkQQ");var _o73,
        i = this && this.__extends || (_o73 = function o(t, e) {
      return (_o73 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o73(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("./AbstractSDK"),
        a = t("../Manager/GlobalEventManager"),
        s = t("../Manager/SysConfig"),
        c = t("../Util/MD5"),
        l = t("../Util/NetUtil"),
        u = t("../Util/Base64"),
        f = t("../Core/GameType"),
        d = t("../Manager/TimeManager"),
        h = t("../UI/UIManager"),
        p = t("../../Game/Fb/FbEndPanel"),
        _ = t("../Manager/DataManager"),
        m = t("../../Game/Info/FbInfo"),
        g = t("../../Game/Manager/CommandController"),
        y = t("../Manager/Logger"),
        b = t("../../Game/Fb/FbPkInvitePanel"),
        C = t("../../Game/Fb/FbPkMatchPanel"),
        v = t("./UmaTrackHelper"),
        I = function (t) {
      function e() {
        var e = t.call(this, f.SdkType.QQ) || this;return e.AppID = "1110797565", e.AppSecret = "G3N6eUshKF27h89w", e.adUnitIds = { 1: "af9d664a37aa5006176d86f4ecca7e12", 2: "ff41912165c10195771ac07342bb3b10 ", 3: "d56a76238c4a53815fe81707b35731e6", 4: "aa60166e657c6470c2c1c1e63b22ab8b", 5: "5fd6be911dd88c7d54f99ed9a9bd1c69" }, e.bannerId = "352f49edff390ec6d1de7640790274dc", e.insertAdId = "3dbc9355f0f30a2ac50074bca1f79751", e._shareTime = 0, e._jump = !1, e._openUrlRevive = !1, e;
      }return i(e, t), e.prototype.initSDK = function () {
        if ("undefined" != typeof qq) {
          "ios" == qq.getSystemInfoSync().platform && (this._ios = !0), this.checkRoomId(), qq.showShareMenu({ withShareTicket: !0 });var t = this.getShareTitleAndImgUrl(),
              e = t[0],
              n = t[1];qq.uma.onShareAppMessage(function () {
            return { title: e, imageUrl: n };
          });var o = this;qq.onShow(function (t) {
            if (cc.game.pause(), cc.game.resume(), _.default.initFinish) {
              y.default.log("-----------onShow--------------", o._invoke, t), o.shareCheckCall(), o.navigateToCheckCall(), o.openUrlCheckCall(), o.isIos() || !t.scene || 2072 != t.scene && 4016 != t.scene && 4023 != t.scene && 3030 != t.scene && 2001 != t.scene && 1037 != t.scene || (o._roomId = "match");var e = t.query;e && e.roomId && (o._roomId = e.roomId, y.default.log("-----------onShow--roomId------------", o._roomId)), y.default.log("-----------last--roomId------------", o._roomId), o._invoke ? ("match" != o._roomId ? (y.default.log("-----------onshow FbPkInvitePanel------------", o._roomId), h.default.show(b.default)) : (y.default.log("-----------onshow FbPkMatchPanel------------", o._roomId), h.default.show(C.default)), v.default.trackEvent("1324")) : null != o._roomId && ("match" != o._roomId ? (y.default.log("-----------onshow FbPkInvitePanel------------", o._roomId), h.default.show(b.default)) : (y.default.log("-----------onshow FbPkMatchPanel------------", o._roomId), h.default.show(C.default)), v.default.trackEvent("1324"));
            }a.default.dispatchEvent(f.GameEvent.Show);
          }), qq.onHide(function () {
            a.default.dispatchEvent(f.GameEvent.Hide);
          }), a.default.dispatchEvent(f.InitStepEvent.INIT_SDK_FINISH), this._bannerOpen = !0, this._adOpen = !0;
        }
      }, e.prototype.checkRoomId = function () {
        var t = qq.getLaunchOptionsSync();y.default.log("getLaunchOptionsSync:", t), t && (4016 != t.scene && 2072 != t.scene || (this._roomId = "match"), t.query && t.query.roomId && (this._roomId = t.query.roomId)), y.default.log("getLaunchOptionsSync roomId:", this._roomId);
      }, e.prototype.login = function () {
        if ("undefined" != typeof qq) {
          var t = this;y.default.log("\u5F00\u59CB\u767B\u5F55"), qq.login({ success: function success(e) {
              if (y.default.log("login:" + e.code), e.code) {
                var n = { gid: s.default.ID, sdk: t.sdkId, uid: e.code, ios: t._ios };n.sign = c.default.hex_md5(n.gid + n.sdk + n.uid + s.default.CLIENT_KEY), l.default.encodePost(t.getLoginUrl(), n, function (e) {
                  y.default.log("login:" + JSON.stringify(e)), e.uid ? (t._uid = e.uid, e.d ? d.default.upServerTime(e.d) : d.default.upServerTime(d.default.localTime), e.data && (t._remoteData = e.data), qq.getSetting({ success: function success(e) {
                      y.default.log("--------1-----------", e), e.authSetting["scope.userInfo"] ? (qq.getUserInfo({ success: function success(e) {
                          y.default.log("--------2-----------", e), t.buildUserInfo(e.userInfo);
                        } }), y.default.log("--------3-----------", e)) : (y.default.log("--------4-----------", e), t.createUserInfoButton()), y.default.log("--------5-----------", e);
                    }, fail: function fail(t) {
                      y.default.log("fail:", t);
                    } })) : t.showToast("\u767B\u5F55\u5931\u8D25");
                }, this);
              } else t.showToast("\u767B\u5F55\u5931\u8D25");
            }, fail: function fail(e) {
              console.log(e), t.showToast("\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u662F\u5426\u7545\u901A\u3002");
            } });
        }
      }, e.prototype.logout = function (e) {
        t.prototype.logout.call(this, e);var n = { gid: s.default.ID, sdk: this.sdkId, uid: this.uid };n.sign = c.default.hex_md5(n.gid + n.sdk + n.uid + s.default.CLIENT_KEY), l.default.encodePost(this.getLogoutUrl(), n, function (t) {
          y.default.log("logout:" + JSON.stringify(t));
        }, this);
      }, e.prototype.createUserInfoButton1 = function () {
        var t = this,
            e = cc.view.getFrameSize(),
            n = (e.width - 200) / 2,
            o = 3 * e.height / 5,
            i = qq.createUserInfoButton({ type: "text", text: "\u6388\u6743\u767B\u5F55", style: { left: n, top: o, width: 200, height: 60, lineHeight: 40, backgroundColor: "#056DFF", color: "#000000", textAlign: "center", fontSize: 24, borderRadius: 4 } });i.onTap(function (e) {
          t.buildUserInfo(e.userInfo), i.hide(), i.destroy();
        });
      }, e.prototype.createUserInfoButton = function () {
        var t = cc.view.getFrameSize(),
            e = .81;t.height / t.width > 2 && (e = .75);var n = this,
            o = .74 * t.width,
            i = 153 * o / 529,
            r = (t.width - o) / 2,
            s = t.height * e - i / 2,
            c = cc.url.raw("resources/Texture/auth.png");y.default.log("url:", c), y.default.log(o, i, r, s);var l = qq.createUserInfoButton({ type: "image", image: c, style: { left: r, top: s, width: o, height: i } });l.onTap(function (t) {
          null != t.userInfo ? n.buildUserInfo(t.userInfo) : (y.default.log("--------6-----------", t), a.default.dispatchEvent(f.InitStepEvent.LOGIN_FINISH)), l.hide(), l.destroy();
        });
      }, e.prototype.buildUserInfo = function (t) {
        if (y.default.log("userInfo:", t), t) {
          this._icon = t.avatarUrl, this._nickname = t.nickName;var e = this,
              n = "",
              o = "";qq.getUserInfoExtra({ success: function success(t) {
              y.default.log("getUserInfoExtra success", t), t && t.encryptedData && (n = t.encryptedData, o = t.iv);
            }, fail: function fail(t) {
              y.default.log("getUserInfoExtra fail", t);
            }, complete: function complete() {
              y.default.log("getUserInfoExtra complete", e._vip), g.default.nickname(e._nickname, e._icon, n, o, function (t) {
                t && t.vip && (e._vip = t.vip, y.default.log("-----vip----", e._vip));
              }, this);
            } });
        }a.default.dispatchEvent(f.InitStepEvent.LOGIN_FINISH);
      }, e.prototype.readUserData = function () {
        try {
          var t = this.userKey(),
              e = qq.getStorageSync(t);return JSON.parse(u.default.decode(e));
        } catch (n) {
          return console.log("\u8BFB\u53D6\u6570\u636E\u5931\u8D25" + n), {};
        }
      }, e.prototype.saveUserData = function (t) {
        var e = this.userKey(),
            n = u.default.encode(JSON.stringify(t));return qq.setStorage({ key: e, data: n }), n;
      }, e.prototype.saveOpenData = function () {
        var t = { KVDataList: [{ key: "key1", value: m.default.ins.score.toString() }, { key: "key2", value: m.default.ins.pkPoint.toString() }], success: function success() {}, fail: function fail() {}, complete: function complete() {} };qq.setUserCloudStorage(t);
      }, e.prototype.postMessage = function (t) {
        "undefined" != typeof qq && (null == this._openDataContext && (this._openDataContext = qq.getOpenDataContext()), this._openDataContext && this._openDataContext.postMessage({ type: t, openid: this.uid, score: m.default.ins.score }));
      }, e.prototype.getRankData = function (t, e) {
        void 0 === t && (t = null), void 0 === e && (e = null), this.postMessage("LoadRank");
      }, e.prototype.share = function (t, e, n, o) {
        if (void 0 === t && (t = null), void 0 === e && (e = null), void 0 === n && (n = null), void 0 === o && (o = null), "undefined" != typeof qq && !(this._shareTime > 0)) {
          this._shareTime = Date.now();var i = this.getShareTitleAndImgUrl(),
              r = i[0],
              a = i[1];null != n && (r = n), null != o && (a = o), qq.uma.shareAppMessage({ title: r, query: "", imageUrl: a, success: function success() {
              y.default.log("qq\u5206\u4EAB\u6210\u529F");
            }, fail: function fail() {
              console.log("\u5206\u4EAB\u5931\u8D25");
            } }), t && e ? (this._shareCallBack = t, this._shareTarget = e) : this._shareTime = 0;
        }
      }, e.prototype.shareCheckCall = function () {
        this._shareTime > 0 && (Date.now() - (this._shareTime + 2e3) >= 0 ? this._shareCallBack.call(this._shareTarget) : this.showToast("\u5206\u4EAB\u5931\u8D25\uFF0C\u53EF\u4EE5\u5206\u4EAB\u5230\u522B\u7684\u7FA4\u8BD5\u8BD5\u3002"), this._shareTime = 0);
      }, e.prototype.checkVideoInit = function (t) {
        var e = this,
            n = this;!this._adOpen || null != this._videoAd && t == this._curAdId || (console.log("vadid => ", t), this._videoAd = qq.createRewardedVideoAd({ adUnitId: t }), this._videoAd.onClose(function (t) {
          t && t.isEnded && n._callback && n._target && n._callback.call(n._target, !0);
        }), this._videoAd.onError(function (t) {
          console.log("videoAd onError:" + JSON.stringify(t)), e.showToast("\u6FC0\u52B1\u89C6\u9891\u83B7\u53D6\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u6765");
        }), this._curAdId = t);
      }, e.prototype.showVideoAd = function (t, e, n) {
        if (void 0 === t && (t = null), void 0 === e && (e = null), "undefined" != typeof qq) if (this.checkVideoInit(this.adUnitIds[n]), this._adOpen) {
          this._callback = t, this._target = e;var o = this;this._videoAd.load().then(function () {
            y.default.log("\u6FC0\u52B1\u89C6\u9891\u52A0\u8F7D\u6210\u529F"), o._videoAd.show().then(function () {}).catch(function () {
              console.log("\u6FC0\u52B1\u89C6\u9891 \u5E7F\u544A\u663E\u793A\u5931\u8D25");
            });
          }).catch(function (t) {
            console.log("\u6FC0\u52B1\u89C6\u9891\u52A0\u8F7D\u5931\u8D25:" + t);
          });
        } else this.showToast("\u529F\u80FD\u6682\u4E0D\u5F00\u653E");
      }, e.prototype.hideVideoAd = function () {}, e.prototype.showBannerAd = function () {
        if ("undefined" != typeof qq) {
          null != this._bannerAd && (this._bannerAd.destroy(), this._bannerAd = null);var t = this,
              e = qq.getSystemInfoSync(),
              n = e.screenWidth,
              o = 9 * n / 16;this._bannerAd = qq.createBannerAd({ adUnitId: t.bannerId, testDemoType: 65, style: { top: e.screenHeight - o / 2 + 10, left: (e.screenWidth - n) / 2, width: n } }), this._bannerAd.onError(function (t) {
            console.log("bannerAd onError", t);
          }), this._bannerAd.onLoad(function () {
            a.default.dispatchEvent(f.SdkEvent.BANNER_ONLOAD);
          }), this._bannerAd.onResize(function (i) {
            var r = i.height;n != i.width && (n = i.width, o = r, t._bannerAd.style.top = e.screenHeight - r / 2 + 10, t._bannerAd.style.left = (e.screenWidth - i.width) / 2);
          }), this._bannerAd.show();
        }
      }, e.prototype.hideBannerAd = function () {
        "undefined" != typeof qq && this._bannerAd && this._bannerAd.hide();
      }, e.prototype.hasInsertAd = function () {
        return !0;
      }, e.prototype.showInsertAd = function () {
        this.hasInsertAd() && this.showNormalInsertAd();
      }, e.prototype.showNormalInsertAd = function () {
        qq.createInterstitialAd && (null == this._insertAd && (this._insertAd = qq.createInterstitialAd({ adUnitId: this.insertAdId }), this._insertAd.load().catch(function (t) {
          console.error("load", t);
        }), this._insertAd.onLoad(function () {}), this._insertAd.onClose(function () {}), this._insertAd.onError(function (t) {
          console.log("error", t);
        })), this._insertAd.show().catch(function (t) {
          console.error("show", t);
        }));
      }, e.prototype.vibrateShort = function () {
        "undefined" != typeof qq && qq.vibrateShort({});
      }, e.prototype.vibrateLong = function () {
        "undefined" != typeof qq && qq.vibrateLong({});
      }, e.prototype.navigateToMiniGame = function (t) {
        var e = this;qq.navigateToMiniProgram({ appId: t.appId, path: "?id=dash", extraData: { foo: "dash" }, envVersion: "release", success: function success() {
            e._jump = !0;
          }, fail: function fail(t) {
            console.log(t);
          }, complete: function complete(t) {
            y.default.log("------complete-----", t);
          } });
      }, e.prototype.navigateToCheckCall = function () {
        this._jump && h.default.callClazzFunc(p.default, "reviveCall"), this._jump = !1;
      }, e.prototype.openUrl = function (t, e) {
        void 0 === e && (e = 0);var n = this;qq.openUrl({ url: t, success: function success(t) {
            y.default.log("-----success---", t), n._openUrlRevive = 1 == e;
          }, fail: function fail(t) {
            n._openUrlRevive = !1, console.log("----fail----", t);
          } });
      }, e.prototype.openUrlCheckCall = function () {
        this._openUrlRevive && h.default.callClazzFunc(p.default, "reviveCall"), this._openUrlRevive = !1;
      }, e.prototype.showToast = function (t, e) {
        void 0 === e && (e = 2e3), qq.showToast({ title: t, icon: "none", duration: e });
      }, e.prototype.subscribeAppMsg = function () {
        qq.requestSubscribeSystemMessage({ msgTypeList: ["SYS_MSG_TYPE_RANK"], success: function success(t) {
            y.default.log("----requestSubscribeSystemMessage----success", t);
          }, fail: function fail(t) {
            console.log("----requestSubscribeSystemMessage----fail", t);
          } });
      }, e.prototype.shareInvite = function () {
        if ("undefined" != typeof qq) {
          var t = this;qq.shareInvite({ success: function success() {
              y.default.log("shareInvite success"), t._invoke = !0;
            }, fail: function fail(e) {
              1 == e.errCode ? console.log("shareInvite--\u7528\u6237\u53D6\u6D88", e) : console.log("shareInvite--\u5176\u4ED6\u9519\u8BEF", e), t._invoke = !1;
            }, complete: function complete() {
              y.default.log("shareInvite completion");
            } });
        }
      }, e;
    }(r.default);n.default = I, cc._RF.pop();
  }, { "../../Game/Fb/FbEndPanel": "FbEndPanel", "../../Game/Fb/FbPkInvitePanel": "FbPkInvitePanel", "../../Game/Fb/FbPkMatchPanel": "FbPkMatchPanel", "../../Game/Info/FbInfo": "FbInfo", "../../Game/Manager/CommandController": "CommandController", "../Core/GameType": "GameType", "../Manager/DataManager": "DataManager", "../Manager/GlobalEventManager": "GlobalEventManager", "../Manager/Logger": "Logger", "../Manager/SysConfig": "SysConfig", "../Manager/TimeManager": "TimeManager", "../UI/UIManager": "UIManager", "../Util/Base64": "Base64", "../Util/MD5": "MD5", "../Util/NetUtil": "NetUtil", "./AbstractSDK": "AbstractSDK", "./UmaTrackHelper": "UmaTrackHelper" }], SetInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "611f15CeXdN8p/CLmM2T76m", "SetInfo");var _o74,
        i = this && this.__extends || (_o74 = function o(t, e) {
      return (_o74 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o74(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = function (t) {
      function e() {
        var e = t.call(this) || this;return e._notice = 0, e._music = 1, e._vibrate = 1, e;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.init = function (t) {
        null != t && (null != t.set && (this._music = t.set.music, this._vibrate = t.set.vibrate), null != t.notice && (this._notice = t.notice));
      }, e.prototype.saveData = function (t) {
        t.set = { music: this._music, vibrate: this._vibrate }, t.notice = this._notice;
      }, Object.defineProperty(e.prototype, "music", { get: function get() {
          return this._music;
        }, set: function set(t) {
          this._music != t && (this._music = t, this.save());
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "vibrate", { get: function get() {
          return this._vibrate;
        }, set: function set(t) {
          this._vibrate != t && (this._vibrate = t, this.save());
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "notice", { get: function get() {
          return this._notice;
        }, set: function set(t) {
          this._notice != t && (this._notice = t, this.save());
        }, enumerable: !1, configurable: !0 }), e;
    }(t("../../Common/Info/AbsInfo").default);n.default = r, cc._RF.pop();
  }, { "../../Common/Info/AbsInfo": "AbsInfo" }], ShopConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "3e748lFGOxINoM3+NLvqmYx", "ShopConfig");var _o75,
        i = this && this.__extends || (_o75 = function o(t, e) {
      return (_o75 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o75(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Config/AbsConfig"),
        a = t("./item/ShopData"),
        s = function (t) {
      function e() {
        return t.call(this, a.default) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e._ins = null, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../Common/Config/AbsConfig": "AbsConfig", "./item/ShopData": "ShopData" }], ShopData: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "322c9G/r7FByIICHPWWxdWX", "ShopData"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        this._id = t.attributes.id, this._spId = t.attributes.spId, this._price = t.attributes.price;
      }return Object.defineProperty(t.prototype, "id", { get: function get() {
          return this._id;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "spId", { get: function get() {
          return this._spId;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "price", { get: function get() {
          return this._price;
        }, enumerable: !1, configurable: !0 }), t.cfgFile = "shop", t;
    }();n.default = o, cc._RF.pop();
  }, {}], ShopPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "704a0eAqNdIV55sro7hQHWn", "ShopPanel");var _o76,
        i = this && this.__extends || (_o76 = function o(t, e) {
      return (_o76 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o76(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.ShopItem = void 0;var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../../Common/UI/UIItem"),
        d = t("../Config/ShopConfig"),
        h = t("../../Common/Manager/LoadResManager"),
        p = t("../Config/ProductConfig"),
        _ = t("../../Common/Sdks/GameSDK"),
        m = t("../Info/PlayerInfo"),
        g = t("../Manager/CommandController"),
        y = t("../Info/ItemsInfo"),
        b = t("../../Common/Manager/GlobalEventManager"),
        C = t("./ReceiveGiftTips"),
        v = cc._decorator,
        I = v.ccclass,
        M = (v.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.init = function () {
        this.cf = this.data, this.pcf = p.default.ins.getItem(this.cf.spId), this.txt_name = s.default.getComponent(cc.Label, this.node, "txt_name"), this.txt_price = s.default.getComponent(cc.Label, this.node, "txt_price"), this.txt_am = s.default.getComponent(cc.Label, this.node, "txt_am"), this.icon = s.default.getComponent(cc.Sprite, this.node, "icon"), this.btn_buy = s.default.getComponent(cc.Button, this.node, "btn_buy"), this.btn_use = s.default.getNode(this.node, "btn_use"), this.nuse = s.default.getNode(this.node, "nuse"), this.useing = s.default.getNode(this.node, "useing"), this.btn_buy.node.on(cc.Node.EventType.TOUCH_END, this.onTouchBuyHandler, this), this.btn_use.on(cc.Node.EventType.TOUCH_END, this.onTouchUseHandler, this), h.default.loadSprite(this.icon, "Atlas/atlas_item/" + this.pcf.icon), this.txt_price.string = this.cf.price.toString(), this.txt_name.string = this.pcf.name, b.default.on(y.default.event_items_change, this.upInfo, this);
      }, e.prototype.onTouchBuyHandler = function () {
        if (c.default.playEffect(c.default.CLICK), m.default.ins.money >= this.cf.price) {
          y.default.ins.addItem(this.pcf.id, 1, !1);var t = y.default.ins.getData();g.default.buyItem(this.pcf.id, t, this._buyComplete, this, this._buyFail);
        } else _.default.showToast("\u91D1\u5E01\u4E0D\u8DB3");
      }, e.prototype._buyComplete = function (t) {
        var e = { name: this.pcf.name, icon: this.pcf.icon, count: 1, type: C.ReceiveGiftTipType.ForShop };u.default.show(C.default, e);var n = t.money;m.default.ins.money = n, y.default.ins.disChange();
      }, e.prototype._buyFail = function () {
        y.default.ins.removeItem(this.pcf.id, 1, !1);
      }, e.prototype.onTouchUseHandler = function () {
        c.default.playEffect(c.default.CLICK), y.default.ins.setFab(this.pcf.id), y.default.ins.saveData();
      }, e.prototype.upInfo = function () {
        var t = y.default.ins.getItemsItem(this.pcf.id);null != t && t.am > 0 ? (1 == t.fab ? (this.btn_use.active = !1, this.useing.active = !0, this.nuse.active = !1) : (this.btn_use.active = !0, this.useing.active = !1, this.nuse.active = !1), t.am > 0 ? this.txt_am.string = "x" + t.am : this.txt_am.string = "") : (this.btn_use.active = !1, this.useing.active = !1, this.nuse.active = !0, this.txt_am.string = "");
      }, e.prototype.destroy = function () {
        t.prototype.destroy.call(this), b.default.targetOff(this);
      }, e;
    }(f.default));n.ShopItem = M;var P = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.PopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this);var t = d.default.ins.getList();this.items = new Array();for (var e = t.length, n = 0; n < e; n++) {
          var o = s.default.getNode(this.node, "frame/item" + n),
              i = new M(o, t[n]);this.items.push(i);
        }
      }, e.prototype.onShow = function () {
        for (var t = this.items.length, e = 0; e < t; e++) {
          this.items[e].upInfo();
        }
      }, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {
        t.prototype.onDestroy.call(this), this.btn_close.node.targetOff(this);for (var e = this.items.length, n = 0; n < e; n++) {
          this.items[n].destroy();
        }this.items = null;
      }, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, r([I], e);
    }(a.default);n.default = P, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/GlobalEventManager": "GlobalEventManager", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIItem": "UIItem", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/ProductConfig": "ProductConfig", "../Config/ShopConfig": "ShopConfig", "../Info/ItemsInfo": "ItemsInfo", "../Info/PlayerInfo": "PlayerInfo", "../Manager/CommandController": "CommandController", "./ReceiveGiftTips": "ReceiveGiftTips" }], SignConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "852e5iL8WdA+rzECWQU7oIt", "SignConfig");var _o77,
        i = this && this.__extends || (_o77 = function o(t, e) {
      return (_o77 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o77(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Config/AbsConfig"),
        a = t("./item/SignData"),
        s = function (t) {
      function e() {
        return t.call(this, a.default) || this;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), e._ins = null, e;
    }(r.default);n.default = s, cc._RF.pop();
  }, { "../../Common/Config/AbsConfig": "AbsConfig", "./item/SignData": "SignData" }], SignData: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "ac4f7reVbdDSq8vjWHApWtG", "SignData"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t) {
        this._id = t.attributes.id, this._spId = t.attributes.spId, this._count = t.attributes.count, this._spId8 = t.attributes.spId8, this._count8 = t.attributes.count8;
      }return Object.defineProperty(t.prototype, "id", { get: function get() {
          return this._id;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "spId", { get: function get() {
          return this._spId;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "count", { get: function get() {
          return this._count;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "spId8", { get: function get() {
          return this._spId8;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "count8", { get: function get() {
          return this._count8;
        }, enumerable: !1, configurable: !0 }), t.cfgFile = "sign", t;
    }();n.default = o, cc._RF.pop();
  }, {}], SignInfo: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "f42ca67C8FL2YphxTtmgP/l", "SignInfo");var _o78,
        i = this && this.__extends || (_o78 = function o(t, e) {
      return (_o78 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o78(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../Common/Info/AbsInfo"),
        a = t("../../Common/Core/NumValue"),
        s = t("../../Common/Core/GameType"),
        c = t("../../Common/Manager/TimeManager"),
        l = function (t) {
      function e() {
        var e = t.call(this) || this;return e._day = new a.default(), e._time = new a.default(), e;
      }return i(e, t), Object.defineProperty(e, "ins", { get: function get() {
          return null == e._ins && (e._ins = new e()), e._ins;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "day", { get: function get() {
          return this._day.value;
        }, set: function set(t) {
          this._day.value != t && (this._day.value = t);
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "time", { get: function get() {
          return this._time.value;
        }, set: function set(t) {
          this._time.value != t && (this._time.value = t, this.emit(s.InfoEvent.EVENT_CHANGE));
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "list", { get: function get() {
          return this._list;
        }, enumerable: !1, configurable: !0 }), e.prototype.init = function (t) {
        t.sign && (this._list = t.sign, null != t.sign.d && (this.day = t.sign.d), null != t.sign.t && (this.time = t.sign.t));
      }, e.prototype.onNewDayHandler = function () {}, e.prototype.checkCurDaySigned = function () {
        var t = new Date(c.default.serverTime).getDay();return 0 == t && (t = 7), this.list.includes(t);
      }, e;
    }(r.default);n.default = l, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Core/NumValue": "NumValue", "../../Common/Info/AbsInfo": "AbsInfo", "../../Common/Manager/TimeManager": "TimeManager" }], SignPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "55f11mK+HZKmJbQmd47C84w", "SignPanel");var _o79,
        i = this && this.__extends || (_o79 = function o(t, e) {
      return (_o79 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o79(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Util/ComponentUtil"),
        c = t("../../Common/Manager/MusicManager"),
        l = t("../../Common/Core/GameType"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Manager/CommandController"),
        d = t("../../Common/Sdks/GameSDK"),
        h = t("../Config/ProductConfig"),
        p = t("../../Common/Manager/Logger"),
        _ = t("../Info/PlayerInfo"),
        m = t("../Config/SignConfig"),
        g = t("../Info/SignInfo"),
        y = t("../../Common/Manager/TimeManager"),
        b = t("./ReceiveGiftTips"),
        C = t("../../Common/Sdks/UmaTrackHelper"),
        v = t("../Manager/GameManager"),
        I = cc._decorator,
        M = I.ccclass,
        P = (I.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isForceShade = !0, e;
      }var n;return i(e, t), n = e, Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return l.UILayerType.SubPopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        n.isFirst = !1, p.default.log("SignPanel onStart!!!"), this.item_content = s.default.getNode(this.node, "frame/item_content"), this.sign_item = s.default.getNode(this.node, "frame/sign_item"), this.btn_close = s.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_receive_gift = s.default.getComponent(cc.Button, this.node, "frame/btn_receive_gift"), this.btn_receive_gift.node.on(cc.Node.EventType.TOUCH_END, this.onTouchReceiveGiftHandler, this), this.btn_double_gift = s.default.getComponent(cc.Button, this.node, "frame/btn_double_gift"), this.btn_double_gift.node.on(cc.Node.EventType.TOUCH_END, this.onTouchDoubleGiftHandler, this), this.day7_is_got = s.default.getNode(this.node, "day7/bg/is_got"), this.day7_particle = s.default.getNode(this.node, "day7/bg/particle"), this.day7_node = s.default.getNode(this.node, "day7/bg"), this.day7_node.on("touchend", this.onDay7NodeClick, this), this.sign_list = m.default.ins.getList(), p.default.log("this.sign_list", this.sign_list), cc.game.on("SignPanelRefresh", this.onShow, this);
      }, e.prototype.onShow = function () {
        this.item_content.removeAllChildren(), p.default.log(g.default.ins.list, "\u7B7E\u5230\u5217\u8868");var t = new Date(y.default.serverTime).getDay();0 == t && (t = 7), p.default.log(t, "\u4ECA\u5929\u662F\u5468\u51E0"), this.today = t, this.isSignedToday = g.default.ins.list.includes(t), g.default.ins.list.includes(8) ? (this.day7_is_got.active = !0, this.day7_particle.active = !1) : 7 == g.default.ins.list.length ? (this.day7_is_got.active = !1, this.day7_particle.active = !0) : (this.day7_is_got.active = !1, this.day7_particle.active = !1);for (var e = 0; e < this.sign_list.length - 1; e++) {
          var n = this.sign_list[e].spId,
              o = e,
              i = h.default.ins.getItem(n),
              r = "Atlas/atlas_item/" + i.icon;p.default.log(r, "icon");var a = i.name + "X" + this.sign_list[e].count,
              s = !1,
              c = !1,
              l = !1,
              u = g.default.ins.list.includes(e + 1);t > e + 1 && u ? s = !0 : t > e + 1 && !u && (l = !0), t == e + 1 && u ? (s = !0, this.btn_receive_gift.interactable = !1, this.btn_double_gift.interactable = !1) : t != e + 1 || u || (c = !0, this.btn_receive_gift.interactable = !0, this.btn_double_gift.interactable = !0, p.default.log("\u661F\u671F" + (e - 0 + 1) + "\u8FD8\u6CA1\u7B7E\u5230"));var f = { days: o, icon: r, name_count: a, show_is_got: s, show_particle: c, show_btn_buqian: l },
              d = cc.instantiate(this.sign_item);d.getComponent("sign_item").init(f), this.item_content.addChild(d);
        }
      }, e.prototype.onClose = function () {}, e.prototype.onTouchCloseHandler = function () {
        c.default.playEffect(c.default.CLICK), u.default.close(this);
      }, e.prototype.onDay7NodeClick = function () {
        var t = this;p.default.log("--------------------- onDay7NodeClick --------------------  "), 7 == g.default.ins.list.length ? f.default.sign(8, 2, !1, function (e) {
          var n = m.default.ins.getItem(8),
              o = n.spId,
              i = n.count;0 != v.default.sign8 && (o = n.spId8, i = n.count8);var r = h.default.ins.getItem(o),
              a = { icon: r.icon, count: i, name: r.name, type: b.ReceiveGiftTipType.ForSign };u.default.show(b.default, a), g.default.ins.init(e), t.onShow();
        }, this) : d.default.showToast("\u9886\u53D6\u6761\u4EF6\u4E0D\u8DB3");
      }, e.prototype.onTouchDoubleGiftHandler = function () {
        if (c.default.playEffect(c.default.CLICK), this.isSignedToday) d.default.sdk.showToast("\u4ECA\u5929\u5DF2\u7B7E\u5230\uFF0C\u660E\u5929\u518D\u6765\u5427\uFF01", 1e3);else {
          var t = this;c.default.playEffect(c.default.CLICK), d.default.showVideoAd(function () {
            t.giveSignReward(2), C.default.trackEvent("1331");
          }, this, l.VideoAdType.Sign);
        }
      }, e.prototype.onTouchReceiveGiftHandler = function () {
        c.default.playEffect(c.default.CLICK), p.default.log("-------------------onTouchReceiveGiftHandler "), this.isSignedToday ? d.default.sdk.showToast("\u4ECA\u5929\u5DF2\u7B7E\u5230\uFF0C\u660E\u5929\u518D\u6765\u5427\uFF01", 1e3) : (this.giveSignReward(1), C.default.trackEvent("1329"));
      }, e.prototype.giveSignReward = function (t) {
        var e = this;if (c.default.playEffect(c.default.CLICK), p.default.log("-------------------giveSignReward--- ", t), this.isSignedToday) d.default.sdk.showToast("\u4ECA\u5929\u5DF2\u7B7E\u5230\uFF0C\u660E\u5929\u518D\u6765\u5427\uFF01", 1e3);else {
          var n = this;c.default.playEffect(c.default.CLICK), g.default.ins.day += 1, g.default.ins.day > 7 && (g.default.ins.day = 1), g.default.ins.time = new Date().getTime(), f.default.sign(this.today, 0, 2 == t, function (o) {
            p.default.log("\u7B7E\u5230\u6210\u529F\uFF01", o), g.default.ins.init(o);var i = n.sign_list[e.today - 1].spId,
                r = h.default.ins.getItem(i),
                a = r.icon,
                s = r.name,
                c = n.sign_list[e.today - 1].count * t,
                l = { icon: a, count: c, name: s, type: b.ReceiveGiftTipType.ForSign };u.default.show(b.default, l), 1 == i && (_.default.ins.money += c), 2 == i && (_.default.ins.giftCoupon += c), n.onShow();
          }, this);
        }
      }, e.isFirst = !0, n = r([M], e);
    }(a.default));n.default = P, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/ProductConfig": "ProductConfig", "../Config/SignConfig": "SignConfig", "../Info/PlayerInfo": "PlayerInfo", "../Info/SignInfo": "SignInfo", "../Manager/CommandController": "CommandController", "../Manager/GameManager": "GameManager", "./ReceiveGiftTips": "ReceiveGiftTips" }], SingleController: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "072beMNQmxB7IsvYODQoqsm", "SingleController");var _o80,
        i = this && this.__extends || (_o80 = function o(t, e) {
      return (_o80 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o80(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("./AbsDashController"),
        a = t("../Manager/GameManager"),
        s = t("../Info/FbInfo"),
        c = t("../Scene/GameScene"),
        l = t("../../Common/UI/UIManager"),
        u = t("../Fb/FbRewardPanel"),
        f = t("../Fb/FbEndPanel"),
        d = t("../Fb/FbPanel"),
        h = t("../Config/GameConfig"),
        p = function (t) {
      function e(e) {
        var n = t.call(this, e) || this;return h.default.resetDashStep(10), n._musicCtrl.init(1, n.initScene, n), n;
      }return i(e, t), e.prototype.startGame = function () {
        this._musicCtrl.playLoop(), this._musicCtrl.mute = !0, this._playing = !0;
      }, e.prototype.initSceneComplete = function () {
        this.startGame();
      }, e.prototype.hitStage = function (t) {
        void 0 === t && (t = 0), 1 == t ? l.default.callClazzFunc(d.default, "showComboTips") : l.default.callClazzFunc(d.default, "resetCombo");
      }, e.prototype.useItem = function () {
        return !1;
      }, e.prototype.revive = function () {
        t.prototype.revive.call(this), l.default.callClazzFunc(d.default, "resetCombo");
      }, e.prototype.win = function () {}, e.prototype.fail = function () {
        a.default.buildScore(), s.default.ins.step = c.default.ins.stepIdx, s.default.ins.reviveCount >= a.default.MAX_REVIVE_COUNT ? (c.default.ins.closeGame(), l.default.show(u.default)) : l.default.show(f.default);
      }, e;
    }(r.default);n.default = p, cc._RF.pop();
  }, { "../../Common/UI/UIManager": "UIManager", "../Config/GameConfig": "GameConfig", "../Fb/FbEndPanel": "FbEndPanel", "../Fb/FbPanel": "FbPanel", "../Fb/FbRewardPanel": "FbRewardPanel", "../Info/FbInfo": "FbInfo", "../Manager/GameManager": "GameManager", "../Scene/GameScene": "GameScene", "./AbsDashController": "AbsDashController" }], SportController: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "61a2btGUShAjoMoRMnpMYfm", "SportController");var _o81,
        i = this && this.__extends || (_o81 = function o(t, e) {
      return (_o81 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o81(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("./AbsDashController"),
        a = t("../../Common/Util/StringUtil"),
        s = t("../../Common/Sdks/GameSDK"),
        c = t("../Net/GameClient"),
        l = t("../Info/FbInfo"),
        u = t("../../Common/Manager/TimeManager"),
        f = t("../../Common/UI/UIManager"),
        d = t("../Fb/FbPanel"),
        h = t("../Config/GameConfig"),
        p = t("../Scene/GameScene"),
        _ = t("../Main/FbWinPanel"),
        m = t("../Main/FbLostPanel"),
        g = t("../Main/FbDogfallPanel"),
        y = t("../../Common/Manager/Logger"),
        b = t("../Manager/GameManager"),
        C = t("../../Common/Util/MathUtil"),
        v = t("../Config/ProductConfig"),
        I = t("./ItemActor"),
        M = t("../../Common/Manager/MusicManager"),
        P = t("../../Common/Manager/GlobalEventManager"),
        S = t("../../Common/Core/GameType"),
        T = function (t) {
      function e(e, n) {
        var o = t.call(this, e) || this;return h.default.resetDashStep(5), o._type = 1, n.l[0].uid == s.default.getUid() ? (o._fx = -1, o._playerId = n.l[1].uid) : (o._fx = 1, o._playerId = n.l[0].uid), o._roomId = n.rid, o._players = n.l, o._offsetPara = a.default.getCodeTotal(o._roomId), y.default.log(">>> \u623F\u95F4\u7F16\u7801\uFF1A", a.default.getCodeTotal(o._roomId)), o._uptime = u.default.serverTime, o._autoRunTime = 3, o._stageLayoutIdx = o._offsetPara % 2 > 0 ? 1 : 3, o._musicCtrl.init(o._offsetPara, o.initScene, o), o.registerNetCmd(), P.default.on(S.GameEvent.Hide, o.onHideHandler, o), o;
      }return i(e, t), e.prototype.onHideHandler = function () {
        this._tipsNode.active = !1, f.default.callClazzFunc(d.default, "cancelReady"), c.default.ins.send(521, { rid: this._roomId }), this.gameOver(!1);
      }, e.prototype.initSceneComplete = function () {}, e.prototype.startGame = function () {
        this._musicCtrl.playLoop(), this._musicCtrl.mute = !0, this._playing = !0, this._isInited = !0, this.autoRun();
      }, e.prototype.registerNetCmd = function () {
        c.default.ins.addPacketDataListener(258, this.cmd0x0102Handler, this), c.default.ins.addPacketDataListener(518, this.cmd0x0206Handler, this), c.default.ins.addPacketDataListener(519, this.cmd0x0207Handler, this), c.default.ins.addPacketDataListener(520, this.cmd0x0208Handler, this), c.default.ins.addPacketDataListener(521, this.cmd0x0209Handler, this);
      }, e.prototype.unRegisterNetCmd = function () {
        c.default.ins.removeAll(this);
      }, e.prototype.update = function (e) {
        if (t.prototype.update.call(this, e), this._playing && this._running) {
          if (this._hero.isThrow && this._itemNode) if (this._hero.animState.time < this._hero.animState.duration / 2) {
            var n = this._hero.locator,
                o = n.parent.convertToWorldSpaceAR(n.position);o = this._scene.convertToNodeSpaceAR(o), this._itemNode.position = o, this._itemNode.eulerAngles = cc.v3(0, 0, -25), this.isThrowing = !1;
          } else this.isThrowing || this.startThrow();
        } else this._playing && !this._running && null != this._autoRunTime && (this._isTouched ? (this.autoRun(), this._autoRunTime = null) : (this._autoRunTime -= e, this._autoRunTime < 0 && (this.autoRun(), this._autoRunTime = null)));
      }, e.prototype.startThrow = function () {
        cc.tween(this._itemNode).to(.2, { position: cc.v3(this._hero.position.x - 15 * this._fx, this._hero.position.y + 3, this._hero.z - 35), eulerAngles: cc.v3(180 * Math.random(), 180 * Math.random(), 180 * Math.random()) }).call(this.throwFinish.bind(this)).start(), this.isThrowing = !0, M.default.playEffect(M.default.THROW);
      }, e.prototype.throwFinish = function () {
        this._itemNode.position = cc.v3(this._hero.position.x - 15 * this._fx, this._itemNode.y + 3, this._hero.z - 35), this._itemNode.eulerAngles = cc.v3(180 * Math.random(), 180 * Math.random(), 180 * Math.random()), I.default.push(this._itemNode);
      }, e.prototype.startAttack = function (t) {
        t.uid == s.default.getUid() ? (this._itemNode = null, this._hero.throw()) : "" != t.itemId ? this.attackCamera(this._itemNode) : this.attackHero(this._itemNode);
      }, e.prototype.attackHero = function (t) {
        t.position = cc.v3(this._hero.position.x - 13 * this._fx, t.y + 3, this._hero.z - 35), t.eulerAngles = cc.v3(180 * Math.random(), 180 * Math.random(), 180 * Math.random()), cc.tween(t).to(.4, { position: cc.v3(this._hero.position.x, this._hero.position.y + 1, this._hero.position.z - .3 * h.default.CurHeroSpeed), eulerAngles: cc.v3(180 * Math.random(), 180 * Math.random(), 180 * Math.random()) }).call(this.attackFinish.bind(this)).start();
      }, e.prototype.attackCamera = function (t) {
        t.position = cc.v3(this._hero.position.x - 13 * this._fx, t.y + 3, this._hero.z - 35), t.eulerAngles = cc.v3(180 * Math.random(), 180 * Math.random(), 180 * Math.random()), cc.tween(t).to(.4, { position: cc.v3(this._camera.node.position.x + this._fx, this._camera.node.position.y - 1.2, this._camera.node.position.z - .3 * h.default.CurHeroSpeed - 5), eulerAngles: cc.v3(180 * Math.random(), 180 * Math.random(), 180 * Math.random()) }).call(this.attackFinish.bind(this)).start();
      }, e.prototype.attackFinish = function (t) {
        var e = t,
            n = e.data;if (0 == n.kind) {
          var o = this._camera.node.getChildByName("effNode");(i = I.ItemEffectActor.get(e.data.effect)).position = cc.Vec3.ZERO, o && (o.addChild(i), i.play());
        } else if (2 == n.kind) {
          var i;(i = I.ItemEffectActor.get(e.data.effect)).position = cc.v3(this._hero.position.x, 0, this._hero.position.z - 50), this._scene.addChild(i), i.play();
        } else this._hero.dizzy(e.data);M.default.playEffect(M.default.HITTARGET), I.default.push(e);
      }, e.prototype.cmd0x0102Handler = function (t) {
        t.isError || p.default.ins.closeGame();
      }, e.prototype.cmd0x0206Handler = function (t) {
        t.isError || t.body.uid == s.default.getUid() && (this._score = t.body.score, this._scoreRatio = C.default.clamp(1 + this._score / 3e3, 1, 3));
      }, e.prototype.cmd0x0207Handler = function (t) {
        if (!t.isError) {
          var e = v.default.ins.getItem(t.body.itemId),
              n = I.default.get(e);t.body.uid == s.default.getUid() ? (this._itemNode = n, this._hero.throw()) : u.default.add(function () {
            0 == e.kind ? this.attackCamera(n) : this.attackHero(n);
          }, this, 300, 1), this._scene.addChild(n);
        }
      }, e.prototype.cmd0x0208Handler = function (t) {
        if (!t.isError) {
          this._gameFinish = !0;var e = t.body;l.default.ins.step = p.default.ins.stepIdx, f.default.close(d.default), this.unRegisterNetCmd(), c.default.ins.close(), p.default.ins.closeGame(), 1 == t.body.f ? s.default.getUid() == t.body.win ? b.default.fbPkEnd(1, _.default, e) : b.default.fbPkEnd(0, m.default, e) : b.default.fbPkEnd(2, g.default, e);
        }
      }, e.prototype.cmd0x0209Handler = function (t) {
        t.isError || (t.body.uid == this._playerId ? (this._playerDie = !0, f.default.callClazzFunc(d.default, "playerDie")) : f.default.callClazzFunc(d.default, "heroDie"));
      }, e.prototype.hitStage = function (t) {
        void 0 === t && (t = 0), this._gameFinish || (u.default.serverTime - this._uptime > 500 && (c.default.ins.send(518, { rid: this._roomId, score: l.default.ins.currentScore }), this._uptime = u.default.serverTime), 1 == t ? (f.default.callClazzFunc(d.default, "showComboTips"), h.default.Energy += 2.5 * this._scoreRatio) : (f.default.callClazzFunc(d.default, "resetCombo"), h.default.Energy += 1.5 * this._scoreRatio));
      }, e.prototype.revive = function () {
        t.prototype.revive.call(this), f.default.callClazzFunc(d.default, "resetCombo");
      }, e.prototype.win = function () {
        this._gameFinish || (this._uptime = u.default.serverTime, c.default.ins.send(518, { rid: this._roomId, score: l.default.ins.currentScore }));
      }, e.prototype.fail = function () {
        this._uptime = u.default.serverTime, this._gameFinish || (c.default.ins.send(518, { rid: this._roomId, score: l.default.ins.currentScore }), c.default.ins.send(521, { rid: this._roomId }));
      }, e.prototype.useItem = function (t) {
        return !(!(this._playing && this._running && t) || this._hero.isDizzy || this._playerDie || (c.default.ins.send(519, { rid: this._roomId, toUid: this._playerId, itemId: t.id }), 0));
      }, e.prototype.destroy = function () {
        this.unRegisterNetCmd(), P.default.targetOff(this), t.prototype.destroy.call(this);
      }, e;
    }(r.default);n.default = T, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/GlobalEventManager": "GlobalEventManager", "../../Common/Manager/Logger": "Logger", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Manager/TimeManager": "TimeManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIManager": "UIManager", "../../Common/Util/MathUtil": "MathUtil", "../../Common/Util/StringUtil": "StringUtil", "../Config/GameConfig": "GameConfig", "../Config/ProductConfig": "ProductConfig", "../Fb/FbPanel": "FbPanel", "../Info/FbInfo": "FbInfo", "../Main/FbDogfallPanel": "FbDogfallPanel", "../Main/FbLostPanel": "FbLostPanel", "../Main/FbWinPanel": "FbWinPanel", "../Manager/GameManager": "GameManager", "../Net/GameClient": "GameClient", "../Scene/GameScene": "GameScene", "./AbsDashController": "AbsDashController", "./ItemActor": "ItemActor" }], StageActor: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "01065ke1qNH2Y8xnZmWv8qg", "StageActor");var _o82,
        i = this && this.__extends || (_o82 = function o(t, e) {
      return (_o82 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o82(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.StageActorCom = void 0;var a = t("../../Common/Util/MathUtil"),
        s = t("./ObjectActor"),
        c = t("../../Common/Manager/LoadResManager"),
        l = t("../Config/GameConfig"),
        u = cc._decorator,
        f = u.ccclass,
        d = (u.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._fx = Math.random() > .5 ? 1 : -1, e;
      }return i(e, t), e.prototype.startMove = function (t, e, n) {
        this._radius = t, this._speed = e, this._isMove = !0, this._fx = n;
      }, e.prototype.stopMove = function () {
        this._isMove = !1;
      }, e.prototype.update = function () {
        this._isMove && ((this.node.x >= Math.abs(this._radius) || this.node.x <= -Math.abs(this._radius)) && (this._fx *= -1), this.node.x += this._fx * this._speed);
      }, r([f], e);
    }(cc.Component));n.StageActorCom = d;var h = function (t) {
      function e() {
        var e = t.call(this) || this;e._itemType = l.StageItemType.Normal, e.group = "planet", e.is3DNode = !0, e._com = e.addComponent(d), e._radius = 0, e._size = 1;var n = e;return c.default.bundle.load("Prefab/stage", cc.Prefab, function (t, e) {
          n.initModel(e);
        }), e;
      }return i(e, t), Object.defineProperty(e.prototype, "size", { get: function get() {
          return this._size;
        }, set: function set(t) {
          this._size = t, this._model && (this._stage.scaleX = this._size, this._stage.scaleZ = this._size, this._shadow.scaleX = this._size, this._shadow.scaleY = this._size, this._shadow.scaleZ = this._size, this._shadow.y = .4 * (this._size - 1), this.setObjectScale());
        }, enumerable: !1, configurable: !0 }), e.prototype.startMove = function (t, e, n) {
        void 0 === n && (n = 0), this._isAppear ? (this._radius = t, this._speed = e, this._fx = n) : (this._com.startMove(t, e, n), this._radius = 0, this._speed = 0);
      }, e.prototype.stopMove = function () {
        this._com.stopMove();
      }, e.prototype.initModel = function (t) {
        var e;e = cc.instantiate(t), this._model = e, this._model.scale = 1.5, this._stage = e.getChildByName("stage"), this._shadow = e.getChildByName("shadow"), this._stage.scaleX = this._size, this._stage.scaleZ = this._size, this._shadow.scaleX = this._size, this._shadow.scaleY = this._size, this._shadow.scaleZ = this._size, this._shadow.y = .4 * (this._size - 1), this.setObjectScale(), this.addChild(e);
      }, e.prototype.setObjectScale = function () {
        this._object && ("obstacle" == this._object.name ? (this._object.scaleX = this._size, this._object.scaleZ = this._size) : (this._object.scaleX = 1, this._object.scaleY = 1, this._object.scaleZ = 1));
      }, e.prototype.addItem = function (t) {
        if (this._itemType != t) {
          var e;switch (this._object && (this._object.removeFromParent(), this._object = null), this._itemType = t, t) {case l.StageItemType.Gold:
              (e = new s.default()).setName("gold");break;case l.StageItemType.Obstacle:
              (e = new s.default()).setName("obstacle");break;case l.StageItemType.JiaoZi:
              (e = new s.default()).setName("jiaozi");}e && (this._object = e, this.addChild(e), this.setObjectScale());
        }
      }, Object.defineProperty(e.prototype, "itemType", { get: function get() {
          return this._itemType;
        }, enumerable: !1, configurable: !0 }), e.prototype.removeItem = function () {
        this._object && (this._object.removeFromParent(), this._object.destroyAllChildren(), this._object.destroy(), this._object = null), this._itemType = l.StageItemType.Normal;
      }, e.prototype.appear = function (t) {
        void 0 === t && (t = null), this.removeItem(), this.stopMove(), this._isAppear = !0, this.scale = 0, t ? cc.tween(this).to(.5, { scale: a.default.randomFloat(1, 1), position: t }).call(this._appearHandler, this).start() : cc.tween(this).to(.5, { scale: a.default.randomFloat(1, 1) }).call(this._appearHandler, this).start();
      }, e.prototype._appearHandler = function () {
        this._isAppear = !1, 0 != this._radius && this.startMove(this._radius, this._speed, this._fx);
      }, e;
    }(cc.Node);n.default = h, cc._RF.pop();
  }, { "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Util/MathUtil": "MathUtil", "../Config/GameConfig": "GameConfig", "./ObjectActor": "ObjectActor" }], StringUtil: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "4ee6akJpFhOWKPZYe2qQ0dv", "StringUtil"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../Core/ByteArray"),
        i = function () {
      function t() {}return t.toString = function (e, n, o) {
        void 0 === o && (o = -1);var i = e.toString(n),
            r = i.length;return r >= o ? i : t.zeros.substr(0, o - r) + i;
      }, t.formatHttpParams = function (t) {
        var e = "";if (null != t) for (var n in t) {
          e += n + "=" + t[n] + "&";
        }return e.length > 0 && (e = e.substr(0, e.length - 1)), e;
      }, t.convertPoint = function (t, e) {
        var n = t.split(e);if (2 == n.length) {
          var o = parseFloat(n[0]),
              i = parseFloat(n[1]);if (!isNaN(o) && !isNaN(i)) return cc.v2(o, i);
        }return null;
      }, t.convertPointArray = function (e) {
        var n = [];if (null != e && e.length > 0) for (var o = e.split(","), i = 0; i < o.length; i++) {
          var r = t.convertPoint(o[i], "|");n.push(r);
        }return n;
      }, t.convertNumberArray = function (t, e) {
        var n = [];if (null != t && t.length > 0) for (var o = t.split(e), i = 0; i < o.length; i++) {
          var r = parseFloat(o[i]);n.push(r);
        }return n;
      }, t.convertIntArray = function (t, e) {
        var n = [];if (null != t && t.length > 0) for (var o = t.split(e), i = 0; i < o.length; i++) {
          var r = parseInt(o[i]);n.push(r);
        }return n;
      }, t.formatCountdownTime = function (e, n) {
        void 0 === n && (n = 2);var o = Math.max(0, e),
            i = Math.round(o / 1e3),
            r = Math.floor(i / 3600),
            a = Math.floor(i / 60),
            s = i % 60;return 3 == n ? (a = Math.floor((i - 3600 * r) / 60), t.toString(r, 10, 2) + ":" + t.toString(a, 10, 2) + ":" + t.toString(s, 10, 2)) : t.toString(a, 10, 2) + ":" + t.toString(s, 10, 2);
      }, t.formatTime = function (e) {
        var n = new Date(e);return t.toString(n.getMonth() + 1, 10, 2) + "/" + t.toString(n.getDate(), 10, 2) + " " + t.toString(n.getHours(), 10, 2) + ":" + t.toString(n.getMinutes(), 10, 2) + "." + t.toString(n.getSeconds(), 10, 2);
      }, t.getCurrentTime = function (t) {
        return void 0 === t && (t = 3), new Date(), "";
      }, t.replaceNewLine = function (t) {
        for (var e = t.split("\\n"), n = "", o = 0; o < e.length; o++) {
          e[o].length > 0 && (o < e.length - 1 ? n += e[o] + "\n" : n += e[o]);
        }return n;
      }, t.getStringLength = function (t) {
        var e = 0;if (t) for (var n = 0; n < t.length; n++) {
          e += t.charCodeAt(n) > 255 ? 1 : .5;
        }return e;
      }, t.formatUnitNumber = function (t, e) {
        if (void 0 === e && (e = !0), e) {
          if (t > 1e6) return Math.floor(t / 1e6 * 10) / 10 + "m";if (t > 1e3) return Math.floor(t / 1e3 * 10) / 10 + "k";
        }return t + "";
      }, t.linkStrings = function (t, e) {
        void 0 === e && (e = ",");var n = null,
            o = t.length;if (o > 0) {
          n = "";for (var i = 0; i < o; i++) {
            n += t[i], i < o - 1 && (n += e);
          }
        }return n;
      }, t.stringToByte = function (t) {
        var e,
            n,
            o = new Array();e = t.length;for (var i = 0; i < e; i++) {
          (n = t.charCodeAt(i)) >= 65536 && n <= 1114111 ? (o.push(n >> 18 & 7 | 240), o.push(n >> 12 & 63 | 128), o.push(n >> 6 & 63 | 128), o.push(63 & n | 128)) : n >= 2048 && n <= 65535 ? (o.push(n >> 12 & 15 | 224), o.push(n >> 6 & 63 | 128), o.push(63 & n | 128)) : n >= 128 && n <= 2047 ? (o.push(n >> 6 & 31 | 192), o.push(63 & n | 128)) : o.push(255 & n);
        }return o;
      }, t.byteToString = function (t) {
        if ("string" == typeof t) return t;for (var e = new o.default(), n = [], i = 0; i < t.length; i++) {
          n.push(t[i]);
        }return e.decodeUTF8(n);
      }, t.parseHexStr2Byte = function (t) {
        var e = 0,
            n = t.length;if (n % 2 != 0) return null;n /= 2;for (var o = [], i = 0; i < n; i++) {
          var r = t.substr(e, 2),
              a = parseInt(r, 16);o.push(a), e += 2;
        }return o;
      }, t.parseByte2HexStr = function (t) {
        for (var e = "", n = 0; n < t.length; n++) {
          var o = t[n].toString(16);1 == o.length && (o = "0" + o), e += o;
        }return e;
      }, t.getCodeTotal = function (t) {
        for (var e = 0, n = 0; n < t.length; n++) {
          var o = Math.abs(t.charCodeAt(n));e += o, o > 58 && e++;
        }return e;
      }, t.zeros = "00000000000000000000000000000000000000000000000000000000000", t;
    }();n.default = i, cc._RF.pop();
  }, { "../Core/ByteArray": "ByteArray" }], StringWorker: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "c324azkCwtLEKdno0lO5V+U", "StringWorker");var _o83,
        i = this && this.__extends || (_o83 = function o(t, e) {
      return (_o83 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o83(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });Object.defineProperty(n, "__esModule", { value: !0 });var r = t("../../../Common/Core/ByteArray"),
        a = t("./MsgPackFlags"),
        s = function (t) {
      function e(e, n) {
        return void 0 === e && (e = null), void 0 === n && (n = 0), t.call(this, e, n) || this;
      }return i(e, t), e.prototype.checkByte = function (t) {
        return 160 == (224 & t) || 217 == t || 218 == t || 219 == t;
      }, e.prototype.checkType = function (t) {
        return "string" == typeof t;
      }, e.prototype.assembly = function (t, e) {
        var n = new r.default();n.writeUTFBytes(t.toString()), n.length < 32 ? e.writeByte(160 | n.length) : !this.factory.checkFlag(a.default.SPEC2013_COMPATIBILITY) && n.length < 256 ? (e.writeByte(217), e.writeByte(n.length)) : n.length < 65536 ? (e.writeByte(218), e.writeShort(n.length)) : (e.writeByte(219), e.writeUnsignedInt(n.length)), e.writeBytes(n, 0, n.length);
      }, e.prototype.disassembly = function (t, e) {
        var n = -1;if (160 == (224 & t) ? n = 31 & t : 217 == t && e.bytesAvailable >= 1 ? n = e.readUnsignedByte() : 218 == t && e.bytesAvailable >= 2 ? n = e.readUnsignedShort() : 219 == t && e.bytesAvailable >= 4 && (n = e.readUnsignedInt()), e.bytesAvailable >= n) {
          var o = new r.default();return n > 0 && e.readBytes(o, 0, n), o.length > 0 ? this.factory.checkFlag(a.default.READ_STRING_AS_BYTE_ARRAY) ? o : o.readUTFBytes(n) : this.factory.checkFlag(a.default.READ_STRING_AS_BYTE_ARRAY) ? o : "";
        }return this.incomplete;
      }, e;
    }(t("./AbstractWorker").default);n.default = s, cc._RF.pop();
  }, { "../../../Common/Core/ByteArray": "ByteArray", "./AbstractWorker": "AbstractWorker", "./MsgPackFlags": "MsgPackFlags" }], SubContextViewController: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "04302TaApdACqy6cd0LqzMw", "SubContextViewController");var _o84,
        i = this && this.__extends || (_o84 = function o(t, e) {
      return (_o84 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o84(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/Sdks/GameSDK"),
        s = t("../../Common/Core/GameType"),
        c = t("../../Common/Manager/Logger"),
        l = cc._decorator,
        u = l.ccclass,
        f = (l.property, function (t) {
      function e() {
        var e = t.call(this) || this;return n._ins = e, e;
      }var n;return i(e, t), n = e, Object.defineProperty(e, "ins", { get: function get() {
          return this._ins;
        }, enumerable: !1, configurable: !0 }), e.prototype.start = function () {
        this._contextView = this.node.getComponent(cc.SubContextView), this._contextView.node.active = !1;
      }, e.prototype.hasContextView = function () {
        return a.default.sdkId == s.SdkType.QQ;
      }, e.prototype.showRank1 = function (t) {
        c.default.log("-----------showRank1---------------"), this.hasContextView() && (this._contextView.node.parent = null, this._contextView.node.width = 488, this._contextView.node.height = 600, t.addChild(this.node), a.default.postMessage("loadRank1"), this._contextView.node.active = !0, this._contextView.reset());
      }, e.prototype.closeRank1 = function (t) {
        c.default.log("-----------closeRank1---------------"), this.hasContextView() && (a.default.postMessage("closeRank1"), this._contextView.node.active = !1, t.removeChild(this._contextView.node, !0));
      }, e.prototype.showRank2 = function (t) {
        c.default.log("-----------showRank2---------------"), this.hasContextView() && (this._contextView.node.parent = null, this._contextView.node.width = 488, this._contextView.node.height = 600, t.addChild(this.node), a.default.postMessage("loadRank2"), this._contextView.node.active = !0, this._contextView.reset());
      }, e.prototype.closeRank2 = function (t) {
        c.default.log("-----------closeRank2---------------"), this.hasContextView() && (a.default.postMessage("closeRank2"), this._contextView.node.active = !1, t.removeChild(this._contextView.node, !0));
      }, e.prototype.closeView = function () {
        this._contextView && (this._contextView.node.active = !1);
      }, n = r([u], e);
    }(cc.Component));n.default = f, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/Logger": "Logger", "../../Common/Sdks/GameSDK": "GameSDK" }], SysConfig: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "34f892YQsVBxaWaNWDq05mg", "SysConfig"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../Core/GameType"),
        i = function () {
      function t() {}return t.ID = "201", t.NAME = "dash", t.SERVER_HOSTS = ["https://rane.jwetech.com:8080/", "https://rane.jwetech.com:9080/"], t.SOCKET_HOST = "wss://rane.jwetech.com:9081", t.CENTER_HOST = "https://dev.h58game.com:8101/invoke", t.LOGIN_URL = "/login/login", t.LOGOUT_URL = "/login/logout", t.CLIENT_KEY = "472770f9e581cffb09349f422af57c5d", t.SDK = o.SdkType.DEFAULT, t.DEBUG = !1, t.QQ_VIP_URL = "https://club.vip.qq.com/index?_wv=16778247&_wwv=68&_nav_bgclr=ffffff&_nav_titleclr=ffffff&_nav_txtclr=ffffff&_nav_alpha=0&pay_src=10&_wvx=10&_proxy=1&trace_detail=base64-eyJhcHBpZCI6InZhYl9jb21tIiwicGFnZV9pZCI6IjU5OSIsIml0ZW1faWQiOiI0MTQwMzEiLCJpdGVtX3R5cGUiOiI1In0=&h5costreport=1", t.QQ_20_URL = "https://club.vip.qq.com/vip20main?_wv=16777218&_wwv=8192&_proxy=1&from=vipcenter", t.QQ_20_URL_IOS = "https://club.vip.qq.com/vip20main?_wv=16777218&_wwv=8192&_proxy=1&from=vipcenter", t.DKQ_USE_URL = "https://h5.vip.qq.com/p/pay/wallet?aid=mvip.p.dx.vip_rexqc&channel=mqq", t.B_URL = "https://club.vip.qq.com/vip20rebate/bili?_proxy=1&_wwv=68&_wv=16777221", t.QQ_MUSIC_URL = "https://act.qzone.qq.com/vip/meteor/blockly/p/5897x550f2?_proxy=1&_wwv=68&_wv=16777221", t.QQ_VIDEO_URL = "https://act.qzone.qq.com/vip/meteor/blockly/p/5628x596a0?_proxy=1&_wwv=68&_wv=16777221", t;
    }();n.default = i, cc._RF.pop();
  }, { "../Core/GameType": "GameType" }], TcpBuffer: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "5dfaazTI1JDGoKpB5iYv2FX", "TcpBuffer"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../../../Common/Core/ByteArray"),
        i = t("../msgpack/MsgPack"),
        r = function () {
      function t() {}return t.test01 = function (e, n, o) {
        var i = ((o & e) + (n ^ e)) % 255;t._keys.clear(), t._keys.position = 0;for (var r = 0; r < o; r++) {
          e -= (i * o ^ n) % 255, n -= i, i = e % 255, t._keys.writeByte(255 & i);
        }return t._keys.position = 0, t._keys;
      }, t.test02 = function (e, n, o, i) {
        for (var r = t.test01(e, n, o), a = 0; a < o; a++) {
          if (a < i.length) {
            var s = i.readByte(),
                c = r.readByte();i.position -= 1, i.writeByte(255 & (s ^ c));
          }
        }i.position = 0;
      }, t.test03 = function (e, n, o) {
        return t._body.clear(), t._body.position = 0, t._buff.clear(), t._buff.position = 0, i.default.write(o, t._body), t.test02(e, n, t._body.length, t._body), t._buff.writeInt(t._body.length + 9), t._buff.writeInt(e), t._buff.writeInt(n), t._buff.writeByte(0), t._buff.writeBytes(t._body, 0, t._body.length), t._buff;
      }, t.test04 = function (e) {
        e.position = 0, e.readInt();var n = e.readInt(),
            r = e.readInt(),
            a = e.readByte();if (t._body.clear(), t._body.position = 0, e.readBytes(t._body, 0), 1 == a) {
          var s = new Zlib.Inflate(new Uint8Array(t._body.buffer)).decompress();t._body = new o.default(new Uint8Array(s).buffer);
        }return t.test02(n, r, t._body.length, t._body), { cmd: n, stamp: r, body: i.default.read(t._body) };
      }, t._keys = new o.default(), t._body = new o.default(), t._buff = new o.default(), t;
    }();n.default = r, cc._RF.pop();
  }, { "../../../Common/Core/ByteArray": "ByteArray", "../msgpack/MsgPack": "MsgPack" }], TextConfigNode: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "387d1pS3IVJ65PcMu8XOwzy", "TextConfigNode"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t, e, n) {
        for (var o in this._attributes = {}, t) {
          var i = t[o];this._attributes[o] = this.getValue(i, e, n);
        }
      }return Object.defineProperty(t.prototype, "attributes", { get: function get() {
          return this._attributes;
        }, enumerable: !1, configurable: !0 }), t.prototype.getValue = function (t, e, n) {
        if (t >= 0) {
          var o = e[t],
              i = n[t],
              r = parseFloat(i);if (o.indexOf("Array") >= 0) return this.convertArray(o, i);switch (o) {case "int":case "num":case "float":
              return isNaN(r) ? 0 : r;case "bool":case "boolean":
              return r > 0;case "string":
              return i;case "vec2":case "Vec2":case "cc.vec2":case "cc.Vec2":
              return this.convertVec2(i);case "vec3":case "Vec3":case "cc.vec3":case "cc.Vec3":
              return this.convertVec3(i);case "size":case "Size":case "cc.size":case "cc.Size":
              return this.convertSize(i);default:
              return isNaN(r) ? i : r;}
        }return i;
      }, t.prototype.convertArray = function (t, e) {
        void 0 === e && (e = "");var n = t.indexOf("<"),
            o = t.lastIndexOf(">"),
            i = t.substring(n + 1, o);if (-1 != i.indexOf("Array")) {
          var r;switch (n = i.indexOf("<"), o = i.lastIndexOf(">"), i = i.substring(n + 1, o)) {case "int":
              r = this.convertIntArray;break;case "float":case "num":
              r = this.convertNumberArray;break;case "bool":case "boolean":
              r = this.convertBooleanArray;break;default:
              r = this.convertStringArray;}for (var a = e.split(","), s = [], c = 0; c < a.length; c++) {
            var l = r(a[c], "|");s.push(l);
          }return s;
        }switch (i) {case "int":
            return this.convertIntArray(e);case "float":case "num":
            return this.convertNumberArray(e);case "bool":case "boolean":
            return this.convertBooleanArray(e);case "vec2":case "Vec2":case "cc.vec2":case "cc.Vec2":
            return this.convertVec2Array(e);case "vec3":case "Vec3":case "cc.vec3":case "cc.Vec3":
            return this.convertVec3Array(e);case "size":case "Size":case "cc.size":case "cc.Size":
            return this.convertSizeArray(e);}return this.convertStringArray(e);
      }, t.prototype.convertVec2 = function (t, e) {
        void 0 === e && (e = ",");var n = t.split(e);return n.length >= 2 ? cc.v2(parseFloat(n[0]), parseFloat(n[1])) : cc.v2();
      }, t.prototype.convertVec3 = function (t, e) {
        void 0 === e && (e = ",");var n = t.split(e);return n.length >= 3 ? cc.v3(parseFloat(n[0]), parseFloat(n[1]), parseFloat(n[2])) : cc.v3();
      }, t.prototype.convertSize = function (t, e) {
        void 0 === e && (e = ",");var n = t.split(e);return n.length >= 2 ? cc.size(parseFloat(n[0]), parseFloat(n[1])) : cc.size(0, 0);
      }, t.prototype.convertNumberArray = function (t, e) {
        void 0 === e && (e = ",");for (var n = t.split(e), o = [], i = 0; i < n.length; i++) {
          o.push(parseFloat(n[i]));
        }return o;
      }, t.prototype.convertIntArray = function (t, e) {
        void 0 === e && (e = ",");for (var n = t.split(e), o = [], i = 0; i < n.length; i++) {
          o.push(parseInt(n[i]));
        }return o;
      }, t.prototype.convertBooleanArray = function (t, e) {
        void 0 === e && (e = ",");for (var n = t.split(e), o = [], i = 0; i < n.length; i++) {
          o.push(parseInt(n[i]) > 0);
        }return o;
      }, t.prototype.convertStringArray = function (t, e) {
        return void 0 === e && (e = ","), t.split(e);
      }, t.prototype.convertVec2Array = function (t, e, n) {
        void 0 === e && (e = ","), void 0 === n && (n = "|");for (var o, i = t.split(e), r = [], a = 0; a < i.length; a++) {
          (o = i[a].split(n)).length >= 2 && r.push(cc.v2(parseFloat(o[0]), parseFloat(o[1])));
        }return r;
      }, t.prototype.convertVec3Array = function (t, e, n) {
        void 0 === e && (e = ","), void 0 === n && (n = "|");for (var o, i = t.split(e), r = [], a = 0; a < i.length; a++) {
          (o = i[a].split(n)).length >= 3 && r.push(cc.v3(parseFloat(o[0]), parseFloat(o[1]), parseFloat(o[2])));
        }return r;
      }, t.prototype.convertSizeArray = function (t, e, n) {
        void 0 === e && (e = ","), void 0 === n && (n = "|");for (var o, i = t.split(e), r = [], a = 0; a < i.length; a++) {
          (o = i[a].split(n)).length >= 2 && r.push(cc.size(parseFloat(o[0]), parseFloat(o[1])));
        }return r;
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], TextConfigRead: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "acdecLs7i9EU48J7uwOvTya", "TextConfigRead"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./TextConfigNode"),
        i = function () {
      function t(t, e) {
        void 0 === e && (e = !0), this.read(t, e);
      }return t.getNewlineSymbol = function (e) {
        for (var n = 0; n < t.NewlineCharacter.length; n++) {
          if (-1 != e.indexOf(t.NewlineCharacter[n])) return t.NewlineCharacter[n];
        }return null;
      }, t.prototype.read = function (t, e) {
        if (void 0 === e && (e = !0), this._names = {}, this._types = [], this._children = [], null != t) {
          var n,
              i = t.split("\r\n"),
              r = 0;if (i.length > 0) {
            if (n = i[r++].split("\t"), e) {
              for (var a = 0; a < n.length; a++) {
                this._names[n[a]] = a;
              }var s = i[r++];s && (this._types = s.split("\t"));
            } else this._types = i;for (a = r; a < i.length; a++) {
              this._children.push(new o.default(this._names, this._types, i[a].split("\t")));
            }
          }
        }
      }, Object.defineProperty(t.prototype, "children", { get: function get() {
          return this._children;
        }, enumerable: !1, configurable: !0 }), t.prototype.dispose = function () {
        this._names = null, this._types.length = 0, this._types = null, this._children.length = 0, this._children = null;
      }, t.NewlineCharacter = ["\r\n", "\n", "\r"], t;
    }();n.default = i, cc._RF.pop();
  }, { "./TextConfigNode": "TextConfigNode" }], TimeManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "c5012TBLYZMq6jl48HAm4KO", "TimeManager"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./GlobalEventManager"),
        i = t("../Core/GameType"),
        r = function () {
      function t(t, e, n, o) {
        void 0 === n && (n = 0), void 0 === o && (o = -1), this._time = 0, this._func = t, this._owner = e, this._delay = n, this._repeat = o;
      }return t.prototype.update = function (t) {
        0 != this._repeat && (this._time += t, this._time >= this.delay && (this._time = 0, this._func.call(this._owner, Math.max(t, this._delay)), this._repeat > 0 && this._repeat--));
      }, Object.defineProperty(t.prototype, "finshed", { get: function get() {
          return 0 == this._repeat;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "time", { get: function get() {
          return this._time;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "owner", { get: function get() {
          return this._owner;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "func", { get: function get() {
          return this._func;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "delay", { get: function get() {
          return this._delay;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "repeat", { get: function get() {
          return this._repeat;
        }, enumerable: !1, configurable: !0 }), t;
    }(),
        a = function () {
      function t() {}return t.start = function () {
        null == t._interval && (t._localTime = Date.now(), t._interval = setInterval(t.update, t.DELAYTIME));
      }, t.stop = function () {
        t._interval && (t._localTime = Date.now(), clearInterval(t._interval), t._interval = null, t._adds = [], t._remvoes = [], t._times = []);
      }, Object.defineProperty(t, "delayTime", { get: function get() {
          return t._delayTime;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t, "localTime", { get: function get() {
          return t._localTime;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t, "serverTime", { get: function get() {
          return this._severTime ? this._severTime + (t.localTime - this._upServerTime) : t._localTime;
        }, enumerable: !1, configurable: !0 }), t.checkNewDay = function () {
        if (t._serverDate) {
          var e = t.serverTime;if (e >= t._checkNewDayTime) {
            var n = new Date(e);if (t._checkNewDayTime = e + t.CHECKDAYTIME, n.getDate() - t._serverDate.getDate() > 0) return t._serverDate = n, !0;
          }
        }return !1;
      }, t.update = function () {
        if (t._interval) {
          var e = Date.now(),
              n = e - t._localTime;Math.abs(n) < 2e3 && (t._delayTime = n, t.onUpdate(n)), t._localTime = e;
        }
      }, t.onUpdate = function (e) {
        t._remove(), t._add();for (var n = 0; n < t._times.length; n++) {
          var r = t._times[n];r && (r.update(e), r.finshed && this.remove(r.func, r.owner));
        }t.checkNewDay() && o.default.dispatchEvent(i.GlobalEvent.EVENT_NEW_DAY);
      }, t.add = function (e, n, o, i) {
        void 0 === o && (o = 0), void 0 === i && (i = -1), n && e && t._adds.push(new r(e, n, o, i));
      }, t.remove = function (e, n) {
        if (n && e) {
          var o = { owner: n, func: e };t._remvoes.push(o);
        }
      }, t.removeTarget = function (e) {
        if (e) {
          var n = { owner: e };t._remvoes.push(n);
        }
      }, t._findFunc = function (e) {
        if (e) for (var n = 0; n < t._times.length; n++) {
          var o = t._times[n];if (e.owner == o.owner && (null == e.func || null != e.func && e.func == o.func)) return n;
        }return -1;
      }, t._add = function () {
        if (t._adds.length > 0) {
          for (var e = 0; e < t._adds.length; e++) {
            var n = t._adds[e];-1 == t._findFunc(n) && t._times.push(n);
          }t._adds = [];
        }
      }, t._remove = function () {
        if (t._remvoes.length > 0) {
          for (var e = 0; e < t._remvoes.length; e++) {
            var n = t._remvoes[e],
                o = t._findFunc(n);o > -1 && t._times.splice(o, 1);
          }t._remvoes = [];
        }
      }, t.upServerTime = function (e) {
        t._upServerTime = Date.now(), t._severTime = e, t._serverDate = new Date(e), t._checkNewDayTime = t.serverTime + t.CHECKDAYTIME;
      }, t.isCurrentDay = function (e) {
        if (0 == e) return !1;var n = new Date(t.serverTime),
            o = new Date(e);return n.getFullYear() == o.getFullYear() && n.getMonth() == o.getMonth() && n.getDay() == o.getDay();
      }, t.timeToInt = function (t) {
        return 1e4 * t.getFullYear() + 100 * (t.getMonth() + 1) + t.getDate();
      }, t.FRAME_RATE = 60, t.DELAYTIME = 1e3 / t.FRAME_RATE, t.CHECKDAYTIME = 5e3, t._localTime = 0, t._delayTime = 0, t._adds = [], t._remvoes = [], t._times = [], t;
    }();n.default = a, cc._RF.pop();
  }, { "../Core/GameType": "GameType", "./GlobalEventManager": "GlobalEventManager" }], UIExchangeLog: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "862ddOH8eBBypo/vDDfu5hV", "UIExchangeLog");var _o85,
        i = this && this.__extends || (_o85 = function o(t, e) {
      return (_o85 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o85(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/Util/ComponentUtil"),
        s = cc._decorator,
        c = s.ccclass,
        l = (s.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.onLoad = function () {
        this.lb_time = a.default.getComponent(cc.Label, this.node, "lb_time"), this.lb_item = a.default.getComponent(cc.Label, this.node, "lb_item");
      }, e.prototype.onEnable = function () {
        this.refresh();
      }, e.prototype.onDisable = function () {}, e.prototype.onDestroy = function () {}, Object.defineProperty(e.prototype, "data", { get: function get() {
          return this._data;
        }, set: function set(t) {
          this._data = t;
        }, enumerable: !1, configurable: !0 }), e.prototype.refresh = function () {
        this._data && (this.lb_time.string = this._data.t, this.lb_item.string = this._data.item_name);
      }, r([c], e);
    }(cc.Component));n.default = l, cc._RF.pop();
  }, { "../../Common/Util/ComponentUtil": "ComponentUtil" }], UIExchange: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "a56afbRWvNGzrs9Lxh3dDWS", "UIExchange");var _o86,
        i = this && this.__extends || (_o86 = function o(t, e) {
      return (_o86 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o86(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/Util/ComponentUtil"),
        s = t("../../Common/Manager/MusicManager"),
        c = t("../../Common/UI/UIManager"),
        l = t("../../Common/Manager/LoadResManager"),
        u = t("./ItemMessageTips"),
        f = t("../Config/ProductConfig"),
        d = cc._decorator,
        h = d.ccclass,
        p = (d.property, function (t) {
      function e() {
        var e = null !== t && t.apply(this, arguments) || this;return e._useCount = 0, e;
      }return i(e, t), e.prototype.onLoad = function () {
        this.lb_name = a.default.getComponent(cc.Label, this.node, "lb_name"), this.sp_floor = a.default.getComponent(cc.Sprite, this.node, "sp_floor"), this.sp_icon = a.default.getComponent(cc.Sprite, this.node, "sp_floor/sp_icon"), this.sp_limit = a.default.getComponent(cc.Sprite, this.node, "sp_floor/sp_limit"), this.lb_gift = a.default.getComponent(cc.Label, this.node, "lb_gift"), this.btn_exchange = a.default.getComponent(cc.Button, this.node, "btn_exchange"), this.btn_exchange.node.on(cc.Node.EventType.TOUCH_END, this.onTouchHandler, this), this.lb_remain = a.default.getComponent(cc.Label, this.node, "lb_remain"), this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchHandler, this);
      }, e.prototype.onEnable = function () {
        this.refresh();
      }, e.prototype.onDisable = function () {}, e.prototype.onDestroy = function () {
        this.btn_exchange.node.targetOff(this), this.node.targetOff(this), this._exchange = null;
      }, Object.defineProperty(e.prototype, "exchange", { get: function get() {
          return this._exchange;
        }, set: function set(t) {
          this._exchange = t;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "useCount", { get: function get() {
          return this._useCount;
        }, set: function set(t) {
          this._useCount = t;
        }, enumerable: !1, configurable: !0 }), e.prototype.getRemain = function () {
        var t = this.exchange.total - this._useCount;return t < 0 ? 0 : t;
      }, e.prototype.refresh = function () {
        if (this._exchange) {
          var t = f.default.ins.getItem(this._exchange.id);l.default.loadSprite(this.sp_icon, "Atlas/atlas_item/" + t.icon), this.lb_name.string = t.name, this.lb_gift.string = this.exchange.giftCoupon + "\u5956\u5238", 2 == this._exchange.type ? (this.sp_limit.node.active = !0, this.lb_remain.node.active = !0, this.lb_remain.string = "\u603B\u5269\u4F59\uFF1A" + this.getRemain().toString()) : 1 == this._exchange.type ? (this.sp_limit.node.active = !0, this.lb_remain.node.active = !0, this.lb_remain.string = "\u4ECA\u65E5\u5269\u4F59\uFF1A" + this.getRemain().toString()) : (this.sp_limit.node.active = !1, this.lb_remain.node.active = !1);var e = a.default.getComponent(cc.Sprite, this.btn_exchange.node, "Background");0 == this.exchange.total || this.getRemain() > 0 ? (l.default.loadSprite(e, "Atlas/atlas_lottery/gift_btn_dh"), this.btn_exchange.interactable = !0) : (l.default.loadSprite(e, "Atlas/atlas_lottery/gift_btn_dh_disab"), this.btn_exchange.interactable = !1);
        }
      }, e.prototype.onTouchHandler = function () {
        s.default.playEffect(s.default.CLICK), c.default.show(u.default, { UIExchange: this });
      }, e.prototype.useCountChange = function (t) {
        this.useCount = t, this.refresh();
      }, r([h], e);
    }(cc.Component));n.default = p, cc._RF.pop();
  }, { "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/ProductConfig": "ProductConfig", "./ItemMessageTips": "ItemMessageTips" }], UIItem: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "e5173v0tcdLHY01i5FoioI5", "UIItem"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t(t, e) {
        void 0 === e && (e = null), this.node = t, this.data = e, this.node.active = !0, this.init();
      }return t.prototype.init = function () {}, Object.defineProperty(t.prototype, "active", { get: function get() {
          return this.node.active;
        }, set: function set(t) {
          this.node.active = t;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "x", { get: function get() {
          return this.node.x;
        }, set: function set(t) {
          this.node.x = t;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(t.prototype, "y", { get: function get() {
          return this.node.y;
        }, set: function set(t) {
          this.node.y = t;
        }, enumerable: !1, configurable: !0 }), t.prototype.destroy = function () {
        this.node = null;
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], UILottery: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "44201RD5QZHIqrGAGBumq9K", "UILottery");var _o87,
        i = this && this.__extends || (_o87 = function o(t, e) {
      return (_o87 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o87(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../Common/Util/ComponentUtil"),
        s = t("../../Common/Manager/LoadResManager"),
        c = t("../../Common/Sdks/GameSDK"),
        l = cc._decorator,
        u = l.ccclass,
        f = (l.property, function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.onLoad = function () {
        this.sp_select = a.default.getComponent(cc.Sprite, this.node, "sp_select"), this.sp_icon = a.default.getComponent(cc.Sprite, this.node, "sp_icon");
      }, e.prototype.onEnable = function () {
        this._productData && (106 == this._productData.id && c.default.isIos() ? s.default.loadSprite(this.sp_icon, "Atlas/atlas_item/" + this._productData.icon + "_ios") : s.default.loadSprite(this.sp_icon, "Atlas/atlas_item/" + this._productData.icon));
      }, e.prototype.onDisable = function () {}, Object.defineProperty(e.prototype, "id", { get: function get() {
          return this._id;
        }, set: function set(t) {
          this._id = t;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "productData", { get: function get() {
          return this._productData;
        }, set: function set(t) {
          this._productData = t, this.sp_icon && s.default.loadSprite(this.sp_icon, "Atlas/atlas_item/" + this._productData.icon);
        }, enumerable: !1, configurable: !0 }), r([u], e);
    }(cc.Component));n.default = f, cc._RF.pop();
  }, { "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/Util/ComponentUtil": "ComponentUtil" }], UIManager: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "9ce19ZnaYdBFKyn/nlrZ870", "UIManager"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("../Core/GameType"),
        i = t("../Util/ComponentUtil"),
        r = function () {
      function t() {}return t.init = function (e) {
        if (void 0 === e && (e = null), null == t.node) for (var n in t.uiLayers = [], t.node = new cc.Node(), o.UILayerType) {
          if ("string" == typeof n && !isNaN(parseInt(n))) {
            var i = new cc.Node();i.name = "UILayerType_" + n, t.node.addChild(i);var r = i.addComponent(cc.Widget);r.alignMode = cc.Widget.AlignMode.ALWAYS, r.isAlignLeft = !0, r.isAlignBottom = !0, r.left = 0, r.bottom = 0, r.target = t.node, i.setContentSize(0, 0), t.uiLayers[parseInt(n)] = i;
          }
        }t.node.parent && (t.node.parent.removeChild(t.node), t.node.parent = null), e && e.addChild(t.node), t.scene = e;var a = cc.view.getFrameSize();this.ASPECT_RATIO = a.height / a.width;
      }, t.remove = function (e) {
        var n = t.getClazzName(e),
            o = t.clazzMap[n];if (o) {
          var i = t.getLayerNode(o.layerType);i && (t.removeLayerChildren(i), i.removeChild(o.node)), t.clazzMap[n] = null, o.close(), o.destroy();
        }
      }, t.isShow = function (e) {
        var n = t.getClazzName(e),
            o = t.clazzMap[n];return !!o && o.isShow;
      }, t.add = function (e, n) {
        t.clazzMap[e] = n;
      }, t.preload = function (e) {
        var n = t.getClazzName(e);null != n && null == t.clazzMap[n] && cc.resources.load("Panel/" + n, null, function (e, o) {
          if (e) cc.error(e.message || e);else if (null == t.clazzMap[n]) {
            var r = cc.instantiate(o),
                a = i.default.getUIPanel(r);t.clazzMap[n] = a;
          }
        });
      }, t.show = function (e, n) {
        void 0 === n && (n = null);var o,
            r = t.getClazzName(e);null != r && (null == t.clazzMap[r] ? cc.resources.load("Panel/" + r, null, function (e, a) {
          if (e) cc.error(e.message || e);else {
            if (null == t.clazzMap[r]) {
              var s = cc.instantiate(a);o = i.default.getUIPanel(s), t.clazzMap[r] = o;
            } else o = t.clazzMap[r];t.addToLayer(o, n);
          }
        }) : (o = t.clazzMap[r], t.addToLayer(o, n)));
      }, t.close = function (e) {
        var n = t.getClazzName(e),
            o = t.clazzMap[n];o && (o.close(), null != o.node.parent && (o.node.parent = null));
      }, t.getClazzName = function (t) {
        return cc.js.getClassName(t);
      }, t.getPanel = function (e) {
        return t.clazzMap[e];
      }, t.addToLayer = function (e, n) {
        if (void 0 === n && (n = null), e && e.node && null == e.node.parent) {
          var o = t.getLayerNode(e.layerType);o && (t.removeLayerChildren(o), o.addChild(e.node), e.show(n));
        }
      }, t.clearLayer = function (e) {
        var n = t.getLayerNode(e);n && t.removeLayerChildren(n);
      }, t.removeLayerChildren = function (e) {
        if (e) {
          var n = e.children;if (n) for (var o, r = 0; r < n.length; r++) {
            (o = i.default.getUIPanel(n[r])) && t.close(o);
          }e.removeAllChildren();
        }
      }, t.getLayerNode = function (e) {
        return t.uiLayers[e];
      }, t.callClazzFunc = function (e, n) {
        for (var o = [], i = 2; i < arguments.length; i++) {
          o[i - 2] = arguments[i];
        }var r = t.getClazzName(e),
            a = t.clazzMap[r];a && a[n] && (o ? o.length > 1 ? a[n](o) : a[n](o[0]) : a[n]());
      }, t.clazzMap = {}, t.ASPECT_RATIO = 1.7, t;
    }();n.default = r, cc._RF.pop();
  }, { "../Core/GameType": "GameType", "../Util/ComponentUtil": "ComponentUtil" }], UIPanel: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "e49a9xtf95LJrznHAlbiN6L", "UIPanel");var _o88,
        i = this && this.__extends || (_o88 = function o(t, e) {
      return (_o88 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o88(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../Core/GameType"),
        s = t("../Core/GameType"),
        c = t("../Manager/GlobalEventManager"),
        l = cc._decorator,
        u = l.ccclass,
        f = (l.property, function (t) {
      function e() {
        var e = t.call(this) || this;return e._isShade = !0, e._isForceShade = !1, e._isInit = !1, e._isShow = !1, e;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return a.UILayerType.MainLayer;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "uiName", { get: function get() {
          return this.node ? this.node.name : this.name;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "isInit", { get: function get() {
          return this._isInit;
        }, enumerable: !1, configurable: !0 }), e.prototype.onLoad = function () {
        var t = cc.view.getVisibleSize();this.node.x = 0, this.node.y = 0, this.node.setContentSize(t.width, t.height);
      }, e.prototype.onEnable = function () {}, Object.defineProperty(e.prototype, "isShow", { get: function get() {
          return this._isInit && this._isShow;
        }, enumerable: !1, configurable: !0 }), Object.defineProperty(e.prototype, "data", { get: function get() {
          return this._data;
        }, enumerable: !1, configurable: !0 }), e.prototype.clearData = function () {
        this._data = null;
      }, e.prototype.start = function () {}, e.prototype.show = function (t) {
        this._data = t, this._isInit ? this.shadeResize() : (this._isInit = !0, this.initShade(), this.onStart()), this._isShow || (this._isShow = !0, this.onShow(), c.default.dispatchEvent(s.UIEvent.EVENT_SHOW, this));
      }, e.prototype.close = function () {
        this._isShow && (this._isShow = !1, this.onClose(), c.default.dispatchEvent(s.UIEvent.EVENT_CLOSE, this));
      }, e.prototype.onStart = function () {}, e.prototype.onShow = function () {}, e.prototype.onClose = function () {}, e.prototype.onDestroy = function () {}, e.prototype.initShade = function () {
        if (this._isForceShade || this._isShade && this.layerType == a.UILayerType.PopLayer) if (null == this._shade) {
          this._shade = new cc.Node(), this.node.insertChild(this._shade, 0), this.node.addComponent(cc.BlockInputEvents);var t = this;cc.resources.load("Atlas/atlas_sub/icon_color", cc.SpriteFrame, function (e, n) {
            var o = t._shade.addComponent(cc.Sprite);o.spriteFrame = n, o.node.color = new cc.Color(0, 0, 0), o.node.opacity = 196, t.shadeResize();
          });
        } else this.shadeResize();
      }, e.prototype.shadeResize = function () {
        this._shade && (this._shade.width = cc.view.getVisibleSize().width, this._shade.height = cc.view.getVisibleSize().height);
      }, r([u], e);
    }(cc.Component));n.default = f, cc._RF.pop();
  }, { "../Core/GameType": "GameType", "../Manager/GlobalEventManager": "GlobalEventManager" }], UmaTrackHelper: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "d0dcfhdWyVD4aKesXHXA6L2", "UmaTrackHelper"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./GameSDK"),
        i = t("../Core/GameType"),
        r = function () {
      function t() {}return t.trackEvent = function (t) {
        o.default.sdkId == i.SdkType.QQ && qq.uma.trackEvent(t);
      }, t.exchange = function (e) {
        switch (e) {case 201:
            t.trackEvent("1206");break;case 202:
            t.trackEvent("1207");break;case 203:
            t.trackEvent("1208");break;case 204:
            t.trackEvent("1209");break;case 205:
            t.trackEvent("1210");break;case 206:
            t.trackEvent("1211");break;case 207:
            t.trackEvent("1212");break;case 208:
            t.trackEvent("1213");break;case 209:
            t.trackEvent("1214");break;case 210:
            t.trackEvent("1215");}
      }, t.reviveShow = function (e) {
        0 == e ? t.trackEvent("1302") : 1 == e ? t.trackEvent("1305") : 2 == e && t.trackEvent("1308");
      }, t.reviveClick = function (e) {
        0 == e ? t.trackEvent("1303") : 1 == e ? t.trackEvent("1306") : 2 == e && t.trackEvent("1309");
      }, t.reviveFinish = function (e) {
        0 == e ? t.trackEvent("1304") : 1 == e ? t.trackEvent("1307") : 2 == e && t.trackEvent("1310");
      }, t;
    }();n.default = r, cc._RF.pop();
  }, { "../Core/GameType": "GameType", "./GameSDK": "GameSDK" }], UpgradePropConfirm: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "f7735yxvztK6oCOcWjSJ6rZ", "UpgradePropConfirm");var _o89,
        i = this && this.__extends || (_o89 = function o(t, e) {
      return (_o89 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o89(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.WatchVideoAdConfirmData = void 0;var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Core/GameType"),
        c = t("../../Common/Util/ComponentUtil"),
        l = t("../../Common/Manager/MusicManager"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Net/GameClient"),
        d = t("../../Common/Sdks/GameSDK"),
        h = t("../Info/ItemsInfo"),
        p = t("../Config/ProductConfig"),
        _ = t("../../Common/Manager/LoadResManager"),
        m = t("../Fb/FbPkMatchPanel"),
        g = cc._decorator,
        y = g.ccclass,
        b = (g.property, function () {});n.WatchVideoAdConfirmData = b;var C = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return s.UILayerType.SubPopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = c.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_ok = c.default.getComponent(cc.Button, this.node, "frame/btn_ok"), this.btn_ok.node.on(cc.Node.EventType.TOUCH_END, this.onTouchOKHandler, this), this.info_label = c.default.getComponent(cc.Label, this.node, "frame/info_label"), this.before_upgrade_icon = c.default.getComponent(cc.Sprite, this.node, "frame/upgrade_node/before_upgrade/icon"), this.before_upgrade_name = c.default.getComponent(cc.Label, this.node, "frame/upgrade_node/before_upgrade/name"), this.after_upgrade_icon = c.default.getComponent(cc.Sprite, this.node, "frame/upgrade_node/after_upgrade/icon"), this.after_upgrade_name = c.default.getComponent(cc.Label, this.node, "frame/upgrade_node/after_upgrade/name");
      }, e.prototype.onShow = function () {
        var t = h.default.ins.getCurrentItemId();console.log("current_use_id", t);var e = p.default.ins.getItem(t),
            n = p.default.ins.getItem(t + 1);console.log("propInfo", e), h.default.current_use_id = t, _.default.loadSprite(this.before_upgrade_icon, "Atlas/atlas_item/" + e.icon), _.default.loadSprite(this.after_upgrade_icon, "Atlas/atlas_item/" + n.icon), this.before_upgrade_name.string = e.name, this.after_upgrade_name.string = n.name, this.info_label.string = "\u672C\u5C40\u643A\u5E26\u9053\u5177\u4E3A" + e.name + "\n\u53EF\u901A\u8FC7\u89C2\u770B\u5E7F\u544A\u5347\u7EA7\u9053\u5177";
      }, e.prototype.onClose = function () {
        f.default.ins.removeAll(this);
      }, e.prototype.onTouchCloseHandler = function () {
        l.default.playEffect(l.default.CLICK), u.default.close(this), u.default.show(m.default);
      }, e.prototype.onTouchOKHandler = function () {
        var t = this;l.default.playEffect(l.default.CLICK), d.default.showVideoAd(function () {
          h.default.current_use_id += 1, u.default.close(t), u.default.show(m.default);
        }, this, s.VideoAdType.ItemUpgrade);
      }, e.prototype.answerRePlay = function (t) {
        f.default.ins.send(529, { rid: this.data.rid, agree: t });
      }, e.prototype.cmd0x0211Handler = function (t) {
        t.isError || (t.body, u.default.close(this));
      }, e.prototype.onDestroy = function () {
        this.btn_close.node.targetOff(this), this.btn_ok.node.targetOff(this), t.prototype.onDestroy.call(this);
      }, r([y], e);
    }(a.default);n.default = C, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/LoadResManager": "LoadResManager", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/Sdks/GameSDK": "GameSDK", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Config/ProductConfig": "ProductConfig", "../Fb/FbPkMatchPanel": "FbPkMatchPanel", "../Info/ItemsInfo": "ItemsInfo", "../Net/GameClient": "GameClient" }], Vec3Util: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "e4e8fMz0VJN6ZLypXDl2Q0x", "Vec3Util"), Object.defineProperty(n, "__esModule", { value: !0 });var o = function () {
      function t() {}return t.add = function (t, e, n) {
        void 0 === n && (n = null);var o = n || cc.v3();return cc.Vec3.add(o, t, e);
      }, t.subtract = function (t, e, n) {
        void 0 === n && (n = null);var o = n || cc.v3();return cc.Vec3.subtract(o, t, e);
      }, t.multiply = function (t, e, n) {
        void 0 === n && (n = null);var o = n || cc.v3();return cc.Vec3.multiply(o, t, e);
      }, t.divide = function (t, e, n) {
        void 0 === n && (n = null);var o = n || cc.v3();return cc.Vec3.divide(o, t, e);
      }, t.ceil = function (t, e) {
        void 0 === e && (e = null);var n = e || cc.v3();return cc.Vec3.ceil(n, t);
      }, t.floor = function (t, e) {
        return void 0 === e && (e = null), e || cc.v3(), cc.Vec3.floor(t, e);
      }, t.min = function (t, e, n) {
        void 0 === n && (n = null);var o = n || cc.v3();return cc.Vec3.min(o, t, e);
      }, t.max = function (t, e, n) {
        void 0 === n && (n = null);var o = n || cc.v3();return cc.Vec3.max(o, t, e);
      }, t.round = function (t, e) {
        void 0 === e && (e = null);var n = e || cc.v3();return cc.Vec3.round(n, t);
      }, t.multiplyScalar = function (t, e, n) {
        void 0 === n && (n = null);var o = n || cc.v3();return cc.Vec3.multiplyScalar(o, t, e);
      }, t.dot = function (t, e, n) {
        return void 0 === n && (n = null), cc.Vec3.dot(t, e);
      }, t.cross = function (t, e, n) {
        void 0 === n && (n = null);var o = n || cc.v3();return cc.Vec3.cross(o, t, e);
      }, t.lerp = function (t, e, n, o) {
        void 0 === o && (o = null);var i = o || cc.v3();return cc.Vec3.lerp(i, t, e, n);
      }, t.random = function (t, e) {
        void 0 === e && (e = null);var n = e || cc.v3();return cc.Vec3.random(n, t);
      }, t;
    }();n.default = o, cc._RF.pop();
  }, {}], WatchVideoAdConfirm: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "3a04dCvgE1Ng5Z2c7J5Xc3m", "WatchVideoAdConfirm");var _o90,
        i = this && this.__extends || (_o90 = function o(t, e) {
      return (_o90 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o90(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.WatchVideoAdConfirmData = void 0;var a = t("../../Common/UI/UIPanel"),
        s = t("../../Common/Core/GameType"),
        c = t("../../Common/Util/ComponentUtil"),
        l = t("../../Common/Manager/MusicManager"),
        u = t("../../Common/UI/UIManager"),
        f = t("../Net/GameClient"),
        d = cc._decorator,
        h = d.ccclass,
        p = (d.property, function () {});n.WatchVideoAdConfirmData = p;var _ = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), Object.defineProperty(e.prototype, "layerType", { get: function get() {
          return s.UILayerType.SubPopLayer;
        }, enumerable: !1, configurable: !0 }), e.prototype.onStart = function () {
        this.btn_close = c.default.getComponent(cc.Button, this.node, "frame/btn_close"), this.btn_close.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCloseHandler, this), this.btn_ok = c.default.getComponent(cc.Button, this.node, "frame/btn_ok"), this.btn_ok.node.on(cc.Node.EventType.TOUCH_END, this.onTouchOKHandler, this), this.label_tip_content = c.default.getComponent(cc.Label, this.node, "frame/label_tip_content");
      }, e.prototype.onShow = function () {
        this.label_tip_content.string = this.data.tipText;
      }, e.prototype.onClose = function () {
        f.default.ins.removeAll(this);
      }, e.prototype.onTouchCloseHandler = function () {
        l.default.playEffect(l.default.CLICK), u.default.close(this);
      }, e.prototype.onTouchOKHandler = function () {
        l.default.playEffect(l.default.CLICK), this.data.func(), u.default.close(this);
      }, e.prototype.answerRePlay = function (t) {
        f.default.ins.send(529, { rid: this.data.rid, agree: t });
      }, e.prototype.cmd0x0211Handler = function (t) {
        t.isError || (t.body, u.default.close(this));
      }, e.prototype.onDestroy = function () {
        this.btn_close.node.targetOff(this), this.btn_ok.node.targetOff(this), t.prototype.onDestroy.call(this);
      }, r([h], e);
    }(a.default);n.default = _, cc._RF.pop();
  }, { "../../Common/Core/GameType": "GameType", "../../Common/Manager/MusicManager": "MusicManager", "../../Common/UI/UIManager": "UIManager", "../../Common/UI/UIPanel": "UIPanel", "../../Common/Util/ComponentUtil": "ComponentUtil", "../Net/GameClient": "GameClient" }], WorkerFactory: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "a944ccSbGVEcbLMajoDwnHr", "WorkerFactory"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./MsgPackError"),
        i = function () {
      function t(t) {
        this.flags = t, this.workers = new Array();
      }return t.prototype.assign = function (t) {
        if (t) {
          t.factory && t.factory.unassign(t), t.factory = this;var e = this.workers.length;if (0 == e) this.workers.push(t);else {
            for (var n = 0; n < e; n++) {
              if (this.workers[n].priority < t.priority) return void this.workers.splice(n, 0, t);
            }this.workers.push(t);
          }
        }
      }, t.prototype.unassign = function (t) {
        for (var e = this.workers.length, n = 0; n < e; n++) {
          if (this.workers[n] == t) return t.factory = null, this.workers.splice(n, 1)[0];
        }throw new o.default("Worker cannot be unassigned because it hasn't been assigned");
      }, t.prototype.assignAll = function (t) {
        for (; t.length > 0;) {
          this.assign(t.pop());
        }
      }, t.prototype.unassignAll = function () {
        for (var t = new Array(); this.workers.length > 0;) {
          t.push(this.unassign(this.workers[0]));
        }return t;
      }, t.prototype.getWorkerByClass = function (t) {
        for (var e = cc.js.getClassName(t), n = this.workers.length, i = 0; i < n; i++) {
          if (cc.js.getClassName(this.workers[i]) != e) return this.workers[i];
        }throw new o.default("Worker for class '" + e + "' not found");
      }, t.prototype.getWorkerByType = function (t) {
        for (var e = this.workers.length, n = 0; n < e; n++) {
          if (this.workers[n].checkType(t)) return this.workers[n];
        }throw new o.default("Worker for type '" + cc.js.getClassName(t) + "' not found");
      }, t.prototype.getWorkerByByte = function (t) {
        for (var e = this.workers.length, n = 0; n < e; n++) {
          if (this.workers[n].checkByte(t)) return this.workers[n];
        }throw new o.default("Worker for signature 0x" + t.toString(16) + " not found");
      }, t.prototype.checkFlag = function (t) {
        return 0 != (t & this.flags);
      }, t;
    }();n.default = i, cc._RF.pop();
  }, { "./MsgPackError": "MsgPackError" }], WorkerPriority: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "70ee2Y7VhNE+INryoEdsczz", "WorkerPriority"), Object.defineProperty(n, "__esModule", { value: !0 });var o = t("./MsgPackError"),
        i = function () {
      function t() {
        throw new o.default("WorkerPriority cannot be instantiated.");
      }return t.DEFAULT_PRIORITY = -50, t;
    }();n.default = i, cc._RF.pop();
  }, { "./MsgPackError": "MsgPackError" }], achievement_item: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "94f56v7HaZKsLtOt50w4tzy", "achievement_item");var _o91,
        i = this && this.__extends || (_o91 = function o(t, e) {
      return (_o91 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o91(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 }), n.AchievementItemData = void 0;var a = cc._decorator,
        s = a.ccclass,
        c = (a.property, t("../../../Common/Manager/Logger")),
        l = t("../../../Common/Util/ComponentUtil"),
        u = t("../../../Common/Manager/LoadResManager"),
        f = t("../../Manager/CommandController"),
        d = t("../ReceiveGiftTips"),
        h = t("../../../Common/UI/UIManager"),
        p = t("../../Info/PlayerInfo"),
        _ = t("../../../Common/Sdks/GameSDK");n.AchievementItemData = function () {};var m = function (t) {
      function e() {
        return null !== t && t.apply(this, arguments) || this;
      }return i(e, t), e.prototype.onLoad = function () {
        this.icon_bg = l.default.getComponent(cc.Sprite, this.node, "icon_bg"), this.icon = l.default.getComponent(cc.Sprite, this.node, "icon_bg/icon"), this.name_label = l.default.getComponent(cc.Label, this.node, "name_label"), this.points_label = l.default.getComponent(cc.Label, this.node, "points_label"), this.bar = l.default.getComponent(cc.Sprite, this.node, "bar_bg/bar"), this.total_points_label = l.default.getComponent(cc.Label, this.node, "total_points_label"), this.btn_receive_gift = l.default.getComponent(cc.Button, this.node, "btn_receive_gift"), this.gift_icon = l.default.getComponent(cc.Sprite, this.node, "btn_receive_gift/bg/gift_icon"), this.gift_count_label = l.default.getComponent(cc.Label, this.node, "btn_receive_gift/bg/gift_count_label"), this.isCompleted_node = l.default.getNode(this.node, "isCompleted"), this.btn_receive_gift.node.on("touchend", this.onTouchReceiveGiftHandler, this);
      }, e.prototype.start = function () {}, e.prototype.init = function (t) {
        if (this.id = t.id, this.spId = t.spId, this.giftName = t.gift_name, this.giftIcon = t.gift_icon, this.giftCount = t.gift_count, this.finished = t.finished, t.icon_bg && (this.icon_bg.spriteFrame = null), t.icon) {
          var e = "Atlas/atlas_achievement/" + t.icon;u.default.loadSprite(this.icon, e);
        }t.gift_icon && (e = "Atlas/atlas_item/" + t.gift_icon, u.default.loadSprite(this.gift_icon, e)), t.completed ? (this.btn_receive_gift.node.active = !1, this.isCompleted_node.active = !0) : (this.btn_receive_gift.node.active = !0, this.isCompleted_node.active = !1), this.btn_receive_gift.interactable = t.finished, this.name_label.string = t.name_label, this.points_label.string = t.current_points + t.unit, this.total_points_label.string = t.current_points + "/" + t.total_points, this.gift_count_label.string = t.gift_count.toString(), "\u540D" == t.unit ? (this.total_points_label.string = "\u524D" + t.total_points + "\u540D", 0 == t.current_points ? (this.bar.fillRange = 0, this.points_label.string = "\u672A\u4E0A\u699C") : this.bar.fillRange = 2 * t.total_points - t.current_points / t.total_points) : this.bar.fillRange = t.current_points / t.total_points;
      }, e.prototype.onTouchReceiveGiftHandler = function () {
        if (this.finished) {
          f.default.achieveReward(this.id, this.onFinishedReceive, this);var t = { name: this.giftName, icon: this.giftIcon, count: this.giftCount, type: d.ReceiveGiftTipType.ForSign };h.default.show(d.default, t), 1 == this.spId && (p.default.ins.money += this.giftCount), 2 == this.spId && (p.default.ins.giftCoupon += this.giftCount);
        } else _.default.sdk.showToast("\u60A8\u8FD8\u6CA1\u6709\u8FBE\u6210\u8BE5\u6210\u5C31", 1e3);
      }, e.prototype.onFinishedReceive = function () {
        c.default.log("\u6210\u5C31" + this.id + "\u5956\u52B1\u9886\u53D6\u6210\u529F"), cc.game.emit("refreshAchievementList");
      }, r([s], e);
    }(cc.Component);n.default = m, cc._RF.pop();
  }, { "../../../Common/Manager/LoadResManager": "LoadResManager", "../../../Common/Manager/Logger": "Logger", "../../../Common/Sdks/GameSDK": "GameSDK", "../../../Common/UI/UIManager": "UIManager", "../../../Common/Util/ComponentUtil": "ComponentUtil", "../../Info/PlayerInfo": "PlayerInfo", "../../Manager/CommandController": "CommandController", "../ReceiveGiftTips": "ReceiveGiftTips" }], defclass: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "20cd2CTsh9KjIrtrjPLXJaw", "defclass"), Object.defineProperty(n, "__esModule", { value: !0 }), n.defclass = void 0, n.defclass = function (t) {
      var e = cc._RF.peek();e && cc.js.setClassName(e.script, t);
    }, cc._RF.pop();
  }, {}], gamesdks: [function (t, e) {
    "use strict";
    cc._RF.push(e, "e6538DoZw5H9oqjT7BBcHs7", "gamesdks"), cc._RF.pop();
  }, {}], incomplete: [function (t, e) {
    "use strict";
    cc._RF.push(e, "fb32fc1CLpPgqaIKUHSwNwO", "incomplete"), cc._RF.pop();
  }, {}], sign_item: [function (t, e, n) {
    "use strict";
    cc._RF.push(e, "a35093M8uBOhZtUw9EtA0cf", "sign_item");var _o92,
        i = this && this.__extends || (_o92 = function o(t, e) {
      return (_o92 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }_o92(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__decorate || function (t, e, n, o) {
      var i,
          r = arguments.length,
          a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;if ("object" == (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o);else for (var s = t.length - 1; s >= 0; s--) {
        (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
      }return r > 3 && a && Object.defineProperty(e, n, a), a;
    };Object.defineProperty(n, "__esModule", { value: !0 });var a = t("../../../Common/Sdks/UmaTrackHelper"),
        s = t("../../../Common/Manager/Logger"),
        c = t("../../../Common/Util/ComponentUtil"),
        l = t("../../../Common/Manager/LoadResManager"),
        u = t("../../Manager/CommandController"),
        f = t("../../Info/SignInfo"),
        d = t("../../../Common/Sdks/GameSDK"),
        h = t("../../Config/ProductConfig"),
        p = t("../ReceiveGiftTips"),
        _ = t("../../../Common/UI/UIManager"),
        m = t("../../Info/PlayerInfo"),
        g = t("../../Config/SignConfig"),
        y = t("../../../Common/Core/GameType"),
        b = cc._decorator,
        C = b.ccclass,
        v = (b.property, function (t) {
      function e() {
        var e = null !== t && t.apply(this, arguments) || this;return e.weekDays = ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"], e;
      }return i(e, t), e.prototype.onLoad = function () {}, e.prototype.start = function () {}, e.prototype.init = function (t) {
        this.sign_list = g.default.ins.getList(), this.days_label = c.default.getComponent(cc.Label, this.node, "bg/days"), this.icon = c.default.getComponent(cc.Sprite, this.node, "bg/icon"), this.name_count = c.default.getComponent(cc.Label, this.node, "bg/name_count"), this.is_got = c.default.getNode(this.node, "is_got"), this.particle = c.default.getNode(this.node, "particle"), this.btn_buqian = c.default.getNode(this.node, "btn_buqian"), this.btn_buqian.on("touchend", this.onBtnBuQianClick, this), this.node.active = !0, this.day = t.days + 1, this.days_label.string = "\u661F\u671F" + this.weekDays[t.days], l.default.loadSprite(this.icon, t.icon), this.name_count.string = t.name_count, this.show_is_got(t.show_is_got), this.show_particle(t.show_particle), this.show_btn_buqian(t.show_btn_buqian);
      }, e.prototype.show_is_got = function (t) {
        this.is_got.active = t;
      }, e.prototype.show_particle = function (t) {
        this.particle.active = t;
      }, e.prototype.show_btn_buqian = function (t) {
        this.btn_buqian.active = t;
      }, e.prototype.onBtnBuQianClick = function () {
        d.default.showVideoAd(function () {
          var t = this;u.default.sign(this.day, 1, !1, function (e) {
            s.default.log("\u8865\u7B7E\u6210\u529F"), s.default.log(e, "\u7B7E\u5230\u6216\u8005\u8865\u7B7E\u8FD4\u56DE\u7684\u6570\u636E"), f.default.ins.init(e), cc.game.emit("SignPanelRefresh");var n = t.sign_list[t.day - 1].spId,
                o = h.default.ins.getItem(n),
                i = o.icon,
                r = o.name,
                c = t.sign_list[t.day - 1].count,
                l = { icon: i, count: c, name: r, type: p.ReceiveGiftTipType.ForSign };_.default.show(p.default, l), 1 == n && (m.default.ins.money += c), 2 == n && (m.default.ins.giftCoupon += c), a.default.trackEvent("1330");
          }, this);
        }, this, y.VideoAdType.Buqian);
      }, r([C], e);
    }(cc.Component));n.default = v, cc._RF.pop();
  }, { "../../../Common/Core/GameType": "GameType", "../../../Common/Manager/LoadResManager": "LoadResManager", "../../../Common/Manager/Logger": "Logger", "../../../Common/Sdks/GameSDK": "GameSDK", "../../../Common/Sdks/UmaTrackHelper": "UmaTrackHelper", "../../../Common/UI/UIManager": "UIManager", "../../../Common/Util/ComponentUtil": "ComponentUtil", "../../Config/ProductConfig": "ProductConfig", "../../Config/SignConfig": "SignConfig", "../../Info/PlayerInfo": "PlayerInfo", "../../Info/SignInfo": "SignInfo", "../../Manager/CommandController": "CommandController", "../ReceiveGiftTips": "ReceiveGiftTips" }] }, {}, ["AbsConfig", "ConfigManager", "ByteArray", "GameType", "NumValue", "NumValueBase64", "TextConfigNode", "TextConfigRead", "defclass", "AbsInfo", "gamesdks", "DataManager", "GameInitManager", "GlobalEventManager", "HostManager", "LoadResManager", "Logger", "MusicManager", "QueuePanelManager", "SysConfig", "TimeManager", "AbstractSDK", "GameSDK", "SdkDefault", "SdkQQ", "UmaTrackHelper", "UIItem", "UIManager", "UIPanel", "Base64", "BufferBigEndian", "BufferUtil", "ByteUtil", "CallBackUtils", "ComponentUtil", "FightUtil", "MD5", "MTween", "MathUtil", "NetUtil", "SHA1", "SHA256", "StringUtil", "Vec3Util", "AchieveConfig", "BaseConfig", "BuffConfig", "GameConfig", "MusicConfig", "ProductConfig", "RlzConfig", "RoleConfig", "ShopConfig", "SignConfig", "AchieveData", "BaseData", "BuffData", "MusicData", "ProductData", "RlzData", "RoleData", "ShopData", "SignData", "AbsDashController", "BuffController", "HeroActor", "HitEffect", "HitSkyEffect", "ItemActor", "MusicController", "ObjectActor", "SingleController", "SportController", "StageActor", "FbEndPanel", "FbPanel", "FbPkInvitePanel", "FbPkMatchPanel", "FbRewardPanel", "GameHeadInfo", "PKHeadInfo", "AddrInfo", "BuffInfo", "FbInfo", "ItemsInfo", "PlayerInfo", "SetInfo", "SignInfo", "ExchangeAddrPanel", "ExchangeConfirm", "ItemMessage", "ItemMessage1", "ItemMessageTips", "LotteryAddrPanel", "LotteryConfirm", "LotteryItemMessage", "LotteryPanel", "MyExchangePanel", "UIExchange", "UIExchangeLog", "UILottery", "AchievementPanel", "ActivePanel", "CoinExchangePanel", "DebugPanel", "ExchangeGiftTips", "FbDogfallPanel", "FbLostPanel", "FbWinPanel", "FeedbackPanel", "LoadingPanel", "MainPanel", "NoticePanel", "RankPanel", "RePlayAnswerConfirm", "ReceiveGiftTips", "ShopPanel", "SignPanel", "SubContextViewController", "UpgradePropConfirm", "WatchVideoAdConfirm", "AbsFbOverPanel", "FbHead", "FbOverHeadInfo", "ProInfoCtr", "achievement_item", "sign_item", "CommandController", "GameManager", "TcpBuffer", "GameClient", "PacketDataEvent", "AbstractWorker", "ArrayWorker", "BinaryWorker", "BooleanWorker", "ExtensionWorker", "MapWorker", "MsgPack", "MsgPackError", "MsgPackFlags", "NullWorker", "NumberWorker", "StringWorker", "WorkerFactory", "WorkerPriority", "incomplete", "GameScene", "MainScene", "GeneralTips"]);
});
define("ccRequire.js", function(require, module, exports){
var moduleMap = {
    'src/assets/Script/Common/Libs/zlib/zlib.min.js': function srcAssetsScriptCommonLibsZlibZlibMinJs() {
        return require('src/assets/Script/Common/Libs/zlib/zlib.min.js');
    },
    'assets/internal/index.js': function assetsInternalIndexJs() {
        return require('assets/internal/index.js');
    },
    'src/scripts/remote/index.js': function srcScriptsRemoteIndexJs() {
        return require('src/scripts/remote/index.js');
    },
    'src/scripts/resources/index.js': function srcScriptsResourcesIndexJs() {
        return require('src/scripts/resources/index.js');
    },
    'assets/main/index.js': function assetsMainIndexJs() {
        return require('assets/main/index.js');
    }
};

window.__cocos_require__ = function (moduleName) {
    var func = moduleMap[moduleName];
    if (!func) {
        throw new Error('cannot find module ' + moduleName);
    }
    return func();
};
});
define("cocos/cocos2d-js-min.js", function(require, module, exports){
});
define("main.js", function(require, module, exports){


window.boot = function () {
  var settings = window._CCSettings;
  window._CCSettings = undefined;

  var onStart = function onStart() {
    cc.view.enableRetina(true);
    cc.view.resizeWithBrowserSize(true);
    var launchScene = settings.launchScene; // load scene

    cc.director.loadScene(launchScene, null, function () {
      console.log('Success to load scene: ' + launchScene);
    });
  };

  var isSubContext = cc.sys.platform === cc.sys.WECHAT_GAME_SUB;
  var option = {
    id: 'GameCanvas',
    debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
    showFPS: !isSubContext && settings.debug,
    frameRate: 60,
    groupList: settings.groupList,
    collisionMatrix: settings.collisionMatrix
  };
  cc.assetManager.init({
    bundleVers: settings.bundleVers,
    subpackages: settings.subpackages,
    remoteBundles: settings.remoteBundles,
    server: settings.server,
    subContextRoot: settings.subContextRoot
  });
  var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
  var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
  var MAIN = cc.AssetManager.BuiltinBundleName.MAIN;
  var START_SCENE = cc.AssetManager.BuiltinBundleName.START_SCENE;
  var bundleRoot = [INTERNAL];
  settings.hasResourcesBundle && bundleRoot.push(RESOURCES);
  settings.hasStartSceneBundle && bundleRoot.push(MAIN);
  var count = 0;

  function cb(err) {
    if (err) return console.error(err.message, err.stack);
    count++;

    if (count === bundleRoot.length + 1) {
      // if there is start-scene bundle. should load start-scene bundle in the last stage
      // Otherwise the main bundle should be the last
      cc.assetManager.loadBundle(settings.hasStartSceneBundle ? START_SCENE : MAIN, function (err) {
        if (!err) cc.game.run(option, onStart);
      });
    }
  } // load plugins


  cc.assetManager.loadScript(settings.jsList.map(function (x) {
    return 'src/' + x;
  }), cb); // load bundles

  for (var i = 0; i < bundleRoot.length; i++) {
    cc.assetManager.loadBundle(bundleRoot[i], cb);
  }
};
});
define("physics-min.js", function(require, module, exports){
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function t(e, i, o) {
  function n(s, a) {
    if (!i[s]) {
      if (!e[s]) {
        var l = "function" == typeof require && require;if (!a && l) return l(s, !0);if (r) return r(s, !0);var h = new Error("Cannot find module '" + s + "'");throw h.code = "MODULE_NOT_FOUND", h;
      }var c = i[s] = { exports: {} };e[s][0].call(c.exports, function (t) {
        return n(e[s][1][t] || t);
      }, c, c.exports, t, e, i, o);
    }return i[s].exports;
  }for (var r = "function" == typeof require && require, s = 0; s < o.length; s++) {
    n(o[s]);
  }return n;
})({ 1: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.CannonRigidBody = void 0;var o,
        n = (o = t("../../../../../external/cannon/cannon")) && o.__esModule ? o : { default: o };function r(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }var s = new n.default.Vec3(),
        a = new n.default.Vec3(),
        l = cc.Vec3,
        h = function () {
      function t() {
        this._isEnabled = !1;
      }var e,
          i,
          o = t.prototype;return o.__preload = function (t) {
        this._rigidBody = t, this._sharedBody = cc.director.getPhysics3DManager().physicsWorld.getSharedBody(this._rigidBody.node), this._sharedBody.reference = !0, this._sharedBody.wrappedBody = this;
      }, o.onLoad = function () {}, o.onEnable = function () {
        this._isEnabled = !0, this.mass = this._rigidBody.mass, this.allowSleep = this._rigidBody.allowSleep, this.linearDamping = this._rigidBody.linearDamping, this.angularDamping = this._rigidBody.angularDamping, this.useGravity = this._rigidBody.useGravity, this.isKinematic = this._rigidBody.isKinematic, this.fixedRotation = this._rigidBody.fixedRotation, this.linearFactor = this._rigidBody.linearFactor, this.angularFactor = this._rigidBody.angularFactor, this._sharedBody.enabled = !0;
      }, o.onDisable = function () {
        this._isEnabled = !1, this._sharedBody.enabled = !1;
      }, o.onDestroy = function () {
        this._sharedBody.reference = !1, this._rigidBody = null, this._sharedBody = null;
      }, o.wakeUp = function () {
        return this._sharedBody.body.wakeUp();
      }, o.sleep = function () {
        return this._sharedBody.body.sleep();
      }, o.getLinearVelocity = function (t) {
        return l.copy(t, this._sharedBody.body.velocity), t;
      }, o.setLinearVelocity = function (t) {
        var e = this._sharedBody.body;e.isSleeping() && e.wakeUp(), l.copy(e.velocity, t);
      }, o.getAngularVelocity = function (t) {
        return l.copy(t, this._sharedBody.body.angularVelocity), t;
      }, o.setAngularVelocity = function (t) {
        var e = this._sharedBody.body;e.isSleeping() && e.wakeUp(), l.copy(e.angularVelocity, t);
      }, o.applyForce = function (t, e) {
        null == e && (e = l.ZERO);var i = this._sharedBody.body;i.isSleeping() && i.wakeUp(), i.applyForce(l.copy(s, t), l.copy(a, e));
      }, o.applyImpulse = function (t, e) {
        null == e && (e = l.ZERO);var i = this._sharedBody.body;i.isSleeping() && i.wakeUp(), i.applyImpulse(l.copy(s, t), l.copy(a, e));
      }, o.applyLocalForce = function (t, e) {
        null == e && (e = l.ZERO);var i = this._sharedBody.body;i.isSleeping() && i.wakeUp(), i.applyLocalForce(l.copy(s, t), l.copy(a, e));
      }, o.applyLocalImpulse = function (t, e) {
        null == e && (e = l.ZERO);var i = this._sharedBody.body;i.isSleeping() && i.wakeUp(), i.applyLocalImpulse(l.copy(s, t), l.copy(a, e));
      }, o.applyTorque = function (t) {
        var e = this._sharedBody.body;e.isSleeping() && e.wakeUp(), e.torque.x += t.x, e.torque.y += t.y, e.torque.z += t.z;
      }, o.applyLocalTorque = function (t) {
        var e = this._sharedBody.body;e.isSleeping() && e.wakeUp(), l.copy(s, t), e.vectorToWorldFrame(s, s), e.torque.x += s.x, e.torque.y += s.y, e.torque.z += s.z;
      }, e = t, (i = [{ key: "isAwake", get: function get() {
          return this._sharedBody.body.isAwake();
        } }, { key: "isSleepy", get: function get() {
          return this._sharedBody.body.isSleepy();
        } }, { key: "isSleeping", get: function get() {
          return this._sharedBody.body.isSleeping();
        } }, { key: "allowSleep", set: function set(t) {
          var e = this._sharedBody.body;e.isSleeping() && e.wakeUp(), e.allowSleep = t;
        } }, { key: "mass", set: function set(t) {
          var e = this._sharedBody.body;e.mass = t, 0 == e.mass ? e.type = n.default.Body.STATIC : e.type = this._rigidBody.isKinematic ? n.default.Body.KINEMATIC : n.default.Body.DYNAMIC, e.updateMassProperties(), e.isSleeping() && e.wakeUp();
        } }, { key: "isKinematic", set: function set(t) {
          var e = this._sharedBody.body;0 == e.mass ? e.type = n.default.Body.STATIC : e.type = t ? n.default.Body.KINEMATIC : n.default.Body.DYNAMIC;
        } }, { key: "fixedRotation", set: function set(t) {
          var e = this._sharedBody.body;e.isSleeping() && e.wakeUp(), e.fixedRotation = t, e.updateMassProperties();
        } }, { key: "linearDamping", set: function set(t) {
          this._sharedBody.body.linearDamping = t;
        } }, { key: "angularDamping", set: function set(t) {
          this._sharedBody.body.angularDamping = t;
        } }, { key: "useGravity", set: function set(t) {
          var e = this._sharedBody.body;e.isSleeping() && e.wakeUp(), e.useGravity = t;
        } }, { key: "linearFactor", set: function set(t) {
          var e = this._sharedBody.body;e.isSleeping() && e.wakeUp(), l.copy(e.linearFactor, t);
        } }, { key: "angularFactor", set: function set(t) {
          var e = this._sharedBody.body;e.isSleeping() && e.wakeUp(), l.copy(e.angularFactor, t);
        } }, { key: "rigidBody", get: function get() {
          return this._rigidBody;
        } }, { key: "sharedBody", get: function get() {
          return this._sharedBody;
        } }, { key: "isEnabled", get: function get() {
          return this._isEnabled;
        } }]) && r(e.prototype, i), t;
    }();i.CannonRigidBody = h;
  }, { "../../../../../external/cannon/cannon": 24 }], 2: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.CannonSharedBody = void 0;var o,
        n = (o = t("../../../../../external/cannon/cannon")) && o.__esModule ? o : { default: o },
        r = t("../framework/physics-enum"),
        s = t("../framework/util"),
        a = t("./cannon-util");function l(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }var h = cc.Node._LocalDirtyFlag.PHYSICS_SCALE,
        c = cc.Quat,
        p = cc.Vec3,
        u = cc.js.array.fastRemoveAt,
        d = new p(),
        y = new c(),
        f = [],
        v = { type: "collision-enter", selfCollider: null, otherCollider: null, contacts: [] },
        m = function () {
      var t, e;function i(t, e) {
        this.node = void 0, this.wrappedWorld = void 0, this.body = new n.default.Body(), this.shapes = [], this.wrappedBody = null, this.index = -1, this.ref = 0, this.onCollidedListener = this.onCollided.bind(this), this.wrappedWorld = e, this.node = t, this.body.material = this.wrappedWorld.world.defaultMaterial, this.body.addEventListener("cc-collide", this.onCollidedListener), this._updateGroup(), this.node.on(cc.Node.EventType.GROUP_CHANGED, this._updateGroup, this);
      }i.getSharedBody = function (t, e) {
        var o = t._id;if (i.sharedBodiesMap.has(o)) return i.sharedBodiesMap.get(o);var n = new i(t, e);return i.sharedBodiesMap.set(t._id, n), n;
      }, t = i, (e = [{ key: "enabled", set: function set(t) {
          if (t) {
            if (this.index < 0) {
              this.index = this.wrappedWorld.bodies.length, this.wrappedWorld.addSharedBody(this);var e = this.node;this.body.aabbNeedsUpdate = !0, e.getWorldPosition(d), e.getWorldRotation(y);var i = this.body.position;i.x = parseFloat(d.x.toFixed(3)), i.y = parseFloat(d.y.toFixed(3)), i.z = parseFloat(d.z.toFixed(3));var o = this.body.quaternion;if (o.x = parseFloat(y.x.toFixed(12)), o.y = parseFloat(y.y.toFixed(12)), o.z = parseFloat(y.z.toFixed(12)), o.w = parseFloat(y.w.toFixed(12)), e._localMatDirty & h) {
                for (var n = e.__wscale, r = 0; r < this.shapes.length; r++) {
                  this.shapes[r].setScale(n);
                }(0, a.commitShapeUpdates)(this.body);
              }this.body.isSleeping() && this.body.wakeUp();
            }
          } else this.index >= 0 && (0 == this.shapes.length && null == this.wrappedBody || 0 == this.shapes.length && null != this.wrappedBody && !this.wrappedBody.rigidBody.enabledInHierarchy || 0 == this.shapes.length && null != this.wrappedBody && !this.wrappedBody.isEnabled) && (this.body.sleep(), this.index = -1, this.wrappedWorld.removeSharedBody(this));
        } }, { key: "reference", set: function set(t) {
          t ? this.ref++ : this.ref--, 0 == this.ref && this.destroy();
        } }]) && l(t.prototype, e);var o = i.prototype;return o._updateGroup = function () {
        (0, a.groupIndexToBitMask)(this.node.groupIndex, this.body);
      }, o.addShape = function (t) {
        if (this.shapes.indexOf(t) < 0) {
          var e = this.body.shapes.length;this.body.addShape(t.shape), this.shapes.push(t), t.setIndex(e);var i = this.body.shapeOffsets[e],
              o = this.body.shapeOrientations[e];t.setOffsetAndOrient(i, o);
        }
      }, o.removeShape = function (t) {
        var e = this.shapes.indexOf(t);e >= 0 && (u(this.shapes, e), this.body.removeShape(t.shape), t.setIndex(-1));
      }, o.syncSceneToPhysics = function (t) {
        void 0 === t && (t = !1);var e = this.node,
            i = (0, s.updateWorldTransform)(e, t);if (t || i) {
          if (this.body.aabbNeedsUpdate = !0, p.copy(this.body.position, e.__wpos), c.copy(this.body.quaternion, e.__wrot), e._localMatDirty & h) {
            for (var o = e.__wscale, n = 0; n < this.shapes.length; n++) {
              this.shapes[n].setScale(o);
            }(0, a.commitShapeUpdates)(this.body);
          }this.body.isSleeping() && this.body.wakeUp();
        }
      }, o.syncPhysicsToScene = function () {
        this.body.type == r.ERigidBodyType.STATIC || this.body.isSleeping() || (p.copy(d, this.body.position), c.copy(y, this.body.quaternion), (0, s.updateWorldRT)(this.node, d, y));
      }, o.destroy = function () {
        this.body.removeEventListener("cc-collide", this.onCollidedListener), this.node.off(cc.Node.EventType.GROUP_CHANGED, this._updateGroup, this), i.sharedBodiesMap.delete(this.node._id), delete n.default.World.idToBodyMap[this.body.id], this.node = null, this.wrappedWorld = null, this.body = null, this.shapes = null, this.onCollidedListener = null;
      }, o.onCollided = function (t) {
        v.type = t.event;var e = (0, s.getWrap)(t.selfShape),
            i = (0, s.getWrap)(t.otherShape);if (e) {
          v.selfCollider = e.collider, v.otherCollider = i ? i.collider : null;var o = 0;for (o = v.contacts.length; o--;) {
            f.push(v.contacts.pop());
          }for (o = 0; o < t.contacts.length; o++) {
            var n = t.contacts[o];if (f.length > 0) {
              var r = f.pop();p.copy(r.contactA, n.ri), p.copy(r.contactB, n.rj), p.copy(r.normal, n.ni), v.contacts.push(r);
            } else {
              var l = { contactA: p.copy(new p(), n.ri), contactB: p.copy(new p(), n.rj), normal: p.copy(new p(), n.ni) };v.contacts.push(l);
            }
          }for (o = 0; o < this.shapes.length; o++) {
            var h = this.shapes[o];v.type = a.deprecatedEventMap[v.type], h.collider.emit(v.type, v), v.type = t.event, h.collider.emit(v.type, v);
          }
        }
      }, i;
    }();i.CannonSharedBody = m, m.sharedBodiesMap = new Map();
  }, { "../../../../../external/cannon/cannon": 24, "../framework/physics-enum": 19, "../framework/util": 23, "./cannon-util": 3 }], 3: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.groupIndexToBitMask = r, i.toCannonRaycastOptions = function (t, e) {
      t.checkCollisionResponse = !e.queryTrigger, r(e.groupIndex, t), t.skipBackFaces = !1;
    }, i.fillRaycastResult = function (t, e) {
      t._assign(n.copy(new n(), e.hitPointWorld), e.distance, (0, o.getWrap)(e.shape).collider);
    }, i.commitShapeUpdates = function (t) {
      t.aabbNeedsUpdate = !0, t.updateMassProperties(), t.updateBoundingRadius();
    }, i.deprecatedEventMap = void 0;var o = t("../framework/util"),
        n = cc.Vec3;function r(t, e) {
      var i = 1 << t,
          o = 0,
          n = cc.game.collisionMatrix[t];if (n) {
        for (var r = 0; r < n.length; r++) {
          n[r] && (o |= 1 << r);
        }e.collisionFilterGroup = i, e.collisionFilterMask = o;
      } else cc.error("cannon-utils: group is not exist", t);
    }i.deprecatedEventMap = { onCollisionEnter: "collision-enter", onCollisionStay: "collision-stay", onCollisionExit: "collision-exit", onTriggerEnter: "trigger-enter", onTriggerStay: "trigger-stay", onTriggerExit: "trigger-exit" };
  }, { "../framework/util": 23 }], 4: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.CannonWorld = void 0;var o,
        n = (o = t("../../../../../external/cannon/cannon")) && o.__esModule ? o : { default: o },
        r = t("./cannon-util"),
        s = t("./shapes/cannon-shape"),
        a = t("./cannon-shared-body"),
        l = t("../framework/util");function h(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }var c = cc.Vec3,
        p = cc.js.array.fastRemoveAt,
        u = function () {
      var t, e;function i() {
        this.bodies = [], this._world = void 0, this._raycastResult = new n.default.RaycastResult(), this._world = new n.default.World(), this._world.broadphase = new n.default.NaiveBroadphase(), this._world.addEventListener("postStep", this.onPostStep.bind(this));
      }t = i, (e = [{ key: "world", get: function get() {
          return this._world;
        } }, { key: "defaultMaterial", set: function set(t) {
          this._world.defaultMaterial.friction = t.friction, this._world.defaultMaterial.restitution = t.restitution, null != s.CannonShape.idToMaterial[t._uuid] && (s.CannonShape.idToMaterial[t._uuid] = this._world.defaultMaterial);
        } }, { key: "allowSleep", set: function set(t) {
          this._world.allowSleep = t;
        } }, { key: "gravity", set: function set(t) {
          c.copy(this._world.gravity, t);
        } }]) && h(t.prototype, e);var o = i.prototype;return o.onPostStep = function () {
        var t = cc.director.getPhysics3DManager();if (t.useFixedDigit) for (var e = t.fixDigits.position, i = t.fixDigits.rotation, o = this._world.bodies, r = 0; r < o.length; r++) {
          var s = o[r];if (s.type != n.default.Body.STATIC && !s.isSleeping()) {
            var a = s.position;a.x = parseFloat(a.x.toFixed(e)), a.y = parseFloat(a.y.toFixed(e)), a.z = parseFloat(a.z.toFixed(e));var l = s.quaternion;l.x = parseFloat(l.x.toFixed(i)), l.y = parseFloat(l.y.toFixed(i)), l.z = parseFloat(l.z.toFixed(i)), l.w = parseFloat(l.w.toFixed(i));var h = s.velocity;h.x = parseFloat(h.x.toFixed(e)), h.y = parseFloat(h.y.toFixed(e)), h.z = parseFloat(h.z.toFixed(e));var c = s.angularVelocity;c.x = parseFloat(c.x.toFixed(e)), c.y = parseFloat(c.y.toFixed(e)), c.z = parseFloat(c.z.toFixed(e));
          }
        }
      }, o.step = function (t, e, i) {
        this.syncSceneToPhysics(), this._world.step(t, e, i), this.syncPhysicsToScene(), this.emitEvents();
      }, o.syncSceneToPhysics = function () {
        (0, l.clearNodeTransformRecord)();for (var t = 0; t < this.bodies.length; t++) {
          this.bodies[t].syncSceneToPhysics();
        }(0, l.clearNodeTransformDirtyFlag)();
      }, o.syncPhysicsToScene = function () {
        for (var t = 0; t < this.bodies.length; t++) {
          this.bodies[t].syncPhysicsToScene();
        }
      }, o.emitEvents = function () {
        this._world.emitTriggeredEvents(), this._world.emitCollisionEvents();
      }, o.raycastClosest = function (t, e, i) {
        f(t, e.maxDistance), (0, r.toCannonRaycastOptions)(v, e);var o = this._world.raycastClosest(d, y, v, this._raycastResult);return o && (0, r.fillRaycastResult)(i, this._raycastResult), o;
      }, o.raycast = function (t, e, i, o) {
        return f(t, e.maxDistance), (0, r.toCannonRaycastOptions)(v, e), this._world.raycastAll(d, y, v, function (t) {
          var e = i.add();(0, r.fillRaycastResult)(e, t), o.push(e);
        });
      }, o.getSharedBody = function (t) {
        return a.CannonSharedBody.getSharedBody(t, this);
      }, o.addSharedBody = function (t) {
        this.bodies.indexOf(t) < 0 && (this.bodies.push(t), this._world.addBody(t.body));
      }, o.removeSharedBody = function (t) {
        var e = this.bodies.indexOf(t);e >= 0 && (p(this.bodies, e), this._world.remove(t.body));
      }, i;
    }();i.CannonWorld = u;var d = new n.default.Vec3(),
        y = new n.default.Vec3();function f(t, e) {
      c.copy(d, t.o), t.computeHit(y, e);
    }var v = { checkCollisionResponse: !1, collisionFilterGroup: -1, collisionFilterMask: -1, skipBackFaces: !1 };
  }, { "../../../../../external/cannon/cannon": 24, "../framework/util": 23, "./cannon-shared-body": 2, "./cannon-util": 3, "./shapes/cannon-shape": 7 }], 5: [function (t) {
    "use strict";
    var e = t("../framework/physics-selector"),
        i = t("./cannon-rigid-body"),
        o = t("./cannon-world"),
        n = t("./shapes/cannon-box-shape"),
        r = t("./shapes/cannon-sphere-shape");(0, e.instantiate)(n.CannonBoxShape, r.CannonSphereShape, i.CannonRigidBody, o.CannonWorld);
  }, { "../framework/physics-selector": 22, "./cannon-rigid-body": 1, "./cannon-world": 4, "./shapes/cannon-box-shape": 6, "./shapes/cannon-sphere-shape": 8 }], 6: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.CannonBoxShape = void 0;var o,
        n = (o = t("../../../../../../external/cannon/cannon")) && o.__esModule ? o : { default: o },
        r = t("../cannon-util"),
        s = t("./cannon-shape");function a(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }function l(t, e, i) {
      return e && a(t.prototype, e), i && a(t, i), t;
    }var h = cc.Vec3,
        c = new h(),
        p = function (t) {
      var e, i;function o(e) {
        var i;return (i = t.call(this) || this).halfExtent = new n.default.Vec3(), h.multiplyScalar(i.halfExtent, e, .5), i._shape = new n.default.Box(i.halfExtent.clone()), i;
      }i = t, (e = o).prototype = Object.create(i.prototype), e.prototype.constructor = e, e.__proto__ = i, l(o, [{ key: "boxCollider", get: function get() {
          return this.collider;
        } }, { key: "box", get: function get() {
          return this._shape;
        } }]);var s = o.prototype;return s.onLoad = function () {
        t.prototype.onLoad.call(this), this.size = this.boxCollider.size;
      }, s.setScale = function (e) {
        t.prototype.setScale.call(this, e), this.size = this.boxCollider.size;
      }, l(o, [{ key: "size", set: function set(t) {
          this.collider.node.getWorldScale(c), h.multiplyScalar(this.halfExtent, t, .5), h.multiply(this.box.halfExtents, this.halfExtent, c), this.box.updateConvexPolyhedronRepresentation(), -1 != this._index && (0, r.commitShapeUpdates)(this._body);
        } }]), o;
    }(s.CannonShape);i.CannonBoxShape = p;
  }, { "../../../../../../external/cannon/cannon": 24, "../cannon-util": 3, "./cannon-shape": 7 }], 7: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.CannonShape = void 0;var o,
        n = (o = t("../../../../../../external/cannon/cannon")) && o.__esModule ? o : { default: o },
        r = t("../../framework/util"),
        s = t("../cannon-util");function a(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }var l = { type: "trigger-enter", selfCollider: null, otherCollider: null },
        h = cc.Vec3,
        c = new h(),
        p = function () {
      function t() {
        this._offset = new n.default.Vec3(), this._orient = new n.default.Quaternion(), this._index = -1, this.onTriggerListener = this.onTrigger.bind(this);
      }var e,
          i,
          o = t.prototype;return o.__preload = function (t) {
        this._collider = t, (0, r.setWrap)(this._shape, this), this._shape.addEventListener("cc-trigger", this.onTriggerListener), this._sharedBody = cc.director.getPhysics3DManager().physicsWorld.getSharedBody(this._collider.node), this._sharedBody.reference = !0;
      }, o.onLoad = function () {
        this.center = this._collider.center, this.isTrigger = this._collider.isTrigger;
      }, o.onEnable = function () {
        this._sharedBody.addShape(this), this._sharedBody.enabled = !0;
      }, o.onDisable = function () {
        this._sharedBody.removeShape(this), this._sharedBody.enabled = !1;
      }, o.onDestroy = function () {
        this._sharedBody.reference = !1, this._shape.removeEventListener("cc-trigger", this.onTriggerListener), delete n.default.World.idToShapeMap[this._shape.id], this._sharedBody = null, (0, r.setWrap)(this._shape, null), this._offset = null, this._orient = null, this._shape = null, this._collider = null, this.onTriggerListener = null;
      }, o.setScale = function () {
        this._setCenter(this._collider.center);
      }, o.setIndex = function (t) {
        this._index = t;
      }, o.setOffsetAndOrient = function (t, e) {
        cc.Vec3.copy(t, this._offset), cc.Vec3.copy(e, this._orient), this._offset = t, this._orient = e;
      }, o._setCenter = function (t) {
        var e = this._offset;h.copy(e, t), this._collider.node.getWorldScale(c), h.multiply(e, e, c);
      }, o.onTrigger = function (t) {
        l.type = t.event;var e = (0, r.getWrap)(t.selfShape),
            i = (0, r.getWrap)(t.otherShape);e && (l.selfCollider = e.collider, l.otherCollider = i ? i.collider : null, l.type = s.deprecatedEventMap[l.type], this._collider.emit(l.type, l), l.type = t.event, this._collider.emit(l.type, l));
      }, e = t, (i = [{ key: "shape", get: function get() {
          return this._shape;
        } }, { key: "collider", get: function get() {
          return this._collider;
        } }, { key: "attachedRigidBody", get: function get() {
          return this._sharedBody.wrappedBody ? this._sharedBody.wrappedBody.rigidBody : null;
        } }, { key: "sharedBody", get: function get() {
          return this._sharedBody;
        } }, { key: "material", set: function set(e) {
          null == e ? this._shape.material = null : (null == t.idToMaterial[e._uuid] && (t.idToMaterial[e._uuid] = new n.default.Material(e._uuid)), this._shape.material = t.idToMaterial[e._uuid], this._shape.material.friction = e.friction, this._shape.material.restitution = e.restitution);
        } }, { key: "isTrigger", set: function set(t) {
          this._shape.collisionResponse = !t, this._index >= 0 && this._body.updateHasTrigger();
        } }, { key: "center", set: function set(t) {
          this._setCenter(t), this._index >= 0 && (0, s.commitShapeUpdates)(this._body);
        } }, { key: "_body", get: function get() {
          return this._sharedBody.body;
        } }]) && a(e.prototype, i), t;
    }();i.CannonShape = p, p.idToMaterial = {};
  }, { "../../../../../../external/cannon/cannon": 24, "../../framework/util": 23, "../cannon-util": 3 }], 8: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.CannonSphereShape = void 0;var o,
        n = (o = t("../../../../../../external/cannon/cannon")) && o.__esModule ? o : { default: o },
        r = t("../cannon-util"),
        s = t("./cannon-shape");function a(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }var l = new cc.Vec3(),
        h = function (t) {
      var e, i, o, s;function h(e) {
        var i;return (i = t.call(this) || this)._radius = void 0, i._radius = e, i._shape = new n.default.Sphere(i._radius), i;
      }i = t, (e = h).prototype = Object.create(i.prototype), e.prototype.constructor = e, e.__proto__ = i, o = h, (s = [{ key: "sphereCollider", get: function get() {
          return this.collider;
        } }, { key: "sphere", get: function get() {
          return this._shape;
        } }, { key: "radius", get: function get() {
          return this._radius;
        }, set: function set(t) {
          this.collider.node.getWorldScale(l);var e = l.maxAxis();this.sphere.radius = t * Math.abs(e), this.sphere.updateBoundingSphereRadius(), -1 != this._index && (0, r.commitShapeUpdates)(this._body);
        } }]) && a(o.prototype, s);var c = h.prototype;return c.onLoad = function () {
        t.prototype.onLoad.call(this), this.radius = this.sphereCollider.radius;
      }, c.setScale = function (e) {
        t.prototype.setScale.call(this, e), this.radius = this.sphereCollider.radius;
      }, h;
    }(s.CannonShape);i.CannonSphereShape = h;
  }, { "../../../../../../external/cannon/cannon": 24, "../cannon-util": 3, "./cannon-shape": 7 }], 9: [function (t) {
    "use strict";
    t("../cannon/instantiate");var e,
        i = (e = t("../../../../../external/cannon/cannon")) && e.__esModule ? e : { default: e };window && (window.CANNON = i.default);
  }, { "../../../../../external/cannon/cannon": 24, "../cannon/instantiate": 5 }], 10: [function (t, e, i) {
    "use strict";
    i.__esModule = !0;var o = t("../framework");Object.keys(o).forEach(function (t) {
      "default" !== t && "__esModule" !== t && (i[t] = o[t]);
    });
  }, { "../framework": 17 }], 11: [function (t, e, i) {
    "use strict";
    var o, n, r, s, a, l;function h(t, e, i, o) {
      i && Object.defineProperty(t, e, { enumerable: i.enumerable, configurable: i.configurable, writable: i.writable, value: i.initializer ? i.initializer.call(o) : void 0 });
    }function c(t) {
      if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t;
    }function p(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }function u(t, e, i, o, n) {
      var r = {};return Object.keys(o).forEach(function (t) {
        r[t] = o[t];
      }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
        return o(t, e, i) || i;
      }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(t, e, r), r = null), r;
    }i.__esModule = !0, i.PhysicsMaterial = void 0;var d = cc._decorator,
        y = d.ccclass,
        f = d.property,
        v = cc.js.array.fastRemove,
        m = cc.math.equals,
        g = y("cc.PhysicsMaterial")((l = a = function (t) {
      var e, i, o, n;function a() {
        var e;return h(e = t.call(this) || this, "_friction", r, c(e)), h(e, "_restitution", s, c(e)), cc.EventTarget.call(c(e)), a.allMaterials.push(c(e)), "" == e._uuid && (e._uuid = "pm_" + a._idCounter++), e;
      }i = t, (e = a).prototype = Object.create(i.prototype), e.prototype.constructor = e, e.__proto__ = i, o = a, (n = [{ key: "friction", get: function get() {
          return this._friction;
        }, set: function set(t) {
          m(this._friction, t) || (this._friction = t, this.emit("physics_material_update"));
        } }, { key: "restitution", get: function get() {
          return this._restitution;
        }, set: function set(t) {
          m(this._restitution, t) || (this._restitution = t, this.emit("physics_material_update"));
        } }]) && p(o.prototype, n);var l = a.prototype;return l.clone = function () {
        var t = new a();return t._friction = this._friction, t._restitution = this._restitution, t;
      }, l.destroy = function () {
        return !!t.prototype.destroy.call(this) && (v(a.allMaterials, this), !0);
      }, a;
    }(cc.Asset), a.allMaterials = [], a._idCounter = 0, r = u((n = l).prototype, "_friction", [f], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return .1;
      } }), s = u(n.prototype, "_restitution", [f], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return .1;
      } }), u(n.prototype, "friction", [f], Object.getOwnPropertyDescriptor(n.prototype, "friction"), n.prototype), u(n.prototype, "restitution", [f], Object.getOwnPropertyDescriptor(n.prototype, "restitution"), n.prototype), o = n)) || o;i.PhysicsMaterial = g, cc.js.mixin(g.prototype, cc.EventTarget.prototype), cc.PhysicsMaterial = g;
  }, {}], 12: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.BoxCollider3D = void 0;var o,
        n,
        r,
        s,
        a,
        l,
        h,
        c = t("../../instance"),
        p = t("./collider-component");function u(t, e, i, o) {
      i && Object.defineProperty(t, e, { enumerable: i.enumerable, configurable: i.configurable, writable: i.writable, value: i.initializer ? i.initializer.call(o) : void 0 });
    }function d(t) {
      if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t;
    }function y(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }function f(t, e, i, o, n) {
      var r = {};return Object.keys(o).forEach(function (t) {
        r[t] = o[t];
      }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
        return o(t, e, i) || i;
      }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(t, e, r), r = null), r;
    }var v = cc._decorator,
        m = v.ccclass,
        g = v.executeInEditMode,
        w = v.executionOrder,
        b = v.menu,
        x = v.property,
        _ = cc.Vec3,
        B = (o = m("cc.BoxCollider3D"), n = w(98), r = b("i18n:MAIN_MENU.component.physics/Collider/Box 3D"), s = x({ type: cc.Vec3 }), o(a = n(a = r(a = g((f((l = function (t) {
      var e, i, o, n;function r() {
        var e;return u(e = t.call(this) || this, "_size", h, d(e)), e._shape = (0, c.createBoxShape)(e._size), e;
      }return i = t, (e = r).prototype = Object.create(i.prototype), e.prototype.constructor = e, e.__proto__ = i, o = r, (n = [{ key: "size", get: function get() {
          return this._size;
        }, set: function set(t) {
          _.copy(this._size, t), this.boxShape.size = this._size;
        } }, { key: "boxShape", get: function get() {
          return this._shape;
        } }]) && y(o.prototype, n), r;
    }(p.Collider3D)).prototype, "size", [s], Object.getOwnPropertyDescriptor(l.prototype, "size"), l.prototype), h = f(l.prototype, "_size", [x], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return new _(1, 1, 1);
      } }), a = l)) || a) || a) || a) || a);i.BoxCollider3D = B;
  }, { "../../instance": 18, "./collider-component": 13 }], 13: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.Collider3D = void 0;var o,
        n,
        r,
        s,
        a,
        l,
        h,
        c,
        p,
        u,
        d = t("../../assets/physics-material");function y(t, e, i, o) {
      i && Object.defineProperty(t, e, { enumerable: i.enumerable, configurable: i.configurable, writable: i.writable, value: i.initializer ? i.initializer.call(o) : void 0 });
    }function f(t) {
      if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t;
    }function v(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }function m(t, e, i, o, n) {
      var r = {};return Object.keys(o).forEach(function (t) {
        r[t] = o[t];
      }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
        return o(t, e, i) || i;
      }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(t, e, r), r = null), r;
    }var g = cc._decorator,
        w = g.ccclass,
        b = g.property,
        x = cc.Vec3,
        _ = (o = w("cc.Collider3D"), n = b({ type: d.PhysicsMaterial, displayName: "Material", displayOrder: -1 }), r = b({ displayOrder: 0 }), s = b({ type: cc.Vec3, displayOrder: 1 }), a = b({ type: d.PhysicsMaterial }), o((m((h = function (t) {
      var e, i, o, n;function r() {
        var e;return (e = t.call(this) || this)._isSharedMaterial = !0, y(e, "_material", c, f(e)), y(e, "_isTrigger", p, f(e)), y(e, "_center", u, f(e)), cc.EventTarget.call(f(e)), e;
      }i = t, (e = r).prototype = Object.create(i.prototype), e.prototype.constructor = e, e.__proto__ = i, o = r, (n = [{ key: "sharedMaterial", get: function get() {
          return this._material;
        }, set: function set(t) {
          this.material = t;
        } }, { key: "material", get: function get() {
          return this._isSharedMaterial && null != this._material && (this._material.off("physics_material_update", this._updateMaterial, this), this._material = this._material.clone(), this._material.on("physics_material_update", this._updateMaterial, this), this._isSharedMaterial = !1), this._material;
        }, set: function set(t) {
          null != t && null != this._material ? this._material._uuid != t._uuid && (this._material.off("physics_material_update", this._updateMaterial, this), t.on("physics_material_update", this._updateMaterial, this), this._isSharedMaterial = !1, this._material = t) : null != t && null == this._material ? (t.on("physics_material_update", this._updateMaterial, this), this._material = t) : null == t && null != this._material && (this._material.off("physics_material_update", this._updateMaterial, this), this._material = t), this._updateMaterial();
        } }, { key: "isTrigger", get: function get() {
          return this._isTrigger;
        }, set: function set(t) {
          this._isTrigger = t, this._shape.isTrigger = this._isTrigger;
        } }, { key: "center", get: function get() {
          return this._center;
        }, set: function set(t) {
          x.copy(this._center, t), this._shape.center = this._center;
        } }, { key: "attachedRigidbody", get: function get() {
          return this.shape.attachedRigidBody;
        } }, { key: "shape", get: function get() {
          return this._shape;
        } }, { key: "_assertOnload", get: function get() {
          var t = 0 == this._isOnLoadCalled;return t && cc.error("Physics Error: Please make sure that the node has been added to the scene"), !t;
        } }]) && v(o.prototype, n);var s = r.prototype;return s.on = function () {}, s.off = function () {}, s.once = function () {}, s.emit = function () {}, s.__preload = function () {
        this._shape.__preload(this);
      }, s.onLoad = function () {
        this.sharedMaterial = null == this._material ? cc.director.getPhysics3DManager().defaultMaterial : this._material, this._shape.onLoad();
      }, s.onEnable = function () {
        this._shape.onEnable();
      }, s.onDisable = function () {
        this._shape.onDisable();
      }, s.onDestroy = function () {
        this._material && this._material.off("physics_material_update", this._updateMaterial, this), this._shape.onDestroy();
      }, s._updateMaterial = function () {
        this._shape.material = this._material;
      }, r;
    }(cc.Component)).prototype, "sharedMaterial", [n], Object.getOwnPropertyDescriptor(h.prototype, "sharedMaterial"), h.prototype), m(h.prototype, "isTrigger", [r], Object.getOwnPropertyDescriptor(h.prototype, "isTrigger"), h.prototype), m(h.prototype, "center", [s], Object.getOwnPropertyDescriptor(h.prototype, "center"), h.prototype), c = m(h.prototype, "_material", [a], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return null;
      } }), p = m(h.prototype, "_isTrigger", [b], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return !1;
      } }), u = m(h.prototype, "_center", [b], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return new x();
      } }), l = h)) || l);i.Collider3D = _, cc.js.mixin(_.prototype, cc.EventTarget.prototype);
  }, { "../../assets/physics-material": 11 }], 14: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.SphereCollider3D = void 0;var o,
        n,
        r,
        s = t("../../instance"),
        a = t("./collider-component");function l(t, e, i, o) {
      i && Object.defineProperty(t, e, { enumerable: i.enumerable, configurable: i.configurable, writable: i.writable, value: i.initializer ? i.initializer.call(o) : void 0 });
    }function h(t) {
      if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t;
    }function c(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }function p(t, e, i, o, n) {
      var r = {};return Object.keys(o).forEach(function (t) {
        r[t] = o[t];
      }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
        return o(t, e, i) || i;
      }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(t, e, r), r = null), r;
    }var u = cc._decorator,
        d = u.ccclass,
        y = u.executeInEditMode,
        f = u.executionOrder,
        v = u.menu,
        m = u.property,
        g = d("cc.SphereCollider3D")(o = f(98)(o = v("i18n:MAIN_MENU.component.physics/Collider/Sphere 3D")(o = y((p((n = function (t) {
      var e, i, o, n;function a() {
        var e;return l(e = t.call(this) || this, "_radius", r, h(e)), e._shape = (0, s.createSphereShape)(e._radius), e;
      }return i = t, (e = a).prototype = Object.create(i.prototype), e.prototype.constructor = e, e.__proto__ = i, o = a, (n = [{ key: "radius", get: function get() {
          return this._radius;
        }, set: function set(t) {
          this._radius = t, this.sphereShape.radius = this._radius;
        } }, { key: "sphereShape", get: function get() {
          return this._shape;
        } }]) && c(o.prototype, n), a;
    }(a.Collider3D)).prototype, "radius", [m], Object.getOwnPropertyDescriptor(n.prototype, "radius"), n.prototype), r = p(n.prototype, "_radius", [m], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return .5;
      } }), o = n)) || o) || o) || o) || o;i.SphereCollider3D = g;
  }, { "../../instance": 18, "./collider-component": 13 }], 15: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.ConstantForce = void 0;var o,
        n,
        r,
        s,
        a,
        l,
        h,
        c,
        p,
        u,
        d,
        y,
        f,
        v,
        m,
        g = t("./rigid-body-component");function w(t, e, i, o) {
      i && Object.defineProperty(t, e, { enumerable: i.enumerable, configurable: i.configurable, writable: i.writable, value: i.initializer ? i.initializer.call(o) : void 0 });
    }function b(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }function x(t) {
      if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t;
    }function _(t, e, i, o, n) {
      var r = {};return Object.keys(o).forEach(function (t) {
        r[t] = o[t];
      }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
        return o(t, e, i) || i;
      }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(t, e, r), r = null), r;
    }var B = cc._decorator,
        S = B.ccclass,
        E = B.executeInEditMode,
        M = B.executionOrder,
        C = B.menu,
        A = B.property,
        z = B.requireComponent,
        F = B.disallowMultiple,
        T = cc.Vec3,
        R = (o = S("cc.ConstantForce"), n = M(98), r = z(g.RigidBody3D), s = C("i18n:MAIN_MENU.component.physics/Constant Force 3D"), a = A({ displayOrder: 0 }), l = A({ displayOrder: 1 }), h = A({ displayOrder: 2 }), c = A({ displayOrder: 3 }), o(p = n(p = r(p = s(p = F(p = E((m = function (t) {
      var e, i;function o() {
        for (var e, i = arguments.length, o = new Array(i), n = 0; n < i; n++) {
          o[n] = arguments[n];
        }return (e = t.call.apply(t, [this].concat(o)) || this)._rigidbody = null, w(e, "_force", d, x(e)), w(e, "_localForce", y, x(e)), w(e, "_torque", f, x(e)), w(e, "_localTorque", v, x(e)), e._mask = 0, e;
      }i = t, (e = o).prototype = Object.create(i.prototype), e.prototype.constructor = e, e.__proto__ = i;var n,
          r,
          s = o.prototype;return s.onLoad = function () {
        this._rigidbody = this.node.getComponent(g.RigidBody3D), this._maskUpdate(this._force, 1), this._maskUpdate(this._localForce, 2), this._maskUpdate(this._torque, 4), this._maskUpdate(this._localTorque, 8);
      }, s.lateUpdate = function () {
        null != this._rigidbody && 0 != this._mask && (1 & this._mask && this._rigidbody.applyForce(this._force), 2 & this._mask && this._rigidbody.applyLocalForce(this.localForce), 4 & this._mask && this._rigidbody.applyTorque(this._torque), 8 & this._mask && this._rigidbody.applyLocalTorque(this._localTorque));
      }, s._maskUpdate = function (t, e) {
        T.strictEquals(t, T.ZERO) ? this._mask &= ~e : this._mask |= e;
      }, n = o, (r = [{ key: "force", get: function get() {
          return this._force;
        }, set: function set(t) {
          T.copy(this._force, t), this._maskUpdate(this._force, 1);
        } }, { key: "localForce", get: function get() {
          return this._localForce;
        }, set: function set(t) {
          T.copy(this._localForce, t), this._maskUpdate(this.localForce, 2);
        } }, { key: "torque", get: function get() {
          return this._torque;
        }, set: function set(t) {
          T.copy(this._torque, t), this._maskUpdate(this._torque, 4);
        } }, { key: "localTorque", get: function get() {
          return this._localTorque;
        }, set: function set(t) {
          T.copy(this._localTorque, t), this._maskUpdate(this._localTorque, 8);
        } }]) && b(n.prototype, r), o;
    }(cc.Component), d = _((u = m).prototype, "_force", [A], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return new T();
      } }), y = _(u.prototype, "_localForce", [A], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return new T();
      } }), f = _(u.prototype, "_torque", [A], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return new T();
      } }), v = _(u.prototype, "_localTorque", [A], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return new T();
      } }), _(u.prototype, "force", [a], Object.getOwnPropertyDescriptor(u.prototype, "force"), u.prototype), _(u.prototype, "localForce", [l], Object.getOwnPropertyDescriptor(u.prototype, "localForce"), u.prototype), _(u.prototype, "torque", [h], Object.getOwnPropertyDescriptor(u.prototype, "torque"), u.prototype), _(u.prototype, "localTorque", [c], Object.getOwnPropertyDescriptor(u.prototype, "localTorque"), u.prototype), p = u)) || p) || p) || p) || p) || p) || p);i.ConstantForce = R;
  }, { "./rigid-body-component": 16 }], 16: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.RigidBody3D = void 0;var o,
        n,
        r,
        s,
        a,
        l,
        h,
        c,
        p,
        u,
        d,
        y,
        f,
        v,
        m,
        g,
        w,
        b,
        x,
        _,
        B,
        S = t("../instance");function E(t, e, i, o) {
      i && Object.defineProperty(t, e, { enumerable: i.enumerable, configurable: i.configurable, writable: i.writable, value: i.initializer ? i.initializer.call(o) : void 0 });
    }function M(t) {
      if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t;
    }function C(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }function A(t, e, i, o, n) {
      var r = {};return Object.keys(o).forEach(function (t) {
        r[t] = o[t];
      }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
        return o(t, e, i) || i;
      }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(t, e, r), r = null), r;
    }var z = cc._decorator,
        F = z.ccclass,
        T = z.disallowMultiple,
        R = z.executeInEditMode,
        P = z.executionOrder,
        q = z.menu,
        I = z.property,
        V = cc.Vec3,
        O = (o = F("cc.RigidBody3D"), n = P(99), r = q("i18n:MAIN_MENU.component.physics/Rigid Body 3D"), s = I({ displayOrder: 0 }), a = I({ displayOrder: 1 }), l = I({ displayOrder: 2 }), h = I({ displayOrder: 3 }), c = I({ displayOrder: 4 }), p = I({ displayOrder: 5 }), u = I({ displayOrder: 6 }), d = I({ displayOrder: 7 }), o(y = n(y = r(y = R(y = T((A((f = function (t) {
      var e, i, o, n;function r() {
        var e;return (e = t.call(this) || this)._allowSleep = !0, E(e, "_mass", v, M(e)), E(e, "_linearDamping", m, M(e)), E(e, "_angularDamping", g, M(e)), E(e, "_fixedRotation", w, M(e)), E(e, "_isKinematic", b, M(e)), E(e, "_useGravity", x, M(e)), E(e, "_linearFactor", _, M(e)), E(e, "_angularFactor", B, M(e)), e._body = (0, S.createRigidBody)(), e;
      }i = t, (e = r).prototype = Object.create(i.prototype), e.prototype.constructor = e, e.__proto__ = i, o = r, (n = [{ key: "allowSleep", get: function get() {
          return this._allowSleep;
        }, set: function set(t) {
          this._allowSleep = t, this._body.allowSleep = t;
        } }, { key: "mass", get: function get() {
          return this._mass;
        }, set: function set(t) {
          this._mass = t, this._body.mass = t;
        } }, { key: "linearDamping", get: function get() {
          return this._linearDamping;
        }, set: function set(t) {
          this._linearDamping = t, this._body.linearDamping = t;
        } }, { key: "angularDamping", get: function get() {
          return this._angularDamping;
        }, set: function set(t) {
          this._angularDamping = t, this._body.angularDamping = t;
        } }, { key: "isKinematic", get: function get() {
          return this._isKinematic;
        }, set: function set(t) {
          this._isKinematic = t, this._body.isKinematic = t;
        } }, { key: "useGravity", get: function get() {
          return this._useGravity;
        }, set: function set(t) {
          this._useGravity = t, this._body.useGravity = t;
        } }, { key: "fixedRotation", get: function get() {
          return this._fixedRotation;
        }, set: function set(t) {
          this._fixedRotation = t, this._body.fixedRotation = t;
        } }, { key: "linearFactor", get: function get() {
          return this._linearFactor;
        }, set: function set(t) {
          V.copy(this._linearFactor, t), this._body.linearFactor = this._linearFactor;
        } }, { key: "angularFactor", get: function get() {
          return this._angularFactor;
        }, set: function set(t) {
          V.copy(this._angularFactor, t), this._body.angularFactor = this._angularFactor;
        } }, { key: "isAwake", get: function get() {
          return !!this._assertOnload && this._body.isAwake;
        } }, { key: "isSleepy", get: function get() {
          return !!this._assertOnload && this._body.isSleepy;
        } }, { key: "isSleeping", get: function get() {
          return !!this._assertOnload && this._body.isSleeping;
        } }, { key: "rigidBody", get: function get() {
          return this._body;
        } }, { key: "_assertOnload", get: function get() {
          var t = 0 == this._isOnLoadCalled;return t && cc.error("Physics Error: Please make sure that the node has been added to the scene"), !t;
        } }]) && C(o.prototype, n);var s = r.prototype;return s.__preload = function () {
        this._body.__preload(this);
      }, s.onEnable = function () {
        this._body.onEnable();
      }, s.onDisable = function () {
        this._body.onDisable();
      }, s.onDestroy = function () {
        this._body.onDestroy();
      }, s.applyForce = function (t, e) {
        this._assertOnload && this._body.applyForce(t, e);
      }, s.applyLocalForce = function (t, e) {
        this._assertOnload && this._body.applyLocalForce(t, e);
      }, s.applyImpulse = function (t, e) {
        this._assertOnload && this._body.applyImpulse(t, e);
      }, s.applyLocalImpulse = function (t, e) {
        this._assertOnload && this._body.applyLocalImpulse(t, e);
      }, s.applyTorque = function (t) {
        this._assertOnload && this._body.applyTorque(t);
      }, s.applyLocalTorque = function (t) {
        this._assertOnload && this._body.applyLocalTorque(t);
      }, s.wakeUp = function () {
        this._assertOnload && this._body.wakeUp();
      }, s.sleep = function () {
        this._assertOnload && this._body.sleep();
      }, s.getLinearVelocity = function (t) {
        this._assertOnload && this._body.getLinearVelocity(t);
      }, s.setLinearVelocity = function (t) {
        this._assertOnload && this._body.setLinearVelocity(t);
      }, s.getAngularVelocity = function (t) {
        this._assertOnload && this._body.getAngularVelocity(t);
      }, s.setAngularVelocity = function (t) {
        this._assertOnload && this._body.setAngularVelocity(t);
      }, r;
    }(cc.Component)).prototype, "mass", [s], Object.getOwnPropertyDescriptor(f.prototype, "mass"), f.prototype), A(f.prototype, "linearDamping", [a], Object.getOwnPropertyDescriptor(f.prototype, "linearDamping"), f.prototype), A(f.prototype, "angularDamping", [l], Object.getOwnPropertyDescriptor(f.prototype, "angularDamping"), f.prototype), A(f.prototype, "isKinematic", [h], Object.getOwnPropertyDescriptor(f.prototype, "isKinematic"), f.prototype), A(f.prototype, "useGravity", [c], Object.getOwnPropertyDescriptor(f.prototype, "useGravity"), f.prototype), A(f.prototype, "fixedRotation", [p], Object.getOwnPropertyDescriptor(f.prototype, "fixedRotation"), f.prototype), A(f.prototype, "linearFactor", [u], Object.getOwnPropertyDescriptor(f.prototype, "linearFactor"), f.prototype), A(f.prototype, "angularFactor", [d], Object.getOwnPropertyDescriptor(f.prototype, "angularFactor"), f.prototype), v = A(f.prototype, "_mass", [I], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return 10;
      } }), m = A(f.prototype, "_linearDamping", [I], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return .1;
      } }), g = A(f.prototype, "_angularDamping", [I], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return .1;
      } }), w = A(f.prototype, "_fixedRotation", [I], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return !1;
      } }), b = A(f.prototype, "_isKinematic", [I], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return !1;
      } }), x = A(f.prototype, "_useGravity", [I], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return !0;
      } }), _ = A(f.prototype, "_linearFactor", [I], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return new V(1, 1, 1);
      } }), B = A(f.prototype, "_angularFactor", [I], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return new V(1, 1, 1);
      } }), y = f)) || y) || y) || y) || y) || y);i.RigidBody3D = O;
  }, { "../instance": 18 }], 17: [function (t, e, i) {
    "use strict";
    i.__esModule = !0;var o = t("./physics-manager");i.Physics3DManager = o.Physics3DManager;var n = t("./physics-ray-result");i.PhysicsRayResult = n.PhysicsRayResult;var r = t("./components/collider/box-collider-component");i.BoxCollider3D = r.BoxCollider3D;var s = t("./components/collider/collider-component");i.Collider3D = s.Collider3D;var a = t("./components/collider/sphere-collider-component");i.SphereCollider3D = a.SphereCollider3D;var l = t("./components/rigid-body-component");i.RigidBody3D = l.RigidBody3D;var h = t("./components/constant-force"),
        c = t("./assets/physics-material");i.PhysicsMaterial = c.PhysicsMaterial, cc.Physics3DManager = o.Physics3DManager, cc.Collider3D = s.Collider3D, cc.BoxCollider3D = r.BoxCollider3D, cc.SphereCollider3D = a.SphereCollider3D, cc.RigidBody3D = l.RigidBody3D, cc.PhysicsRayResult = n.PhysicsRayResult, cc.ConstantForce = h.ConstantForce;
  }, { "./assets/physics-material": 11, "./components/collider/box-collider-component": 12, "./components/collider/collider-component": 13, "./components/collider/sphere-collider-component": 14, "./components/constant-force": 15, "./components/rigid-body-component": 16, "./physics-manager": 20, "./physics-ray-result": 21 }], 18: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.createPhysicsWorld = function () {
      return new o.PhysicsWorld();
    }, i.createRigidBody = function () {
      return new o.RigidBody();
    }, i.createBoxShape = function (t) {
      return new o.BoxShape(t);
    }, i.createSphereShape = function (t) {
      return new o.SphereShape(t);
    };var o = t("./physics-selector");
  }, { "./physics-selector": 22 }], 19: [function (t, e, i) {
    "use strict";
    var o;i.__esModule = !0, i.ERigidBodyType = void 0, i.ERigidBodyType = o, function (t) {
      t[t.DYNAMIC = 1] = "DYNAMIC", t[t.STATIC = 2] = "STATIC", t[t.KINEMATIC = 4] = "KINEMATIC";
    }(o || (i.ERigidBodyType = o = {}));
  }, {}], 20: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.Physics3DManager = void 0;var o,
        n,
        r,
        s,
        a,
        l,
        h,
        c,
        p = t("./instance"),
        u = t("./assets/physics-material"),
        d = t("./physics-ray-result");function y(t, e, i, o) {
      i && Object.defineProperty(t, e, { enumerable: i.enumerable, configurable: i.configurable, writable: i.writable, value: i.initializer ? i.initializer.call(o) : void 0 });
    }function f(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }function v(t, e, i, o, n) {
      var r = {};return Object.keys(o).forEach(function (t) {
        r[t] = o[t];
      }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
        return o(t, e, i) || i;
      }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(t, e, r), r = null), r;
    }var m = cc._decorator,
        g = m.property,
        w = (0, m.ccclass)("cc.Physics3DManager")((r = v((n = function () {
      var t, e;function i() {
        this.physicsWorld = void 0, this.raycastClosestResult = new d.PhysicsRayResult(), this.raycastResults = [], y(this, "_enabled", r, this), y(this, "_allowSleep", s, this), y(this, "_gravity", a, this), y(this, "_maxSubStep", l, this), y(this, "_fixedTime", h, this), y(this, "_useFixedTime", c, this), this.useAccumulator = !1, this._accumulator = 0, this.useFixedDigit = !1, this.useInternalTime = !1, this.fixDigits = { position: 5, rotation: 12, timeNow: 3 }, this._deltaTime = 0, this._lastTime = 0, this._material = null, this.raycastOptions = { groupIndex: -1, queryTrigger: !0, maxDistance: 1 / 0 }, this.raycastResultPool = new cc.RecyclePool(function () {
          return new d.PhysicsRayResult();
        }, 1), cc.director._scheduler && cc.director._scheduler.enableForTarget(this), this.physicsWorld = (0, p.createPhysicsWorld)(), this._lastTime = performance.now(), this.gravity = this._gravity, this.allowSleep = this._allowSleep, this._material = new u.PhysicsMaterial(), this._material.friction = .1, this._material.restitution = .1, this._material.on("physics_material_update", this._updateMaterial, this), this.physicsWorld.defaultMaterial = this._material;
      }t = i, (e = [{ key: "enabled", get: function get() {
          return this._enabled;
        }, set: function set(t) {
          this._enabled = t;
        } }, { key: "allowSleep", get: function get() {
          return this._allowSleep;
        }, set: function set(t) {
          this._allowSleep = t, this.physicsWorld.allowSleep = this._allowSleep;
        } }, { key: "maxSubStep", get: function get() {
          return this._maxSubStep;
        }, set: function set(t) {
          this._maxSubStep = t;
        } }, { key: "deltaTime", get: function get() {
          return this._fixedTime;
        }, set: function set(t) {
          this._fixedTime = t;
        } }, { key: "useFixedTime", get: function get() {
          return this._useFixedTime;
        }, set: function set(t) {
          this._useFixedTime = t;
        } }, { key: "gravity", get: function get() {
          return this._gravity;
        }, set: function set(t) {
          this._gravity.set(t), this.physicsWorld.gravity = t;
        } }, { key: "defaultMaterial", get: function get() {
          return this._material;
        } }]) && f(t.prototype, e);var o = i.prototype;return o.update = function (t) {
        if (this._enabled) {
          if (this.useInternalTime) {
            var e = parseFloat(performance.now().toFixed(this.fixDigits.timeNow));this._deltaTime = e > this._lastTime ? (e - this._lastTime) / 1e3 : 0, this._lastTime = e;
          } else this._deltaTime = t;if (cc.director.emit(cc.Director.EVENT_BEFORE_PHYSICS), this._useFixedTime) this.physicsWorld.step(this._fixedTime);else if (this.useAccumulator) {
            var i = 0;for (this._accumulator += this._deltaTime; i < this._maxSubStep && this._accumulator > this._fixedTime;) {
              this.physicsWorld.step(this._fixedTime), this._accumulator -= this._fixedTime, i++;
            }
          } else this.physicsWorld.step(this._fixedTime, this._deltaTime, this._maxSubStep);cc.director.emit(cc.Director.EVENT_AFTER_PHYSICS);
        }
      }, o.raycast = function (t, e, i, o) {
        if (void 0 === e && (e = 0), void 0 === i && (i = 1 / 0), void 0 === o && (o = !0), this.raycastResultPool.reset(), this.raycastResults.length = 0, "string" == typeof e) {
          var n = cc.game.groupList.indexOf(e);-1 == n && (n = 0), this.raycastOptions.groupIndex = n;
        } else this.raycastOptions.groupIndex = e;return this.raycastOptions.maxDistance = i, this.raycastOptions.queryTrigger = o, this.physicsWorld.raycast(t, this.raycastOptions, this.raycastResultPool, this.raycastResults) ? this.raycastResults : null;
      }, o.raycastClosest = function (t, e, i, o) {
        if (void 0 === e && (e = 0), void 0 === i && (i = 1 / 0), void 0 === o && (o = !0), "string" == typeof e) {
          var n = cc.game.groupList.indexOf(e);-1 == n && (n = 0), this.raycastOptions.groupIndex = n;
        } else this.raycastOptions.groupIndex = e;return this.raycastOptions.maxDistance = i, this.raycastOptions.queryTrigger = o, this.physicsWorld.raycastClosest(t, this.raycastOptions, this.raycastClosestResult) ? this.raycastClosestResult : null;
      }, o._updateMaterial = function () {
        this.physicsWorld.defaultMaterial = this._material;
      }, i;
    }()).prototype, "_enabled", [g], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return !1;
      } }), s = v(n.prototype, "_allowSleep", [g], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return !0;
      } }), a = v(n.prototype, "_gravity", [g], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return new cc.Vec3(0, -10, 0);
      } }), l = v(n.prototype, "_maxSubStep", [g], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return 1;
      } }), h = v(n.prototype, "_fixedTime", [g], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return 1 / 60;
      } }), c = v(n.prototype, "_useFixedTime", [g], { configurable: !0, enumerable: !0, writable: !0, initializer: function initializer() {
        return !0;
      } }), o = n)) || o;i.Physics3DManager = w;
  }, { "./assets/physics-material": 11, "./instance": 18, "./physics-ray-result": 21 }], 21: [function (t, e, i) {
    "use strict";
    function o(t, e) {
      for (var i = 0; i < e.length; i++) {
        var o = e[i];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o);
      }
    }i.__esModule = !0, i.PhysicsRayResult = void 0;var n = cc.Vec3,
        r = function () {
      function t() {
        this._hitPoint = new n(), this._distance = 0, this._collidier = null;
      }var e,
          i,
          r = t.prototype;return r._assign = function (t, e, i) {
        n.copy(this._hitPoint, t), this._distance = e, this._collidier = i;
      }, r.clone = function () {
        var e = new t();return n.copy(e._hitPoint, this._hitPoint), e._distance = this._distance, e._collidier = this._collidier, e;
      }, e = t, (i = [{ key: "hitPoint", get: function get() {
          return this._hitPoint;
        } }, { key: "distance", get: function get() {
          return this._distance;
        } }, { key: "collider", get: function get() {
          return this._collidier;
        } }]) && o(e.prototype, i), t;
    }();i.PhysicsRayResult = r;
  }, {}], 22: [function (t, e, i) {
    "use strict";
    var o, n, r, s;i.__esModule = !0, i.instantiate = function (t, e, a, l) {
      i.BoxShape = o = t, i.SphereShape = n = e, i.RigidBody = r = a, i.PhysicsWorld = s = l;
    }, i.PhysicsWorld = i.RigidBody = i.SphereShape = i.BoxShape = void 0, i.BoxShape = o, i.SphereShape = n, i.RigidBody = r, i.PhysicsWorld = s;
  }, {}], 23: [function (t, e, i) {
    "use strict";
    i.__esModule = !0, i.stringfyVec3 = function (t) {
      return "(x: " + t.x + ", y: " + t.y + ", z: " + t.z + ")";
    }, i.stringfyQuat = function (t) {
      return "(x: " + t.x + ", y: " + t.y + ", z: " + t.z + ", w: " + t.w + ")";
    }, i.setWrap = function (t, e) {
      t.__cc_wrapper__ = e;
    }, i.getWrap = function (t) {
      return t.__cc_wrapper__;
    }, i.clearNodeTransformDirtyFlag = function () {
      for (var t in b) {
        var e = b[t];e._localMatDirty &= ~r, e._localMatDirty & s || (e._worldMatDirty = !1, e._renderFlag &= ~a);
      }b = {}, d.length = 0;
    }, i.clearNodeTransformRecord = function () {
      b = {}, d.length = 0;
    }, i.updateWorldTransform = x, i.updateWorldRT = function (t, e, i) {
      var o = t.parent;o ? (x(o, !0), c.transformMat4(y, e, h.invert(w, o._worldMatrix)), p.multiply(g, p.conjugate(g, o.__wrot), i), t.setPosition(y), t.setRotation(g)) : (t.setPosition(e), t.setRotation(i));
    };var o = cc.Node._LocalDirtyFlag,
        n = o.PHYSICS_TRS,
        r = o.ALL_TRS,
        s = o.SKEW,
        a = cc.RenderFlow.FLAG_TRANSFORM,
        l = cc.Mat3,
        h = cc.Mat4,
        c = cc.Vec3,
        p = cc.Quat,
        u = cc.Trs,
        d = [],
        y = cc.v3(),
        f = cc.quat(),
        v = new l(),
        m = v.m,
        g = cc.quat(),
        w = cc.mat4(),
        b = {};function x(t, e) {
      void 0 === e && (e = !1);for (var i, o, r, s, a, w, x, _, B = t, S = 0, E = !1, M = 0; B;) {
        if (!e && b[B._id]) {
          M |= B._localMatDirty & n, E = E || !!M;break;
        }d[S++] = B, B._localMatDirty & n && (E = !0), B = B._parent;
      }if (!E) return !1;for (d.length = S; S;) {
        i = d[--S], !e && (b[i._id] = i), o = i._worldMatrix, a = i._matrix, s = i._trs, w = i.__wpos = i.__wpos || cc.v3(), x = i.__wrot = i.__wrot || cc.quat(), _ = i.__wscale = i.__wscale || cc.v3(), i._localMatDirty & n && u.toMat4(a, s), i._localMatDirty |= M, (M |= i._localMatDirty & n) & n ? (B ? (r = B._worldMatrix, u.toPosition(y, s), c.transformMat4(w, y, r), h.multiply(o, r, a), u.toRotation(f, s), p.multiply(x, B.__wrot, f), l.fromQuat(v, p.conjugate(g, x)), l.multiplyMat4(v, v, o), _.x = m[0], _.y = m[4], _.z = m[8]) : (u.toPosition(w, s), u.toRotation(x, s), u.toScale(_, s), h.copy(o, a)), B = i) : B = i;
      }return !0;
    }
  }, {}], 24: [function (t, e, i) {
    (function (o) {
      "use strict";
      !function (t) {
        if ("object" == (typeof i === "undefined" ? "undefined" : _typeof(i)) && void 0 !== e) e.exports = t();else if ("function" == typeof define && define.amd) define([], t);else {
          var n;"undefined" != typeof window ? n = window : void 0 !== o ? n = o : "undefined" != typeof self && (n = self), n.CANNON = t();
        }
      }(function () {
        return function e(i, o, n) {
          function r(a, l) {
            if (!o[a]) {
              if (!i[a]) {
                var h = "function" == typeof t && t;if (!l && h) return h(a, !0);if (s) return s(a, !0);throw new Error("Cannot find module '" + a + "'");
              }var c = o[a] = { exports: {} };i[a][0].call(c.exports, function (t) {
                return r(i[a][1][t] || t);
              }, c, c.exports, e, i, o, n);
            }return o[a].exports;
          }for (var s = "function" == typeof t && t, a = 0; a < n.length; a++) {
            r(n[a]);
          }return r;
        }({ 1: [function (t, e) {
            e.exports = { name: "@cocos/cannon", version: "1.1.1-exp.3", description: "A lightweight 3D physics engine written in JavaScript.", homepage: "https://github.com/cocos-creator/cannon.js", author: "Stefan Hedman <schteppe@gmail.com> (http://steffe.se), JayceLai", keywords: ["cannon.js", "cocos", "creator", "physics", "engine", "3d"], scripts: { build: "grunt && npm run preprocess && grunt addLicense && grunt addDate", preprocess: "node node_modules/uglify-js/bin/uglifyjs build/cannon.js -o build/cannon.min.js -c -m" }, main: "./build/cannon.min.js", engines: { node: "*" }, repository: { type: "git", url: "https://github.com/cocos-creator/cannon.js.git" }, bugs: { url: "https://github.com/cocos-creator/cannon.js/issues" }, licenses: [{ type: "MIT" }], devDependencies: { jshint: "latest", "uglify-js": "latest", nodeunit: "^0.9.0", grunt: "~0.4.0", "grunt-contrib-jshint": "~0.1.1", "grunt-contrib-nodeunit": "^0.4.1", "grunt-contrib-concat": "~0.1.3", "grunt-contrib-uglify": "^0.5.1", "grunt-browserify": "^2.1.4", "grunt-contrib-yuidoc": "^0.5.2", browserify: "*" }, dependencies: {} };
          }, {}], 2: [function (t, e) {
            e.exports = { version: t("../package.json").version, AABB: t("./collision/AABB"), ArrayCollisionMatrix: t("./collision/ArrayCollisionMatrix"), Body: t("./objects/Body"), Box: t("./shapes/Box"), Broadphase: t("./collision/Broadphase"), Constraint: t("./constraints/Constraint"), ContactEquation: t("./equations/ContactEquation"), Narrowphase: t("./world/Narrowphase"), ConeTwistConstraint: t("./constraints/ConeTwistConstraint"), ContactMaterial: t("./material/ContactMaterial"), ConvexPolyhedron: t("./shapes/ConvexPolyhedron"), Cylinder: t("./shapes/Cylinder"), DistanceConstraint: t("./constraints/DistanceConstraint"), Equation: t("./equations/Equation"), EventTarget: t("./utils/EventTarget"), FrictionEquation: t("./equations/FrictionEquation"), GSSolver: t("./solver/GSSolver"), GridBroadphase: t("./collision/GridBroadphase"), Heightfield: t("./shapes/Heightfield"), HingeConstraint: t("./constraints/HingeConstraint"), LockConstraint: t("./constraints/LockConstraint"), Mat3: t("./math/Mat3"), Material: t("./material/Material"), NaiveBroadphase: t("./collision/NaiveBroadphase"), ObjectCollisionMatrix: t("./collision/ObjectCollisionMatrix"), Pool: t("./utils/Pool"), Particle: t("./shapes/Particle"), Plane: t("./shapes/Plane"), PointToPointConstraint: t("./constraints/PointToPointConstraint"), Quaternion: t("./math/Quaternion"), Ray: t("./collision/Ray"), RaycastVehicle: t("./objects/RaycastVehicle"), RaycastResult: t("./collision/RaycastResult"), RigidVehicle: t("./objects/RigidVehicle"), RotationalEquation: t("./equations/RotationalEquation"), RotationalMotorEquation: t("./equations/RotationalMotorEquation"), SAPBroadphase: t("./collision/SAPBroadphase"), SPHSystem: t("./objects/SPHSystem"), Shape: t("./shapes/Shape"), Solver: t("./solver/Solver"), Sphere: t("./shapes/Sphere"), SplitSolver: t("./solver/SplitSolver"), Spring: t("./objects/Spring"), Transform: t("./math/Transform"), Trimesh: t("./shapes/Trimesh"), Vec3: t("./math/Vec3"), Vec3Pool: t("./utils/Vec3Pool"), World: t("./world/World"), Octree: t("./utils/Octree"), CMath: t("./math/CMath") };
          }, { "../package.json": 1, "./collision/AABB": 3, "./collision/ArrayCollisionMatrix": 4, "./collision/Broadphase": 5, "./collision/GridBroadphase": 6, "./collision/NaiveBroadphase": 7, "./collision/ObjectCollisionMatrix": 8, "./collision/Ray": 10, "./collision/RaycastResult": 11, "./collision/SAPBroadphase": 12, "./constraints/ConeTwistConstraint": 13, "./constraints/Constraint": 14, "./constraints/DistanceConstraint": 15, "./constraints/HingeConstraint": 16, "./constraints/LockConstraint": 17, "./constraints/PointToPointConstraint": 18, "./equations/ContactEquation": 20, "./equations/Equation": 21, "./equations/FrictionEquation": 22, "./equations/RotationalEquation": 23, "./equations/RotationalMotorEquation": 24, "./material/ContactMaterial": 25, "./material/Material": 26, "./math/CMath": 27, "./math/Mat3": 29, "./math/Quaternion": 30, "./math/Transform": 31, "./math/Vec3": 32, "./objects/Body": 33, "./objects/RaycastVehicle": 34, "./objects/RigidVehicle": 35, "./objects/SPHSystem": 36, "./objects/Spring": 37, "./shapes/Box": 39, "./shapes/ConvexPolyhedron": 40, "./shapes/Cylinder": 41, "./shapes/Heightfield": 42, "./shapes/Particle": 43, "./shapes/Plane": 44, "./shapes/Shape": 45, "./shapes/Sphere": 46, "./shapes/Trimesh": 47, "./solver/GSSolver": 48, "./solver/Solver": 49, "./solver/SplitSolver": 50, "./utils/EventTarget": 51, "./utils/Octree": 52, "./utils/Pool": 53, "./utils/Vec3Pool": 56, "./world/Narrowphase": 57, "./world/World": 58 }], 3: [function (t, e) {
            var i = t("../math/Vec3");function o(t) {
              t = t || {}, this.lowerBound = new i(), t.lowerBound && this.lowerBound.copy(t.lowerBound), this.upperBound = new i(), t.upperBound && this.upperBound.copy(t.upperBound);
            }t("../utils/Utils"), e.exports = o;var n = new i();o.prototype.setFromPoints = function (t, e, i, o) {
              var r = this.lowerBound,
                  s = this.upperBound,
                  a = i;r.copy(t[0]), a && a.vmult(r, r), s.copy(r);for (var l = 1; l < t.length; l++) {
                var h = t[l];a && (a.vmult(h, n), h = n), h.x > s.x && (s.x = h.x), h.x < r.x && (r.x = h.x), h.y > s.y && (s.y = h.y), h.y < r.y && (r.y = h.y), h.z > s.z && (s.z = h.z), h.z < r.z && (r.z = h.z);
              }return e && (e.vadd(r, r), e.vadd(s, s)), o && (r.x -= o, r.y -= o, r.z -= o, s.x += o, s.y += o, s.z += o), this;
            }, o.prototype.copy = function (t) {
              return this.lowerBound.copy(t.lowerBound), this.upperBound.copy(t.upperBound), this;
            }, o.prototype.clone = function () {
              return new o().copy(this);
            }, o.prototype.extend = function (t) {
              this.lowerBound.x = Math.min(this.lowerBound.x, t.lowerBound.x), this.upperBound.x = Math.max(this.upperBound.x, t.upperBound.x), this.lowerBound.y = Math.min(this.lowerBound.y, t.lowerBound.y), this.upperBound.y = Math.max(this.upperBound.y, t.upperBound.y), this.lowerBound.z = Math.min(this.lowerBound.z, t.lowerBound.z), this.upperBound.z = Math.max(this.upperBound.z, t.upperBound.z);
            }, o.prototype.overlaps = function (t) {
              var e = this.lowerBound,
                  i = this.upperBound,
                  o = t.lowerBound,
                  n = t.upperBound,
                  r = o.x <= i.x && i.x <= n.x || e.x <= n.x && n.x <= i.x,
                  s = o.y <= i.y && i.y <= n.y || e.y <= n.y && n.y <= i.y,
                  a = o.z <= i.z && i.z <= n.z || e.z <= n.z && n.z <= i.z;return r && s && a;
            }, o.prototype.volume = function () {
              var t = this.lowerBound,
                  e = this.upperBound;return (e.x - t.x) * (e.y - t.y) * (e.z - t.z);
            }, o.prototype.contains = function (t) {
              var e = this.lowerBound,
                  i = this.upperBound,
                  o = t.lowerBound,
                  n = t.upperBound;return e.x <= o.x && i.x >= n.x && e.y <= o.y && i.y >= n.y && e.z <= o.z && i.z >= n.z;
            }, o.prototype.getCorners = function (t, e, i, o, n, r, s, a) {
              var l = this.lowerBound,
                  h = this.upperBound;t.copy(l), e.set(h.x, l.y, l.z), i.set(h.x, h.y, l.z), o.set(l.x, h.y, h.z), n.set(h.x, l.y, h.z), r.set(l.x, h.y, l.z), s.set(l.x, l.y, h.z), a.copy(h);
            };var r = [new i(), new i(), new i(), new i(), new i(), new i(), new i(), new i()];o.prototype.toLocalFrame = function (t, e) {
              var i = r,
                  o = i[0],
                  n = i[1],
                  s = i[2],
                  a = i[3],
                  l = i[4],
                  h = i[5],
                  c = i[6],
                  p = i[7];this.getCorners(o, n, s, a, l, h, c, p);for (var u = 0; 8 !== u; u++) {
                var d = i[u];t.pointToLocal(d, d);
              }return e.setFromPoints(i);
            }, o.prototype.toWorldFrame = function (t, e) {
              var i = r,
                  o = i[0],
                  n = i[1],
                  s = i[2],
                  a = i[3],
                  l = i[4],
                  h = i[5],
                  c = i[6],
                  p = i[7];this.getCorners(o, n, s, a, l, h, c, p);for (var u = 0; 8 !== u; u++) {
                var d = i[u];t.pointToWorld(d, d);
              }return e.setFromPoints(i);
            }, o.prototype.overlapsRay = function (t) {
              var e = 1 / t._direction.x,
                  i = 1 / t._direction.y,
                  o = 1 / t._direction.z,
                  n = (this.lowerBound.x - t.from.x) * e,
                  r = (this.upperBound.x - t.from.x) * e,
                  s = (this.lowerBound.y - t.from.y) * i,
                  a = (this.upperBound.y - t.from.y) * i,
                  l = (this.lowerBound.z - t.from.z) * o,
                  h = (this.upperBound.z - t.from.z) * o,
                  c = Math.max(Math.max(Math.min(n, r), Math.min(s, a)), Math.min(l, h)),
                  p = Math.min(Math.min(Math.max(n, r), Math.max(s, a)), Math.max(l, h));return !(p < 0 || c > p);
            };
          }, { "../math/Vec3": 32, "../utils/Utils": 55 }], 4: [function (t, e) {
            function i() {
              this.matrix = [];
            }e.exports = i, i.prototype.get = function (t, e) {
              if (t = t.index, (e = e.index) > t) {
                var i = e;e = t, t = i;
              }return this.matrix[(t * (t + 1) >> 1) + e - 1];
            }, i.prototype.set = function (t, e, i) {
              if (t = t.index, (e = e.index) > t) {
                var o = e;e = t, t = o;
              }this.matrix[(t * (t + 1) >> 1) + e - 1] = i ? 1 : 0;
            }, i.prototype.reset = function () {
              for (var t = 0, e = this.matrix.length; t !== e; t++) {
                this.matrix[t] = 0;
              }
            }, i.prototype.setNumObjects = function (t) {
              this.matrix.length = t * (t - 1) >> 1;
            };
          }, {}], 5: [function (t, e) {
            var i = t("../objects/Body"),
                o = t("../math/Vec3"),
                n = t("../math/Quaternion");function r() {
              this.world = null, this.useBoundingBoxes = !1, this.dirty = !0;
            }t("../shapes/Shape"), t("../shapes/Plane"), e.exports = r, r.prototype.collisionPairs = function () {
              throw new Error("collisionPairs not implemented for this BroadPhase class!");
            }, r.prototype.needBroadphaseCollision = function (t, e) {
              return 0 != (t.collisionFilterGroup & e.collisionFilterMask) && 0 != (e.collisionFilterGroup & t.collisionFilterMask) && (!(!t.hasTrigger && !e.hasTrigger) || 0 == (t.type & i.STATIC) && t.sleepState !== i.SLEEPING || 0 == (e.type & i.STATIC) && e.sleepState !== i.SLEEPING);
            }, r.prototype.intersectionTest = function (t, e, i, o) {
              this.useBoundingBoxes ? this.doBoundingBoxBroadphase(t, e, i, o) : this.doBoundingSphereBroadphase(t, e, i, o);
            };var s = new o();new o(), new n(), new o(), r.prototype.doBoundingSphereBroadphase = function (t, e, i, o) {
              var n = s;e.position.vsub(t.position, n);var r = Math.pow(t.boundingRadius + e.boundingRadius, 2);n.norm2() < r && (i.push(t), o.push(e));
            }, r.prototype.doBoundingBoxBroadphase = function (t, e, i, o) {
              t.aabbNeedsUpdate && t.computeAABB(), e.aabbNeedsUpdate && e.computeAABB(), t.aabb.overlaps(e.aabb) && (i.push(t), o.push(e));
            };var a = { keys: [] },
                l = [],
                h = [];r.prototype.makePairsUnique = function (t, e) {
              for (var i = a, o = l, n = h, r = t.length, s = 0; s !== r; s++) {
                o[s] = t[s], n[s] = e[s];
              }for (t.length = 0, e.length = 0, s = 0; s !== r; s++) {
                var c = o[s].id,
                    p = n[s].id;i[u = c < p ? c + "," + p : p + "," + c] = s, i.keys.push(u);
              }for (s = 0; s !== i.keys.length; s++) {
                var u = i.keys.pop(),
                    d = i[u];t.push(o[d]), e.push(n[d]), delete i[u];
              }
            }, r.prototype.setWorld = function () {};var c = new o();r.boundingSphereCheck = function (t, e) {
              var i = c;return t.position.vsub(e.position, i), Math.pow(t.shape.boundingSphereRadius + e.shape.boundingSphereRadius, 2) > i.norm2();
            }, r.prototype.aabbQuery = function () {
              return console.warn(".aabbQuery is not implemented in this Broadphase subclass."), [];
            };
          }, { "../math/Quaternion": 30, "../math/Vec3": 32, "../objects/Body": 33, "../shapes/Plane": 44, "../shapes/Shape": 45 }], 6: [function (t, e) {
            e.exports = r;var i = t("./Broadphase"),
                o = t("../math/Vec3"),
                n = t("../shapes/Shape");function r(t, e, n, r, s) {
              i.apply(this), this.nx = n || 10, this.ny = r || 10, this.nz = s || 10, this.aabbMin = t || new o(100, 100, 100), this.aabbMax = e || new o(-100, -100, -100);var a = this.nx * this.ny * this.nz;if (a <= 0) throw "GridBroadphase: Each dimension's n must be >0";this.bins = [], this.binLengths = [], this.bins.length = a, this.binLengths.length = a;for (var l = 0; l < a; l++) {
                this.bins[l] = [], this.binLengths[l] = 0;
              }
            }r.prototype = new i(), r.prototype.constructor = r;var s = new o();new o(), r.prototype.collisionPairs = function (t, e, i) {
              for (var o = t.numObjects(), r = t.bodies, a = this.aabbMax, l = this.aabbMin, h = this.nx, c = this.ny, p = this.nz, u = c * p, d = p, y = 1, f = a.x, v = a.y, m = a.z, g = l.x, w = l.y, b = l.z, x = h / (f - g), _ = c / (v - w), B = p / (m - b), S = (f - g) / h, E = (v - w) / c, M = (m - b) / p, C = .5 * Math.sqrt(S * S + E * E + M * M), A = n.types, z = A.SPHERE, F = A.PLANE, T = (A.BOX, A.COMPOUND, A.CONVEXPOLYHEDRON, this.bins), R = this.binLengths, P = this.bins.length, q = 0; q !== P; q++) {
                R[q] = 0;
              }var I = Math.ceil;function V(t, e, i, o, n, r, s) {
                var a = (t - g) * x | 0,
                    l = (e - w) * _ | 0,
                    f = (i - b) * B | 0,
                    v = I((o - g) * x),
                    m = I((n - w) * _),
                    S = I((r - b) * B);a < 0 ? a = 0 : a >= h && (a = h - 1), l < 0 ? l = 0 : l >= c && (l = c - 1), f < 0 ? f = 0 : f >= p && (f = p - 1), v < 0 ? v = 0 : v >= h && (v = h - 1), m < 0 ? m = 0 : m >= c && (m = c - 1), S < 0 ? S = 0 : S >= p && (S = p - 1), l *= d, f *= y, v *= u, m *= d, S *= y;for (var E = a *= u; E <= v; E += u) {
                  for (var M = l; M <= m; M += d) {
                    for (var C = f; C <= S; C += y) {
                      var A = E + M + C;T[A][R[A]++] = s;
                    }
                  }
                }
              }for (l = Math.min, a = Math.max, q = 0; q !== o; q++) {
                var O = (it = r[q]).shape;switch (O.type) {case z:
                    var k = it.position.x,
                        N = it.position.y,
                        j = it.position.z,
                        L = O.radius;V(k - L, N - L, j - L, k + L, N + L, j + L, it);break;case F:
                    O.worldNormalNeedsUpdate && O.computeWorldNormal(it.quaternion);var W = O.worldNormal,
                        D = g + .5 * S - it.position.x,
                        U = w + .5 * E - it.position.y,
                        G = b + .5 * M - it.position.z,
                        H = s;H.set(D, U, G);for (var K = 0, Q = 0; K !== h; K++, Q += u, H.y = U, H.x += S) {
                      for (var X = 0, Y = 0; X !== c; X++, Y += d, H.z = G, H.y += E) {
                        for (var Z = 0, J = 0; Z !== p; Z++, J += y, H.z += M) {
                          if (H.dot(W) < C) {
                            var $ = Q + Y + J;T[$][R[$]++] = it;
                          }
                        }
                      }
                    }break;default:
                    it.aabbNeedsUpdate && it.computeAABB(), V(it.aabb.lowerBound.x, it.aabb.lowerBound.y, it.aabb.lowerBound.z, it.aabb.upperBound.x, it.aabb.upperBound.y, it.aabb.upperBound.z, it);}
              }for (q = 0; q !== P; q++) {
                var tt = R[q];if (tt > 1) {
                  var et = T[q];for (K = 0; K !== tt; K++) {
                    var it = et[K];for (X = 0; X !== K; X++) {
                      var ot = et[X];this.needBroadphaseCollision(it, ot) && this.intersectionTest(it, ot, e, i);
                    }
                  }
                }
              }this.makePairsUnique(e, i);
            };
          }, { "../math/Vec3": 32, "../shapes/Shape": 45, "./Broadphase": 5 }], 7: [function (t, e) {
            e.exports = n;var i = t("./Broadphase"),
                o = t("./AABB");function n() {
              i.apply(this);
            }n.prototype = new i(), n.prototype.constructor = n, n.prototype.collisionPairs = function (t, e, i) {
              var o,
                  n,
                  r,
                  s,
                  a = t.bodies,
                  l = a.length;for (o = 0; o !== l; o++) {
                for (n = 0; n !== o; n++) {
                  r = a[o], s = a[n], this.needBroadphaseCollision(r, s) && this.intersectionTest(r, s, e, i);
                }
              }
            }, new o(), n.prototype.aabbQuery = function (t, e, i) {
              i = i || [];for (var o = 0; o < t.bodies.length; o++) {
                var n = t.bodies[o];n.aabbNeedsUpdate && n.computeAABB(), n.aabb.overlaps(e) && i.push(n);
              }return i;
            };
          }, { "./AABB": 3, "./Broadphase": 5 }], 8: [function (t, e) {
            function i() {
              this.matrix = {};
            }e.exports = i, i.prototype.get = function (t, e) {
              if (t = t.id, (e = e.id) > t) {
                var i = e;e = t, t = i;
              }return t + "-" + e in this.matrix;
            }, i.prototype.set = function (t, e, i) {
              if (t = t.id, (e = e.id) > t) {
                var o = e;e = t, t = o;
              }i ? this.matrix[t + "-" + e] = !0 : delete this.matrix[t + "-" + e];
            }, i.prototype.reset = function () {
              this.matrix = {};
            }, i.prototype.setNumObjects = function () {};
          }, {}], 9: [function (t, e) {
            function i() {
              this.current = [], this.previous = [];
            }function o(t, e) {
              t.push((4294901760 & e) >> 16, 65535 & e);
            }e.exports = i, i.prototype.getKey = function (t, e) {
              if (e < t) {
                var i = e;e = t, t = i;
              }return t << 16 | e;
            }, i.prototype.set = function (t, e) {
              for (var i = this.getKey(t, e), o = this.current, n = 0; i > o[n];) {
                n++;
              }if (i !== o[n]) {
                for (e = o.length - 1; e >= n; e--) {
                  o[e + 1] = o[e];
                }o[n] = i;
              }
            }, i.prototype.tick = function () {
              var t = this.current;this.current = this.previous, this.previous = t, this.current.length = 0;
            }, i.prototype.getDiff = function (t, e) {
              for (var i = this.current, n = this.previous, r = i.length, s = n.length, a = 0, l = 0; l < r; l++) {
                for (var h = i[l]; h > n[a];) {
                  a++;
                }h === n[a] || o(t, h);
              }for (a = 0, l = 0; l < s; l++) {
                for (var c = n[l]; c > i[a];) {
                  a++;
                }i[a] === c || o(e, c);
              }
            };
          }, {}], 10: [function (t, e) {
            e.exports = l;var i = t("../math/Vec3"),
                o = t("../math/Quaternion"),
                n = t("../math/Transform"),
                r = (t("../shapes/ConvexPolyhedron"), t("../shapes/Box"), t("../collision/RaycastResult")),
                s = t("../shapes/Shape"),
                a = t("../collision/AABB");function l(t, e) {
              this.from = t ? t.clone() : new i(), this.to = e ? e.clone() : new i(), this._direction = new i(), this.precision = 1e-4, this.checkCollisionResponse = !0, this.skipBackfaces = !1, this.collisionFilterMask = -1, this.collisionFilterGroup = -1, this.mode = l.ANY, this.result = new r(), this.hasHit = !1, this.callback = function () {};
            }l.prototype.constructor = l, l.CLOSEST = 1, l.ANY = 2, l.ALL = 4;var h = new a(),
                c = [];l.prototype.intersectWorld = function (t, e) {
              return this.mode = e.mode || l.ANY, this.result = e.result || new r(), this.skipBackfaces = !!e.skipBackfaces, this.checkCollisionResponse = !!e.checkCollisionResponse, this.collisionFilterMask = void 0 !== e.collisionFilterMask ? e.collisionFilterMask : -1, this.collisionFilterGroup = void 0 !== e.collisionFilterGroup ? e.collisionFilterGroup : -1, e.from && this.from.copy(e.from), e.to && this.to.copy(e.to), this.callback = e.callback || function () {}, this.hasHit = !1, this.result.reset(), this._updateDirection(), this.getAABB(h), c.length = 0, t.broadphase.aabbQuery(t, h, c), this.intersectBodies(c), this.hasHit;
            };var p = new i(),
                u = new i();function d(t, e, i, o) {
              o.vsub(e, V), i.vsub(e, p), t.vsub(e, u);var n,
                  r,
                  s = V.dot(V),
                  a = V.dot(p),
                  l = V.dot(u),
                  h = p.dot(p),
                  c = p.dot(u);return (n = h * l - a * c) >= 0 && (r = s * c - a * l) >= 0 && n + r < s * h - a * a;
            }l.pointInTriangle = d;var y = new i(),
                f = new o();l.prototype.intersectBody = function (t, e) {
              e && (this.result = e, this._updateDirection());var i = this.checkCollisionResponse;if ((!i || t.collisionResponse) && 0 != (this.collisionFilterGroup & t.collisionFilterMask) && 0 != (t.collisionFilterGroup & this.collisionFilterMask)) for (var o = y, n = f, r = 0, s = t.shapes.length; r < s; r++) {
                var a = t.shapes[r];if ((!i || a.collisionResponse) && (t.quaternion.mult(t.shapeOrientations[r], n), t.quaternion.vmult(t.shapeOffsets[r], o), o.vadd(t.position, o), this.intersectShape(a, n, o, t), this.result._shouldStop)) break;
              }
            }, l.prototype.intersectBodies = function (t, e) {
              e && (this.result = e, this._updateDirection());for (var i = 0, o = t.length; !this.result._shouldStop && i < o; i++) {
                this.intersectBody(t[i]);
              }
            }, l.prototype._updateDirection = function () {
              this.to.vsub(this.from, this._direction), this._direction.normalize();
            }, l.prototype.intersectShape = function (t, e, i, o) {
              if (!(k(this.from, this._direction, i) > t.boundingSphereRadius)) {
                var n = this[t.type];n && n.call(this, t, e, i, o, t);
              }
            }, new i(), new i();var v = new i(),
                m = new i(),
                g = new i(),
                w = new i();new i(), new r(), l.prototype.intersectBox = function (t, e, i, o, n) {
              return this.intersectConvex(t.convexPolyhedronRepresentation, e, i, o, n);
            }, l.prototype[s.types.BOX] = l.prototype.intersectBox, l.prototype.intersectPlane = function (t, e, o, n, r) {
              var s = this.from,
                  a = this.to,
                  l = this._direction,
                  h = new i(0, 0, 1);e.vmult(h, h);var c = new i();s.vsub(o, c);var p = c.dot(h);if (a.vsub(o, c), !(p * c.dot(h) > 0 || s.distanceTo(a) < p)) {
                var u = h.dot(l);if (!(Math.abs(u) < this.precision)) {
                  var d = new i(),
                      y = new i(),
                      f = new i();s.vsub(o, d);var v = -h.dot(d) / u;l.scale(v, y), s.vadd(y, f), this.reportIntersection(h, f, r, n, -1);
                }
              }
            }, l.prototype[s.types.PLANE] = l.prototype.intersectPlane, l.prototype.getAABB = function (t) {
              var e = this.to,
                  i = this.from;t.lowerBound.x = Math.min(e.x, i.x), t.lowerBound.y = Math.min(e.y, i.y), t.lowerBound.z = Math.min(e.z, i.z), t.upperBound.x = Math.max(e.x, i.x), t.upperBound.y = Math.max(e.y, i.y), t.upperBound.z = Math.max(e.z, i.z);
            };var b = { faceList: [0] },
                x = new i(),
                _ = new l(),
                B = [];l.prototype.intersectHeightfield = function (t, e, i, o, r) {
              t.data, t.elementSize;var s = _;s.from.copy(this.from), s.to.copy(this.to), n.pointToLocalFrame(i, e, s.from, s.from), n.pointToLocalFrame(i, e, s.to, s.to), s._updateDirection();var l,
                  h,
                  c,
                  p,
                  u = B;l = h = 0, c = p = t.data.length - 1;var d = new a();s.getAABB(d), t.getIndexOfPosition(d.lowerBound.x, d.lowerBound.y, u, !0), l = Math.max(l, u[0]), h = Math.max(h, u[1]), t.getIndexOfPosition(d.upperBound.x, d.upperBound.y, u, !0), c = Math.min(c, u[0] + 1), p = Math.min(p, u[1] + 1);for (var y = l; y < c; y++) {
                for (var f = h; f < p; f++) {
                  if (this.result._shouldStop) return;if (t.getAabbAtIndex(y, f, d), d.overlapsRay(s)) {
                    if (t.getConvexTrianglePillar(y, f, !1), n.pointToWorldFrame(i, e, t.pillarOffset, x), this.intersectConvex(t.pillarConvex, e, x, o, r, b), this.result._shouldStop) return;t.getConvexTrianglePillar(y, f, !0), n.pointToWorldFrame(i, e, t.pillarOffset, x), this.intersectConvex(t.pillarConvex, e, x, o, r, b);
                  }
                }
              }
            }, l.prototype[s.types.HEIGHTFIELD] = l.prototype.intersectHeightfield;var S = new i(),
                E = new i();l.prototype.intersectSphere = function (t, e, i, o, n) {
              var r = this.from,
                  s = this.to,
                  a = t.radius,
                  l = Math.pow(s.x - r.x, 2) + Math.pow(s.y - r.y, 2) + Math.pow(s.z - r.z, 2),
                  h = 2 * ((s.x - r.x) * (r.x - i.x) + (s.y - r.y) * (r.y - i.y) + (s.z - r.z) * (r.z - i.z)),
                  c = Math.pow(r.x - i.x, 2) + Math.pow(r.y - i.y, 2) + Math.pow(r.z - i.z, 2) - Math.pow(a, 2),
                  p = Math.pow(h, 2) - 4 * l * c,
                  u = S,
                  d = E;if (!(p < 0)) if (0 === p) r.lerp(s, p, u), u.vsub(i, d), d.normalize(), this.reportIntersection(d, u, n, o, -1);else {
                var y = (-h - Math.sqrt(p)) / (2 * l),
                    f = (-h + Math.sqrt(p)) / (2 * l);if (y >= 0 && y <= 1 && (r.lerp(s, y, u), u.vsub(i, d), d.normalize(), this.reportIntersection(d, u, n, o, -1)), this.result._shouldStop) return;f >= 0 && f <= 1 && (r.lerp(s, f, u), u.vsub(i, d), d.normalize(), this.reportIntersection(d, u, n, o, -1));
              }
            }, l.prototype[s.types.SPHERE] = l.prototype.intersectSphere;var M = new i(),
                C = (new i(), new i(), new i());l.prototype.intersectConvex = function (t, e, i, o, n, r) {
              for (var s = M, a = C, l = r && r.faceList || null, h = t.faces, c = t.vertices, p = t.faceNormals, u = this._direction, y = this.from, f = this.to, b = y.distanceTo(f), x = l ? l.length : h.length, _ = this.result, B = 0; !_._shouldStop && B < x; B++) {
                var S = l ? l[B] : B,
                    E = h[S],
                    A = p[S],
                    z = e,
                    F = i;a.copy(c[E[0]]), z.vmult(a, a), a.vadd(F, a), a.vsub(y, a), z.vmult(A, s);var T = u.dot(s);if (!(Math.abs(T) < this.precision)) {
                  var R = s.dot(a) / T;if (!(R < 0)) {
                    u.mult(R, v), v.vadd(y, v), m.copy(c[E[0]]), z.vmult(m, m), F.vadd(m, m);for (var P = 1; !_._shouldStop && P < E.length - 1; P++) {
                      g.copy(c[E[P]]), w.copy(c[E[P + 1]]), z.vmult(g, g), z.vmult(w, w), F.vadd(g, g), F.vadd(w, w);var q = v.distanceTo(y);!d(v, m, g, w) && !d(v, g, m, w) || q > b || this.reportIntersection(s, v, n, o, S);
                    }
                  }
                }
              }
            }, l.prototype[s.types.CONVEXPOLYHEDRON] = l.prototype.intersectConvex;var A = new i(),
                z = new i(),
                F = new i(),
                T = new i(),
                R = new i(),
                P = new i(),
                q = (new a(), []),
                I = new n();l.prototype.intersectTrimesh = function (t, e, i, o, r, s) {
              var a = A,
                  l = q,
                  h = I,
                  c = C,
                  p = z,
                  u = F,
                  y = T,
                  f = P,
                  b = R,
                  x = (s && s.faceList, t.indices),
                  _ = (t.vertices, t.faceNormals, this.from),
                  B = this.to,
                  S = this._direction;h.position.copy(i), h.quaternion.copy(e), n.vectorToLocalFrame(i, e, S, p), n.pointToLocalFrame(i, e, _, u), n.pointToLocalFrame(i, e, B, y), y.x *= t.scale.x, y.y *= t.scale.y, y.z *= t.scale.z, u.x *= t.scale.x, u.y *= t.scale.y, u.z *= t.scale.z, y.vsub(u, p), p.normalize();var E = u.distanceSquared(y);t.tree.rayQuery(this, h, l);for (var M = 0, V = l.length; !this.result._shouldStop && M !== V; M++) {
                var O = l[M];t.getNormal(O, a), t.getVertex(x[3 * O], m), m.vsub(u, c);var k = p.dot(a),
                    N = a.dot(c) / k;if (!(N < 0)) {
                  p.scale(N, v), v.vadd(u, v), t.getVertex(x[3 * O + 1], g), t.getVertex(x[3 * O + 2], w);var j = v.distanceSquared(u);!d(v, g, m, w) && !d(v, m, g, w) || j > E || (n.vectorToWorldFrame(e, a, b), n.pointToWorldFrame(i, e, v, f), this.reportIntersection(b, f, r, o, O));
                }
              }l.length = 0;
            }, l.prototype[s.types.TRIMESH] = l.prototype.intersectTrimesh, l.prototype.reportIntersection = function (t, e, i, o, n) {
              var r = this.from,
                  s = this.to,
                  a = r.distanceTo(e),
                  h = this.result;if (!(this.skipBackfaces && t.dot(this._direction) > 0)) switch (h.hitFaceIndex = void 0 !== n ? n : -1, this.mode) {case l.ALL:
                  this.hasHit = !0, h.set(r, s, t, e, i, o, a), h.hasHit = !0, this.callback(h);break;case l.CLOSEST:
                  (a < h.distance || !h.hasHit) && (this.hasHit = !0, h.hasHit = !0, h.set(r, s, t, e, i, o, a));break;case l.ANY:
                  this.hasHit = !0, h.hasHit = !0, h.set(r, s, t, e, i, o, a), h._shouldStop = !0;}
            };var V = new i(),
                O = new i();function k(t, e, i) {
              i.vsub(t, V);var o = V.dot(e);return e.mult(o, O), O.vadd(t, O), i.distanceTo(O);
            }
          }, { "../collision/AABB": 3, "../collision/RaycastResult": 11, "../math/Quaternion": 30, "../math/Transform": 31, "../math/Vec3": 32, "../shapes/Box": 39, "../shapes/ConvexPolyhedron": 40, "../shapes/Shape": 45 }], 11: [function (t, e) {
            var i = t("../math/Vec3");function o() {
              this.rayFromWorld = new i(), this.rayToWorld = new i(), this.hitNormalWorld = new i(), this.hitPointWorld = new i(), this.hasHit = !1, this.shape = null, this.body = null, this.hitFaceIndex = -1, this.distance = -1, this._shouldStop = !1;
            }e.exports = o, o.prototype.reset = function () {
              this.rayFromWorld.setZero(), this.rayToWorld.setZero(), this.hitNormalWorld.setZero(), this.hitPointWorld.setZero(), this.hasHit = !1, this.shape = null, this.body = null, this.hitFaceIndex = -1, this.distance = -1, this._shouldStop = !1;
            }, o.prototype.abort = function () {
              this._shouldStop = !0;
            }, o.prototype.set = function (t, e, i, o, n, r, s) {
              this.rayFromWorld.copy(t), this.rayToWorld.copy(e), this.hitNormalWorld.copy(i), this.hitPointWorld.copy(o), this.shape = n, this.body = r, this.distance = s;
            };
          }, { "../math/Vec3": 32 }], 12: [function (t, e) {
            t("../shapes/Shape");var i = t("../collision/Broadphase");function o(t) {
              i.apply(this), this.axisList = [], this.world = null, this.axisIndex = 0;var e = this.axisList;this._addBodyHandler = function (t) {
                e.push(t.body);
              }, this._removeBodyHandler = function (t) {
                var i = e.indexOf(t.body);-1 !== i && e.splice(i, 1);
                  t[n + 1] = t[n];

