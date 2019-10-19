export type Option<T> = T | null

export interface Metadata {
  name: string
  value: string
}

export interface Header {
  text: Option<string>
  metadata: Option<Array<Metadata>>
}

export interface CueText {
  text: string
}

export interface TimestampRange {
  start: Timestamp
  end: Timestamp
}

export interface Timestamp {
  hours: Option<number>
  minutes: Option<number>
  seconds: Option<number>
  milliseconds: Option<number>
}

export type Block = Cue | Region | Style

export interface Cue {
  range: TimestampRange
  id: Option<string>
  lines: Array<CueText>
}

export interface Region {
}

export interface Style {
}

export interface SubtitleData {
  header: Header
  blocks: Array<Block>
}
