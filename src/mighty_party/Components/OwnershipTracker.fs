namespace App.MightyParty.Components.OwnershipTracker

open Fable.Import

open App.MightyParty.Schema

type OwnershipDatum = TrackedHero

type Props = {
    GetOwned: unit -> App.MightyParty.Schema.TrackedHeroCollection
    SetOwned: App.MightyParty.Schema.TrackedHeroCollection option -> unit
}

type State = {
    HeroesOwned: App.MightyParty.Schema.TrackedHeroCollection
}

type Msg =
    | OwnedClicked of int
    | BindLevelChange of int * int

module OwnTracking =
    open Elmish
    open Feliz
    let heroes = App.MightyParty.Hero.heroes
    type BindInfo = {   TrackedHero:TrackedHero
                        Soulbind:(Soulbind*Map<string,TrackedHero option> ) option
                    }

    let getHeroBindInfo (hero:Hero) (owned:TrackedHeroCollection) =
        match owned |> Map.tryFind hero.ID with
        | Some th ->
            match hero.Soulbinds |> List.tryItem th.BindLevel with
            | Some sbs ->
                let bo =
                    sbs.Requirements
                    |> Seq.map(fun x ->
                        x, owned |> Map.tryPick(fun _ v -> if  v.Name = x && v.Owned then Some v else None)
                    )
                    |> Map.ofSeq

                Some {
                    TrackedHero = th
                    Soulbind = Some (sbs,bo)
                }
            | None -> Some { TrackedHero = th; Soulbind = None }
        | None -> None

    let changeOwned (owned:TrackedHeroCollection,i) =
        match owned |> Map.tryFind i, heroes |> Seq.tryFind(fun h -> h.ID = i) with
        | Some x, _ -> owned |> Map.add i {x with Owned= not owned.[i].Owned}
        | None, Some h -> owned |> Map.add i {Owned = true; ID=i; Level=1;BindLevel=0;Name=h.Name}
        | None, None ->
            eprintfn "Failed to find hero ID %i to changeOwned" i
            owned

    let updateHero (owned:TrackedHeroCollection) i f =
        match owned |> Map.tryFind i, heroes |> Seq.tryFind(fun h -> h.ID = i) with
        | Some o, Some h ->
            let updated = f(o,h)
            owned
            |> Map.add i updated
        | _ -> owned

    let init(serializer) =
        let getOwned,setOwned = App.MightyParty.Hero.makeOwnedProp serializer
        let owned = getOwned()
        let props = {
            GetOwned = getOwned
            SetOwned = setOwned
        }
        let state = {
            HeroesOwned = owned
        }
        props,state,Cmd.none

    let update (props,state) (msg: Msg) : State * Cmd<Msg> =
        match msg with
        | OwnedClicked(x) ->
            let nextOwned = changeOwned (state.HeroesOwned,x)
            props.SetOwned (Some nextOwned)
            { state with HeroesOwned = nextOwned }, Cmd.none
        | BindLevelChange(id,v) ->
            let nextOwned =
                updateHero state.HeroesOwned id (fun (o,_h) ->
                    {o with BindLevel = v}
                )
            { state with HeroesOwned = nextOwned}, Cmd.none

    let renderSoulbinds sb binds =
        let sbs =
            binds
            |> Map.toSeq
            |> Seq.map(fun (name, btho) ->
                match btho with
                | Some bth ->
                    let text =
                            if sb.ReqLvl <= bth.Level then
                                name
                            else sprintf "%s %i" name (bth.Level - sb.ReqLvl)
                    Html.li [
                        prop.style [ style.display.inlineElement]
                        prop.text text
                    ]
                | None -> Html.li [
                    prop.style [
                        style.display.inlineElement
                        style.listStyleType.circle
                        style.listStylePosition.inside
                    ]
                    prop.text (sprintf "%s" name)]
            )
        sbs
    let renderHeroView dispatch heroesOwned hero =
        let hbi = getHeroBindInfo hero heroesOwned
        let isOwned = hbi |> Option.map(fun x -> x.TrackedHero.Owned) |> Option.defaultValue false

        Html.li[
            prop.custom("data-owned", string isOwned)
            prop.key hero.ID
            prop.children [
                // not sure if this a referrer or http/https or some other issue
                // Html.img [
                //     let img = sprintf "http%s" hero.Image.[5..]
                //     prop.src img
                // ]
                yield Html.img [
                    prop.src (sprintf "images/%i.png" hero.ID)
                ]
                yield Html.span [
                    prop.onClick (fun _ -> dispatch (OwnedClicked hero.ID))
                    prop.children[
                        Html.input[
                            prop.type' "checkbox"
                            prop.isChecked isOwned
                        ]
                        Html.span[
                            prop.classes [
                                hero.Rarity
                            ]
                            prop.text hero.Name
                        ]
                    ]
                ]
                match hbi with
                | Some hbi when hbi.TrackedHero.Owned ->
                    let sbs =
                        match hbi.Soulbind with
                        | Some (sb,binds) ->
                            renderSoulbinds sb binds
                        | None -> Seq.empty

                    yield Html.input [
                        prop.title "BindLevel"
                        prop.defaultValue hbi.TrackedHero.BindLevel
                        prop.onChange (fun (x:string) -> dispatch (BindLevelChange(hbi.TrackedHero.ID, int x)))
                        prop.type' "number"
                        prop.custom("max","4")
                        prop.custom("min","0")
                        prop.ariaValueMax 4
                        prop.ariaValueMin 0
                    ]
                    yield Html.span [
                        prop.text "For Next"
                        prop.children [
                            Html.ul [
                                prop.style [ style.display.inlineElement]
                                prop.children sbs
                            ]
                        ]
                    ]
                | _ -> ()
            ]
        ]
    let view (_,state:State) dispatch =
        heroes
        |> Seq.sortBy(fun x -> x.Rarity <> "Legendary", x.Name)
        |> Seq.map(fun hero ->
            renderHeroView dispatch state.HeroesOwned hero
        )
        |> Array.ofSeq