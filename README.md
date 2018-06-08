# WebProject
This is a study project of node,less,gulp and so on.  
这个项目将以node js写后端，将用less写样式，运用gulp工具构建项目,会运用到ES6。
## gulp-load-plugins插件
1. gulp-load-plugins插件能自动加载package.json文件里的 gulp 插件,  
2. 它并不会一开始就加载所有package.json里的gulp插件，而是在我们需要用到某个插件的时候，才去加载那个插件。  
3. 要使用gulp-clone和gulp-clean-css这两个插件的时候，就可以使用plugins.clone和plugins.cleanCss来代替了,也就是原始插件名去掉gulp-前缀，之后再转换为驼峰命名。  
## gulp使用browserify
**要点：Stream 转换（把常规流转转成 vinyl 对象流）**  
  
***Babel*** - converts ES6 code to ES5 - however it doesn't handle imports.
***Browserify*** - crawls your code for dependencies and packages them up into one file. can have plugins.
***Babelify*** - a babel plugin for browserify, to make browserify
1. **vinyl-source-stream + vinyl-buffer** 
   - vinyl-source-stream: 将常规流转换为包含 Stream 的 vinyl 对象；  
   - vinyl-buffer: 将 vinyl 对象内容中的 Stream 转换为 Buffer。（其中，vinyl-buffer 这一步可以使用 gulp-stream 或者 gulp-streamify 替代，解决插件不支持 stream 的问题。）
2. 多文件操作  
   把多个文件添加到 browserify 中，可以借助 node-glob 这个模块实现
3. 使用 Watchify 提高速度
```
    var watchify = require('watchify');
    var browserify = require('browserify');
    var gulp = require('gulp');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var gutil = require('gulp-util');
    var uglify = require('gulp-uglify');

    // add custom browserify options here
    var b = watchify(browserify(assign({}, watchify.args, {
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    entries: ['./src/index.js']
    }))); 

    // add transformations here
    // i.e. b.transform(coffeeify);

    gulp.task('browserify', bundle); 
    b.on('update', bundle); // on any dep update, runs the bundler
    b.on('log', gutil.log); // output build logs to terminal

    function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
    }
```
4. **Babelify**
```
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
```
## test