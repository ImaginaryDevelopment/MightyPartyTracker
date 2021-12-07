import { toString, Union, Record } from "../../fable_modules/fable-library.3.6.3/Types.js";
import { tuple_type, string_type, union_type, record_type, option_type, lambda_type, class_type, int32_type, unit_type } from "../../fable_modules/fable-library.3.6.3/Reflection.js";
import { TrackedHero, Soulbind$reflection, TrackedHero$reflection } from "../Schema.fs.js";
import { makeOwnedProp, heroes } from "../Hero.fs.js";
import { toSeq, FSharpMap__get_Item, add, tryPick, ofSeq, tryFind } from "../../fable_modules/fable-library.3.6.3/Map.js";
import { tryItem } from "../../fable_modules/fable-library.3.6.3/List.js";
import { sortBy, empty, singleton, append, delay, toList, tryFind as tryFind_1, map } from "../../fable_modules/fable-library.3.6.3/Seq.js";
import { join, toText, printf, toConsoleError } from "../../fable_modules/fable-library.3.6.3/String.js";
import { Cmd_none } from "../../fable_modules/Fable.Elmish.3.1.0/cmd.fs.js";
import { createElement } from "react";
import { map as map_1, defaultArg } from "../../fable_modules/fable-library.3.6.3/Option.js";
import { Interop_reactApi } from "../../fable_modules/Feliz.1.53.0/Interop.fs.js";
import { parse } from "../../fable_modules/fable-library.3.6.3/Int32.js";
import { compareArrays } from "../../fable_modules/fable-library.3.6.3/Util.js";

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
    constructor(HeroesOwned) {
        super();
        this.HeroesOwned = HeroesOwned;
    }
}

export function State$reflection() {
    return record_type("App.MightyParty.Components.OwnershipTracker.State", [], State, () => [["HeroesOwned", class_type("Microsoft.FSharp.Collections.FSharpMap`2", [int32_type, TrackedHero$reflection()])]]);
}

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["OwnedClicked", "BindLevelChange"];
    }
}

export function Msg$reflection() {
    return union_type("App.MightyParty.Components.OwnershipTracker.Msg", [], Msg, () => [[["Item", int32_type]], [["Item1", int32_type], ["Item2", int32_type]]]);
}

export const OwnTracking_heroes = heroes;

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
            return new OwnTracking_BindInfo(th, [sbs, ofSeq(map((x) => [x, tryPick((_arg1, v) => {
                if ((v.Name === x) && v.Owned) {
                    return v;
                }
                else {
                    return void 0;
                }
            }, owned)], sbs.Requirements))]);
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
            return add(i, new TrackedHero(i, true, 1, 0, matchValue[1].Name), owned);
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
            return add(i, f([o, h_1]), owned);
        }
        case 1: {
            return owned;
        }
    }
}

export function OwnTracking_init(serializer) {
    const patternInput = makeOwnedProp(serializer);
    const getOwned = patternInput[0];
    return [new Props(getOwned, patternInput[1]), new State(getOwned()), Cmd_none()];
}

export function OwnTracking_update(props, state, msg) {
    if (msg.tag === 1) {
        return [new State(OwnTracking_updateHero(state.HeroesOwned, msg.fields[0], (tupledArg) => {
            const o = tupledArg[0];
            return new TrackedHero(o.ID, o.Owned, o.Level, msg.fields[1], o.Name);
        })), Cmd_none()];
    }
    else {
        const nextOwned = OwnTracking_changeOwned(state.HeroesOwned, msg.fields[0]);
        props.SetOwned(nextOwned);
        return [new State(nextOwned), Cmd_none()];
    }
}

export function OwnTracking_renderSoulbinds(sb, binds) {
    return map((tupledArg) => {
        const name = tupledArg[0];
        const btho = tupledArg[1];
        if (btho == null) {
            return createElement("li", {
                style: {
                    display: "inline",
                    listStyleType: "circle",
                    listStylePosition: "inside",
                },
                children: toText(printf("%s"))(name),
            });
        }
        else {
            const bth = btho;
            let text;
            if (sb.ReqLvl <= bth.Level) {
                text = name;
            }
            else {
                const arg20 = (bth.Level - sb.ReqLvl) | 0;
                text = toText(printf("%s %i"))(name)(arg20);
            }
            return createElement("li", {
                style: {
                    display: "inline",
                },
                children: text,
            });
        }
    }, toSeq(binds));
}

export function OwnTracking_renderHeroView(dispatch, heroesOwned, hero) {
    const hbi = OwnTracking_getHeroBindInfo(hero, heroesOwned);
    const isOwned = defaultArg(map_1((x) => x.TrackedHero.Owned, hbi), false);
    return createElement("li", {
        ["data-owned"]: toString(isOwned),
        key: hero.ID,
        children: Interop_reactApi.Children.toArray(Array.from(toList(delay(() => append(singleton(createElement("span", {
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
            let pattern_matching_result, hbi_2;
            if (hbi != null) {
                if (hbi.TrackedHero.Owned) {
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
                    sbs = ((matchValue == null) ? empty() : OwnTracking_renderSoulbinds(matchValue[0], matchValue[1]));
                    return append(singleton(createElement("input", {
                        title: "BindLevel",
                        defaultValue: hbi_2.TrackedHero.BindLevel,
                        onChange: (ev) => {
                            dispatch(new Msg(1, hbi_2.TrackedHero.ID, parse(ev.target.value, 511, false, 32)));
                        },
                        type: "number",
                        max: "4",
                        min: "0",
                        ["aria-valuemax"]: 4,
                        ["aria-valuemin"]: 0,
                    })), delay(() => singleton(createElement("span", {
                        children: "For Next",
                        children: Interop_reactApi.Children.toArray([createElement("ul", {
                            style: {
                                display: "inline",
                            },
                            children: Interop_reactApi.Children.toArray(Array.from(sbs)),
                        })]),
                    }))));
                }
                case 1: {
                    return empty();
                }
            }
        })))))),
    });
}

export function OwnTracking_view(_arg1, state, dispatch) {
    return Array.from(map((hero) => OwnTracking_renderHeroView(dispatch, state.HeroesOwned, hero), sortBy((x) => [x.Rarity !== "Legendary", x.Name], OwnTracking_heroes, {
        Compare: (x_1, y) => compareArrays(x_1, y),
    })));
}

