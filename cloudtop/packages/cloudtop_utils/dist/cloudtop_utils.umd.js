(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CloudtopUtils = {}));
})(this, (function (exports) { 'use strict';

  var MethodTypes = /* @__PURE__ */ ((MethodTypes2) => {
    MethodTypes2["GET"] = "GET";
    MethodTypes2["POST"] = "POST";
    MethodTypes2["PUT"] = "PUT";
    MethodTypes2["DELETE"] = "DELETE";
    return MethodTypes2;
  })(MethodTypes || {});
  const xhr = (method, url, data) => {
    return new Promise((resolve, reject) => {
      try {
        const xhr2 = new XMLHttpRequest();
        xhr2.open(method, url);
        if (method === "POST" /* POST */) {
          xhr2.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          xhr2.send(new URLSearchParams(data));
        } else {
          xhr2.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          xhr2.send();
        }
        xhr2.onreadystatechange = () => {
          if (xhr2.readyState === XMLHttpRequest.DONE && xhr2.status === 200) {
            resolve(JSON.parse(xhr2.response));
          } else {
            new Error(xhr2.response);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  };
  const sendBeacon = (url, data) => navigator.sendBeacon(url, JSON.stringify(data));
  const sendFromImg = (url, data) => {
    let image = new Image();
    const s = url.indexOf("?") === -1 ? "?" : "&";
    image.src = `${url}${s}data=${encodeURIComponent(JSON.stringify(data))}`;
    image = null;
  };
  const sendFromGet = (url, data) => xhr("GET" /* GET */, url, data);
  const sendFromPost = (url, data) => xhr("POST" /* POST */, url, data);

  const generateUUID = () => {
    let d = +/* @__PURE__ */ new Date();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : r & 3 | 8).toString(16);
    });
    return uuid;
  };
  const formatDate = (format = "Y-M-D h:m:s", timestamp = Date.now()) => {
    const date = new Date(timestamp || Date.now());
    const dateInfo = {
      Y: `${date.getFullYear()}`,
      M: `${date.getMonth() + 1}`,
      D: `${date.getDate()}`,
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds()
    };
    const formatNumber = (n) => n >= 10 ? n : "0" + n;
    const res = (format || "Y-M-D h:m:s").replace("Y", dateInfo.Y).replace("M", dateInfo.M).replace("D", dateInfo.D).replace("h", formatNumber(dateInfo.h)).replace("m", formatNumber(dateInfo.m)).replace("s", formatNumber(dateInfo.s));
    return res;
  };
  function throttle(fn, delay) {
    let canRun = true;
    return function(...args) {
      if (!canRun)
        return;
      fn.apply(this, args);
      canRun = false;
      setTimeout(() => {
        canRun = true;
      }, delay);
    };
  }
  function replaceOld(source, name, replacement, isForced) {
    if (source === void 0)
      return;
    if (name in source || isForced) {
      const original = source[name];
      const wrapped = replacement(original);
      if (typeof wrapped === "function") {
        source[name] = wrapped;
      }
    }
  }
  function formatDecimal(num, decimal) {
    if (!num) {
      return num;
    }
    let str = num.toString();
    const index = str.indexOf(".");
    if (index !== -1) {
      str = str.substring(0, decimal + index + 1);
    } else {
      str = str.substring(0);
    }
    return parseFloat(str);
  }
  function countBytes(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str).length;
  }
  function splitStringByBytes(str, maxBytes) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    const decoder = new TextDecoder();
    const chunks = [];
    let start = 0;
    while (start < bytes.length) {
      let end = start + maxBytes;
      while (end > start && (bytes[end] & 192) === 128) {
        end--;
      }
      chunks.push(decoder.decode(bytes.subarray(start, end)));
      start = end;
    }
    return chunks;
  }

  exports.MethodTypes = MethodTypes;
  exports.countBytes = countBytes;
  exports.formatDate = formatDate;
  exports.formatDecimal = formatDecimal;
  exports.generateUUID = generateUUID;
  exports.replaceOld = replaceOld;
  exports.sendBeacon = sendBeacon;
  exports.sendFromGet = sendFromGet;
  exports.sendFromImg = sendFromImg;
  exports.sendFromPost = sendFromPost;
  exports.splitStringByBytes = splitStringByBytes;
  exports.throttle = throttle;

}));
