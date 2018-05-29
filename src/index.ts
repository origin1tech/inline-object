
import { IMap, IInlineOptions } from './interfaces';
import { isPlainObject, isArray, extend, isString, isValue, isBoolean, set, castType, getType } from 'chek';
import { inspect } from 'util';
import * as strip from 'strip-ansi';

const DEFAULTS: IInlineOptions = {
  depth: null,  // depth to be parsed.
  colorize: false,  // whether to use colors.
  showHidden: false, // whether to show hidden/empty properties.
  castTypes: true,  // trys to cast to type when reverting, transform for more control.
  transform: (k, v) => v // transform method to use for reverting.
};

export class InlineObject {

  options: IInlineOptions;

  constructor(options?: IInlineOptions) {
    this.options = extend({}, DEFAULTS, options);
  }

  private isValidLevel(level: number, depth: number) {
    if (!isValue(depth)) // if depth isn't defined return true.
      return true;
    return level <= depth;
  }

  private formatter(obj: IMap<any>, parent?: string, depth?: number, colorize?: boolean, level?: number) {

    let args = [];

    level = (level || 0) + 1;

    for (const k in obj) {

      let val = obj[k];

      if (isPlainObject(val) || isArray(val)) {

        if (isArray(val)) {

          val.forEach((v, i) => {

            const key = `${k}[${i}]`;

            if (isPlainObject(v)) {
              if (this.isValidLevel(level, depth))
                args = args.concat(this.formatter(v, key, depth, colorize, level + 1));
            }

            else if (isArray(v)) {
              const tmpObj = {};
              tmpObj[key] = v;
              args = args.concat(this.formatter(tmpObj, null, depth, colorize, level + 1));
            }

            else {
              if (this.isValidLevel(level, depth))
                args.push(`${key}=${inspect(v, this.options.showHidden, null, colorize)}`);
            }

          });

        }

        else {
          const key = parent ? `${parent}.${k}` : k;
          if (this.isValidLevel(level, depth))
            args = args.concat(this.formatter(val, key, depth, colorize, level));
        }

      }

      else {
        const key = parent ? `${parent}.${k}` : k;
        args.push(`${key}=${inspect(val, this.options.showHidden, null, colorize)}`);
      }

    }

    return args.join(' ');

  }

  /**
   * Format
   * Formats the object into inline string.
   *
   * @param obj the object to be formatted.
   * @param colorize when true util.inspect colorizes value.
   */
  format(obj: IMap<any>, colorize?: boolean);

  /**
   * Format
   * Formats the object into inline string.
   *
   * @param obj the object to be formatted.
   * @param depth number of levels to format.
   * @param colorize when true util.inspect colorizes value.
   */
  format(obj: IMap<any>, depth?: number, colorize?: boolean);

  format(obj: IMap<any>, depth?: number | boolean, colorize?: boolean) {
    if (isBoolean(depth)) {
      colorize = <boolean>depth;
      depth = undefined;
    }
    depth = isValue(depth) ? depth : this.options.depth;
    colorize = colorize || this.options.colorize;
    return this.formatter(obj, null, <number>depth, colorize);
  }

  /**
   * Revert
   * Reverts a inline-object formatted string.
   *
   * @param str the string representing object to revert.
   * @param transform a transform function to run through each value.
   */
  revert<T>(str: string, transform?: (key: string, value: any) => any): T {

    let tmp: any = {};
    transform = transform || this.options.transform;

    str = strip(str); // strip ansi codes from string.
    const arr = str.match(/\\?.|^$/g).reduce((p: any, c) => {
      if (c === '"' || c === "'") {
        p.quote ^= 1;
      } else if (!p.quote && c === ' ') {
        p.a.push('');
      } else {
        p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
      }
      return p;
    }, { a: [''] }).a;

    arr.forEach((v) => {
      const kv = v.split('=');
      const key = kv[0];
      let val = kv[1]; // strip ansi escape codes.
      if (this.options.castTypes) { // cast to type if enabled.
        const type = getType(val);
        val = castType(val, type, val);
      }
      val = transform(key, val); // call user transform.
      tmp = set(tmp, key, val);
    });

    return tmp as T;

  }

}


