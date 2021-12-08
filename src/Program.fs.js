import { Union, Record } from "./fable_modules/fable-library.3.6.3/Types.js";
import { OwnTracking_view, OwnTracking_update, OwnTracking_init, Msg$reflection as Msg$reflection_1, State$reflection as State$reflection_1, Props$reflection } from "./mighty_party/Components/OwnershipTracker.fs.js";
import { bool_type, string_type, union_type, record_type, tuple_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";
import { view, update as update_1, init as init_1, Msg$reflection as Msg$reflection_2, State$reflection as State$reflection_2 } from "./JsonGen.fs.js";
import { FSharpResult$2 } from "./fable_modules/fable-library.3.6.3/Choice.js";
import { Cmd_OfAsync_start, Cmd_OfAsyncWith_perform, Cmd_none, Cmd_map } from "./fable_modules/Fable.Elmish.3.1.0/cmd.fs.js";
import { ofArray, append } from "./fable_modules/fable-library.3.6.3/List.js";
import { singleton } from "./fable_modules/fable-library.3.6.3/AsyncBuilder.js";
import { join, printf, toFail } from "./fable_modules/fable-library.3.6.3/String.js";
import { createElement } from "react";
import { Interop_reactApi } from "./fable_modules/Feliz.1.53.0/Interop.fs.js";
import { empty, singleton as singleton_1, append as append_1, delay, toList } from "./fable_modules/fable-library.3.6.3/Seq.js";
import { createObj, uncurry } from "./fable_modules/fable-library.3.6.3/Util.js";
import { some } from "./fable_modules/fable-library.3.6.3/Option.js";
import { $007CValueString$007C_$007C } from "./BHelpers.fs.js";
import { ProgramModule_mkProgram, ProgramModule_withConsoleTrace, ProgramModule_run } from "./fable_modules/Fable.Elmish.3.1.0/program.fs.js";
import { Program_withReactBatched } from "./fable_modules/Fable.Elmish.React.3.0.1/react.fs.js";

export class ChildState extends Record {
    constructor(OwnershipTrackerData, JsonJenData) {
        super();
        this.OwnershipTrackerData = OwnershipTrackerData;
        this.JsonJenData = JsonJenData;
    }
}

export function ChildState$reflection() {
    return record_type("Program.ChildState", [], ChildState, () => [["OwnershipTrackerData", tuple_type(Props$reflection(), State$reflection_1())], ["JsonJenData", State$reflection_2()]]);
}

export class ChildPage extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["OwnTracker", "JsonJen", "ImportExport"];
    }
}

export function ChildPage$reflection() {
    return union_type("Program.ChildPage", [], ChildPage, () => [[], [], []]);
}

export class State extends Record {
    constructor(ChildState, ChildPage, ImportText, HamActive, Error$) {
        super();
        this.ChildState = ChildState;
        this.ChildPage = ChildPage;
        this.ImportText = ImportText;
        this.HamActive = HamActive;
        this.Error = Error$;
    }
}

export function State$reflection() {
    return record_type("Program.State", [], State, () => [["ChildState", ChildState$reflection()], ["ChildPage", ChildPage$reflection()], ["ImportText", string_type], ["HamActive", bool_type], ["Error", string_type]]);
}

export class ChildMsg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["OwnershipTracker", "JsonJenMsg"];
    }
}

export function ChildMsg$reflection() {
    return union_type("Program.ChildMsg", [], ChildMsg, () => [[["Item", Msg$reflection_1()]], [["Item", Msg$reflection_2()]]]);
}

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["ChildMsg", "PageChange", "ImportTextChange", "ImportClick", "Imported", "HamClick"];
    }
}

export function Msg$reflection() {
    return union_type("Program.Msg", [], Msg, () => [[["Item", ChildMsg$reflection()]], [["Item", ChildPage$reflection()]], [["Item", string_type]], [], [["Item", union_type("Microsoft.FSharp.Core.FSharpResult`2", [State$reflection(), string_type], FSharpResult$2, () => [[["ResultValue", State$reflection()]], [["ErrorValue", string_type]]])]], []]);
}

export function init(serializer) {
    const patternInput = OwnTracking_init(serializer);
    const props = patternInput[0];
    const ots = patternInput[1];
    const cmd = patternInput[2];
    const cmd_2 = Cmd_map((arg) => (new Msg(0, new ChildMsg(0, arg))), cmd);
    const patternInput_1 = init_1();
    const jstate = patternInput_1[0];
    const jcmd = patternInput_1[1];
    const jcmd_1 = Cmd_map((arg_1) => (new Msg(0, new ChildMsg(1, arg_1))), jcmd);
    const cmd_4 = append(cmd_2, jcmd_1);
    const state = new State(new ChildState([props, ots], jstate), new ChildPage(0), null, false, null);
    return [state, cmd_4];
}

export function runImport(text) {
    return singleton.Delay(() => singleton.TryWith(singleton.Delay(() => {
        let value;
        const x = text;
        try {
            value = JSON.parse(x);
        }
        catch (ex) {
            const arg10 = ex.message;
            value = toFail(printf("Failed to deserialize: \u0027%s\u0027 from \u0027%s\u0027"))(arg10)(x);
        }
        return singleton.Return(new FSharpResult$2(0, value));
    }), (_arg1) => {
        const ex_1 = _arg1;
        return singleton.Return(new FSharpResult$2(1, ex_1.message));
    }));
}

export function update(msg, state) {
    if (msg.tag === 1) {
        const x = msg.fields[0];
        return [new State(state.ChildState, x, state.ImportText, state.HamActive, state.Error), Cmd_none()];
    }
    else if (msg.tag === 2) {
        const x_1 = msg.fields[0];
        return [new State(state.ChildState, state.ChildPage, x_1, state.HamActive, state.Error), Cmd_none()];
    }
    else if (msg.tag === 3) {
        return [new State(state.ChildState, state.ChildPage, null, state.HamActive, state.Error), Cmd_OfAsyncWith_perform((x_2) => {
            Cmd_OfAsync_start(x_2);
        }, (text) => runImport(text), state.ImportText, (arg0_4) => (new Msg(4, arg0_4)))];
    }
    else if (msg.tag === 4) {
        if (msg.fields[0].tag === 1) {
            const msg_3 = msg.fields[0].fields[0];
            return [new State(state.ChildState, state.ChildPage, state.ImportText, state.HamActive, msg_3), Cmd_none()];
        }
        else {
            const next_2 = msg.fields[0].fields[0];
            return [next_2, Cmd_none()];
        }
    }
    else if (msg.tag === 5) {
        return [new State(state.ChildState, state.ChildPage, state.ImportText, !state.HamActive, state.Error), Cmd_none()];
    }
    else if (msg.fields[0].tag === 1) {
        const msg_2 = msg.fields[0].fields[0];
        const patternInput_1 = update_1(msg_2, state.ChildState.JsonJenData);
        const next_1 = patternInput_1[0];
        const cmd_2 = patternInput_1[1];
        return [new State(new ChildState(state.ChildState.OwnershipTrackerData, next_1), state.ChildPage, state.ImportText, state.HamActive, state.Error), Cmd_map((arg_1) => (new Msg(0, new ChildMsg(1, arg_1))), cmd_2)];
    }
    else {
        const msg_1 = msg.fields[0].fields[0];
        let patternInput;
        const tupledArg = state.ChildState.OwnershipTrackerData;
        patternInput = OwnTracking_update(tupledArg[0], tupledArg[1], msg_1);
        const next = patternInput[0];
        const cmd = patternInput[1];
        return [new State(new ChildState([state.ChildState.OwnershipTrackerData[0], next], state.ChildState.JsonJenData), state.ChildPage, state.ImportText, state.HamActive, state.Error), Cmd_map((arg) => (new Msg(0, new ChildMsg(0, arg))), cmd)];
    }
}

export function renderBrandBurger(active, dispatch) {
    return createElement("div", {
        className: "navbar-brand",
        children: Interop_reactApi.Children.toArray(["MightyParty Tracker", createElement("a", {
            role: join(" ", ["button"]),
            className: join(" ", toList(delay(() => append_1(singleton_1("navbar-burger"), delay(() => (active ? singleton_1("is-active") : empty())))))),
            ["aria-label"]: "menu",
            ["aria-expanded"]: false,
            onClick: (_arg1) => {
                dispatch(new Msg(5));
            },
            children: Interop_reactApi.Children.toArray([createElement("span", {
                ["aria-hidden"]: true,
            }), createElement("span", {
                ["aria-hidden"]: true,
            }), createElement("span", {
                ["aria-hidden"]: true,
            })]),
        })]),
    });
}

export function renderNav(hamActive, dispatch) {
    const navItem = (text, pg) => createElement("a", {
        className: "navbar-item",
        children: text,
        onClick: (_arg1) => {
            dispatch(new Msg(1, pg));
        },
    });
    return createElement("nav", {
        className: "navbar",
        role: join(" ", ["navigation"]),
        ["aria-label"]: "main navigation",
        children: Interop_reactApi.Children.toArray([renderBrandBurger(hamActive, dispatch), createElement("div", {
            className: join(" ", toList(delay(() => append_1(singleton_1("navbar-menu"), delay(() => (hamActive ? singleton_1("is-active") : empty())))))),
            children: Interop_reactApi.Children.toArray([createElement("div", {
                className: "navbar-start",
                children: Interop_reactApi.Children.toArray([navItem("MightyTracker", new ChildPage(0)), navItem("Json-Jen", new ChildPage(1)), navItem("Import/Export", new ChildPage(2))]),
            })]),
        }), createElement("div", {
            className: "navbar-end",
        })]),
    });
}

export function renderImportExport(state, dispatch) {
    const eText = JSON.stringify(new State(state.ChildState, state.ChildPage, null, state.HamActive, state.Error), uncurry(2, null), some(2));
    const children = ofArray([createElement("input", {
        defaultValue: state.ImportText,
        onChange: (ev) => {
            dispatch(new Msg(2, ev.target.value));
        },
    }), createElement("button", createObj(toList(delay(() => append_1(singleton_1(["children", "Import"]), delay(() => {
        if ($007CValueString$007C_$007C(state.ImportText) != null) {
            return singleton_1(["onClick", (_arg1) => {
                dispatch(new Msg(3));
            }]);
        }
        else {
            return empty();
        }
    })))))), createElement("pre", {
        children: eText,
    })]);
    return createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children)),
    });
}

export function render(state, dispatch) {
    let children_2;
    const children_4 = ofArray([renderNav(state.HamActive, dispatch), (children_2 = toList(delay(() => {
        let activePatternResult11490, e;
        return append_1((activePatternResult11490 = $007CValueString$007C_$007C(state.Error), (activePatternResult11490 != null) ? ((e = activePatternResult11490, singleton_1(createElement("span", {
            className: "is-red",
            children: e,
        })))) : ((empty()))), delay(() => {
            const matchValue_1 = state.ChildPage;
            switch (matchValue_1.tag) {
                case 1: {
                    const v = view(state.ChildState.JsonJenData, (arg_3) => {
                        dispatch(new Msg(0, new ChildMsg(1, arg_3)));
                    });
                    return singleton_1(v);
                }
                case 2: {
                    const v_1 = renderImportExport(state, dispatch);
                    return singleton_1(v_1);
                }
                default: {
                    let lis;
                    const tupledArg = state.ChildState.OwnershipTrackerData;
                    lis = OwnTracking_view(tupledArg[0], tupledArg[1], (arg_1) => {
                        dispatch(new Msg(0, new ChildMsg(0, arg_1)));
                    });
                    return singleton_1(createElement("ul", {
                        children: Interop_reactApi.Children.toArray([lis]),
                    }));
                }
            }
        }));
    })), createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children_2)),
    }))]);
    return createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children_4)),
    });
}

export const s = {
    Serialize(x) {
        return JSON.stringify(x, uncurry(2, null), some(2));
    },
    Deserialize(x_2) {
        const x_3 = x_2;
        try {
            return JSON.parse(x_3);
        }
        catch (ex) {
            const arg10 = ex.message;
            return toFail(printf("Failed to deserialize: \u0027%s\u0027 from \u0027%s\u0027"))(arg10)(x_3);
        }
    },
};

ProgramModule_run(ProgramModule_withConsoleTrace(Program_withReactBatched("feliz-app", ProgramModule_mkProgram(() => init(s), (msg, state) => update(msg, state), (state_1, dispatch) => render(state_1, dispatch)))));

