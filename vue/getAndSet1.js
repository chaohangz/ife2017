function Observer(data) {
  this.data = data;
  this.walk(data);
}

let p = Observer.prototype;

p.walk = function (obj) {
  let val;
  // 遍历所有属性
  for (let key in obj) {
    // 剔除对象继承的属性，只保留自身拥有的属性
    if (obj.hasOwnProperty(key)) {
      val = obj[key];

      // 如果对象的属性依旧是对象，继续new Observer
      if (typeof val === "object") {
        new Observer(val);
      }

      this.convert(key, val);
    }
  }
};

p.convert = function (key, val) {
  Object.defineProperty(this.data, key, {
    enumerable: true,  //可枚举
    configurable: true, //可修改
    get: function () {
      console.log("你访问了" + key);
      return val;
    },
    set: function (newVal) {
      console.log("你设置了" + key + ", 新的值为" + newVal);
      if (newVal === val) return;
      val = newVal;
    }
  })
};

let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

let app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});