function Observer(data) {
  this.data = data;
  this.walk(data);
  this.pubsub = new PubSub();
}

Observer.prototype.walk = function (obj) {
  let val;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      val = obj[key];

      if (typeof val === 'object') {
        new Observer(val);
      }

      this.convert(key, val);
    }
  }
};

Observer.prototype.convert = function (key, val) {
  let self = this;
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      console.log('你访问了' + key);
      return val;
    },
    set: function (newVal) {
      if (typeof newVal === 'object') {
        new Observer(newVal)
      }

      self.pubsub.emit(key, val, newVal)
      // console.log('你设置了' + key + ", 新的值为" + newVal);
      val = newVal;
    }
  })
};

Observer.prototype.$watch = function (attr, callback) {
  this.pubsub.on(attr, callback);
}

function PubSub() {
  this.callbacks = {};
}

PubSub.prototype.on = function (eventType, callback) {
  let self = this;
  // 如果传入的事件(eventType)为第一次传入，则新建一个属性，值为空数组，数组是为了存放callback
  if (!(eventType in self.callbacks)) {
    self.callbacks[eventType] = [];
  }
  self.callbacks[eventType].push(callback);
}

PubSub.prototype.emit = function (eventType) {
  let self = this;
  // 获取emit传入的参数，这些参数将作为callback函数的参数
  // arguments属性为函数的参数数组，为类数组而非数组，所以无法直接使用slice方法
  let cbArgs = Array.prototype.slice.call(arguments, 1);
  for (let i = 0; i < self.callbacks[eventType].length; i++) {
    self.callbacks[eventType][i].apply(self, cbArgs);
  }
}


// 测试用例
let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

// 你需要实现 $watch 这个 API
app1.$watch('age', function(oldVal, newVal) {
  console.log(`我的年纪变了，现在已经是：${newVal}岁了`)  // ES6模板字符串语法
});

app1.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'

