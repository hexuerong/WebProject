var gulp = require("gulp");
var browserSync = require("browser-sync").create();//调用 .create() 意味着你得到一个唯一的实例并允许您创建多个服务器或代理。
var del = require('del');//删除文件
//gulp-load-plugins插件能自动加载package.json文件里的 gulp 插件,
//它并不会一开始就加载所有package.json里的gulp插件，而是在我们需要用到某个插件的时候，才去加载那个插件。 
var plugins = require('gulp-load-plugins')();//加载gulp-load-plugins插件，并马上运行它
// 要使用gulp-clone和gulp-clean-css这两个插件的时候，就可以使用plugins.clone和plugins.cleanCss来代替了,也就是原始插件名去掉gulp-前缀，之后再转换为驼峰命名。 

const cssConfig = {

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
 * 压缩单个js
 */
gulp.task('minifyJsTest',function(){
    gulp.src('project/scripts/main.js')
        .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')}))
        // .pipe(gulp.dest('dist/scripts'))//输出到文件夹
        .pipe(plugins.rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(plugins.uglify())    //压缩js
        .pipe(gulp.dest('dist/scripts'));  //输出
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
 * 编译less
 */
gulp.task('complieLess',function(callback){//编译所有的less
    var stream = gulp.src('project/styles/**/*.less')
        .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')}))
        .pipe(plugins.less())
        .pipe(gulp.dest('dist/styles'));
    // callback();//返回一个stream或者执行一个回调来通知此任务已经结束
    return stream;
});
/* gulp.task('cleanCss', function(callback) {//删除文件夹里的内容
    del(['dist/styles/mainWindow.min.css'], callback);
}); */
/**
 * 合并所有的css并压缩
 */
gulp.task('concatCss',['complieLess'],function(){//定义一个依赖，complieLess必须在concatCss执行前完成
    // var stream = gulp.src('dist/css/**/*.css')
    //保证一个先后顺序
    var stream = gulp.src(['dist/styles/top.css','dist/styles/main.css'])    
        .pipe(plugins.concat('mainWindow.min.css'))
        .pipe(plugins.minifyCss())//兼容IE7及以下需设置compatibility属性
        .pipe(plugins.minifyCss({compatibility: 'ie7'}))
        .pipe(gulp.dest('dist/styles'));
    return stream;
});
/**
 * 监听less文件发生改变时，自动编译并拼接然后压缩
 */
gulp.task('watchLess',function(callback){
    //由于里面的任务会异步地执行，并不知道哪个任务先结束，有三种解决方式：
    //1.回调函数；2.返回流；3.返回一个promise
    gulp.watch('project/styles/**/*.less',['complieLess','concatCss']);
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
        .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')}))    
        .pipe(plugins.babel())
        .pipe(gulp.dest('dist/scripts'));
    return stream;
});
/**
 * 监听es6文件变化，转换为es5
 */
gulp.task('watchES6',function(){
    gulp.watch('project/scripts/**/*.js',['toes5']);
});