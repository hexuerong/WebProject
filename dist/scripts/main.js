"use strict";

$(document).ready(function () {
    $("#mycolor").colorpicker({
        color: "#000000",
        showOn: "none",
        hideButton: true,
        strings: "主题颜色,标准色,更多颜色,主题颜色,返回上一级,历史记录,暂无历史记录",
        hidePaletteCallback: function hidePaletteCallback() {
            console.log("this is a test hidePaletteCallback");
            $(".outer").removeClass("active");
        },
        showPaletteCallback: function showPaletteCallback() {
            console.log("this is a test showPaletteCallback");
            $(".outer").addClass("active");
        },
        fadeOut: true
    });
    $("#mycolor").on("change.color", function (event, color) {
        $(".outer").css('background-color', color);
        console.log(color);
        // $(".outer").removeClass("active");                    
    });
    $(".outer").on("click", function (e) {
        if ($(this).hasClass("active")) {
            $("#mycolor").colorpicker("hidePalette");
        } else {
            // e.stopImmediatePropagation();
            // e.stopPropagation();
            $("#mycolor").colorpicker("showPalette");
        }
        return false;
    });
    $(document).on("click", function () {
        var what = $("#mycolor").colorpicker("hidePalette");
        // console.log(what);
        return false;
    });
    var a = hexToRGB("213456");
    console.log(a);
    var b = hexToRGB("abd"); //相当于#112233
    console.log(b);
    function hexToRGB(str) {
        var m = parseInt(str, 16); // 0x112233      0x123
        if (str.length == 6) {
            // 分别获取R、G、B的值
            var r = m >> 16 & 0xff; // 17
            var g = m >> 8 & 0xff; // 34
            var b = m & 0xff; // 51
            return { r: r, g: g, b: b };
        } else if (str.length == 3) {
            var r = m >> 8 & 0xf | m >> 4 & 0x0f0; // 17
            var g = m >> 4 & 0xf | m & 0xf0; // 34
            var b = (m & 0xf) << 4 | m & 0xf; // 51
            return { r: r, g: g, b: b };
        } else {
            console.log("颜色不合法");
            return null;
        }
    }
    function colorRGB2Hex(r, g, b) {
        r = parseInt(r);
        g = parseInt(g);
        b = parseInt(b);
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            return hex;
        } else {
            console.log("rgb值不合法");
            return null;
        }
    }
    var _a = colorRGB2Hex(255, 255, 256);
    console.log(_a);
});