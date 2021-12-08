module App.JsonGen

open Elmish
open Feliz

open BHelpers

type GenType =
    | ``F#``
    | ``C#``
    with
        static member All =
            [
                ``F#``
                ``C#``
            ]
type State = {
    Text:string
    GenType: GenType
}

type Msg =
    | TextChange of string
    | TypeChange of GenType

module Reflection =
    open Fable.Core.JS
    open Fable.Core.JsInterop
    open JsHelpers

    type MappedType =
        | Arr of obj[]
        | Obj of obj * string[]
        | Str of string
        | Num of float

    let getKeyValue (o:obj) k =
        let value = App.JsHelpers.Object.getItem k o
        // printfn "Value of %s[%A] = %s" k value <| JsSerialization.serialize value
        value

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

    let generateCs(x): string=
        let rec gen (x:MappedType): string=
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
                keys
                |> Seq.map(fun k ->
                    let kt = getKeyValue o k
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

    let generateFs(x): string=
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
                    let kt = getKeyValue o k
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

    type GenResult = {
        Name: string
        Types: GenResult list
        TypeName: string
    }
    let generateFs2 : _ -> GenResult =
        let rec gen name (x:MappedType) : GenResult =
            match x with
            | Arr items ->
                printfn "Arr:%s" name
                items
                |> Seq.tryHead
                |> Option.bind getType
                |> Option.map(gen name>>fun x -> {x with TypeName=sprintf "%s[]" x.TypeName})
                |> Option.defaultValue {
                    Name= name
                    TypeName="obj[]"
                    Types=List.empty
                }
            | Obj (o,keys) ->
                printfn "Object %s" name
                let t =
                    keys
                    |> Seq.map(fun k ->
                        getKeyValue o k
                        |> Option.bind getType
                        |> Option.map(gen k)
                        |> Option.defaultValue {
                            Name= k
                            TypeName= "obj"
                            Types= List.empty
                        }
                    )
                    |> List.ofSeq
                {
                    Name=name
                    TypeName= pascal name
                    Types = t
                }
            |Num _ -> {TypeName = "float";Name=name; Types=List.empty}
            |Str _ -> {TypeName = "string";Name=name; Types=List.empty}
        fun x -> gen "Foo" x

    let rec mapResultFs {Name=name;TypeName=_self;Types=t} =
        match t with
        | [] -> ""
        | _ ->
            [
                yield! t |> List.map mapResultFs
                yield sprintf "type %s = {" name
                yield t |> List.map(fun x -> sprintf "\t%s: %s" x.Name x.TypeName) |> String.concat "\r\n"
                yield "}"
            ]
            |> String.concat "\r\n"
    let rec mapResultCs  {Name=name;TypeName=_self;Types=t} =
        match t with
        | [] -> ""
        | _ ->
            [
                yield! t |> List.map mapResultFs
                yield sprintf "puclic record %s {" name
                yield t |> List.map(fun x -> sprintf "\tpublic %s %s" x.TypeName x.Name) |> String.concat "\r\n"
                yield "}"
            ]
            |> String.concat "\r\n"

let init(): State * Cmd<Msg> =
    { Text = null; GenType=``F#``}, Cmd.none

let update msg state =
    match msg with
    | TextChange x -> {state with Text = x}, Cmd.none
    | TypeChange x -> {state with GenType = x}, Cmd.none

open App.JsHelpers.JsSerialization
let generate text =
    try
        deserialize<obj> text
        |> Ok
    with ex -> Error ex.Message

let generateView f oOpt =
    Html.pre [
        oOpt
        |> function
            | Ok null -> prop.text null
            | Ok x ->
                Reflection.getType x
                |> Option.map f
                |> Option.defaultValue "?"
                |> prop.text
            | Error (msg:string) -> prop.text msg
    ]


let view state dispatch =
    Html.div[
        prop.children [
            Html.h1 "Json Jen"
            Html.nav [
                Html.div [
                    prop.className "nav-start"
                    prop.children[
                        Html.select [
                            prop.value (string state.GenType)
                            // prop.onSelect(fun (e:Browser.Types.Event) -> Msg.TypeChange ``C#`` |> dispatch)
                            prop.children (
                                GenType.All
                                |> List.map(fun x ->
                                    let s = string x
                                    Html.option [
                                        prop.value s
                                        prop.text s
                                        prop.selected (state.GenType = x)
                                    ]
                                )
                            )

                        ]
                    ]
                ]
            ]
            Html.div [
                prop.children [
                    Html.textarea[
                        prop.defaultValue state.Text
                        prop.style [
                            style.minHeight 100
                            style.minWidth 200
                        ]
                        prop.onChange (Msg.TextChange >> dispatch)
                    ]
                    let oOpt =
                        match state.Text with
                        | ValueString x -> generate x
                        | _ -> Ok null
                    let f =
                        match state.GenType with
                        | ``F#`` -> Reflection.mapResultFs
                        | ``C#`` -> Reflection.mapResultCs
                    generateView (
                        Reflection.generateFs2
                        >> fun x ->
                            serialize x
                            |> printfn "Generated as %s"
                            x
                        >> Reflection.mapResultFs) oOpt
                    Html.br []
                    generateView Reflection.generateFs oOpt
                ]
            ]
        ]
    ]