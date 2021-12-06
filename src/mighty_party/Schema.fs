namespace App.MightyParty.Schema

type Soulbind = {
    Requirements: string list
    ReqLvl: int
}

type Hero = {
    Image: string
    ID: int
    Name: string
    Rarity: string
    Alignment: string
    Gender: string
    Type: string
    Soulbinds: Soulbind list
} with
    static member Clone (x:Hero) =
        {
            Image = x.Image
            ID = x.ID
            Name = x.Name
            Rarity = x.Rarity
            Alignment = x.Alignment
            Gender = x.Gender
            Type = x.Type
            Soulbinds =
                x.Soulbinds
                |> Seq.map(fun mock -> {Requirements = List.ofSeq mock.Requirements; ReqLvl = mock.ReqLvl})
                |> List.ofSeq
        }

type TrackedHero = {
    ID:int
    Owned:bool // leave set values if they disown temporarily?
    Level:int
    BindLevel:int
    Name:string // error check field, not otherwise useful
} with
    static member Clone(x:TrackedHero) =
        {
            ID = x.ID
            Owned = x.Owned
            Level = x.Level
            BindLevel = x.BindLevel
            Name = x.Name
        }
// the thing that will be serialized
type HeroJS = TrackedHero
type TrackedHeroCollection = Map<int,TrackedHero>