/*
 * @Author: hexuerong 
 * @Date: 2018-06-22 23:36:53 
 * @Last Modified by: hexuerong
 * @Last Modified time: 2018-06-23 00:36:41
 */
;(function($){
    "use strict" //使用js严格模式检查，使语法更规范
    // 默认参数
    var _options  = {

    };
    // 在用户调用插件时将API暴露给用户
    var api = {
        config: function (ops) {
            //没有参数传入，直接返回默认参数
            if(!opts) return options;
            //有参数传入，通过key将options的值更新为用户的值
            for(var key in opts) {
                options[key] = opts[key];
            }
            return this;//返回this实现插件的链式调用
        },
        listen: function listen(elem) {
            //这里通过typeof设置监听的元素需为字符串调用，实际可根据需要进行更改
            if (typeof elem === 'string') {
                //这里使用ES5的querySelectorAll方法获取dom元素
                var elems = document.querySelectorAll(elem),
                    i = elems.length;
                    //通过递归将listen方法应用在所有的dom元素上
                    while (i--) {
                        listen(elems[i]);
                    }
                    return
            }
            //在这里，你可以将插件的部分功能函数写在这里

            
            return this;//返回this实现插件的链式调用
        },
        add: function(n1,n2){ return n1 + n2; },//加
        sub: function(n1,n2){ return n1 - n2; },//减
        mul: function(n1,n2){ return n1 * n2; },//乘
        div: function(n1,n2){ return n1 / n2; },//除
        sur: function(n1,n2){ return n1 % n2; } //余
    };
    $.fn.pluginResize = function(){  
        var method = arguments[0];  
        if(methods[method]) {  
            method = methods[method];  
            //将含有length属性的数组获取从第下标为1的之后的数组元素，并返回数组  
            arguments = Array.prototype.slice.call(arguments,1);  
        }else if( typeof(method) == 'object' || !method ){  
            method = methods.init;  
        }else{  
            $.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );  
            return this;  
        }  
        //jquery的实例对象将拥有执行method的能力，method的this是指jquery的实例对象  
        return method.apply(this,arguments);  
    } 
    
    /* var _global;
    var plugin = {
        add: function(n1,n2){ return n1 + n2; },//加
        sub: function(n1,n2){ return n1 - n2; },//减
        mul: function(n1,n2){ return n1 * n2; },//乘
        div: function(n1,n2){ return n1 / n2; },//除
        sur: function(n1,n2){ return n1 % n2; } //余
    } */
    // 最后将插件对象暴露给全局对象
    /* _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = plugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return plugin;});
    } else {
        !('plugin' in _global) && (_global.plugin = plugin);
    } */
}(jQuery));

var dragMinWidth=300;
var dragMinHeight=300;
var oDrag=document.querySelector('.drag');
var oTitle=document.querySelector('.drag .title');

var resizeL=document.querySelector('.resizeL');
var resizeB=document.querySelector('.resizeB');
var resizeR=document.querySelector('.resizeR');
var resizeT=document.querySelector('.resizeT');
var resizeLT=document.querySelector('.resizeLT');
var resizeLB=document.querySelector('.resizeLB');
var resizeRT=document.querySelector('.resizeRT');
var resizeRB=document.querySelector('.resizeRB');



//拖拉函数
function drag(oDrag,handle){
    var disX=disY=0;
    handle=handle||oDrag;
    handle.style.cursor='move';

    handle.onmousedown=function(e){
        e=e||event;
        e.preventDefault();
        disX=e.clientX-oDrag.offsetLeft;
        disY=e.clientY-oDrag.offsetTop;
        document.onmousemove=function(e){
            e=e||event;
            var Left=e.clientX-disX;
            var Top=e.clientY-disY;
            var maxleft=document.documentElement.offsetWidth-oDrag.offsetWidth;
            var maxtop=document.documentElement.clientHeight-oDrag.offsetHeight;
            if (Left<0) {
                Left=0;
            }else if (Left>maxleft) {
                Left=maxleft;
            };
            if (Top<0) {
                Top=0;
            }else if (Top>maxtop) {
                Top=maxtop;
            };
            oDrag.style.left=Left+'px';
            oDrag.style.top=Top+'px';
        };
        document.onmouseup=function(){
            document.onmousemove=null;
            document.onmouseup=null;
        };
    };
};

//改变大小函数
function resize(oparent,handle,isleft,istop,lookx,looky){
    var disX=disY=0;
    handle=handle||oDrag;

    handle.onmousedown=function(e){
        e=e||event;
        e.preventDefault();
        disX=e.clientX-this.offsetLeft;
        disY=e.clientY-this.offsetTop;
        var iparenttop=oparent.offsetTop;
        var iparentleft=oparent.offsetLeft;
        var iparentwidth=oparent.offsetWidth;
        var iparentheight=oparent.offsetHeight;

        document.onmousemove=function(e){
            e=e||event;
            var iL=e.clientX-disX;
            var iT=e.clientY-disY;
            var maxw=document.documentElement.clientWidth-oparent.offsetLeft-2;
            var maxh=document.documentElement.clientHeight-oparent.offsetTop-2;
            var iw= isleft?iparentwidth-iL:handle.offsetWidth+iL;
            var ih = istop ? iparentheight - iT : handle.offsetHeight + iT;
            if (isleft) {
                oparent.style.left=iparentleft+iL+'px';
            };
            if (istop) {
                oparent.style.top=iparenttop+iT+'px';
            };
            if (iw<dragMinWidth) {
                iw=dragMinWidth
            }else if (iw>maxw) {
                iw=maxw;
            };
            if (lookx) {
                oparent.style.width=iw+'px';
            };
            if (ih<dragMinHeight) {
                ih=dragMinHeight;
            }else if (ih>maxh) {
                ih=maxh;
            };
            if (looky) {
                oparent.style.height=ih+'px';
            };
            if ((isleft && iw==dragMinWidth)||(istop && ih==dragMinHeight)) {
                document.onmousemove=null;
            };
            return false;
        };
        document.onmouseup=function(){
            document.onmousemove=null;
            document.onmouseup=null;
        };
    };
};

//调用
(function(){
    drag(oDrag,oTitle);
    //四边变大
    resize(oDrag,resizeB,false,false,false,true);
    resize(oDrag,resizeR,false,false,true,false);
    resize(oDrag,resizeT,false,true,false,true);
    resize(oDrag,resizeL,true,false,true,false);

    //四角变大
    resize(oDrag,resizeRB,false,false,true,true);
    resize(oDrag,resizeRT,false,true,true,true);
    resize(oDrag,resizeLT,true,true,true,true);
    resize(oDrag,resizeLB,true,false,true,true);

})();