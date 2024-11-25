(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Cloudtop = factory());
})(this, (function () { 'use strict';

    var MethodTypes;
    (function(MethodTypes2) {
      MethodTypes2["GET"] = "GET";
      MethodTypes2["POST"] = "POST";
      MethodTypes2["PUT"] = "PUT";
      MethodTypes2["DELETE"] = "DELETE";
    })(MethodTypes || (MethodTypes = {}));
    var xhr = function(method, url, data) {
      return new Promise(function(resolve, reject) {
        try {
          var xhr_1 = new XMLHttpRequest();
          xhr_1.open(method, url);
          if (method === MethodTypes.POST) {
            xhr_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr_1.send(new URLSearchParams(data));
          } else {
            xhr_1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr_1.send();
          }
          xhr_1.onreadystatechange = function() {
            if (xhr_1.readyState === XMLHttpRequest.DONE && xhr_1.status === 200) {
              resolve(JSON.parse(xhr_1.response));
            } else {
              new Error(xhr_1.response);
            }
          };
        } catch (error) {
          reject(error);
        }
      });
    };
    var sendBeacon = function(url, data) {
      return navigator.sendBeacon(url, JSON.stringify(data));
    };
    var sendFromImg = function(url, data) {
      var image = new Image();
      var s = url.indexOf("?") === -1 ? "?" : "&";
      image.src = "".concat(url).concat(s, "data=").concat(encodeURIComponent(JSON.stringify(data)));
      image = null;
    };
    var sendFromPost = function(url, data) {
      return xhr(MethodTypes.POST, url, data);
    };

    var generateUUID = function() {
      var d = +/* @__PURE__ */ new Date();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : r & 3 | 8).toString(16);
      });
      return uuid;
    };

    const UID_KEY = "__CLOUDTOP_UID__";
    const getUid = () => {
      let uid = localStorage.getItem(UID_KEY);
      if (uid)
        return uid;
      uid = generateUUID();
      localStorage.setItem(UID_KEY, uid);
      return uid;
    };
    const getPathname = (routeMode) => {
      const { pathname } = window.location;
      switch (routeMode) {
        case "history":
          return pathname;
        case "hash":
          const reg = /^#(.*)\?/;
          const [_, path] = reg.exec(window.location.hash) || [];
          return path != null ? path : "";
        default:
          return pathname;
      }
    };
    const getNetworkType = () => {
      const navigator = window.navigator;
      if (navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection && connection.effectiveType) {
          return connection.effectiveType;
        }
      }
      return "unknown";
    };

    var LogType = /* @__PURE__ */ ((LogType2) => {
      LogType2["PV"] = "pv";
      LogType2["ERROR"] = "error";
      LogType2["RESOURCE_ERROR"] = "resource_error";
      LogType2["PERF"] = "perf";
      LogType2["API"] = "api";
      return LogType2;
    })(LogType || {});

    var __defProp$4 = Object.defineProperty;
    var __defProps$1 = Object.defineProperties;
    var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
    var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
    var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues$3 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp$3.call(b, prop))
          __defNormalProp$4(a, prop, b[prop]);
      if (__getOwnPropSymbols$3)
        for (var prop of __getOwnPropSymbols$3(b)) {
          if (__propIsEnum$3.call(b, prop))
            __defNormalProp$4(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
    const parseError = (error) => {
      var _a, _b, _c, _d, _e;
      if (error instanceof SyntaxError || error instanceof TypeError || error instanceof ReferenceError || error instanceof RangeError || error instanceof URIError) {
        return {
          name: error.name,
          message: error.message,
          stack: error.stack,
          error: __spreadProps$1(__spreadValues$3({}, error), {
            name: (_a = error.name) != null ? _a : "",
            message: (_b = error.message) != null ? _b : "",
            stack: (_c = error.stack) != null ? _c : ""
          })
        };
      }
      return {
        name: "CustomError",
        message: (_d = error.message) != null ? _d : typeof error === "string" ? error : JSON.stringify(error),
        stack: (_e = error == null ? void 0 : error.stack) != null ? _e : "",
        error
      };
    };

    const getXpath = (target) => {
      const list = [target.localName];
      while (target.parentElement) {
        target = target.parentElement;
        list.unshift(target.localName);
      }
      return list.join(".");
    };
    const transform$2 = (data) => {
      const { localName, src, href, nodeName } = data.target || {};
      if (localName) {
        if (window.location.href.indexOf(src || href) === 0) {
          return;
        }
        const reg = /https?:\/\/([0-9a-zA-Z]{0,62}(\.[0-9a-zA-Z]{0,62})+)(\/.*)(\?|\#)?/;
        const [_, domain, __, resName] = reg.exec(src || href);
        const resourceData = {
          src: src || href,
          nodeName,
          xpath: getXpath(data.target),
          resType: localName,
          resName,
          domain,
          type: LogType.RESOURCE_ERROR
        };
        return resourceData;
      }
      const { message, lineno, colno, filename, error } = data;
      const { name, stack, error: newError } = parseError(error);
      return {
        type: LogType.ERROR,
        category: name,
        msg: message,
        stack,
        file: filename,
        line: lineno,
        col: colno,
        error: JSON.stringify(newError)
      };
    };
    const handleError = (e, callback) => {
      const data = transform$2(e);
      callback(data);
    };
    const listenError = (callback) => window.addEventListener(
      "error",
      (e) => (e.preventDefault(), handleError(e, callback)),
      true
    );

    const transform$1 = (data) => {
      const { message, error } = parseError(data.reason);
      return {
        type: LogType.ERROR,
        category: "PromiseRejection",
        msg: message,
        error
      };
    };
    const handlePromiseError = (e, callback) => {
      const data = transform$1(e);
      callback(data);
    };
    const listenPromiseError = (callback) => window.addEventListener(
      "unhandledrejection",
      (e) => (e.preventDefault(), handlePromiseError(e, callback)),
      true
    );

    const transform = () => {
      const pvData = {
        type: LogType.PV,
        // pvId: string
        dt: document.title,
        dr: document.referrer,
        de: document.characterSet,
        dpr: String(window.devicePixelRatio),
        lang: document.documentElement.lang
        // url: window.location.href, // 页面链接
      };
      return pvData;
    };
    const handlePV = (callback) => {
      const data = transform();
      callback(data);
    };

    var __defProp$3 = Object.defineProperty;
    var __defProps = Object.defineProperties;
    var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
    var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
    var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues$2 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp$2.call(b, prop))
          __defNormalProp$3(a, prop, b[prop]);
      if (__getOwnPropSymbols$2)
        for (var prop of __getOwnPropSymbols$2(b)) {
          if (__propIsEnum$2.call(b, prop))
            __defNormalProp$3(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
    const getPerf = () => {
      const [timing] = window.performance.getEntries();
      const perfData = {
        type: LogType.PERF,
        /**
         * 阶段性指标
         */
        redirectTime: timing.redirectEnd - timing.redirectStart,
        appDns: timing.domainLookupStart - timing.fetchStart,
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ssl: timing.connectEnd - timing.secureConnectionStart,
        // SSL连接耗时
        ttfb: timing.responseStart - timing.requestStart,
        // 网络请求耗时。等待接收响应的第一个字节所花费的时间
        trans: timing.responseEnd - timing.responseStart,
        // 数据传输耗时
        dom: timing.domComplete - timing.responseEnd,
        // DOM解析耗时
        res: timing.loadEventEnd - timing.domContentLoadedEventEnd,
        // 资源加载耗时（load事件耗时）
        /**
         * 关键性指标
         */
        firstbyte: timing.responseStart - timing.domainLookupStart,
        // First Byte时间
        fpt: timing.responseEnd - timing.fetchStart,
        // 首次渲染时间（白屏时间）
        tti: timing.domInteractive - timing.fetchStart,
        // 首次可操作时间
        // fcp: timing.firstContentTime - timing.fetchStart, // 首次可操作时间
        ready: timing.domContentLoadedEventEnd - timing.fetchStart,
        // HTML加载完成时间，即DOM Ready时间
        load: timing.loadEventEnd - timing.fetchStart,
        // 从开始加载到完全加载时间
        lcp: 0
        // 最大内容绘制时间
      };
      return perfData;
    };
    const getLcp = () => new Promise((resolve) => {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] || {};
        resolve(lastEntry.renderTime || lastEntry.loadTime);
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    });
    const reportPerf = (callback) => {
      window.addEventListener(
        "load",
        (e) => {
          getLcp().then((lcp) => {
            const data = getPerf();
            callback(__spreadProps(__spreadValues$2({}, data), { lcp }));
          });
        },
        true
      );
    };

    var __defProp$2 = Object.defineProperty;
    var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __publicField$1 = (obj, key, value) => {
      __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
      return value;
    };
    class ListenEvent {
      constructor() {
        __publicField$1(this, "callbacks");
        this.callbacks = [];
      }
      dispatch(data) {
        this.callbacks.forEach((callback) => callback(data));
      }
      addListener(callback) {
        this.callbacks.push(callback);
      }
      removeListener(callback) {
        const index = this.callbacks.findIndex((c) => c === callback);
        if (index > -1) {
          this.callbacks.splice(index, 1);
        }
      }
    }
    const apiEvent = new ListenEvent();
    const apiIntercept = (status, url) => {
      if (status === 0) {
        return true;
      }
      const path = url == null ? void 0 : url.split("?")[0];
      const reg = /https?:\/\/.+\/.*\.([^/.]+)$/;
      if (reg.test(path)) {
        return true;
      }
      return false;
    };

    const _fetch = window.fetch;
    window.fetch = (input, init) => {
      const startTime = performance.now();
      return _fetch(input, init).then(
        (res) => {
          const endTime = performance.now();
          handle$1(res, endTime - startTime);
          return res;
        },
        (res) => {
          const endTime = performance.now();
          handle$1(res, endTime - startTime);
          return Promise.reject(res);
        }
      );
    };
    const handle$1 = (res, time) => {
      var _a;
      try {
        if (apiIntercept(res.status, res.url)) {
          return;
        }
        apiEvent.dispatch({
          api: (_a = res.url) == null ? void 0 : _a.split("?")[0],
          success: res.ok ? 1 : 0,
          status: res.status,
          msg: res.statusText,
          time
        });
      } catch (error) {
        console.log(error);
      }
    };

    const xhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
      const startTime = performance.now();
      const callback = (event) => {
        const endTime = performance.now();
        handle(event, endTime - startTime);
        this.removeEventListener("error", callback);
        this.removeEventListener("load", callback);
      };
      this.addEventListener("error", callback);
      this.addEventListener("load", callback);
      xhrSend.call(this, body);
    };
    const handle = (event, time) => {
      var _a;
      try {
        const target = event.target;
        const success = target.status >= 200 && target.status < 400;
        if (apiIntercept(target.status, target.responseURL)) {
          return;
        }
        apiEvent.dispatch({
          api: (_a = target.responseURL) == null ? void 0 : _a.split("?")[0],
          success: success ? 1 : 0,
          status: target.status,
          msg: target.statusText || (!success ? target.responseText : ""),
          time
        });
      } catch (error) {
        console.log(error);
      }
    };

    var __defProp$1 = Object.defineProperty;
    var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
    var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
    var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues$1 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp$1.call(b, prop))
          __defNormalProp$1(a, prop, b[prop]);
      if (__getOwnPropSymbols$1)
        for (var prop of __getOwnPropSymbols$1(b)) {
          if (__propIsEnum$1.call(b, prop))
            __defNormalProp$1(a, prop, b[prop]);
        }
      return a;
    };
    var __async$1 = (__this, __arguments, generator) => {
      return new Promise((resolve, reject) => {
        var fulfilled = (value) => {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        };
        var rejected = (value) => {
          try {
            step(generator.throw(value));
          } catch (e) {
            reject(e);
          }
        };
        var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
        step((generator = generator.apply(__this, __arguments)).next());
      });
    };
    const reportApi = (callback, baseURL) => {
      apiEvent.addListener((data) => __async$1(void 0, null, function* () {
        const { api } = data;
        if (api.includes(baseURL))
          return;
        callback(__spreadValues$1({
          type: LogType.API
        }, data));
      }));
    };

    var __defProp = Object.defineProperty;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b)) {
          if (__propIsEnum.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        }
      return a;
    };
    var __publicField = (obj, key, value) => {
      __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
      return value;
    };
    var __async = (__this, __arguments, generator) => {
      return new Promise((resolve, reject) => {
        var fulfilled = (value) => {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        };
        var rejected = (value) => {
          try {
            step(generator.throw(value));
          } catch (e) {
            reject(e);
          }
        };
        var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
        step((generator = generator.apply(__this, __arguments)).next());
      });
    };
    class Cloudtop {
      constructor(options) {
        __publicField(this, "baseURL");
        __publicField(this, "clientIp");
        __publicField(this, "projectId");
        __publicField(this, "env");
        __publicField(this, "sessionId");
        __publicField(this, "loginId");
        __publicField(this, "extend");
        __publicField(this, "pvId");
        __publicField(this, "reportType");
        __publicField(this, "routeMode");
        __publicField(this, "page");
        var _a, _b, _c, _d, _e, _f, _g;
        if (!options.baseURL) {
          console.error("baseURL \u672A\u914D\u7F6E\uFF0C\u524D\u7AEF\u6027\u80FD\u76D1\u63A7\u4E0A\u62A5\u4E0D\u751F\u6548");
          return;
        }
        if (!options.projectId) {
          console.error("projectId \u672A\u914D\u7F6E\uFF0C\u524D\u7AEF\u6027\u80FD\u76D1\u63A7\u4E0A\u62A5\u4E0D\u751F\u6548");
          return;
        }
        this.baseURL = options.baseURL;
        this.clientIp = (_a = options.clientIp) != null ? _a : "";
        this.projectId = options.projectId;
        this.env = (_b = options.env) != null ? _b : "production";
        this.sessionId = (_c = options.sessionId) != null ? _c : "";
        this.loginId = (_d = options.loginId) != null ? _d : "";
        this.extend = (_e = options.extend) != null ? _e : "";
        this.reportType = (_f = options.reportType) != null ? _f : "beacon";
        this.routeMode = (_g = options.routeMode) != null ? _g : "history";
        this.pvId = generateUUID();
        this.page = getPathname(this.routeMode);
        this.bootstrap();
      }
      setConfig(options) {
        var _a, _b, _c, _d;
        this.clientIp = (_a = options.clientIp) != null ? _a : this.clientIp;
        this.sessionId = (_b = options.sessionId) != null ? _b : this.sessionId;
        this.loginId = (_c = options.loginId) != null ? _c : this.loginId;
        this.extend = (_d = options.extend) != null ? _d : this.extend;
      }
      /**
       * 获取公共字段
       */
      getCommonData() {
        var _a;
        const { clientWidth = 0, clientHeight = 0 } = document.body || {};
        const { width, height } = window.screen || {};
        const extend = typeof this.extend === "string" ? this.extend : JSON.stringify(this.extend);
        return {
          reportTime: +/* @__PURE__ */ new Date(),
          pid: this.projectId,
          env: this.env,
          clientIp: this.clientIp,
          ct: getNetworkType(),
          pvId: this.pvId,
          page: (_a = this.page) != null ? _a : getPathname(this.routeMode),
          url: window.location.href,
          sr: width + "*" + height,
          vp: clientWidth + "*" + clientHeight,
          sid: this.sessionId,
          uid: getUid(),
          loginId: this.loginId,
          ext: extend
        };
      }
      report(data) {
        return __async(this, null, function* () {
          const record = __spreadValues(__spreadValues({}, this.getCommonData()), data);
          if (this.reportType === "beacon" && navigator.sendBeacon) {
            return sendBeacon(this.baseURL, record);
          }
          const dateLength = JSON.stringify(record).length;
          if (this.reportType === "img" || dateLength < 2e3) {
            return sendFromImg(this.baseURL + "/log.png", record);
          }
          return sendFromPost(this.baseURL, record);
        });
      }
      routeChange(path) {
        if (path && path === this.page)
          return;
        this.pvId = generateUUID();
        this.page = path != null ? path : getPathname(this.routeMode);
        handlePV(this.report.bind(this));
      }
      bootstrap() {
        this.routeChange();
        listenError(this.report.bind(this));
        listenPromiseError(this.report.bind(this));
        reportPerf(this.report.bind(this));
        reportApi(this.report.bind(this), this.baseURL);
      }
    }

    return Cloudtop;

}));
