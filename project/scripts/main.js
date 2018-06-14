/*
 * @Author: hexuerong 
 * @Date: 2018-06-03 14:36:51 
 * @Last Modified by: hexuerong
 * @Last Modified time: 2018-06-13 15:16:45
 */
import {hexToRGB,colorRGB2Hex} from './add'
import {test as func} from './testES6'
func("lili","10");

$("#mycolor").colorpicker({
    color: "#000000",
    showOn: "none",
    hideButton: true,
    strings: "主题颜色,标准色,更多颜色,主题颜色,返回上一级,历史记录,暂无历史记录",
    hidePaletteCallback:function(){
        console.log("this is a test hidePaletteCallback");
        $(".outer").removeClass("active");                        
    },
    showPaletteCallback:function(){
        console.log("this is a test showPaletteCallback");
        $(".outer").addClass("active");
    },
    fadeOut:true
});
$("#mycolor").on("change.color", function(event, color){
    $(".outer").css('background-color', color);
    console.log(color);
    // $(".outer").removeClass("active");                    
});
$(".outer").on("click",function(e){
    if($(this).hasClass("active")){
        $("#mycolor").colorpicker("hidePalette");
    }else{
        // e.stopImmediatePropagation();
        // e.stopPropagation();
        $("#mycolor").colorpicker("showPalette");
    }
    return false;
});
$(document).on("click",function(){
    var what = $("#mycolor").colorpicker("hidePalette"); 
    // console.log(what);
    return false;       
});
/* var a = hexToRGB("213456");
console.log(a);
var b = hexToRGB("123");//相当于#112233
console.log(b);
var _a = colorRGB2Hex(255,255,256);
console.log(_a); */