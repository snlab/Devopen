var join = require("path").join;
var fs = require("fs");

function readRunners(base, path) {
  var results = {};
  var runnersPath = base + "/" + path + "/";
  fs.readdirSync(runnersPath).forEach(function (name) {
    var runner = fs.readFileSync(runnersPath + name, "utf8");
    try {
      // handle symlinks on windows
      if (/^..\//.test(runner))
        runner = fs.readFileSync(runnersPath + runner.trim(), "utf8");
      var json = JSON.parse(runner.replace(/(^|\n)\s*\/\/.*$/mg, ""));
      json.caption = name.replace(/\.run$/, "");
      json.$builtin = true;
      results[json.caption] = json;
    } catch (e) {
      console.error("Syntax error in runner", runnersPath + name, e);
    }
  });
  return results;
}

module.exports = function(options) {
  options.collab = false;
  var config = require("./client-default")(options);
  return module.exports.makeLocal(config, options);
};

module.exports.makeLocal = function(config, options) {

  // Add maple runner
  var extRunners = readRunners(__dirname + "/../plugins/c9.ide.maple", "runners");
  for (var name in extRunners) {
    options.runners[name] = extRunners[name];
  }

  // Add local modules
  var includes = [
    {
      packagePath: "plugins/c9.ide.maple/maple",
      staticPrefix: options.staticPrefix + "/plugins/c9.ide.maple"
    }, {
      packagePath: "plugins/c9.ide.maple/maple.manager",
      options: options
    }, {
      packagePath: "plugins/c9.ide.maple/magellan",
      options: options
    }, {
      packagePath: "plugins/c9.ide.maple/panelMininet",
      staticPrefix: options.staticPrefix
    }, {
      packagePath: "plugins/c9.ide.maple/panelNetwork",
      options: options
    }, {
      packagePath: "plugins/c9.ide.maple/panelTracetree",
      options: options
    }
  ].filter(Boolean);

  excludes = {};

  config = config.concat(includes).filter(function (p) {
    return !excludes[p] && !excludes[p.packagePath];
  });

  return config;
};
