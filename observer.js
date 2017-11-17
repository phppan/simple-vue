/**
 * Created by carson on 17/11/16.
 */
//数据劫持，监控数据变化
class Observer {
    constructor(value) {
        Object.keys(value).forEach((key) => this.defineReactive(value, key, value[key]))
    }

    defineReactive(data, key, val) {
        var dep = new Dep();
        var childObj = observe(val);

        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function() {
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 新的值是object的话，进行监听
                childObj = observe(newVal);
                // 通知订阅者
                dep.notify();
            }
        });
    }
}


function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Observer(value);
}

var uid = 0;

class Dep {
    constructor() {
        this.id = uid++;
        this.subs = []
    }
    addSub(sub) {
        this.subs.push(sub);
    }

    depend() {
        Dep.target.addDep(this);
    }

    removeSub(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    }

    notify() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
}


Dep.target = null;
