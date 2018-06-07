/*
 * @Author: hexuerong 
 * @Date: 2018-06-02 19:46:48 
 * @Last Modified by: hexuerong
 * @Last Modified time: 2018-06-07 20:47:30
 */
// console.log(hexToRGB);
//babel转es6会转成commonjs的规范，浏览器不支持commonjs，会报require is not defined，browserify和webpack都可以把require去掉，把所有的文件打包为一个文件
import {hexToRGB,colorRGB2Hex} from './add';
console.log(hexToRGB);
// $(function(){
    let mySymbol = Symbol();
    // 第一种写法
    let a = {};
    a[mySymbol] = 'Hello!';
    // 第二种写法
    let b = {
      [mySymbol]: 'Hello!'
    };
    // 第三种写法
    let c = {};
    Object.defineProperty(a, mySymbol, { value: 'Hello!' });
    // 以上写法都得到同样结果
    console.log(a);
    console.log(a[mySymbol]); // "Hello!"
    /**
     * 
     * @param {*} name 
     * @param {*} age 
     */
    function test(name,age){
      console.log(name,age);
    }
    test("hexuerong","18");
// });