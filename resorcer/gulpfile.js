let main_folder = "dist";
let source_folder = "app";
let icons_folder = "icons/*.svg";

let path = {
    build: {
        html: main_folder + "/",
        css: main_folder + "/css/",
        js: main_folder + "/js/",
        img: main_folder + "/img/",
        fonts: main_folder + "/fonts/"
    },
    app: {
        html: source_folder + "/",
        twig: source_folder + "/twig/templates/*.twig",
        scss: source_folder + "/scss/style.scss",
        js: source_folder + "/js/common.js",
        libs: source_folder + "/libs/**/*",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp,json}",
        fonts: source_folder + "/fonts/",
        fonts_ttf: source_folder + "/fonts/*.ttf",
        fonts_transfer: source_folder + "/fonts/**/*",
        icons_template: source_folder + "/scss/libraries/_iconfont-template.scss",
        icons_target: source_folder + "/scss/libraries/_iconfont.scss",
        icons_dest: source_folder + "/fonts/iconfont/"
    },
    watch: {
        twig: source_folder + "/twig/**/*.twig",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + main_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    twig = require('gulp-twig'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    ttf2eot = require('gulp-ttf2eot'),
    del = require('del'),
    icon_font = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    htmlbeautify = require('gulp-html-beautify'),
    removeEmptyLines = require('gulp-remove-empty-lines');

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + main_folder + "/"
        },
        notify: false
    })
}

function compileTwig() {
    return src(path.app.twig)
        .pipe(twig())
        // .pipe(webphtml())
        .pipe(htmlbeautify({
            indentSize: 4
        }))
        .pipe(removeEmptyLines())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.app.scss)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(group_media())
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src([path.app.libs, path.app.js])
        .pipe(concat('common.js'))
        // .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.app.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.app.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],main_folder,
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts() {
    src(path.app.fonts_ttf)
        .pipe(ttf2woff())
        .pipe(dest(path.app.fonts))
    return (path.app.fonts_ttf)
        .pipe(ttf2woff2())
        .pipe(dest(path.app.fonts))
    // return src(path.app.fonts_ttf)
    //     .pipe(ttf2eot())
    //     .pipe(dest(path.app.fonts))
}

function transferFonts() {
    return src(path.app.fonts_transfer)
        .pipe(dest(path.build.fonts))
}

function iconfont() {
    return src(icons_folder)
        .pipe(iconfontCss({
            fontName: 'iconfont',
            path: path.app.icons_template,
            targetPath: '../../../' + path.app.icons_target,
            fontPath: '../fonts/iconfont/'
        }))
        .pipe(icon_font({
            prependUnicode: true,
            formats: ['eot', 'woff', 'woff2'],
            fontName: 'iconfont',
            normalize: true,
            fontHeight: 1001
        }))
        .pipe(dest(path.app.icons_dest))
}

function watchFiles() {
    gulp.watch([path.watch.twig], compileTwig);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean() {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, compileTwig, images, transferFonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.compileTwig = compileTwig;
exports.images = images;
exports.fonts = fonts;
exports.css = css;
exports.js = js;
exports.iconfont = iconfont;
exports.transferFonts = transferFonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;
