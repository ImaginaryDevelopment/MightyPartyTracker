namespace App.MightyParty.Components.OwnershipTracker

open Fable.Import

open App.MightyParty.Schema
open BHelpers

type OwnershipDatum = TrackedHero

type Props = {
    GetOwned: unit -> App.MightyParty.Schema.TrackedHeroCollection
    SetOwned: App.MightyParty.Schema.TrackedHeroCollection option -> unit
}

type State = {
    HeroesOwned: App.MightyParty.Schema.TrackedHeroCollection
    Filter: string list
}

type Msg =
    | OwnedClicked of int
    | BindLevelChange of int * int
    | LevelChange of int * int
    | FilterChange of string * string

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
            Filter = List.empty
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
        | LevelChange(id,v) ->
            let nextOwned =
                updateHero state.HeroesOwned id (fun (o,_h) ->
                    {o with Level = v}
                )
            { state with HeroesOwned = nextOwned}, Cmd.none
        | FilterChange(k,v) ->
            let filterValue = sprintf "%s-%s" k v
            let filter =
                if state.Filter |> List.contains filterValue then
                    state.Filter |> List.except [ filterValue ]
                else
                    state.Filter
                    |> List.filter(
                        function
                        |Before "-" (StartsWith k) -> false
                        | _ -> true)
                    |> List.append [ filterValue ]
            {state with Filter = filter}, Cmd.none

    let renderSoulbinds sb binds =
        let sbs =
            binds
            |> Map.toSeq
            |> Seq.map(fun (name, btho) ->
                match btho with
                | Some bth when bth.Owned ->
                    let cls,text =
                            if sb.ReqLvl <= bth.Level then
                                "has-text-warning",name
                            else "has-text-success", sprintf "%s %i" name (bth.Level - sb.ReqLvl)
                    Html.li [
                        prop.style [ style.display.inlineElement]
                        prop.text text
                        prop.className cls
                    ]
                | _ ->
                    Html.li [
                        prop.style [
                            style.display.inlineElement
                            style.listStyleType.circle
                            style.listStylePosition.inside
                        ]
                        prop.children [
                            Html.span [
                                prop.text (sprintf "%s" name)
                                prop.className [
                                    "has-text-danger"
                                ]
                            ]
                        ]
                    ]
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
                        prop.title "Level"
                        prop.defaultValue hbi.TrackedHero.Level
                        // prop.inputMode.numeric
                        prop.type' "number"
                        prop.custom("min", "0")
                        prop.ariaValueMin 0
                        prop.onChange(fun x -> dispatch(Msg.LevelChange(hbi.TrackedHero.ID, x)))
                    ]
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

    let applyFilter(heroes:Hero[]) (ownedIds:Lazy<Set<_>>) filters =
        let (|Filter|_|) =
            function
            | Before "-" f & After "-" v -> Some (f,v)
            | _ -> None
        (heroes,filters)
        ||> Seq.fold(fun heroes ->
            function
            | Filter ("Alignment",a) ->
            // | Before "-" "Alignment" & After"-" a ->
                heroes
                |> Array.filter(fun h -> h.Alignment = a)
            | Filter("Rarity", r) ->
                heroes
                |> Array.filter(fun h -> h.Rarity = r)
            | Filter("Owned", "Owned") ->
                let ownedIds = ownedIds.Value
                heroes
                |> Array.filter(fun h -> ownedIds |> Set.contains h.ID)
            | Filter(n,v) ->
                eprintfn "No Filter found for %s - %s" n v
                heroes
            | x ->
                let fName = match x with | Before "-" v -> Some v | _ -> None
                let fValue = match x with | After "-" v -> Some v | _ -> None
                eprintfn "Unrecognized filter '%A' - '%A' " fName fValue
                heroes
        )

    let renderFilterBar items dispatch =
        Html.nav[
            prop.className "navbar"
            prop.children [
                Html.div [
                    prop.className "navbar-start"
                    prop.children (
                        items
                        |> Seq.map(fun (text:string,_img:string,msg:Msg) ->
                            Html.div [
                                prop.className "navbar-item"
                                prop.children [
                                    Html.button [
                                        prop.text text
                                        prop.onClick (fun _ -> msg |> dispatch)
                                    ]
                                ]
                            ]
                        )
                        |> List.ofSeq
                    )
                ]
            ]
        ]

    let view (_,state:State) dispatch =
        let h =
            let owned = lazy(state.HeroesOwned |> Map.filter(fun k v -> v.Owned) |> Map.toSeq |> Seq.map fst |> Set.ofSeq |> fun x -> printfn "Evaluated owned"; x)
            applyFilter heroes owned state.Filter
            |> Seq.sortBy(fun x -> x.Rarity <> "Legendary", x.Rarity <> "Epic", x.Rarity <> "Rare", x.Name)
            |> Seq.map(fun hero ->
                renderHeroView dispatch state.HeroesOwned hero
            )
            |> Array.ofSeq
        Html.div[
            prop.children[
                let makeFilterSet field values=
                    values
                    |> List.map(fun (v,img) ->
                        v, img, Msg.FilterChange(field,v)
                    )
                yield renderFilterBar [
                        yield! makeFilterSet "Alignment" [
                            "Order", null
                            "Nature", null
                            "Chaos", null
                        ]
                        yield! makeFilterSet "Rarity" [
                            "Legendary", null
                            "Epic", null
                            "Rare", null
                        ]
                        yield! makeFilterSet "Owned" [
                            "Owned", null
                        ]
                    ] dispatch
                yield! h
            ]
        ]
