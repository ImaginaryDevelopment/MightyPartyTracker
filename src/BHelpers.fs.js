import { printf, toFail, isNullOrEmpty, isNullOrWhiteSpace } from "./fable_modules/fable-library.3.6.3/String.js";
import { some } from "./fable_modules/fable-library.3.6.3/Option.js";
import { empty, cons, reverse, toArray } from "./fable_modules/fable-library.3.6.3/List.js";
import { fold } from "./fable_modules/fable-library.3.6.3/Array.js";
import { uncurry } from "./fable_modules/fable-library.3.6.3/Util.js";
import { isLetter } from "./fable_modules/fable-library.3.6.3/Char.js";

export function $007CValueString$007C_$007C(_arg1) {
    if (_arg1 === null) {
        return void 0;
    }
    else if (_arg1 === "") {
        return void 0;
    }
    else if (isNullOrWhiteSpace(_arg1)) {
        return void 0;
    }
    else {
        return _arg1;
    }
}

export function $007CAfter$007C_$007C(delimiter) {
    if (isNullOrEmpty(delimiter)) {
        toFail(printf("%s: Bad %s"))("After")("delimiter");
    }
    return (_arg1) => {
        const activePatternResult10977 = $007CValueString$007C_$007C(_arg1);
        if (activePatternResult10977 != null) {
            const x_1 = activePatternResult10977;
            const matchValue = x_1.indexOf(delimiter) | 0;
            return (matchValue < 0) ? (void 0) : x_1.slice(matchValue + delimiter.length, x_1.length);
        }
        else {
            return void 0;
        }
    };
}

export function $007CBefore$007C_$007C(delimiter) {
    if (isNullOrEmpty(delimiter)) {
        toFail(printf("%s: Bad %s"))("Before")("delimiter");
    }
    return (_arg1) => {
        const activePatternResult10981 = $007CValueString$007C_$007C(_arg1);
        if (activePatternResult10981 != null) {
            const x_1 = activePatternResult10981;
            const matchValue = x_1.indexOf(delimiter) | 0;
            return (matchValue < 0) ? (void 0) : x_1.slice(0, (matchValue - 1) + 1);
        }
        else {
            return void 0;
        }
    };
}

export function $007CStartsWith$007C_$007C(delimiter) {
    if (isNullOrEmpty(delimiter)) {
        toFail(printf("%s: Bad %s"))("StartsWith")("delimiter");
    }
    return (_arg1) => {
        let activePatternResult10984, x_1;
        return (activePatternResult10984 = $007CValueString$007C_$007C(_arg1), (activePatternResult10984 != null) ? ((x_1 = activePatternResult10984, (x_1.indexOf(delimiter) === 0) ? some(void 0) : (void 0))) : (void 0));
    };
}

export function pascal(_arg1) {
    const activePatternResult10990 = $007CValueString$007C_$007C(_arg1);
    if (activePatternResult10990 != null) {
        const x = activePatternResult10990;
        const arg00 = toArray(reverse(fold(uncurry(2, (tupledArg) => {
            const v = tupledArg[0];
            return (c) => (tupledArg[1] ? [cons(c, v), true] : (isLetter(c) ? [cons(c.toLocaleUpperCase(), v), true] : [cons(c, v), false]));
        }), [empty(), false], x.split(""))[0]));
        return arg00.join('');
    }
    else {
        return _arg1;
    }
}

