/*
 * @Author: hexuerong 
 * @Date: 2018-06-02 19:46:48 
 * @Last Modified by: hexuerong
 * @Last Modified time: 2018-06-13 15:45:11
 */
import {hexToRGB,colorRGB2Hex} from './add';
console.log(hexToRGB('ffffff'));
// import {hexToRGB,colorRGB2Hex} from './add';
// console.log(myAge);
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
// console.log(a[mySymbol]); // "Hello!"
/**
 * 
 * @param {*} name 
 * @param {*} age 
 */
function test(name,age){
  console.log(name,age);
}
// test("hexuerong","18");
export {test};