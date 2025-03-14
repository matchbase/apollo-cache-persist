export default (function(_a) {
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
});
//# sourceMappingURL=onCacheWrite.js.map
