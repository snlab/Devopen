module.exports = function(options, optimist) {
  var plugins = require("./standalone")(options, optimist);

  var includes = [
    {
      packagePath: "./c9.ide.maple/maple.statics"
    }
  ];

  excludes = {};

  plugins = plugins.concat(includes).filter(function (p) {
    return !excludes[p] && !excludes[p.packagePath];
  });

  return plugins;
};

if (!module.parent) require("../server")([__filename].concat(process.argv.slice(2)));
