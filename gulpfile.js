import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browser, { reload } from "browser-sync";
import htmlmin from "gulp-htmlmin";
import csso from "postcss-csso";
import rename from "gulp-rename";
import terser from "gulp-terser";
import squoosh from "gulp-libsquoosh";
import webp from "gulp-webp";
import svgsprite from "gulp-svgstore";
import { deleteAsync } from "del";

// Styles

export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

//HTML

export const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

//Scripts

export const scripts = () => {
  return gulp
    .src("source/js/scripts.js")
    .pipe(terser())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest("build/js"));
};

// Images

export const optimazeImages = () => {
  return gulp
    .src("source/img/**/*.{jpg,png,svg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"));
};

// Copy Images

export const copyImages = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}").pipe(gulp.dest("build/img"));
};

// WebP

export const createWebp = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
};

// SVG sprites

export const sprite = () => {
  return gulp
    .src("source/img/icon/*.svg")
    .pipe(svgsprite({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

//Copy all

export const copyContent = (done) => {
  gulp
    .src(
      [
        "source/fonts/*.{woff2,woff}",
        "source/*.ico",
        "source/img/**/*.svg",
        "source/img/icons/*.svg",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};

// Clean

export const clean = () => {
  return deleteAsync("build");
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html").on("change", gulp.series(html, browser.reload));
};

// Build
export const build = gulp.series(
  clean,
  copyContent,
  optimazeImages,
  gulp.parallel(styles, html, scripts, sprite, createWebp)
);

export default gulp.series(
  clean,
  copyContent,
  copyImages,
  gulp.parallel(styles, html, scripts, sprite, createWebp),
  gulp.series(server, watcher)
);
