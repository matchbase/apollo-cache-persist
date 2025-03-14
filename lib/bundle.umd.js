(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = global || self),
      factory((global['apollo-cache-persist'] = {})));
})(this, function(exports) {
  'use strict';

  var Log = (function() {
    function Log(options) {
      var _a = options.debug,
        debug = _a === void 0 ? false : _a;
      this.debug = debug;
      this.lines = [];
    }
    Log.prototype.emit = function(level, message) {
      if (level in console) {
        var prefix = Log.prefix;
        console[level].apply(console, [prefix].concat(message));
      }
    };
    Log.prototype.tailLogs = function() {
      var _this = this;
      this.lines.forEach(function(_a) {
        var level = _a[0],
          message = _a[1];
        return _this.emit(level, message);
      });
    };
    Log.prototype.getLogs = function() {
      return this.lines;
    };
    Log.prototype.write = function(level, message) {
      var buffer = Log.buffer;
      this.lines = this.lines.slice(1 - buffer).concat([[level, message]]);
      if (this.debug || level !== 'log') {
        this.emit(level, message);
      }
    };
    Log.prototype.info = function() {
      var message = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        message[_i] = arguments[_i];
      }
      this.write('log', message);
    };
    Log.prototype.warn = function() {
      var message = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        message[_i] = arguments[_i];
      }
      this.write('warn', message);
    };
    Log.prototype.error = function() {
      var message = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        message[_i] = arguments[_i];
      }
      this.write('error', message);
    };
    Log.buffer = 30;
    Log.prefix = '[apollo-cache-persist]';
    return Log;
  })();

  var Cache = (function() {
    function Cache(options) {
      var cache = options.cache,
        _a = options.serialize,
        serialize = _a === void 0 ? true : _a;
      this.cache = cache;
      this.serialize = serialize;
    }
    Cache.prototype.extract = function() {
      var data = this.cache.extract();
      if (this.serialize) {
        data = JSON.stringify(data);
      }
      return data;
    };
    Cache.prototype.restore = function(data) {
      if (this.serialize && typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (data != null) {
        this.cache.restore(data);
      }
    };
    return Cache;
  })();

  var __awaiter =
    (undefined && undefined.__awaiter) ||
    function(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator['throw'](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done
            ? resolve(result.value)
            : new P(function(resolve) {
                resolve(result.value);
              }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
  var __generator =
    (undefined && undefined.__generator) ||
    function(thisArg, body) {
      var _ = {
          label: 0,
          sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
          },
          trys: [],
          ops: [],
        },
        f,
        y,
        t,
        g;
      return (
        (g = { next: verb(0), throw: verb(1), return: verb(2) }),
        typeof Symbol === 'function' &&
          (g[Symbol.iterator] = function() {
            return this;
          }),
        g
      );
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError('Generator is already executing.');
        while (_)
          try {
            if (
              ((f = 1),
              y &&
                (t =
                  op[0] & 2
                    ? y['return']
                    : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
                !(t = t.call(y, op[1])).done)
            )
              return t;
            if (((y = 0), t)) op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (
                  !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                  (op[0] === 6 || op[0] === 2)
                ) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2]) _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
  var Storage = (function() {
    function Storage(options) {
      var storage = options.storage,
        _a = options.key,
        key = _a === void 0 ? 'apollo-cache-persist' : _a;
      this.storage = storage;
      this.key = key;
    }
    Storage.prototype.read = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, this.storage.getItem(this.key)];
        });
      });
    };
    Storage.prototype.write = function(data) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, this.storage.setItem(this.key, data)];
            case 1:
              _a.sent();
              return [2];
          }
        });
      });
    };
    Storage.prototype.purge = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, this.storage.removeItem(this.key)];
            case 1:
              _a.sent();
              return [2];
          }
        });
      });
    };
    Storage.prototype.getSize = function() {
      return __awaiter(this, void 0, void 0, function() {
        var data;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, this.storage.getItem(this.key)];
            case 1:
              data = _a.sent();
              if (data == null) {
                return [2, 0];
              } else {
                return [2, typeof data === 'string' ? data.length : null];
              }
              return [2];
          }
        });
      });
    };
    return Storage;
  })();

  var __awaiter$1 =
    (undefined && undefined.__awaiter) ||
    function(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator['throw'](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done
            ? resolve(result.value)
            : new P(function(resolve) {
                resolve(result.value);
              }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
  var __generator$1 =
    (undefined && undefined.__generator) ||
    function(thisArg, body) {
      var _ = {
          label: 0,
          sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
          },
          trys: [],
          ops: [],
        },
        f,
        y,
        t,
        g;
      return (
        (g = { next: verb(0), throw: verb(1), return: verb(2) }),
        typeof Symbol === 'function' &&
          (g[Symbol.iterator] = function() {
            return this;
          }),
        g
      );
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError('Generator is already executing.');
        while (_)
          try {
            if (
              ((f = 1),
              y &&
                (t =
                  op[0] & 2
                    ? y['return']
                    : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
                !(t = t.call(y, op[1])).done)
            )
              return t;
            if (((y = 0), t)) op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (
                  !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                  (op[0] === 6 || op[0] === 2)
                ) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2]) _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
  var Persistor = (function() {
    function Persistor(_a, options) {
      var log = _a.log,
        cache = _a.cache,
        storage = _a.storage;
      var _b = options.maxSize,
        maxSize = _b === void 0 ? 1024 * 1024 : _b;
      this.log = log;
      this.cache = cache;
      this.storage = storage;
      this.paused = false;
      if (maxSize) {
        this.maxSize = maxSize;
      }
    }
    Persistor.prototype.persist = function() {
      return __awaiter$1(this, void 0, void 0, function() {
        var data,
          parsedData,
          _a,
          _b,
          accessToken,
          _c,
          playerId,
          _d,
          gender,
          _e,
          teamId,
          _f,
          authServerId,
          _g,
          email,
          _h,
          myLatitude,
          _j,
          myLongitude,
          _k,
          isEmailVerified,
          _l,
          refreshToken,
          _m,
          ftuWelcomeToMatchbase,
          essentialData,
          essentialJson,
          error_1;
        return __generator$1(this, function(_o) {
          switch (_o.label) {
            case 0:
              _o.trys.push([0, 6, , 7]);
              data = this.cache.extract();
              if (
                !(
                  this.maxSize != null &&
                  typeof data === 'string' &&
                  data.length > this.maxSize &&
                  !this.paused
                )
              )
                return [3, 4];
              return [4, this.purge()];
            case 1:
              _o.sent();
              parsedData = JSON.parse(data);
              (_a = parsedData.ROOT_QUERY),
                (_b = _a.accessToken),
                (accessToken = _b === void 0 ? '' : _b),
                (_c = _a.playerId),
                (playerId = _c === void 0 ? '' : _c),
                (_d = _a.gender),
                (gender = _d === void 0 ? '' : _d),
                (_e = _a.teamId),
                (teamId = _e === void 0 ? '' : _e),
                (_f = _a.authServerId),
                (authServerId = _f === void 0 ? '' : _f),
                (_g = _a.email),
                (email = _g === void 0 ? '' : _g),
                (_h = _a.myLatitude),
                (myLatitude = _h === void 0 ? 0.0 : _h),
                (_j = _a.myLongitude),
                (myLongitude = _j === void 0 ? 0.0 : _j),
                (_k = _a.isEmailVerified),
                (isEmailVerified = _k === void 0 ? false : _k),
                (_l = _a.refreshToken),
                (refreshToken = _l === void 0 ? null : _l),
                (_m = _a.ftuWelcomeToMatchbase),
                (ftuWelcomeToMatchbase = _m === void 0 ? false : _m);
              essentialData = {
                ROOT_QUERY: {
                  accessToken: accessToken,
                  playerId: playerId,
                  gender: gender,
                  teamId: teamId,
                  authServerId: authServerId,
                  email: email,
                  myLatitude: myLatitude,
                  myLongitude: myLongitude,
                  isEmailVerified: isEmailVerified,
                  refreshToken: refreshToken,
                  ftuWelcomeToMatchbase: ftuWelcomeToMatchbase,
                },
              };
              essentialJson = JSON.stringify(essentialData);
              return [4, this.storage.write(essentialJson)];
            case 2:
              _o.sent();
              return [4, this.cache.restore(essentialJson)];
            case 3:
              _o.sent();
              this.paused = true;
              return [2];
            case 4:
              if (this.paused) {
                this.paused = false;
              }
              return [4, this.storage.write(data)];
            case 5:
              _o.sent();
              this.log.info(
                typeof data === 'string'
                  ? 'Persisted cache of size ' + data.length + ' characters'
                  : 'Persisted cache',
              );
              return [3, 7];
            case 6:
              error_1 = _o.sent();
              this.log.error('Error persisting cache', error_1);
              throw error_1;
            case 7:
              return [2];
          }
        });
      });
    };
    Persistor.prototype.restore = function() {
      return __awaiter$1(this, void 0, void 0, function() {
        var data, error_2;
        return __generator$1(this, function(_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              return [4, this.storage.read()];
            case 1:
              data = _a.sent();
              if (!(data != null)) return [3, 3];
              return [4, this.cache.restore(data)];
            case 2:
              _a.sent();
              this.log.info(
                typeof data === 'string'
                  ? 'Restored cache of size ' + data.length + ' characters'
                  : 'Restored cache',
              );
              return [3, 4];
            case 3:
              this.log.info('No stored cache to restore');
              _a.label = 4;
            case 4:
              return [3, 6];
            case 5:
              error_2 = _a.sent();
              this.log.error('Error restoring cache', error_2);
              throw error_2;
            case 6:
              return [2];
          }
        });
      });
    };
    Persistor.prototype.purge = function() {
      return __awaiter$1(this, void 0, void 0, function() {
        var error_3;
        return __generator$1(this, function(_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [4, this.storage.purge()];
            case 1:
              _a.sent();
              this.log.info('Purged cache storage');
              return [3, 3];
            case 2:
              error_3 = _a.sent();
              this.log.error('Error purging cache storage', error_3);
              throw error_3;
            case 3:
              return [2];
          }
        });
      });
    };
    return Persistor;
  })();

  var onCacheWrite = function(_a) {
    var cache = _a.cache;
    return function(persist) {
      var write = cache.write;
      cache.write = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        write.apply(cache, args);
        persist();
      };
      return function() {
        cache.write = write;
      };
    };
  };

  var onAppBackground = function(_a) {
    var log = _a.log,
      cache = _a.cache;
    return function(persist) {
      log.warn(
        'Trigger option `background` not available on web; using `write` trigger',
      );
      return onCacheWrite({ cache: cache })(persist);
    };
  };

  var Trigger = (function() {
    function Trigger(_a, options) {
      var _this = this;
      var log = _a.log,
        persistor = _a.persistor;
      this.fire = function() {
        if (!_this.debounce) {
          _this.persist();
          return;
        }
        if (_this.timeout != null) {
          clearTimeout(_this.timeout);
        }
        _this.timeout = setTimeout(_this.persist, _this.debounce);
      };
      this.persist = function() {
        if (_this.paused) {
          return;
        }
        _this.persistor.persist();
      };
      var defaultDebounce = Trigger.defaultDebounce;
      var cache = options.cache,
        debounce = options.debounce,
        _b = options.trigger,
        trigger = _b === void 0 ? 'write' : _b;
      if (!trigger) {
        return;
      }
      this.debounce = debounce != null ? debounce : defaultDebounce;
      this.persistor = persistor;
      this.paused = false;
      switch (trigger) {
        case 'write':
          this.uninstall = onCacheWrite({ cache: cache })(this.fire);
          break;
        case 'background':
          if (debounce) {
            log.warn('Debounce is not recommended with `background` trigger');
          }
          this.debounce = debounce;
          this.uninstall = onAppBackground({ cache: cache, log: log })(
            this.fire,
          );
          break;
        default:
          if (typeof trigger === 'function') {
            this.uninstall = trigger(this.fire);
          } else {
            throw Error('Unrecognized trigger option: ' + trigger);
          }
      }
    }
    Trigger.prototype.pause = function() {
      this.paused = true;
    };
    Trigger.prototype.resume = function() {
      this.paused = false;
    };
    Trigger.prototype.remove = function() {
      if (this.uninstall) {
        this.uninstall();
        this.uninstall = null;
        this.paused = true;
      }
    };
    Trigger.defaultDebounce = 1000;
    return Trigger;
  })();

  var CachePersistor = (function() {
    function CachePersistor(options) {
      if (!options.cache) {
        throw new Error(
          'In order to persist your Apollo Cache, you need to pass in a cache. ' +
            'Please see https://www.apollographql.com/docs/react/basics/caching.html for our default InMemoryCache.',
        );
      }
      if (!options.storage) {
        throw new Error(
          'In order to persist your Apollo Cache, you need to pass in an underlying storage provider. ' +
            'Please see https://github.com/apollographql/apollo-cache-persist#storage-providers',
        );
      }
      var log = new Log(options);
      var cache = new Cache(options);
      var storage = new Storage(options);
      var persistor = new Persistor(
        { log: log, cache: cache, storage: storage },
        options,
      );
      var trigger = new Trigger({ log: log, persistor: persistor }, options);
      this.log = log;
      this.cache = cache;
      this.storage = storage;
      this.persistor = persistor;
      this.trigger = trigger;
    }
    CachePersistor.prototype.persist = function() {
      return this.persistor.persist();
    };
    CachePersistor.prototype.restore = function() {
      return this.persistor.restore();
    };
    CachePersistor.prototype.purge = function() {
      return this.persistor.purge();
    };
    CachePersistor.prototype.pause = function() {
      this.trigger.pause();
    };
    CachePersistor.prototype.resume = function() {
      this.trigger.resume();
    };
    CachePersistor.prototype.remove = function() {
      this.trigger.remove();
    };
    CachePersistor.prototype.getLogs = function(print) {
      if (print === void 0) {
        print = false;
      }
      if (print) {
        this.log.tailLogs();
      } else {
        return this.log.getLogs();
      }
    };
    CachePersistor.prototype.getSize = function() {
      return this.storage.getSize();
    };
    return CachePersistor;
  })();

  var persistCache = function(options) {
    var persistor = new CachePersistor(options);
    return persistor.restore();
  };

  exports.CachePersistor = CachePersistor;
  exports.persistCache = persistCache;

  Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=bundle.umd.js.map
