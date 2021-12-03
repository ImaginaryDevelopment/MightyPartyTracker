import { Union, Record } from "./fable_modules/fable-library.3.6.3/Types.js";
import { union_type, record_type, class_type, tuple_type, string_type, int32_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";
import { add, empty } from "./fable_modules/fable-library.3.6.3/Set.js";
import { compareArrays } from "./fable_modules/fable-library.3.6.3/Util.js";
import { Cmd_none } from "./fable_modules/Fable.Elmish.3.1.0/cmd.fs.js";
import { heroes } from "./mighty_party/Hero.fs.js";
import { map } from "./fable_modules/fable-library.3.6.3/Array.js";
import { createElement } from "react";
import { Interop_reactApi } from "./fable_modules/Feliz.1.53.0/Interop.fs.js";
import { delay, toList } from "./fable_modules/fable-library.3.6.3/Seq.js";
import { singleton } from "./fable_modules/fable-library.3.6.3/List.js";
import { ProgramModule_mkProgram, ProgramModule_withConsoleTrace, ProgramModule_run } from "./fable_modules/Fable.Elmish.3.1.0/program.fs.js";
import { Program_withReactBatched } from "./fable_modules/Fable.Elmish.React.3.0.1/react.fs.js";

export function stringify(x) {
    return JSON.stringify(x);
}

export class State extends Record {
    constructor(HeroesOwned) {
        super();
        this.HeroesOwned = HeroesOwned;
    }
}

export function State$reflection() {
    return record_type("Program.State", [], State, () => [["HeroesOwned", class_type("Microsoft.FSharp.Collections.FSharpSet`1", [tuple_type(int32_type, string_type)])]]);
}

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["OwnedClicked"];
    }
}

export function Msg$reflection() {
    return union_type("Program.Msg", [], Msg, () => [[["Item1", int32_type], ["Item2", string_type]]]);
}

export function init() {
    return [new State(empty({
        Compare: (x, y) => compareArrays(x, y),
    })), Cmd_none()];
}

export function update(msg, state) {
    const name = msg.fields[1];
    const id = msg.fields[0] | 0;
    return [new State(add([id, name], state.HeroesOwned)), Cmd_none()];
}

export function render(state, dispatch) {
    let children_2, children;
    const h = heroes;
    const lis = map((hero) => createElement("li", {
        onClick: (_arg1) => {
            dispatch(new Msg(0, hero.ID, hero.Name));
        },
        children: Interop_reactApi.Children.toArray([createElement("input", {
            type: "checkbox",
        }), createElement("span", {
            children: hero.Name,
        })]),
    }), h);
    const children_4 = singleton((children_2 = singleton((children = toList(delay(() => lis)), createElement("ul", {
        children: Interop_reactApi.Children.toArray(Array.from(children)),
    }))), createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children_2)),
    })));
    return createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children_4)),
    });
}

ProgramModule_run(ProgramModule_withConsoleTrace(Program_withReactBatched("feliz-app", ProgramModule_mkProgram(init, (msg, state) => update(msg, state), (state_1, dispatch) => render(state_1, dispatch)))));

