gulp-cmd-transit
====================

Base on [gulp-seajs-transport](https://github.com/guilipan/gulp-seajs-transport)

## Install

```
$ npm install --save-dev gulp-cmd-transit

```

## Usage

```
var transport = require("gulp-cmd-transit");
var gulp = require("gulp");

gulp.task("default",function(){
  gulp.src("./testfiles/**/*.js")
        .pipe(transport({
        	dealIdCallback: function(id){
                // codes for id
                return id;
            }
        }))
        .pipe(gulp.dest("./dist"));
})  

```
MIT
