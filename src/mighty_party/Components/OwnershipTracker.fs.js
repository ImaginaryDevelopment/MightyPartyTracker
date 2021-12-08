import { toString, Union, Record } from "../../fable_modules/fable-library.3.6.3/Types.js";
import { tuple_type, union_type, list_type, string_type, record_type, option_type, lambda_type, class_type, int32_type, unit_type } from "../../fable_modules/fable-library.3.6.3/Reflection.js";
import { TrackedHero, Soulbind$reflection, TrackedHero$reflection } from "../Schema.fs.js";
import { makeOwnedProp, heroes as heroes_2 } from "../Hero.fs.js";
import { filter as filter_2, toSeq, FSharpMap__get_Item, add, tryPick, ofSeq, tryFind } from "../../fable_modules/fable-library.3.6.3/Map.js";
import { ofArray, map as map_2, ofSeq as ofSeq_1, filter as filter_1, singleton, append, contains, empty, tryItem } from "../../fable_modules/fable-library.3.6.3/List.js";
import { sortBy, fold, empty as empty_1, singleton as singleton_1, append as append_1, delay, toList, tryFind as tryFind_1, map } from "../../fable_modules/fable-library.3.6.3/Seq.js";
import { toConsole, join, toText, printf, toConsoleError } from "../../fable_modules/fable-library.3.6.3/String.js";
import { Cmd_none } from "../../fable_modules/Fable.Elmish.3.1.0/cmd.fs.js";
import { compareArrays, comparePrimitives, Lazy, round, stringHash } from "../../fable_modules/fable-library.3.6.3/Util.js";
import { List_except } from "../../fable_modules/fable-library.3.6.3/Seq2.js";
import { $007CAfter$007C_$007C, $007CStartsWith$007C_$007C, $007CBefore$007C_$007C } from "../../BHelpers.fs.js";
import { createElement } from "react";
import { Interop_reactApi } from "../../fable_modules/Feliz.1.53.0/Interop.fs.js";
import { map as map_1, defaultArg } from "../../fable_modules/fable-library.3.6.3/Option.js";
import { parse } from "../../fable_modules/fable-library.3.6.3/Int32.js";
import { ofSeq as ofSeq_2, contains as contains_1 } from "../../fable_modules/fable-library.3.6.3/Set.js";

export class Props extends Record {
    constructor(GetOwned, SetOwned) {
        super();
        this.GetOwned = GetOwned;
        this.SetOwned = SetOwned;
    }
}

export function Props$reflection() {
    return record_type("App.MightyParty.Components.OwnershipTracker.Props", [], Props, () => [["GetOwned", lambda_type(unit_type, class_type("Microsoft.FSharp.Collections.FSharpMap`2", [int32_type, TrackedHero$reflection()]))], ["SetOwned", lambda_type(option_type(class_type("Microsoft.FSharp.Collections.FSharpMap`2", [int32_type, TrackedHero$reflection()])), unit_type)]]);
}

export class State extends Record {
    constructor(HeroesOwned, Filter) {
        super();
        this.HeroesOwned = HeroesOwned;
        this.Filter = Filter;
    }
}

export function State$reflection() {
    return record_type("App.MightyParty.Components.OwnershipTracker.State", [], State, () => [["HeroesOwned", class_type("Microsoft.FSharp.Collections.FSharpMap`2", [int32_type, TrackedHero$reflection()])], ["Filter", list_type(string_type)]]);
}

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["OwnedClicked", "BindLevelChange", "LevelChange", "FilterChange"];
    }
}

export function Msg$reflection() {
    return union_type("App.MightyParty.Components.OwnershipTracker.Msg", [], Msg, () => [[["Item", int32_type]], [["Item1", int32_type], ["Item2", int32_type]], [["Item1", int32_type], ["Item2", int32_type]], [["Item1", string_type], ["Item2", string_type]]]);
}

export const OwnTracking_heroes = heroes_2;

export class OwnTracking_BindInfo extends Record {
    constructor(TrackedHero, Soulbind) {
        super();
        this.TrackedHero = TrackedHero;
        this.Soulbind = Soulbind;
    }
}

export function OwnTracking_BindInfo$reflection() {
    return record_type("App.MightyParty.Components.OwnershipTracker.OwnTracking.BindInfo", [], OwnTracking_BindInfo, () => [["TrackedHero", TrackedHero$reflection()], ["Soulbind", option_type(tuple_type(Soulbind$reflection(), class_type("Microsoft.FSharp.Collections.FSharpMap`2", [string_type, option_type(TrackedHero$reflection())])))]]);
}

export function OwnTracking_getHeroBindInfo(hero, owned) {
    const matchValue = tryFind(hero.ID, owned);
    if (matchValue == null) {
        return void 0;
    }
    else {
        const th = matchValue;
        const matchValue_1 = tryItem(th.BindLevel, hero.Soulbinds);
        if (matchValue_1 == null) {
            return new OwnTracking_BindInfo(th, void 0);
        }
        else {
            const sbs = matchValue_1;
            const bo = ofSeq(map((x) => [x, tryPick((_arg1, v) => {
                if ((v.Name === x) && v.Owned) {
                    return v;
                }
                else {
                    return void 0;
                }
            }, owned)], sbs.Requirements));
            return new OwnTracking_BindInfo(th, [sbs, bo]);
        }
    }
}

export function OwnTracking_changeOwned(owned, i) {
    const matchValue = [tryFind(i, owned), tryFind_1((h) => (h.ID === i), OwnTracking_heroes)];
    if (matchValue[0] == null) {
        if (matchValue[1] == null) {
            toConsoleError(printf("Failed to find hero ID %i to changeOwned"))(i);
            return owned;
        }
        else {
            const h_1 = matchValue[1];
            return add(i, new TrackedHero(i, true, 1, 0, h_1.Name), owned);
        }
    }
    else {
        const x = matchValue[0];
        return add(i, new TrackedHero(x.ID, !FSharpMap__get_Item(owned, i).Owned, x.Level, x.BindLevel, x.Name), owned);
    }
}

export function OwnTracking_updateHero(owned, i, f) {
    const matchValue = [tryFind(i, owned), tryFind_1((h) => (h.ID === i), OwnTracking_heroes)];
    let pattern_matching_result, h_1, o;
    if (matchValue[0] != null) {
        if (matchValue[1] != null) {
            pattern_matching_result = 0;
            h_1 = matchValue[1];
            o = matchValue[0];
        }
        else {
            pattern_matching_result = 1;
        }
    }
    else {
        pattern_matching_result = 1;
    }
    switch (pattern_matching_result) {
        case 0: {
            const updated = f([o, h_1]);
            return add(i, updated, owned);
        }
        case 1: {
            return owned;
        }
    }
}

export function OwnTracking_init(serializer) {
    const patternInput = makeOwnedProp(serializer);
    const setOwned = patternInput[1];
    const getOwned = patternInput[0];
    const owned = getOwned();
    const props = new Props(getOwned, setOwned);
    const state = new State(owned, empty());
    return [props, state, Cmd_none()];
}

export function OwnTracking_update(props, state, msg) {
    switch (msg.tag) {
        case 1: {
            const v = msg.fields[1] | 0;
            const id = msg.fields[0] | 0;
            const nextOwned_1 = OwnTracking_updateHero(state.HeroesOwned, id, (tupledArg) => {
                const o = tupledArg[0];
                const _h = tupledArg[1];
                return new TrackedHero(o.ID, o.Owned, o.Level, v, o.Name);
            });
            return [new State(nextOwned_1, state.Filter), Cmd_none()];
        }
        case 2: {
            const v_1 = msg.fields[1] | 0;
            const id_1 = msg.fields[0] | 0;
            const nextOwned_2 = OwnTracking_updateHero(state.HeroesOwned, id_1, (tupledArg_1) => {
                const o_1 = tupledArg_1[0];
                const _h_1 = tupledArg_1[1];
                return new TrackedHero(o_1.ID, o_1.Owned, v_1, o_1.BindLevel, o_1.Name);
            });
            return [new State(nextOwned_2, state.Filter), Cmd_none()];
        }
        case 3: {
            const v_2 = msg.fields[1];
            const k = msg.fields[0];
            const filterValue = toText(printf("%s-%s"))(k)(v_2);
            const filter = contains(filterValue, state.Filter, {
                Equals: (x_1, y) => (x_1 === y),
                GetHashCode: (x_1) => stringHash(x_1),
            }) ? List_except([filterValue], state.Filter, {
                Equals: (x_2, y_1) => (x_2 === y_1),
                GetHashCode: (x_2) => stringHash(x_2),
            }) : append(singleton(filterValue), filter_1((_arg1) => {
                let pattern_matching_result;
                const activePatternResult11342 = $007CBefore$007C_$007C("-")(_arg1);
                if (activePatternResult11342 != null) {
                    if ($007CStartsWith$007C_$007C(k)(activePatternResult11342) != null) {
                        pattern_matching_result = 0;
                    }
                    else {
                        pattern_matching_result = 1;
                    }
                }
                else {
                    pattern_matching_result = 1;
                }
                switch (pattern_matching_result) {
                    case 0: {
                        return false;
                    }
                    case 1: {
                        return true;
                    }
                }
            }, state.Filter));
            return [new State(state.HeroesOwned, filter), Cmd_none()];
        }
        default: {
            const x = msg.fields[0] | 0;
            const nextOwned = OwnTracking_changeOwned(state.HeroesOwned, x);
            props.SetOwned(nextOwned);
            return [new State(nextOwned, state.Filter), Cmd_none()];
        }
    }
}

export function OwnTracking_renderSoulbinds(sb, binds) {
    const sbs = map((tupledArg) => {
        let arg20, bth;
        const name = tupledArg[0];
        const btho = tupledArg[1];
        let pattern_matching_result, bth_1;
        if (btho != null) {
            if ((bth = btho, bth.Owned)) {
                pattern_matching_result = 0;
                bth_1 = btho;
            }
            else {
                pattern_matching_result = 1;
            }
        }
        else {
            pattern_matching_result = 1;
        }
        switch (pattern_matching_result) {
            case 0: {
                const patternInput = (sb.ReqLvl <= bth_1.Level) ? ["has-text-success", name] : ["has-text-warning", (arg20 = ((bth_1.Level - sb.ReqLvl) | 0), toText(printf("%s %i"))(name)(arg20))];
                const text = patternInput[1];
                const cls = patternInput[0];
                return createElement("li", {
                    style: {
                        display: "inline",
                    },
                    children: text,
                    className: cls,
                });
            }
            case 1: {
                return createElement("li", {
                    style: {
                        display: "inline",
                        listStyleType: "circle",
                        listStylePosition: "inside",
                    },
                    children: Interop_reactApi.Children.toArray([createElement("span", {
                        children: toText(printf("%s"))(name),
                        className: join(" ", ["has-text-danger"]),
                    })]),
                });
            }
        }
    }, toSeq(binds));
    return sbs;
}

export function OwnTracking_renderHeroView(dispatch, heroesOwned, hero) {
    const hbi = OwnTracking_getHeroBindInfo(hero, heroesOwned);
    const isOwned = defaultArg(map_1((x) => x.TrackedHero.Owned, hbi), false);
    return createElement("li", {
        ["data-owned"]: toString(isOwned),
        key: hero.ID,
        children: Interop_reactApi.Children.toArray(Array.from(toList(delay(() => append_1(singleton_1(createElement("img", {
            src: toText(printf("dist/images/%i.png"))(hero.ID),
        })), delay(() => append_1(singleton_1(createElement("span", {
            onClick: (_arg1) => {
                dispatch(new Msg(0, hero.ID));
            },
            children: Interop_reactApi.Children.toArray([createElement("input", {
                type: "checkbox",
                checked: isOwned,
            }), createElement("span", {
                className: join(" ", [hero.Rarity]),
                children: hero.Name,
            })]),
        })), delay(() => {
            let hbi_1;
            let pattern_matching_result, hbi_2;
            if (hbi != null) {
                if ((hbi_1 = hbi, hbi_1.TrackedHero.Owned)) {
                    pattern_matching_result = 0;
                    hbi_2 = hbi;
                }
                else {
                    pattern_matching_result = 1;
                }
            }
            else {
                pattern_matching_result = 1;
            }
            switch (pattern_matching_result) {
                case 0: {
                    let sbs;
                    const matchValue = hbi_2.Soulbind;
                    if (matchValue == null) {
                        sbs = empty_1();
                    }
                    else {
                        const sb = matchValue[0];
                        const binds = matchValue[1];
                        sbs = OwnTracking_renderSoulbinds(sb, binds);
                    }
                    return append_1(singleton_1(createElement("input", {
                        title: "Level",
                        defaultValue: hbi_2.TrackedHero.Level,
                        type: "number",
                        min: "0",
                        ["aria-valuemin"]: 0,
                        onChange: (ev) => {
                            const value_26 = ev.target.valueAsNumber;
                            if ((!(value_26 == null)) && (value_26 !== NaN)) {
                                dispatch(new Msg(2, hbi_2.TrackedHero.ID, round(value_26)));
                            }
                        },
                    })), delay(() => append_1(singleton_1(createElement("input", {
                        title: "BindLevel",
                        defaultValue: hbi_2.TrackedHero.BindLevel,
                        onChange: (ev_1) => {
                            dispatch(new Msg(1, hbi_2.TrackedHero.ID, parse(ev_1.target.value, 511, false, 32)));
                        },
                        type: "number",
                        max: "4",
                        min: "0",
                        ["aria-valuemax"]: 4,
                        ["aria-valuemin"]: 0,
                    })), delay(() => singleton_1(createElement("span", {
                        children: Interop_reactApi.Children.toArray(["For Next", createElement("ul", {
                            style: {
                                display: "inline",
                            },
                            children: Interop_reactApi.Children.toArray(Array.from(sbs)),
                        })]),
                    }))))));
                }
                case 1: {
                    return empty_1();
                }
            }
        })))))))),
    });
}

export function OwnTracking_applyFilter(heroes, ownedIds, filters) {
    const $007CFilter$007C_$007C = (_arg1) => {
        let pattern_matching_result, f, v;
        const activePatternResult11365 = $007CBefore$007C_$007C("-")(_arg1);
        if (activePatternResult11365 != null) {
            const activePatternResult11366 = $007CAfter$007C_$007C("-")(_arg1);
            if (activePatternResult11366 != null) {
                pattern_matching_result = 0;
                f = activePatternResult11365;
                v = activePatternResult11366;
            }
            else {
                pattern_matching_result = 1;
            }
        }
        else {
            pattern_matching_result = 1;
        }
        switch (pattern_matching_result) {
            case 0: {
                return [f, v];
            }
            case 1: {
                return void 0;
            }
        }
    };
    return fold((heroes_1, _arg2) => {
        let activePatternResult11372, v_2, activePatternResult11374, v_3;
        let pattern_matching_result_1, a;
        const activePatternResult11378 = $007CFilter$007C_$007C(_arg2);
        if (activePatternResult11378 != null) {
            if (activePatternResult11378[0] === "Alignment") {
                pattern_matching_result_1 = 0;
                a = activePatternResult11378[1];
            }
            else {
                pattern_matching_result_1 = 1;
            }
        }
        else {
            pattern_matching_result_1 = 1;
        }
        switch (pattern_matching_result_1) {
            case 0: {
                return heroes_1.filter((h) => (h.Alignment === a));
            }
            case 1: {
                let pattern_matching_result_2, r;
                const activePatternResult11377 = $007CFilter$007C_$007C(_arg2);
                if (activePatternResult11377 != null) {
                    if (activePatternResult11377[0] === "Rarity") {
                        pattern_matching_result_2 = 0;
                        r = activePatternResult11377[1];
                    }
                    else {
                        pattern_matching_result_2 = 1;
                    }
                }
                else {
                    pattern_matching_result_2 = 1;
                }
                switch (pattern_matching_result_2) {
                    case 0: {
                        return heroes_1.filter((h_1) => (h_1.Rarity === r));
                    }
                    case 1: {
                        let pattern_matching_result_3;
                        const activePatternResult11376 = $007CFilter$007C_$007C(_arg2);
                        if (activePatternResult11376 != null) {
                            if (activePatternResult11376[0] === "Owned") {
                                if (activePatternResult11376[1] === "Owned") {
                                    pattern_matching_result_3 = 0;
                                }
                                else {
                                    pattern_matching_result_3 = 1;
                                }
                            }
                            else {
                                pattern_matching_result_3 = 1;
                            }
                        }
                        else {
                            pattern_matching_result_3 = 1;
                        }
                        switch (pattern_matching_result_3) {
                            case 0: {
                                const ownedIds_1 = ownedIds.Value;
                                return heroes_1.filter((h_2) => contains_1(h_2.ID, ownedIds_1));
                            }
                            case 1: {
                                const activePatternResult11375 = $007CFilter$007C_$007C(_arg2);
                                if (activePatternResult11375 != null) {
                                    const n = activePatternResult11375[0];
                                    const v_1 = activePatternResult11375[1];
                                    toConsoleError(printf("No Filter found for %s - %s"))(n)(v_1);
                                    return heroes_1;
                                }
                                else {
                                    const x = _arg2;
                                    const fName = (activePatternResult11372 = $007CBefore$007C_$007C("-")(x), (activePatternResult11372 != null) ? ((v_2 = activePatternResult11372, v_2)) : (void 0));
                                    const fValue = (activePatternResult11374 = $007CAfter$007C_$007C("-")(x), (activePatternResult11374 != null) ? ((v_3 = activePatternResult11374, v_3)) : (void 0));
                                    toConsoleError(printf("Unrecognized filter \u0027%A\u0027 - \u0027%A\u0027 "))(fName)(fValue);
                                    return heroes_1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }, heroes, filters);
}

export function OwnTracking_renderFilterBar(items, dispatch) {
    return createElement("nav", {
        className: "navbar",
        children: Interop_reactApi.Children.toArray([createElement("div", {
            className: "navbar-start",
            children: Interop_reactApi.Children.toArray(Array.from(ofSeq_1(map((tupledArg) => {
                const text = tupledArg[0];
                const _img = tupledArg[1];
                const msg = tupledArg[2];
                return createElement("div", {
                    className: "navbar-item",
                    children: Interop_reactApi.Children.toArray([createElement("button", {
                        children: text,
                        onClick: (_arg1) => {
                            dispatch(msg);
                        },
                    })]),
                });
            }, items)))),
        })]),
    });
}

export function OwnTracking_view(_arg1, state, dispatch) {
    let h;
    const owned = new Lazy(() => {
        const x_1 = ofSeq_2(map((tuple) => tuple[0], toSeq(filter_2((k, v) => v.Owned, state.HeroesOwned))), {
            Compare: (x, y) => comparePrimitives(x, y),
        });
        toConsole(printf("Evaluated owned"));
        return x_1;
    });
    h = Array.from(map((hero) => OwnTracking_renderHeroView(dispatch, state.HeroesOwned, hero), sortBy((x_2) => [x_2.Rarity !== "Legendary", x_2.Rarity !== "Epic", x_2.Rarity !== "Rare", x_2.Name], OwnTracking_applyFilter(OwnTracking_heroes, owned, state.Filter), {
        Compare: (x_3, y_1) => compareArrays(x_3, y_1),
    })));
    return createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(toList(delay(() => {
            const makeFilterSet = (field, values) => map_2((tupledArg) => {
                const v_1 = tupledArg[0];
                const img = tupledArg[1];
                return [v_1, img, new Msg(3, field, v_1)];
            }, values);
            return append_1(singleton_1(OwnTracking_renderFilterBar(toList(delay(() => append_1(makeFilterSet("Alignment", ofArray([["Order", null], ["Nature", null], ["Chaos", null]])), delay(() => append_1(makeFilterSet("Rarity", ofArray([["Legendary", null], ["Epic", null], ["Rare", null]])), delay(() => makeFilterSet("Owned", singleton(["Owned", null])))))))), dispatch)), delay(() => h));
        })))),
    });
}

