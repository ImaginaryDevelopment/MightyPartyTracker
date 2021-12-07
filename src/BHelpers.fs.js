import { isNullOrWhiteSpace } from "./fable_modules/fable-library.3.6.3/String.js";

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

