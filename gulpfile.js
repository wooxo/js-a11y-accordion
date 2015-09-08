//Config du projet ( arbo des fichiers )
/**
 * Arborescence attendue :
 * Assets /
 *   - cssDev               ( fichiers de travaux )
 *   - css                  ( code compilé )
 *   - imgDev               ( fichiers de travaux )
 *   - img                  (images optimisée )
 *   - jsDev                ( fichiers de travaux )
 *   - js                   ( code compilé )
 */

var assets = "assets/",
    /*************************************************
     *               General Config                  *
     *************************************************/
    appName = 'add-mod',
    compatibilite = "last 2 versions, >5%, ie 9",

    /*************************************************
     *               styles manipulation             *
     *************************************************/
    mainJS = appName + '.js',
    mainCSS = appName + '.css',

    paths = {
        cssDev: "./assets/cssDev/",
        cssProd: "./assets/css/",

        /*************************************************
         *               scripts manipulation            *
         *************************************************/
        jsDev: "./assets/jsDev/",
        jsProd: "./assets/js/",
        jsExport: './public/',


        /*************************************************
         *               graphic manipulation            *
         *************************************************/
        imgProd: "./assets/imgDev/",
        imgDev: "./assets/img/",

    }
    /*************************************************
     *               Gulp dependencies               *
     *************************************************/
gulp = require("gulp"),
    //******************************************* tools
    rename = require("gulp-rename"), // allow to easily rename file on output
    gutil = require("gulp-util"), // some usefull helpers
    plumber = require("gulp-plumber"), // allow errors to no longer block task when it occurs
    options = require("minimist")(process.argv.slice(2)), // allow to use argument on task
    notify = require("gulp-notify"), // nicer way to display error ( on native notifier when available, or growl )
    gzip = require('gulp-gzip'), // gzip output
    del = require("del"),

    //*************************************** CSS plugin
    cssnext = require("gulp-cssnext"),
    uncss = require("gulp-uncss"),
    cmq = require("gulp-combine-media-queries"),

    //**************************************** JS plugin
    babel = require("gulp-babel"), // JS transpiler from es6 to es5
    concat = require("gulp-concat"), //
    sourcemaps = require("gulp-sourcemaps");



gulp.task("styles", function () {
    'use strict';
    return gulp.src(paths.cssDev + mainCSS)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(cmq()) // rassemble les differentes déclaration équivalente ( permet de rassembler les differents breakpoints d'un elements en meme temps dans le fichier de travail )
        .pipe(cssnext({
            browser: compatibilite, // Configuration de la compatibilité demandé
            //compress: options.prod, // On ne compresse qu'en prod
            sourcemap: !options.prod // On génére le sourcemap sauf en prod ( références cssnext / css compilé )
        }))
        // Super important, on convertit nos streams en fichiers
        .pipe(gulp.dest(paths.cssProd));
});

gulp.task('compress', function () {
    gulp.src(paths.jsProd)
        .pipe(gzip())
        .pipe(gulp.dest(paths.jsExport));
});
// ça pourrait merdouiller avec jquery ... mais bon
gulp.task("scripts", function () {
    'use strict';
    return gulp.src(paths.jsDev + "**/*.js") // Recupération de tous les fichiers js contenu dans le repertoire/sous-repertoire jsDevPath
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(concat(mainJS)) // Concatenation dans le fichier de destination
        .pipe(babel({
            compact: options.prod // Minify quand on compile en prod
        })) // transpiler es6 -> es5
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.jsProd)); // dossier de destination
});

// Ici on a une tâche de dev qui lance un watch APRES avoir exécuté `styles` une fois
gulp.task("default", ["styles", "scripts"], function () {
    'use strict';
    gulp.watch(paths.cssDev + "**/*", ["styles"]);
    gulp.watch(paths.jsDev + "**/*", ["scripts"]);
});

gulp.task("export", function () {
    'use strict';
    gulp.src(paths.jsProd + mainJS)
        .pipe(rename(appName + '.v.dev.js'))
        .pipe(gulp.dest(paths.jsExport));

    gulp.src(paths.jsProd + mainJS)
        .pipe(babel({
            compact: true
        }))
        .pipe(rename(appName + '.v.min.js'))
        .pipe(gulp.dest(paths.jsExport));
});

gulp.task('init', function () {
    console.log(paths);
    for (path in paths) {
        gulp.src('f.txt').pipe(gulp.dest(paths[path]));
    };
});

gulp.task('clean', ['init'], function () {
    del(['./assets/**/f.txt']);
});
