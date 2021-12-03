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
}

