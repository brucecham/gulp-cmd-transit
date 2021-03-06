var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var through = require("through2");
var path = require("path");
var util = require("util");
var ast = require('cmd-util').ast;
var PLUGIN_NAME = 'gulp-cmd-transit';
module.exports = function (options) {

	options = options || {};

	var stream = through.obj(function (file, enc, cb) {


		if (!file) {

			this.emit("error", new PluginError( PLUGIN_NAME , 'Files can not be empty:' + file.path));

			return cb();

		}

		else if (file.isNull()) {

			return cb();

		}

		else if (file.isStream()) {

			this.emit("error", new PluginError( PLUGIN_NAME , 'Streaming not supported:' + file.path));

			return cb();

		}

		else if (file.isBuffer()) {

			var contents = file.contents.toString();

			transport(file);

			this.push(file);

			cb();
		}

		else {

			gutil.log(gutil.colors.cyan('warning:'), "there's something wrong with the file" + file.path);

			return cb();
		}
	})

	return stream;
	/*
	* @desc 对id进行解析过滤
	*/
	function parseId(fileRelativePath) {
		var id = fileRelativePath
			.replace(/\\/g, "/")//将windows下的反斜线转成斜线
			.replace(/^\/|\.\w+$/g, "");//去掉路径最前面的斜杠和和后缀
		
		if( options.dealIdCallback ){
			id = options.dealIdCallback( id );
		}
		return id;
	}

	function transport(file) {

		var oldAstSeaModule = ast.parseFirst(file.contents.toString())//{id: 'id', dependencies: ['a'], factory: factoryNode}

		if (!oldAstSeaModule) {

			gutil.log(gutil.colors.cyan('warning:'), "the cmd file " + file.path + " is not valid cmd format")

			return;
		}

		var newId = parseId(file.relative)

		var newAstSeaModule = {id: oldAstSeaModule.id || newId, dependencies: oldAstSeaModule.dependencies, factory: oldAstSeaModule.factory}

		var newContent = ast.modify(file.contents.toString(), newAstSeaModule)

		file.contents = new Buffer(newContent.print_to_string({beautify:true}))

	}
}