

(function () {

  const Module = {
    name: '_do',
    version: '1.0',
    dependencies: {
      _: { name: 'lodash' },
      _is: { name: '_is' },
      _CONST: { name: '_CONST' },
    },
    factory: function (di) {
      const _ = di._;

      const _do = {
        randomPassword: function randomPassword() {
          const chars = [
            _.random(65, 90), // A-Z
            _.random(35, 126), // random
            _.random(35, 38), // special
            _.random(97, 122), // a-z
            _.random(48, 57), // 0 - 9
          ];

          const length = Math.ceil(8 + Math.random() * 42);

          for (let i = chars.length; i < length; i++) {
            chars.push(_.random(35, 126));
          }

          let pass = chars.map(char => String.fromCharCode(char)).join('');

          if (di._is.strongPassword(pass)) { return pass }
          else { return _do.randomPassword() }
        },
        date: {
          cast: (val) => {
            if (val instanceof Date) { return val }
            if (typeof val === 'number' || typeof val === 'string') {
              val = new Date(val);
            }
            if (Number.isNaN(val)) { throw new TypeError('Invalid date ', val) }
            return val;
          },
          min: function (date1, date2) {
            date1 = _do.date.cast(date1);
            date2 = _do.date.cast(date2);

            return date1 < date2 ? date1 : date2;
          },
          max: function (date1, date2) {
            date1 = _do.date.cast(date1);
            date2 = _do.date.cast(date2);

            return date1 > date2 ? date1 : date2;
          }
        },
        Compile(matchingPattern) {
          return function compile(template, data) {
            if (!(data && typeof data === 'object')) {
              return template;
            }
            let result = template.toString ? template.toString() : '';
            result = result.replace(matchingPattern, function (matcher) {
              var path = matcher.slice(1, -1).trim();
              return data[path];
            });
            return result;
          }
        },
        delay(ms) {
          return new Promise(resolve => {
            if (ms > 0) {
              setTimeout(resolve, ms);
            }
            return resolve();
          })
        },
        Filter: {
          /**
           * check and set filter is_deleted
           * @note mutate filter
           * 
           * @example 
           * 
           * is_deleted: undefined => is_deleted: false,
           * is_deleted: true      => is_deleted: true,
           * is_deleted: '*'       => is_deleted: undefined
           */
          isDeleted({ filter, field = 'is_deleted' }) {
            const { _CONST } = di;

            if (!(filter && typeof filter === 'object')) {
              return filter;
            }
            if (filter[field] === undefined) {
              filter[field] = false;
            }
            else if (filter[field] === _CONST.IS.ALL) {
              delete filter[field];
            }
            return filter;
          }
        },
        /**
         * Join list strings
         * @param {string[]} strings list strings will be joined
         *
         * @return {string} joined string
         *
         * @example
         * joinS([null, 'xxx']) => 'xxx'
         * joinS([null, undefined]) => ''
         */
        joinS(strings, delimiter = ' ', deniedValues = [null, undefined, '']) {
          let validStrings = [];
          if (Array.isArray(strings)) {
            strings.forEach(s => {
              if (!deniedValues.includes(s)) {
                validStrings.push(s);
              }
            });
          }
          return validStrings.join(delimiter);
        },
        splitS({ val, delimiter = ',', deniedValues = [''], isTrim = true }) {
          let tokens = [];

          if (!di._is.filledString(val)) {
            return tokens;
          }

          let raw_tokens = val.split(delimiter);

          if (isTrim) {
            raw_tokens = raw_tokens.map(token => token.trim());
          }

          tokens = raw_tokens.filter(token => !deniedValues.includes(token));

          return tokens;
        },
        getSrcFromIframe({ iframe }) {
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(iframe, "text/xml");
          let iframes = xmlDoc.getElementsByTagName('iframe')
          if (iframes && iframes.length > 0) {
            return iframes[0].getAttribute('src');
          }
          return null;
        },
      };

      _do.compile = _do.Compile(/{.+?}/g);

      return _do;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    const path = require('path');

    di._ = require('lodash');
    di._is = require('./_is.lib.share.js');
    di._CONST = require('./_CONST.lib.share');

    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();