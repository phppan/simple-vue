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
        observe(val);

        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define

            get: function() {
                console.log("intercept get:" + key);
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },

            set: function(newVal) {
                console.log("intercept set:"+key);
                if (newVal === val) {
                    return;
                }
                val = newVal;

                // 新的值是object的话，进行监听
                observe(newVal);
                // 通知订阅者
                dep.notify(newVal);
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

class Dep {
    constructor() {
        this.subs = {}
    }

    addSub(sub) {
        if(!this.subs[sub.uid]) {
            this.subs[sub.uid] = sub; //防止重复添加
        }
    }

    notify(newValue) {
        for(var uid in this.subs){
            this.subs[uid].update(newValue);
        }
    }
}


Dep.target = null;
