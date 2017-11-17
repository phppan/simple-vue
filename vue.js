/**
 * Created by carson on 17/11/16.
 */

class Vue{
    constructor(options) {
        this.$options = options || {};
        this.$el = document.querySelector(options.el);
        this._data = this.$options.data;

        // 通过代理实现 vm.xxx -> vm._data.xxx
        Object.keys(options.data).forEach(key => this._proxy(key));

        this._initComputed();

        observe(this._data, this);

        this.$compile = new Compile(this.$el || document.body, this)
    }

    $watch(key, cb) {
        new Watcher(this, key, cb);
    }

    _proxy(key) {
        const self = this;
        Object.defineProperty(self, key, {
            configurable: true,
            enumerable: true,
            get: function proxyGetter () {
                return self._data[key]
            },
            set: function proxySetter (val) {
                self._data[key] = val
            }
        })
    }

    _initComputed() {
        var me = this;
        var computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get,
                    set: function() {}
                });
            });
        }
    }
}