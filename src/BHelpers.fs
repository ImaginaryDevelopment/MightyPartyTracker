module BHelpers

open System

type ISerializer =
    abstract member Serialize<'t> : 't -> string
    abstract member Deserialize<'t> : string -> 't

let (|ValueString|_|) =
    function
    | null -> None
    | "" -> None
    | x when String.IsNullOrWhiteSpace x -> None
    | x -> Some x

let pascal =
    function
    |ValueString x ->
        ((List.empty,false),x.ToCharArray())
        ||> Array.fold(fun (v,foundLetter) c ->
            if foundLetter then
                (c::v,true)
            else
                if Char.IsLetter c then
                    (Char.ToUpper c :: v, true)
                else (c::v,false)
        )
        |> fst
        |> List.rev
        |> Array.ofList
        |> String
    | x -> x