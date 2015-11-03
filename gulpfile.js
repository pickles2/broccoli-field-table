var gulp = require('gulp');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var minifyCss = require('gulp-minify-css');//CSSファイルの圧縮ツール
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var rename = require("gulp-rename");//ファイル名の置き換えを行う
var twig = require("gulp-twig");//Twigテンプレートエンジン
var browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換
var packageJson = require(__dirname+'/package.json');
var _tasks = [
	'broccoli-html-editor--table-field.js',
	'broccoli-html-editor',
	'test/main.js'
];



// broccoli.js (frontend) を処理
gulp.task("broccoli-html-editor", function() {
	gulp.src(["node_modules/broccoli-html-editor/client/dist/*"])
		.pipe(gulp.dest( './tests/testdata/htdocs/libs/' ))
	;
});


// broccoli-html-editor--table-field.js (frontend) を処理
gulp.task("broccoli-html-editor--table-field.js", function() {
	gulp.src(["src/broccoli-html-editor--table-field.js"])
		.pipe(plumber())
		.pipe(browserify({}))
		.pipe(concat('broccoli-html-editor--table-field.js'))
		.pipe(gulp.dest( './dist/' ))
		.pipe(gulp.dest( './tests/testdata/htdocs/libs/' ))
		.pipe(concat('broccoli-html-editor--table-field.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest( './dist/' ))
		.pipe(gulp.dest( './tests/testdata/htdocs/libs/' ))
	;
});


// test/main.js を処理
gulp.task("test/main.js", function() {
	gulp.src(["tests/testdata/htdocs/index_files/main.src.js"])
		.pipe(plumber())
		.pipe(browserify({}))
		.pipe(concat('main.js'))
		.pipe(gulp.dest( './tests/testdata/htdocs/index_files/' ))
	;
});

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*","libs/**/*","tests/testdata/htdocs/index_files/main.src.js"], _tasks);

	var port = packageJson.baobabConfig.defaultPort;
	var svrCtrl = require('baobab-fw').createSvrCtrl();
	svrCtrl.boot(function(){
		require('child_process').spawn('open',[svrCtrl.getUrl()]);
	});

});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
