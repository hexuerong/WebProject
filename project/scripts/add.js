/*
 * @Author: hexuerong 
 * @Date: 2018-06-02 19:46:39 
 * @Last Modified by: hexuerong
 * @Last Modified time: 2018-06-08 11:16:55
 */
function hexToRGB(str){
    var m = parseInt(str, 16) // 0x112233      0x123
    if(str.length == 6){
        // 分别获取R、G、B的值
        var r = m >> 16 & 0xff // 17
        var g = m >> 8 & 0xff // 34
        var b = m & 0xff // 51
        return {r:r,g:g,b:b};
    }else if(str.length == 3){
        var r = (m >> 8 & 0xf) | (m >> 4 & 0x0f0) // 17
        var g = (m >> 4 & 0xf) | (m & 0xf0) // 34
        var b = ((m & 0xf) << 4) | (m & 0xf) // 51
        return {r:r,g:g,b:b};            
    }else{
        console.log("颜色不合法");
        return null;
    }
} 
console.log("yes");
function colorRGB2Hex(r,g,b) {
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);       
    if(r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    }else{
        console.log("rgb值不合法");
        return null;
    }
}
console.log("test");
export {hexToRGB,colorRGB2Hex};