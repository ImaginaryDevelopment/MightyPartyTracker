import { partialApply, equals } from "./fable_modules/fable-library.3.6.3/Util.js";
import { value as value_1, some } from "./fable_modules/fable-library.3.6.3/Option.js";
import { $007CValueString$007C_$007C } from "./BHelpers.fs.js";

export function Object_getItem(name, x) {
    if (equals(x, null)) {
        return void 0;
    }
    else {
        return some(x[name]);
    }
}

export function makeStorageProp(key, serializer, deserializer) {
    const getLocal = (deserializer_1, key_1) => {
        const matchValue = localStorage[key_1];
        const activePatternResult11067 = $007CValueString$007C_$007C(matchValue);
        if (activePatternResult11067 != null) {
            const x = activePatternResult11067;
            return some(deserializer_1(x));
        }
        else {
            return void 0;
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

export function makeStorageFromGeneric(serializer, key) {
    return makeStorageProp(key, (arg00) => serializer.Serialize(arg00), (arg00_1) => serializer.Deserialize(arg00_1));
}

