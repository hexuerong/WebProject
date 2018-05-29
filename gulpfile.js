var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var less = require("gulp-less");
var cssmin = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
//当发生异常时提示错误
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');

gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    console.log("default task is completed!");
});
gulp.task("task1",function(){
    console.log("task1 is completed!");
});

// 设置任务---架设静态服务器
gulp.task('browser-sync-static', function () {
    browserSync.init({
        files:['**'],
        server:{
            baseDir:'./',  // 设置服务器的根目录
            index:'app/projectResource/src/mainWindow/main.html' // 指定默认打开的文件
        },
        port:8050  // 指定访问服务器的端口号
    });
});
// 设置任务---使用代理
gulp.task('browser-sync', function () {
    browserSync.init({
        // files:['**'],
        proxy:'127.0.0.1:8888', // 设置本地服务器的地址        
        // proxy:'127.0.0.1', // 设置本地服务器的地址
        // port:8888  // 设置访问的端口号
    });
});
//编译单个less文件
gulp.task('testLess1',function(){
    gulp.src('/app/projectResource/src/mainWindow/less/main.less')
        .pipe(less())
        .pipe(gulp.dest('/dist/css/'));
});
//编译多个less文件
gulp.task('testLess2',function(){
    gulp.src(['/app/projectResource/src/mainWindow/less/main.less','/app/projectResource/src/mainWindow/less/top.less'])//多个文件以数组形式传入
        .pipe(less())
        .pipe(gulp.dest('/dist/css'));//将会在src/css下生成main.css以及top.css
});
// 匹配符“!”，“*”，“**”，“{}”
gulp.task('testLess3',function(){
    //编译src目录下的所有less文件
    //除了reset.less和test.less（**匹配src/less的0个或多个子文件夹）
    gulp.src(['/app/projectResource/src/mainWindow/less/*.less','!src/less/**/{reset,test}.less'])
        .pipe(less())
        .pipe(gulp.dest('/dist/css'));
});
//编译less后压缩css
gulp.task('testLess4',function(){
    gulp.src('/app/projectResource/src/mainWindow/less/main.less')
        .pipe(less())
        .pipe(cssmin())//兼容IE7及以下需设置compatibility属性
        .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest('/dist/css'));
});
//当less有各种引入关系时，编译后不容易找到对应less文件，所以需要生成sourcemap文件，方便修改
gulp.task('testLess5',function(){
    gulp.src('/app/projectResource/src/mainWindow/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('/dist/css'));
});
//监听事件（自动编译less）
gulp.task('testWatch',function(){
    gulp.watch('/app/projectResource/src/**/*.less',['testLess']);//当所有less文件发生改变时，调用testLess任务
});
//处理出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
gulp.task('testLess6',function(){
    gulp.src('src/less/*.less')
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});
gulp.task('testWatch',function(){
    gulp.watch('src/**/*.less',['testLess6']);
});




/* // 编译 SASS & 自动注入到浏览器
gulp.task('sass', function () {
    return gulp.src('scss/styles.scss')
        .pipe(sass({includePaths: ['scss']}))
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}));
});

// 监听scss和html文件, 当文件发生变化后做些什么！
gulp.task('serve', ['sass'], function () {

    // 从这个项目的根目录启动服务器
    browserSync({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("*.html").on("change", browserSync.reload);
    //browserSync.reload进行浏览器重载，当前是创建了任务进行手动重载
}); */