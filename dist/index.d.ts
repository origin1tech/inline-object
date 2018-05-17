import { IMap, IInlineOptions } from './interfaces';
export declare class InlineObject {
    options: IInlineOptions;
    constructor(options?: IInlineOptions);
    private isValidLevel(level, depth);
    private formatter(obj, parent?, depth?, colorize?, level?);
    /**
     * Format
     * Formats the object into inline string.
     *
     * @param obj the object to be formatted.
     * @param colorize when true util.inspect colorizes value.
     */
    format(obj: IMap<any>, colorize?: boolean): any;
    /**
     * Format
     * Formats the object into inline string.
     *
     * @param obj the object to be formatted.
     * @param depth number of levels to format.
     * @param colorize when true util.inspect colorizes value.
     */
    format(obj: IMap<any>, depth?: number, colorize?: boolean): any;
    /**
     * Revert
     * Reverts a inline-object formatted string.
     *
     * @param str the string representing object to revert.
     * @param transform a transform function to run through each value.
     */
    revert<T>(str: string, transform?: (key: string, value: any) => any): T;
}
