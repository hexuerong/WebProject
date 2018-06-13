var gulp = require("gulp");
var browserSync = require("browser-sync").create();//调用 .create() 意味着你得到一个唯一的实例并允许您创建多个服务器或代理。
var browserify = require("browserify");//解决es6转es5后报require is not defined的问题
var glob = require("glob");//绑定任意多个文件
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var plugins = require('gulp-load-plugins')();//加载gulp-load-plugins插件，并马上运行它

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
 * es转换为es5
 */
gulp.task('toes5',function(){
    var stream = gulp.src('project/scripts/**/*.js')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')}))    
        .pipe(plugins.babel())
        /* .pipe(plugins.babel({
            presets: ['es2015'],
            minified: true   // 是否压缩
            // comments: false  // 是否保留注释
        })) */
        .pipe(plugins.rename({suffix: '.min'}))   //rename压缩后的文件名   
        //需要sourcemaps的不能使用这个压缩，使用这个压缩会把sourcemaps加在文件最后一行的注释删除掉，导致sourcemaps不起作用     
        .pipe(plugins.uglify())    //压缩js
        // addComment : true / false ; 是控制处理后的文件，尾部是否显示关于sourcemaps信息的注释。配上此参数，可以使用uglify压缩
        .pipe(plugins.sourcemaps.write('',{addComment: true}))
        .pipe(gulp.dest('dist/scripts'));
    return stream;
});
/**
 * 监听es6文件变化，转换为es5(不能实现es6的import和export在浏览器环境运行)
 */
gulp.task('watchES6',function(){
    gulp.watch('project/scripts/**/*.js',['toes5']);
});
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