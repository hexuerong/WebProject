var gulp = require("gulp");
var browserSync = require("browser-sync");
// var less = require("less");

gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    console.log("default task is completed!");
});
gulp.task("task1",function(){
    console.log("task1 is completed!");
});

// 设置任务---架设静态服务器
/* gulp.task('browser-sync', function () {
    browserSync.init({
        files:['**'],
        server:{
            baseDir:'./',  // 设置服务器的根目录
            index:'app/projectResource/src/mainWindow/main.html' // 指定默认打开的文件
        },
        port:8050  // 指定访问服务器的端口号
    });
}); */
// 设置任务---使用代理
gulp.task('browser-sync', function () {
    browserSync.init({
        // files:['**'],
        proxy:'127.0.0.1:8888', // 设置本地服务器的地址        
        // proxy:'127.0.0.1', // 设置本地服务器的地址
        // port:8888  // 设置访问的端口号
    });
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