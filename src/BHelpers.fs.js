import { isNullOrWhiteSpace } from "./fable_modules/fable-library.3.6.3/String.js";
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

export function pascal(_arg1) {
    const activePatternResult25823 = $007CValueString$007C_$007C(_arg1);
    if (activePatternResult25823 != null) {
        const x = activePatternResult25823;
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

