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