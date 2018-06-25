/*
 * @Author: hexuerong 
 * @Date: 2018-06-22 23:36:53 
 * @Last Modified by: hexuerong
 * @Last Modified time: 2018-06-25 14:42:25
 */
;(function($, undefined){//undefined在老一辈的浏览器是不被支持的，直接使用会报错，js框架要考虑到兼容性，因此增加一个形参undefined
    'use strict' //使用js严格模式检查，使语法更规范
    var pluginName = 'domResize';
    // 默认参数
    var _options  = {
        dragable:true,//允许拖动修改位置
        dragHandle:null,
        resizeable:true,//是否允许修改大小
        resizeMinWidth:0,//修改大小当前的最小宽度
        resizeMinHeight:0,//修改大小当前的最小高度
        selectColor:'#0000ff',//选中元素时的边框颜色
        outline:true,//选中时是否需要outline
        outlineType:'dashed',//outline的类型，与css的线的类型相对应
        pointLimit:{//范围的限制
            minTop:0,
            minLeft:0,
            maxTop:$(document).outerHeight(),
            maxLeft:$(document).outerWidth()
        },
        dragCallback:null,
        resizeCallback:null,
    };
    function Resize(element,options){
        this.element = element;
        this.options = options;
        console.log(this.options);
        this.init();
        
        return {
            // add:$.proxy(this.add,this),
        }
    };
    Resize.prototype.init = function(){//初始化
        this.createResizeTool();
        this.clickEvent();
    };
    Resize.prototype.createResizeTool = function(){//创建修改大小的工具
        var _this = this;
        var resizeTool_str = 
        '<div class="resize-tool resizeTL"></div>'+
        '<div class="resize-tool resizeTC"></div>'+
        '<div class="resize-tool resizeTR"></div>'+
        '<div class="resize-tool resizeLC"></div>'+
        '<div class="resize-tool resizeBL"></div>'+                
        '<div class="resize-tool resizeBC"></div>'+
        '<div class="resize-tool resizeBR"></div>'+
        '<div class="resize-tool resizeRC"></div>';
        $(this.element).append(resizeTool_str);
        // $(this.element).css("position","relative");
        $(this.element).find(".resize-tool").css({
            "position":"absolute",
            "width":"10px",
            "height":"10px",
            "background-color":_this.options.selectColor,
            "display":"none",
        });
    };
    Resize.prototype.setResizeToolPosition = function(){//设置修改大小工具的位置
        var elementBorder = parseInt($(this.element).css("border-width"));
        var elementWidth = $(this.element).outerWidth();
        var elementHeight = $(this.element).outerHeight();
        $(this.element).find(".resize-tool.resizeTL").css({
            "top":( 0-10/2 ) + "px",
            "left":( 0-10/2 ) + "px",
            "cursor": "nw-resize", 
        });
        $(this.element).find(".resize-tool.resizeTC").css({
            "top":0-10/2 + "px",
            "left":elementWidth/2-10/2 + "px",
            "cursor": "n-resize",            
        });
        $(this.element).find(".resize-tool.resizeTR").css({
            "top":0-10/2 + "px",
            "left":elementWidth-10/2 + "px",
            "cursor": "ne-resize",             
        });
        $(this.element).find(".resize-tool.resizeLC").css({
            "top":elementHeight/2-10/2 + "px",
            "left":0-10/2 + "px",
            "cursor": "w-resize",                        
        });
        $(this.element).find(".resize-tool.resizeBL").css({
            "top":elementHeight-10/2 + "px",
            "left":0-10/2 + "px",
            "cursor": "ne-resize",                         
        });
        $(this.element).find(".resize-tool.resizeBC").css({
            "top":elementHeight-10/2 + "px",
            "left":elementWidth/2-10/2 + "px",
            "cursor": "n-resize",                        
        });
        $(this.element).find(".resize-tool.resizeBR").css({
            "top":elementHeight-10/2 + "px",
            "left":elementWidth-10/2 + "px",
            "cursor": "nw-resize",             
        });
        $(this.element).find(".resize-tool.resizeRC").css({
            "top":elementHeight/2-10/2 + "px",
            "left":elementWidth-10/2 + "px",
            "cursor": "w-resize",                                    
        });
    };
    Resize.prototype.clickEvent = function(){//当前元素的点击事件，呼出修改大小的工具
        var _this = this;        
        $(this.element).off("click.resize").on("click.resize",function(){
            if($(_this.element).find(".resize-tool").css("display") == "none"){
                _this.setResizeToolPosition();  
                if(_this.options.outline)
                    $(this).css("outline","1px "+_this.options.outlineType+" "+_this.options.selectColor);          
                $(this).find(".resize-tool").show();
                if(_this.options.dragable)
                    _this.onDrag();
                if(_this.options.resizeable)
                    _this.onResize();
                $(document).on("click.resize",function(){
                    _this.cancelResize();
                    return false;
                });
            }
            return false;
        });
    };
    Resize.prototype.cancelResize = function(){//取消修改大小
        $(this.element).find(".resize-tool").hide();
        $(this.element).css("outline","none");  
        if(this.options.dragable)
            this.offDrag();  
        if(this.options.resizeable)
            this.offResize();      
        $(document).off("click.resize");
    };
    Resize.prototype.onDrag = function(){//拖动修改位置
        var disX,disY;
        var _this = this;
        
        var oDrag = this.element;//要改变哪个元素的位置
        var handle;//点击在哪个上面进行拖动
        if(this.options.dragHandle) 
            handle = this.options.dragHandle;
        else
            handle = this.element;
        $(handle).css('cursor','move');
        $(handle).on("mousedown.drag",function(e){
            disX = e.clientX - oDrag.offsetLeft;
            disY = e.clientY - oDrag.offsetTop;
            $(document).on("mousemove.drag",function(e){
                var Left = e.clientX - disX;
                var Top = e.clientY - disY;
                var maxleft = _this.options.pointLimit.maxLeft - oDrag.offsetWidth;
                var maxtop = _this.options.pointLimit.maxTop - oDrag.offsetHeight;
                if (Left < _this.options.pointLimit.minLeft) {
                    Left = _this.options.pointLimit.minLeft;
                }else if (Left > maxleft) {
                    Left = maxleft;
                };
                if (Top < _this.options.pointLimit.minTop) {
                    Top = _this.options.pointLimit.minTop;
                }else if (Top > maxtop) {
                    Top = maxtop;
                };
                oDrag.style.left=Left+'px';
                oDrag.style.top=Top+'px';

                if(_this.options.dragCallback)//如果有拖动的回调函数
                    _this.options.dragCallback();

                return false;
            }).on("mouseup.drag",function(){
                $(document).off("mousemove.drag");
                $(document).off("mouseup.drag");
                return false;
            });
            return false;
        });
        $(this.element).find(".resize-tool").off("mousedown.drag").on("mousedown.drag",function(){//阻止拖动事件向下传递
            return false;
        });
    };
    Resize.prototype.offDrag = function(){//取消拖动
        var handle;//点击在哪个上面进行拖动
        if(this.options.dragHandle) 
            handle = this.options.dragHandle;
        else
            handle = this.element;
        $(handle).css('cursor','default');
        $(handle).off("mousedown.drag");  
        $(this.element).find(".resize-tool").off("mousedown.drag"); 
    };
    Resize.prototype.onResize = function(){
        //四边变大
        this.setResize(this.element.querySelector('.resizeBC'),false,false,false,true);
        this.setResize(this.element.querySelector('.resizeRC'),false,false,true,false);
        this.setResize(this.element.querySelector('.resizeTC'),false,true,false,true);
        this.setResize(this.element.querySelector('.resizeLC'),true,false,true,false);

        //四角变大
        this.setResize(this.element.querySelector('.resizeBR'),false,false,true,true);
        this.setResize(this.element.querySelector('.resizeTR'),false,true,true,true);
        this.setResize(this.element.querySelector('.resizeTL'),true,true,true,true);
        this.setResize(this.element.querySelector('.resizeBL'),true,false,true,true);
    };
    Resize.prototype.offResize = function(){
        $(this.element).find(".resize-tool").off("mousedown.resize");
    };
    Resize.prototype.setResize = function(handle,isleft,istop,lookx,looky){
        var _this = this;
        var oparent = this.element;
        var disX,disY;
        $(handle).on("mousedown.resize",function(e){
            disX=e.clientX-this.offsetLeft;
            disY=e.clientY-this.offsetTop;
            var iparenttop=oparent.offsetTop;
            var iparentleft=oparent.offsetLeft;
            var iparentwidth=oparent.offsetWidth;
            var iparentheight=oparent.offsetHeight;
            $(document).on("mousemove.resize",function(e){
                var iL=e.clientX-disX;
                var iT=e.clientY-disY;
                // var maxw=document.documentElement.clientWidth-oparent.offsetLeft-2;
                // var maxh=document.documentElement.clientHeight-oparent.offsetTop-2;
                var maxw,maxh;
                if(isleft){
                    maxw = (iparentleft - _this.options.pointLimit.minLeft) + iparentwidth;
                }else{
                    maxw = _this.options.pointLimit.maxLeft - oparent.offsetLeft;
                }
                if(istop){
                    maxh = (iparenttop - _this.options.pointLimit.minTop) + iparentheight;
                }else{
                    maxh = _this.options.pointLimit.maxTop - oparent.offsetTop;
                }
                var iw= isleft ? iparentwidth - iL : handle.offsetWidth + iL;
                var ih = istop ? iparentheight - iT : handle.offsetHeight + iT;
                if (isleft) {
                    // oparent.style.left=iparentleft+iL+'px';
                    if(iparentleft + iL < _this.options.pointLimit.minLeft){
                        oparent.style.left = _this.options.pointLimit.minLeft + 'px';
                    }else{
                        oparent.style.left = iparentleft + iL + 'px';
                    }
                };
                if (istop) {
                    // oparent.style.top=iparenttop+iT+'px';
                    if(iparenttop + iT < _this.options.pointLimit.minTop){
                        oparent.style.top = _this.options.pointLimit.minTop + 'px';
                    }else{
                        oparent.style.top = iparenttop + iT + 'px';
                    }
                };
                if (iw < _this.options.resizeMinWidth) {
                    iw = _this.options.resizeMinWidth;
                }else if (iw > maxw) {
                    iw = maxw;
                };
                if (lookx) {
                    oparent.style.width = iw + 'px';
                };
                if (ih < _this.options.resizeMinHeight) {
                    ih = _this.options.resizeMinHeight;
                }else if (ih > maxh) {
                    ih = maxh;
                };
                if (looky) {
                    oparent.style.height = ih + 'px';
                };
                if ((isleft && iw == _this.options.resizeMinWidth)||(istop && ih == _this.options.resizeMinHeight)) {
                    $(document).off("mousemove.resize");
                };
                _this.setResizeToolPosition();

                if(_this.options.resizeCallback)//回调
                    _this.options.resizeCallback();
                return false;
            });
            $(document).on("mouseup.resize",function(){
                $(document).off("mousemove.resize");
                $(document).off("mouseup.resize");                
                return false;
            });
            return false;
        });
    };


    $.fn[pluginName] = function(options,args){  
        this.each(function(){//需要对符合的每个dom元素绑定事件
            var _this = $.data(this,pluginName);
            if(typeof options === 'string'){//如果传入的是字符串
                if(!_this){//未被初始化
                    $.error('Not initialized,can not call method : '+options);  
                }else if(!$.isFunction(_this[options]) || options.charAt(0) === '_'){//如果插件api中不包括此函数，或者访问的是以下划线开头的私有函数
                    $.error('No such method : '+options);  
                }else{
                    if(!(args instanceof Array)){//如果args参数不是数组，将其变成数组。调用函数需要传入的参数
                        args = [args];
                    }
                    _this[options].apply(_this,args);//改变调用的函数中的this的执向
                }
            }else if(typeof options === 'boolean'){//如果传入的是bool值
                return _this;
            }else if(typeof options === 'object'){
                $.data(this,pluginName, new Resize(this,$.extend(true,{},_options,options)));
            }else{
                $.error('The parameter '+options+' that can not be identified');//不能识别的参数  
            }
        });
        return this;//返回this实现插件的链式调用
    } 
}(jQuery));