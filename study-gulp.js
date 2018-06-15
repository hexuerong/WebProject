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
 * 编译less
 */
gulp.task('complieLess',function(callback){//编译所有的less
    var stream = gulp.src('project/styles/**/*.less')
        .pipe(plugins.sourcemaps.init())        
        .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')}))
        .pipe(plugins.less())
        .pipe(plugins.sourcemaps.write('',{addComment:true}))        
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
        .pipe(plugins.sourcemaps.init())    
        .pipe(plugins.concat('mainWindow.min.css'))
        .pipe(plugins.minifyCss())//兼容IE7及以下需设置compatibility属性
        .pipe(plugins.minifyCss({compatibility: 'ie7'}))
        .pipe(plugins.sourcemaps.write('',{addComment:true}))
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

gulp.task('browserify', function() {
    return browserify({
            entries: 'project/scripts/add.js',
            debug: true//debug: true是告知Browserify在运行同时生成内联sourcemap用于调试。
        })
        .transform(babelify)//这句话很重要，有了这句话才不会报错：SyntaxError: 'import' and 'export' may appear only with 'sourceType: module'
        // .on('error',gutil.log)
        .bundle()
        // .on('error',gutil.log)
        .pipe(source('bundle.js'))// gives streaming vinyl file object

        //vinyl-buffer用于将vinyl流转化为buffered vinyl文件（gulp-sourcemaps及大部分Gulp插件都需要这种格式）。
        .pipe(buffer())//要使用下面的操作，得加上这句话// <----- convert from streaming to buffered vinyl file object
        .pipe(plugins.sourcemaps.init({loadMaps: true}))//设置loadMaps: true是为了读取上一步得到的内联sourcemap，并将其转写为一个单独的sourcemap文件。
        .pipe(plugins.rename({
            extname: '.min.js',
            dirname: ''
        }))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('',{addComment: true}))     
        .pipe(gulp.dest('dist/scripts'));
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

/**
 * 监听less文件发生改变时，自动编译并拼接然后压缩，且架设静态服务器同步浏览器刷新
 */
gulp.task('watchLess-sync',['watchLess','browser-sync-static'],function(){
    
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