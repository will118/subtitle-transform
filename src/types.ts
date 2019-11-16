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
  Italic,
  Span,
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

export interface SpanTag {
  type: TagType.Span
  // TODO: attrs
}

export type Tag = ClassTag | BoldTag | ItalicTag | SpanTag

export type CueElement = { tag: Tag, children: CueLine }
export type CueLine = Array<CueElement | string>

export interface XmlRoot {
  parent: null
  children: Array<XmlElement | string>
}

export interface XmlElement {
  name: string
  // TODO: it's actually a set of strings
  attributes: { [name: string]: any }
  isSelfClosing: boolean
  parent: Option<XmlElement | XmlRoot>
  children: Array<XmlElement | string>
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

// STYLES:
//  background and its longhand properties
//  color
//  font and its longhand properties
//  line-height
//  opacity
//  outline and its longhand properties
//  ruby-position
//  text-combine-upright
//  text-decoration and its longhand properties
//  text-shadow
//  visibility
//  white-space

type AlphaValue = number | Percentage

export interface OpacityProperty {
  opacity: AlphaValue
}

interface HexColor {
  hex: string
}

interface RGBColor {
  red: number
  green: number
  blue: number
  alpha: Option<AlphaValue>
}

interface HSLColor {
  hue: number
  saturation: Percentage
  lightness: Percentage
  alpha: Option<AlphaValue>
}

export interface ColorProperty {
  color: string | HexColor | RGBColor | HSLColor
}

export interface BackgroundColorProperty {
  backgroundColor: string
}

export interface FontStyle {
  fontStyle: 'normal' | string
}

export interface FontSize {
  fontSize: number
}

export interface FontFamily {
  fontFamily: 'sansSerif' | string
}

export type StyleProperty = OpacityProperty
  | ColorProperty
  | BackgroundColorProperty
  | FontStyle
  | FontSize
  | FontFamily

export type StyleProperties = Partial<OpacityProperty
  & ColorProperty
  & BackgroundColorProperty
  & FontStyle
  & FontSize
  & FontFamily>

export interface IdSelector {
  id: string
}

export interface ClassSelector {
  class: string
}

export interface ElementSelector {
  element: string
}

export type Selector = IdSelector | ClassSelector | ElementSelector

export interface Style {
  selector: Selector
  properties: StyleProperties
}

export interface SubtitleData {
  styles: Array<Style>
  header: Header
  blocks: Array<Block>
}
