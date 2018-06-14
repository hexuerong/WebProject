const gulp = require("gulp");
const browserSync = require("browser-sync").create();//调用 .create() 意味着你得到一个唯一的实例并允许您创建多个服务器或代理。
const browserify = require("browserify");//解决es6转es5后报require is not defined的问题
const glob = require("glob");//绑定任意多个文件
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const plugins = require('gulp-load-plugins')();//加载gulp-load-plugins插件，并马上运行它

const cssConfig = {
    src:[
        'project/styles/top.less',
        'project/styles/main.less',
    ],
};
const jsConfig = {

}
/**
 * 设置任务---架设静态服务器
 */
gulp.task('browser-sync-static', function (callback) {
    browserSync.init({
        files:['**'],
        server:{
            baseDir:'./',  // 设置服务器的根目录
            index:'project/views/main.html' // 指定默认打开的文件
        },
        port:8050  // 指定访问服务器的端口号
    });
    callback();//回调是为了告知任务结束
});
/**
 * 设置任务---使用代理
 */
gulp.task('browser-sync', function () {
    browserSync.init({
        // files:['**'],
        proxy:'127.0.0.1:8888', // 设置本地服务器的地址        
        // proxy:'127.0.0.1', // 设置本地服务器的地址
        // port:8888  // 设置访问的端口号
    });
});
/**
 * 压缩html
 */
gulp.task('minifyHtml', function() {
    return gulp.src('project/views/**/*.html')
        .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')}))    
        .pipe(plugins.htmlmin({collapseWhitespace: true}))
        .pipe(plugins.rename({suffix: '.min'}))   //rename压缩后的文件名        
        .pipe(gulp.dest('dist/views'));
});
/**
 * 拼接并压缩编辑好的less，并生成sourcemap文件
 */
gulp.task('concatComplieLess',function(){
    // var stream = gulp.src('project/styles/**/*.less')
    var stream = gulp.src(cssConfig.src)    
        .pipe(plugins.sourcemaps.init())        
        .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')}))
        .pipe(plugins.less())
        .pipe(plugins.concat('mainWindow.min.css'))
        .pipe(plugins.minifyCss())//兼容IE7及以下需设置compatibility属性
        .pipe(plugins.minifyCss({compatibility: 'ie7'}))
        .pipe(plugins.sourcemaps.write('../maps/styles/',{addComment:true}))
        .pipe(gulp.dest('dist/styles'));
    return stream;
});
gulp.task('watchLess',function(callback){
    gulp.watch('project/styles/**/*.less',['concatComplieLess']);
    callback();
});
/**
 * 监听less文件发生改变时，自动编译并拼接然后压缩，且架设静态服务器同步浏览器刷新
 */
gulp.task('watchLess-sync',['watchLess','browser-sync-static'],function(){
    
});
/**
 * 用babelify来转换es6使其适用于浏览器环境
 */
gulp.task('buildJS',function(cb){
    glob('project/scripts/**/*.js', {}, function(err, files) {
        files.map(function(entry){
            browserify({
                    entries:[entry],
                    debug:true//debug: true是告知Browserify在运行同时生成内联sourcemap用于调试。
                })
                .transform(babelify)//这句话很重要，有了这句话才不会报错：SyntaxError: 'import' and 'export' may appear only with 'sourceType: module'
                .bundle()
                .pipe(source(entry))// gives streaming vinyl file object
                //vinyl-buffer用于将vinyl流转化为buffered vinyl文件（gulp-sourcemaps及大部分Gulp插件都需要这种格式）。
                .pipe(buffer())//<----- convert from streaming to buffered vinyl file object
                .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')})) 
                .pipe(plugins.sourcemaps.init({loadMaps: true}))//设置loadMaps: true是为了读取上一步得到的内联sourcemap，并将其转写为一个单独的sourcemap文件。
                .pipe(plugins.rename({
                    extname: '.bundle.min.js',
                    dirname: ''
                }))
                .pipe(plugins.uglify())
                .pipe(plugins.sourcemaps.write('../maps/scripts/',{addComment: true})) 
                .pipe(gulp.dest('dist/scripts'));
        })
        cb();
    });
});
gulp.task('watchJS',function(){
    gulp.watch('project/scripts/**/*.js',['buildJS']);
});
//同时监听less和js
gulp.task('watch',function(){
    gulp.watch('project/styles/**/*.less',['concatComplieLess']);    
    gulp.watch('project/scripts/**/*.js',['buildJS']);
});