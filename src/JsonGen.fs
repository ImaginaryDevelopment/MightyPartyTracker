module App.JsonGen

open Elmish
open Feliz

open BHelpers

type State = {
    Text:string
}

type Msg = Textchange of string

module Reflection =
    open Fable.Core.JS
    open Fable.Core.JsInterop
    open JsHelpers

    type MappedType =
        | Arr of obj[]
        | Obj of obj * string[]
        | Str of string
        | Num of float

    let getType (x:obj) =
        match x with
        | null -> None
        | _ ->
            if Constructors.Array.isArray x then
                x :?> obj[]
                |> Arr
            // elif Constructors.Number.isNaN(x) |> not then
            //     x :?> float
            //     |> Num
            elif x = typeof<string> then
                x :?> string
                |> Str
            else
                match x with
                | :? string as s -> Str s
                | :? int as i -> Num i
                | :? float as f -> Num f
                | _ ->
                    (x, Constructors.Object.keys(x) |> Seq.toArray)
                    |> Obj
            |> Some

    let generateFs(x) =
        let rec gen (x:MappedType): string=
            printfn "Genning %A" x
            match x with
            | Arr items ->
                items |> Seq.tryHead
                |> function
                    | Some h ->
                        getType h
                        |> Option.map gen
                        |> Option.map (sprintf "%s[]")
                        |> Option.defaultValue "obj[]"
                    | None -> "obj[]"
            | Obj (o,keys) ->
                printfn "Getting keys"
                printfn "Keys are %A" keys
                keys
                |> Seq.map(fun k ->
                    let value : obj = App.JsHelpers.Object.getItem k o
                    printfn "Value of %s[%A] = %s" k value <| JsSerialization.serialize value
                    let kt = getType value
                    printfn "Found prop %s has type %A" k kt
                    kt
                    |> Option.map gen
                    |> Option.map (sprintf "%s: %s" k)
                    |> Option.defaultValue (sprintf "%s:obj" k)
                )
                |> String.concat "\r\n"
                |> sprintf "{ %s }"
            | Num _ -> "float"
            | Str _ -> "string"

        gen x

let init(): State * Cmd<Msg> =
    { Text = null }, Cmd.none

let update msg state =
    match msg with
    | Textchange x -> {state with Text = x}, Cmd.none

open App.JsHelpers.JsSerialization
let generate text =
    try
        deserialize<obj> text
        |> Ok
    with ex -> Error ex.Message
let view state dispatch =
    Html.div[
        prop.children [
            Html.h1 "Json Jen"
            Html.div [
                prop.children [
                    Html.textarea[
                        prop.defaultValue state.Text
                        prop.style [
                            style.minHeight 100
                            style.minWidth 200
                        ]
                        prop.onChange (Msg.Textchange >> dispatch)
                    ]
                    Html.div [
                        match state.Text with
                        | ValueString x -> generate x
                        | _ -> Ok null
                        |> function
                            | Ok null -> prop.text null
                            | Ok x ->
                                Reflection.getType x
                                |> Option.map Reflection.generateFs
                                |> Option.defaultValue "?"
                                |> prop.text
                            | Error msg -> prop.text msg
                    ]
                ]
            ]
        ]
    ]