var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var less = require("gulp-less");
var cssmin = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

//gulp-load-plugins这个插件能自动帮你加载package.json文件里的 gulp 插件,
//它并不会一开始就加载所有package.json里的gulp插件，而是在我们需要用到某个插件的时候，才去加载那个插件。 
var plugins = require('gulp-load-plugins')();//加载gulp-load-plugins插件，并马上运行它
//或是：
//var gulpLoadPlugins = require('gulp-load-plugins');
//var plugins = gulpLoadPlugins();
// 要使用gulp-clone和gulp-clean-css这两个插件的时候，就可以使用plugins.clone和plugins.cleanCss来代替了,也就是原始插件名去掉gulp-前缀，之后再转换为驼峰命名。 

//当发生异常时提示错误
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat'),//拼接文件
    uglify = require('gulp-uglify'),//压缩文件
    rename = require('gulp-rename'),//重命名文件
    del = require('del');//删除文件

gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    console.log("default task is completed!");
});

//编译单个less文件
gulp.task('testLess1',function(){
    gulp.src('app/projectResource/src/mainWindow/less/main.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});
//编译多个less文件
gulp.task('testLess2',function(){
    gulp.src(['app/projectResource/src/mainWindow/less/main.less','app/projectResource/src/mainWindow/less/top.less'])//多个文件以数组形式传入
        .pipe(less())
        .pipe(gulp.dest('dist/css'));//将会在src/css下生成main.css以及top.css
});
// 匹配符“!”，“*”，“**”，“{}”
gulp.task('testLess3',function(){
    //编译src目录下的所有less文件
    //除了reset.less和test.less（**匹配src/less的0个或多个子文件夹）
    gulp.src(['app/projectResource/src/mainWindow/less/*.less','!app/projectResource/src/mainWindow/less/**/{reset,test}.less'])
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});
//编译less后压缩css
gulp.task('testLess4',function(){
    gulp.src('app/projectResource/src/mainWindow/less/main.less')
        .pipe(less())
        .pipe(cssmin())//兼容IE7及以下需设置compatibility属性
        .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest('dist/css'));
});
//当less有各种引入关系时，编译后不容易找到对应less文件，所以需要生成sourcemap文件，方便修改
gulp.task('testLess5',function(){
    gulp.src('app/projectResource/src/mainWindow/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});
//监听事件（自动编译less）
gulp.task('testWatch_1',function(){
    gulp.watch('app/projectResource/src/**/*.less',['testLess']);//当所有less文件发生改变时，调用testLess任务
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

gulp.task('minifyJsTest',function(){
    gulp.src('app/common/evol-colorpicker.js')
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(gulp.dest('dist/js'))//输出到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/js'));  //输出
});
gulp.task('clean', function(cb) {//删除文件夹里的内容
    // del(['/dist/css', '/dist/js'], cb)
    del(['dist/js/*.js'], cb);
});
gulp.task('minifyJS1', ['clean'], function() {//执行压缩前，先删除文件夹里的内容
    // gulp.start('minifyJsTest', 'minifyjs');    
    // gulp.start('minifyJsTest');
    // gulp.run('minifyJsTest');    
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