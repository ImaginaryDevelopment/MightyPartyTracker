module Program

open Feliz
open Elmish

open BHelpers
open App.JsHelpers
open App.MightyParty.Schema

type OwnershipDatum = TrackedHero

type ChildState = {
    OwnershipTrackerData: App.MightyParty.Components.OwnershipTracker.Props * App.MightyParty.Components.OwnershipTracker.State
    JsonJenData: App.JsonGen.State
}

type ChildPage =
    | OwnTracker
    | JsonJen
    | ImportExport

type State = {
    ChildState: ChildState
    ChildPage: ChildPage
    ImportText: string
    Error: string
}

type ChildMsg =
    | OwnershipTracker of App.MightyParty.Components.OwnershipTracker.Msg
    | JsonJenMsg of App.JsonGen.Msg

type Msg =
    | ChildMsg of ChildMsg
    | PageChange of ChildPage
    | ImportTextChange of string
    | ImportClick
    | Imported of Result<State,string>

let init(serializer) =
    let props,ots,cmd = App.MightyParty.Components.OwnershipTracker.OwnTracking.init serializer
    let cmd = cmd |> Cmd.map (ChildMsg.OwnershipTracker >> Msg.ChildMsg)
    let jstate,jcmd = App.JsonGen.init()
    let jcmd = jcmd |> Cmd.map (ChildMsg.JsonJenMsg >> Msg.ChildMsg)
    let cmd = cmd @ jcmd
    let state = {
        ChildPage = ChildPage.OwnTracker
        ImportText = null
        Error = null
        ChildState = {
            OwnershipTrackerData = props,ots
            JsonJenData = jstate
        }
    }
    state, cmd

let runImport text : Async<Result<_,_>> =
    async{
        try
            let value = JsSerialization.deserialize<State> text
            return Ok value
        with ex ->
            return Error ex.Message
    }

let update (msg: Msg) (state: State): State * Cmd<Msg> =
    match msg with
    | ChildMsg(ChildMsg.OwnershipTracker msg) ->
        let next,cmd = App.MightyParty.Components.OwnershipTracker.OwnTracking.update state.ChildState.OwnershipTrackerData msg
        { state
            with ChildState = {
                    state.ChildState
                        with OwnershipTrackerData = fst state.ChildState.OwnershipTrackerData, next
                }
        }, cmd |> Cmd.map (ChildMsg.OwnershipTracker >> Msg.ChildMsg)
    | ChildMsg(ChildMsg.JsonJenMsg msg) ->
        let next,cmd = App.JsonGen.update msg state.ChildState.JsonJenData
        { state with ChildState = { state.ChildState with JsonJenData = next
        }}, cmd |> Cmd.map (ChildMsg.JsonJenMsg >> Msg.ChildMsg)
    | PageChange x ->
        {state with ChildPage = x}, Cmd.none
    | ImportTextChange x ->
        {state with ImportText = x}, Cmd.none
    | ImportClick ->
        {state with ImportText = null},Cmd.OfAsync.perform runImport state.ImportText Msg.Imported
    | Imported (Ok next) ->
        next, Cmd.none
    | Imported (Error msg) ->
        {state with Error = msg}, Cmd.none

let renderNav dispatch =
    let navItem (text:string) pg =
        Html.a [
            prop.className "navbar-item"
            prop.text text
            prop.onClick (fun _ -> dispatch <| Msg.PageChange pg)
        ]
    Html.nav [
        prop.className "navbar"
        prop.children [
            Html.div [
                prop.className "navbar-menu"
                prop.children [
                    Html.div [
                        prop.className "navbar-start"
                        prop.children [
                            navItem "MightyTracker" ChildPage.OwnTracker
                            navItem "Json-Jen" ChildPage.JsonJen
                            navItem "Import/Export" ChildPage.ImportExport
                        ]
                    ]
                ]
            ]
        ]
    ]

let renderImportExport (state:State) dispatch =
    let eText = {state with ImportText = null} |> JsSerialization.serialize
    Html.div [
        Html.input [
            prop.defaultValue state.ImportText
            prop.onChange (Msg.ImportTextChange >> dispatch)
        ]
        Html.button [
            prop.text "Import"
            match state.ImportText with
            | ValueString _ ->
                prop.onClick (fun _ -> Msg.ImportClick |> dispatch)
            | _ -> ()
        ]
        Html.pre [
            prop.text eText
        ]
    ]

let render (state: State) (dispatch: Msg -> unit) =
    Html.div [
        renderNav dispatch
        Html.div [
            match state.Error with
            | ValueString e ->
                yield Html.span [
                    prop.className "is-red"
                    prop.text e
                ]
            | _ -> ()
            match state.ChildPage with
            | ChildPage.OwnTracker ->
                let lis = App.MightyParty.Components.OwnershipTracker.OwnTracking.view state.ChildState.OwnershipTrackerData (ChildMsg.OwnershipTracker >> Msg.ChildMsg >> dispatch)
                yield Html.ul [
                    yield! lis
                ]
            | ChildPage.JsonJen ->
                let v = App.JsonGen.view state.ChildState.JsonJenData (ChildMsg.JsonJenMsg >> Msg.ChildMsg >> dispatch)
                yield v
            | ChildPage.ImportExport ->
                let v = renderImportExport state dispatch
                yield v
        ]
    ]

open Elmish.React
let s = {
    new BHelpers.ISerializer with
        member _.Serialize<'t> (x:'t) : string = JsSerialization.serialize x
        member _.Deserialize<'t>(x:string) : 't = JsSerialization.deserialize<'t> x
}

Program.mkProgram (fun () -> init s) update render
|> Program.withReactBatched "feliz-app"
|> Program.withConsoleTrace
|> Elmish.Program.run

// open Browser.Dom
// ReactDOM.render(Counter(), document.getElementById "feliz-app")