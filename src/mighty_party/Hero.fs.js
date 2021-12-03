import mightypartyheroes from "./mightypartyheroes.json?module";
import { printf, toConsole } from "../fable_modules/fable-library.3.6.3/String.js";
import { map, sortBy } from "../fable_modules/fable-library.3.6.3/Array.js";
import { ofSeq } from "../fable_modules/fable-library.3.6.3/List.js";
import { map as map_1 } from "../fable_modules/fable-library.3.6.3/Seq.js";
import { Hero, Soulbind } from "./Schema.fs.js";
import { comparePrimitives } from "../fable_modules/fable-library.3.6.3/Util.js";
import { makeStorageProp } from "../JsHelpers.fs.js";

export const JSON$ = JSON;

export const heroes = (() => {
    const jsonObj = mightypartyheroes;
    toConsole(printf("maybe?"));
    toConsole(printf("Found some json? %A"))(jsonObj);
    return sortBy((hero) => hero.Name, map((x) => {
        const mock = x;
        return new Hero(mock.Image, mock.ID, mock.Name, mock.Rarity, mock.Alignment, mock.Gender, mock.Type, ofSeq(map_1((mock_1) => (new Soulbind(ofSeq(mock_1.Requirements), mock_1.ReqLvl)), mock.Soulbinds)));
    }, jsonObj), {
        Compare: (x_1, y) => comparePrimitives(x_1, y),
    });
})();

export function makeOwnedProp() {
    const ser = (items) => JSON$.stringify(items);
    const de = (text) => JSON$.parse(text);
    return makeStorageProp("Hero.OwnedHeroes", ser, de);
}

