$(function(){
    console.log("tell me why");
    let mySymbol = Symbol();
    // 第一种写法
    /* let a = {};
    a[mySymbol] = 'Hello!';
    
    // 第二种写法
    let a = {
      [mySymbol]: 'Hello!'
    }; */
    
    // 第三种写法
    let a = {};
    Object.defineProperty(a, mySymbol, { value: 'Hello!' });
    // 以上写法都得到同样结果
    console.log(a);
    console.log(a[mySymbol]); // "Hello!"
    console.log("this is a test");
});