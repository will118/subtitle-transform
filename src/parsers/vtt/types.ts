export type Position = { i: number, line: number }

export type ParseFn<T> = (body: string, pos: Position) => T
