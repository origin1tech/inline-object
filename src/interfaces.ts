
export interface IMap<T> {
  [key: string]: T;
}

export interface IInlineOptions {
  depth?: number;
  colorize?: boolean;
  castTypes?: boolean;
  transform?: (key: string, val: any) => any;
}

