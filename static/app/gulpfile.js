var fs = require('fs');
var gulp = require('gulp');

gulp.task('default', function(cb){
    fs.appendFileSync('dist/lib.client.js', 'window.libclient = libclient;window.process = { env: {} }');
});