import { equals } from "./fable_modules/fable-library.3.6.3/Util.js";
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
    let key_2;
    return [() => {
        let x;
        const matchValue = localStorage[key];
        const activePatternResult11041 = $007CValueString$007C_$007C(matchValue);
        return (activePatternResult11041 != null) ? ((x = activePatternResult11041, some(deserializer(x)))) : (void 0);
    }, (key_2 = key, (value) => {
        if (value != null) {
            localStorage.setItem(key_2, serializer(value_1(value)));
        }
        else {
            localStorage.removeItem(key_2);
        }
    })];
}

export function makeStorageFromGeneric(serializer, key) {
    return makeStorageProp(key, (arg00) => serializer.Serialize(arg00), (arg00_1) => serializer.Deserialize(arg00_1));
}

