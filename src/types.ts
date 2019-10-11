export interface Header {
  text: string | null
}

export interface Line {
  text: string
}

export interface Timestamp {
  hours: number | null
  minutes: number | null
  seconds: number | null
}

export interface Cue {
  start: Timestamp
  end: Timestamp
  id: string | null
  lines: Array<Line>
}

export interface SubtitleData {
  header: Header
  cues: Array<Cue>
}
