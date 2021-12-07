import { $007CValueString$007C_$007C } from "./BHelpers.fs.js";
import { printf, toConsole } from "./fable_modules/fable-library.3.6.3/String.js";
import { value as value_1, some } from "./fable_modules/fable-library.3.6.3/Option.js";

export function makeStorageProp(key, serializer, deserializer) {
    let key_2;
    return [() => {
        const key_1 = key;
        const matchValue = localStorage[key_1];
        const activePatternResult11030 = $007CValueString$007C_$007C(matchValue);
        if (activePatternResult11030 != null) {
            const x = activePatternResult11030;
            toConsole(printf("Attempting to deserialize \u0027%s\u0027 -\u003e \u0027%s\u0027"))(key_1)(x);
            return some(deserializer(x));
        }
        else {
            return void 0;
        }
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

