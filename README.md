# WebProject
This is a study project of node,less,gulp and so on.  
这个项目将以node js写后端，将用less写样式，运用gulp工具构建项目,会运用到ES6。
## gulp
### gulp-load-plugins插件
1. gulp-load-plugins插件能自动加载package.json文件里的 gulp 插件,  
2. 它并不会一开始就加载所有package.json里的gulp插件，而是在我们需要用到某个插件的时候，才去加载那个插件。  
3. 要使用gulp-clone和gulp-clean-css这两个插件的时候，就可以使用plugins.clone和plugins.cleanCss来代替了,也就是原始插件名去掉gulp-前缀，之后再转换为驼峰命名。  
### gulp使用browserify
babel转es6会转成commonjs的规范，浏览器不支持commonjs，会报require is not defined，browserify和webpack都可以把require去掉，把所有的文件打包为一个文件
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
### gulp命令行（CLI）参数<这里主要讲参数标记>
gulp 只有你需要熟知的参数标记，其他所有的参数标记只在一些任务需要的时候使用。
- **基本参数标记**
    - `-v` 或 `--version` 会显示全局和项目本地所安装的 gulp 版本号
    - `--require <module path>`将会在执行之前 reqiure 一个模块。这对于一些语言编译器或者需要其他应用的情况来说来说很有用。你可以使用多个`--require`
    - `--gulpfile <gulpfile path>`手动指定一个 gulpfile 的路径，这在你有很多个 gulpfile 的时候很有用。这也会将 CWD 设置到该 gulpfile 所在目录
    - `--cwd <dir path>`手动指定 CWD。定义 gulpfile 查找的位置，此外，所有的相应的依赖（require）会从这里开始计算相对路径
    - `-T` 或 `--tasks` 会显示所指定 gulpfile 的 task 依赖树
    - `--tasks-simple` 会以纯文本的方式显示所载入的 gulpfile 中的 task 列表
    - `--color` 强制 gulp 和 gulp 插件显示颜色，即便没有颜色支持
    - `--no-color` 强制不显示颜色，即便检测到有颜色支持
    - `--silent` 禁止所有的 gulp 日志
- **Task的特定参数标记**
参考 [StackOverflow](https://stackoverflow.com/questions/23023650/is-it-possible-to-pass-a-flag-to-gulp-to-have-it-run-tasks-in-different-ways)。这里只写一种方式：
    在命令行中写：
    ```
    $ gulp buildJS --type develop
    ```
    在gulpfile.js中写：
    ```
    gulp.task('buildJS',function(cb){
        if(gulp.env.type == "develop"){
            console.log("dddddddddddddddddddddd");
        }else{
            console.log("ooooooooooooooooooo");
        }
        cb();
    });
    ```
## ES6
### es6模块化——import与export
1. es6模块化会自动把一个js文件当做一个模块，不需要再对某个js进行类似以下的封装了。(注：es6模块会自动使用严格模式，不管你是否定义)
```
;(function(){
    //your code
})();
```
改为：
```
    //your code
```
2. import存在变量提升，会把import提升到最顶上。
```
console.log(func);//此句不会报错
import {func} from './main'
console.log(func);
```
3. ES6的模块化的基本规则或特点
//import从某个js导入变量或函数时，被导入的js是会执行的，也就是说在被导入的js内函数的外部打印某个字符串或者调用某个函数是会被执行的。(且在不同的js中引用一次就会执行一次)
- 1：每一个模块只加载一次， 每一个JS只执行一次， 如果下次再去加载同目录下同文件，直接从内存中读取。 一个模块就是一个单例，或者说就是一个对象；
- 2：每一个模块内声明的变量都是局部变量， 不会污染全局作用域；
- 3：模块内部的变量或者函数可以通过export导出；
- 4：一个模块可以导入别的模块
### var、let和const
- 用let取代var。因为两者语义相同，而且let不存在副作用：let不存在变量提升，let符合变量先声明后使用的原则。
- 全局常量和线程安全。**let和const之间，优先使用const**。
    - const会提醒阅读程序的人，这个值不应该被改变，也可以防止无意间修改变量值导致的错误。
    - const比较符合函数式编程思想“运算不改变值，只新建值”。这样有利于将来的分布式运算。
    - javascript编辑器会对const进行优化，多使用const有利于提高程序的运行效率。
### 字符串编程风格优化
静态字符串一律使用单引号或反引号。动态字符串使用反引号。
## Less

