import { $007CValueString$007C_$007C } from "./BHelpers.fs.js";
import { toFail, printf, toConsole } from "./fable_modules/fable-library.3.6.3/String.js";
import { value as value_1, some } from "./fable_modules/fable-library.3.6.3/Option.js";
import { partialApply } from "./fable_modules/fable-library.3.6.3/Util.js";

export function makeStorageProp(key, serializer, deserializer) {
    const getLocal = (deserializer_1, key_1) => {
        const matchValue = localStorage[key_1];
        const activePatternResult27337 = $007CValueString$007C_$007C(matchValue);
        if (activePatternResult27337 != null) {
            const x = activePatternResult27337;
            toConsole(printf("Attempting to deserialize \u0027%s\u0027 -\u003e \u0027%s\u0027"))(key_1)(x);
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

export function JsSerialization_serialize(x) {
    return JSON.stringify(x);
}

export function JsSerialization_deserialize(x) {
    try {
        return JSON.parse(x);
    }
    catch (ex) {
        const arg20 = ex.message;
        return toFail(printf("Failed to deserialize: %s (\u0027%s\u0027) from \u0027%s\u0027"))("t")(arg20)(x);
    }
}

