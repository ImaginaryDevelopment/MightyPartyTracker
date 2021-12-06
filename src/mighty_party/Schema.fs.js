import { Record } from "../fable_modules/fable-library.3.6.3/Types.js";
import { bool_type, record_type, int32_type, list_type, string_type } from "../fable_modules/fable-library.3.6.3/Reflection.js";
import { ofSeq } from "../fable_modules/fable-library.3.6.3/List.js";
import { map } from "../fable_modules/fable-library.3.6.3/Seq.js";

export class Soulbind extends Record {
    constructor(Requirements, ReqLvl) {
        super();
        this.Requirements = Requirements;
        this.ReqLvl = (ReqLvl | 0);
    }
}

export function Soulbind$reflection() {
    return record_type("App.MightyParty.Schema.Soulbind", [], Soulbind, () => [["Requirements", list_type(string_type)], ["ReqLvl", int32_type]]);
}

export class Hero extends Record {
    constructor(Image, ID, Name, Rarity, Alignment, Gender, Type, Soulbinds) {
        super();
        this.Image = Image;
        this.ID = (ID | 0);
        this.Name = Name;
        this.Rarity = Rarity;
        this.Alignment = Alignment;
        this.Gender = Gender;
        this.Type = Type;
        this.Soulbinds = Soulbinds;
    }
}

export function Hero$reflection() {
    return record_type("App.MightyParty.Schema.Hero", [], Hero, () => [["Image", string_type], ["ID", int32_type], ["Name", string_type], ["Rarity", string_type], ["Alignment", string_type], ["Gender", string_type], ["Type", string_type], ["Soulbinds", list_type(Soulbind$reflection())]]);
}

export function Hero_Clone_2B7B77A3(x) {
    return new Hero(x.Image, x.ID, x.Name, x.Rarity, x.Alignment, x.Gender, x.Type, ofSeq(map((mock) => (new Soulbind(ofSeq(mock.Requirements), mock.ReqLvl)), x.Soulbinds)));
}

export class TrackedHero extends Record {
    constructor(ID, Owned, Level, BindLevel, Name) {
        super();
        this.ID = (ID | 0);
        this.Owned = Owned;
        this.Level = (Level | 0);
        this.BindLevel = (BindLevel | 0);
        this.Name = Name;
    }
}

export function TrackedHero$reflection() {
    return record_type("App.MightyParty.Schema.TrackedHero", [], TrackedHero, () => [["ID", int32_type], ["Owned", bool_type], ["Level", int32_type], ["BindLevel", int32_type], ["Name", string_type]]);
}

export function TrackedHero_Clone_3D5B87CD(x) {
    return new TrackedHero(x.ID, x.Owned, x.Level, x.BindLevel, x.Name);
}

