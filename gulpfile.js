const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fs = require('fs');
const path = require('path');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');

// SCSS → CSS
function compileSass() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer({
			overrideBrowserslist: ['> 1%', 'last 2 versions']
		})]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.stream());
}

function optimizeImages() {
	return gulp.src('src/images/**/*.{jpg,jpeg,png,svg,gif,webp}')
		.pipe(imagemin([
			imagemin.mozjpeg({
				quality: 75,
				progressive: true
			}),
			imagemin.optipng({
				optimizationLevel: 5
			}),
			imagemin.svgo({
				plugins: [{
						removeViewBox: false
					},
					{
						cleanupIDs: false
					}
				]
			})
		]))
		.pipe(gulp.dest('dist/images'));
}

// SCSS削除 → 対応するCSS削除
function watchFiles() {
	gulp.watch('src/scss/**/*.scss', compileSass)
		.on('unlink', function (filepath) {
			const filePathFromSrc = path.relative(path.resolve('src/scss'), filepath);
			const destFile = path.resolve('src/css', filePathFromSrc.replace(/\.scss$/, '.css'));
			const mapFile = destFile + '.map';

			[destFile, mapFile].forEach(file => {
				if (fs.existsSync(file)) {
					fs.unlink(file, (err) => {
						if (err) console.error(`削除失敗: ${file}`, err);
						else console.log(`削除完了: ${file}`);
					});
				}
			});
		});

	gulp.watch('./*.html').on('change', browserSync.reload);
}

// サーバー起動
function serve() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});

	watchFiles();
}

exports.default = gulp.series(compileSass, serve);
exports.images = optimizeImages;