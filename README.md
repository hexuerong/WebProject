# WebProject
This is a study project of node,less,gulp and so on.  
这个项目将以node js写后端，将用less写样式，运用gulp工具构建项目。
## gulp-load-plugins插件
1. gulp-load-plugins插件能自动加载package.json文件里的 gulp 插件,  
2. 它并不会一开始就加载所有package.json里的gulp插件，而是在我们需要用到某个插件的时候，才去加载那个插件。  
3. 要使用gulp-clone和gulp-clean-css这两个插件的时候，就可以使用plugins.clone和plugins.cleanCss来代替了,也就是原始插件名去掉gulp-前缀，之后再转换为驼峰命名。  
## gulp使用browserify
**要点：Stream 转换（把常规流转转成 vinyl 对象流）**
1. vinyl-source-stream + vinyl-buffer
   vinyl-source-stream: 将常规流转换为包含 Stream 的 vinyl 对象；
   vinyl-buffer: 将 vinyl 对象内容中的 Stream 转换为 Buffer。（其中，vinyl-buffer 这一步可以使用 gulp-stream 或者 gulp-streamify 替代，解决插件不支持 stream 的问题。）
2. 多文件操作
   把多个文件添加到 browserify 中，可以借助 node-glob 这个模块实现
3. 使用 Watchify 提高速度
## test