/**
 * @Author Aaron
 * @date 2019-11-20
 * @information 混入
 */

export default class Mixin {

    mix(...mixins) {
        class Mix {}
        for (let mixin of mixins) {
            this.copyProperties(Mix, mixin);
            this.copyProperties(Mix.prototype, mixin.prototype);
        }
        return Mix;
    }

    copyProperties(target, source) {
        for (let key of Reflect.ownKeys(source)) {
            if ( key !== "constructor"&& key !== "prototype"&& key !== "name") {
                let desc = Object.getOwnPropertyDescriptor(source, key);
                Object.defineProperty(target, key, desc);
            }
        }
    }
}
