export type Option<T> = T | null

export interface Metadata {
  name: string
  value: string
}

export interface Header {
  text: Option<string>
  metadata: Option<Array<Metadata>>
}

export enum TagType {
  Class,
  Bold,
  Italic
}

export interface ClassTag {
  type: TagType.Class
  className: string
}

export interface BoldTag {
  type: TagType.Bold
}

export interface ItalicTag {
  type: TagType.Italic
}

export type Tag = ClassTag | BoldTag | ItalicTag

export type CueElement = CueLine & { tag: Tag }

// Root
export interface CueLine {
  children: Array<CueElement | string>
}

export interface TimestampRange {
  start: Timestamp
  end: Timestamp
}

export interface Timestamp {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export type Block = Cue | Region | Style

export interface Cue {
  range: TimestampRange
  id: Option<string>
  lines: Array<CueLine>
}

export interface Region {
}

export interface Style {
}

export interface SubtitleData {
  header: Header
  blocks: Array<Block>
}
