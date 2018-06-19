const gulp = require("gulp");
const browserSync = require("browser-sync").create();//调用 .create() 意味着你得到一个唯一的实例并允许您创建多个服务器或代理。
const browserify = require("browserify");//解决es6转es5后报require is not defined的问题
const glob = require("glob");//绑定任意多个文件
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const plugins = require('gulp-load-plugins')();//加载gulp-load-plugins插件，并马上运行它

const develop_css = 'project/styles';//开发的css目录
const dist_css = 'dist/styles';//输出的css目录

const lessConfig = {//没有写在配置中的less会自动编译到dist下面的对应目录
    mainWindow:{
        src:[
            'project/styles/top.less',
            'project/styles/main.less',
        ],
        dist:dist_css,
        name:'mainWindow.css',//如果需要合并且重命名则有此参数，如果只是编译则不需要此参数
    }
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
    var stream = gulp.src('project/styles/**/*.less')
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
/**
 * 判断less是否需要编译和合并
 * @param {string} name 被修改的文件的相对根目录的地址（即唯一的名字）
 */
const lessComplie = function(name){
    for(let p in lessConfig){
        let pos = lessConfig[p].src.indexOf(name);
        if(lessConfig[p].src && pos >= 0){
            let current_dist;
            if(lessConfig[p].dist && lessConfig[p].dist != ''){
                current_dist = lessConfig[p].dist;
            }else{
                current_dist = dist_css;
            }
            if(lessConfig[p].name && lessConfig[p].name != ''){//如果需要合并
                gulp.src(lessConfig[p].src)
                    .pipe(plugins.sourcemaps.init())
                    .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')}))
                    .pipe(plugins.less())
                    .pipe(plugins.concat(lessConfig[p].name))
                    .pipe(plugins.minifyCss())//兼容IE7及以下需设置compatibility属性
                    .pipe(plugins.minifyCss({compatibility: 'ie7'}))
                    .pipe(plugins.rename(function(path){
                        path.basename += '.min';
                        console.log(path.basename);
                    }))
                    .pipe(plugins.sourcemaps.write('../maps/styles/',{addComment:true}))
                    .pipe(gulp.dest(current_dist));
            }else{
                gulp.src(lessConfig[p].src)
                    .pipe(plugins.sourcemaps.init())
                    .pipe(plugins.plumber({errorHandler:plugins.notify.onError('Error:<%=error.message%>')}))
                    .pipe(plugins.less())
                    .pipe(plugins.minifyCss())//兼容IE7及以下需设置compatibility属性
                    .pipe(plugins.minifyCss({compatibility: 'ie7'}))
                    .pipe(plugins.rename(function(path){
                        path.basename += '.min';
                        console.log(path.basename);
                    }))
                    .pipe(plugins.sourcemaps.write('../maps/styles/',{addComment:true}))
                    .pipe(gulp.dest(current_dist));
            }
        }
    }
}

gulp.task('watchLess',function(callback){
    gulp.watch('project/styles/**/*.less',['concatComplieLess']);
    callback();
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
    // gulp.watch('project/styles/**/*.less',['concatComplieLess']);
    gulp.watch('project/styles/**/*.less',function(event){
        // console.log(__dirname);
        // console.log(__filename);
        var name = event.path.replace(__dirname+'\\','').replace(/\\/g,'/');
        console.log('File '+event.path+' was '+event.type+',running tasks...');
        lessComplie(name);
    });    
    gulp.watch('project/scripts/**/*.js',['buildJS']);
});