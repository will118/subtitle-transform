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

export interface Percentage {
  value: number
}

export interface VerticalSetting {
  vertical: Option<'rl' | 'lr'>
}

export interface LineSetting {
  line: Option<number | Percentage>
}

export interface PositionSetting {
  position: Option<Percentage>
}

export interface SizeSetting {
  size: Option<Percentage>
}

export interface AlignSetting {
  align: Option<'start' | 'middle' | 'end'>
}

export type CueSetting =
  VerticalSetting | LineSetting | PositionSetting | SizeSetting | AlignSetting

export type CueSettings =
  VerticalSetting & LineSetting & PositionSetting & SizeSetting & AlignSetting

export type Block = Cue | Region

export interface Cue {
  range: TimestampRange
  id: Option<string>
  lines: Array<CueLine>
  settings: CueSettings
}

export interface Region {
}

export interface Style {
  name: string
}

export interface StyleTree {
  styles: Array<Style>
}

export interface SubtitleData {
  styles: StyleTree
  header: Header
  blocks: Array<Block>
}
