const gulp = require("gulp");
const tasks = require("@steveush/gulp-tasks");
const pkg = require("./package.json");
const raw = require("./gulpfile.config.js");

// get the compiled config
const config = tasks.packagify(raw, pkg);

// register all tasks
tasks.registerAll(gulp, config);

// the default task executed when you just run `gulp` on the command line
gulp.task("default", gulp.series( "clean", "copy", gulp.parallel( "scss", "scripts", "images", "blocks" )));

// builds the assets and then watches for changes
gulp.task("develop", gulp.series( "default", "watch" ));

// builds the assets and then packages the plugin for deployment
gulp.task("compile", gulp.series( "default", "translate", "zip" ));