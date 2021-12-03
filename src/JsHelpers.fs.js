import { value as value_1, some } from "./fable_modules/fable-library.3.6.3/Option.js";
import { partialApply } from "./fable_modules/fable-library.3.6.3/Util.js";

export function makeStorageProp(key, serializer, deserializer) {
    const getLocal = (deserializer_1, key_1) => {
        const matchValue = localStorage[key_1];
        if (matchValue === null) {
            return void 0;
        }
        else {
            const x = matchValue;
            return some(deserializer_1(x));
        }
    };
    const setLocal = (serializer_1, key_2, value) => {
        if (value != null) {
            const v = value_1(value);
            localStorage.setItem(key_2, serializer_1(v));
        }
        else {
            localStorage.removeItem(key_2);
        }
    };
    return [() => getLocal(deserializer, key), partialApply(1, setLocal, [serializer, key])];
}

