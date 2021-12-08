import { printf, toFail, isNullOrEmpty, isNullOrWhiteSpace } from "./fable_modules/fable-library.3.6.3/String.js";
import { some } from "./fable_modules/fable-library.3.6.3/Option.js";
import { empty, cons, reverse, toArray } from "./fable_modules/fable-library.3.6.3/List.js";
import { fold } from "./fable_modules/fable-library.3.6.3/Array.js";
import { uncurry } from "./fable_modules/fable-library.3.6.3/Util.js";
import { isLetter } from "./fable_modules/fable-library.3.6.3/Char.js";

export function $007CValueString$007C_$007C(_arg1) {
    let x;
    if (_arg1 === null) {
        return void 0;
    }
    else if (_arg1 === "") {
        return void 0;
    }
    else if ((x = _arg1, isNullOrWhiteSpace(x))) {
        const x_1 = _arg1;
        return void 0;
    }
    else {
        const x_2 = _arg1;
        return x_2;
    }
}

export function $007CAfter$007C_$007C(delimiter) {
    if (isNullOrEmpty(delimiter)) {
        toFail(printf("%s: Bad %s"))("After")("delimiter");
    }
    return (_arg1) => {
        let i;
        const activePatternResult10987 = $007CValueString$007C_$007C(_arg1);
        if (activePatternResult10987 != null) {
            const x_1 = activePatternResult10987;
            const matchValue = x_1.indexOf(delimiter) | 0;
            if ((i = (matchValue | 0), i < 0)) {
                const i_1 = matchValue | 0;
                return void 0;
            }
            else {
                const i_2 = matchValue | 0;
                return x_1.slice(i_2 + delimiter.length, x_1.length);
            }
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
        let i;
        const activePatternResult10991 = $007CValueString$007C_$007C(_arg1);
        if (activePatternResult10991 != null) {
            const x_1 = activePatternResult10991;
            const matchValue = x_1.indexOf(delimiter) | 0;
            if ((i = (matchValue | 0), i < 0)) {
                const i_1 = matchValue | 0;
                return void 0;
            }
            else {
                const i_2 = matchValue | 0;
                return x_1.slice(0, (i_2 - 1) + 1);
            }
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
        let activePatternResult10994, x_1;
        return (activePatternResult10994 = $007CValueString$007C_$007C(_arg1), (activePatternResult10994 != null) ? ((x_1 = activePatternResult10994, (x_1.indexOf(delimiter) === 0) ? some(void 0) : (void 0))) : (void 0));
    };
}

export function pascal(_arg1) {
    const activePatternResult11000 = $007CValueString$007C_$007C(_arg1);
    if (activePatternResult11000 != null) {
        const x = activePatternResult11000;
        const arg00 = toArray(reverse(fold(uncurry(2, (tupledArg) => {
            const v = tupledArg[0];
            const foundLetter = tupledArg[1];
            return (c) => (foundLetter ? [cons(c, v), true] : (isLetter(c) ? [cons(c.toLocaleUpperCase(), v), true] : [cons(c, v), false]));
        }), [empty(), false], x.split(""))[0]));
        return arg00.join('');
    }
    else {
        const x_1 = _arg1;
        return x_1;
    }
}

