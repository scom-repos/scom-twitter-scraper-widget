declare module "moment"{
    /**
 * @param strict Strict parsing disables the deprecated fallback to the native Date constructor when
 * parsing a string.
 */
 function moment(inp?: moment.MomentInput, strict?: boolean): moment.Moment;
/**
 * @param strict Strict parsing requires that the format and input match exactly, including delimiters.
 * Strict parsing is frequently the best parsing option. For more information about choosing strict vs
 * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
 */
 function moment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean): moment.Moment;
/**
 * @param strict Strict parsing requires that the format and input match exactly, including delimiters.
 * Strict parsing is frequently the best parsing option. For more information about choosing strict vs
 * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
 */
 function moment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): moment.Moment;

 namespace moment {
  type RelativeTimeKey = 's' | 'ss' | 'm' | 'mm' | 'h' | 'hh' | 'd' | 'dd' | 'w' | 'ww' | 'M' | 'MM' | 'y' | 'yy';
  type CalendarKey = 'sameDay' | 'nextDay' | 'lastDay' | 'nextWeek' | 'lastWeek' | 'sameElse' | string;
  type LongDateFormatKey = 'LTS' | 'LT' | 'L' | 'LL' | 'LLL' | 'LLLL' | 'lts' | 'lt' | 'l' | 'll' | 'lll' | 'llll';

  interface Locale {
    calendar(key?: CalendarKey, m?: Moment, now?: Moment): string;

    longDateFormat(key: LongDateFormatKey): string;
    invalidDate(): string;
    ordinal(n: number): string;

    preparse(inp: string): string;
    postformat(inp: string): string;
    relativeTime(n: number, withoutSuffix: boolean,
                 key: RelativeTimeKey, isFuture: boolean): string;
    pastFuture(diff: number, absRelTime: string): string;
    set(config: Object): void;

    months(): string[];
    months(m: Moment, format?: string): string;
    monthsShort(): string[];
    monthsShort(m: Moment, format?: string): string;
    monthsParse(monthName: string, format: string, strict: boolean): number;
    monthsRegex(strict: boolean): RegExp;
    monthsShortRegex(strict: boolean): RegExp;

    week(m: Moment): number;
    firstDayOfYear(): number;
    firstDayOfWeek(): number;

    weekdays(): string[];
    weekdays(m: Moment, format?: string): string;
    weekdaysMin(): string[];
    weekdaysMin(m: Moment): string;
    weekdaysShort(): string[];
    weekdaysShort(m: Moment): string;
    weekdaysParse(weekdayName: string, format: string, strict: boolean): number;
    weekdaysRegex(strict: boolean): RegExp;
    weekdaysShortRegex(strict: boolean): RegExp;
    weekdaysMinRegex(strict: boolean): RegExp;

    isPM(input: string): boolean;
    meridiem(hour: number, minute: number, isLower: boolean): string;
  }

  interface StandaloneFormatSpec {
    format: string[];
    standalone: string[];
    isFormat?: RegExp;
  }

  interface WeekSpec {
    dow: number;
    doy?: number;
  }

  type CalendarSpecVal = string | ((m?: MomentInput, now?: Moment) => string);
  interface CalendarSpec {
    sameDay?: CalendarSpecVal;
    nextDay?: CalendarSpecVal;
    lastDay?: CalendarSpecVal;
    nextWeek?: CalendarSpecVal;
    lastWeek?: CalendarSpecVal;
    sameElse?: CalendarSpecVal;

    // any additional properties might be used with moment.calendarFormat
    [x: string]: CalendarSpecVal | void; // undefined
  }

  type RelativeTimeSpecVal = (
    string |
    ((n: number, withoutSuffix: boolean,
      key: RelativeTimeKey, isFuture: boolean) => string)
  );
  type RelativeTimeFuturePastVal = string | ((relTime: string) => string);

  interface RelativeTimeSpec {
    future?: RelativeTimeFuturePastVal;
    past?: RelativeTimeFuturePastVal;
    s?: RelativeTimeSpecVal;
    ss?: RelativeTimeSpecVal;
    m?: RelativeTimeSpecVal;
    mm?: RelativeTimeSpecVal;
    h?: RelativeTimeSpecVal;
    hh?: RelativeTimeSpecVal;
    d?: RelativeTimeSpecVal;
    dd?: RelativeTimeSpecVal;
    w?: RelativeTimeSpecVal
    ww?: RelativeTimeSpecVal;
    M?: RelativeTimeSpecVal;
    MM?: RelativeTimeSpecVal;
    y?: RelativeTimeSpecVal;
    yy?: RelativeTimeSpecVal;
  }

  interface LongDateFormatSpec {
    LTS: string;
    LT: string;
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;

    // lets forget for a sec that any upper/lower permutation will also work
    lts?: string;
    lt?: string;
    l?: string;
    ll?: string;
    lll?: string;
    llll?: string;
  }

  type MonthWeekdayFn = (momentToFormat: Moment, format?: string) => string;
  type WeekdaySimpleFn = (momentToFormat: Moment) => string;
  interface EraSpec {
    since: string | number;
    until: string | number;
    offset: number;
    name: string;
    narrow: string;
    abbr: string;
  }

  interface LocaleSpecification {
    months?: string[] | StandaloneFormatSpec | MonthWeekdayFn;
    monthsShort?: string[] | StandaloneFormatSpec | MonthWeekdayFn;

    weekdays?: string[] | StandaloneFormatSpec | MonthWeekdayFn;
    weekdaysShort?: string[] | StandaloneFormatSpec | WeekdaySimpleFn;
    weekdaysMin?: string[] | StandaloneFormatSpec | WeekdaySimpleFn;

    meridiemParse?: RegExp;
    meridiem?: (hour: number, minute:number, isLower: boolean) => string;

    isPM?: (input: string) => boolean;

    longDateFormat?: LongDateFormatSpec;
    calendar?: CalendarSpec;
    relativeTime?: RelativeTimeSpec;
    invalidDate?: string;
    ordinal?: (n: number) => string;
    ordinalParse?: RegExp;

    week?: WeekSpec;
    eras?: EraSpec[];

    // Allow anything: in general any property that is passed as locale spec is
    // put in the locale object so it can be used by locale functions
    [x: string]: any;
  }

  interface MomentObjectOutput {
    years: number;
    /* One digit */
    months: number;
    /* Day of the month */
    date: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  }

  interface argThresholdOpts {
    ss?: number;
    s?: number;
    m?: number;
    h?: number;
    d?: number;
    w?: number | void;
    M?: number;
  }

  interface Duration {
    clone(): Duration;

    humanize(argWithSuffix?: boolean, argThresholds?: argThresholdOpts): string;
    
    humanize(argThresholds?: argThresholdOpts): string;

    abs(): Duration;

    as(units: unitOfTime.Base): number;
    get(units: unitOfTime.Base): number;

    milliseconds(): number;
    asMilliseconds(): number;

    seconds(): number;
    asSeconds(): number;

    minutes(): number;
    asMinutes(): number;

    hours(): number;
    asHours(): number;

    days(): number;
    asDays(): number;

    weeks(): number;
    asWeeks(): number;

    months(): number;
    asMonths(): number;

    years(): number;
    asYears(): number;

    add(inp?: DurationInputArg1, unit?: DurationInputArg2): Duration;
    subtract(inp?: DurationInputArg1, unit?: DurationInputArg2): Duration;

    locale(): string;
    locale(locale: LocaleSpecifier): Duration;
    localeData(): Locale;

    toISOString(): string;
    toJSON(): string;

    isValid(): boolean;

    /**
     * @deprecated since version 2.8.0
     */
    lang(locale: LocaleSpecifier): Moment;
    /**
     * @deprecated since version 2.8.0
     */
    lang(): Locale;
    /**
     * @deprecated
     */
    toIsoString(): string;
  }

  interface MomentRelativeTime {
    future: any;
    past: any;
    s: any;
    ss: any;
    m: any;
    mm: any;
    h: any;
    hh: any;
    d: any;
    dd: any;
    M: any;
    MM: any;
    y: any;
    yy: any;
  }

  interface MomentLongDateFormat {
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;
    LT: string;
    LTS: string;

    l?: string;
    ll?: string;
    lll?: string;
    llll?: string;
    lt?: string;
    lts?: string;
  }

  interface MomentParsingFlags {
    empty: boolean;
    unusedTokens: string[];
    unusedInput: string[];
    overflow: number;
    charsLeftOver: number;
    nullInput: boolean;
    invalidMonth: string | void; // null
    invalidFormat: boolean;
    userInvalidated: boolean;
    iso: boolean;
    parsedDateParts: any[];
    meridiem: string | void; // null
  }

  interface MomentParsingFlagsOpt {
    empty?: boolean;
    unusedTokens?: string[];
    unusedInput?: string[];
    overflow?: number;
    charsLeftOver?: number;
    nullInput?: boolean;
    invalidMonth?: string;
    invalidFormat?: boolean;
    userInvalidated?: boolean;
    iso?: boolean;
    parsedDateParts?: any[];
    meridiem?: string;
  }

  interface MomentBuiltinFormat {
    __momentBuiltinFormatBrand: any;
  }

  type MomentFormatSpecification = string | MomentBuiltinFormat | (string | MomentBuiltinFormat)[];

  export namespace unitOfTime {
    type Base = (
      "year" | "years" | "y" |
      "month" | "months" | "M" |
      "week" | "weeks" | "w" |
      "day" | "days" | "d" |
      "hour" | "hours" | "h" |
      "minute" | "minutes" | "m" |
      "second" | "seconds" | "s" |
      "millisecond" | "milliseconds" | "ms"
    );

    type _quarter = "quarter" | "quarters" | "Q";
    type _isoWeek = "isoWeek" | "isoWeeks" | "W";
    type _date = "date" | "dates" | "D";
    type DurationConstructor = Base | _quarter | _isoWeek;

    export type DurationAs = Base;

    export type StartOf = Base | _quarter | _isoWeek | _date | void; // null

    export type Diff = Base | _quarter;

    export type MomentConstructor = Base | _date;

    export type All = Base | _quarter | _isoWeek | _date |
      "weekYear" | "weekYears" | "gg" |
      "isoWeekYear" | "isoWeekYears" | "GG" |
      "dayOfYear" | "dayOfYears" | "DDD" |
      "weekday" | "weekdays" | "e" |
      "isoWeekday" | "isoWeekdays" | "E";
  }

  type numberlike = number | string;
  interface MomentInputObject {
    years?: numberlike;
    year?: numberlike;
    y?: numberlike;

    months?: numberlike;
    month?: numberlike;
    M?: numberlike;

    days?: numberlike;
    day?: numberlike;
    d?: numberlike;

    dates?: numberlike;
    date?: numberlike;
    D?: numberlike;

    hours?: numberlike;
    hour?: numberlike;
    h?: numberlike;

    minutes?: numberlike;
    minute?: numberlike;
    m?: numberlike;

    seconds?: numberlike;
    second?: numberlike;
    s?: numberlike;

    milliseconds?: numberlike;
    millisecond?: numberlike;
    ms?: numberlike;
  }

  interface DurationInputObject extends MomentInputObject {
    quarters?: numberlike;
    quarter?: numberlike;
    Q?: numberlike;

    weeks?: numberlike;
    week?: numberlike;
    w?: numberlike;
  }

  interface MomentSetObject extends MomentInputObject {
    weekYears?: numberlike;
    weekYear?: numberlike;
    gg?: numberlike;

    isoWeekYears?: numberlike;
    isoWeekYear?: numberlike;
    GG?: numberlike;

    quarters?: numberlike;
    quarter?: numberlike;
    Q?: numberlike;

    weeks?: numberlike;
    week?: numberlike;
    w?: numberlike;

    isoWeeks?: numberlike;
    isoWeek?: numberlike;
    W?: numberlike;

    dayOfYears?: numberlike;
    dayOfYear?: numberlike;
    DDD?: numberlike;

    weekdays?: numberlike;
    weekday?: numberlike;
    e?: numberlike;

    isoWeekdays?: numberlike;
    isoWeekday?: numberlike;
    E?: numberlike;
  }

  interface FromTo {
    from: MomentInput;
    to: MomentInput;
  }

  type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
  type DurationInputArg1 = Duration | number | string | FromTo | DurationInputObject | void; // null | undefined
  type DurationInputArg2 = unitOfTime.DurationConstructor;
  type LocaleSpecifier = string | Moment | Duration | string[] | boolean;

  interface MomentCreationData {
    input: MomentInput;
    format?: MomentFormatSpecification;
    locale: Locale;
    isUTC: boolean;
    strict?: boolean;
  }

  interface Moment extends Object {
    format(format?: string): string;

    startOf(unitOfTime: unitOfTime.StartOf): Moment;
    endOf(unitOfTime: unitOfTime.StartOf): Moment;

    add(amount?: DurationInputArg1, unit?: DurationInputArg2): Moment;
    /**
     * @deprecated reverse syntax
     */
    add(unit: unitOfTime.DurationConstructor, amount: number|string): Moment;

    subtract(amount?: DurationInputArg1, unit?: DurationInputArg2): Moment;
    /**
     * @deprecated reverse syntax
     */
    subtract(unit: unitOfTime.DurationConstructor, amount: number|string): Moment;

    calendar(): string;
    calendar(formats: CalendarSpec): string;
    calendar(time: MomentInput, formats?: CalendarSpec): string;

    clone(): Moment;

    /**
     * @return Unix timestamp in milliseconds
     */
    valueOf(): number;

    // current date/time in local mode
    local(keepLocalTime?: boolean): Moment;
    isLocal(): boolean;

    // current date/time in UTC mode
    utc(keepLocalTime?: boolean): Moment;
    isUTC(): boolean;
    /**
     * @deprecated use isUTC
     */
    isUtc(): boolean;

    parseZone(): Moment;
    isValid(): boolean;
    invalidAt(): number;

    hasAlignedHourOffset(other?: MomentInput): boolean;

    creationData(): MomentCreationData;
    parsingFlags(): MomentParsingFlags;

    year(y: number): Moment;
    year(): number;
    /**
     * @deprecated use year(y)
     */
    years(y: number): Moment;
    /**
     * @deprecated use year()
     */
    years(): number;
    quarter(): number;
    quarter(q: number): Moment;
    quarters(): number;
    quarters(q: number): Moment;
    month(M: number|string): Moment;
    month(): number;
    /**
     * @deprecated use month(M)
     */
    months(M: number|string): Moment;
    /**
     * @deprecated use month()
     */
    months(): number;
    day(d: number|string): Moment;
    day(): number;
    days(d: number|string): Moment;
    days(): number;
    date(d: number): Moment;
    date(): number;
    /**
     * @deprecated use date(d)
     */
    dates(d: number): Moment;
    /**
     * @deprecated use date()
     */
    dates(): number;
    hour(h: number): Moment;
    hour(): number;
    hours(h: number): Moment;
    hours(): number;
    minute(m: number): Moment;
    minute(): number;
    minutes(m: number): Moment;
    minutes(): number;
    second(s: number): Moment;
    second(): number;
    seconds(s: number): Moment;
    seconds(): number;
    millisecond(ms: number): Moment;
    millisecond(): number;
    milliseconds(ms: number): Moment;
    milliseconds(): number;
    weekday(): number;
    weekday(d: number): Moment;
    isoWeekday(): number;
    isoWeekday(d: number|string): Moment;
    weekYear(): number;
    weekYear(d: number): Moment;
    isoWeekYear(): number;
    isoWeekYear(d: number): Moment;
    week(): number;
    week(d: number): Moment;
    weeks(): number;
    weeks(d: number): Moment;
    isoWeek(): number;
    isoWeek(d: number): Moment;
    isoWeeks(): number;
    isoWeeks(d: number): Moment;
    weeksInYear(): number;
    weeksInWeekYear(): number;
    isoWeeksInYear(): number;
    isoWeeksInISOWeekYear(): number;
    dayOfYear(): number;
    dayOfYear(d: number): Moment;

    from(inp: MomentInput, suffix?: boolean): string;
    to(inp: MomentInput, suffix?: boolean): string;
    fromNow(withoutSuffix?: boolean): string;
    toNow(withoutPrefix?: boolean): string;

    diff(b: MomentInput, unitOfTime?: unitOfTime.Diff, precise?: boolean): number;

    toArray(): number[];
    toDate(): Date;
    toISOString(keepOffset?: boolean): string;
    inspect(): string;
    toJSON(): string;
    unix(): number;

    isLeapYear(): boolean;
    /**
     * @deprecated in favor of utcOffset
     */
    zone(): number;
    zone(b: number|string): Moment;
    utcOffset(): number;
    utcOffset(b: number|string, keepLocalTime?: boolean): Moment;
    isUtcOffset(): boolean;
    daysInMonth(): number;
    isDST(): boolean;

    zoneAbbr(): string;
    zoneName(): string;

    isBefore(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isAfter(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isSame(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isSameOrAfter(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isSameOrBefore(inp?: MomentInput, granularity?: unitOfTime.StartOf): boolean;
    isBetween(a: MomentInput, b: MomentInput, granularity?: unitOfTime.StartOf, inclusivity?: "()" | "[)" | "(]" | "[]"): boolean;

    /**
     * @deprecated as of 2.8.0, use locale
     */
    lang(language: LocaleSpecifier): Moment;
    /**
     * @deprecated as of 2.8.0, use locale
     */
    lang(): Locale;

    locale(): string;
    locale(locale: LocaleSpecifier): Moment;

    localeData(): Locale;

    /**
     * @deprecated no reliable implementation
     */
    isDSTShifted(): boolean;

    // NOTE(constructor): Same as moment constructor
    /**
     * @deprecated as of 2.7.0, use moment.min/max
     */
    max(inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;
    /**
     * @deprecated as of 2.7.0, use moment.min/max
     */
    max(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;

    // NOTE(constructor): Same as moment constructor
    /**
     * @deprecated as of 2.7.0, use moment.min/max
     */
    min(inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;
    /**
     * @deprecated as of 2.7.0, use moment.min/max
     */
    min(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;

    get(unit: unitOfTime.All): number;
    set(unit: unitOfTime.All, value: number): Moment;
    set(objectLiteral: MomentSetObject): Moment;

    toObject(): MomentObjectOutput;
  }

  export var version: string;
  export var fn: Moment;

  // NOTE(constructor): Same as moment constructor
  /**
   * @param strict Strict parsing disables the deprecated fallback to the native Date constructor when
   * parsing a string.
   */
  export function utc(inp?: MomentInput, strict?: boolean): Moment;
  /**
   * @param strict Strict parsing requires that the format and input match exactly, including delimiters.
   * Strict parsing is frequently the best parsing option. For more information about choosing strict vs
   * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
   */
  export function utc(inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;
  /**
   * @param strict Strict parsing requires that the format and input match exactly, including delimiters.
   * Strict parsing is frequently the best parsing option. For more information about choosing strict vs
   * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
   */
  export function utc(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;

  export function unix(timestamp: number): Moment;

  export function invalid(flags?: MomentParsingFlagsOpt): Moment;
  export function isMoment(m: any): m is Moment;
  export function isDate(m: any): m is Date;
  export function isDuration(d: any): d is Duration;

  /**
   * @deprecated in 2.8.0
   */
  export function lang(language?: string): string;
  /**
   * @deprecated in 2.8.0
   */
  export function lang(language?: string, definition?: Locale): string;

  export function locale(language?: string): string;
  export function locale(language?: string[]): string;
  export function locale(language?: string, definition?: LocaleSpecification | void): string; // null | undefined

  export function localeData(key?: string | string[]): Locale;

  export function duration(inp?: DurationInputArg1, unit?: DurationInputArg2): Duration;

  // NOTE(constructor): Same as moment constructor
  export function parseZone(inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean): Moment;
  export function parseZone(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;

  export function months(): string[];
  export function months(index: number): string;
  export function months(format: string): string[];
  export function months(format: string, index: number): string;
  export function monthsShort(): string[];
  export function monthsShort(index: number): string;
  export function monthsShort(format: string): string[];
  export function monthsShort(format: string, index: number): string;

  export function weekdays(): string[];
  export function weekdays(index: number): string;
  export function weekdays(format: string): string[];
  export function weekdays(format: string, index: number): string;
  export function weekdays(localeSorted: boolean): string[];
  export function weekdays(localeSorted: boolean, index: number): string;
  export function weekdays(localeSorted: boolean, format: string): string[];
  export function weekdays(localeSorted: boolean, format: string, index: number): string;
  export function weekdaysShort(): string[];
  export function weekdaysShort(index: number): string;
  export function weekdaysShort(format: string): string[];
  export function weekdaysShort(format: string, index: number): string;
  export function weekdaysShort(localeSorted: boolean): string[];
  export function weekdaysShort(localeSorted: boolean, index: number): string;
  export function weekdaysShort(localeSorted: boolean, format: string): string[];
  export function weekdaysShort(localeSorted: boolean, format: string, index: number): string;
  export function weekdaysMin(): string[];
  export function weekdaysMin(index: number): string;
  export function weekdaysMin(format: string): string[];
  export function weekdaysMin(format: string, index: number): string;
  export function weekdaysMin(localeSorted: boolean): string[];
  export function weekdaysMin(localeSorted: boolean, index: number): string;
  export function weekdaysMin(localeSorted: boolean, format: string): string[];
  export function weekdaysMin(localeSorted: boolean, format: string, index: number): string;

  export function min(moments: Moment[]): Moment;
  export function min(...moments: Moment[]): Moment;
  export function max(moments: Moment[]): Moment;
  export function max(...moments: Moment[]): Moment;

  /**
   * Returns unix time in milliseconds. Overwrite for profit.
   */
  export function now(): number;

  export function defineLocale(language: string, localeSpec: LocaleSpecification | void): Locale; // null
  export function updateLocale(language: string, localeSpec: LocaleSpecification | void): Locale; // null

  export function locales(): string[];

  export function normalizeUnits(unit: unitOfTime.All): string;
  export function relativeTimeThreshold(threshold: string): number | boolean;
  export function relativeTimeThreshold(threshold: string, limit: number): boolean;
  export function relativeTimeRounding(fn: (num: number) => number): boolean;
  export function relativeTimeRounding(): (num: number) => number;
  export function calendarFormat(m: Moment, now: Moment): string;

  export function parseTwoDigitYear(input: string): number;

  /**
   * Constant used to enable explicit ISO_8601 format parsing.
   */
  export var ISO_8601: MomentBuiltinFormat;
  export var RFC_2822: MomentBuiltinFormat;

  export var defaultFormat: string;
  export var defaultFormatUtc: string;
  export var suppressDeprecationWarnings: boolean;
  export var deprecationHandler: ((name: string | void, msg: string) => void) | void;

  export var HTML5_FMT: {
    DATETIME_LOCAL: string,
    DATETIME_LOCAL_SECONDS: string,
    DATETIME_LOCAL_MS: string,
    DATE: string,
    TIME: string,
    TIME_SECONDS: string,
    TIME_MS: string,
    WEEK: string,
    MONTH: string
  };

}

export default moment;

}/// <reference types="node" />
declare module "packages/style/src/colors" {
    export interface IColor {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        A100: string;
        A200: string;
        A400: string;
        A700: string;
    }
    export const amber: IColor;
    export const blue: IColor;
    export const blueGrey: IColor;
    export const brown: IColor;
    export const cyan: IColor;
    export const deepOrange: IColor;
    export const deepPurple: IColor;
    export const green: IColor;
    export const grey: IColor;
    export const indigo: IColor;
    export const lightBlue: IColor;
    export const lightGreen: IColor;
    export const lime: IColor;
    export const orange: IColor;
    export const pink: IColor;
    export const purple: IColor;
    export const red: IColor;
    export const teal: IColor;
    export const yellow: IColor;
    export interface IColors {
        amber: IColor;
        blue: IColor;
        blueGrey: IColor;
        brown: IColor;
        cyan: IColor;
        deepOrange: IColor;
        deepPurple: IColor;
        green: IColor;
        grey: IColor;
        indigo: IColor;
        lightBlue: IColor;
        lightGreen: IColor;
        lime: IColor;
        orange: IColor;
        pink: IColor;
        purple: IColor;
        red: IColor;
        teal: IColor;
        yellow: IColor;
    }
    export const Colors: IColors;
}
declare module "packages/style/src/theme" {
    import { IColor, Colors } from "packages/style/src/colors";
    export { Colors };
    type IColorVar = string;
    interface IThemeColors {
        main: IColorVar;
        light: IColorVar;
        dark: IColorVar;
        contrastText: IColorVar;
    }
    interface ILayout {
        container: {
            width: string;
            maxWidth: string;
            textAlign: string;
            overflow: string;
        };
    }
    export interface ITheme {
        action: {
            active: IColorVar;
            activeBackground: IColorVar;
            activeOpacity: number;
            disabled: IColorVar;
            disabledBackground: IColorVar;
            disabledOpacity: number;
            focus: IColorVar;
            focusBackground: IColorVar;
            focusOpacity: number;
            hover: IColorVar;
            hoverBackground: IColorVar;
            hoverOpacity: number;
            selected: IColorVar;
            selectedBackground: IColorVar;
            selectedOpacity: number;
        };
        background: {
            default: IColorVar;
            paper: IColorVar;
            main: IColorVar;
            modal: IColorVar;
            gradient: IColorVar;
        };
        breakpoints: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
        };
        colors: {
            primary: IThemeColors;
            secondary: IThemeColors;
            error: IThemeColors;
            warning: IThemeColors;
            info: IThemeColors;
            success: IThemeColors;
        };
        layout: ILayout;
        divider: IColorVar;
        shadows: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
        };
        text: {
            primary: IColorVar;
            secondary: IColorVar;
            third: IColorVar;
            disabled: IColorVar;
            hint: IColorVar;
        };
        docs: {
            background: IColorVar;
            text0: IColorVar;
            text1: IColorVar;
        };
        typography: {
            fontFamily: string;
            fontSize: string;
        };
        input: {
            background: string;
            fontColor: string;
        };
        combobox: {
            background: string;
            fontColor: string;
        };
    }
    export interface IThemeVariables {
        action: {
            active: string;
            activeBackground: string;
            activeOpacity: string;
            disabled: string;
            disabledBackground: string;
            disabledOpacity: string;
            focus: string;
            focusBackground: string;
            focusOpacity: string;
            hover: string;
            hoverBackground: string;
            hoverOpacity: string;
            selected: string;
            selectedBackground: string;
            selectedOpacity: string;
        };
        background: {
            default: string;
            paper: string;
            main: string;
            modal: string;
            gradient: string;
        };
        breakpoints: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
        colors: {
            primary: IThemeColors;
            secondary: IThemeColors;
            error: IThemeColors;
            warning: IThemeColors;
            info: IThemeColors;
            success: IThemeColors;
        };
        layout: ILayout;
        divider: string;
        shadows: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
        };
        text: {
            primary: string;
            secondary: string;
            third: string;
            disabled: string;
            hint: string;
        };
        docs: {
            background: string;
            text0: string;
            text1: string;
        };
        typography: {
            fontFamily: string;
            fontSize: string;
        };
        input: {
            background: string;
            fontColor: string;
        };
        combobox: {
            background: string;
            fontColor: string;
        };
    }
    export const defaultTheme: ITheme;
    export const darkTheme: ITheme;
    export const ThemeVars: IThemeVariables;
    export const ColorVars: IColor;
    export var currentTheme: ITheme;
    export function applyTheme(theme: ITheme): void;
}
declare module "packages/style/src/styles" {
    export type PropertyValue = number | boolean | string;
    export interface Styles {
        $unique?: boolean;
        $global?: boolean;
        $displayName?: string;
        [selector: string]: null | undefined | PropertyValue | PropertyValue[] | Styles;
    }
    export interface Changes {
        add(style: Container<any>, index: number): void;
        change(style: Container<any>, oldIndex: number, newIndex: number): void;
        remove(style: Container<any>, index: number): void;
    }
    export interface Container<T> {
        id: string;
        clone(): T;
        getStyles(): string;
    }
    export class Cache<T extends Container<any>> {
        changes?: Changes | undefined;
        sheet: string[];
        changeId: number;
        private _keys;
        private _children;
        private _counters;
        constructor(changes?: Changes | undefined);
        add(style: T): void;
        remove(style: T): void;
        values(): T[];
        merge(cache: Cache<any>): this;
        unmerge(cache: Cache<any>): this;
        clone(): Cache<T>;
    }
    export class Selector implements Container<Selector> {
        selector: string;
        id: string;
        constructor(selector: string, id: string);
        getStyles(): string;
        clone(): Selector;
    }
    export class Style extends Cache<Selector> implements Container<Style> {
        style: string;
        id: string;
        constructor(style: string, id: string);
        getStyles(): string;
        clone(): Style;
    }
    export class Rule extends Cache<Rule | Style> implements Container<Rule> {
        rule: string;
        style: string;
        id: string;
        constructor(rule: string, style: string, id: string);
        getStyles(): string;
        clone(): Rule;
    }
    export class FreeStyle extends Cache<Rule | Style> implements Container<FreeStyle> {
        id: string;
        constructor(id: string, changes?: Changes);
        registerStyle(css: Styles): string;
        registerKeyframes(keyframes: Styles): string;
        registerHashRule(prefix: string, styles: Styles): string;
        registerRule(rule: string, styles: Styles): string;
        registerCss(styles: Styles): string;
        getStyles(): string;
        clone(): FreeStyle;
    }
    export function create(changes?: Changes): FreeStyle;
}
declare module "packages/style/src/csstype" {
    export type PropertyValue<TValue> = TValue extends Array<infer AValue> ? Array<AValue extends infer TUnpacked & {} ? TUnpacked : AValue> : TValue extends infer TUnpacked & {} ? TUnpacked : TValue;
    export type Fallback<T> = {
        [P in keyof T]: T[P] | NonNullable<T[P]>[];
    };
    export interface StandardLonghandProperties<TLength = (string & {}) | 0, TTime = string & {}> {
        accentColor?: Property.AccentColor | undefined;
        alignContent?: Property.AlignContent | undefined;
        alignItems?: Property.AlignItems | undefined;
        alignSelf?: Property.AlignSelf | undefined;
        alignTracks?: Property.AlignTracks | undefined;
        animationDelay?: Property.AnimationDelay<TTime> | undefined;
        animationDirection?: Property.AnimationDirection | undefined;
        animationDuration?: Property.AnimationDuration<TTime> | undefined;
        animationFillMode?: Property.AnimationFillMode | undefined;
        animationIterationCount?: Property.AnimationIterationCount | undefined;
        animationName?: Property.AnimationName | undefined;
        animationPlayState?: Property.AnimationPlayState | undefined;
        animationTimingFunction?: Property.AnimationTimingFunction | undefined;
        appearance?: Property.Appearance | undefined;
        aspectRatio?: Property.AspectRatio | undefined;
        backdropFilter?: Property.BackdropFilter | undefined;
        backfaceVisibility?: Property.BackfaceVisibility | undefined;
        backgroundAttachment?: Property.BackgroundAttachment | undefined;
        backgroundBlendMode?: Property.BackgroundBlendMode | undefined;
        backgroundClip?: Property.BackgroundClip | undefined;
        backgroundColor?: Property.BackgroundColor | undefined;
        backgroundImage?: Property.BackgroundImage | undefined;
        backgroundOrigin?: Property.BackgroundOrigin | undefined;
        backgroundPositionX?: Property.BackgroundPositionX<TLength> | undefined;
        backgroundPositionY?: Property.BackgroundPositionY<TLength> | undefined;
        backgroundRepeat?: Property.BackgroundRepeat | undefined;
        backgroundSize?: Property.BackgroundSize<TLength> | undefined;
        blockOverflow?: Property.BlockOverflow | undefined;
        blockSize?: Property.BlockSize<TLength> | undefined;
        borderBlockColor?: Property.BorderBlockColor | undefined;
        borderBlockEndColor?: Property.BorderBlockEndColor | undefined;
        borderBlockEndStyle?: Property.BorderBlockEndStyle | undefined;
        borderBlockEndWidth?: Property.BorderBlockEndWidth<TLength> | undefined;
        borderBlockStartColor?: Property.BorderBlockStartColor | undefined;
        borderBlockStartStyle?: Property.BorderBlockStartStyle | undefined;
        borderBlockStartWidth?: Property.BorderBlockStartWidth<TLength> | undefined;
        borderBlockStyle?: Property.BorderBlockStyle | undefined;
        borderBlockWidth?: Property.BorderBlockWidth<TLength> | undefined;
        borderBottomColor?: Property.BorderBottomColor | undefined;
        borderBottomLeftRadius?: Property.BorderBottomLeftRadius<TLength> | undefined;
        borderBottomRightRadius?: Property.BorderBottomRightRadius<TLength> | undefined;
        borderBottomStyle?: Property.BorderBottomStyle | undefined;
        borderBottomWidth?: Property.BorderBottomWidth<TLength> | undefined;
        borderCollapse?: Property.BorderCollapse | undefined;
        borderEndEndRadius?: Property.BorderEndEndRadius<TLength> | undefined;
        borderEndStartRadius?: Property.BorderEndStartRadius<TLength> | undefined;
        borderImageOutset?: Property.BorderImageOutset<TLength> | undefined;
        borderImageRepeat?: Property.BorderImageRepeat | undefined;
        borderImageSlice?: Property.BorderImageSlice | undefined;
        borderImageSource?: Property.BorderImageSource | undefined;
        borderImageWidth?: Property.BorderImageWidth<TLength> | undefined;
        borderInlineColor?: Property.BorderInlineColor | undefined;
        borderInlineEndColor?: Property.BorderInlineEndColor | undefined;
        borderInlineEndStyle?: Property.BorderInlineEndStyle | undefined;
        borderInlineEndWidth?: Property.BorderInlineEndWidth<TLength> | undefined;
        borderInlineStartColor?: Property.BorderInlineStartColor | undefined;
        borderInlineStartStyle?: Property.BorderInlineStartStyle | undefined;
        borderInlineStartWidth?: Property.BorderInlineStartWidth<TLength> | undefined;
        borderInlineStyle?: Property.BorderInlineStyle | undefined;
        borderInlineWidth?: Property.BorderInlineWidth<TLength> | undefined;
        borderLeftColor?: Property.BorderLeftColor | undefined;
        borderLeftStyle?: Property.BorderLeftStyle | undefined;
        borderLeftWidth?: Property.BorderLeftWidth<TLength> | undefined;
        borderRightColor?: Property.BorderRightColor | undefined;
        borderRightStyle?: Property.BorderRightStyle | undefined;
        borderRightWidth?: Property.BorderRightWidth<TLength> | undefined;
        borderSpacing?: Property.BorderSpacing<TLength> | undefined;
        borderStartEndRadius?: Property.BorderStartEndRadius<TLength> | undefined;
        borderStartStartRadius?: Property.BorderStartStartRadius<TLength> | undefined;
        borderTopColor?: Property.BorderTopColor | undefined;
        borderTopLeftRadius?: Property.BorderTopLeftRadius<TLength> | undefined;
        borderTopRightRadius?: Property.BorderTopRightRadius<TLength> | undefined;
        borderTopStyle?: Property.BorderTopStyle | undefined;
        borderTopWidth?: Property.BorderTopWidth<TLength> | undefined;
        bottom?: Property.Bottom<TLength> | undefined;
        boxDecorationBreak?: Property.BoxDecorationBreak | undefined;
        boxShadow?: Property.BoxShadow | undefined;
        boxSizing?: Property.BoxSizing | undefined;
        breakAfter?: Property.BreakAfter | undefined;
        breakBefore?: Property.BreakBefore | undefined;
        breakInside?: Property.BreakInside | undefined;
        captionSide?: Property.CaptionSide | undefined;
        caretColor?: Property.CaretColor | undefined;
        clear?: Property.Clear | undefined;
        clipPath?: Property.ClipPath | undefined;
        color?: Property.Color | undefined;
        colorAdjust?: Property.ColorAdjust | undefined;
        colorScheme?: Property.ColorScheme | undefined;
        columnCount?: Property.ColumnCount | undefined;
        columnFill?: Property.ColumnFill | undefined;
        columnGap?: Property.ColumnGap<TLength> | undefined;
        columnRuleColor?: Property.ColumnRuleColor | undefined;
        columnRuleStyle?: Property.ColumnRuleStyle | undefined;
        columnRuleWidth?: Property.ColumnRuleWidth<TLength> | undefined;
        columnSpan?: Property.ColumnSpan | undefined;
        columnWidth?: Property.ColumnWidth<TLength> | undefined;
        contain?: Property.Contain | undefined;
        content?: Property.Content | undefined;
        contentVisibility?: Property.ContentVisibility | undefined;
        counterIncrement?: Property.CounterIncrement | undefined;
        counterReset?: Property.CounterReset | undefined;
        counterSet?: Property.CounterSet | undefined;
        cursor?: Property.Cursor | undefined;
        direction?: Property.Direction | undefined;
        display?: Property.Display | undefined;
        emptyCells?: Property.EmptyCells | undefined;
        filter?: Property.Filter | undefined;
        flexBasis?: Property.FlexBasis<TLength> | undefined;
        flexDirection?: Property.FlexDirection | undefined;
        flexGrow?: Property.FlexGrow | undefined;
        flexShrink?: Property.FlexShrink | undefined;
        flexWrap?: Property.FlexWrap | undefined;
        float?: Property.Float | undefined;
        fontFamily?: Property.FontFamily | undefined;
        fontFeatureSettings?: Property.FontFeatureSettings | undefined;
        fontKerning?: Property.FontKerning | undefined;
        fontLanguageOverride?: Property.FontLanguageOverride | undefined;
        fontOpticalSizing?: Property.FontOpticalSizing | undefined;
        fontSize?: Property.FontSize<TLength> | undefined;
        fontSizeAdjust?: Property.FontSizeAdjust | undefined;
        fontSmooth?: Property.FontSmooth<TLength> | undefined;
        fontStretch?: Property.FontStretch | undefined;
        fontStyle?: Property.FontStyle | undefined;
        fontSynthesis?: Property.FontSynthesis | undefined;
        fontVariant?: Property.FontVariant | undefined;
        fontVariantCaps?: Property.FontVariantCaps | undefined;
        fontVariantEastAsian?: Property.FontVariantEastAsian | undefined;
        fontVariantLigatures?: Property.FontVariantLigatures | undefined;
        fontVariantNumeric?: Property.FontVariantNumeric | undefined;
        fontVariantPosition?: Property.FontVariantPosition | undefined;
        fontVariationSettings?: Property.FontVariationSettings | undefined;
        fontWeight?: Property.FontWeight | undefined;
        forcedColorAdjust?: Property.ForcedColorAdjust | undefined;
        gridAutoColumns?: Property.GridAutoColumns<TLength> | undefined;
        gridAutoFlow?: Property.GridAutoFlow | undefined;
        gridAutoRows?: Property.GridAutoRows<TLength> | undefined;
        gridColumnEnd?: Property.GridColumnEnd | undefined;
        gridColumnStart?: Property.GridColumnStart | undefined;
        gridRowEnd?: Property.GridRowEnd | undefined;
        gridRowStart?: Property.GridRowStart | undefined;
        gridTemplateAreas?: Property.GridTemplateAreas | undefined;
        gridTemplateColumns?: Property.GridTemplateColumns<TLength> | undefined;
        gridTemplateRows?: Property.GridTemplateRows<TLength> | undefined;
        hangingPunctuation?: Property.HangingPunctuation | undefined;
        height?: Property.Height<TLength> | undefined;
        hyphens?: Property.Hyphens | undefined;
        imageOrientation?: Property.ImageOrientation | undefined;
        imageRendering?: Property.ImageRendering | undefined;
        imageResolution?: Property.ImageResolution | undefined;
        initialLetter?: Property.InitialLetter | undefined;
        inlineSize?: Property.InlineSize<TLength> | undefined;
        inset?: Property.Inset<TLength> | undefined;
        insetBlock?: Property.InsetBlock<TLength> | undefined;
        insetBlockEnd?: Property.InsetBlockEnd<TLength> | undefined;
        insetBlockStart?: Property.InsetBlockStart<TLength> | undefined;
        insetInline?: Property.InsetInline<TLength> | undefined;
        insetInlineEnd?: Property.InsetInlineEnd<TLength> | undefined;
        insetInlineStart?: Property.InsetInlineStart<TLength> | undefined;
        isolation?: Property.Isolation | undefined;
        justifyContent?: Property.JustifyContent | undefined;
        justifyItems?: Property.JustifyItems | undefined;
        justifySelf?: Property.JustifySelf | undefined;
        justifyTracks?: Property.JustifyTracks | undefined;
        left?: Property.Left<TLength> | undefined;
        letterSpacing?: Property.LetterSpacing<TLength> | undefined;
        lineBreak?: Property.LineBreak | undefined;
        lineHeight?: Property.LineHeight<TLength> | undefined;
        lineHeightStep?: Property.LineHeightStep<TLength> | undefined;
        listStyleImage?: Property.ListStyleImage | undefined;
        listStylePosition?: Property.ListStylePosition | undefined;
        listStyleType?: Property.ListStyleType | undefined;
        marginBlock?: Property.MarginBlock<TLength> | undefined;
        marginBlockEnd?: Property.MarginBlockEnd<TLength> | undefined;
        marginBlockStart?: Property.MarginBlockStart<TLength> | undefined;
        marginBottom?: Property.MarginBottom<TLength> | undefined;
        marginInline?: Property.MarginInline<TLength> | undefined;
        marginInlineEnd?: Property.MarginInlineEnd<TLength> | undefined;
        marginInlineStart?: Property.MarginInlineStart<TLength> | undefined;
        marginLeft?: Property.MarginLeft<TLength> | undefined;
        marginRight?: Property.MarginRight<TLength> | undefined;
        marginTop?: Property.MarginTop<TLength> | undefined;
        maskBorderMode?: Property.MaskBorderMode | undefined;
        maskBorderOutset?: Property.MaskBorderOutset<TLength> | undefined;
        maskBorderRepeat?: Property.MaskBorderRepeat | undefined;
        maskBorderSlice?: Property.MaskBorderSlice | undefined;
        maskBorderSource?: Property.MaskBorderSource | undefined;
        maskBorderWidth?: Property.MaskBorderWidth<TLength> | undefined;
        maskClip?: Property.MaskClip | undefined;
        maskComposite?: Property.MaskComposite | undefined;
        maskImage?: Property.MaskImage | undefined;
        maskMode?: Property.MaskMode | undefined;
        maskOrigin?: Property.MaskOrigin | undefined;
        maskPosition?: Property.MaskPosition<TLength> | undefined;
        maskRepeat?: Property.MaskRepeat | undefined;
        maskSize?: Property.MaskSize<TLength> | undefined;
        maskType?: Property.MaskType | undefined;
        mathStyle?: Property.MathStyle | undefined;
        maxBlockSize?: Property.MaxBlockSize<TLength> | undefined;
        maxHeight?: Property.MaxHeight<TLength> | undefined;
        maxInlineSize?: Property.MaxInlineSize<TLength> | undefined;
        maxLines?: Property.MaxLines | undefined;
        maxWidth?: Property.MaxWidth<TLength> | undefined;
        minBlockSize?: Property.MinBlockSize<TLength> | undefined;
        minHeight?: Property.MinHeight<TLength> | undefined;
        minInlineSize?: Property.MinInlineSize<TLength> | undefined;
        minWidth?: Property.MinWidth<TLength> | undefined;
        mixBlendMode?: Property.MixBlendMode | undefined;
        motionDistance?: Property.OffsetDistance<TLength> | undefined;
        motionPath?: Property.OffsetPath | undefined;
        motionRotation?: Property.OffsetRotate | undefined;
        objectFit?: Property.ObjectFit | undefined;
        objectPosition?: Property.ObjectPosition<TLength> | undefined;
        offsetAnchor?: Property.OffsetAnchor<TLength> | undefined;
        offsetDistance?: Property.OffsetDistance<TLength> | undefined;
        offsetPath?: Property.OffsetPath | undefined;
        offsetRotate?: Property.OffsetRotate | undefined;
        offsetRotation?: Property.OffsetRotate | undefined;
        opacity?: Property.Opacity | undefined;
        order?: Property.Order | undefined;
        orphans?: Property.Orphans | undefined;
        outlineColor?: Property.OutlineColor | undefined;
        outlineOffset?: Property.OutlineOffset<TLength> | undefined;
        outlineStyle?: Property.OutlineStyle | undefined;
        outlineWidth?: Property.OutlineWidth<TLength> | undefined;
        overflowAnchor?: Property.OverflowAnchor | undefined;
        overflowBlock?: Property.OverflowBlock | undefined;
        overflowClipBox?: Property.OverflowClipBox | undefined;
        overflowClipMargin?: Property.OverflowClipMargin<TLength> | undefined;
        overflowInline?: Property.OverflowInline | undefined;
        overflowWrap?: Property.OverflowWrap | undefined;
        overflowX?: Property.OverflowX | undefined;
        overflowY?: Property.OverflowY | undefined;
        overscrollBehaviorBlock?: Property.OverscrollBehaviorBlock | undefined;
        overscrollBehaviorInline?: Property.OverscrollBehaviorInline | undefined;
        overscrollBehaviorX?: Property.OverscrollBehaviorX | undefined;
        overscrollBehaviorY?: Property.OverscrollBehaviorY | undefined;
        paddingBlock?: Property.PaddingBlock<TLength> | undefined;
        paddingBlockEnd?: Property.PaddingBlockEnd<TLength> | undefined;
        paddingBlockStart?: Property.PaddingBlockStart<TLength> | undefined;
        paddingBottom?: Property.PaddingBottom<TLength> | undefined;
        paddingInline?: Property.PaddingInline<TLength> | undefined;
        paddingInlineEnd?: Property.PaddingInlineEnd<TLength> | undefined;
        paddingInlineStart?: Property.PaddingInlineStart<TLength> | undefined;
        paddingLeft?: Property.PaddingLeft<TLength> | undefined;
        paddingRight?: Property.PaddingRight<TLength> | undefined;
        paddingTop?: Property.PaddingTop<TLength> | undefined;
        pageBreakAfter?: Property.PageBreakAfter | undefined;
        pageBreakBefore?: Property.PageBreakBefore | undefined;
        pageBreakInside?: Property.PageBreakInside | undefined;
        paintOrder?: Property.PaintOrder | undefined;
        perspective?: Property.Perspective<TLength> | undefined;
        perspectiveOrigin?: Property.PerspectiveOrigin<TLength> | undefined;
        placeContent?: Property.PlaceContent | undefined;
        pointerEvents?: Property.PointerEvents | undefined;
        position?: Property.Position | undefined;
        quotes?: Property.Quotes | undefined;
        resize?: Property.Resize | undefined;
        right?: Property.Right<TLength> | undefined;
        rotate?: Property.Rotate | undefined;
        rowGap?: Property.RowGap<TLength> | undefined;
        rubyAlign?: Property.RubyAlign | undefined;
        rubyMerge?: Property.RubyMerge | undefined;
        rubyPosition?: Property.RubyPosition | undefined;
        scale?: Property.Scale | undefined;
        scrollBehavior?: Property.ScrollBehavior | undefined;
        scrollMargin?: Property.ScrollMargin<TLength> | undefined;
        scrollMarginBlock?: Property.ScrollMarginBlock<TLength> | undefined;
        scrollMarginBlockEnd?: Property.ScrollMarginBlockEnd<TLength> | undefined;
        scrollMarginBlockStart?: Property.ScrollMarginBlockStart<TLength> | undefined;
        scrollMarginBottom?: Property.ScrollMarginBottom<TLength> | undefined;
        scrollMarginInline?: Property.ScrollMarginInline<TLength> | undefined;
        scrollMarginInlineEnd?: Property.ScrollMarginInlineEnd<TLength> | undefined;
        scrollMarginInlineStart?: Property.ScrollMarginInlineStart<TLength> | undefined;
        scrollMarginLeft?: Property.ScrollMarginLeft<TLength> | undefined;
        scrollMarginRight?: Property.ScrollMarginRight<TLength> | undefined;
        scrollMarginTop?: Property.ScrollMarginTop<TLength> | undefined;
        scrollPadding?: Property.ScrollPadding<TLength> | undefined;
        scrollPaddingBlock?: Property.ScrollPaddingBlock<TLength> | undefined;
        scrollPaddingBlockEnd?: Property.ScrollPaddingBlockEnd<TLength> | undefined;
        scrollPaddingBlockStart?: Property.ScrollPaddingBlockStart<TLength> | undefined;
        scrollPaddingBottom?: Property.ScrollPaddingBottom<TLength> | undefined;
        scrollPaddingInline?: Property.ScrollPaddingInline<TLength> | undefined;
        scrollPaddingInlineEnd?: Property.ScrollPaddingInlineEnd<TLength> | undefined;
        scrollPaddingInlineStart?: Property.ScrollPaddingInlineStart<TLength> | undefined;
        scrollPaddingLeft?: Property.ScrollPaddingLeft<TLength> | undefined;
        scrollPaddingRight?: Property.ScrollPaddingRight<TLength> | undefined;
        scrollPaddingTop?: Property.ScrollPaddingTop<TLength> | undefined;
        scrollSnapAlign?: Property.ScrollSnapAlign | undefined;
        scrollSnapMargin?: Property.ScrollMargin<TLength> | undefined;
        scrollSnapMarginBottom?: Property.ScrollMarginBottom<TLength> | undefined;
        scrollSnapMarginLeft?: Property.ScrollMarginLeft<TLength> | undefined;
        scrollSnapMarginRight?: Property.ScrollMarginRight<TLength> | undefined;
        scrollSnapMarginTop?: Property.ScrollMarginTop<TLength> | undefined;
        scrollSnapStop?: Property.ScrollSnapStop | undefined;
        scrollSnapType?: Property.ScrollSnapType | undefined;
        scrollbarColor?: Property.ScrollbarColor | undefined;
        scrollbarGutter?: Property.ScrollbarGutter | undefined;
        scrollbarWidth?: Property.ScrollbarWidth | undefined;
        shapeImageThreshold?: Property.ShapeImageThreshold | undefined;
        shapeMargin?: Property.ShapeMargin<TLength> | undefined;
        shapeOutside?: Property.ShapeOutside | undefined;
        tabSize?: Property.TabSize<TLength> | undefined;
        tableLayout?: Property.TableLayout | undefined;
        textAlign?: Property.TextAlign | undefined;
        textAlignLast?: Property.TextAlignLast | undefined;
        textCombineUpright?: Property.TextCombineUpright | undefined;
        textDecorationColor?: Property.TextDecorationColor | undefined;
        textDecorationLine?: Property.TextDecorationLine | undefined;
        textDecorationSkip?: Property.TextDecorationSkip | undefined;
        textDecorationSkipInk?: Property.TextDecorationSkipInk | undefined;
        textDecorationStyle?: Property.TextDecorationStyle | undefined;
        textDecorationThickness?: Property.TextDecorationThickness<TLength> | undefined;
        textDecorationWidth?: Property.TextDecorationThickness<TLength> | undefined;
        textEmphasisColor?: Property.TextEmphasisColor | undefined;
        textEmphasisPosition?: Property.TextEmphasisPosition | undefined;
        textEmphasisStyle?: Property.TextEmphasisStyle | undefined;
        textIndent?: Property.TextIndent<TLength> | undefined;
        textJustify?: Property.TextJustify | undefined;
        textOrientation?: Property.TextOrientation | undefined;
        textOverflow?: Property.TextOverflow | undefined;
        textRendering?: Property.TextRendering | undefined;
        textShadow?: Property.TextShadow | undefined;
        textSizeAdjust?: Property.TextSizeAdjust | undefined;
        textTransform?: Property.TextTransform | undefined;
        textUnderlineOffset?: Property.TextUnderlineOffset<TLength> | undefined;
        textUnderlinePosition?: Property.TextUnderlinePosition | undefined;
        top?: Property.Top<TLength> | undefined;
        touchAction?: Property.TouchAction | undefined;
        transform?: Property.Transform | undefined;
        transformBox?: Property.TransformBox | undefined;
        transformOrigin?: Property.TransformOrigin<TLength> | undefined;
        transformStyle?: Property.TransformStyle | undefined;
        transitionDelay?: Property.TransitionDelay<TTime> | undefined;
        transitionDuration?: Property.TransitionDuration<TTime> | undefined;
        transitionProperty?: Property.TransitionProperty | undefined;
        transitionTimingFunction?: Property.TransitionTimingFunction | undefined;
        translate?: Property.Translate<TLength> | undefined;
        unicodeBidi?: Property.UnicodeBidi | undefined;
        userSelect?: Property.UserSelect | undefined;
        verticalAlign?: Property.VerticalAlign<TLength> | undefined;
        visibility?: Property.Visibility | undefined;
        whiteSpace?: Property.WhiteSpace | undefined;
        widows?: Property.Widows | undefined;
        width?: Property.Width<TLength> | undefined;
        willChange?: Property.WillChange | undefined;
        wordBreak?: Property.WordBreak | undefined;
        wordSpacing?: Property.WordSpacing<TLength> | undefined;
        wordWrap?: Property.WordWrap | undefined;
        writingMode?: Property.WritingMode | undefined;
        zIndex?: Property.ZIndex | undefined;
        zoom?: Property.Zoom | undefined;
    }
    export interface StandardShorthandProperties<TLength = (string & {}) | 0, TTime = string & {}> {
        all?: Property.All | undefined;
        animation?: Property.Animation<TTime> | undefined;
        background?: Property.Background<TLength> | undefined;
        backgroundPosition?: Property.BackgroundPosition<TLength> | undefined;
        border?: Property.Border<TLength> | undefined;
        borderBlock?: Property.BorderBlock<TLength> | undefined;
        borderBlockEnd?: Property.BorderBlockEnd<TLength> | undefined;
        borderBlockStart?: Property.BorderBlockStart<TLength> | undefined;
        borderBottom?: Property.BorderBottom<TLength> | undefined;
        borderColor?: Property.BorderColor | undefined;
        borderImage?: Property.BorderImage | undefined;
        borderInline?: Property.BorderInline<TLength> | undefined;
        borderInlineEnd?: Property.BorderInlineEnd<TLength> | undefined;
        borderInlineStart?: Property.BorderInlineStart<TLength> | undefined;
        borderLeft?: Property.BorderLeft<TLength> | undefined;
        borderRadius?: Property.BorderRadius<TLength> | undefined;
        borderRight?: Property.BorderRight<TLength> | undefined;
        borderStyle?: Property.BorderStyle | undefined;
        borderTop?: Property.BorderTop<TLength> | undefined;
        borderWidth?: Property.BorderWidth<TLength> | undefined;
        columnRule?: Property.ColumnRule<TLength> | undefined;
        columns?: Property.Columns<TLength> | undefined;
        flex?: Property.Flex<TLength> | undefined;
        flexFlow?: Property.FlexFlow | undefined;
        font?: Property.Font | undefined;
        gap?: Property.Gap<TLength> | undefined;
        grid?: Property.Grid | undefined;
        gridArea?: Property.GridArea | undefined;
        gridColumn?: Property.GridColumn | undefined;
        gridRow?: Property.GridRow | undefined;
        gridTemplate?: Property.GridTemplate | undefined;
        lineClamp?: Property.LineClamp | undefined;
        listStyle?: Property.ListStyle | undefined;
        margin?: Property.Margin<TLength> | undefined;
        mask?: Property.Mask<TLength> | undefined;
        maskBorder?: Property.MaskBorder | undefined;
        motion?: Property.Offset<TLength> | undefined;
        offset?: Property.Offset<TLength> | undefined;
        outline?: Property.Outline<TLength> | undefined;
        overflow?: Property.Overflow | undefined;
        overscrollBehavior?: Property.OverscrollBehavior | undefined;
        padding?: Property.Padding<TLength> | undefined;
        placeItems?: Property.PlaceItems | undefined;
        placeSelf?: Property.PlaceSelf | undefined;
        textDecoration?: Property.TextDecoration<TLength> | undefined;
        textEmphasis?: Property.TextEmphasis | undefined;
        transition?: Property.Transition<TTime> | undefined;
    }
    export interface StandardProperties<TLength = (string & {}) | 0, TTime = string & {}> extends StandardLonghandProperties<TLength, TTime>, StandardShorthandProperties<TLength, TTime> {
    }
    export interface VendorLonghandProperties<TLength = (string & {}) | 0, TTime = string & {}> {
        MozAnimationDelay?: Property.AnimationDelay<TTime> | undefined;
        MozAnimationDirection?: Property.AnimationDirection | undefined;
        MozAnimationDuration?: Property.AnimationDuration<TTime> | undefined;
        MozAnimationFillMode?: Property.AnimationFillMode | undefined;
        MozAnimationIterationCount?: Property.AnimationIterationCount | undefined;
        MozAnimationName?: Property.AnimationName | undefined;
        MozAnimationPlayState?: Property.AnimationPlayState | undefined;
        MozAnimationTimingFunction?: Property.AnimationTimingFunction | undefined;
        MozAppearance?: Property.MozAppearance | undefined;
        MozBackfaceVisibility?: Property.BackfaceVisibility | undefined;
        MozBorderBottomColors?: Property.MozBorderBottomColors | undefined;
        MozBorderEndColor?: Property.BorderInlineEndColor | undefined;
        MozBorderEndStyle?: Property.BorderInlineEndStyle | undefined;
        MozBorderEndWidth?: Property.BorderInlineEndWidth<TLength> | undefined;
        MozBorderLeftColors?: Property.MozBorderLeftColors | undefined;
        MozBorderRightColors?: Property.MozBorderRightColors | undefined;
        MozBorderStartColor?: Property.BorderInlineStartColor | undefined;
        MozBorderStartStyle?: Property.BorderInlineStartStyle | undefined;
        MozBorderTopColors?: Property.MozBorderTopColors | undefined;
        MozBoxSizing?: Property.BoxSizing | undefined;
        MozColumnCount?: Property.ColumnCount | undefined;
        MozColumnFill?: Property.ColumnFill | undefined;
        MozColumnGap?: Property.ColumnGap<TLength> | undefined;
        MozColumnRuleColor?: Property.ColumnRuleColor | undefined;
        MozColumnRuleStyle?: Property.ColumnRuleStyle | undefined;
        MozColumnRuleWidth?: Property.ColumnRuleWidth<TLength> | undefined;
        MozColumnWidth?: Property.ColumnWidth<TLength> | undefined;
        MozContextProperties?: Property.MozContextProperties | undefined;
        MozFontFeatureSettings?: Property.FontFeatureSettings | undefined;
        MozFontLanguageOverride?: Property.FontLanguageOverride | undefined;
        MozHyphens?: Property.Hyphens | undefined;
        MozImageRegion?: Property.MozImageRegion | undefined;
        MozMarginEnd?: Property.MarginInlineEnd<TLength> | undefined;
        MozMarginStart?: Property.MarginInlineStart<TLength> | undefined;
        MozOrient?: Property.MozOrient | undefined;
        MozOsxFontSmoothing?: Property.FontSmooth<TLength> | undefined;
        MozPaddingEnd?: Property.PaddingInlineEnd<TLength> | undefined;
        MozPaddingStart?: Property.PaddingInlineStart<TLength> | undefined;
        MozPerspective?: Property.Perspective<TLength> | undefined;
        MozPerspectiveOrigin?: Property.PerspectiveOrigin<TLength> | undefined;
        MozStackSizing?: Property.MozStackSizing | undefined;
        MozTabSize?: Property.TabSize<TLength> | undefined;
        MozTextBlink?: Property.MozTextBlink | undefined;
        MozTextSizeAdjust?: Property.TextSizeAdjust | undefined;
        MozTransformOrigin?: Property.TransformOrigin<TLength> | undefined;
        MozTransformStyle?: Property.TransformStyle | undefined;
        MozTransitionDelay?: Property.TransitionDelay<TTime> | undefined;
        MozTransitionDuration?: Property.TransitionDuration<TTime> | undefined;
        MozTransitionProperty?: Property.TransitionProperty | undefined;
        MozTransitionTimingFunction?: Property.TransitionTimingFunction | undefined;
        MozUserFocus?: Property.MozUserFocus | undefined;
        MozUserModify?: Property.MozUserModify | undefined;
        MozUserSelect?: Property.UserSelect | undefined;
        MozWindowDragging?: Property.MozWindowDragging | undefined;
        MozWindowShadow?: Property.MozWindowShadow | undefined;
        msAccelerator?: Property.MsAccelerator | undefined;
        msAlignSelf?: Property.AlignSelf | undefined;
        msBlockProgression?: Property.MsBlockProgression | undefined;
        msContentZoomChaining?: Property.MsContentZoomChaining | undefined;
        msContentZoomLimitMax?: Property.MsContentZoomLimitMax | undefined;
        msContentZoomLimitMin?: Property.MsContentZoomLimitMin | undefined;
        msContentZoomSnapPoints?: Property.MsContentZoomSnapPoints | undefined;
        msContentZoomSnapType?: Property.MsContentZoomSnapType | undefined;
        msContentZooming?: Property.MsContentZooming | undefined;
        msFilter?: Property.MsFilter | undefined;
        msFlexDirection?: Property.FlexDirection | undefined;
        msFlexPositive?: Property.FlexGrow | undefined;
        msFlowFrom?: Property.MsFlowFrom | undefined;
        msFlowInto?: Property.MsFlowInto | undefined;
        msGridColumns?: Property.MsGridColumns<TLength> | undefined;
        msGridRows?: Property.MsGridRows<TLength> | undefined;
        msHighContrastAdjust?: Property.MsHighContrastAdjust | undefined;
        msHyphenateLimitChars?: Property.MsHyphenateLimitChars | undefined;
        msHyphenateLimitLines?: Property.MsHyphenateLimitLines | undefined;
        msHyphenateLimitZone?: Property.MsHyphenateLimitZone<TLength> | undefined;
        msHyphens?: Property.Hyphens | undefined;
        msImeAlign?: Property.MsImeAlign | undefined;
        msJustifySelf?: Property.JustifySelf | undefined;
        msLineBreak?: Property.LineBreak | undefined;
        msOrder?: Property.Order | undefined;
        msOverflowStyle?: Property.MsOverflowStyle | undefined;
        msOverflowX?: Property.OverflowX | undefined;
        msOverflowY?: Property.OverflowY | undefined;
        msScrollChaining?: Property.MsScrollChaining | undefined;
        msScrollLimitXMax?: Property.MsScrollLimitXMax<TLength> | undefined;
        msScrollLimitXMin?: Property.MsScrollLimitXMin<TLength> | undefined;
        msScrollLimitYMax?: Property.MsScrollLimitYMax<TLength> | undefined;
        msScrollLimitYMin?: Property.MsScrollLimitYMin<TLength> | undefined;
        msScrollRails?: Property.MsScrollRails | undefined;
        msScrollSnapPointsX?: Property.MsScrollSnapPointsX | undefined;
        msScrollSnapPointsY?: Property.MsScrollSnapPointsY | undefined;
        msScrollSnapType?: Property.MsScrollSnapType | undefined;
        msScrollTranslation?: Property.MsScrollTranslation | undefined;
        msScrollbar3dlightColor?: Property.MsScrollbar3dlightColor | undefined;
        msScrollbarArrowColor?: Property.MsScrollbarArrowColor | undefined;
        msScrollbarBaseColor?: Property.MsScrollbarBaseColor | undefined;
        msScrollbarDarkshadowColor?: Property.MsScrollbarDarkshadowColor | undefined;
        msScrollbarFaceColor?: Property.MsScrollbarFaceColor | undefined;
        msScrollbarHighlightColor?: Property.MsScrollbarHighlightColor | undefined;
        msScrollbarShadowColor?: Property.MsScrollbarShadowColor | undefined;
        msTextAutospace?: Property.MsTextAutospace | undefined;
        msTextCombineHorizontal?: Property.TextCombineUpright | undefined;
        msTextOverflow?: Property.TextOverflow | undefined;
        msTouchAction?: Property.TouchAction | undefined;
        msTouchSelect?: Property.MsTouchSelect | undefined;
        msTransform?: Property.Transform | undefined;
        msTransformOrigin?: Property.TransformOrigin<TLength> | undefined;
        msTransitionDelay?: Property.TransitionDelay<TTime> | undefined;
        msTransitionDuration?: Property.TransitionDuration<TTime> | undefined;
        msTransitionProperty?: Property.TransitionProperty | undefined;
        msTransitionTimingFunction?: Property.TransitionTimingFunction | undefined;
        msUserSelect?: Property.MsUserSelect | undefined;
        msWordBreak?: Property.WordBreak | undefined;
        msWrapFlow?: Property.MsWrapFlow | undefined;
        msWrapMargin?: Property.MsWrapMargin<TLength> | undefined;
        msWrapThrough?: Property.MsWrapThrough | undefined;
        msWritingMode?: Property.WritingMode | undefined;
        WebkitAlignContent?: Property.AlignContent | undefined;
        WebkitAlignItems?: Property.AlignItems | undefined;
        WebkitAlignSelf?: Property.AlignSelf | undefined;
        WebkitAnimationDelay?: Property.AnimationDelay<TTime> | undefined;
        WebkitAnimationDirection?: Property.AnimationDirection | undefined;
        WebkitAnimationDuration?: Property.AnimationDuration<TTime> | undefined;
        WebkitAnimationFillMode?: Property.AnimationFillMode | undefined;
        WebkitAnimationIterationCount?: Property.AnimationIterationCount | undefined;
        WebkitAnimationName?: Property.AnimationName | undefined;
        WebkitAnimationPlayState?: Property.AnimationPlayState | undefined;
        WebkitAnimationTimingFunction?: Property.AnimationTimingFunction | undefined;
        WebkitAppearance?: Property.WebkitAppearance | undefined;
        WebkitBackdropFilter?: Property.BackdropFilter | undefined;
        WebkitBackfaceVisibility?: Property.BackfaceVisibility | undefined;
        WebkitBackgroundClip?: Property.BackgroundClip | undefined;
        WebkitBackgroundOrigin?: Property.BackgroundOrigin | undefined;
        WebkitBackgroundSize?: Property.BackgroundSize<TLength> | undefined;
        WebkitBorderBeforeColor?: Property.WebkitBorderBeforeColor | undefined;
        WebkitBorderBeforeStyle?: Property.WebkitBorderBeforeStyle | undefined;
        WebkitBorderBeforeWidth?: Property.WebkitBorderBeforeWidth<TLength> | undefined;
        WebkitBorderBottomLeftRadius?: Property.BorderBottomLeftRadius<TLength> | undefined;
        WebkitBorderBottomRightRadius?: Property.BorderBottomRightRadius<TLength> | undefined;
        WebkitBorderImageSlice?: Property.BorderImageSlice | undefined;
        WebkitBorderTopLeftRadius?: Property.BorderTopLeftRadius<TLength> | undefined;
        WebkitBorderTopRightRadius?: Property.BorderTopRightRadius<TLength> | undefined;
        WebkitBoxDecorationBreak?: Property.BoxDecorationBreak | undefined;
        WebkitBoxReflect?: Property.WebkitBoxReflect<TLength> | undefined;
        WebkitBoxShadow?: Property.BoxShadow | undefined;
        WebkitBoxSizing?: Property.BoxSizing | undefined;
        WebkitClipPath?: Property.ClipPath | undefined;
        WebkitColumnCount?: Property.ColumnCount | undefined;
        WebkitColumnFill?: Property.ColumnFill | undefined;
        WebkitColumnGap?: Property.ColumnGap<TLength> | undefined;
        WebkitColumnRuleColor?: Property.ColumnRuleColor | undefined;
        WebkitColumnRuleStyle?: Property.ColumnRuleStyle | undefined;
        WebkitColumnRuleWidth?: Property.ColumnRuleWidth<TLength> | undefined;
        WebkitColumnSpan?: Property.ColumnSpan | undefined;
        WebkitColumnWidth?: Property.ColumnWidth<TLength> | undefined;
        WebkitFilter?: Property.Filter | undefined;
        WebkitFlexBasis?: Property.FlexBasis<TLength> | undefined;
        WebkitFlexDirection?: Property.FlexDirection | undefined;
        WebkitFlexGrow?: Property.FlexGrow | undefined;
        WebkitFlexShrink?: Property.FlexShrink | undefined;
        WebkitFlexWrap?: Property.FlexWrap | undefined;
        WebkitFontFeatureSettings?: Property.FontFeatureSettings | undefined;
        WebkitFontKerning?: Property.FontKerning | undefined;
        WebkitFontSmoothing?: Property.FontSmooth<TLength> | undefined;
        WebkitFontVariantLigatures?: Property.FontVariantLigatures | undefined;
        WebkitHyphens?: Property.Hyphens | undefined;
        WebkitInitialLetter?: Property.InitialLetter | undefined;
        WebkitJustifyContent?: Property.JustifyContent | undefined;
        WebkitLineBreak?: Property.LineBreak | undefined;
        WebkitLineClamp?: Property.WebkitLineClamp | undefined;
        WebkitMarginEnd?: Property.MarginInlineEnd<TLength> | undefined;
        WebkitMarginStart?: Property.MarginInlineStart<TLength> | undefined;
        WebkitMaskAttachment?: Property.WebkitMaskAttachment | undefined;
        WebkitMaskBoxImageOutset?: Property.MaskBorderOutset<TLength> | undefined;
        WebkitMaskBoxImageRepeat?: Property.MaskBorderRepeat | undefined;
        WebkitMaskBoxImageSlice?: Property.MaskBorderSlice | undefined;
        WebkitMaskBoxImageSource?: Property.MaskBorderSource | undefined;
        WebkitMaskBoxImageWidth?: Property.MaskBorderWidth<TLength> | undefined;
        WebkitMaskClip?: Property.WebkitMaskClip | undefined;
        WebkitMaskComposite?: Property.WebkitMaskComposite | undefined;
        WebkitMaskImage?: Property.WebkitMaskImage | undefined;
        WebkitMaskOrigin?: Property.WebkitMaskOrigin | undefined;
        WebkitMaskPosition?: Property.WebkitMaskPosition<TLength> | undefined;
        WebkitMaskPositionX?: Property.WebkitMaskPositionX<TLength> | undefined;
        WebkitMaskPositionY?: Property.WebkitMaskPositionY<TLength> | undefined;
        WebkitMaskRepeat?: Property.WebkitMaskRepeat | undefined;
        WebkitMaskRepeatX?: Property.WebkitMaskRepeatX | undefined;
        WebkitMaskRepeatY?: Property.WebkitMaskRepeatY | undefined;
        WebkitMaskSize?: Property.WebkitMaskSize<TLength> | undefined;
        WebkitMaxInlineSize?: Property.MaxInlineSize<TLength> | undefined;
        WebkitOrder?: Property.Order | undefined;
        WebkitOverflowScrolling?: Property.WebkitOverflowScrolling | undefined;
        WebkitPaddingEnd?: Property.PaddingInlineEnd<TLength> | undefined;
        WebkitPaddingStart?: Property.PaddingInlineStart<TLength> | undefined;
        WebkitPerspective?: Property.Perspective<TLength> | undefined;
        WebkitPerspectiveOrigin?: Property.PerspectiveOrigin<TLength> | undefined;
        WebkitPrintColorAdjust?: Property.ColorAdjust | undefined;
        WebkitRubyPosition?: Property.RubyPosition | undefined;
        WebkitScrollSnapType?: Property.ScrollSnapType | undefined;
        WebkitShapeMargin?: Property.ShapeMargin<TLength> | undefined;
        WebkitTapHighlightColor?: Property.WebkitTapHighlightColor | undefined;
        WebkitTextCombine?: Property.TextCombineUpright | undefined;
        WebkitTextDecorationColor?: Property.TextDecorationColor | undefined;
        WebkitTextDecorationLine?: Property.TextDecorationLine | undefined;
        WebkitTextDecorationSkip?: Property.TextDecorationSkip | undefined;
        WebkitTextDecorationStyle?: Property.TextDecorationStyle | undefined;
        WebkitTextEmphasisColor?: Property.TextEmphasisColor | undefined;
        WebkitTextEmphasisPosition?: Property.TextEmphasisPosition | undefined;
        WebkitTextEmphasisStyle?: Property.TextEmphasisStyle | undefined;
        WebkitTextFillColor?: Property.WebkitTextFillColor | undefined;
        WebkitTextOrientation?: Property.TextOrientation | undefined;
        WebkitTextSizeAdjust?: Property.TextSizeAdjust | undefined;
        WebkitTextStrokeColor?: Property.WebkitTextStrokeColor | undefined;
        WebkitTextStrokeWidth?: Property.WebkitTextStrokeWidth<TLength> | undefined;
        WebkitTextUnderlinePosition?: Property.TextUnderlinePosition | undefined;
        WebkitTouchCallout?: Property.WebkitTouchCallout | undefined;
        WebkitTransform?: Property.Transform | undefined;
        WebkitTransformOrigin?: Property.TransformOrigin<TLength> | undefined;
        WebkitTransformStyle?: Property.TransformStyle | undefined;
        WebkitTransitionDelay?: Property.TransitionDelay<TTime> | undefined;
        WebkitTransitionDuration?: Property.TransitionDuration<TTime> | undefined;
        WebkitTransitionProperty?: Property.TransitionProperty | undefined;
        WebkitTransitionTimingFunction?: Property.TransitionTimingFunction | undefined;
        WebkitUserModify?: Property.WebkitUserModify | undefined;
        WebkitUserSelect?: Property.UserSelect | undefined;
        WebkitWritingMode?: Property.WritingMode | undefined;
    }
    export interface VendorShorthandProperties<TLength = (string & {}) | 0, TTime = string & {}> {
        MozAnimation?: Property.Animation<TTime> | undefined;
        MozBorderImage?: Property.BorderImage | undefined;
        MozColumnRule?: Property.ColumnRule<TLength> | undefined;
        MozColumns?: Property.Columns<TLength> | undefined;
        MozTransition?: Property.Transition<TTime> | undefined;
        msContentZoomLimit?: Property.MsContentZoomLimit | undefined;
        msContentZoomSnap?: Property.MsContentZoomSnap | undefined;
        msFlex?: Property.Flex<TLength> | undefined;
        msScrollLimit?: Property.MsScrollLimit | undefined;
        msScrollSnapX?: Property.MsScrollSnapX | undefined;
        msScrollSnapY?: Property.MsScrollSnapY | undefined;
        msTransition?: Property.Transition<TTime> | undefined;
        WebkitAnimation?: Property.Animation<TTime> | undefined;
        WebkitBorderBefore?: Property.WebkitBorderBefore<TLength> | undefined;
        WebkitBorderImage?: Property.BorderImage | undefined;
        WebkitBorderRadius?: Property.BorderRadius<TLength> | undefined;
        WebkitColumnRule?: Property.ColumnRule<TLength> | undefined;
        WebkitColumns?: Property.Columns<TLength> | undefined;
        WebkitFlex?: Property.Flex<TLength> | undefined;
        WebkitFlexFlow?: Property.FlexFlow | undefined;
        WebkitMask?: Property.WebkitMask<TLength> | undefined;
        WebkitMaskBoxImage?: Property.MaskBorder | undefined;
        WebkitTextEmphasis?: Property.TextEmphasis | undefined;
        WebkitTextStroke?: Property.WebkitTextStroke<TLength> | undefined;
        WebkitTransition?: Property.Transition<TTime> | undefined;
    }
    export interface VendorProperties<TLength = (string & {}) | 0, TTime = string & {}> extends VendorLonghandProperties<TLength, TTime>, VendorShorthandProperties<TLength, TTime> {
    }
    export interface ObsoleteProperties<TLength = (string & {}) | 0, TTime = string & {}> {
        azimuth?: Property.Azimuth | undefined;
        boxAlign?: Property.BoxAlign | undefined;
        boxDirection?: Property.BoxDirection | undefined;
        boxFlex?: Property.BoxFlex | undefined;
        boxFlexGroup?: Property.BoxFlexGroup | undefined;
        boxLines?: Property.BoxLines | undefined;
        boxOrdinalGroup?: Property.BoxOrdinalGroup | undefined;
        boxOrient?: Property.BoxOrient | undefined;
        boxPack?: Property.BoxPack | undefined;
        clip?: Property.Clip | undefined;
        fontVariantAlternates?: Property.FontVariantAlternates | undefined;
        gridColumnGap?: Property.GridColumnGap<TLength> | undefined;
        gridGap?: Property.GridGap<TLength> | undefined;
        gridRowGap?: Property.GridRowGap<TLength> | undefined;
        imeMode?: Property.ImeMode | undefined;
        offsetBlock?: Property.InsetBlock<TLength> | undefined;
        offsetBlockEnd?: Property.InsetBlockEnd<TLength> | undefined;
        offsetBlockStart?: Property.InsetBlockStart<TLength> | undefined;
        offsetInline?: Property.InsetInline<TLength> | undefined;
        offsetInlineEnd?: Property.InsetInlineEnd<TLength> | undefined;
        offsetInlineStart?: Property.InsetInlineStart<TLength> | undefined;
        scrollSnapCoordinate?: Property.ScrollSnapCoordinate<TLength> | undefined;
        scrollSnapDestination?: Property.ScrollSnapDestination<TLength> | undefined;
        scrollSnapPointsX?: Property.ScrollSnapPointsX | undefined;
        scrollSnapPointsY?: Property.ScrollSnapPointsY | undefined;
        scrollSnapTypeX?: Property.ScrollSnapTypeX | undefined;
        scrollSnapTypeY?: Property.ScrollSnapTypeY | undefined;
        scrollbarTrackColor?: Property.MsScrollbarTrackColor | undefined;
        KhtmlBoxAlign?: Property.BoxAlign | undefined;
        KhtmlBoxDirection?: Property.BoxDirection | undefined;
        KhtmlBoxFlex?: Property.BoxFlex | undefined;
        KhtmlBoxFlexGroup?: Property.BoxFlexGroup | undefined;
        KhtmlBoxLines?: Property.BoxLines | undefined;
        KhtmlBoxOrdinalGroup?: Property.BoxOrdinalGroup | undefined;
        KhtmlBoxOrient?: Property.BoxOrient | undefined;
        KhtmlBoxPack?: Property.BoxPack | undefined;
        KhtmlLineBreak?: Property.LineBreak | undefined;
        KhtmlOpacity?: Property.Opacity | undefined;
        KhtmlUserSelect?: Property.UserSelect | undefined;
        MozBackgroundClip?: Property.BackgroundClip | undefined;
        MozBackgroundInlinePolicy?: Property.BoxDecorationBreak | undefined;
        MozBackgroundOrigin?: Property.BackgroundOrigin | undefined;
        MozBackgroundSize?: Property.BackgroundSize<TLength> | undefined;
        MozBinding?: Property.MozBinding | undefined;
        MozBorderRadius?: Property.BorderRadius<TLength> | undefined;
        MozBorderRadiusBottomleft?: Property.BorderBottomLeftRadius<TLength> | undefined;
        MozBorderRadiusBottomright?: Property.BorderBottomRightRadius<TLength> | undefined;
        MozBorderRadiusTopleft?: Property.BorderTopLeftRadius<TLength> | undefined;
        MozBorderRadiusTopright?: Property.BorderTopRightRadius<TLength> | undefined;
        MozBoxAlign?: Property.BoxAlign | undefined;
        MozBoxDirection?: Property.BoxDirection | undefined;
        MozBoxFlex?: Property.BoxFlex | undefined;
        MozBoxOrdinalGroup?: Property.BoxOrdinalGroup | undefined;
        MozBoxOrient?: Property.BoxOrient | undefined;
        MozBoxPack?: Property.BoxPack | undefined;
        MozBoxShadow?: Property.BoxShadow | undefined;
        MozFloatEdge?: Property.MozFloatEdge | undefined;
        MozForceBrokenImageIcon?: Property.MozForceBrokenImageIcon | undefined;
        MozOpacity?: Property.Opacity | undefined;
        MozOutline?: Property.Outline<TLength> | undefined;
        MozOutlineColor?: Property.OutlineColor | undefined;
        MozOutlineRadius?: Property.MozOutlineRadius<TLength> | undefined;
        MozOutlineRadiusBottomleft?: Property.MozOutlineRadiusBottomleft<TLength> | undefined;
        MozOutlineRadiusBottomright?: Property.MozOutlineRadiusBottomright<TLength> | undefined;
        MozOutlineRadiusTopleft?: Property.MozOutlineRadiusTopleft<TLength> | undefined;
        MozOutlineRadiusTopright?: Property.MozOutlineRadiusTopright<TLength> | undefined;
        MozOutlineStyle?: Property.OutlineStyle | undefined;
        MozOutlineWidth?: Property.OutlineWidth<TLength> | undefined;
        MozTextAlignLast?: Property.TextAlignLast | undefined;
        MozTextDecorationColor?: Property.TextDecorationColor | undefined;
        MozTextDecorationLine?: Property.TextDecorationLine | undefined;
        MozTextDecorationStyle?: Property.TextDecorationStyle | undefined;
        MozUserInput?: Property.MozUserInput | undefined;
        msImeMode?: Property.ImeMode | undefined;
        msScrollbarTrackColor?: Property.MsScrollbarTrackColor | undefined;
        OAnimation?: Property.Animation<TTime> | undefined;
        OAnimationDelay?: Property.AnimationDelay<TTime> | undefined;
        OAnimationDirection?: Property.AnimationDirection | undefined;
        OAnimationDuration?: Property.AnimationDuration<TTime> | undefined;
        OAnimationFillMode?: Property.AnimationFillMode | undefined;
        OAnimationIterationCount?: Property.AnimationIterationCount | undefined;
        OAnimationName?: Property.AnimationName | undefined;
        OAnimationPlayState?: Property.AnimationPlayState | undefined;
        OAnimationTimingFunction?: Property.AnimationTimingFunction | undefined;
        OBackgroundSize?: Property.BackgroundSize<TLength> | undefined;
        OBorderImage?: Property.BorderImage | undefined;
        OObjectFit?: Property.ObjectFit | undefined;
        OObjectPosition?: Property.ObjectPosition<TLength> | undefined;
        OTabSize?: Property.TabSize<TLength> | undefined;
        OTextOverflow?: Property.TextOverflow | undefined;
        OTransform?: Property.Transform | undefined;
        OTransformOrigin?: Property.TransformOrigin<TLength> | undefined;
        OTransition?: Property.Transition<TTime> | undefined;
        OTransitionDelay?: Property.TransitionDelay<TTime> | undefined;
        OTransitionDuration?: Property.TransitionDuration<TTime> | undefined;
        OTransitionProperty?: Property.TransitionProperty | undefined;
        OTransitionTimingFunction?: Property.TransitionTimingFunction | undefined;
        WebkitBoxAlign?: Property.BoxAlign | undefined;
        WebkitBoxDirection?: Property.BoxDirection | undefined;
        WebkitBoxFlex?: Property.BoxFlex | undefined;
        WebkitBoxFlexGroup?: Property.BoxFlexGroup | undefined;
        WebkitBoxLines?: Property.BoxLines | undefined;
        WebkitBoxOrdinalGroup?: Property.BoxOrdinalGroup | undefined;
        WebkitBoxOrient?: Property.BoxOrient | undefined;
        WebkitBoxPack?: Property.BoxPack | undefined;
        WebkitScrollSnapPointsX?: Property.ScrollSnapPointsX | undefined;
        WebkitScrollSnapPointsY?: Property.ScrollSnapPointsY | undefined;
    }
    export interface SvgProperties<TLength = (string & {}) | 0, TTime = string & {}> {
        alignmentBaseline?: Property.AlignmentBaseline | undefined;
        baselineShift?: Property.BaselineShift<TLength> | undefined;
        clip?: Property.Clip | undefined;
        clipPath?: Property.ClipPath | undefined;
        clipRule?: Property.ClipRule | undefined;
        color?: Property.Color | undefined;
        colorInterpolation?: Property.ColorInterpolation | undefined;
        colorRendering?: Property.ColorRendering | undefined;
        cursor?: Property.Cursor | undefined;
        direction?: Property.Direction | undefined;
        display?: Property.Display | undefined;
        dominantBaseline?: Property.DominantBaseline | undefined;
        fill?: Property.Fill | undefined;
        fillOpacity?: Property.FillOpacity | undefined;
        fillRule?: Property.FillRule | undefined;
        filter?: Property.Filter | undefined;
        floodColor?: Property.FloodColor | undefined;
        floodOpacity?: Property.FloodOpacity | undefined;
        font?: Property.Font | undefined;
        fontFamily?: Property.FontFamily | undefined;
        fontSize?: Property.FontSize<TLength> | undefined;
        fontSizeAdjust?: Property.FontSizeAdjust | undefined;
        fontStretch?: Property.FontStretch | undefined;
        fontStyle?: Property.FontStyle | undefined;
        fontVariant?: Property.FontVariant | undefined;
        fontWeight?: Property.FontWeight | undefined;
        glyphOrientationVertical?: Property.GlyphOrientationVertical | undefined;
        imageRendering?: Property.ImageRendering | undefined;
        letterSpacing?: Property.LetterSpacing<TLength> | undefined;
        lightingColor?: Property.LightingColor | undefined;
        lineHeight?: Property.LineHeight<TLength> | undefined;
        marker?: Property.Marker | undefined;
        markerEnd?: Property.MarkerEnd | undefined;
        markerMid?: Property.MarkerMid | undefined;
        markerStart?: Property.MarkerStart | undefined;
        mask?: Property.Mask<TLength> | undefined;
        opacity?: Property.Opacity | undefined;
        overflow?: Property.Overflow | undefined;
        paintOrder?: Property.PaintOrder | undefined;
        pointerEvents?: Property.PointerEvents | undefined;
        shapeRendering?: Property.ShapeRendering | undefined;
        stopColor?: Property.StopColor | undefined;
        stopOpacity?: Property.StopOpacity | undefined;
        stroke?: Property.Stroke | undefined;
        strokeDasharray?: Property.StrokeDasharray<TLength> | undefined;
        strokeDashoffset?: Property.StrokeDashoffset<TLength> | undefined;
        strokeLinecap?: Property.StrokeLinecap | undefined;
        strokeLinejoin?: Property.StrokeLinejoin | undefined;
        strokeMiterlimit?: Property.StrokeMiterlimit | undefined;
        strokeOpacity?: Property.StrokeOpacity | undefined;
        strokeWidth?: Property.StrokeWidth<TLength> | undefined;
        textAnchor?: Property.TextAnchor | undefined;
        textDecoration?: Property.TextDecoration<TLength> | undefined;
        textRendering?: Property.TextRendering | undefined;
        unicodeBidi?: Property.UnicodeBidi | undefined;
        vectorEffect?: Property.VectorEffect | undefined;
        visibility?: Property.Visibility | undefined;
        whiteSpace?: Property.WhiteSpace | undefined;
        wordSpacing?: Property.WordSpacing<TLength> | undefined;
        writingMode?: Property.WritingMode | undefined;
    }
    export interface Properties<TLength = (string & {}) | 0, TTime = string & {}> extends StandardProperties<TLength, TTime>, VendorProperties<TLength, TTime>, ObsoleteProperties<TLength, TTime>, SvgProperties<TLength, TTime> {
    }
    export interface StandardLonghandPropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
        "accent-color"?: Property.AccentColor | undefined;
        "align-content"?: Property.AlignContent | undefined;
        "align-items"?: Property.AlignItems | undefined;
        "align-self"?: Property.AlignSelf | undefined;
        "align-tracks"?: Property.AlignTracks | undefined;
        "animation-delay"?: Property.AnimationDelay<TTime> | undefined;
        "animation-direction"?: Property.AnimationDirection | undefined;
        "animation-duration"?: Property.AnimationDuration<TTime> | undefined;
        "animation-fill-mode"?: Property.AnimationFillMode | undefined;
        "animation-iteration-count"?: Property.AnimationIterationCount | undefined;
        "animation-name"?: Property.AnimationName | undefined;
        "animation-play-state"?: Property.AnimationPlayState | undefined;
        "animation-timing-function"?: Property.AnimationTimingFunction | undefined;
        appearance?: Property.Appearance | undefined;
        "aspect-ratio"?: Property.AspectRatio | undefined;
        "backdrop-filter"?: Property.BackdropFilter | undefined;
        "backface-visibility"?: Property.BackfaceVisibility | undefined;
        "background-attachment"?: Property.BackgroundAttachment | undefined;
        "background-blend-mode"?: Property.BackgroundBlendMode | undefined;
        "background-clip"?: Property.BackgroundClip | undefined;
        "background-color"?: Property.BackgroundColor | undefined;
        "background-image"?: Property.BackgroundImage | undefined;
        "background-origin"?: Property.BackgroundOrigin | undefined;
        "background-position-x"?: Property.BackgroundPositionX<TLength> | undefined;
        "background-position-y"?: Property.BackgroundPositionY<TLength> | undefined;
        "background-repeat"?: Property.BackgroundRepeat | undefined;
        "background-size"?: Property.BackgroundSize<TLength> | undefined;
        "block-overflow"?: Property.BlockOverflow | undefined;
        "block-size"?: Property.BlockSize<TLength> | undefined;
        "border-block-color"?: Property.BorderBlockColor | undefined;
        "border-block-end-color"?: Property.BorderBlockEndColor | undefined;
        "border-block-end-style"?: Property.BorderBlockEndStyle | undefined;
        "border-block-end-width"?: Property.BorderBlockEndWidth<TLength> | undefined;
        "border-block-start-color"?: Property.BorderBlockStartColor | undefined;
        "border-block-start-style"?: Property.BorderBlockStartStyle | undefined;
        "border-block-start-width"?: Property.BorderBlockStartWidth<TLength> | undefined;
        "border-block-style"?: Property.BorderBlockStyle | undefined;
        "border-block-width"?: Property.BorderBlockWidth<TLength> | undefined;
        "border-bottom-color"?: Property.BorderBottomColor | undefined;
        "border-bottom-left-radius"?: Property.BorderBottomLeftRadius<TLength> | undefined;
        "border-bottom-right-radius"?: Property.BorderBottomRightRadius<TLength> | undefined;
        "border-bottom-style"?: Property.BorderBottomStyle | undefined;
        "border-bottom-width"?: Property.BorderBottomWidth<TLength> | undefined;
        "border-collapse"?: Property.BorderCollapse | undefined;
        "border-end-end-radius"?: Property.BorderEndEndRadius<TLength> | undefined;
        "border-end-start-radius"?: Property.BorderEndStartRadius<TLength> | undefined;
        "border-image-outset"?: Property.BorderImageOutset<TLength> | undefined;
        "border-image-repeat"?: Property.BorderImageRepeat | undefined;
        "border-image-slice"?: Property.BorderImageSlice | undefined;
        "border-image-source"?: Property.BorderImageSource | undefined;
        "border-image-width"?: Property.BorderImageWidth<TLength> | undefined;
        "border-inline-color"?: Property.BorderInlineColor | undefined;
        "border-inline-end-color"?: Property.BorderInlineEndColor | undefined;
        "border-inline-end-style"?: Property.BorderInlineEndStyle | undefined;
        "border-inline-end-width"?: Property.BorderInlineEndWidth<TLength> | undefined;
        "border-inline-start-color"?: Property.BorderInlineStartColor | undefined;
        "border-inline-start-style"?: Property.BorderInlineStartStyle | undefined;
        "border-inline-start-width"?: Property.BorderInlineStartWidth<TLength> | undefined;
        "border-inline-style"?: Property.BorderInlineStyle | undefined;
        "border-inline-width"?: Property.BorderInlineWidth<TLength> | undefined;
        "border-left-color"?: Property.BorderLeftColor | undefined;
        "border-left-style"?: Property.BorderLeftStyle | undefined;
        "border-left-width"?: Property.BorderLeftWidth<TLength> | undefined;
        "border-right-color"?: Property.BorderRightColor | undefined;
        "border-right-style"?: Property.BorderRightStyle | undefined;
        "border-right-width"?: Property.BorderRightWidth<TLength> | undefined;
        "border-spacing"?: Property.BorderSpacing<TLength> | undefined;
        "border-start-end-radius"?: Property.BorderStartEndRadius<TLength> | undefined;
        "border-start-start-radius"?: Property.BorderStartStartRadius<TLength> | undefined;
        "border-top-color"?: Property.BorderTopColor | undefined;
        "border-top-left-radius"?: Property.BorderTopLeftRadius<TLength> | undefined;
        "border-top-right-radius"?: Property.BorderTopRightRadius<TLength> | undefined;
        "border-top-style"?: Property.BorderTopStyle | undefined;
        "border-top-width"?: Property.BorderTopWidth<TLength> | undefined;
        bottom?: Property.Bottom<TLength> | undefined;
        "box-decoration-break"?: Property.BoxDecorationBreak | undefined;
        "box-shadow"?: Property.BoxShadow | undefined;
        "box-sizing"?: Property.BoxSizing | undefined;
        "break-after"?: Property.BreakAfter | undefined;
        "break-before"?: Property.BreakBefore | undefined;
        "break-inside"?: Property.BreakInside | undefined;
        "caption-side"?: Property.CaptionSide | undefined;
        "caret-color"?: Property.CaretColor | undefined;
        clear?: Property.Clear | undefined;
        "clip-path"?: Property.ClipPath | undefined;
        color?: Property.Color | undefined;
        "color-adjust"?: Property.ColorAdjust | undefined;
        "color-scheme"?: Property.ColorScheme | undefined;
        "column-count"?: Property.ColumnCount | undefined;
        "column-fill"?: Property.ColumnFill | undefined;
        "column-gap"?: Property.ColumnGap<TLength> | undefined;
        "column-rule-color"?: Property.ColumnRuleColor | undefined;
        "column-rule-style"?: Property.ColumnRuleStyle | undefined;
        "column-rule-width"?: Property.ColumnRuleWidth<TLength> | undefined;
        "column-span"?: Property.ColumnSpan | undefined;
        "column-width"?: Property.ColumnWidth<TLength> | undefined;
        contain?: Property.Contain | undefined;
        content?: Property.Content | undefined;
        "content-visibility"?: Property.ContentVisibility | undefined;
        "counter-increment"?: Property.CounterIncrement | undefined;
        "counter-reset"?: Property.CounterReset | undefined;
        "counter-set"?: Property.CounterSet | undefined;
        cursor?: Property.Cursor | undefined;
        direction?: Property.Direction | undefined;
        display?: Property.Display | undefined;
        "empty-cells"?: Property.EmptyCells | undefined;
        filter?: Property.Filter | undefined;
        "flex-basis"?: Property.FlexBasis<TLength> | undefined;
        "flex-direction"?: Property.FlexDirection | undefined;
        "flex-grow"?: Property.FlexGrow | undefined;
        "flex-shrink"?: Property.FlexShrink | undefined;
        "flex-wrap"?: Property.FlexWrap | undefined;
        float?: Property.Float | undefined;
        "font-family"?: Property.FontFamily | undefined;
        "font-feature-settings"?: Property.FontFeatureSettings | undefined;
        "font-kerning"?: Property.FontKerning | undefined;
        "font-language-override"?: Property.FontLanguageOverride | undefined;
        "font-optical-sizing"?: Property.FontOpticalSizing | undefined;
        "font-size"?: Property.FontSize<TLength> | undefined;
        "font-size-adjust"?: Property.FontSizeAdjust | undefined;
        "font-smooth"?: Property.FontSmooth<TLength> | undefined;
        "font-stretch"?: Property.FontStretch | undefined;
        "font-style"?: Property.FontStyle | undefined;
        "font-synthesis"?: Property.FontSynthesis | undefined;
        "font-variant"?: Property.FontVariant | undefined;
        "font-variant-caps"?: Property.FontVariantCaps | undefined;
        "font-variant-east-asian"?: Property.FontVariantEastAsian | undefined;
        "font-variant-ligatures"?: Property.FontVariantLigatures | undefined;
        "font-variant-numeric"?: Property.FontVariantNumeric | undefined;
        "font-variant-position"?: Property.FontVariantPosition | undefined;
        "font-variation-settings"?: Property.FontVariationSettings | undefined;
        "font-weight"?: Property.FontWeight | undefined;
        "forced-color-adjust"?: Property.ForcedColorAdjust | undefined;
        "grid-auto-columns"?: Property.GridAutoColumns<TLength> | undefined;
        "grid-auto-flow"?: Property.GridAutoFlow | undefined;
        "grid-auto-rows"?: Property.GridAutoRows<TLength> | undefined;
        "grid-column-end"?: Property.GridColumnEnd | undefined;
        "grid-column-start"?: Property.GridColumnStart | undefined;
        "grid-row-end"?: Property.GridRowEnd | undefined;
        "grid-row-start"?: Property.GridRowStart | undefined;
        "grid-template-areas"?: Property.GridTemplateAreas | undefined;
        "grid-template-columns"?: Property.GridTemplateColumns<TLength> | undefined;
        "grid-template-rows"?: Property.GridTemplateRows<TLength> | undefined;
        "hanging-punctuation"?: Property.HangingPunctuation | undefined;
        height?: Property.Height<TLength> | undefined;
        hyphens?: Property.Hyphens | undefined;
        "image-orientation"?: Property.ImageOrientation | undefined;
        "image-rendering"?: Property.ImageRendering | undefined;
        "image-resolution"?: Property.ImageResolution | undefined;
        "initial-letter"?: Property.InitialLetter | undefined;
        "inline-size"?: Property.InlineSize<TLength> | undefined;
        inset?: Property.Inset<TLength> | undefined;
        "inset-block"?: Property.InsetBlock<TLength> | undefined;
        "inset-block-end"?: Property.InsetBlockEnd<TLength> | undefined;
        "inset-block-start"?: Property.InsetBlockStart<TLength> | undefined;
        "inset-inline"?: Property.InsetInline<TLength> | undefined;
        "inset-inline-end"?: Property.InsetInlineEnd<TLength> | undefined;
        "inset-inline-start"?: Property.InsetInlineStart<TLength> | undefined;
        isolation?: Property.Isolation | undefined;
        "justify-content"?: Property.JustifyContent | undefined;
        "justify-items"?: Property.JustifyItems | undefined;
        "justify-self"?: Property.JustifySelf | undefined;
        "justify-tracks"?: Property.JustifyTracks | undefined;
        left?: Property.Left<TLength> | undefined;
        "letter-spacing"?: Property.LetterSpacing<TLength> | undefined;
        "line-break"?: Property.LineBreak | undefined;
        "line-height"?: Property.LineHeight<TLength> | undefined;
        "line-height-step"?: Property.LineHeightStep<TLength> | undefined;
        "list-style-image"?: Property.ListStyleImage | undefined;
        "list-style-position"?: Property.ListStylePosition | undefined;
        "list-style-type"?: Property.ListStyleType | undefined;
        "margin-block"?: Property.MarginBlock<TLength> | undefined;
        "margin-block-end"?: Property.MarginBlockEnd<TLength> | undefined;
        "margin-block-start"?: Property.MarginBlockStart<TLength> | undefined;
        "margin-bottom"?: Property.MarginBottom<TLength> | undefined;
        "margin-inline"?: Property.MarginInline<TLength> | undefined;
        "margin-inline-end"?: Property.MarginInlineEnd<TLength> | undefined;
        "margin-inline-start"?: Property.MarginInlineStart<TLength> | undefined;
        "margin-left"?: Property.MarginLeft<TLength> | undefined;
        "margin-right"?: Property.MarginRight<TLength> | undefined;
        "margin-top"?: Property.MarginTop<TLength> | undefined;
        "mask-border-mode"?: Property.MaskBorderMode | undefined;
        "mask-border-outset"?: Property.MaskBorderOutset<TLength> | undefined;
        "mask-border-repeat"?: Property.MaskBorderRepeat | undefined;
        "mask-border-slice"?: Property.MaskBorderSlice | undefined;
        "mask-border-source"?: Property.MaskBorderSource | undefined;
        "mask-border-width"?: Property.MaskBorderWidth<TLength> | undefined;
        "mask-clip"?: Property.MaskClip | undefined;
        "mask-composite"?: Property.MaskComposite | undefined;
        "mask-image"?: Property.MaskImage | undefined;
        "mask-mode"?: Property.MaskMode | undefined;
        "mask-origin"?: Property.MaskOrigin | undefined;
        "mask-position"?: Property.MaskPosition<TLength> | undefined;
        "mask-repeat"?: Property.MaskRepeat | undefined;
        "mask-size"?: Property.MaskSize<TLength> | undefined;
        "mask-type"?: Property.MaskType | undefined;
        "math-style"?: Property.MathStyle | undefined;
        "max-block-size"?: Property.MaxBlockSize<TLength> | undefined;
        "max-height"?: Property.MaxHeight<TLength> | undefined;
        "max-inline-size"?: Property.MaxInlineSize<TLength> | undefined;
        "max-lines"?: Property.MaxLines | undefined;
        "max-width"?: Property.MaxWidth<TLength> | undefined;
        "min-block-size"?: Property.MinBlockSize<TLength> | undefined;
        "min-height"?: Property.MinHeight<TLength> | undefined;
        "min-inline-size"?: Property.MinInlineSize<TLength> | undefined;
        "min-width"?: Property.MinWidth<TLength> | undefined;
        "mix-blend-mode"?: Property.MixBlendMode | undefined;
        "motion-distance"?: Property.OffsetDistance<TLength> | undefined;
        "motion-path"?: Property.OffsetPath | undefined;
        "motion-rotation"?: Property.OffsetRotate | undefined;
        "object-fit"?: Property.ObjectFit | undefined;
        "object-position"?: Property.ObjectPosition<TLength> | undefined;
        "offset-anchor"?: Property.OffsetAnchor<TLength> | undefined;
        "offset-distance"?: Property.OffsetDistance<TLength> | undefined;
        "offset-path"?: Property.OffsetPath | undefined;
        "offset-rotate"?: Property.OffsetRotate | undefined;
        "offset-rotation"?: Property.OffsetRotate | undefined;
        opacity?: Property.Opacity | undefined;
        order?: Property.Order | undefined;
        orphans?: Property.Orphans | undefined;
        "outline-color"?: Property.OutlineColor | undefined;
        "outline-offset"?: Property.OutlineOffset<TLength> | undefined;
        "outline-style"?: Property.OutlineStyle | undefined;
        "outline-width"?: Property.OutlineWidth<TLength> | undefined;
        "overflow-anchor"?: Property.OverflowAnchor | undefined;
        "overflow-block"?: Property.OverflowBlock | undefined;
        "overflow-clip-box"?: Property.OverflowClipBox | undefined;
        "overflow-clip-margin"?: Property.OverflowClipMargin<TLength> | undefined;
        "overflow-inline"?: Property.OverflowInline | undefined;
        "overflow-wrap"?: Property.OverflowWrap | undefined;
        "overflow-x"?: Property.OverflowX | undefined;
        "overflow-y"?: Property.OverflowY | undefined;
        "overscroll-behavior-block"?: Property.OverscrollBehaviorBlock | undefined;
        "overscroll-behavior-inline"?: Property.OverscrollBehaviorInline | undefined;
        "overscroll-behavior-x"?: Property.OverscrollBehaviorX | undefined;
        "overscroll-behavior-y"?: Property.OverscrollBehaviorY | undefined;
        "padding-block"?: Property.PaddingBlock<TLength> | undefined;
        "padding-block-end"?: Property.PaddingBlockEnd<TLength> | undefined;
        "padding-block-start"?: Property.PaddingBlockStart<TLength> | undefined;
        "padding-bottom"?: Property.PaddingBottom<TLength> | undefined;
        "padding-inline"?: Property.PaddingInline<TLength> | undefined;
        "padding-inline-end"?: Property.PaddingInlineEnd<TLength> | undefined;
        "padding-inline-start"?: Property.PaddingInlineStart<TLength> | undefined;
        "padding-left"?: Property.PaddingLeft<TLength> | undefined;
        "padding-right"?: Property.PaddingRight<TLength> | undefined;
        "padding-top"?: Property.PaddingTop<TLength> | undefined;
        "page-break-after"?: Property.PageBreakAfter | undefined;
        "page-break-before"?: Property.PageBreakBefore | undefined;
        "page-break-inside"?: Property.PageBreakInside | undefined;
        "paint-order"?: Property.PaintOrder | undefined;
        perspective?: Property.Perspective<TLength> | undefined;
        "perspective-origin"?: Property.PerspectiveOrigin<TLength> | undefined;
        "place-content"?: Property.PlaceContent | undefined;
        "pointer-events"?: Property.PointerEvents | undefined;
        position?: Property.Position | undefined;
        quotes?: Property.Quotes | undefined;
        resize?: Property.Resize | undefined;
        right?: Property.Right<TLength> | undefined;
        rotate?: Property.Rotate | undefined;
        "row-gap"?: Property.RowGap<TLength> | undefined;
        "ruby-align"?: Property.RubyAlign | undefined;
        "ruby-merge"?: Property.RubyMerge | undefined;
        "ruby-position"?: Property.RubyPosition | undefined;
        scale?: Property.Scale | undefined;
        "scroll-behavior"?: Property.ScrollBehavior | undefined;
        "scroll-margin"?: Property.ScrollMargin<TLength> | undefined;
        "scroll-margin-block"?: Property.ScrollMarginBlock<TLength> | undefined;
        "scroll-margin-block-end"?: Property.ScrollMarginBlockEnd<TLength> | undefined;
        "scroll-margin-block-start"?: Property.ScrollMarginBlockStart<TLength> | undefined;
        "scroll-margin-bottom"?: Property.ScrollMarginBottom<TLength> | undefined;
        "scroll-margin-inline"?: Property.ScrollMarginInline<TLength> | undefined;
        "scroll-margin-inline-end"?: Property.ScrollMarginInlineEnd<TLength> | undefined;
        "scroll-margin-inline-start"?: Property.ScrollMarginInlineStart<TLength> | undefined;
        "scroll-margin-left"?: Property.ScrollMarginLeft<TLength> | undefined;
        "scroll-margin-right"?: Property.ScrollMarginRight<TLength> | undefined;
        "scroll-margin-top"?: Property.ScrollMarginTop<TLength> | undefined;
        "scroll-padding"?: Property.ScrollPadding<TLength> | undefined;
        "scroll-padding-block"?: Property.ScrollPaddingBlock<TLength> | undefined;
        "scroll-padding-block-end"?: Property.ScrollPaddingBlockEnd<TLength> | undefined;
        "scroll-padding-block-start"?: Property.ScrollPaddingBlockStart<TLength> | undefined;
        "scroll-padding-bottom"?: Property.ScrollPaddingBottom<TLength> | undefined;
        "scroll-padding-inline"?: Property.ScrollPaddingInline<TLength> | undefined;
        "scroll-padding-inline-end"?: Property.ScrollPaddingInlineEnd<TLength> | undefined;
        "scroll-padding-inline-start"?: Property.ScrollPaddingInlineStart<TLength> | undefined;
        "scroll-padding-left"?: Property.ScrollPaddingLeft<TLength> | undefined;
        "scroll-padding-right"?: Property.ScrollPaddingRight<TLength> | undefined;
        "scroll-padding-top"?: Property.ScrollPaddingTop<TLength> | undefined;
        "scroll-snap-align"?: Property.ScrollSnapAlign | undefined;
        "scroll-snap-margin"?: Property.ScrollMargin<TLength> | undefined;
        "scroll-snap-margin-bottom"?: Property.ScrollMarginBottom<TLength> | undefined;
        "scroll-snap-margin-left"?: Property.ScrollMarginLeft<TLength> | undefined;
        "scroll-snap-margin-right"?: Property.ScrollMarginRight<TLength> | undefined;
        "scroll-snap-margin-top"?: Property.ScrollMarginTop<TLength> | undefined;
        "scroll-snap-stop"?: Property.ScrollSnapStop | undefined;
        "scroll-snap-type"?: Property.ScrollSnapType | undefined;
        "scrollbar-color"?: Property.ScrollbarColor | undefined;
        "scrollbar-gutter"?: Property.ScrollbarGutter | undefined;
        "scrollbar-width"?: Property.ScrollbarWidth | undefined;
        "shape-image-threshold"?: Property.ShapeImageThreshold | undefined;
        "shape-margin"?: Property.ShapeMargin<TLength> | undefined;
        "shape-outside"?: Property.ShapeOutside | undefined;
        "tab-size"?: Property.TabSize<TLength> | undefined;
        "table-layout"?: Property.TableLayout | undefined;
        "text-align"?: Property.TextAlign | undefined;
        "text-align-last"?: Property.TextAlignLast | undefined;
        "text-combine-upright"?: Property.TextCombineUpright | undefined;
        "text-decoration-color"?: Property.TextDecorationColor | undefined;
        "text-decoration-line"?: Property.TextDecorationLine | undefined;
        "text-decoration-skip"?: Property.TextDecorationSkip | undefined;
        "text-decoration-skip-ink"?: Property.TextDecorationSkipInk | undefined;
        "text-decoration-style"?: Property.TextDecorationStyle | undefined;
        "text-decoration-thickness"?: Property.TextDecorationThickness<TLength> | undefined;
        "text-decoration-width"?: Property.TextDecorationThickness<TLength> | undefined;
        "text-emphasis-color"?: Property.TextEmphasisColor | undefined;
        "text-emphasis-position"?: Property.TextEmphasisPosition | undefined;
        "text-emphasis-style"?: Property.TextEmphasisStyle | undefined;
        "text-indent"?: Property.TextIndent<TLength> | undefined;
        "text-justify"?: Property.TextJustify | undefined;
        "text-orientation"?: Property.TextOrientation | undefined;
        "text-overflow"?: Property.TextOverflow | undefined;
        "text-rendering"?: Property.TextRendering | undefined;
        "text-shadow"?: Property.TextShadow | undefined;
        "text-size-adjust"?: Property.TextSizeAdjust | undefined;
        "text-transform"?: Property.TextTransform | undefined;
        "text-underline-offset"?: Property.TextUnderlineOffset<TLength> | undefined;
        "text-underline-position"?: Property.TextUnderlinePosition | undefined;
        top?: Property.Top<TLength> | undefined;
        "touch-action"?: Property.TouchAction | undefined;
        transform?: Property.Transform | undefined;
        "transform-box"?: Property.TransformBox | undefined;
        "transform-origin"?: Property.TransformOrigin<TLength> | undefined;
        "transform-style"?: Property.TransformStyle | undefined;
        "transition-delay"?: Property.TransitionDelay<TTime> | undefined;
        "transition-duration"?: Property.TransitionDuration<TTime> | undefined;
        "transition-property"?: Property.TransitionProperty | undefined;
        "transition-timing-function"?: Property.TransitionTimingFunction | undefined;
        translate?: Property.Translate<TLength> | undefined;
        "unicode-bidi"?: Property.UnicodeBidi | undefined;
        "user-select"?: Property.UserSelect | undefined;
        "vertical-align"?: Property.VerticalAlign<TLength> | undefined;
        visibility?: Property.Visibility | undefined;
        "white-space"?: Property.WhiteSpace | undefined;
        widows?: Property.Widows | undefined;
        width?: Property.Width<TLength> | undefined;
        "will-change"?: Property.WillChange | undefined;
        "word-break"?: Property.WordBreak | undefined;
        "word-spacing"?: Property.WordSpacing<TLength> | undefined;
        "word-wrap"?: Property.WordWrap | undefined;
        "writing-mode"?: Property.WritingMode | undefined;
        "z-index"?: Property.ZIndex | undefined;
        zoom?: Property.Zoom | undefined;
    }
    export interface StandardShorthandPropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
        all?: Property.All | undefined;
        animation?: Property.Animation<TTime> | undefined;
        background?: Property.Background<TLength> | undefined;
        "background-position"?: Property.BackgroundPosition<TLength> | undefined;
        border?: Property.Border<TLength> | undefined;
        "border-block"?: Property.BorderBlock<TLength> | undefined;
        "border-block-end"?: Property.BorderBlockEnd<TLength> | undefined;
        "border-block-start"?: Property.BorderBlockStart<TLength> | undefined;
        "border-bottom"?: Property.BorderBottom<TLength> | undefined;
        "border-color"?: Property.BorderColor | undefined;
        "border-image"?: Property.BorderImage | undefined;
        "border-inline"?: Property.BorderInline<TLength> | undefined;
        "border-inline-end"?: Property.BorderInlineEnd<TLength> | undefined;
        "border-inline-start"?: Property.BorderInlineStart<TLength> | undefined;
        "border-left"?: Property.BorderLeft<TLength> | undefined;
        "border-radius"?: Property.BorderRadius<TLength> | undefined;
        "border-right"?: Property.BorderRight<TLength> | undefined;
        "border-style"?: Property.BorderStyle | undefined;
        "border-top"?: Property.BorderTop<TLength> | undefined;
        "border-width"?: Property.BorderWidth<TLength> | undefined;
        "column-rule"?: Property.ColumnRule<TLength> | undefined;
        columns?: Property.Columns<TLength> | undefined;
        flex?: Property.Flex<TLength> | undefined;
        "flex-flow"?: Property.FlexFlow | undefined;
        font?: Property.Font | undefined;
        gap?: Property.Gap<TLength> | undefined;
        grid?: Property.Grid | undefined;
        "grid-area"?: Property.GridArea | undefined;
        "grid-column"?: Property.GridColumn | undefined;
        "grid-row"?: Property.GridRow | undefined;
        "grid-template"?: Property.GridTemplate | undefined;
        "line-clamp"?: Property.LineClamp | undefined;
        "list-style"?: Property.ListStyle | undefined;
        margin?: Property.Margin<TLength> | undefined;
        mask?: Property.Mask<TLength> | undefined;
        "mask-border"?: Property.MaskBorder | undefined;
        motion?: Property.Offset<TLength> | undefined;
        offset?: Property.Offset<TLength> | undefined;
        outline?: Property.Outline<TLength> | undefined;
        overflow?: Property.Overflow | undefined;
        "overscroll-behavior"?: Property.OverscrollBehavior | undefined;
        padding?: Property.Padding<TLength> | undefined;
        "place-items"?: Property.PlaceItems | undefined;
        "place-self"?: Property.PlaceSelf | undefined;
        "text-decoration"?: Property.TextDecoration<TLength> | undefined;
        "text-emphasis"?: Property.TextEmphasis | undefined;
        transition?: Property.Transition<TTime> | undefined;
    }
    export interface StandardPropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> extends StandardLonghandPropertiesHyphen<TLength, TTime>, StandardShorthandPropertiesHyphen<TLength, TTime> {
    }
    export interface VendorLonghandPropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
        "-moz-animation-delay"?: Property.AnimationDelay<TTime> | undefined;
        "-moz-animation-direction"?: Property.AnimationDirection | undefined;
        "-moz-animation-duration"?: Property.AnimationDuration<TTime> | undefined;
        "-moz-animation-fill-mode"?: Property.AnimationFillMode | undefined;
        "-moz-animation-iteration-count"?: Property.AnimationIterationCount | undefined;
        "-moz-animation-name"?: Property.AnimationName | undefined;
        "-moz-animation-play-state"?: Property.AnimationPlayState | undefined;
        "-moz-animation-timing-function"?: Property.AnimationTimingFunction | undefined;
        "-moz-appearance"?: Property.MozAppearance | undefined;
        "-moz-backface-visibility"?: Property.BackfaceVisibility | undefined;
        "-moz-border-bottom-colors"?: Property.MozBorderBottomColors | undefined;
        "-moz-border-end-color"?: Property.BorderInlineEndColor | undefined;
        "-moz-border-end-style"?: Property.BorderInlineEndStyle | undefined;
        "-moz-border-end-width"?: Property.BorderInlineEndWidth<TLength> | undefined;
        "-moz-border-left-colors"?: Property.MozBorderLeftColors | undefined;
        "-moz-border-right-colors"?: Property.MozBorderRightColors | undefined;
        "-moz-border-start-color"?: Property.BorderInlineStartColor | undefined;
        "-moz-border-start-style"?: Property.BorderInlineStartStyle | undefined;
        "-moz-border-top-colors"?: Property.MozBorderTopColors | undefined;
        "-moz-box-sizing"?: Property.BoxSizing | undefined;
        "-moz-column-count"?: Property.ColumnCount | undefined;
        "-moz-column-fill"?: Property.ColumnFill | undefined;
        "-moz-column-gap"?: Property.ColumnGap<TLength> | undefined;
        "-moz-column-rule-color"?: Property.ColumnRuleColor | undefined;
        "-moz-column-rule-style"?: Property.ColumnRuleStyle | undefined;
        "-moz-column-rule-width"?: Property.ColumnRuleWidth<TLength> | undefined;
        "-moz-column-width"?: Property.ColumnWidth<TLength> | undefined;
        "-moz-context-properties"?: Property.MozContextProperties | undefined;
        "-moz-font-feature-settings"?: Property.FontFeatureSettings | undefined;
        "-moz-font-language-override"?: Property.FontLanguageOverride | undefined;
        "-moz-hyphens"?: Property.Hyphens | undefined;
        "-moz-image-region"?: Property.MozImageRegion | undefined;
        "-moz-margin-end"?: Property.MarginInlineEnd<TLength> | undefined;
        "-moz-margin-start"?: Property.MarginInlineStart<TLength> | undefined;
        "-moz-orient"?: Property.MozOrient | undefined;
        "-moz-osx-font-smoothing"?: Property.FontSmooth<TLength> | undefined;
        "-moz-padding-end"?: Property.PaddingInlineEnd<TLength> | undefined;
        "-moz-padding-start"?: Property.PaddingInlineStart<TLength> | undefined;
        "-moz-perspective"?: Property.Perspective<TLength> | undefined;
        "-moz-perspective-origin"?: Property.PerspectiveOrigin<TLength> | undefined;
        "-moz-stack-sizing"?: Property.MozStackSizing | undefined;
        "-moz-tab-size"?: Property.TabSize<TLength> | undefined;
        "-moz-text-blink"?: Property.MozTextBlink | undefined;
        "-moz-text-size-adjust"?: Property.TextSizeAdjust | undefined;
        "-moz-transform-origin"?: Property.TransformOrigin<TLength> | undefined;
        "-moz-transform-style"?: Property.TransformStyle | undefined;
        "-moz-transition-delay"?: Property.TransitionDelay<TTime> | undefined;
        "-moz-transition-duration"?: Property.TransitionDuration<TTime> | undefined;
        "-moz-transition-property"?: Property.TransitionProperty | undefined;
        "-moz-transition-timing-function"?: Property.TransitionTimingFunction | undefined;
        "-moz-user-focus"?: Property.MozUserFocus | undefined;
        "-moz-user-modify"?: Property.MozUserModify | undefined;
        "-moz-user-select"?: Property.UserSelect | undefined;
        "-moz-window-dragging"?: Property.MozWindowDragging | undefined;
        "-moz-window-shadow"?: Property.MozWindowShadow | undefined;
        "-ms-accelerator"?: Property.MsAccelerator | undefined;
        "-ms-align-self"?: Property.AlignSelf | undefined;
        "-ms-block-progression"?: Property.MsBlockProgression | undefined;
        "-ms-content-zoom-chaining"?: Property.MsContentZoomChaining | undefined;
        "-ms-content-zoom-limit-max"?: Property.MsContentZoomLimitMax | undefined;
        "-ms-content-zoom-limit-min"?: Property.MsContentZoomLimitMin | undefined;
        "-ms-content-zoom-snap-points"?: Property.MsContentZoomSnapPoints | undefined;
        "-ms-content-zoom-snap-type"?: Property.MsContentZoomSnapType | undefined;
        "-ms-content-zooming"?: Property.MsContentZooming | undefined;
        "-ms-filter"?: Property.MsFilter | undefined;
        "-ms-flex-direction"?: Property.FlexDirection | undefined;
        "-ms-flex-positive"?: Property.FlexGrow | undefined;
        "-ms-flow-from"?: Property.MsFlowFrom | undefined;
        "-ms-flow-into"?: Property.MsFlowInto | undefined;
        "-ms-grid-columns"?: Property.MsGridColumns<TLength> | undefined;
        "-ms-grid-rows"?: Property.MsGridRows<TLength> | undefined;
        "-ms-high-contrast-adjust"?: Property.MsHighContrastAdjust | undefined;
        "-ms-hyphenate-limit-chars"?: Property.MsHyphenateLimitChars | undefined;
        "-ms-hyphenate-limit-lines"?: Property.MsHyphenateLimitLines | undefined;
        "-ms-hyphenate-limit-zone"?: Property.MsHyphenateLimitZone<TLength> | undefined;
        "-ms-hyphens"?: Property.Hyphens | undefined;
        "-ms-ime-align"?: Property.MsImeAlign | undefined;
        "-ms-justify-self"?: Property.JustifySelf | undefined;
        "-ms-line-break"?: Property.LineBreak | undefined;
        "-ms-order"?: Property.Order | undefined;
        "-ms-overflow-style"?: Property.MsOverflowStyle | undefined;
        "-ms-overflow-x"?: Property.OverflowX | undefined;
        "-ms-overflow-y"?: Property.OverflowY | undefined;
        "-ms-scroll-chaining"?: Property.MsScrollChaining | undefined;
        "-ms-scroll-limit-x-max"?: Property.MsScrollLimitXMax<TLength> | undefined;
        "-ms-scroll-limit-x-min"?: Property.MsScrollLimitXMin<TLength> | undefined;
        "-ms-scroll-limit-y-max"?: Property.MsScrollLimitYMax<TLength> | undefined;
        "-ms-scroll-limit-y-min"?: Property.MsScrollLimitYMin<TLength> | undefined;
        "-ms-scroll-rails"?: Property.MsScrollRails | undefined;
        "-ms-scroll-snap-points-x"?: Property.MsScrollSnapPointsX | undefined;
        "-ms-scroll-snap-points-y"?: Property.MsScrollSnapPointsY | undefined;
        "-ms-scroll-snap-type"?: Property.MsScrollSnapType | undefined;
        "-ms-scroll-translation"?: Property.MsScrollTranslation | undefined;
        "-ms-scrollbar-3dlight-color"?: Property.MsScrollbar3dlightColor | undefined;
        "-ms-scrollbar-arrow-color"?: Property.MsScrollbarArrowColor | undefined;
        "-ms-scrollbar-base-color"?: Property.MsScrollbarBaseColor | undefined;
        "-ms-scrollbar-darkshadow-color"?: Property.MsScrollbarDarkshadowColor | undefined;
        "-ms-scrollbar-face-color"?: Property.MsScrollbarFaceColor | undefined;
        "-ms-scrollbar-highlight-color"?: Property.MsScrollbarHighlightColor | undefined;
        "-ms-scrollbar-shadow-color"?: Property.MsScrollbarShadowColor | undefined;
        "-ms-text-autospace"?: Property.MsTextAutospace | undefined;
        "-ms-text-combine-horizontal"?: Property.TextCombineUpright | undefined;
        "-ms-text-overflow"?: Property.TextOverflow | undefined;
        "-ms-touch-action"?: Property.TouchAction | undefined;
        "-ms-touch-select"?: Property.MsTouchSelect | undefined;
        "-ms-transform"?: Property.Transform | undefined;
        "-ms-transform-origin"?: Property.TransformOrigin<TLength> | undefined;
        "-ms-transition-delay"?: Property.TransitionDelay<TTime> | undefined;
        "-ms-transition-duration"?: Property.TransitionDuration<TTime> | undefined;
        "-ms-transition-property"?: Property.TransitionProperty | undefined;
        "-ms-transition-timing-function"?: Property.TransitionTimingFunction | undefined;
        "-ms-user-select"?: Property.MsUserSelect | undefined;
        "-ms-word-break"?: Property.WordBreak | undefined;
        "-ms-wrap-flow"?: Property.MsWrapFlow | undefined;
        "-ms-wrap-margin"?: Property.MsWrapMargin<TLength> | undefined;
        "-ms-wrap-through"?: Property.MsWrapThrough | undefined;
        "-ms-writing-mode"?: Property.WritingMode | undefined;
        "-webkit-align-content"?: Property.AlignContent | undefined;
        "-webkit-align-items"?: Property.AlignItems | undefined;
        "-webkit-align-self"?: Property.AlignSelf | undefined;
        "-webkit-animation-delay"?: Property.AnimationDelay<TTime> | undefined;
        "-webkit-animation-direction"?: Property.AnimationDirection | undefined;
        "-webkit-animation-duration"?: Property.AnimationDuration<TTime> | undefined;
        "-webkit-animation-fill-mode"?: Property.AnimationFillMode | undefined;
        "-webkit-animation-iteration-count"?: Property.AnimationIterationCount | undefined;
        "-webkit-animation-name"?: Property.AnimationName | undefined;
        "-webkit-animation-play-state"?: Property.AnimationPlayState | undefined;
        "-webkit-animation-timing-function"?: Property.AnimationTimingFunction | undefined;
        "-webkit-appearance"?: Property.WebkitAppearance | undefined;
        "-webkit-backdrop-filter"?: Property.BackdropFilter | undefined;
        "-webkit-backface-visibility"?: Property.BackfaceVisibility | undefined;
        "-webkit-background-clip"?: Property.BackgroundClip | undefined;
        "-webkit-background-origin"?: Property.BackgroundOrigin | undefined;
        "-webkit-background-size"?: Property.BackgroundSize<TLength> | undefined;
        "-webkit-border-before-color"?: Property.WebkitBorderBeforeColor | undefined;
        "-webkit-border-before-style"?: Property.WebkitBorderBeforeStyle | undefined;
        "-webkit-border-before-width"?: Property.WebkitBorderBeforeWidth<TLength> | undefined;
        "-webkit-border-bottom-left-radius"?: Property.BorderBottomLeftRadius<TLength> | undefined;
        "-webkit-border-bottom-right-radius"?: Property.BorderBottomRightRadius<TLength> | undefined;
        "-webkit-border-image-slice"?: Property.BorderImageSlice | undefined;
        "-webkit-border-top-left-radius"?: Property.BorderTopLeftRadius<TLength> | undefined;
        "-webkit-border-top-right-radius"?: Property.BorderTopRightRadius<TLength> | undefined;
        "-webkit-box-decoration-break"?: Property.BoxDecorationBreak | undefined;
        "-webkit-box-reflect"?: Property.WebkitBoxReflect<TLength> | undefined;
        "-webkit-box-shadow"?: Property.BoxShadow | undefined;
        "-webkit-box-sizing"?: Property.BoxSizing | undefined;
        "-webkit-clip-path"?: Property.ClipPath | undefined;
        "-webkit-column-count"?: Property.ColumnCount | undefined;
        "-webkit-column-fill"?: Property.ColumnFill | undefined;
        "-webkit-column-gap"?: Property.ColumnGap<TLength> | undefined;
        "-webkit-column-rule-color"?: Property.ColumnRuleColor | undefined;
        "-webkit-column-rule-style"?: Property.ColumnRuleStyle | undefined;
        "-webkit-column-rule-width"?: Property.ColumnRuleWidth<TLength> | undefined;
        "-webkit-column-span"?: Property.ColumnSpan | undefined;
        "-webkit-column-width"?: Property.ColumnWidth<TLength> | undefined;
        "-webkit-filter"?: Property.Filter | undefined;
        "-webkit-flex-basis"?: Property.FlexBasis<TLength> | undefined;
        "-webkit-flex-direction"?: Property.FlexDirection | undefined;
        "-webkit-flex-grow"?: Property.FlexGrow | undefined;
        "-webkit-flex-shrink"?: Property.FlexShrink | undefined;
        "-webkit-flex-wrap"?: Property.FlexWrap | undefined;
        "-webkit-font-feature-settings"?: Property.FontFeatureSettings | undefined;
        "-webkit-font-kerning"?: Property.FontKerning | undefined;
        "-webkit-font-smoothing"?: Property.FontSmooth<TLength> | undefined;
        "-webkit-font-variant-ligatures"?: Property.FontVariantLigatures | undefined;
        "-webkit-hyphens"?: Property.Hyphens | undefined;
        "-webkit-initial-letter"?: Property.InitialLetter | undefined;
        "-webkit-justify-content"?: Property.JustifyContent | undefined;
        "-webkit-line-break"?: Property.LineBreak | undefined;
        "-webkit-line-clamp"?: Property.WebkitLineClamp | undefined;
        "-webkit-margin-end"?: Property.MarginInlineEnd<TLength> | undefined;
        "-webkit-margin-start"?: Property.MarginInlineStart<TLength> | undefined;
        "-webkit-mask-attachment"?: Property.WebkitMaskAttachment | undefined;
        "-webkit-mask-box-image-outset"?: Property.MaskBorderOutset<TLength> | undefined;
        "-webkit-mask-box-image-repeat"?: Property.MaskBorderRepeat | undefined;
        "-webkit-mask-box-image-slice"?: Property.MaskBorderSlice | undefined;
        "-webkit-mask-box-image-source"?: Property.MaskBorderSource | undefined;
        "-webkit-mask-box-image-width"?: Property.MaskBorderWidth<TLength> | undefined;
        "-webkit-mask-clip"?: Property.WebkitMaskClip | undefined;
        "-webkit-mask-composite"?: Property.WebkitMaskComposite | undefined;
        "-webkit-mask-image"?: Property.WebkitMaskImage | undefined;
        "-webkit-mask-origin"?: Property.WebkitMaskOrigin | undefined;
        "-webkit-mask-position"?: Property.WebkitMaskPosition<TLength> | undefined;
        "-webkit-mask-position-x"?: Property.WebkitMaskPositionX<TLength> | undefined;
        "-webkit-mask-position-y"?: Property.WebkitMaskPositionY<TLength> | undefined;
        "-webkit-mask-repeat"?: Property.WebkitMaskRepeat | undefined;
        "-webkit-mask-repeat-x"?: Property.WebkitMaskRepeatX | undefined;
        "-webkit-mask-repeat-y"?: Property.WebkitMaskRepeatY | undefined;
        "-webkit-mask-size"?: Property.WebkitMaskSize<TLength> | undefined;
        "-webkit-max-inline-size"?: Property.MaxInlineSize<TLength> | undefined;
        "-webkit-order"?: Property.Order | undefined;
        "-webkit-overflow-scrolling"?: Property.WebkitOverflowScrolling | undefined;
        "-webkit-padding-end"?: Property.PaddingInlineEnd<TLength> | undefined;
        "-webkit-padding-start"?: Property.PaddingInlineStart<TLength> | undefined;
        "-webkit-perspective"?: Property.Perspective<TLength> | undefined;
        "-webkit-perspective-origin"?: Property.PerspectiveOrigin<TLength> | undefined;
        "-webkit-print-color-adjust"?: Property.ColorAdjust | undefined;
        "-webkit-ruby-position"?: Property.RubyPosition | undefined;
        "-webkit-scroll-snap-type"?: Property.ScrollSnapType | undefined;
        "-webkit-shape-margin"?: Property.ShapeMargin<TLength> | undefined;
        "-webkit-tap-highlight-color"?: Property.WebkitTapHighlightColor | undefined;
        "-webkit-text-combine"?: Property.TextCombineUpright | undefined;
        "-webkit-text-decoration-color"?: Property.TextDecorationColor | undefined;
        "-webkit-text-decoration-line"?: Property.TextDecorationLine | undefined;
        "-webkit-text-decoration-skip"?: Property.TextDecorationSkip | undefined;
        "-webkit-text-decoration-style"?: Property.TextDecorationStyle | undefined;
        "-webkit-text-emphasis-color"?: Property.TextEmphasisColor | undefined;
        "-webkit-text-emphasis-position"?: Property.TextEmphasisPosition | undefined;
        "-webkit-text-emphasis-style"?: Property.TextEmphasisStyle | undefined;
        "-webkit-text-fill-color"?: Property.WebkitTextFillColor | undefined;
        "-webkit-text-orientation"?: Property.TextOrientation | undefined;
        "-webkit-text-size-adjust"?: Property.TextSizeAdjust | undefined;
        "-webkit-text-stroke-color"?: Property.WebkitTextStrokeColor | undefined;
        "-webkit-text-stroke-width"?: Property.WebkitTextStrokeWidth<TLength> | undefined;
        "-webkit-text-underline-position"?: Property.TextUnderlinePosition | undefined;
        "-webkit-touch-callout"?: Property.WebkitTouchCallout | undefined;
        "-webkit-transform"?: Property.Transform | undefined;
        "-webkit-transform-origin"?: Property.TransformOrigin<TLength> | undefined;
        "-webkit-transform-style"?: Property.TransformStyle | undefined;
        "-webkit-transition-delay"?: Property.TransitionDelay<TTime> | undefined;
        "-webkit-transition-duration"?: Property.TransitionDuration<TTime> | undefined;
        "-webkit-transition-property"?: Property.TransitionProperty | undefined;
        "-webkit-transition-timing-function"?: Property.TransitionTimingFunction | undefined;
        "-webkit-user-modify"?: Property.WebkitUserModify | undefined;
        "-webkit-user-select"?: Property.UserSelect | undefined;
        "-webkit-writing-mode"?: Property.WritingMode | undefined;
    }
    export interface VendorShorthandPropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
        "-moz-animation"?: Property.Animation<TTime> | undefined;
        "-moz-border-image"?: Property.BorderImage | undefined;
        "-moz-column-rule"?: Property.ColumnRule<TLength> | undefined;
        "-moz-columns"?: Property.Columns<TLength> | undefined;
        "-moz-transition"?: Property.Transition<TTime> | undefined;
        "-ms-content-zoom-limit"?: Property.MsContentZoomLimit | undefined;
        "-ms-content-zoom-snap"?: Property.MsContentZoomSnap | undefined;
        "-ms-flex"?: Property.Flex<TLength> | undefined;
        "-ms-scroll-limit"?: Property.MsScrollLimit | undefined;
        "-ms-scroll-snap-x"?: Property.MsScrollSnapX | undefined;
        "-ms-scroll-snap-y"?: Property.MsScrollSnapY | undefined;
        "-ms-transition"?: Property.Transition<TTime> | undefined;
        "-webkit-animation"?: Property.Animation<TTime> | undefined;
        "-webkit-border-before"?: Property.WebkitBorderBefore<TLength> | undefined;
        "-webkit-border-image"?: Property.BorderImage | undefined;
        "-webkit-border-radius"?: Property.BorderRadius<TLength> | undefined;
        "-webkit-column-rule"?: Property.ColumnRule<TLength> | undefined;
        "-webkit-columns"?: Property.Columns<TLength> | undefined;
        "-webkit-flex"?: Property.Flex<TLength> | undefined;
        "-webkit-flex-flow"?: Property.FlexFlow | undefined;
        "-webkit-mask"?: Property.WebkitMask<TLength> | undefined;
        "-webkit-mask-box-image"?: Property.MaskBorder | undefined;
        "-webkit-text-emphasis"?: Property.TextEmphasis | undefined;
        "-webkit-text-stroke"?: Property.WebkitTextStroke<TLength> | undefined;
        "-webkit-transition"?: Property.Transition<TTime> | undefined;
    }
    export interface VendorPropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> extends VendorLonghandPropertiesHyphen<TLength, TTime>, VendorShorthandPropertiesHyphen<TLength, TTime> {
    }
    export interface ObsoletePropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
        azimuth?: Property.Azimuth | undefined;
        "box-align"?: Property.BoxAlign | undefined;
        "box-direction"?: Property.BoxDirection | undefined;
        "box-flex"?: Property.BoxFlex | undefined;
        "box-flex-group"?: Property.BoxFlexGroup | undefined;
        "box-lines"?: Property.BoxLines | undefined;
        "box-ordinal-group"?: Property.BoxOrdinalGroup | undefined;
        "box-orient"?: Property.BoxOrient | undefined;
        "box-pack"?: Property.BoxPack | undefined;
        clip?: Property.Clip | undefined;
        "font-variant-alternates"?: Property.FontVariantAlternates | undefined;
        "grid-column-gap"?: Property.GridColumnGap<TLength> | undefined;
        "grid-gap"?: Property.GridGap<TLength> | undefined;
        "grid-row-gap"?: Property.GridRowGap<TLength> | undefined;
        "ime-mode"?: Property.ImeMode | undefined;
        "offset-block"?: Property.InsetBlock<TLength> | undefined;
        "offset-block-end"?: Property.InsetBlockEnd<TLength> | undefined;
        "offset-block-start"?: Property.InsetBlockStart<TLength> | undefined;
        "offset-inline"?: Property.InsetInline<TLength> | undefined;
        "offset-inline-end"?: Property.InsetInlineEnd<TLength> | undefined;
        "offset-inline-start"?: Property.InsetInlineStart<TLength> | undefined;
        "scroll-snap-coordinate"?: Property.ScrollSnapCoordinate<TLength> | undefined;
        "scroll-snap-destination"?: Property.ScrollSnapDestination<TLength> | undefined;
        "scroll-snap-points-x"?: Property.ScrollSnapPointsX | undefined;
        "scroll-snap-points-y"?: Property.ScrollSnapPointsY | undefined;
        "scroll-snap-type-x"?: Property.ScrollSnapTypeX | undefined;
        "scroll-snap-type-y"?: Property.ScrollSnapTypeY | undefined;
        "scrollbar-track-color"?: Property.MsScrollbarTrackColor | undefined;
        "-khtml-box-align"?: Property.BoxAlign | undefined;
        "-khtml-box-direction"?: Property.BoxDirection | undefined;
        "-khtml-box-flex"?: Property.BoxFlex | undefined;
        "-khtml-box-flex-group"?: Property.BoxFlexGroup | undefined;
        "-khtml-box-lines"?: Property.BoxLines | undefined;
        "-khtml-box-ordinal-group"?: Property.BoxOrdinalGroup | undefined;
        "-khtml-box-orient"?: Property.BoxOrient | undefined;
        "-khtml-box-pack"?: Property.BoxPack | undefined;
        "-khtml-line-break"?: Property.LineBreak | undefined;
        "-khtml-opacity"?: Property.Opacity | undefined;
        "-khtml-user-select"?: Property.UserSelect | undefined;
        "-moz-background-clip"?: Property.BackgroundClip | undefined;
        "-moz-background-inline-policy"?: Property.BoxDecorationBreak | undefined;
        "-moz-background-origin"?: Property.BackgroundOrigin | undefined;
        "-moz-background-size"?: Property.BackgroundSize<TLength> | undefined;
        "-moz-binding"?: Property.MozBinding | undefined;
        "-moz-border-radius"?: Property.BorderRadius<TLength> | undefined;
        "-moz-border-radius-bottomleft"?: Property.BorderBottomLeftRadius<TLength> | undefined;
        "-moz-border-radius-bottomright"?: Property.BorderBottomRightRadius<TLength> | undefined;
        "-moz-border-radius-topleft"?: Property.BorderTopLeftRadius<TLength> | undefined;
        "-moz-border-radius-topright"?: Property.BorderTopRightRadius<TLength> | undefined;
        "-moz-box-align"?: Property.BoxAlign | undefined;
        "-moz-box-direction"?: Property.BoxDirection | undefined;
        "-moz-box-flex"?: Property.BoxFlex | undefined;
        "-moz-box-ordinal-group"?: Property.BoxOrdinalGroup | undefined;
        "-moz-box-orient"?: Property.BoxOrient | undefined;
        "-moz-box-pack"?: Property.BoxPack | undefined;
        "-moz-box-shadow"?: Property.BoxShadow | undefined;
        "-moz-float-edge"?: Property.MozFloatEdge | undefined;
        "-moz-force-broken-image-icon"?: Property.MozForceBrokenImageIcon | undefined;
        "-moz-opacity"?: Property.Opacity | undefined;
        "-moz-outline"?: Property.Outline<TLength> | undefined;
        "-moz-outline-color"?: Property.OutlineColor | undefined;
        "-moz-outline-radius"?: Property.MozOutlineRadius<TLength> | undefined;
        "-moz-outline-radius-bottomleft"?: Property.MozOutlineRadiusBottomleft<TLength> | undefined;
        "-moz-outline-radius-bottomright"?: Property.MozOutlineRadiusBottomright<TLength> | undefined;
        "-moz-outline-radius-topleft"?: Property.MozOutlineRadiusTopleft<TLength> | undefined;
        "-moz-outline-radius-topright"?: Property.MozOutlineRadiusTopright<TLength> | undefined;
        "-moz-outline-style"?: Property.OutlineStyle | undefined;
        "-moz-outline-width"?: Property.OutlineWidth<TLength> | undefined;
        "-moz-text-align-last"?: Property.TextAlignLast | undefined;
        "-moz-text-decoration-color"?: Property.TextDecorationColor | undefined;
        "-moz-text-decoration-line"?: Property.TextDecorationLine | undefined;
        "-moz-text-decoration-style"?: Property.TextDecorationStyle | undefined;
        "-moz-user-input"?: Property.MozUserInput | undefined;
        "-ms-ime-mode"?: Property.ImeMode | undefined;
        "-ms-scrollbar-track-color"?: Property.MsScrollbarTrackColor | undefined;
        "-o-animation"?: Property.Animation<TTime> | undefined;
        "-o-animation-delay"?: Property.AnimationDelay<TTime> | undefined;
        "-o-animation-direction"?: Property.AnimationDirection | undefined;
        "-o-animation-duration"?: Property.AnimationDuration<TTime> | undefined;
        "-o-animation-fill-mode"?: Property.AnimationFillMode | undefined;
        "-o-animation-iteration-count"?: Property.AnimationIterationCount | undefined;
        "-o-animation-name"?: Property.AnimationName | undefined;
        "-o-animation-play-state"?: Property.AnimationPlayState | undefined;
        "-o-animation-timing-function"?: Property.AnimationTimingFunction | undefined;
        "-o-background-size"?: Property.BackgroundSize<TLength> | undefined;
        "-o-border-image"?: Property.BorderImage | undefined;
        "-o-object-fit"?: Property.ObjectFit | undefined;
        "-o-object-position"?: Property.ObjectPosition<TLength> | undefined;
        "-o-tab-size"?: Property.TabSize<TLength> | undefined;
        "-o-text-overflow"?: Property.TextOverflow | undefined;
        "-o-transform"?: Property.Transform | undefined;
        "-o-transform-origin"?: Property.TransformOrigin<TLength> | undefined;
        "-o-transition"?: Property.Transition<TTime> | undefined;
        "-o-transition-delay"?: Property.TransitionDelay<TTime> | undefined;
        "-o-transition-duration"?: Property.TransitionDuration<TTime> | undefined;
        "-o-transition-property"?: Property.TransitionProperty | undefined;
        "-o-transition-timing-function"?: Property.TransitionTimingFunction | undefined;
        "-webkit-box-align"?: Property.BoxAlign | undefined;
        "-webkit-box-direction"?: Property.BoxDirection | undefined;
        "-webkit-box-flex"?: Property.BoxFlex | undefined;
        "-webkit-box-flex-group"?: Property.BoxFlexGroup | undefined;
        "-webkit-box-lines"?: Property.BoxLines | undefined;
        "-webkit-box-ordinal-group"?: Property.BoxOrdinalGroup | undefined;
        "-webkit-box-orient"?: Property.BoxOrient | undefined;
        "-webkit-box-pack"?: Property.BoxPack | undefined;
        "-webkit-scroll-snap-points-x"?: Property.ScrollSnapPointsX | undefined;
        "-webkit-scroll-snap-points-y"?: Property.ScrollSnapPointsY | undefined;
    }
    export interface SvgPropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
        "alignment-baseline"?: Property.AlignmentBaseline | undefined;
        "baseline-shift"?: Property.BaselineShift<TLength> | undefined;
        clip?: Property.Clip | undefined;
        "clip-path"?: Property.ClipPath | undefined;
        "clip-rule"?: Property.ClipRule | undefined;
        color?: Property.Color | undefined;
        "color-interpolation"?: Property.ColorInterpolation | undefined;
        "color-rendering"?: Property.ColorRendering | undefined;
        cursor?: Property.Cursor | undefined;
        direction?: Property.Direction | undefined;
        display?: Property.Display | undefined;
        "dominant-baseline"?: Property.DominantBaseline | undefined;
        fill?: Property.Fill | undefined;
        "fill-opacity"?: Property.FillOpacity | undefined;
        "fill-rule"?: Property.FillRule | undefined;
        filter?: Property.Filter | undefined;
        "flood-color"?: Property.FloodColor | undefined;
        "flood-opacity"?: Property.FloodOpacity | undefined;
        font?: Property.Font | undefined;
        "font-family"?: Property.FontFamily | undefined;
        "font-size"?: Property.FontSize<TLength> | undefined;
        "font-size-adjust"?: Property.FontSizeAdjust | undefined;
        "font-stretch"?: Property.FontStretch | undefined;
        "font-style"?: Property.FontStyle | undefined;
        "font-variant"?: Property.FontVariant | undefined;
        "font-weight"?: Property.FontWeight | undefined;
        "glyph-orientation-vertical"?: Property.GlyphOrientationVertical | undefined;
        "image-rendering"?: Property.ImageRendering | undefined;
        "letter-spacing"?: Property.LetterSpacing<TLength> | undefined;
        "lighting-color"?: Property.LightingColor | undefined;
        "line-height"?: Property.LineHeight<TLength> | undefined;
        marker?: Property.Marker | undefined;
        "marker-end"?: Property.MarkerEnd | undefined;
        "marker-mid"?: Property.MarkerMid | undefined;
        "marker-start"?: Property.MarkerStart | undefined;
        mask?: Property.Mask<TLength> | undefined;
        opacity?: Property.Opacity | undefined;
        overflow?: Property.Overflow | undefined;
        "paint-order"?: Property.PaintOrder | undefined;
        "pointer-events"?: Property.PointerEvents | undefined;
        "shape-rendering"?: Property.ShapeRendering | undefined;
        "stop-color"?: Property.StopColor | undefined;
        "stop-opacity"?: Property.StopOpacity | undefined;
        stroke?: Property.Stroke | undefined;
        "stroke-dasharray"?: Property.StrokeDasharray<TLength> | undefined;
        "stroke-dashoffset"?: Property.StrokeDashoffset<TLength> | undefined;
        "stroke-linecap"?: Property.StrokeLinecap | undefined;
        "stroke-linejoin"?: Property.StrokeLinejoin | undefined;
        "stroke-miterlimit"?: Property.StrokeMiterlimit | undefined;
        "stroke-opacity"?: Property.StrokeOpacity | undefined;
        "stroke-width"?: Property.StrokeWidth<TLength> | undefined;
        "text-anchor"?: Property.TextAnchor | undefined;
        "text-decoration"?: Property.TextDecoration<TLength> | undefined;
        "text-rendering"?: Property.TextRendering | undefined;
        "unicode-bidi"?: Property.UnicodeBidi | undefined;
        "vector-effect"?: Property.VectorEffect | undefined;
        visibility?: Property.Visibility | undefined;
        "white-space"?: Property.WhiteSpace | undefined;
        "word-spacing"?: Property.WordSpacing<TLength> | undefined;
        "writing-mode"?: Property.WritingMode | undefined;
    }
    export interface PropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> extends StandardPropertiesHyphen<TLength, TTime>, VendorPropertiesHyphen<TLength, TTime>, ObsoletePropertiesHyphen<TLength, TTime>, SvgPropertiesHyphen<TLength, TTime> {
    }
    export type StandardLonghandPropertiesFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<StandardLonghandProperties<TLength, TTime>>;
    export type StandardShorthandPropertiesFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<StandardShorthandProperties<TLength, TTime>>;
    export interface StandardPropertiesFallback<TLength = (string & {}) | 0, TTime = string & {}> extends StandardLonghandPropertiesFallback<TLength, TTime>, StandardShorthandPropertiesFallback<TLength, TTime> {
    }
    export type VendorLonghandPropertiesFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<VendorLonghandProperties<TLength, TTime>>;
    export type VendorShorthandPropertiesFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<VendorShorthandProperties<TLength, TTime>>;
    export interface VendorPropertiesFallback<TLength = (string & {}) | 0, TTime = string & {}> extends VendorLonghandPropertiesFallback<TLength, TTime>, VendorShorthandPropertiesFallback<TLength, TTime> {
    }
    export type ObsoletePropertiesFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<ObsoleteProperties<TLength, TTime>>;
    export type SvgPropertiesFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<SvgProperties<TLength, TTime>>;
    export interface PropertiesFallback<TLength = (string & {}) | 0, TTime = string & {}> extends StandardPropertiesFallback<TLength, TTime>, VendorPropertiesFallback<TLength, TTime>, ObsoletePropertiesFallback<TLength, TTime>, SvgPropertiesFallback<TLength, TTime> {
    }
    export type StandardLonghandPropertiesHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<StandardLonghandPropertiesHyphen<TLength, TTime>>;
    export type StandardShorthandPropertiesHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<StandardShorthandPropertiesHyphen<TLength, TTime>>;
    export interface StandardPropertiesHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> extends StandardLonghandPropertiesHyphenFallback<TLength, TTime>, StandardShorthandPropertiesHyphenFallback<TLength, TTime> {
    }
    export type VendorLonghandPropertiesHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<VendorLonghandPropertiesHyphen<TLength, TTime>>;
    export type VendorShorthandPropertiesHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<VendorShorthandPropertiesHyphen<TLength, TTime>>;
    export interface VendorPropertiesHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> extends VendorLonghandPropertiesHyphenFallback<TLength, TTime>, VendorShorthandPropertiesHyphenFallback<TLength, TTime> {
    }
    export type ObsoletePropertiesHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<ObsoletePropertiesHyphen<TLength, TTime>>;
    export type SvgPropertiesHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<SvgPropertiesHyphen<TLength, TTime>>;
    export interface PropertiesHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> extends StandardPropertiesHyphenFallback<TLength, TTime>, VendorPropertiesHyphenFallback<TLength, TTime>, ObsoletePropertiesHyphenFallback<TLength, TTime>, SvgPropertiesHyphenFallback<TLength, TTime> {
    }
    export type AtRules = "@charset" | "@counter-style" | "@document" | "@font-face" | "@font-feature-values" | "@import" | "@keyframes" | "@media" | "@namespace" | "@page" | "@property" | "@supports" | "@viewport";
    export type AdvancedPseudos = ":-moz-any()" | ":-moz-dir" | ":-webkit-any()" | "::cue" | "::cue-region" | "::part" | "::slotted" | ":dir" | ":has" | ":host" | ":host-context" | ":is" | ":lang" | ":matches()" | ":not" | ":nth-child" | ":nth-last-child" | ":nth-last-of-type" | ":nth-of-type" | ":where";
    export type SimplePseudos = ":-khtml-any-link" | ":-moz-any-link" | ":-moz-focusring" | ":-moz-full-screen" | ":-moz-placeholder" | ":-moz-read-only" | ":-moz-read-write" | ":-moz-ui-invalid" | ":-moz-ui-valid" | ":-ms-fullscreen" | ":-ms-input-placeholder" | ":-webkit-any-link" | ":-webkit-full-screen" | "::-moz-placeholder" | "::-moz-progress-bar" | "::-moz-range-progress" | "::-moz-range-thumb" | "::-moz-range-track" | "::-moz-selection" | "::-ms-backdrop" | "::-ms-browse" | "::-ms-check" | "::-ms-clear" | "::-ms-fill" | "::-ms-fill-lower" | "::-ms-fill-upper" | "::-ms-input-placeholder" | "::-ms-reveal" | "::-ms-thumb" | "::-ms-ticks-after" | "::-ms-ticks-before" | "::-ms-tooltip" | "::-ms-track" | "::-ms-value" | "::-webkit-backdrop" | "::-webkit-input-placeholder" | "::-webkit-progress-bar" | "::-webkit-progress-inner-value" | "::-webkit-progress-value" | "::-webkit-slider-runnable-track" | "::-webkit-slider-thumb" | "::after" | "::backdrop" | "::before" | "::cue" | "::cue-region" | "::first-letter" | "::first-line" | "::grammar-error" | "::marker" | "::placeholder" | "::selection" | "::spelling-error" | "::target-text" | ":active" | ":after" | ":any-link" | ":before" | ":blank" | ":checked" | ":current" | ":default" | ":defined" | ":disabled" | ":empty" | ":enabled" | ":first" | ":first-child" | ":first-letter" | ":first-line" | ":first-of-type" | ":focus" | ":focus-visible" | ":focus-within" | ":fullscreen" | ":future" | ":hover" | ":in-range" | ":indeterminate" | ":invalid" | ":last-child" | ":last-of-type" | ":left" | ":link" | ":local-link" | ":nth-col" | ":nth-last-col" | ":only-child" | ":only-of-type" | ":optional" | ":out-of-range" | ":past" | ":paused" | ":picture-in-picture" | ":placeholder-shown" | ":read-only" | ":read-write" | ":required" | ":right" | ":root" | ":scope" | ":target" | ":target-within" | ":user-invalid" | ":user-valid" | ":valid" | ":visited";
    export type Pseudos = AdvancedPseudos | SimplePseudos;
    export type HtmlAttributes = "[abbr]" | "[accept-charset]" | "[accept]" | "[accesskey]" | "[action]" | "[align]" | "[alink]" | "[allow]" | "[allowfullscreen]" | "[allowpaymentrequest]" | "[alt]" | "[archive]" | "[async]" | "[autobuffer]" | "[autocapitalize]" | "[autocomplete]" | "[autofocus]" | "[autoplay]" | "[axis]" | "[background]" | "[behavior]" | "[bgcolor]" | "[border]" | "[bottommargin]" | "[buffered]" | "[cellpadding]" | "[cellspacing]" | "[char]" | "[charoff]" | "[charset]" | "[checked]" | "[cite]" | "[class]" | "[classid]" | "[clear]" | "[code]" | "[codebase]" | "[codetype]" | "[color]" | "[cols]" | "[colspan]" | "[command]" | "[compact]" | "[content]" | "[contenteditable]" | "[contextmenu]" | "[controls]" | "[coords]" | "[crossorigin]" | "[data]" | "[datafld]" | "[datasrc]" | "[datetime]" | "[declare]" | "[decoding]" | "[default]" | "[defer]" | "[dir]" | "[direction]" | "[dirname]" | "[disabled]" | "[download]" | "[draggable]" | "[enctype]" | "[enterkeyhint]" | "[exportparts]" | "[face]" | "[for]" | "[form]" | "[formaction]" | "[formenctype]" | "[formmethod]" | "[formnovalidate]" | "[formtarget]" | "[frame]" | "[frameborder]" | "[headers]" | "[height]" | "[hidden]" | "[high]" | "[href]" | "[hreflang]" | "[hspace]" | "[http-equiv]" | "[icon]" | "[id]" | "[imagesizes]" | "[imagesrcset]" | "[inputmode]" | "[integrity]" | "[intrinsicsize]" | "[is]" | "[ismap]" | "[itemid]" | "[itemprop]" | "[itemref]" | "[itemscope]" | "[itemtype]" | "[kind]" | "[label]" | "[lang]" | "[language]" | "[leftmargin]" | "[link]" | "[loading]" | "[longdesc]" | "[loop]" | "[low]" | "[manifest]" | "[marginheight]" | "[marginwidth]" | "[max]" | "[maxlength]" | "[mayscript]" | "[media]" | "[method]" | "[methods]" | "[min]" | "[minlength]" | "[moz-opaque]" | "[mozallowfullscreen]" | "[mozcurrentsampleoffset]" | "[msallowfullscreen]" | "[multiple]" | "[muted]" | "[name]" | "[nohref]" | "[nomodule]" | "[nonce]" | "[noresize]" | "[noshade]" | "[novalidate]" | "[nowrap]" | "[object]" | "[onafterprint]" | "[onbeforeprint]" | "[onbeforeunload]" | "[onblur]" | "[onerror]" | "[onfocus]" | "[onhashchange]" | "[onlanguagechange]" | "[onload]" | "[onmessage]" | "[onoffline]" | "[ononline]" | "[onpopstate]" | "[onredo]" | "[onresize]" | "[onstorage]" | "[onundo]" | "[onunload]" | "[open]" | "[optimum]" | "[part]" | "[ping]" | "[placeholder]" | "[played]" | "[poster]" | "[prefetch]" | "[preload]" | "[profile]" | "[radiogroup]" | "[readonly]" | "[referrerpolicy]" | "[rel]" | "[required]" | "[rev]" | "[reversed]" | "[rightmargin]" | "[rows]" | "[rowspan]" | "[rules]" | "[sandbox-allow-downloads]" | "[sandbox-allow-modals]" | "[sandbox-allow-popups-to-escape-sandbox]" | "[sandbox-allow-popups]" | "[sandbox-allow-presentation]" | "[sandbox-allow-same-origin]" | "[sandbox-allow-storage-access-by-user-activation]" | "[sandbox-allow-top-navigation-by-user-activation]" | "[sandbox]" | "[scope]" | "[scoped]" | "[scrollamount]" | "[scrolldelay]" | "[scrolling]" | "[selected]" | "[shape]" | "[size]" | "[sizes]" | "[slot]" | "[span]" | "[spellcheck]" | "[src]" | "[srcdoc]" | "[srclang]" | "[srcset]" | "[standby]" | "[start]" | "[style]" | "[summary]" | "[tabindex]" | "[target]" | "[text]" | "[title]" | "[topmargin]" | "[translate]" | "[truespeed]" | "[type]" | "[usemap]" | "[valign]" | "[value]" | "[valuetype]" | "[version]" | "[vlink]" | "[volume]" | "[vspace]" | "[webkitallowfullscreen]" | "[width]" | "[wrap]" | "[xmlns]";
    export type SvgAttributes = "[accent-height]" | "[alignment-baseline]" | "[allowReorder]" | "[alphabetic]" | "[animation]" | "[arabic-form]" | "[ascent]" | "[attributeName]" | "[attributeType]" | "[azimuth]" | "[baseFrequency]" | "[baseProfile]" | "[baseline-shift]" | "[bbox]" | "[bias]" | "[by]" | "[calcMode]" | "[cap-height]" | "[class]" | "[clip-path]" | "[clip-rule]" | "[clipPathUnits]" | "[clip]" | "[color-interpolation-filters]" | "[color-interpolation]" | "[color-profile]" | "[color-rendering]" | "[color]" | "[contentScriptType]" | "[contentStyleType]" | "[cursor]" | "[cx]" | "[cy]" | "[d]" | "[descent]" | "[diffuseConstant]" | "[direction]" | "[display]" | "[divisor]" | "[document]" | "[dominant-baseline]" | "[download]" | "[dur]" | "[dx]" | "[dy]" | "[edgeMode]" | "[elevation]" | "[enable-background]" | "[fill-opacity]" | "[fill-rule]" | "[fill]" | "[filterRes]" | "[filterUnits]" | "[filter]" | "[flood-color]" | "[flood-opacity]" | "[font-family]" | "[font-size-adjust]" | "[font-size]" | "[font-stretch]" | "[font-style]" | "[font-variant]" | "[font-weight]" | "[format]" | "[fr]" | "[from]" | "[fx]" | "[fy]" | "[g1]" | "[g2]" | "[global]" | "[glyph-name]" | "[glyph-orientation-horizontal]" | "[glyph-orientation-vertical]" | "[glyphRef]" | "[gradientTransform]" | "[gradientUnits]" | "[graphical]" | "[hanging]" | "[hatchContentUnits]" | "[hatchUnits]" | "[height]" | "[horiz-adv-x]" | "[horiz-origin-x]" | "[horiz-origin-y]" | "[href]" | "[hreflang]" | "[id]" | "[ideographic]" | "[image-rendering]" | "[in2]" | "[in]" | "[k1]" | "[k2]" | "[k3]" | "[k4]" | "[k]" | "[kernelMatrix]" | "[kernelUnitLength]" | "[kerning]" | "[keyPoints]" | "[lang]" | "[lengthAdjust]" | "[letter-spacing]" | "[lighting-color]" | "[limitingConeAngle]" | "[marker-end]" | "[marker-mid]" | "[marker-start]" | "[markerHeight]" | "[markerUnits]" | "[markerWidth]" | "[maskContentUnits]" | "[maskUnits]" | "[mask]" | "[mathematical]" | "[media]" | "[mode]" | "[name]" | "[numOctaves]" | "[offset]" | "[opacity]" | "[operator]" | "[order]" | "[orient]" | "[orientation]" | "[origin]" | "[overflow]" | "[overline-position]" | "[overline-thickness]" | "[paint-order]" | "[panose-1]" | "[path]" | "[patternContentUnits]" | "[patternTransform]" | "[patternUnits]" | "[ping]" | "[pitch]" | "[pointer-events]" | "[pointsAtX]" | "[pointsAtY]" | "[pointsAtZ]" | "[points]" | "[preserveAlpha]" | "[preserveAspectRatio]" | "[primitiveUnits]" | "[r]" | "[radius]" | "[refX]" | "[refY]" | "[referrerpolicy]" | "[rel]" | "[repeatCount]" | "[requiredExtensions]" | "[requiredFeatures]" | "[rotate]" | "[rx]" | "[ry]" | "[scale]" | "[seed]" | "[shape-rendering]" | "[side]" | "[slope]" | "[solid-color]" | "[solid-opacity]" | "[spacing]" | "[specularConstant]" | "[specularExponent]" | "[spreadMethod]" | "[startOffset]" | "[stdDeviation]" | "[stemh]" | "[stemv]" | "[stitchTiles]" | "[stop-color]" | "[stop-opacity]" | "[strikethrough-position]" | "[strikethrough-thickness]" | "[string]" | "[stroke-dasharray]" | "[stroke-dashoffset]" | "[stroke-linecap]" | "[stroke-linejoin]" | "[stroke-miterlimit]" | "[stroke-opacity]" | "[stroke-width]" | "[stroke]" | "[style]" | "[surfaceScale]" | "[systemLanguage]" | "[tabindex]" | "[targetX]" | "[targetY]" | "[target]" | "[text-anchor]" | "[text-decoration]" | "[text-overflow]" | "[text-rendering]" | "[textLength]" | "[title]" | "[to]" | "[transform-origin]" | "[transform]" | "[type]" | "[u1]" | "[u2]" | "[underline-position]" | "[underline-thickness]" | "[unicode-bidi]" | "[unicode-range]" | "[unicode]" | "[units-per-em]" | "[v-alphabetic]" | "[v-hanging]" | "[v-ideographic]" | "[v-mathematical]" | "[values]" | "[vector-effect]" | "[version]" | "[vert-adv-y]" | "[vert-origin-x]" | "[vert-origin-y]" | "[viewBox]" | "[viewTarget]" | "[visibility]" | "[white-space]" | "[width]" | "[widths]" | "[word-spacing]" | "[writing-mode]" | "[x-height]" | "[x1]" | "[x2]" | "[xChannelSelector]" | "[x]" | "[y1]" | "[y2]" | "[yChannelSelector]" | "[y]" | "[z]" | "[zoomAndPan]";
    export type Globals = "-moz-initial" | "inherit" | "initial" | "revert" | "unset";
    export namespace Property {
        type AccentColor = Globals | DataType.Color | "auto";
        type AlignContent = Globals | DataType.ContentDistribution | DataType.ContentPosition | "baseline" | "normal" | (string & {});
        type AlignItems = Globals | DataType.SelfPosition | "baseline" | "normal" | "stretch" | (string & {});
        type AlignSelf = Globals | DataType.SelfPosition | "auto" | "baseline" | "normal" | "stretch" | (string & {});
        type AlignTracks = Globals | DataType.ContentDistribution | DataType.ContentPosition | "baseline" | "normal" | (string & {});
        type All = Globals;
        type Animation<TTime = string & {}> = Globals | DataType.SingleAnimation<TTime> | (string & {});
        type AnimationDelay<TTime = string & {}> = Globals | TTime | (string & {});
        type AnimationDirection = Globals | DataType.SingleAnimationDirection | (string & {});
        type AnimationDuration<TTime = string & {}> = Globals | TTime | (string & {});
        type AnimationFillMode = Globals | DataType.SingleAnimationFillMode | (string & {});
        type AnimationIterationCount = Globals | "infinite" | (string & {}) | (number & {});
        type AnimationName = Globals | "none" | (string & {});
        type AnimationPlayState = Globals | "paused" | "running" | (string & {});
        type AnimationTimingFunction = Globals | DataType.EasingFunction | (string & {});
        type Appearance = Globals | DataType.CompatAuto | "auto" | "menulist-button" | "none" | "textfield";
        type AspectRatio = Globals | "auto" | (string & {});
        type Azimuth = Globals | "behind" | "center" | "center-left" | "center-right" | "far-left" | "far-right" | "left" | "left-side" | "leftwards" | "right" | "right-side" | "rightwards" | (string & {});
        type BackdropFilter = Globals | "none" | (string & {});
        type BackfaceVisibility = Globals | "hidden" | "visible";
        type Background<TLength = (string & {}) | 0> = Globals | DataType.FinalBgLayer<TLength> | (string & {});
        type BackgroundAttachment = Globals | DataType.Attachment | (string & {});
        type BackgroundBlendMode = Globals | DataType.BlendMode | (string & {});
        type BackgroundClip = Globals | DataType.Box | (string & {});
        type BackgroundColor = Globals | DataType.Color;
        type BackgroundImage = Globals | "none" | (string & {});
        type BackgroundOrigin = Globals | DataType.Box | (string & {});
        type BackgroundPosition<TLength = (string & {}) | 0> = Globals | DataType.BgPosition<TLength> | (string & {});
        type BackgroundPositionX<TLength = (string & {}) | 0> = Globals | TLength | "center" | "left" | "right" | "x-end" | "x-start" | (string & {});
        type BackgroundPositionY<TLength = (string & {}) | 0> = Globals | TLength | "bottom" | "center" | "top" | "y-end" | "y-start" | (string & {});
        type BackgroundRepeat = Globals | DataType.RepeatStyle | (string & {});
        type BackgroundSize<TLength = (string & {}) | 0> = Globals | DataType.BgSize<TLength> | (string & {});
        type BlockOverflow = Globals | "clip" | "ellipsis" | (string & {});
        type BlockSize<TLength = (string & {}) | 0> = Globals | TLength | "-moz-fit-content" | "-moz-max-content" | "-moz-min-content" | "-webkit-fill-available" | "auto" | "fit-content" | "max-content" | "min-content" | (string & {});
        type Border<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderBlock<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderBlockColor = Globals | DataType.Color | (string & {});
        type BorderBlockEnd<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderBlockEndColor = Globals | DataType.Color;
        type BorderBlockEndStyle = Globals | DataType.LineStyle;
        type BorderBlockEndWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderBlockStart<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderBlockStartColor = Globals | DataType.Color;
        type BorderBlockStartStyle = Globals | DataType.LineStyle;
        type BorderBlockStartWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderBlockStyle = Globals | DataType.LineStyle;
        type BorderBlockWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderBottom<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderBottomColor = Globals | DataType.Color;
        type BorderBottomLeftRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderBottomRightRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderBottomStyle = Globals | DataType.LineStyle;
        type BorderBottomWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderCollapse = Globals | "collapse" | "separate";
        type BorderColor = Globals | DataType.Color | (string & {});
        type BorderEndEndRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderEndStartRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderImage = Globals | "none" | "repeat" | "round" | "space" | "stretch" | (string & {}) | (number & {});
        type BorderImageOutset<TLength = (string & {}) | 0> = Globals | TLength | (string & {}) | (number & {});
        type BorderImageRepeat = Globals | "repeat" | "round" | "space" | "stretch" | (string & {});
        type BorderImageSlice = Globals | (string & {}) | (number & {});
        type BorderImageSource = Globals | "none" | (string & {});
        type BorderImageWidth<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {}) | (number & {});
        type BorderInline<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderInlineColor = Globals | DataType.Color | (string & {});
        type BorderInlineEnd<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderInlineEndColor = Globals | DataType.Color;
        type BorderInlineEndStyle = Globals | DataType.LineStyle;
        type BorderInlineEndWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderInlineStart<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderInlineStartColor = Globals | DataType.Color;
        type BorderInlineStartStyle = Globals | DataType.LineStyle;
        type BorderInlineStartWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderInlineStyle = Globals | DataType.LineStyle;
        type BorderInlineWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderLeft<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderLeftColor = Globals | DataType.Color;
        type BorderLeftStyle = Globals | DataType.LineStyle;
        type BorderLeftWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderRight<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderRightColor = Globals | DataType.Color;
        type BorderRightStyle = Globals | DataType.LineStyle;
        type BorderRightWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderSpacing<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderStartEndRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderStartStartRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderStyle = Globals | DataType.LineStyle | (string & {});
        type BorderTop<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type BorderTopColor = Globals | DataType.Color;
        type BorderTopLeftRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderTopRightRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type BorderTopStyle = Globals | DataType.LineStyle;
        type BorderTopWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type BorderWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | (string & {});
        type Bottom<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type BoxAlign = Globals | "baseline" | "center" | "end" | "start" | "stretch";
        type BoxDecorationBreak = Globals | "clone" | "slice";
        type BoxDirection = Globals | "inherit" | "normal" | "reverse";
        type BoxFlex = Globals | (number & {}) | (string & {});
        type BoxFlexGroup = Globals | (number & {}) | (string & {});
        type BoxLines = Globals | "multiple" | "single";
        type BoxOrdinalGroup = Globals | (number & {}) | (string & {});
        type BoxOrient = Globals | "block-axis" | "horizontal" | "inherit" | "inline-axis" | "vertical";
        type BoxPack = Globals | "center" | "end" | "justify" | "start";
        type BoxShadow = Globals | "none" | (string & {});
        type BoxSizing = Globals | "border-box" | "content-box";
        type BreakAfter = Globals | "all" | "always" | "auto" | "avoid" | "avoid-column" | "avoid-page" | "avoid-region" | "column" | "left" | "page" | "recto" | "region" | "right" | "verso";
        type BreakBefore = Globals | "all" | "always" | "auto" | "avoid" | "avoid-column" | "avoid-page" | "avoid-region" | "column" | "left" | "page" | "recto" | "region" | "right" | "verso";
        type BreakInside = Globals | "auto" | "avoid" | "avoid-column" | "avoid-page" | "avoid-region";
        type CaptionSide = Globals | "block-end" | "block-start" | "bottom" | "inline-end" | "inline-start" | "top";
        type CaretColor = Globals | DataType.Color | "auto";
        type Clear = Globals | "both" | "inline-end" | "inline-start" | "left" | "none" | "right";
        type Clip = Globals | "auto" | (string & {});
        type ClipPath = Globals | DataType.GeometryBox | "none" | (string & {});
        type Color = Globals | DataType.Color;
        type ColorAdjust = Globals | "economy" | "exact";
        type ColorScheme = Globals | "dark" | "light" | "normal" | (string & {});
        type ColumnCount = Globals | "auto" | (number & {}) | (string & {});
        type ColumnFill = Globals | "auto" | "balance" | "balance-all";
        type ColumnGap<TLength = (string & {}) | 0> = Globals | TLength | "normal" | (string & {});
        type ColumnRule<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type ColumnRuleColor = Globals | DataType.Color;
        type ColumnRuleStyle = Globals | DataType.LineStyle | (string & {});
        type ColumnRuleWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | (string & {});
        type ColumnSpan = Globals | "all" | "none";
        type ColumnWidth<TLength = (string & {}) | 0> = Globals | TLength | "auto";
        type Columns<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {}) | (number & {});
        type Contain = Globals | "content" | "layout" | "none" | "paint" | "size" | "strict" | "style" | (string & {});
        type Content = Globals | DataType.ContentList | "none" | "normal" | (string & {});
        type ContentVisibility = Globals | "auto" | "hidden" | "visible";
        type CounterIncrement = Globals | "none" | (string & {});
        type CounterReset = Globals | "none" | (string & {});
        type CounterSet = Globals | "none" | (string & {});
        type Cursor = Globals | "-moz-grab" | "-webkit-grab" | "alias" | "all-scroll" | "auto" | "cell" | "col-resize" | "context-menu" | "copy" | "crosshair" | "default" | "e-resize" | "ew-resize" | "grab" | "grabbing" | "help" | "move" | "n-resize" | "ne-resize" | "nesw-resize" | "no-drop" | "none" | "not-allowed" | "ns-resize" | "nw-resize" | "nwse-resize" | "pointer" | "progress" | "row-resize" | "s-resize" | "se-resize" | "sw-resize" | "text" | "vertical-text" | "w-resize" | "wait" | "zoom-in" | "zoom-out" | (string & {});
        type Direction = Globals | "ltr" | "rtl";
        type Display = Globals | DataType.DisplayOutside | DataType.DisplayInside | DataType.DisplayInternal | DataType.DisplayLegacy | "contents" | "list-item" | "none" | (string & {});
        type EmptyCells = Globals | "hide" | "show";
        type Filter = Globals | "none" | (string & {});
        type Flex<TLength = (string & {}) | 0> = Globals | TLength | "auto" | "content" | "fit-content" | "max-content" | "min-content" | "none" | (string & {}) | (number & {});
        type FlexBasis<TLength = (string & {}) | 0> = Globals | TLength | "-moz-max-content" | "-moz-min-content" | "-webkit-auto" | "auto" | "content" | "fit-content" | "max-content" | "min-content" | (string & {});
        type FlexDirection = Globals | "column" | "column-reverse" | "row" | "row-reverse";
        type FlexFlow = Globals | "column" | "column-reverse" | "nowrap" | "row" | "row-reverse" | "wrap" | "wrap-reverse" | (string & {});
        type FlexGrow = Globals | (number & {}) | (string & {});
        type FlexShrink = Globals | (number & {}) | (string & {});
        type FlexWrap = Globals | "nowrap" | "wrap" | "wrap-reverse";
        type Float = Globals | "inline-end" | "inline-start" | "left" | "none" | "right";
        type Font = Globals | "caption" | "icon" | "menu" | "message-box" | "small-caption" | "status-bar" | (string & {});
        type FontFamily = Globals | DataType.GenericFamily | (string & {});
        type FontFeatureSettings = Globals | "normal" | (string & {});
        type FontKerning = Globals | "auto" | "none" | "normal";
        type FontLanguageOverride = Globals | "normal" | (string & {});
        type FontOpticalSizing = Globals | "auto" | "none";
        type FontSize<TLength = (string & {}) | 0> = Globals | DataType.AbsoluteSize | TLength | "larger" | "smaller" | (string & {});
        type FontSizeAdjust = Globals | "from-font" | "none" | (string & {}) | (number & {});
        type FontSmooth<TLength = (string & {}) | 0> = Globals | DataType.AbsoluteSize | TLength | "always" | "auto" | "never";
        type FontStretch = Globals | DataType.FontStretchAbsolute;
        type FontStyle = Globals | "italic" | "normal" | "oblique" | (string & {});
        type FontSynthesis = Globals | "none" | "small-caps" | "style" | "weight" | (string & {});
        type FontVariant = Globals | DataType.EastAsianVariantValues | "all-petite-caps" | "all-small-caps" | "common-ligatures" | "contextual" | "diagonal-fractions" | "discretionary-ligatures" | "full-width" | "historical-forms" | "historical-ligatures" | "lining-nums" | "no-common-ligatures" | "no-contextual" | "no-discretionary-ligatures" | "no-historical-ligatures" | "none" | "normal" | "oldstyle-nums" | "ordinal" | "petite-caps" | "proportional-nums" | "proportional-width" | "ruby" | "slashed-zero" | "small-caps" | "stacked-fractions" | "tabular-nums" | "titling-caps" | "unicase" | (string & {});
        type FontVariantAlternates = Globals | "historical-forms" | "normal" | (string & {});
        type FontVariantCaps = Globals | "all-petite-caps" | "all-small-caps" | "normal" | "petite-caps" | "small-caps" | "titling-caps" | "unicase";
        type FontVariantEastAsian = Globals | DataType.EastAsianVariantValues | "full-width" | "normal" | "proportional-width" | "ruby" | (string & {});
        type FontVariantLigatures = Globals | "common-ligatures" | "contextual" | "discretionary-ligatures" | "historical-ligatures" | "no-common-ligatures" | "no-contextual" | "no-discretionary-ligatures" | "no-historical-ligatures" | "none" | "normal" | (string & {});
        type FontVariantNumeric = Globals | "diagonal-fractions" | "lining-nums" | "normal" | "oldstyle-nums" | "ordinal" | "proportional-nums" | "slashed-zero" | "stacked-fractions" | "tabular-nums" | (string & {});
        type FontVariantPosition = Globals | "normal" | "sub" | "super";
        type FontVariationSettings = Globals | "normal" | (string & {});
        type FontWeight = Globals | DataType.FontWeightAbsolute | "bolder" | "lighter";
        type ForcedColorAdjust = Globals | "auto" | "none";
        type Gap<TLength = (string & {}) | 0> = Globals | TLength | "normal" | (string & {});
        type Grid = Globals | "none" | (string & {});
        type GridArea = Globals | DataType.GridLine | (string & {});
        type GridAutoColumns<TLength = (string & {}) | 0> = Globals | DataType.TrackBreadth<TLength> | (string & {});
        type GridAutoFlow = Globals | "column" | "dense" | "row" | (string & {});
        type GridAutoRows<TLength = (string & {}) | 0> = Globals | DataType.TrackBreadth<TLength> | (string & {});
        type GridColumn = Globals | DataType.GridLine | (string & {});
        type GridColumnEnd = Globals | DataType.GridLine;
        type GridColumnGap<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type GridColumnStart = Globals | DataType.GridLine;
        type GridGap<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type GridRow = Globals | DataType.GridLine | (string & {});
        type GridRowEnd = Globals | DataType.GridLine;
        type GridRowGap<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type GridRowStart = Globals | DataType.GridLine;
        type GridTemplate = Globals | "none" | (string & {});
        type GridTemplateAreas = Globals | "none" | (string & {});
        type GridTemplateColumns<TLength = (string & {}) | 0> = Globals | DataType.TrackBreadth<TLength> | "none" | "subgrid" | (string & {});
        type GridTemplateRows<TLength = (string & {}) | 0> = Globals | DataType.TrackBreadth<TLength> | "none" | "subgrid" | (string & {});
        type HangingPunctuation = Globals | "allow-end" | "first" | "force-end" | "last" | "none" | (string & {});
        type Height<TLength = (string & {}) | 0> = Globals | TLength | "-moz-max-content" | "-moz-min-content" | "-webkit-fit-content" | "auto" | "fit-content" | "max-content" | "min-content" | (string & {});
        type Hyphens = Globals | "auto" | "manual" | "none";
        type ImageOrientation = Globals | "flip" | "from-image" | (string & {});
        type ImageRendering = Globals | "-moz-crisp-edges" | "-webkit-optimize-contrast" | "auto" | "crisp-edges" | "pixelated";
        type ImageResolution = Globals | "from-image" | (string & {});
        type ImeMode = Globals | "active" | "auto" | "disabled" | "inactive" | "normal";
        type InitialLetter = Globals | "normal" | (string & {}) | (number & {});
        type InlineSize<TLength = (string & {}) | 0> = Globals | TLength | "-moz-fit-content" | "-moz-max-content" | "-moz-min-content" | "-webkit-fill-available" | "auto" | "fit-content" | "max-content" | "min-content" | (string & {});
        type Inset<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type InsetBlock<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type InsetBlockEnd<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type InsetBlockStart<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type InsetInline<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type InsetInlineEnd<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type InsetInlineStart<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type Isolation = Globals | "auto" | "isolate";
        type JustifyContent = Globals | DataType.ContentDistribution | DataType.ContentPosition | "left" | "normal" | "right" | (string & {});
        type JustifyItems = Globals | DataType.SelfPosition | "baseline" | "left" | "legacy" | "normal" | "right" | "stretch" | (string & {});
        type JustifySelf = Globals | DataType.SelfPosition | "auto" | "baseline" | "left" | "normal" | "right" | "stretch" | (string & {});
        type JustifyTracks = Globals | DataType.ContentDistribution | DataType.ContentPosition | "left" | "normal" | "right" | (string & {});
        type Left<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type LetterSpacing<TLength = (string & {}) | 0> = Globals | TLength | "normal";
        type LineBreak = Globals | "anywhere" | "auto" | "loose" | "normal" | "strict";
        type LineClamp = Globals | "none" | (number & {}) | (string & {});
        type LineHeight<TLength = (string & {}) | 0> = Globals | TLength | "normal" | (string & {}) | (number & {});
        type LineHeightStep<TLength = (string & {}) | 0> = Globals | TLength;
        type ListStyle = Globals | "inside" | "none" | "outside" | (string & {});
        type ListStyleImage = Globals | "none" | (string & {});
        type ListStylePosition = Globals | "inside" | "outside";
        type ListStyleType = Globals | "none" | (string & {});
        type Margin<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginBlock<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginBlockEnd<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginBlockStart<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginBottom<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginInline<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginInlineEnd<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginInlineStart<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginLeft<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginRight<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type MarginTop<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type Mask<TLength = (string & {}) | 0> = Globals | DataType.MaskLayer<TLength> | (string & {});
        type MaskBorder = Globals | "alpha" | "luminance" | "none" | "repeat" | "round" | "space" | "stretch" | (string & {}) | (number & {});
        type MaskBorderMode = Globals | "alpha" | "luminance";
        type MaskBorderOutset<TLength = (string & {}) | 0> = Globals | TLength | (string & {}) | (number & {});
        type MaskBorderRepeat = Globals | "repeat" | "round" | "space" | "stretch" | (string & {});
        type MaskBorderSlice = Globals | (string & {}) | (number & {});
        type MaskBorderSource = Globals | "none" | (string & {});
        type MaskBorderWidth<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {}) | (number & {});
        type MaskClip = Globals | DataType.GeometryBox | "no-clip" | (string & {});
        type MaskComposite = Globals | DataType.CompositingOperator | (string & {});
        type MaskImage = Globals | "none" | (string & {});
        type MaskMode = Globals | DataType.MaskingMode | (string & {});
        type MaskOrigin = Globals | DataType.GeometryBox | (string & {});
        type MaskPosition<TLength = (string & {}) | 0> = Globals | DataType.Position<TLength> | (string & {});
        type MaskRepeat = Globals | DataType.RepeatStyle | (string & {});
        type MaskSize<TLength = (string & {}) | 0> = Globals | DataType.BgSize<TLength> | (string & {});
        type MaskType = Globals | "alpha" | "luminance";
        type MathStyle = Globals | "compact" | "normal";
        type MaxBlockSize<TLength = (string & {}) | 0> = Globals | TLength | "-moz-max-content" | "-moz-min-content" | "-webkit-fill-available" | "fit-content" | "max-content" | "min-content" | "none" | (string & {});
        type MaxHeight<TLength = (string & {}) | 0> = Globals | TLength | "-moz-fit-content" | "-moz-max-content" | "-moz-min-content" | "-webkit-fit-content" | "-webkit-max-content" | "-webkit-min-content" | "fit-content" | "intrinsic" | "max-content" | "min-content" | "none" | (string & {});
        type MaxInlineSize<TLength = (string & {}) | 0> = Globals | TLength | "-moz-fit-content" | "-moz-max-content" | "-moz-min-content" | "-webkit-fill-available" | "fit-content" | "max-content" | "min-content" | "none" | (string & {});
        type MaxLines = Globals | "none" | (number & {}) | (string & {});
        type MaxWidth<TLength = (string & {}) | 0> = Globals | TLength | "-moz-fit-content" | "-moz-max-content" | "-moz-min-content" | "-webkit-fit-content" | "-webkit-max-content" | "-webkit-min-content" | "fit-content" | "intrinsic" | "max-content" | "min-content" | "none" | (string & {});
        type MinBlockSize<TLength = (string & {}) | 0> = Globals | TLength | "-moz-max-content" | "-moz-min-content" | "-webkit-fill-available" | "auto" | "fit-content" | "max-content" | "min-content" | (string & {});
        type MinHeight<TLength = (string & {}) | 0> = Globals | TLength | "-moz-fit-content" | "-moz-max-content" | "-moz-min-content" | "-webkit-fit-content" | "-webkit-max-content" | "-webkit-min-content" | "auto" | "fit-content" | "intrinsic" | "max-content" | "min-content" | (string & {});
        type MinInlineSize<TLength = (string & {}) | 0> = Globals | TLength | "-moz-fit-content" | "-moz-max-content" | "-moz-min-content" | "-webkit-fill-available" | "auto" | "fit-content" | "max-content" | "min-content" | (string & {});
        type MinWidth<TLength = (string & {}) | 0> = Globals | TLength | "-moz-fit-content" | "-moz-max-content" | "-moz-min-content" | "-webkit-fill-available" | "-webkit-fit-content" | "-webkit-max-content" | "-webkit-min-content" | "auto" | "fit-content" | "intrinsic" | "max-content" | "min-content" | "min-intrinsic" | (string & {});
        type MixBlendMode = Globals | DataType.BlendMode;
        type Offset<TLength = (string & {}) | 0> = Globals | DataType.Position<TLength> | DataType.GeometryBox | "auto" | "none" | (string & {});
        type OffsetDistance<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type OffsetPath = Globals | DataType.GeometryBox | "none" | (string & {});
        type OffsetRotate = Globals | "auto" | "reverse" | (string & {});
        type ObjectFit = Globals | "contain" | "cover" | "fill" | "none" | "scale-down";
        type ObjectPosition<TLength = (string & {}) | 0> = Globals | DataType.Position<TLength>;
        type OffsetAnchor<TLength = (string & {}) | 0> = Globals | DataType.Position<TLength> | "auto";
        type Opacity = Globals | (string & {}) | (number & {});
        type Order = Globals | (number & {}) | (string & {});
        type Orphans = Globals | (number & {}) | (string & {});
        type Outline<TLength = (string & {}) | 0> = Globals | DataType.Color | DataType.LineStyle | DataType.LineWidth<TLength> | "auto" | "invert" | (string & {});
        type OutlineColor = Globals | DataType.Color | "invert";
        type OutlineOffset<TLength = (string & {}) | 0> = Globals | TLength;
        type OutlineStyle = Globals | DataType.LineStyle | "auto" | (string & {});
        type OutlineWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength>;
        type Overflow = Globals | "-moz-hidden-unscrollable" | "auto" | "clip" | "hidden" | "scroll" | "visible" | (string & {});
        type OverflowAnchor = Globals | "auto" | "none";
        type OverflowBlock = Globals | "auto" | "clip" | "hidden" | "scroll" | "visible";
        type OverflowClipBox = Globals | "content-box" | "padding-box";
        type OverflowClipMargin<TLength = (string & {}) | 0> = Globals | DataType.VisualBox | TLength | (string & {});
        type OverflowInline = Globals | "auto" | "clip" | "hidden" | "scroll" | "visible";
        type OverflowWrap = Globals | "anywhere" | "break-word" | "normal";
        type OverflowX = Globals | "-moz-hidden-unscrollable" | "auto" | "clip" | "hidden" | "scroll" | "visible";
        type OverflowY = Globals | "-moz-hidden-unscrollable" | "auto" | "clip" | "hidden" | "scroll" | "visible";
        type OverscrollBehavior = Globals | "auto" | "contain" | "none" | (string & {});
        type OverscrollBehaviorBlock = Globals | "auto" | "contain" | "none";
        type OverscrollBehaviorInline = Globals | "auto" | "contain" | "none";
        type OverscrollBehaviorX = Globals | "auto" | "contain" | "none";
        type OverscrollBehaviorY = Globals | "auto" | "contain" | "none";
        type Padding<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingBlock<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingBlockEnd<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingBlockStart<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingBottom<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingInline<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingInlineEnd<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingInlineStart<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingLeft<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingRight<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PaddingTop<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type PageBreakAfter = Globals | "always" | "auto" | "avoid" | "left" | "recto" | "right" | "verso";
        type PageBreakBefore = Globals | "always" | "auto" | "avoid" | "left" | "recto" | "right" | "verso";
        type PageBreakInside = Globals | "auto" | "avoid";
        type PaintOrder = Globals | "fill" | "markers" | "normal" | "stroke" | (string & {});
        type Perspective<TLength = (string & {}) | 0> = Globals | TLength | "none";
        type PerspectiveOrigin<TLength = (string & {}) | 0> = Globals | DataType.Position<TLength>;
        type PlaceContent = Globals | DataType.ContentDistribution | DataType.ContentPosition | "baseline" | "normal" | (string & {});
        type PlaceItems = Globals | DataType.SelfPosition | "baseline" | "normal" | "stretch" | (string & {});
        type PlaceSelf = Globals | DataType.SelfPosition | "auto" | "baseline" | "normal" | "stretch" | (string & {});
        type PointerEvents = Globals | "all" | "auto" | "fill" | "inherit" | "none" | "painted" | "stroke" | "visible" | "visibleFill" | "visiblePainted" | "visibleStroke";
        type Position = Globals | "-webkit-sticky" | "absolute" | "fixed" | "relative" | "static" | "sticky";
        type Quotes = Globals | "auto" | "none" | (string & {});
        type Resize = Globals | "block" | "both" | "horizontal" | "inline" | "none" | "vertical";
        type Right<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type Rotate = Globals | "none" | (string & {});
        type RowGap<TLength = (string & {}) | 0> = Globals | TLength | "normal" | (string & {});
        type RubyAlign = Globals | "center" | "space-around" | "space-between" | "start";
        type RubyMerge = Globals | "auto" | "collapse" | "separate";
        type RubyPosition = Globals | "alternate" | "inter-character" | "over" | "under" | (string & {});
        type Scale = Globals | "none" | (string & {}) | (number & {});
        type ScrollBehavior = Globals | "auto" | "smooth";
        type ScrollMargin<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type ScrollMarginBlock<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type ScrollMarginBlockEnd<TLength = (string & {}) | 0> = Globals | TLength;
        type ScrollMarginBlockStart<TLength = (string & {}) | 0> = Globals | TLength;
        type ScrollMarginBottom<TLength = (string & {}) | 0> = Globals | TLength;
        type ScrollMarginInline<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type ScrollMarginInlineEnd<TLength = (string & {}) | 0> = Globals | TLength;
        type ScrollMarginInlineStart<TLength = (string & {}) | 0> = Globals | TLength;
        type ScrollMarginLeft<TLength = (string & {}) | 0> = Globals | TLength;
        type ScrollMarginRight<TLength = (string & {}) | 0> = Globals | TLength;
        type ScrollMarginTop<TLength = (string & {}) | 0> = Globals | TLength;
        type ScrollPadding<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingBlock<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingBlockEnd<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingBlockStart<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingBottom<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingInline<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingInlineEnd<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingInlineStart<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingLeft<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingRight<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollPaddingTop<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type ScrollSnapAlign = Globals | "center" | "end" | "none" | "start" | (string & {});
        type ScrollSnapCoordinate<TLength = (string & {}) | 0> = Globals | DataType.Position<TLength> | "none" | (string & {});
        type ScrollSnapDestination<TLength = (string & {}) | 0> = Globals | DataType.Position<TLength>;
        type ScrollSnapPointsX = Globals | "none" | (string & {});
        type ScrollSnapPointsY = Globals | "none" | (string & {});
        type ScrollSnapStop = Globals | "always" | "normal";
        type ScrollSnapType = Globals | "block" | "both" | "inline" | "none" | "x" | "y" | (string & {});
        type ScrollSnapTypeX = Globals | "mandatory" | "none" | "proximity";
        type ScrollSnapTypeY = Globals | "mandatory" | "none" | "proximity";
        type ScrollbarColor = Globals | "auto" | (string & {});
        type ScrollbarGutter = Globals | "auto" | "stable" | (string & {});
        type MsScrollbarTrackColor = Globals | DataType.Color;
        type ScrollbarWidth = Globals | "auto" | "none" | "thin";
        type ShapeImageThreshold = Globals | (string & {}) | (number & {});
        type ShapeMargin<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type ShapeOutside = Globals | DataType.Box | "margin-box" | "none" | (string & {});
        type TabSize<TLength = (string & {}) | 0> = Globals | TLength | (number & {}) | (string & {});
        type TableLayout = Globals | "auto" | "fixed";
        type TextAlign = Globals | "center" | "end" | "justify" | "left" | "match-parent" | "right" | "start";
        type TextAlignLast = Globals | "auto" | "center" | "end" | "justify" | "left" | "right" | "start";
        type TextCombineUpright = Globals | "all" | "none" | (string & {});
        type TextDecoration<TLength = (string & {}) | 0> = Globals | DataType.Color | TLength | "auto" | "blink" | "dashed" | "dotted" | "double" | "from-font" | "grammar-error" | "line-through" | "none" | "overline" | "solid" | "spelling-error" | "underline" | "wavy" | (string & {});
        type TextDecorationColor = Globals | DataType.Color;
        type TextDecorationLine = Globals | "blink" | "grammar-error" | "line-through" | "none" | "overline" | "spelling-error" | "underline" | (string & {});
        type TextDecorationSkip = Globals | "box-decoration" | "edges" | "leading-spaces" | "none" | "objects" | "spaces" | "trailing-spaces" | (string & {});
        type TextDecorationSkipInk = Globals | "all" | "auto" | "none";
        type TextDecorationStyle = Globals | "dashed" | "dotted" | "double" | "solid" | "wavy";
        type TextDecorationThickness<TLength = (string & {}) | 0> = Globals | TLength | "auto" | "from-font" | (string & {});
        type TextEmphasis = Globals | DataType.Color | "circle" | "dot" | "double-circle" | "filled" | "none" | "open" | "sesame" | "triangle" | (string & {});
        type TextEmphasisColor = Globals | DataType.Color;
        type TextEmphasisPosition = Globals | (string & {});
        type TextEmphasisStyle = Globals | "circle" | "dot" | "double-circle" | "filled" | "none" | "open" | "sesame" | "triangle" | (string & {});
        type TextIndent<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type TextJustify = Globals | "auto" | "inter-character" | "inter-word" | "none";
        type TextOrientation = Globals | "mixed" | "sideways" | "upright";
        type TextOverflow = Globals | "clip" | "ellipsis" | (string & {});
        type TextRendering = Globals | "auto" | "geometricPrecision" | "optimizeLegibility" | "optimizeSpeed";
        type TextShadow = Globals | "none" | (string & {});
        type TextSizeAdjust = Globals | "auto" | "none" | (string & {});
        type TextTransform = Globals | "capitalize" | "full-size-kana" | "full-width" | "lowercase" | "none" | "uppercase";
        type TextUnderlineOffset<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type TextUnderlinePosition = Globals | "auto" | "from-font" | "left" | "right" | "under" | (string & {});
        type Top<TLength = (string & {}) | 0> = Globals | TLength | "auto" | (string & {});
        type TouchAction = Globals | "-ms-manipulation" | "-ms-none" | "-ms-pinch-zoom" | "auto" | "manipulation" | "none" | "pan-down" | "pan-left" | "pan-right" | "pan-up" | "pan-x" | "pan-y" | "pinch-zoom" | (string & {});
        type Transform = Globals | "none" | (string & {});
        type TransformBox = Globals | "border-box" | "content-box" | "fill-box" | "stroke-box" | "view-box";
        type TransformOrigin<TLength = (string & {}) | 0> = Globals | TLength | "bottom" | "center" | "left" | "right" | "top" | (string & {});
        type TransformStyle = Globals | "flat" | "preserve-3d";
        type Transition<TTime = string & {}> = Globals | DataType.SingleTransition<TTime> | (string & {});
        type TransitionDelay<TTime = string & {}> = Globals | TTime | (string & {});
        type TransitionDuration<TTime = string & {}> = Globals | TTime | (string & {});
        type TransitionProperty = Globals | "all" | "none" | (string & {});
        type TransitionTimingFunction = Globals | DataType.EasingFunction | (string & {});
        type Translate<TLength = (string & {}) | 0> = Globals | TLength | "none" | (string & {});
        type UnicodeBidi = Globals | "-moz-isolate" | "-moz-isolate-override" | "-moz-plaintext" | "-webkit-isolate" | "-webkit-isolate-override" | "-webkit-plaintext" | "bidi-override" | "embed" | "isolate" | "isolate-override" | "normal" | "plaintext";
        type UserSelect = Globals | "-moz-none" | "all" | "auto" | "contain" | "element" | "none" | "text";
        type VerticalAlign<TLength = (string & {}) | 0> = Globals | TLength | "baseline" | "bottom" | "middle" | "sub" | "super" | "text-bottom" | "text-top" | "top" | (string & {});
        type Visibility = Globals | "collapse" | "hidden" | "visible";
        type WhiteSpace = Globals | "-moz-pre-wrap" | "break-spaces" | "normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap";
        type Widows = Globals | (number & {}) | (string & {});
        type Width<TLength = (string & {}) | 0> = Globals | TLength | "-moz-fit-content" | "-moz-max-content" | "-moz-min-content" | "-webkit-fit-content" | "-webkit-max-content" | "auto" | "fit-content" | "intrinsic" | "max-content" | "min-content" | "min-intrinsic" | (string & {});
        type WillChange = Globals | DataType.AnimateableFeature | "auto" | (string & {});
        type WordBreak = Globals | "break-all" | "break-word" | "keep-all" | "normal";
        type WordSpacing<TLength = (string & {}) | 0> = Globals | TLength | "normal";
        type WordWrap = Globals | "break-word" | "normal";
        type WritingMode = Globals | "horizontal-tb" | "sideways-lr" | "sideways-rl" | "vertical-lr" | "vertical-rl";
        type ZIndex = Globals | "auto" | (number & {}) | (string & {});
        type Zoom = Globals | "normal" | "reset" | (string & {}) | (number & {});
        type MozAppearance = Globals | "-moz-mac-unified-toolbar" | "-moz-win-borderless-glass" | "-moz-win-browsertabbar-toolbox" | "-moz-win-communications-toolbox" | "-moz-win-communicationstext" | "-moz-win-exclude-glass" | "-moz-win-glass" | "-moz-win-media-toolbox" | "-moz-win-mediatext" | "-moz-window-button-box" | "-moz-window-button-box-maximized" | "-moz-window-button-close" | "-moz-window-button-maximize" | "-moz-window-button-minimize" | "-moz-window-button-restore" | "-moz-window-frame-bottom" | "-moz-window-frame-left" | "-moz-window-frame-right" | "-moz-window-titlebar" | "-moz-window-titlebar-maximized" | "button" | "button-arrow-down" | "button-arrow-next" | "button-arrow-previous" | "button-arrow-up" | "button-bevel" | "button-focus" | "caret" | "checkbox" | "checkbox-container" | "checkbox-label" | "checkmenuitem" | "dualbutton" | "groupbox" | "listbox" | "listitem" | "menuarrow" | "menubar" | "menucheckbox" | "menuimage" | "menuitem" | "menuitemtext" | "menulist" | "menulist-button" | "menulist-text" | "menulist-textfield" | "menupopup" | "menuradio" | "menuseparator" | "meterbar" | "meterchunk" | "none" | "progressbar" | "progressbar-vertical" | "progresschunk" | "progresschunk-vertical" | "radio" | "radio-container" | "radio-label" | "radiomenuitem" | "range" | "range-thumb" | "resizer" | "resizerpanel" | "scale-horizontal" | "scale-vertical" | "scalethumb-horizontal" | "scalethumb-vertical" | "scalethumbend" | "scalethumbstart" | "scalethumbtick" | "scrollbarbutton-down" | "scrollbarbutton-left" | "scrollbarbutton-right" | "scrollbarbutton-up" | "scrollbarthumb-horizontal" | "scrollbarthumb-vertical" | "scrollbartrack-horizontal" | "scrollbartrack-vertical" | "searchfield" | "separator" | "sheet" | "spinner" | "spinner-downbutton" | "spinner-textfield" | "spinner-upbutton" | "splitter" | "statusbar" | "statusbarpanel" | "tab" | "tab-scroll-arrow-back" | "tab-scroll-arrow-forward" | "tabpanel" | "tabpanels" | "textfield" | "textfield-multiline" | "toolbar" | "toolbarbutton" | "toolbarbutton-dropdown" | "toolbargripper" | "toolbox" | "tooltip" | "treeheader" | "treeheadercell" | "treeheadersortarrow" | "treeitem" | "treeline" | "treetwisty" | "treetwistyopen" | "treeview";
        type MozBinding = Globals | "none" | (string & {});
        type MozBorderBottomColors = Globals | DataType.Color | "none" | (string & {});
        type MozBorderLeftColors = Globals | DataType.Color | "none" | (string & {});
        type MozBorderRightColors = Globals | DataType.Color | "none" | (string & {});
        type MozBorderTopColors = Globals | DataType.Color | "none" | (string & {});
        type MozContextProperties = Globals | "fill" | "fill-opacity" | "none" | "stroke" | "stroke-opacity" | (string & {});
        type MozFloatEdge = Globals | "border-box" | "content-box" | "margin-box" | "padding-box";
        type MozForceBrokenImageIcon = Globals | 0 | (string & {}) | 1;
        type MozImageRegion = Globals | "auto" | (string & {});
        type MozOrient = Globals | "block" | "horizontal" | "inline" | "vertical";
        type MozOutlineRadius<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type MozOutlineRadiusBottomleft<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type MozOutlineRadiusBottomright<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type MozOutlineRadiusTopleft<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type MozOutlineRadiusTopright<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type MozStackSizing = Globals | "ignore" | "stretch-to-fit";
        type MozTextBlink = Globals | "blink" | "none";
        type MozUserFocus = Globals | "ignore" | "none" | "normal" | "select-after" | "select-all" | "select-before" | "select-menu" | "select-same";
        type MozUserInput = Globals | "auto" | "disabled" | "enabled" | "none";
        type MozUserModify = Globals | "read-only" | "read-write" | "write-only";
        type MozWindowDragging = Globals | "drag" | "no-drag";
        type MozWindowShadow = Globals | "default" | "menu" | "none" | "sheet" | "tooltip";
        type MsAccelerator = Globals | "false" | "true";
        type MsBlockProgression = Globals | "bt" | "lr" | "rl" | "tb";
        type MsContentZoomChaining = Globals | "chained" | "none";
        type MsContentZoomLimit = Globals | (string & {});
        type MsContentZoomLimitMax = Globals | (string & {});
        type MsContentZoomLimitMin = Globals | (string & {});
        type MsContentZoomSnap = Globals | "mandatory" | "none" | "proximity" | (string & {});
        type MsContentZoomSnapPoints = Globals | (string & {});
        type MsContentZoomSnapType = Globals | "mandatory" | "none" | "proximity";
        type MsContentZooming = Globals | "none" | "zoom";
        type MsFilter = Globals | (string & {});
        type MsFlowFrom = Globals | "none" | (string & {});
        type MsFlowInto = Globals | "none" | (string & {});
        type MsGridColumns<TLength = (string & {}) | 0> = Globals | DataType.TrackBreadth<TLength> | "none" | (string & {});
        type MsGridRows<TLength = (string & {}) | 0> = Globals | DataType.TrackBreadth<TLength> | "none" | (string & {});
        type MsHighContrastAdjust = Globals | "auto" | "none";
        type MsHyphenateLimitChars = Globals | "auto" | (string & {}) | (number & {});
        type MsHyphenateLimitLines = Globals | "no-limit" | (number & {}) | (string & {});
        type MsHyphenateLimitZone<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type MsImeAlign = Globals | "after" | "auto";
        type MsOverflowStyle = Globals | "-ms-autohiding-scrollbar" | "auto" | "none" | "scrollbar";
        type MsScrollChaining = Globals | "chained" | "none";
        type MsScrollLimit = Globals | (string & {});
        type MsScrollLimitXMax<TLength = (string & {}) | 0> = Globals | TLength | "auto";
        type MsScrollLimitXMin<TLength = (string & {}) | 0> = Globals | TLength;
        type MsScrollLimitYMax<TLength = (string & {}) | 0> = Globals | TLength | "auto";
        type MsScrollLimitYMin<TLength = (string & {}) | 0> = Globals | TLength;
        type MsScrollRails = Globals | "none" | "railed";
        type MsScrollSnapPointsX = Globals | (string & {});
        type MsScrollSnapPointsY = Globals | (string & {});
        type MsScrollSnapType = Globals | "mandatory" | "none" | "proximity";
        type MsScrollSnapX = Globals | (string & {});
        type MsScrollSnapY = Globals | (string & {});
        type MsScrollTranslation = Globals | "none" | "vertical-to-horizontal";
        type MsScrollbar3dlightColor = Globals | DataType.Color;
        type MsScrollbarArrowColor = Globals | DataType.Color;
        type MsScrollbarBaseColor = Globals | DataType.Color;
        type MsScrollbarDarkshadowColor = Globals | DataType.Color;
        type MsScrollbarFaceColor = Globals | DataType.Color;
        type MsScrollbarHighlightColor = Globals | DataType.Color;
        type MsScrollbarShadowColor = Globals | DataType.Color;
        type MsTextAutospace = Globals | "ideograph-alpha" | "ideograph-numeric" | "ideograph-parenthesis" | "ideograph-space" | "none";
        type MsTouchSelect = Globals | "grippers" | "none";
        type MsUserSelect = Globals | "element" | "none" | "text";
        type MsWrapFlow = Globals | "auto" | "both" | "clear" | "end" | "maximum" | "start";
        type MsWrapMargin<TLength = (string & {}) | 0> = Globals | TLength;
        type MsWrapThrough = Globals | "none" | "wrap";
        type WebkitAppearance = Globals | "-apple-pay-button" | "button" | "button-bevel" | "caret" | "checkbox" | "default-button" | "inner-spin-button" | "listbox" | "listitem" | "media-controls-background" | "media-controls-fullscreen-background" | "media-current-time-display" | "media-enter-fullscreen-button" | "media-exit-fullscreen-button" | "media-fullscreen-button" | "media-mute-button" | "media-overlay-play-button" | "media-play-button" | "media-seek-back-button" | "media-seek-forward-button" | "media-slider" | "media-sliderthumb" | "media-time-remaining-display" | "media-toggle-closed-captions-button" | "media-volume-slider" | "media-volume-slider-container" | "media-volume-sliderthumb" | "menulist" | "menulist-button" | "menulist-text" | "menulist-textfield" | "meter" | "none" | "progress-bar" | "progress-bar-value" | "push-button" | "radio" | "searchfield" | "searchfield-cancel-button" | "searchfield-decoration" | "searchfield-results-button" | "searchfield-results-decoration" | "slider-horizontal" | "slider-vertical" | "sliderthumb-horizontal" | "sliderthumb-vertical" | "square-button" | "textarea" | "textfield";
        type WebkitBorderBefore<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | DataType.LineStyle | DataType.Color | (string & {});
        type WebkitBorderBeforeColor = Globals | DataType.Color;
        type WebkitBorderBeforeStyle = Globals | DataType.LineStyle | (string & {});
        type WebkitBorderBeforeWidth<TLength = (string & {}) | 0> = Globals | DataType.LineWidth<TLength> | (string & {});
        type WebkitBoxReflect<TLength = (string & {}) | 0> = Globals | TLength | "above" | "below" | "left" | "right" | (string & {});
        type WebkitLineClamp = Globals | "none" | (number & {}) | (string & {});
        type WebkitMask<TLength = (string & {}) | 0> = Globals | DataType.Position<TLength> | DataType.RepeatStyle | DataType.Box | "border" | "content" | "none" | "padding" | "text" | (string & {});
        type WebkitMaskAttachment = Globals | DataType.Attachment | (string & {});
        type WebkitMaskClip = Globals | DataType.Box | "border" | "content" | "padding" | "text" | (string & {});
        type WebkitMaskComposite = Globals | DataType.CompositeStyle | (string & {});
        type WebkitMaskImage = Globals | "none" | (string & {});
        type WebkitMaskOrigin = Globals | DataType.Box | "border" | "content" | "padding" | (string & {});
        type WebkitMaskPosition<TLength = (string & {}) | 0> = Globals | DataType.Position<TLength> | (string & {});
        type WebkitMaskPositionX<TLength = (string & {}) | 0> = Globals | TLength | "center" | "left" | "right" | (string & {});
        type WebkitMaskPositionY<TLength = (string & {}) | 0> = Globals | TLength | "bottom" | "center" | "top" | (string & {});
        type WebkitMaskRepeat = Globals | DataType.RepeatStyle | (string & {});
        type WebkitMaskRepeatX = Globals | "no-repeat" | "repeat" | "round" | "space";
        type WebkitMaskRepeatY = Globals | "no-repeat" | "repeat" | "round" | "space";
        type WebkitMaskSize<TLength = (string & {}) | 0> = Globals | DataType.BgSize<TLength> | (string & {});
        type WebkitOverflowScrolling = Globals | "auto" | "touch";
        type WebkitTapHighlightColor = Globals | DataType.Color;
        type WebkitTextFillColor = Globals | DataType.Color;
        type WebkitTextStroke<TLength = (string & {}) | 0> = Globals | DataType.Color | TLength | (string & {});
        type WebkitTextStrokeColor = Globals | DataType.Color;
        type WebkitTextStrokeWidth<TLength = (string & {}) | 0> = Globals | TLength;
        type WebkitTouchCallout = Globals | "default" | "none";
        type WebkitUserModify = Globals | "read-only" | "read-write" | "read-write-plaintext-only";
        type AlignmentBaseline = Globals | "after-edge" | "alphabetic" | "auto" | "baseline" | "before-edge" | "central" | "hanging" | "ideographic" | "mathematical" | "middle" | "text-after-edge" | "text-before-edge";
        type BaselineShift<TLength = (string & {}) | 0> = Globals | TLength | "baseline" | "sub" | "super" | (string & {});
        type ClipRule = Globals | "evenodd" | "nonzero";
        type ColorInterpolation = Globals | "auto" | "linearRGB" | "sRGB";
        type ColorRendering = Globals | "auto" | "optimizeQuality" | "optimizeSpeed";
        type DominantBaseline = Globals | "alphabetic" | "auto" | "central" | "hanging" | "ideographic" | "mathematical" | "middle" | "no-change" | "reset-size" | "text-after-edge" | "text-before-edge" | "use-script";
        type Fill = Globals | DataType.Paint;
        type FillOpacity = Globals | (number & {}) | (string & {});
        type FillRule = Globals | "evenodd" | "nonzero";
        type FloodColor = Globals | DataType.Color | "currentColor";
        type FloodOpacity = Globals | (number & {}) | (string & {});
        type GlyphOrientationVertical = Globals | "auto" | (string & {}) | (number & {});
        type LightingColor = Globals | DataType.Color | "currentColor";
        type Marker = Globals | "none" | (string & {});
        type MarkerEnd = Globals | "none" | (string & {});
        type MarkerMid = Globals | "none" | (string & {});
        type MarkerStart = Globals | "none" | (string & {});
        type ShapeRendering = Globals | "auto" | "crispEdges" | "geometricPrecision" | "optimizeSpeed";
        type StopColor = Globals | DataType.Color | "currentColor";
        type StopOpacity = Globals | (number & {}) | (string & {});
        type Stroke = Globals | DataType.Paint;
        type StrokeDasharray<TLength = (string & {}) | 0> = Globals | DataType.Dasharray<TLength> | "none";
        type StrokeDashoffset<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type StrokeLinecap = Globals | "butt" | "round" | "square";
        type StrokeLinejoin = Globals | "bevel" | "miter" | "round";
        type StrokeMiterlimit = Globals | (number & {}) | (string & {});
        type StrokeOpacity = Globals | (number & {}) | (string & {});
        type StrokeWidth<TLength = (string & {}) | 0> = Globals | TLength | (string & {});
        type TextAnchor = Globals | "end" | "middle" | "start";
        type VectorEffect = Globals | "non-scaling-stroke" | "none";
    }
    export namespace AtRule {
        export interface CounterStyle<TLength = (string & {}) | 0, TTime = string & {}> {
            additiveSymbols?: string | undefined;
            fallback?: string | undefined;
            negative?: string | undefined;
            pad?: string | undefined;
            prefix?: string | undefined;
            range?: Range | undefined;
            speakAs?: SpeakAs | undefined;
            suffix?: string | undefined;
            symbols?: string | undefined;
            system?: System | undefined;
        }
        export interface CounterStyleHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
            "additive-symbols"?: string | undefined;
            fallback?: string | undefined;
            negative?: string | undefined;
            pad?: string | undefined;
            prefix?: string | undefined;
            range?: Range | undefined;
            "speak-as"?: SpeakAs | undefined;
            suffix?: string | undefined;
            symbols?: string | undefined;
            system?: System | undefined;
        }
        export type CounterStyleFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<CounterStyle<TLength, TTime>>;
        export type CounterStyleHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<CounterStyleHyphen<TLength, TTime>>;
        export interface FontFace<TLength = (string & {}) | 0, TTime = string & {}> {
            MozFontFeatureSettings?: FontFeatureSettings | undefined;
            ascentOverride?: AscentOverride | undefined;
            descentOverride?: DescentOverride | undefined;
            fontDisplay?: FontDisplay | undefined;
            fontFamily?: string | undefined;
            fontFeatureSettings?: FontFeatureSettings | undefined;
            fontStretch?: FontStretch | undefined;
            fontStyle?: FontStyle | undefined;
            fontVariant?: FontVariant | undefined;
            fontVariationSettings?: FontVariationSettings | undefined;
            fontWeight?: FontWeight | undefined;
            lineGapOverride?: LineGapOverride | undefined;
            sizeAdjust?: string | undefined;
            src?: string | undefined;
            unicodeRange?: string | undefined;
        }
        export interface FontFaceHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
            "-moz-font-feature-settings"?: FontFeatureSettings | undefined;
            "ascent-override"?: AscentOverride | undefined;
            "descent-override"?: DescentOverride | undefined;
            "font-display"?: FontDisplay | undefined;
            "font-family"?: string | undefined;
            "font-feature-settings"?: FontFeatureSettings | undefined;
            "font-stretch"?: FontStretch | undefined;
            "font-style"?: FontStyle | undefined;
            "font-variant"?: FontVariant | undefined;
            "font-variation-settings"?: FontVariationSettings | undefined;
            "font-weight"?: FontWeight | undefined;
            "line-gap-override"?: LineGapOverride | undefined;
            "size-adjust"?: string | undefined;
            src?: string | undefined;
            "unicode-range"?: string | undefined;
        }
        export type FontFaceFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<FontFace<TLength, TTime>>;
        export type FontFaceHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<FontFaceHyphen<TLength, TTime>>;
        export interface Page<TLength = (string & {}) | 0, TTime = string & {}> {
            bleed?: Bleed<TLength> | undefined;
            marks?: Marks | undefined;
            size?: Size<TLength> | undefined;
        }
        export interface PageHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
            bleed?: Bleed<TLength> | undefined;
            marks?: Marks | undefined;
            size?: Size<TLength> | undefined;
        }
        export type PageFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<Page<TLength, TTime>>;
        export type PageHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<PageHyphen<TLength, TTime>>;
        export interface Property<TLength = (string & {}) | 0, TTime = string & {}> {
            inherits?: Inherits | undefined;
            initialValue?: string | undefined;
            syntax?: string | undefined;
        }
        export interface PropertyHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
            inherits?: Inherits | undefined;
            "initial-value"?: string | undefined;
            syntax?: string | undefined;
        }
        export type PropertyFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<Property<TLength, TTime>>;
        export type PropertyHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<PropertyHyphen<TLength, TTime>>;
        export interface Viewport<TLength = (string & {}) | 0, TTime = string & {}> {
            height?: Height<TLength> | undefined;
            maxHeight?: MaxHeight<TLength> | undefined;
            maxWidth?: MaxWidth<TLength> | undefined;
            maxZoom?: MaxZoom | undefined;
            minHeight?: MinHeight<TLength> | undefined;
            minWidth?: MinWidth<TLength> | undefined;
            minZoom?: MinZoom | undefined;
            orientation?: Orientation | undefined;
            userZoom?: UserZoom | undefined;
            viewportFit?: ViewportFit | undefined;
            width?: Width<TLength> | undefined;
            zoom?: Zoom | undefined;
        }
        export interface ViewportHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
            height?: Height<TLength> | undefined;
            "max-height"?: MaxHeight<TLength> | undefined;
            "max-width"?: MaxWidth<TLength> | undefined;
            "max-zoom"?: MaxZoom | undefined;
            "min-height"?: MinHeight<TLength> | undefined;
            "min-width"?: MinWidth<TLength> | undefined;
            "min-zoom"?: MinZoom | undefined;
            orientation?: Orientation | undefined;
            "user-zoom"?: UserZoom | undefined;
            "viewport-fit"?: ViewportFit | undefined;
            width?: Width<TLength> | undefined;
            zoom?: Zoom | undefined;
        }
        export type ViewportFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<Viewport<TLength, TTime>>;
        export type ViewportHyphenFallback<TLength = (string & {}) | 0, TTime = string & {}> = Fallback<ViewportHyphen<TLength, TTime>>;
        type Range = "auto" | (string & {});
        type SpeakAs = "auto" | "bullets" | "numbers" | "spell-out" | "words" | (string & {});
        type System = "additive" | "alphabetic" | "cyclic" | "fixed" | "numeric" | "symbolic" | (string & {});
        type FontFeatureSettings = "normal" | (string & {});
        type AscentOverride = "normal" | (string & {});
        type DescentOverride = "normal" | (string & {});
        type FontDisplay = "auto" | "block" | "fallback" | "optional" | "swap";
        type FontStretch = DataType.FontStretchAbsolute | (string & {});
        type FontStyle = "italic" | "normal" | "oblique" | (string & {});
        type FontVariant = DataType.EastAsianVariantValues | "all-petite-caps" | "all-small-caps" | "common-ligatures" | "contextual" | "diagonal-fractions" | "discretionary-ligatures" | "full-width" | "historical-forms" | "historical-ligatures" | "lining-nums" | "no-common-ligatures" | "no-contextual" | "no-discretionary-ligatures" | "no-historical-ligatures" | "none" | "normal" | "oldstyle-nums" | "ordinal" | "petite-caps" | "proportional-nums" | "proportional-width" | "ruby" | "slashed-zero" | "small-caps" | "stacked-fractions" | "tabular-nums" | "titling-caps" | "unicase" | (string & {});
        type FontVariationSettings = "normal" | (string & {});
        type FontWeight = DataType.FontWeightAbsolute | (string & {});
        type LineGapOverride = "normal" | (string & {});
        type Bleed<TLength> = TLength | "auto";
        type Marks = "crop" | "cross" | "none" | (string & {});
        type Size<TLength> = DataType.PageSize | TLength | "auto" | "landscape" | "portrait" | (string & {});
        type Inherits = "false" | "true";
        type Height<TLength> = DataType.ViewportLength<TLength> | (string & {});
        type MaxHeight<TLength> = DataType.ViewportLength<TLength>;
        type MaxWidth<TLength> = DataType.ViewportLength<TLength>;
        type MaxZoom = "auto" | (string & {}) | (number & {});
        type MinHeight<TLength> = DataType.ViewportLength<TLength>;
        type MinWidth<TLength> = DataType.ViewportLength<TLength>;
        type MinZoom = "auto" | (string & {}) | (number & {});
        type Orientation = "auto" | "landscape" | "portrait";
        type UserZoom = "fixed" | "zoom";
        type ViewportFit = "auto" | "contain" | "cover";
        type Width<TLength> = DataType.ViewportLength<TLength> | (string & {});
        type Zoom = "auto" | (string & {}) | (number & {});
        export {};
    }
    namespace DataType {
        type AbsoluteSize = "large" | "medium" | "small" | "x-large" | "x-small" | "xx-large" | "xx-small" | "xxx-large";
        type AnimateableFeature = "contents" | "scroll-position" | (string & {});
        type Attachment = "fixed" | "local" | "scroll";
        type BgPosition<TLength> = TLength | "bottom" | "center" | "left" | "right" | "top" | (string & {});
        type BgSize<TLength> = TLength | "auto" | "contain" | "cover" | (string & {});
        type BlendMode = "color" | "color-burn" | "color-dodge" | "darken" | "difference" | "exclusion" | "hard-light" | "hue" | "lighten" | "luminosity" | "multiply" | "normal" | "overlay" | "saturation" | "screen" | "soft-light";
        type Box = "border-box" | "content-box" | "padding-box";
        type Color = NamedColor | DeprecatedSystemColor | "currentcolor" | (string & {});
        type CompatAuto = "button" | "checkbox" | "listbox" | "menulist" | "meter" | "progress-bar" | "push-button" | "radio" | "searchfield" | "slider-horizontal" | "square-button" | "textarea";
        type CompositeStyle = "clear" | "copy" | "destination-atop" | "destination-in" | "destination-out" | "destination-over" | "source-atop" | "source-in" | "source-out" | "source-over" | "xor";
        type CompositingOperator = "add" | "exclude" | "intersect" | "subtract";
        type ContentDistribution = "space-around" | "space-between" | "space-evenly" | "stretch";
        type ContentList = Quote | "contents" | (string & {});
        type ContentPosition = "center" | "end" | "flex-end" | "flex-start" | "start";
        type CubicBezierTimingFunction = "ease" | "ease-in" | "ease-in-out" | "ease-out" | (string & {});
        type Dasharray<TLength> = TLength | (string & {}) | (number & {});
        type DeprecatedSystemColor = "ActiveBorder" | "ActiveCaption" | "AppWorkspace" | "Background" | "ButtonFace" | "ButtonHighlight" | "ButtonShadow" | "ButtonText" | "CaptionText" | "GrayText" | "Highlight" | "HighlightText" | "InactiveBorder" | "InactiveCaption" | "InactiveCaptionText" | "InfoBackground" | "InfoText" | "Menu" | "MenuText" | "Scrollbar" | "ThreeDDarkShadow" | "ThreeDFace" | "ThreeDHighlight" | "ThreeDLightShadow" | "ThreeDShadow" | "Window" | "WindowFrame" | "WindowText";
        type DisplayInside = "-ms-flexbox" | "-ms-grid" | "-webkit-flex" | "flex" | "flow" | "flow-root" | "grid" | "ruby" | "table";
        type DisplayInternal = "ruby-base" | "ruby-base-container" | "ruby-text" | "ruby-text-container" | "table-caption" | "table-cell" | "table-column" | "table-column-group" | "table-footer-group" | "table-header-group" | "table-row" | "table-row-group";
        type DisplayLegacy = "-ms-inline-flexbox" | "-ms-inline-grid" | "-webkit-inline-flex" | "inline-block" | "inline-flex" | "inline-grid" | "inline-list-item" | "inline-table";
        type DisplayOutside = "block" | "inline" | "run-in";
        type EasingFunction = CubicBezierTimingFunction | StepTimingFunction | "linear";
        type EastAsianVariantValues = "jis04" | "jis78" | "jis83" | "jis90" | "simplified" | "traditional";
        type FinalBgLayer<TLength> = Color | BgPosition<TLength> | RepeatStyle | Attachment | Box | "none" | (string & {});
        type FontStretchAbsolute = "condensed" | "expanded" | "extra-condensed" | "extra-expanded" | "normal" | "semi-condensed" | "semi-expanded" | "ultra-condensed" | "ultra-expanded" | (string & {});
        type FontWeightAbsolute = "bold" | "normal" | (number & {}) | (string & {});
        type GenericFamily = "cursive" | "fantasy" | "monospace" | "sans-serif" | "serif";
        type GeometryBox = Box | "fill-box" | "margin-box" | "stroke-box" | "view-box";
        type GridLine = "auto" | (string & {}) | (number & {});
        type LineStyle = "dashed" | "dotted" | "double" | "groove" | "hidden" | "inset" | "none" | "outset" | "ridge" | "solid";
        type LineWidth<TLength> = TLength | "medium" | "thick" | "thin";
        type MaskLayer<TLength> = Position<TLength> | RepeatStyle | GeometryBox | CompositingOperator | MaskingMode | "no-clip" | "none" | (string & {});
        type MaskingMode = "alpha" | "luminance" | "match-source";
        type NamedColor = "aliceblue" | "antiquewhite" | "aqua" | "aquamarine" | "azure" | "beige" | "bisque" | "black" | "blanchedalmond" | "blue" | "blueviolet" | "brown" | "burlywood" | "cadetblue" | "chartreuse" | "chocolate" | "coral" | "cornflowerblue" | "cornsilk" | "crimson" | "cyan" | "darkblue" | "darkcyan" | "darkgoldenrod" | "darkgray" | "darkgreen" | "darkgrey" | "darkkhaki" | "darkmagenta" | "darkolivegreen" | "darkorange" | "darkorchid" | "darkred" | "darksalmon" | "darkseagreen" | "darkslateblue" | "darkslategray" | "darkslategrey" | "darkturquoise" | "darkviolet" | "deeppink" | "deepskyblue" | "dimgray" | "dimgrey" | "dodgerblue" | "firebrick" | "floralwhite" | "forestgreen" | "fuchsia" | "gainsboro" | "ghostwhite" | "gold" | "goldenrod" | "gray" | "green" | "greenyellow" | "grey" | "honeydew" | "hotpink" | "indianred" | "indigo" | "ivory" | "khaki" | "lavender" | "lavenderblush" | "lawngreen" | "lemonchiffon" | "lightblue" | "lightcoral" | "lightcyan" | "lightgoldenrodyellow" | "lightgray" | "lightgreen" | "lightgrey" | "lightpink" | "lightsalmon" | "lightseagreen" | "lightskyblue" | "lightslategray" | "lightslategrey" | "lightsteelblue" | "lightyellow" | "lime" | "limegreen" | "linen" | "magenta" | "maroon" | "mediumaquamarine" | "mediumblue" | "mediumorchid" | "mediumpurple" | "mediumseagreen" | "mediumslateblue" | "mediumspringgreen" | "mediumturquoise" | "mediumvioletred" | "midnightblue" | "mintcream" | "mistyrose" | "moccasin" | "navajowhite" | "navy" | "oldlace" | "olive" | "olivedrab" | "orange" | "orangered" | "orchid" | "palegoldenrod" | "palegreen" | "paleturquoise" | "palevioletred" | "papayawhip" | "peachpuff" | "peru" | "pink" | "plum" | "powderblue" | "purple" | "rebeccapurple" | "red" | "rosybrown" | "royalblue" | "saddlebrown" | "salmon" | "sandybrown" | "seagreen" | "seashell" | "sienna" | "silver" | "skyblue" | "slateblue" | "slategray" | "slategrey" | "snow" | "springgreen" | "steelblue" | "tan" | "teal" | "thistle" | "tomato" | "transparent" | "turquoise" | "violet" | "wheat" | "white" | "whitesmoke" | "yellow" | "yellowgreen";
        type PageSize = "A3" | "A4" | "A5" | "B4" | "B5" | "JIS-B4" | "JIS-B5" | "ledger" | "legal" | "letter";
        type Paint = Color | "child" | "context-fill" | "context-stroke" | "none" | (string & {});
        type Position<TLength> = TLength | "bottom" | "center" | "left" | "right" | "top" | (string & {});
        type Quote = "close-quote" | "no-close-quote" | "no-open-quote" | "open-quote";
        type RepeatStyle = "no-repeat" | "repeat" | "repeat-x" | "repeat-y" | "round" | "space" | (string & {});
        type SelfPosition = "center" | "end" | "flex-end" | "flex-start" | "self-end" | "self-start" | "start";
        type SingleAnimation<TTime> = EasingFunction | SingleAnimationDirection | SingleAnimationFillMode | TTime | "infinite" | "none" | "paused" | "running" | (string & {}) | (number & {});
        type SingleAnimationDirection = "alternate" | "alternate-reverse" | "normal" | "reverse";
        type SingleAnimationFillMode = "backwards" | "both" | "forwards" | "none";
        type SingleTransition<TTime> = EasingFunction | TTime | "all" | "none" | (string & {});
        type StepTimingFunction = "step-end" | "step-start" | (string & {});
        type TrackBreadth<TLength> = TLength | "auto" | "max-content" | "min-content" | (string & {});
        type ViewportLength<TLength> = TLength | "auto" | (string & {});
        type VisualBox = "border-box" | "content-box" | "padding-box";
    }
}
declare module "packages/style/src/types" {
    import * as CSS from "packages/style/src/csstype";
    export type TLength = number | string;
    export interface CSSProperties extends CSS.StandardPropertiesFallback<TLength>, CSS.SvgPropertiesFallback<TLength>, CSS.VendorPropertiesHyphenFallback<TLength>, CSS.ObsoletePropertiesFallback<TLength> {
        $unique?: boolean;
    }
    export interface FontFace extends CSS.AtRule.FontFace {
    }
    export type CSSClasses<K extends string> = Record<K, NestedCSSProperties>;
    export type CSSClassNames<K extends string> = Record<K, string>;
    export interface NestedCSSProperties extends CSSProperties {
        $nest?: NestedCSSSelectors;
        $debugName?: string;
    }
    export type MediaQuery = {
        type?: 'screen' | 'print' | 'all';
        orientation?: 'landscape' | 'portrait';
        minWidth?: number | string;
        maxWidth?: number | string;
        minHeight?: number | string;
        maxHeight?: number | string;
    };
    export type NestedCSSSelectors = {
        '&:active'?: NestedCSSProperties;
        '&:any'?: NestedCSSProperties;
        '&:checked'?: NestedCSSProperties;
        '&:default'?: NestedCSSProperties;
        '&:disabled'?: NestedCSSProperties;
        '&:empty'?: NestedCSSProperties;
        '&:enabled'?: NestedCSSProperties;
        '&:first'?: NestedCSSProperties;
        '&:first-child'?: NestedCSSProperties;
        '&:first-of-type'?: NestedCSSProperties;
        '&:fullscreen'?: NestedCSSProperties;
        '&:focus'?: NestedCSSProperties;
        '&:hover'?: NestedCSSProperties;
        '&:indeterminate'?: NestedCSSProperties;
        '&:in-range'?: NestedCSSProperties;
        '&:invalid'?: NestedCSSProperties;
        '&:last-child'?: NestedCSSProperties;
        '&:last-of-type'?: NestedCSSProperties;
        '&:left'?: NestedCSSProperties;
        '&:link'?: NestedCSSProperties;
        '&:only-child'?: NestedCSSProperties;
        '&:only-of-type'?: NestedCSSProperties;
        '&:optional'?: NestedCSSProperties;
        '&:out-of-range'?: NestedCSSProperties;
        '&:read-only'?: NestedCSSProperties;
        '&:read-write'?: NestedCSSProperties;
        '&:required'?: NestedCSSProperties;
        '&:right'?: NestedCSSProperties;
        '&:root'?: NestedCSSProperties;
        '&:scope'?: NestedCSSProperties;
        '&:target'?: NestedCSSProperties;
        '&:valid'?: NestedCSSProperties;
        '&:visited'?: NestedCSSProperties;
        '&::after'?: NestedCSSProperties;
        '&::before'?: NestedCSSProperties;
        '&::first-letter'?: NestedCSSProperties;
        '&::first-line'?: NestedCSSProperties;
        '&::selection'?: NestedCSSProperties;
        '&::backdrop'?: NestedCSSProperties;
        '&::placeholder'?: NestedCSSProperties;
        '&::marker'?: NestedCSSProperties;
        '&::spelling-error'?: NestedCSSProperties;
        '&::grammar-error'?: NestedCSSProperties;
        '&>*'?: NestedCSSProperties;
        '@media screen and (min-width: 700px)'?: NestedCSSProperties;
        '@media screen and (max-width: 700px)'?: NestedCSSProperties;
        [selector: string]: NestedCSSProperties | undefined;
    };
    export interface KeyFrames {
        $debugName?: string;
        [key: string]: CSSProperties | string | undefined;
    }
}
declare module "packages/style/src/formatting" {
    import * as types from "packages/style/src/types";
    import { Styles } from "packages/style/src/styles";
    export function convertToStyles(object: types.NestedCSSProperties): Styles;
    export function convertToKeyframes(frames: types.KeyFrames): Styles;
}
declare module "packages/style/src/utilities" {
    import { MediaQuery, NestedCSSProperties } from "packages/style/src/types";
    export const raf: (cb: () => void) => void;
    export function classes(...classes: (string | false | undefined | null | {
        [className: string]: any;
    })[]): string;
    export function extend(...objects: (NestedCSSProperties | undefined | null | false)[]): NestedCSSProperties;
    export const media: (mediaQuery: MediaQuery, ...objects: (NestedCSSProperties | undefined | null | false)[]) => NestedCSSProperties;
}
declare module "packages/style/src/typestyle" {
    import * as types from "packages/style/src/types";
    export type StylesTarget = {
        textContent: string | null;
    };
    export class TypeStyle {
        private _autoGenerateTag;
        private _freeStyle;
        private _pending;
        private _pendingRawChange;
        private _raw;
        private _tag?;
        private _lastFreeStyleChangeId;
        constructor({ autoGenerateTag }: {
            autoGenerateTag: boolean;
        });
        private _afterAllSync;
        private _getTag;
        private _styleUpdated;
        cssRaw: (mustBeValidCSS: string) => void;
        cssRule: (selector: string, ...objects: types.NestedCSSProperties[]) => void;
        forceRenderStyles: () => void;
        fontFace: (...fontFace: types.FontFace[]) => void;
        getStyles: () => string;
        keyframes: (frames: types.KeyFrames) => string;
        reinit: () => void;
        setStylesTarget: (tag: StylesTarget) => void;
        style(...objects: (types.NestedCSSProperties | undefined)[]): string;
        style(...objects: (types.NestedCSSProperties | null | false | undefined)[]): string;
        stylesheet: <Classes extends string>(classes: types.CSSClasses<Classes>) => { [ClassName in Classes]: string; };
    }
    export const typeStyle: TypeStyle;
}
declare module "packages/style/src/snippets" {
    export function rotate(degree: number): string;
}
declare module "packages/style/src/index" {
    export * as Theme from "packages/style/src/theme";
    export { Colors } from "packages/style/src/colors";
    export const cssRaw: (mustBeValidCSS: string) => void;
    export const cssRule: (selector: string, ...objects: import("packages/style/src/types").NestedCSSProperties[]) => void;
    export const fontFace: (...fontFace: import("packages/style/src/types").FontFace[]) => void;
    export { rotate } from "packages/style/src/snippets";
    export const keyframes: (frames: import("packages/style/src/types").KeyFrames) => string;
    export const style: {
        (...objects: (import("packages/style/src/types").NestedCSSProperties | undefined)[]): string;
        (...objects: (false | import("packages/style/src/types").NestedCSSProperties | null | undefined)[]): string;
    };
}
declare module "packages/base/src/observable" {
    export function isObservable(input: any): boolean;
    export interface ObserverOptions {
        path?: string;
        pathsOf?: string;
        pathFrom?: string;
    }
    export interface ObserverChange {
        type?: string;
        path?: string[];
        value?: any;
        oldValue?: any;
        object?: any;
    }
    export type ObserverCallback = (changes: ObserverChange[]) => void;
    export function Observe(target: any, callback?: ObserverCallback, options?: ObserverOptions): any;
    export function Unobserve(target: any, observer: ObserverCallback): void;
    export function ClearObservers(target: any): void;
    export function observable(propName?: string): (target: any, propertyName: string) => void;
    export function initObservables(target: any): void;
    export function Observables(target: any, propertyName?: string): any;
}
declare module "packages/base/src/component" {
    import { IDataSchema } from "packages/application/src/index";
    export interface IFont {
        name?: string;
        size?: string;
        color?: string;
        bold?: boolean;
        italic?: boolean;
        style?: FontStyle;
        transform?: TextTransform;
        underline?: boolean;
        weight?: number | string;
        shadow?: string;
    }
    export interface ISpace {
        top?: string | number;
        right?: string | number;
        bottom?: string | number;
        left?: string | number;
    }
    export type BorderSides = 'top' | 'right' | 'bottom' | 'left';
    export interface IStack {
        basis?: string;
        grow?: string;
        shrink?: string;
    }
    export type FontStyle = 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit';
    export type TextTransform = 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kana' | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset';
    export type WrapType = 'nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit';
    export type OverflowType = 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto' | 'initial' | 'inherit' | 'unset';
    export type CursorType = "auto" | "default" | "none" | "context-menu" | "help" | "pointer" | "progress" | "wait" | "cell" | "crosshair" | "text" | "vertical-text" | "alias" | "copy" | "move" | "no-drop" | "not-allowed" | "grab" | "grabbing" | "e-resize" | "n-resize" | "ne-resize" | "nw-resize" | "s-resize" | "se-resize" | "sw-resize" | "w-resize" | "ew-resize" | "ns-resize" | "nesw-resize" | "nwse-resize" | "col-resize" | "row-resize" | "all-scroll" | "zoom-in" | "zoom-out";
    export interface IOverflow {
        x?: OverflowType;
        y?: OverflowType;
    }
    export interface IAnchor {
        top?: boolean;
        right?: boolean;
        bottom?: boolean;
        left?: boolean;
    }
    export interface IBackground {
        color?: string;
        image?: string;
    }
    export const enum ComponentPropertyType {
        string = 1,
        number = 2,
        boolean = 3,
        object = 4,
        array = 5,
        event = 6
    }
    export interface ICustomEventParam {
        name: string;
        type: string;
        isControl?: boolean;
    }
    export const notifyEventParams: ICustomEventParam[];
    export interface ICustomProp {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array';
        values?: any[];
        default?: string | number | boolean | object;
    }
    export enum GroupType {
        'BASIC' = "Basic",
        'LAYOUT' = "Layout",
        'FIELDS' = "Fields"
    }
    export interface ICustomProperties {
        icon?: string;
        tagName?: string;
        className?: string;
        props: {
            [name: string]: ICustomProp;
        };
        events: {
            [name: string]: ICustomEventParam[];
        };
        dataSchema?: IDataSchema;
        group?: GroupType;
    }
    export const ComponentProperty: ICustomProperties;
    export class Component extends HTMLElement {
        protected connected: boolean;
        protected _parent: Component | undefined;
        protected _height: number | string;
        protected _top: number | string;
        protected _width: number | string;
        protected _left: number | string;
        protected _bottom: number | string;
        protected options: any;
        protected defaults: any;
        protected deferReadyCallback: boolean;
        protected _readyCallback: any[];
        initializing: boolean;
        initialized: boolean;
        protected attrs: any;
        protected _designProps: {
            [prop: string]: string | number | boolean | object;
        };
        private _propInfo;
        protected _uuid: string;
        constructor(parent?: Component, options?: any, defaults?: any);
        connectedCallback(): void;
        disconnectedCallback(): void;
        protected parseDesignPropValue(value: string): any;
        _getDesignPropValue(prop: string): string | number | boolean | object | any[];
        _setDesignPropValue(prop: string, value: string | number | boolean | object, breakpointProp?: any): void;
        _setDesignProps(props: {
            [prop: string]: string;
        }, breakpoint?: {
            [prop: string]: string;
        }): void;
        _getDesignProps(): {
            [prop: string]: string | number | boolean | object;
        };
        createElement(tagName: string, parentElm?: HTMLElement): HTMLElement;
        getAttributeValue(target: any, paths: string[], idx?: number): any;
        getAttribute(name: string, removeAfter?: boolean, defaultValue?: any): any;
        getPositionAttribute(name: string, removeAfter?: boolean, defaultValue?: any): number;
        getStyleAttribute(name: string, removeAfter?: boolean, defaultValue?: any): string;
        get uuid(): string;
        get id(): string;
        set id(value: string);
        ready(): Promise<void>;
        protected executeReadyCallback(): void;
        protected init(): void;
    }
}
declare module "packages/base/src/style/base.css" {
    import { BorderStylesSideType, IBorder, IBorderSideStyles, IOverflow, IBackground, IControlMediaQuery, DisplayType, IMediaQuery } from "@ijstech/components/base";
    export const disabledStyle: string;
    export const containerStyle: string;
    export const getBorderSideObj: (side: BorderStylesSideType, value: IBorderSideStyles) => any;
    export const getBorderSideStyleClass: (side: BorderStylesSideType, value: IBorderSideStyles) => string;
    export const getBorderStyleClass: (value: IBorder) => string;
    export const getOverflowStyleClass: (value: IOverflow) => string;
    export const getBackground: (value: IBackground) => {
        background: string;
    };
    export const getBackgroundStyleClass: (value: IBackground) => string;
    export const getSpacingValue: (value: string | number) => string | number;
    export const getMediaQueryRule: (mediaQuery: IMediaQuery<any>) => string | undefined;
    interface IProps {
        display?: DisplayType;
    }
    export const getControlMediaQueriesStyle: (mediaQueries: IControlMediaQuery[], props?: IProps | undefined) => any;
    export const getControlMediaQueriesStyleClass: (mediaQueries: IControlMediaQuery[], props: IProps) => string;
    export const getOpacityStyleClass: (opacity: number | string) => string;
}
declare module "packages/tooltip/src/style/tooltip.css" { }
declare module "packages/tooltip/src/tooltip" {
    import { Control } from "@ijstech/components/base";
    import "packages/tooltip/src/style/tooltip.css";
    type PlacementType = 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
    type TriggerType = 'hover' | 'click';
    export interface ITooltip {
        content?: string;
        popperClass?: string;
        color?: string;
        placement?: PlacementType;
        trigger?: TriggerType;
        maxWidth?: string;
    }
    export class Tooltip {
        private _content;
        private _popperClass;
        private _placement;
        private _color;
        private _maxWidth;
        private _trigger;
        private timeout;
        private tooltipElm;
        constructor(source: Control);
        private initData;
        private positionAt;
        get trigger(): TriggerType;
        set trigger(value: TriggerType);
        get popperClass(): string;
        set popperClass(value: string);
        get color(): string;
        set color(value: string);
        get content(): string;
        set content(value: string);
        get placement(): PlacementType;
        set placement(value: PlacementType);
        get maxWidth(): string;
        set maxWidth(value: string);
        private show;
        close(): void;
        private onHandleClick;
        private renderTooltip;
        private initEvents;
    }
}
declare module "packages/tooltip/src/index" {
    export { Tooltip, ITooltip } from "packages/tooltip/src/tooltip";
}
declare module "packages/base/src/control" {
    import { Component, IStack, IFont, ISpace, IOverflow, OverflowType, IAnchor, IBackground, ICustomProperties, CursorType } from "packages/base/src/component";
    import { notifyEventCallback, notifyMouseEventCallback, notifyKeyboardEventCallback, notifyGestureEventCallback } from "@ijstech/components/base";
    export type DockStyle = 'none' | 'bottom' | 'center' | 'fill' | 'left' | 'right' | 'top';
    export type LineHeightType = string | number | 'normal' | 'initial' | 'inherit';
    export type DisplayType = 'inline-block' | 'block' | 'inline-flex' | 'flex' | 'inline' | 'initial' | 'inherit' | 'none' | '-webkit-box' | 'grid' | 'inline-grid';
    export interface IMediaQuery<T> {
        minWidth?: string | number;
        maxWidth?: string | number;
        properties: T;
    }
    export type SpaceProps = 'margin' | 'padding';
    export class SpaceValue implements ISpace {
        private _value;
        private _prop;
        private _owner;
        constructor(owner: Control, value: ISpace, prop: SpaceProps);
        get left(): string | number | undefined;
        set left(value: string | number | undefined);
        get top(): string | number | undefined;
        set top(value: string | number | undefined);
        get right(): string | number | undefined;
        set right(value: string | number | undefined);
        get bottom(): string | number | undefined;
        set bottom(value: string | number | undefined);
        getSpacingValue(value: string | number): string;
        update(value?: ISpace): void;
    }
    export type PositionType = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | 'inherit' | 'initial';
    export type BorderStylesSideType = 'top' | 'right' | 'bottom' | 'left';
    export type BorderStyleType = 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
    export interface IBorderCornerStyles {
        radius?: string | number;
    }
    export interface IBorderSideStyles {
        width?: string | number;
        style?: BorderStyleType;
        color?: string;
    }
    export interface IBorder extends IBorderSideStyles, IBorderCornerStyles {
        top?: IBorderSideStyles;
        right?: IBorderSideStyles;
        bottom?: IBorderSideStyles;
        left?: IBorderSideStyles;
        topLeft?: IBorderCornerStyles;
        topRight?: IBorderCornerStyles;
        bottomLeft?: IBorderCornerStyles;
        bottomRight?: IBorderCornerStyles;
    }
    export class Border {
        private _target;
        private _styleClassMap;
        private _radius;
        private _width;
        private _style;
        private _color;
        private _top;
        private _right;
        private _bottom;
        private _left;
        private _topLeft;
        private _topRight;
        private _bottomLeft;
        private _bottomRight;
        constructor(target: Control, options?: IBorder);
        updateValue(options: IBorder): void;
        private isNumber;
        protected updateAllSidesProps(options: IBorder): void;
        private removeStyles;
        get radius(): string;
        set radius(value: string | number);
        get width(): string;
        set width(value: string | number);
        get style(): BorderStyleType;
        set style(value: BorderStyleType);
        get color(): string;
        set color(value: string);
        get top(): Readonly<IBorderSideStyles>;
        set top(value: IBorderSideStyles);
        get right(): Readonly<IBorderSideStyles>;
        set right(value: IBorderSideStyles);
        get bottom(): Readonly<IBorderSideStyles>;
        set bottom(value: IBorderSideStyles);
        get left(): Readonly<IBorderSideStyles>;
        set left(value: IBorderSideStyles);
        protected removeStyleClass(name: string): void;
        protected setSideBorderStyles(side: BorderStylesSideType, value?: IBorderSideStyles): void;
        protected setBorderStyles(value: IBorder): void;
        private setBorderProp;
    }
    export interface IGrid {
        column?: number;
        columnSpan?: number;
        row?: number;
        rowSpan?: number;
        horizontalAlignment?: "stretch" | "start" | "end" | "center";
        verticalAlignment?: "stretch" | "start" | "end" | "center";
        area?: string;
    }
    export class Overflow {
        private _target;
        private _value;
        private _style;
        constructor(target: Control, value?: IOverflow | OverflowType);
        get x(): OverflowType;
        set x(value: OverflowType);
        get y(): OverflowType;
        set y(value: OverflowType);
        private updateValue;
        setOverflowStyle(value?: IOverflow | OverflowType): void;
    }
    export class Background {
        private _target;
        private _value;
        private _style;
        constructor(target: Control, value?: IBackground);
        get color(): string;
        set color(value: string);
        get image(): string;
        set image(value: string);
        private updateValue;
        setBackgroundStyle(value?: IBackground): void;
    }
    export interface IControlMediaQueryProps {
        padding?: ISpace;
        margin?: ISpace;
        border?: IBorder;
        visible?: boolean;
        display?: DisplayType;
        background?: IBackground;
        grid?: IGrid;
        position?: PositionType;
        top?: number | string;
        left?: number | string;
        right?: number | string;
        bottom?: number | string;
        zIndex?: string | number;
        maxHeight?: string | number;
        maxWidth?: string | number;
        width?: number | string;
        height?: number | string;
        minWidth?: number | string;
        minHeight?: number | string;
        overflow?: IOverflow | OverflowType;
        font?: IFont;
        opacity?: string;
        stack?: IStack;
    }
    export type IControlMediaQuery = IMediaQuery<IControlMediaQueryProps>;
    export const ControlProperties: ICustomProperties;
    export interface IContextMenu {
        show(pos: {
            x: number;
            y: number;
        }): void;
    }
    export class Control extends Component {
        protected _controls: Control[];
        protected _enabled: boolean;
        protected _onClick: notifyMouseEventCallback;
        protected _onContextMenu: notifyMouseEventCallback;
        protected _onDblClick: notifyMouseEventCallback;
        protected _onFocus: notifyEventCallback;
        protected _onKeyDown: notifyKeyboardEventCallback;
        protected _onKeyUp: notifyKeyboardEventCallback;
        protected _onMouseDown: notifyGestureEventCallback;
        protected _onMouseMove: notifyGestureEventCallback;
        protected _onMouseUp: notifyGestureEventCallback;
        protected _visible: boolean;
        protected _margin: SpaceValue;
        protected _padding: SpaceValue;
        protected _stack: IStack;
        protected _grid: IGrid;
        protected _lineHeight: LineHeightType;
        protected _parent: Control | undefined;
        protected _dock: DockStyle;
        protected _linkTo: Control;
        protected _border: Border;
        protected _overflow: Overflow;
        protected _anchor: IAnchor;
        protected _background: Background;
        protected _resizer: ContainerResizer;
        private _tooltip;
        protected _font: IFont;
        protected _display: DisplayType;
        protected _cursor: CursorType;
        protected _letterSpacing: string | number;
        protected _boxShadow: string;
        private _cmediaQueries;
        protected _mediaStyle: string;
        protected _contextMenuId: string | null;
        protected _contextMenuControl: Control | null;
        private _opacity;
        protected _zIndex: string;
        protected _designMode: boolean;
        protected propertyClassMap: Record<string, string>;
        _container?: HTMLElement;
        tag: any;
        protected static create(options?: any, parent?: Container, defaults?: any): Promise<Control>;
        constructor(parent?: Control, options?: any, defaults?: any);
        _setDesignPropValue(prop: string, value: string | number | boolean | object, breakpointProp?: any): void;
        _getCustomProperties(): ICustomProperties;
        private getMarginStyle;
        private getPaddingStyle;
        protected xssSanitize(value: string): string;
        get contextMenu(): Control | null;
        set contextMenu(value: string | Control | null);
        get margin(): ISpace;
        set margin(value: ISpace);
        protected get marginStyle(): (side: BorderStylesSideType) => number;
        get padding(): ISpace;
        set padding(value: ISpace);
        protected get paddingStyle(): (side: BorderStylesSideType) => number;
        protected addChildControl(control: Control): void;
        protected removeChildControl(control: Control): void;
        get parent(): Control | undefined;
        set parent(value: Control | undefined);
        connectedCallback(): void;
        disconnectedCallback(): void;
        protected getParentHeight(): number;
        protected getParentWidth(): number;
        protected getParentOccupiedLeft(): number;
        protected getParentOccupiedRight(): number;
        protected getParentOccupiedBottom(): number;
        protected getParentOccupiedTop(): number;
        get dock(): DockStyle;
        set dock(value: DockStyle);
        get enabled(): boolean;
        set enabled(value: boolean);
        protected _handleClick(event: MouseEvent, stopPropagation?: boolean): boolean;
        protected _handleContextMenu(event: MouseEvent, stopPropagation?: boolean): boolean;
        protected _handleDblClick(event: MouseEvent, stopPropagation?: boolean): boolean;
        protected _handleFocus(event: Event, stopPropagation?: boolean): boolean;
        protected _handleKeyDown(event: KeyboardEvent, stopPropagation?: boolean): boolean | undefined;
        protected _handleKeyUp(event: KeyboardEvent, stopPropagation?: boolean): boolean | undefined;
        protected _handleMouseDown(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        protected _handleMouseMove(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        protected _handleMouseUp(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean | undefined;
        get maxWidth(): number | string;
        set maxWidth(value: number | string);
        get minWidth(): string | number;
        set minWidth(value: string | number);
        get designMode(): boolean;
        set designMode(value: boolean);
        observables(propName: string): any;
        get onClick(): notifyMouseEventCallback;
        set onClick(callback: notifyMouseEventCallback);
        get onContextMenu(): notifyMouseEventCallback;
        set onContextMenu(callback: notifyMouseEventCallback);
        get onDblClick(): notifyMouseEventCallback;
        set onDblClick(callback: notifyMouseEventCallback);
        get onMouseDown(): notifyGestureEventCallback;
        set onMouseDown(callback: notifyGestureEventCallback);
        get onMouseUp(): notifyGestureEventCallback;
        set onMouseUp(callback: notifyGestureEventCallback);
        clearInnerHTML(): void;
        refresh(): void;
        get resizable(): boolean;
        protected setProperty(propName: string, value: any): void;
        protected setAttributeToProperty<P extends keyof Control>(propertyName: P): void;
        protected init(): void;
        protected setElementPosition(elm: HTMLElement, prop: any, value: any): void;
        protected setPosition(prop: any, value: any): void;
        get height(): number | string;
        set height(value: number | string);
        get heightValue(): number;
        get left(): number | string;
        set left(value: number | string);
        set right(value: number | string);
        set bottom(value: number | string);
        get top(): number | string;
        set top(value: number | string);
        get visible(): boolean;
        set visible(value: boolean);
        get width(): number | string;
        set width(value: number | string);
        get widthValue(): number;
        get stack(): IStack;
        set stack(value: IStack);
        get grid(): IGrid;
        set grid(value: IGrid);
        get background(): Background;
        set background(value: IBackground);
        get zIndex(): string;
        set zIndex(value: string | number);
        get lineHeight(): LineHeightType;
        set lineHeight(value: LineHeightType);
        get linkTo(): Control;
        set linkTo(value: Control);
        get position(): PositionType;
        set position(value: PositionType);
        get maxHeight(): string | number;
        set maxHeight(value: string | number);
        get minHeight(): string | number;
        set minHeight(value: string | number);
        get border(): Border;
        set border(value: IBorder);
        get overflow(): Overflow;
        set overflow(value: OverflowType | IOverflow);
        get tooltip(): any;
        get font(): IFont;
        set font(value: IFont);
        get display(): DisplayType;
        set display(value: DisplayType);
        get anchor(): IAnchor;
        set anchor(value: IAnchor);
        get opacity(): string;
        set opacity(value: number | string);
        get cursor(): CursorType;
        set cursor(value: CursorType);
        get letterSpacing(): string | number;
        set letterSpacing(value: string | number);
        get boxShadow(): string;
        set boxShadow(value: string);
        get mediaQueries(): any[];
        set mediaQueries(value: any[]);
        protected removeStyle<P extends keyof Control>(propertyName: P): void;
        protected setStyle<P extends keyof Control>(propertyName: P, value: string): void;
    }
    export class ContainerResizer {
        private target;
        private _resizer;
        private _mouseDownPos;
        private _origWidth;
        private _origHeight;
        private _mouseDownHandler;
        private _mouseUpHandler;
        private _mouseMoveHandler;
        constructor(target: Container);
        reset(): void;
        private handleMouseDown;
        private handleMouseMove;
        private handleMouseUp;
        private get resizer();
    }
    export class Container extends Control {
        get controls(): Control[];
        get resizer(): boolean;
        set resizer(value: boolean);
        protected init(): void;
        protected refreshControls(): void;
        refresh(skipRefreshControls?: boolean): void;
    }
}
declare module "packages/base/src/types" {
    export interface INumberDictionary<TValue> {
        [id: number]: TValue;
    }
    export type Color = string;
}
/// <amd-module name="@ijstech/components/base" />
declare module "@ijstech/components/base" {
    export { Observe, Unobserve, ClearObservers, Observables, isObservable, observable } from "packages/base/src/observable";
    export { IFont, Component, BorderSides, ISpace, IStack, FontStyle, IOverflow, OverflowType, IBackground, TextTransform, ICustomEventParam } from "packages/base/src/component";
    export { IBorder, BorderStylesSideType, IBorderSideStyles, IMediaQuery, DisplayType, PositionType, Background, Border, SpaceValue, IControlMediaQueryProps, IControlMediaQuery, IContextMenu, Overflow } from "packages/base/src/control";
    import { IStack, IFont, ISpace, IOverflow, OverflowType, IAnchor, IBackground, ICustomProperties, CursorType } from "packages/base/src/component";
    import { Control, Container, DockStyle, LineHeightType, IBorder, IGrid, DisplayType, PositionType, IControlMediaQuery } from "packages/base/src/control";
    import { ITooltip } from "packages/tooltip/src/index";
    export { Control, Container };
    export * as Types from "packages/base/src/types";
    export { getControlMediaQueriesStyle, getBackground, getSpacingValue } from "packages/base/src/style/base.css";
    let LibPath: string;
    export { LibPath };
    export const RequireJS: {
        config(config: any): void;
        require(reqs: string[], callback: any): void;
        defined(module: string): boolean;
    };
    export type notifyEventCallback = (target: Control, event: Event) => void;
    export type notifyMouseEventCallback = (target: Control, event: MouseEvent) => void;
    export type notifyKeyboardEventCallback = (target: Control, event: KeyboardEvent) => void;
    export type notifyGestureEventCallback = (target: Control, event: PointerEvent | MouseEvent | TouchEvent) => void;
    export interface ControlElement {
        class?: string;
        contextMenu?: string;
        bottom?: number | string;
        dock?: DockStyle;
        enabled?: boolean;
        height?: number | string;
        id?: string;
        left?: number | string;
        maxWidth?: number | string;
        minWidth?: number | string;
        maxHeight?: number | string;
        minHeight?: number | string;
        right?: number | string;
        top?: number | string;
        visible?: boolean;
        width?: number | string;
        margin?: ISpace;
        padding?: ISpace;
        stack?: IStack;
        grid?: IGrid;
        background?: IBackground;
        lineHeight?: LineHeightType;
        zIndex?: string | number;
        position?: PositionType;
        linkTo?: Control;
        border?: IBorder;
        overflow?: IOverflow | OverflowType;
        font?: IFont;
        display?: DisplayType;
        tooltip?: ITooltip | string;
        anchor?: IAnchor;
        opacity?: number | string;
        tag?: any;
        cursor?: CursorType;
        letterSpacing?: string | number;
        boxShadow?: string;
        designMode?: boolean;
        mediaQueries?: IControlMediaQuery[];
        onClick?: notifyMouseEventCallback;
        onDblClick?: notifyMouseEventCallback;
        onContextMenu?: notifyMouseEventCallback;
    }
    export interface ContainerElement extends ControlElement {
        resizer?: boolean;
    }
    export function getCustomElementProperties(name: string): ICustomProperties | undefined;
    export function getCustomElements(): {
        [name: string]: ICustomProperties | undefined;
    };
    export function customElements(tagName: string, properties?: ICustomProperties): (constructor: CustomElementConstructor) => void;
    export function customModule(target: any): void;
    export function setAttributeToProperty<T extends Control>(element: T, propertyName: keyof T, defaultValue?: any): void;
}
declare module "packages/image/src/style/image.css" { }
declare module "packages/image/src/image" {
    import { Control, ControlElement, IBorder, Border } from "@ijstech/components/base";
    import "packages/image/src/style/image.css";
    type ObjectFitType = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    export interface ImageElement extends ControlElement {
        rotate?: number;
        url?: string;
        fallbackUrl?: string;
        objectFit?: ObjectFitType;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-image']: ImageElement;
            }
        }
    }
    export class Image extends Control {
        private imageElm;
        private _url;
        private _rotate;
        private _fallbackUrl;
        private _objectFit;
        private _borderValue;
        private _usedFallback;
        constructor(parent?: Control, options?: any);
        get fallbackUrl(): string;
        set fallbackUrl(value: string);
        get rotate(): number;
        set rotate(value: any);
        get url(): string;
        set url(value: string);
        get objectFit(): ObjectFitType;
        set objectFit(value: ObjectFitType);
        get border(): Border;
        set border(value: IBorder);
        protected init(): void;
        static create(options?: ImageElement, parent?: Control): Promise<Image>;
    }
}
declare module "packages/image/src/index" {
    export { Image, ImageElement } from "packages/image/src/image";
}
declare module "packages/icon/src/style/icon.css" { }
declare module "packages/icon/src/icon" {
    import { Control, ControlElement, Types } from "@ijstech/components/base";
    import { Image, ImageElement } from "packages/image/src/index";
    import "packages/icon/src/style/icon.css";
    export type IconName = "" | "ad" | "address-book" | "address-card" | "adjust" | "air-freshener" | "align-center" | "align-justify" | "align-left" | "align-right" | "allergies" | "ambulance" | "american-sign-language-interpreting" | "anchor" | "angle-double-down" | "angle-double-left" | "angle-double-right" | "angle-double-up" | "angle-down" | "angle-left" | "angle-right" | "angle-up" | "angry" | "ankh" | "apple-alt" | "archive" | "archway" | "arrow-alt-circle-down" | "arrow-alt-circle-left" | "arrow-alt-circle-right" | "arrow-alt-circle-up" | "arrow-circle-down" | "arrow-circle-left" | "arrow-circle-right" | "arrow-circle-up" | "arrow-down" | "arrow-left" | "arrow-right" | "arrow-up" | "arrows-alt" | "arrows-alt-h" | "arrows-alt-v" | "assistive-listening-systems" | "asterisk" | "at" | "atlas" | "atom" | "audio-description" | "award" | "baby" | "baby-carriage" | "backspace" | "backward" | "bacon" | "bacteria" | "bacterium" | "bahai" | "balance-scale" | "balance-scale-left" | "balance-scale-right" | "ban" | "band-aid" | "barcode" | "bars" | "baseball-ball" | "basketball-ball" | "bath" | "battery-empty" | "battery-full" | "battery-half" | "battery-quarter" | "battery-three-quarters" | "bed" | "beer" | "bell" | "bell-slash" | "bezier-curve" | "bible" | "bicycle" | "biking" | "binoculars" | "biohazard" | "birthday-cake" | "blender" | "blender-phone" | "blind" | "blog" | "bold" | "bolt" | "bomb" | "bone" | "bong" | "book" | "book-dead" | "book-medical" | "book-open" | "book-reader" | "bookmark" | "border-all" | "border-none" | "border-style" | "bowling-ball" | "box" | "box-open" | "box-tissue" | "boxes" | "braille" | "brain" | "bread-slice" | "briefcase" | "briefcase-medical" | "broadcast-tower" | "broom" | "brush" | "bug" | "building" | "bullhorn" | "bullseye" | "burn" | "bus" | "bus-alt" | "business-time" | "calculator" | "calendar" | "calendar-alt" | "calendar-check" | "calendar-day" | "calendar-minus" | "calendar-plus" | "calendar-times" | "calendar-week" | "camera" | "camera-retro" | "campground" | "candy-cane" | "cannabis" | "capsules" | "car" | "car-alt" | "car-battery" | "car-crash" | "car-side" | "caravan" | "caret-down" | "caret-left" | "caret-right" | "caret-square-down" | "caret-square-left" | "caret-square-right" | "caret-square-up" | "caret-up" | "carrot" | "cart-arrow-down" | "cart-plus" | "cash-register" | "cat" | "certificate" | "chair" | "chalkboard" | "chalkboard-teacher" | "charging-station" | "chart-area" | "chart-bar" | "chart-line" | "chart-pie" | "check" | "check-circle" | "check-double" | "check-square" | "cheese" | "chess" | "chess-bishop" | "chess-board" | "chess-king" | "chess-knight" | "chess-pawn" | "chess-queen" | "chess-rook" | "chevron-circle-down" | "chevron-circle-left" | "chevron-circle-right" | "chevron-circle-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevron-up" | "child" | "church" | "circle" | "circle-notch" | "city" | "clinic-medical" | "clipboard" | "clipboard-check" | "clipboard-list" | "clock" | "clone" | "closed-captioning" | "cloud" | "cloud-download-alt" | "cloud-meatball" | "cloud-moon" | "cloud-moon-rain" | "cloud-rain" | "cloud-showers-heavy" | "cloud-sun" | "cloud-sun-rain" | "cloud-upload-alt" | "cocktail" | "code" | "code-branch" | "coffee" | "cog" | "cogs" | "coins" | "columns" | "comment" | "comment-alt" | "comment-dollar" | "comment-dots" | "comment-medical" | "comment-slash" | "comments" | "comments-dollar" | "compact-disc" | "compass" | "compress" | "compress-alt" | "compress-arrows-alt" | "concierge-bell" | "cookie" | "cookie-bite" | "copy" | "copyright" | "couch" | "credit-card" | "crop" | "crop-alt" | "cross" | "crosshairs" | "crow" | "crown" | "crutch" | "cube" | "cubes" | "cut" | "database" | "deaf" | "democrat" | "desktop" | "dharmachakra" | "diagnoses" | "dice" | "dice-d20" | "dice-d6" | "dice-five" | "dice-four" | "dice-one" | "dice-six" | "dice-three" | "dice-two" | "digital-tachograph" | "directions" | "disease" | "divide" | "dizzy" | "dna" | "dog" | "dollar-sign" | "dolly" | "dolly-flatbed" | "donate" | "door-closed" | "door-open" | "dot-circle" | "dove" | "download" | "drafting-compass" | "dragon" | "draw-polygon" | "drum" | "drum-steelpan" | "drumstick-bite" | "dumbbell" | "dumpster" | "dumpster-fire" | "dungeon" | "edit" | "egg" | "eject" | "ellipsis-h" | "ellipsis-v" | "envelope" | "envelope-open" | "envelope-open-text" | "envelope-square" | "equals" | "eraser" | "ethernet" | "euro-sign" | "exchange-alt" | "exclamation" | "exclamation-circle" | "exclamation-triangle" | "expand" | "expand-alt" | "expand-arrows-alt" | "external-link-alt" | "external-link-square-alt" | "eye" | "eye-dropper" | "eye-slash" | "fan" | "fast-backward" | "fast-forward" | "faucet" | "fax" | "feather" | "feather-alt" | "female" | "fighter-jet" | "file" | "file-alt" | "file-archive" | "file-audio" | "file-code" | "file-contract" | "file-csv" | "file-download" | "file-excel" | "file-export" | "file-image" | "file-import" | "file-invoice" | "file-invoice-dollar" | "file-medical" | "file-medical-alt" | "file-pdf" | "file-powerpoint" | "file-prescription" | "file-signature" | "file-upload" | "file-video" | "file-word" | "fill" | "fill-drip" | "film" | "filter" | "fingerprint" | "fire" | "fire-alt" | "fire-extinguisher" | "first-aid" | "fish" | "fist-raised" | "flag" | "flag-checkered" | "flag-usa" | "flask" | "flushed" | "folder" | "folder-minus" | "folder-open" | "folder-plus" | "font" | "font-awesome-logo-full" | "football-ball" | "forward" | "frog" | "frown" | "frown-open" | "funnel-dollar" | "futbol" | "gamepad" | "gas-pump" | "gavel" | "gem" | "genderless" | "ghost" | "gift" | "gifts" | "glass-cheers" | "glass-martini" | "glass-martini-alt" | "glass-whiskey" | "glasses" | "globe" | "globe-africa" | "globe-americas" | "globe-asia" | "globe-europe" | "golf-ball" | "gopuram" | "graduation-cap" | "greater-than" | "greater-than-equal" | "grimace" | "grin" | "grin-alt" | "grin-beam" | "grin-beam-sweat" | "grin-hearts" | "grin-squint" | "grin-squint-tears" | "grin-stars" | "grin-tears" | "grin-tongue" | "grin-tongue-squint" | "grin-tongue-wink" | "grin-wink" | "grip-horizontal" | "grip-lines" | "grip-lines-vertical" | "grip-vertical" | "guitar" | "h-square" | "hamburger" | "hammer" | "hamsa" | "hand-holding" | "hand-holding-heart" | "hand-holding-medical" | "hand-holding-usd" | "hand-holding-water" | "hand-lizard" | "hand-middle-finger" | "hand-paper" | "hand-peace" | "hand-point-down" | "hand-point-left" | "hand-point-right" | "hand-point-up" | "hand-pointer" | "hand-rock" | "hand-scissors" | "hand-sparkles" | "hand-spock" | "hands" | "hands-helping" | "hands-wash" | "handshake" | "handshake-alt-slash" | "handshake-slash" | "hanukiah" | "hard-hat" | "hashtag" | "hat-cowboy" | "hat-cowboy-side" | "hat-wizard" | "hdd" | "head-side-cough" | "head-side-cough-slash" | "head-side-mask" | "head-side-virus" | "heading" | "headphones" | "headphones-alt" | "headset" | "heart" | "heart-broken" | "heartbeat" | "helicopter" | "highlighter" | "hiking" | "hippo" | "history" | "hockey-puck" | "holly-berry" | "home" | "horse" | "horse-head" | "hospital" | "hospital-alt" | "hospital-symbol" | "hospital-user" | "hot-tub" | "hotdog" | "hotel" | "hourglass" | "hourglass-end" | "hourglass-half" | "hourglass-start" | "house-damage" | "house-user" | "hryvnia" | "i-cursor" | "ice-cream" | "icicles" | "icons" | "id-badge" | "id-card" | "id-card-alt" | "igloo" | "image" | "images" | "inbox" | "indent" | "industry" | "infinity" | "info" | "info-circle" | "italic" | "jedi" | "joint" | "journal-whills" | "kaaba" | "key" | "keyboard" | "khanda" | "kiss" | "kiss-beam" | "kiss-wink-heart" | "kiwi-bird" | "landmark" | "language" | "laptop" | "laptop-code" | "laptop-house" | "laptop-medical" | "laugh" | "laugh-beam" | "laugh-squint" | "laugh-wink" | "layer-group" | "leaf" | "lemon" | "less-than" | "less-than-equal" | "level-down-alt" | "level-up-alt" | "life-ring" | "lightbulb" | "link" | "lira-sign" | "list" | "list-alt" | "list-ol" | "list-ul" | "location-arrow" | "lock" | "lock-open" | "long-arrow-alt-down" | "long-arrow-alt-left" | "long-arrow-alt-right" | "long-arrow-alt-up" | "low-vision" | "luggage-cart" | "lungs" | "lungs-virus" | "magic" | "magnet" | "mail-bulk" | "male" | "map" | "map-marked" | "map-marked-alt" | "map-marker" | "map-marker-alt" | "map-pin" | "map-signs" | "marker" | "mars" | "mars-double" | "mars-stroke" | "mars-stroke-h" | "mars-stroke-v" | "mask" | "medal" | "medkit" | "meh" | "meh-blank" | "meh-rolling-eyes" | "memory" | "menorah" | "mercury" | "meteor" | "microchip" | "microphone" | "microphone-alt" | "microphone-alt-slash" | "microphone-slash" | "microscope" | "minus" | "minus-circle" | "minus-square" | "mitten" | "mobile" | "mobile-alt" | "money-bill" | "money-bill-alt" | "money-bill-wave" | "money-bill-wave-alt" | "money-check" | "money-check-alt" | "monument" | "moon" | "mortar-pestle" | "mosque" | "motorcycle" | "mountain" | "mouse" | "mouse-pointer" | "mug-hot" | "music" | "network-wired" | "neuter" | "newspaper" | "not-equal" | "notes-medical" | "object-group" | "object-ungroup" | "oil-can" | "om" | "otter" | "outdent" | "pager" | "paint-brush" | "paint-roller" | "palette" | "pallet" | "paper-plane" | "paperclip" | "parachute-box" | "paragraph" | "parking" | "passport" | "pastafarianism" | "paste" | "pause" | "pause-circle" | "paw" | "peace" | "pen" | "pen-alt" | "pen-fancy" | "pen-nib" | "pen-square" | "pencil-alt" | "pencil-ruler" | "people-arrows" | "people-carry" | "pepper-hot" | "percent" | "percentage" | "person-booth" | "phone" | "phone-alt" | "phone-slash" | "phone-square" | "phone-square-alt" | "phone-volume" | "photo-video" | "piggy-bank" | "pills" | "pizza-slice" | "place-of-worship" | "plane" | "plane-arrival" | "plane-departure" | "plane-slash" | "play" | "play-circle" | "plug" | "plus" | "plus-circle" | "plus-square" | "podcast" | "poll" | "poll-h" | "poo" | "poo-storm" | "poop" | "portrait" | "pound-sign" | "power-off" | "pray" | "praying-hands" | "prescription" | "prescription-bottle" | "prescription-bottle-alt" | "print" | "procedures" | "project-diagram" | "pump-medical" | "pump-soap" | "puzzle-piece" | "qrcode" | "question" | "question-circle" | "quidditch" | "quote-left" | "quote-right" | "quran" | "radiation" | "radiation-alt" | "rainbow" | "random" | "receipt" | "record-vinyl" | "recycle" | "redo" | "redo-alt" | "registered" | "remove-format" | "reply" | "reply-all" | "republican" | "restroom" | "retweet" | "ribbon" | "ring" | "road" | "robot" | "rocket" | "route" | "rss" | "rss-square" | "ruble-sign" | "ruler" | "ruler-combined" | "ruler-horizontal" | "ruler-vertical" | "running" | "rupee-sign" | "sad-cry" | "sad-tear" | "satellite" | "satellite-dish" | "save" | "school" | "screwdriver" | "scroll" | "sd-card" | "search" | "search-dollar" | "search-location" | "search-minus" | "search-plus" | "seedling" | "server" | "shapes" | "share" | "share-alt" | "share-alt-square" | "share-square" | "shekel-sign" | "shield-alt" | "shield-virus" | "ship" | "shipping-fast" | "shoe-prints" | "shopping-bag" | "shopping-basket" | "shopping-cart" | "shower" | "shuttle-van" | "sign" | "sign-in-alt" | "sign-language" | "sign-out-alt" | "signal" | "signature" | "sim-card" | "sink" | "sitemap" | "skating" | "skiing" | "skiing-nordic" | "skull" | "skull-crossbones" | "slash" | "sleigh" | "sliders-h" | "smile" | "smile-beam" | "smile-wink" | "smog" | "smoking" | "smoking-ban" | "sms" | "snowboarding" | "snowflake" | "snowman" | "snowplow" | "soap" | "socks" | "solar-panel" | "sort" | "sort-alpha-down" | "sort-alpha-down-alt" | "sort-alpha-up" | "sort-alpha-up-alt" | "sort-amount-down" | "sort-amount-down-alt" | "sort-amount-up" | "sort-amount-up-alt" | "sort-down" | "sort-numeric-down" | "sort-numeric-down-alt" | "sort-numeric-up" | "sort-numeric-up-alt" | "sort-up" | "spa" | "space-shuttle" | "spell-check" | "spider" | "spinner" | "splotch" | "spray-can" | "square" | "square-full" | "square-root-alt" | "stamp" | "star" | "star-and-crescent" | "star-half" | "star-half-alt" | "star-of-david" | "star-of-life" | "step-backward" | "step-forward" | "stethoscope" | "sticky-note" | "stop" | "stop-circle" | "stopwatch" | "stopwatch-20" | "store" | "store-alt" | "store-alt-slash" | "store-slash" | "stream" | "street-view" | "strikethrough" | "stroopwafel" | "subscript" | "subway" | "suitcase" | "suitcase-rolling" | "sun" | "superscript" | "surprise" | "swatchbook" | "swimmer" | "swimming-pool" | "synagogue" | "sync" | "sync-alt" | "syringe" | "table" | "table-tennis" | "tablet" | "tablet-alt" | "tablets" | "tachometer-alt" | "tag" | "tags" | "tape" | "tasks" | "taxi" | "teeth" | "teeth-open" | "temperature-high" | "temperature-low" | "tenge" | "terminal" | "text-height" | "text-width" | "th" | "th-large" | "th-list" | "theater-masks" | "thermometer" | "thermometer-empty" | "thermometer-full" | "thermometer-half" | "thermometer-quarter" | "thermometer-three-quarters" | "thumbs-down" | "thumbs-up" | "thumbtack" | "ticket-alt" | "times" | "times-circle" | "tint" | "tint-slash" | "tired" | "toggle-off" | "toggle-on" | "toilet" | "toilet-paper" | "toilet-paper-slash" | "toolbox" | "tools" | "tooth" | "torah" | "torii-gate" | "tractor" | "trademark" | "traffic-light" | "trailer" | "train" | "tram" | "transgender" | "transgender-alt" | "trash" | "trash-alt" | "trash-restore" | "trash-restore-alt" | "tree" | "trophy" | "truck" | "truck-loading" | "truck-monster" | "truck-moving" | "truck-pickup" | "tshirt" | "tty" | "tv" | "umbrella" | "umbrella-beach" | "underline" | "undo" | "undo-alt" | "universal-access" | "university" | "unlink" | "unlock" | "unlock-alt" | "upload" | "user" | "user-alt" | "user-alt-slash" | "user-astronaut" | "user-check" | "user-circle" | "user-clock" | "user-cog" | "user-edit" | "user-friends" | "user-graduate" | "user-injured" | "user-lock" | "user-md" | "user-minus" | "user-ninja" | "user-nurse" | "user-plus" | "user-secret" | "user-shield" | "user-slash" | "user-tag" | "user-tie" | "user-times" | "users" | "users-cog" | "users-slash" | "utensil-spoon" | "utensils" | "vector-square" | "venus" | "venus-double" | "venus-mars" | "vest" | "vest-patches" | "vial" | "vials" | "video" | "video-slash" | "vihara" | "virus" | "virus-slash" | "viruses" | "voicemail" | "volleyball-ball" | "volume-down" | "volume-mute" | "volume-off" | "volume-up" | "vote-yea" | "vr-cardboard" | "walking" | "wallet" | "warehouse" | "water" | "wave-square" | "weight" | "weight-hanging" | "wheelchair" | "wifi" | "wind" | "window-close" | "window-maximize" | "window-minimize" | "window-restore" | "wine-bottle" | "wine-glass" | "wine-glass-alt" | "won-sign" | "wrench" | "x-ray" | "yen-sign" | "yin-yang";
    export interface IconElement extends ControlElement {
        name?: IconName;
        fill?: Types.Color;
        image?: ImageElement;
        spin?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-icon']: IconElement;
            }
        }
    }
    export class Icon extends Control {
        private svgElm;
        private _name;
        private _size;
        private _image;
        private _spin;
        private _fill;
        constructor(parent?: Control, options?: any);
        protected init(): void;
        get fill(): Types.Color;
        set fill(color: Types.Color);
        get name(): IconName;
        set name(value: IconName);
        get image(): Image;
        set image(image: Image);
        get spin(): boolean;
        set spin(value: boolean);
        private _updateIcon;
        static create(options?: IconElement, parent?: Control): Promise<Icon>;
    }
}
declare module "packages/icon/src/index" {
    export { IconName, Icon, IconElement } from "packages/icon/src/icon";
}
declare module "packages/modal/src/style/modal.css" {
    import { IModalMediaQuery } from "packages/modal/src/modal";
    export const getOverlayStyle: () => string;
    export const getWrapperStyle: () => string;
    export const getNoBackdropStyle: () => string;
    export const getFixedWrapperStyle: (paddingLeft: string, paddingTop: string) => string;
    export const getAbsoluteWrapperStyle: (left: string, top: string) => string;
    export const getModalStyle: (left: string, top: string) => string;
    export const modalStyle: string;
    export const getBodyStyle: string;
    export const titleStyle: string;
    export const getModalMediaQueriesStyleClass: (mediaQueries: IModalMediaQuery[]) => string;
}
declare module "packages/modal/src/modal" {
    import { Control, ControlElement, Container, IBackground, IBorder, Background, Border, IMediaQuery, IControlMediaQueryProps, ISpace, Overflow, IOverflow, OverflowType } from "@ijstech/components/base";
    import { Icon, IconElement } from "packages/icon/src/index";
    export type modalPopupPlacementType = 'center' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'top' | 'topLeft' | 'topRight' | 'rightTop' | 'left' | 'right';
    type eventCallback = (target: Control) => void;
    type ModalPositionType = "fixed" | "absolute";
    export interface IModalMediaQueryProps extends IControlMediaQueryProps {
        showBackdrop?: boolean;
        popupPlacement?: 'center' | 'bottom' | 'top';
        position?: ModalPositionType;
    }
    export type IModalMediaQuery = IMediaQuery<IModalMediaQueryProps>;
    export interface ModalElement extends ControlElement {
        title?: string;
        showBackdrop?: boolean;
        closeIcon?: IconElement;
        popupPlacement?: modalPopupPlacementType;
        closeOnBackdropClick?: boolean;
        isChildFixed?: boolean;
        closeOnScrollChildFixed?: boolean;
        item?: Control;
        mediaQueries?: IModalMediaQuery[];
        onOpen?: eventCallback;
        onClose?: eventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-modal']: ModalElement;
            }
        }
    }
    export class Modal extends Container {
        protected _visible: boolean;
        private wrapperDiv;
        private titleSpan;
        private modalDiv;
        private bodyDiv;
        private overlayDiv;
        private _closeIcon;
        private _placement;
        private _closeOnBackdropClick;
        private _showBackdrop;
        private _wrapperPositionAt;
        private _isChildFixed;
        private _closeOnScrollChildFixed;
        private _mediaQueries;
        private hasInitializedChildFixed;
        private mapScrollTop;
        private insideClick;
        private boundHandleModalMouseDown;
        private boundHandleModalMouseUp;
        protected _onOpen: eventCallback;
        onClose: eventCallback;
        constructor(parent?: Control, options?: any);
        get visible(): boolean;
        set visible(value: boolean);
        get onOpen(): any;
        set onOpen(callback: any);
        get title(): string;
        set title(value: string);
        get popupPlacement(): modalPopupPlacementType;
        set popupPlacement(value: modalPopupPlacementType);
        get closeIcon(): Icon | null;
        set closeIcon(elm: Icon | null);
        get closeOnBackdropClick(): boolean;
        set closeOnBackdropClick(value: boolean);
        get showBackdrop(): boolean;
        set showBackdrop(value: boolean);
        private updateNoBackdropMd;
        get item(): Control;
        set item(value: Control);
        get body(): Control;
        set body(value: Control);
        get position(): ModalPositionType;
        set position(value: ModalPositionType);
        get isChildFixed(): boolean;
        set isChildFixed(value: boolean);
        get closeOnScrollChildFixed(): boolean;
        set closeOnScrollChildFixed(value: boolean);
        get mediaQueries(): IModalMediaQuery[];
        set mediaQueries(value: IModalMediaQuery[]);
        private setChildFixed;
        private positionAtChildFixed;
        private getWrapperParent;
        private positionAt;
        private positionAtFix;
        private positionAtAbsolute;
        private getWrapperFixCoords;
        private getWrapperOffsets;
        private getWrapperAbsoluteCoords;
        protected _handleOnShow(event: Event): void;
        private handleModalMouseDown;
        private handleModalMouseUp;
        private setInsideClick;
        private updateModal;
        refresh(): void;
        get background(): Background;
        set background(value: IBackground);
        get width(): number | string;
        set width(value: number | string);
        get height(): number | string;
        set height(value: number | string);
        get border(): Border;
        set border(value: IBorder);
        get padding(): ISpace;
        set padding(value: ISpace);
        get boxShadow(): string;
        set boxShadow(value: string);
        get overflow(): Overflow;
        set overflow(value: OverflowType | IOverflow);
        protected removeTargetStyle(target: HTMLElement, propertyName: string): void;
        protected setTargetStyle(target: HTMLElement, propertyName: string, value: string): void;
        protected init(): void;
        static create(options?: ModalElement, parent?: Container): Promise<Modal>;
    }
}
declare module "packages/modal/src/index" {
    export { Modal, ModalElement, modalPopupPlacementType } from "packages/modal/src/modal";
}
declare module "packages/module/src/module" {
    import { Container, ContainerElement } from "@ijstech/components/base";
    import { IconElement } from "packages/icon/src/index";
    import { Modal, ModalElement } from "packages/modal/src/index";
    export interface ModuleElement extends ContainerElement {
        caption?: string;
    }
    global {
        var Render: any;
        namespace JSX {
            interface IntrinsicElements {
                ['i-module']: ModuleElement;
            }
        }
    }
    export interface IOpenModalOptions {
        title?: string;
        showBackdrop?: boolean;
        closeIcon?: IconElement;
        width?: number | string;
        zIndex?: number;
    }
    export class Module extends Container {
        private $renderElms;
        private $render;
        private modulesUrlRegex;
        private static _modalMap;
        currentModuleDir: string;
        static create(options?: ModuleElement, parent?: Container, defaults?: ModuleElement): Promise<Module>;
        constructor(parent?: Container, options?: any, defaults?: any);
        init(): void;
        flattenArray(arr: any[]): any;
        _render(...params: any[]): HTMLElement;
        render(): void;
        onLoad(): void;
        onShow(options?: any): void;
        onHide(): void;
        disconnectedCallback(): void;
        openModal(options?: ModalElement): Modal;
        closeModal(): void;
    }
}
declare module "packages/module/src/index" {
    export { Module, ModuleElement, IOpenModalOptions } from "packages/module/src/module";
}
declare module "packages/application/src/event-bus" {
    export interface Registry {
        unregister: () => void;
    }
    export interface Callable {
        [key: string]: Function;
    }
    export interface Subscriber {
        [key: string]: Callable;
    }
    export interface IEventBus {
        dispatch<T>(event: string, arg?: T): void;
        register(sender: any, event: string, callback: Function): Registry;
    }
    export class EventBus implements IEventBus {
        private subscribers;
        private static nextId;
        private static instance?;
        private constructor();
        static getInstance(): EventBus;
        dispatch<T>(event: string, arg?: T): void;
        register(sender: any, event: string, callback: Function): Registry;
        private getNextId;
    }
}
declare module "packages/checkbox/src/style/checkbox.css" { }
declare module "packages/checkbox/src/checkbox" {
    import { ControlElement, Control, notifyEventCallback } from "@ijstech/components/base";
    import "packages/checkbox/src/style/checkbox.css";
    export interface CheckboxElement extends ControlElement {
        checked?: boolean;
        indeterminate?: boolean;
        caption?: string;
        captionWidth?: number | string;
        readOnly?: boolean;
        onChanged?: notifyEventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-checkbox']: CheckboxElement;
            }
        }
    }
    export class Checkbox extends Control {
        private _caption;
        private _captionWidth;
        private _indeterminate;
        private _checked;
        private _readOnly;
        private wrapperElm;
        private inputSpanElm;
        private captionSpanElm;
        private inputElm;
        private checkmarklElm;
        onChanged: notifyEventCallback;
        constructor(parent?: Control, options?: any);
        get caption(): string;
        set caption(value: string);
        get captionWidth(): number | string;
        set captionWidth(value: number | string);
        get height(): number;
        set height(value: number | string);
        get indeterminate(): boolean;
        set indeterminate(value: boolean);
        get checked(): boolean;
        set checked(value: boolean);
        get value(): any;
        set value(data: any);
        get readOnly(): boolean;
        set readOnly(value: boolean);
        private _handleChange;
        private addClass;
        protected init(): void;
        static create(options?: CheckboxElement, parent?: Control): Promise<Checkbox>;
    }
}
declare module "packages/checkbox/src/index" {
    export { Checkbox, CheckboxElement } from "packages/checkbox/src/checkbox";
}
declare module "packages/application/src/globalEvent" {
    export class GlobalEvents {
        _leftMouseButtonDown: boolean;
        private _initialTouchPos;
        constructor();
        abortEvent(event: Event): void;
        private _handleClick;
        private _handleMouseDown;
        private _handleMouseMove;
        private _handleMouseUp;
        private _handleDblClick;
        private _handleKeyDown;
        private _handleKeyUp;
        private _handleContextMenu;
        private _handleChange;
        private _handleMouseWheel;
        private _handleFocus;
        private _handleBlur;
        private bindEvents;
    }
}
declare module "packages/application/src/styles/index.css" {
    export const applicationStyle: string;
}
declare module "packages/ipfs/src/types" {
    export enum CidCode {
        DAG_PB = 112,
        RAW = 85
    }
    export interface ICidData {
        cid: string;
        links?: ICidInfo[];
        name?: string;
        size: number;
        type?: 'dir' | 'file';
        code?: CidCode;
        multihash?: any;
        bytes?: Uint8Array;
    }
    export interface ICidInfo {
        cid: string;
        links?: ICidInfo[];
        name?: string;
        size: number;
        type?: 'dir' | 'file';
    }
}
declare module "packages/ipfs/src/utils" {
    import { ICidData, ICidInfo } from "packages/ipfs/src/types";
    export function parse(cid: string, bytes?: Uint8Array): ICidData;
    export interface IHashChunk {
        size: number;
        dataSize: number;
        cid: {
            toString: () => string;
        };
    }
    export function hashChunk(data: Buffer, version?: number): Promise<IHashChunk>;
    export function hashChunks(chunks: IHashChunk[] | ICidInfo[], version?: number): Promise<ICidData>;
    export function hashItems(items?: ICidInfo[], version?: number): Promise<ICidData>;
    export function hashContent(content: string | Uint8Array, version?: number): Promise<ICidData>;
    export function hashFile(file: File | Uint8Array, version?: number): Promise<ICidData>;
    export function cidToHash(cid: string): string;
}
declare module "packages/ipfs/src/fileManager" {
    import { ICidData, ICidInfo } from "packages/ipfs/src/types";
    export interface ISignature {
        pubKey: string;
        timestamp: number;
        sig: string;
    }
    export interface ISignerData {
        action: string;
        timestamp: number;
        data?: any;
    }
    export interface ISigner {
        sign(data: ISignerData, schema: object): Promise<ISignature>;
    }
    interface IFileManagerOptions {
        transport?: IFileManagerTransport;
        endpoint?: string;
        signer?: ISigner;
        rootCid?: string;
    }
    export interface IUploadEndpoints {
        [cid: string]: {
            exists?: boolean;
            url: string;
            method?: string;
            headers?: {
                [key: string]: string;
            };
        };
    }
    export type IGetUploadUrlResult = {
        success: true;
        data: IUploadEndpoints;
    };
    export interface IRootInfo {
        success: boolean;
        data: {
            cid: string;
            used: number;
            quota: number;
        };
    }
    export interface IResult {
        success: boolean;
        data?: any;
    }
    export interface IFileManagerTransport {
        applyUpdate(node: FileNode): Promise<IResult>;
        getCidInfo(cid: string): Promise<ICidInfo | undefined>;
        getRoot(): Promise<IRootInfo>;
        getUploadUrl(cidInfo: ICidInfo): Promise<IGetUploadUrlResult | undefined>;
    }
    export interface IFileManagerTransporterOptions {
        endpoint?: string;
        signer?: ISigner;
    }
    export class FileManagerHttpTransport implements IFileManagerTransport {
        private options;
        private updated;
        constructor(options?: IFileManagerTransporterOptions);
        applyUpdate(node: FileNode): Promise<IResult>;
        getCidInfo(cid: string): Promise<ICidInfo | undefined>;
        getRoot(): Promise<IRootInfo>;
        getUploadUrl(cidInfo: ICidInfo, isRoot?: boolean): Promise<IGetUploadUrlResult | undefined>;
    }
    export class FileNode {
        private _name;
        private _parent;
        protected _items: FileNode[];
        private _cidInfo;
        private _isFile;
        private _isFolder;
        private _file;
        private _fileContent;
        private _isModified;
        private _owner;
        isRoot: boolean;
        constructor(owner: FileManager, name: string, parent?: FileNode, cidInfo?: ICidData);
        get cid(): string;
        checkCid(): Promise<void>;
        get fullPath(): string;
        get isModified(): boolean;
        modified(value?: boolean): false | undefined;
        get name(): string;
        set name(value: string);
        get parent(): FileNode;
        set parent(value: FileNode);
        itemCount(): Promise<number>;
        items(index: number): Promise<FileNode>;
        addFile(name: string, file: File): Promise<FileNode>;
        addFileContent(name: string, content: Uint8Array | string): Promise<FileNode>;
        addItem(item: FileNode): Promise<void>;
        removeItem(item: FileNode): void;
        findItem(name: string): Promise<FileNode | undefined>;
        get cidInfo(): ICidData | undefined;
        isFile(): Promise<boolean>;
        isFolder(): Promise<boolean>;
        get file(): File | undefined;
        set file(value: File | undefined);
        get fileContent(): string | Uint8Array | undefined;
        set fileContent(value: string | Uint8Array | undefined);
        hash(): Promise<ICidData | undefined>;
    }
    export class FileManager {
        private transporter;
        private rootNode;
        private options;
        quota: number;
        used: number;
        constructor(options?: IFileManagerOptions);
        addFileTo(folder: FileNode, filePath: string, file: File | Uint8Array): Promise<FileNode>;
        addFile(filePath: string, file: File): Promise<FileNode | undefined>;
        addFileContent(filePath: string, content: Uint8Array | string): Promise<FileNode | undefined>;
        getCidInfo(cid: string): Promise<ICidInfo | undefined>;
        private updateNode;
        applyUpdates(): Promise<FileNode | undefined>;
        delete(fileNode: FileNode): void;
        addFolder(folder: FileNode, name: string): Promise<FileNode>;
        updateFolderName(fileNode: FileNode, newName: string): Promise<void>;
        getFileNode(path: string): Promise<FileNode | undefined>;
        getRootNode(): Promise<FileNode | undefined>;
        reset(): void;
        setRootCid(cid: string): Promise<FileNode | undefined>;
        move(fileNode: FileNode, newParent: FileNode): void;
    }
}
declare module "packages/ipfs/src/index" {
    import { ICidInfo } from "packages/ipfs/src/types";
    export { CidCode, ICidData, ICidInfo } from "packages/ipfs/src/types";
    export { cidToHash, hashContent, hashFile, hashItems, parse } from "packages/ipfs/src/utils";
    export { FileManager, FileManagerHttpTransport, IFileManagerTransport, IFileManagerTransporterOptions, ISigner, ISignerData, ISignature, FileNode, IGetUploadUrlResult } from "packages/ipfs/src/fileManager";
    export interface IFile extends File {
        path?: string;
        cid?: {
            cid: string;
            size: number;
        };
    }
    export function hashFiles(files: IFile[], version?: number): Promise<ICidInfo>;
    export function cidToSri(cid: string): Promise<string>;
}
declare module "packages/link/src/style/link.css" { }
declare module "packages/link/src/link" {
    import { Control, ControlElement } from "@ijstech/components/base";
    import "packages/link/src/style/link.css";
    type TagertType = '_self' | '_blank' | '_parent' | '_top';
    export interface LinkElement extends ControlElement {
        href?: string;
        target?: TagertType;
    }
    export class Link extends Control {
        private _href;
        private _target;
        private _linkElm;
        constructor(parent?: Control, options?: any);
        get href(): string;
        set href(value: string);
        get target(): TagertType;
        set target(value: TagertType);
        append(children: Control | HTMLElement): void;
        _handleClick(event: MouseEvent, stopPropagation?: boolean): boolean;
        protected addChildControl(control: Control): void;
        protected removeChildControl(control: Control): void;
        protected init(): void;
        static create(options?: LinkElement, parent?: Control): Promise<Link>;
    }
}
declare module "packages/link/src/index" {
    export { Link, LinkElement } from "packages/link/src/link";
}
declare module "packages/text/src/style/text.css" { }
declare module "packages/text/src/text" {
    import { Control, ControlElement, DisplayType } from "@ijstech/components/base";
    import "packages/text/src/style/text.css";
    type WordBreakType = 'normal' | 'break-all' | 'keep-all' | 'break-word' | 'inherit' | 'initial' | 'revert' | 'unset';
    type OverflowWrapType = 'normal' | 'break-word' | 'anywhere' | 'inherit' | 'initial' | 'revert' | 'unset';
    export type TextOverflowType = 'clip' | 'ellipsis' | 'initial' | 'inherit';
    export interface TextElement extends ControlElement {
        wordBreak?: WordBreakType;
        overflowWrap?: OverflowWrapType;
        textOverflow?: TextOverflowType;
        lineClamp?: number;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-text']: TextElement;
            }
        }
    }
    export class Text extends Control {
        constructor(parent?: Control, options?: any);
        get wordBreak(): WordBreakType;
        set wordBreak(value: WordBreakType);
        get overflowWrap(): OverflowWrapType;
        set overflowWrap(value: OverflowWrapType);
        get textOverflow(): TextOverflowType;
        set textOverflow(value: TextOverflowType);
        get lineClamp(): number;
        set lineClamp(value: number);
        get display(): DisplayType;
        set display(value: DisplayType);
        protected init(): void;
        static create(options?: TextElement, parent?: Control): Promise<Text>;
    }
}
declare module "packages/text/src/index" {
    export { Text, TextElement, TextOverflowType } from "packages/text/src/text";
}
declare module "packages/label/src/style/label.css" { }
declare module "packages/label/src/label" {
    import { Control } from "@ijstech/components/base";
    import { Link, LinkElement } from "packages/link/src/index";
    import { Text, TextElement } from "packages/text/src/index";
    import "packages/label/src/style/label.css";
    export interface LabelElement extends TextElement {
        caption?: string;
        link?: LinkElement;
        textDecoration?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-label']: LabelElement;
            }
        }
    }
    export class Label extends Text {
        private captionSpan;
        private _link;
        constructor(parent?: Control, options?: any);
        get caption(): string;
        set caption(value: string);
        get link(): Link;
        set link(value: Link);
        set height(value: number);
        set width(value: number);
        get textDecoration(): string;
        set textDecoration(value: string);
        protected init(): void;
        static create(options?: LabelElement, parent?: Control): Promise<Label>;
    }
}
declare module "packages/label/src/index" {
    export { Label, LabelElement } from "packages/label/src/label";
}
declare module "packages/layout/src/interfaces" {
    export interface IHover {
        opacity?: number;
        backgroundColor?: string;
        fontColor?: string;
    }
}
declare module "packages/layout/src/style/panel.css" {
    import { IGridLayoutMediaQuery, IStackMediaQuery, StackDirectionType } from "packages/layout/src/index";
    import { IHover } from "packages/layout/src/interfaces";
    export const panelStyle: string;
    export const overflowStyle: string;
    export const vStackStyle: string;
    export const hStackStyle: string;
    export const gridStyle: string;
    export const getStackDirectionStyleClass: (direction: StackDirectionType, reverse: boolean) => string;
    export const getStackMediaQueriesStyleClass: (mediaQueries: IStackMediaQuery[], currentDirection: StackDirectionType) => string;
    export const justifyContentStartStyle: string;
    export const justifyContentCenterStyle: string;
    export const justifyContentEndStyle: string;
    export const justifyContentSpaceBetweenStyle: string;
    export const justifyContentSpaceAroundStyle: string;
    export const justifyContentSpaceEvenlyStyle: string;
    export const alignItemsStretchStyle: string;
    export const alignItemsBaselineStyle: string;
    export const alignItemsStartStyle: string;
    export const alignItemsCenterStyle: string;
    export const alignItemsEndStyle: string;
    export const alignSelfAutoStyle: string;
    export const alignSelfStretchStyle: string;
    export const alignSelfStartStyle: string;
    export const alignSelfCenterStyle: string;
    export const alignSelfEndStyle: string;
    export const alignContentSpaceBetweenStyle: string;
    export const alignContentSpaceAroundStyle: string;
    export const alignContentStretchStyle: string;
    export const alignContentStartStyle: string;
    export const alignContentCenterStyle: string;
    export const alignContentEndStyle: string;
    export const getTemplateColumnsStyleClass: (columns: string[]) => string;
    export const getTemplateRowsStyleClass: (rows: string[]) => string;
    export const getTemplateAreasStyleClass: (templateAreas: string[][]) => string;
    export const getGridLayoutMediaQueriesStyleClass: (mediaQueries: IGridLayoutMediaQuery[]) => string;
    export const getHoverStyleClass: (hover: IHover) => string;
}
declare module "packages/layout/src/stack" {
    import { Container, ContainerElement, IMediaQuery, IControlMediaQueryProps } from "@ijstech/components/base";
    import { IHover } from "packages/layout/src/interfaces";
    export interface IStackMediaQueryProps extends IControlMediaQueryProps {
        direction?: StackDirectionType;
        gap?: number | string;
        justifyContent?: StackJustifyContentType;
        alignItems?: StackAlignItemsType;
        alignSelf?: StackAlignSelfType;
        reverse?: boolean;
    }
    export type IStackMediaQuery = IMediaQuery<IStackMediaQueryProps>;
    export type StackWrapType = 'nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit';
    export type StackDirectionType = 'horizontal' | 'vertical';
    export type StackJustifyContentType = "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
    export type StackAlignItemsType = "stretch" | "start" | "center" | "end" | "baseline";
    export type StackAlignSelfType = "auto" | "stretch" | "start" | "center" | "end";
    export type StackAlignContentType = "stretch" | "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
    export interface StackLayoutElement extends ContainerElement {
        gap?: number | string;
        wrap?: StackWrapType;
        direction?: StackDirectionType;
        justifyContent?: StackJustifyContentType;
        alignItems?: StackAlignItemsType;
        alignSelf?: StackAlignSelfType;
        alignContent?: StackAlignSelfType;
        reverse?: boolean;
        mediaQueries?: IStackMediaQuery[];
        hover?: IHover;
    }
    export type HStackHAlignmentType = StackJustifyContentType;
    export type HStackVAlignmentType = StackAlignItemsType;
    export type VStackHAlignmentType = StackAlignItemsType;
    export type VStackVAlignmentType = StackJustifyContentType;
    export interface HStackElement extends StackLayoutElement {
        horizontalAlignment?: HStackHAlignmentType;
        verticalAlignment?: HStackVAlignmentType;
    }
    export interface VStackElement extends StackLayoutElement {
        horizontalAlignment?: VStackHAlignmentType;
        verticalAlignment?: VStackVAlignmentType;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-stack']: StackLayoutElement;
            }
        }
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-hstack']: HStackElement;
            }
        }
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-vstack']: VStackElement;
            }
        }
    }
    export type StackLayoutAlignmentType<T extends StackDirectionType> = T extends 'horizontal' ? HStackHAlignmentType : VStackHAlignmentType;
    export type StackVerticalAlignmentType<T extends StackDirectionType> = T extends 'horizontal' ? HStackVAlignmentType : VStackVAlignmentType;
    export class StackLayout extends Container {
        private _gap;
        private _wrap;
        private _direction;
        private _reverse;
        private _justifyContent;
        private _alignItems;
        private _alignSelf;
        private _alignContent;
        private _mediaQueries;
        private _hover;
        constructor(parent?: Container, options?: any);
        static create(options?: StackLayoutElement, parent?: Container): Promise<StackLayout>;
        get direction(): StackDirectionType;
        set direction(value: StackDirectionType);
        get reverse(): boolean;
        set reverse(value: boolean);
        get justifyContent(): StackJustifyContentType;
        set justifyContent(value: StackJustifyContentType);
        get alignItems(): StackAlignItemsType;
        set alignItems(value: StackAlignItemsType);
        get alignSelf(): StackAlignSelfType;
        set alignSelf(value: StackAlignSelfType);
        get alignContent(): StackAlignContentType;
        set alignContent(value: StackAlignContentType);
        get gap(): number | string;
        set gap(value: number | string);
        get wrap(): StackWrapType;
        set wrap(value: StackWrapType);
        get mediaQueries(): IStackMediaQuery[];
        set mediaQueries(value: IStackMediaQuery[]);
        get hover(): IHover;
        set hover(value: IHover);
        protected removeStyle<P extends keyof StackLayout>(propertyName: P): void;
        protected setStyle<P extends keyof StackLayout>(propertyName: P, value: string): void;
        protected init(): void;
    }
    export class HStack extends StackLayout {
        private _horizontalAlignment;
        private _verticalAlignment;
        constructor(parent?: Container, options?: any);
        get horizontalAlignment(): HStackHAlignmentType;
        set horizontalAlignment(value: HStackHAlignmentType);
        get verticalAlignment(): HStackVAlignmentType;
        set verticalAlignment(value: HStackVAlignmentType);
        protected init(): void;
        static create(options?: HStackElement, parent?: Container): Promise<HStack>;
    }
    export class VStack extends StackLayout {
        private _horizontalAlignment;
        private _verticalAlignment;
        constructor(parent?: Container, options?: any);
        get horizontalAlignment(): VStackHAlignmentType;
        set horizontalAlignment(value: VStackHAlignmentType);
        get verticalAlignment(): VStackVAlignmentType;
        set verticalAlignment(value: VStackVAlignmentType);
        init(): void;
        static create(options?: VStackElement, parent?: Container): Promise<VStack>;
    }
}
declare module "packages/layout/src/panel" {
    import { Control, Container, ContainerElement } from "@ijstech/components/base";
    import { IHover } from "packages/layout/src/interfaces";
    export interface PanelElement extends ContainerElement {
        hover?: IHover;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-panel']: PanelElement;
            }
        }
    }
    export class Panel extends Container {
        private _hover;
        constructor(parent?: Control, options?: any);
        get hover(): IHover;
        set hover(value: IHover);
        protected removeStyle<P extends keyof Panel>(propertyName: P): void;
        protected setStyle<P extends keyof Panel>(propertyName: P, value: string): void;
        protected init(): void;
        connectedCallback(): void;
        static create(options?: PanelElement, parent?: Control): Promise<Panel>;
    }
}
declare module "packages/layout/src/grid" {
    import { Control, ControlElement, Container, IMediaQuery, DisplayType, IBackground, IControlMediaQueryProps } from "@ijstech/components/base";
    export interface IGap {
        row?: string | number;
        column?: string | number;
    }
    export interface IGridLayoutMediaQueryProps extends IControlMediaQueryProps {
        templateColumns?: string[];
        templateRows?: string[];
        templateAreas?: string[][];
        justifyContent?: GridLayoutJustifyContentType;
        display?: DisplayType;
        gap?: IGap;
        background?: IBackground;
    }
    export type IGridLayoutMediaQuery = IMediaQuery<IGridLayoutMediaQueryProps>;
    export type GridLayoutHorizontalAlignmentType = "stretch" | "start" | "end" | "center";
    export type GridLayoutJustifyContentType = "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
    export type GridLayoutVerticalAlignmentType = "stretch" | "start" | "end" | "center" | "baseline";
    export interface GridLayoutElement extends ControlElement {
        autoColumnSize?: string;
        autoFillInHoles?: boolean;
        autoRowSize?: string;
        columnsPerRow?: number;
        display?: DisplayType;
        gap?: IGap;
        horizontalAlignment?: GridLayoutHorizontalAlignmentType;
        justifyContent?: GridLayoutJustifyContentType;
        mediaQueries?: IGridLayoutMediaQuery[];
        templateAreas?: string[][];
        templateColumns?: string[];
        templateRows?: string[];
        verticalAlignment?: GridLayoutVerticalAlignmentType;
    }
    export const gridSchemaProps: any;
    export const gridProps: any;
    export class GridLayout extends Container {
        private _templateColumns;
        private _templateRows;
        private _templateAreas;
        private _autoColumnSize;
        private _autoRowSize;
        protected _columnsPerRow: number;
        private _gap;
        private _horizontalAlignment;
        private _verticalAlignment;
        private _autoFillInHoles;
        private _mediaQueries;
        private _styleClassMap;
        private _justifyContent;
        constructor(parent?: Control, options?: any);
        static create(options?: GridLayoutElement, parent?: Container): Promise<GridLayout>;
        get templateColumns(): string[];
        set templateColumns(columns: string[]);
        get templateRows(): string[];
        set templateRows(rows: string[]);
        get templateAreas(): string[][];
        set templateAreas(value: string[][]);
        get autoColumnSize(): string;
        set autoColumnSize(value: string);
        get autoRowSize(): string;
        set autoRowSize(value: string);
        get columnsPerRow(): number;
        set columnsPerRow(value: number);
        get gap(): IGap;
        set gap(value: IGap);
        get horizontalAlignment(): GridLayoutHorizontalAlignmentType;
        set horizontalAlignment(value: GridLayoutHorizontalAlignmentType);
        protected removeStyle<P extends keyof GridLayout>(propertyName: P): void;
        protected setStyle<P extends keyof GridLayout>(propertyName: P, value: string): void;
        get justifyContent(): GridLayoutJustifyContentType;
        set justifyContent(value: GridLayoutJustifyContentType);
        get verticalAlignment(): GridLayoutVerticalAlignmentType;
        set verticalAlignment(value: GridLayoutVerticalAlignmentType);
        get autoFillInHoles(): boolean;
        set autoFillInHoles(value: boolean);
        get mediaQueries(): IGridLayoutMediaQuery[];
        set mediaQueries(value: IGridLayoutMediaQuery[]);
        protected setAttributeToProperty<P extends keyof GridLayout>(propertyName: P): void;
        protected removeStyleClass(name: string): void;
        protected init(): void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-grid-layout']: GridLayoutElement;
            }
        }
    }
}
declare module "packages/layout/src/card" {
    import { Container } from "@ijstech/components/base";
    import { GridLayout, GridLayoutElement } from "packages/layout/src/grid";
    export interface CardLayoutElement extends GridLayoutElement {
        cardMinWidth?: number | string;
        cardHeight?: number | string;
    }
    export class CardLayout extends GridLayout {
        private _cardMinWidth;
        private _cardHeight;
        constructor(parent?: Container, options?: any);
        static create(options?: CardLayoutElement, parent?: Container): Promise<CardLayout>;
        get cardMinWidth(): number | string;
        set cardMinWidth(value: number | string);
        get columnsPerRow(): number;
        set columnsPerRow(value: number);
        get cardHeight(): number | string;
        set cardHeight(value: number | string);
        updateGridTemplateColumns(): void;
        protected setAttributeToProperty<P extends keyof CardLayout>(propertyName: P): void;
        protected init(): void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-card-layout']: CardLayoutElement;
            }
        }
    }
}
declare module "packages/layout/src/index" {
    export { StackDirectionType, StackLayout, VStack, VStackElement, HStack, HStackElement, IStackMediaQuery } from "packages/layout/src/stack";
    export { Panel, PanelElement } from "packages/layout/src/panel";
    export { CardLayout, CardLayoutElement } from "packages/layout/src/card";
    export { IGridLayoutMediaQuery, GridLayout, GridLayoutElement } from "packages/layout/src/grid";
}
declare module "packages/upload/src/style/upload.css" { }
declare module "packages/upload/src/upload" {
    import { Control, ControlElement } from "@ijstech/components/base";
    import "packages/upload/src/style/upload.css";
    type beforeDropCallback = (target: Upload) => void;
    type changedCallback = (target: Upload, files: UploadRawFile[]) => void;
    type removedCallback = (target: Upload, file?: File) => void;
    type uploadingCallback = (target: Upload, file: File) => Promise<boolean>;
    type addedCallback = (target: Upload, file: File) => Promise<boolean>;
    export const genFileId: () => number;
    export interface UploadRawFile extends File {
        uid?: number;
        path?: string;
        cid?: {
            cid: string;
            size: number;
        };
    }
    export interface UploadElement extends ControlElement {
        fileList?: File[];
        multiple?: boolean;
        accept?: string;
        draggable?: boolean;
        caption?: string;
        showFileList?: boolean;
        onBeforeDrop?: beforeDropCallback;
        onChanged?: changedCallback;
        onRemoved?: removedCallback;
        onAdded?: addedCallback;
        onUploading?: uploadingCallback;
    }
    interface UploadDragElement extends ControlElement {
        fileList?: File[];
        caption?: string;
        disabled?: boolean;
        onBeforeDrop?: any;
        onDrop?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-upload']: UploadElement;
                ['i-upload-drag']: UploadDragElement;
            }
        }
    }
    export class Upload extends Control {
        private _wrapperElm;
        private _wrapperFileElm;
        private _fileElm;
        private _previewElm;
        private _previewImgElm;
        private _previewRemoveElm;
        private _wrapImgElm;
        private _fileListElm;
        private _uploadDragElm;
        private lblCaption;
        private _caption;
        private _accept;
        private _draggable;
        private _multiple;
        private isPreviewing;
        onBeforeDrop: beforeDropCallback;
        onChanged: changedCallback;
        onRemoved: removedCallback;
        onAdded: addedCallback;
        onUploading: uploadingCallback;
        private _dt;
        private _fileList;
        constructor(parent?: Control, options?: any);
        get caption(): string;
        set caption(value: string);
        get accept(): string;
        set accept(value: string);
        get draggable(): boolean;
        set draggable(value: boolean);
        get multiple(): boolean;
        set multiple(value: boolean);
        get fileList(): UploadRawFile[];
        set fileList(value: UploadRawFile[]);
        get enabled(): boolean;
        set enabled(value: boolean);
        private addFile;
        private previewFile;
        private handleUpload;
        private proccessFiles;
        private checkBeforeUpload;
        private updateFileListUI;
        private renderPreview;
        private handleRemoveImagePreview;
        private handleRemove;
        toBase64(file: File): Promise<unknown>;
        preview(uri: string): void;
        clear(): void;
        upload(): Promise<void>;
        addFiles(): void;
        addFolder(): void;
        protected init(): void;
        static create(options?: UploadElement, parent?: Control): Promise<Upload>;
    }
}
declare module "packages/button/src/style/button.css" { }
/// <amd-module name="@ijstech/components/button" />
declare module "@ijstech/components/button" {
    import { Control, Container, ControlElement } from "@ijstech/components/base";
    import { Icon, IconElement } from "packages/icon/src/index";
    import "packages/button/src/style/button.css";
    export interface ButtonElement extends ControlElement {
        caption?: string;
        icon?: IconElement;
        rightIcon?: IconElement;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-button']: ButtonElement;
            }
        }
    }
    export class Button extends Control {
        private captionElm;
        private _icon;
        private _rightIcon;
        static create(options?: ButtonElement, parent?: Container): Promise<Button>;
        constructor(parent?: Control, options?: ButtonElement);
        get caption(): string;
        set caption(value: string);
        get icon(): Icon;
        set icon(value: Icon);
        get rightIcon(): Icon;
        set rightIcon(value: Icon);
        get enabled(): boolean;
        set enabled(value: boolean);
        private get isSpinning();
        private prependIcon;
        private appendIcon;
        private updateButton;
        _handleClick(event: MouseEvent): boolean;
        refresh(): void;
        protected init(): void;
    }
}
declare module "packages/button/src/index" {
    export { Button, ButtonElement } from "@ijstech/components/button";
}
declare module "packages/progress/src/style/progress.css" { }
declare module "packages/progress/src/progress" {
    import { Control, ControlElement, Types, IFont } from "@ijstech/components/base";
    import "packages/progress/src/style/progress.css";
    export type ProgressStatus = 'success' | 'exception' | 'active' | 'warning';
    export type ProgressType = 'line' | 'circle';
    type callbackType = (target: Control) => void;
    export interface ProgressElement extends ControlElement {
        percent?: number;
        strokeWidth?: number;
        strokeColor?: Types.Color;
        loading?: boolean;
        steps?: number;
        type?: ProgressType;
        format?: (percent: number) => string;
        onRenderStart?: callbackType;
        onRenderEnd?: callbackType;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-progress']: ProgressElement;
            }
        }
    }
    export class Progress extends Control {
        private _percent;
        private _status;
        private _loading;
        private _steps;
        private _type;
        private _strokeWidth;
        private _strokeColor;
        private _wrapperElm;
        private _startElm;
        private _barElm;
        private _endElm;
        private _textElm;
        format: (percent: number) => string;
        onRenderStart: callbackType;
        onRenderEnd: callbackType;
        constructor(parent?: Control, options?: any);
        get percent(): number;
        set percent(value: number);
        get strokeColor(): Types.Color;
        set strokeColor(value: Types.Color);
        get loading(): boolean;
        set loading(value: boolean);
        get steps(): number;
        set steps(value: number);
        get type(): ProgressType;
        set type(value: ProgressType);
        get strokeWidth(): number;
        set strokeWidth(value: number);
        get font(): IFont;
        set font(value: IFont);
        private get relativeStrokeWidth();
        private get radius();
        private get trackPath();
        private get perimeter();
        private get rate();
        private get strokeDashoffset();
        private get trailPathStyle();
        private get circlePathStyle();
        private get stroke();
        private get trackColor();
        private get progressTextSize();
        private renderLine;
        private renderCircle;
        private renderCircleInner;
        private updateCircleInner;
        protected init(): void;
        static create(options?: ProgressElement, parent?: Control): Promise<Progress>;
    }
}
declare module "packages/progress/src/index" {
    export { Progress } from "packages/progress/src/progress";
}
declare module "packages/upload/src/style/upload-modal.css" { }
declare module "packages/upload/src/upload-modal" {
    import { Control, ControlElement } from "@ijstech/components/base";
    import { ICidInfo } from "packages/ipfs/src/index";
    import "packages/upload/src/style/upload-modal.css";
    export enum FILE_STATUS {
        LISTED = 0,
        SUCCESS = 1,
        FAILED = 2,
        UPLOADING = 3
    }
    type BeforeUploadedCallback = (target: UploadModal, data: ICidInfo) => void;
    type UploadedCallback = (target: UploadModal, file: File, cid: string) => void;
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-upload-modal']: UploadModalElement;
            }
        }
    }
    export interface UploadModalElement extends ControlElement {
        rootCid?: string;
        parentDir?: Partial<ICidInfo>;
        onBeforeUploaded: BeforeUploadedCallback;
        onUploaded?: UploadedCallback;
    }
    export interface IIPFSItem {
        cid: string;
        name: string;
        size: number;
        type: 'dir' | 'file';
        links?: IIPFSItem[];
    }
    export interface IUploadResult {
        success: boolean;
        error?: string;
        data?: IIPFSItem;
    }
    export class UploadModal extends Control {
        private _uploadModalElm;
        private _closeBtnElm;
        private _uploadBoxElm;
        private _fileUploader;
        private _fileIcon;
        private _dragLabelElm;
        private _statusFilterElm;
        private _filterBarElm;
        private _filterActionsElm;
        private _fileListElm;
        private _uploadBtnElm;
        private _notePnlElm;
        private _paginationElm;
        private _rootCid;
        private _parentDir;
        onBeforeUploaded: BeforeUploadedCallback;
        onUploaded: UploadedCallback;
        private isForcedCancelled;
        private currentRequest;
        private currentPage;
        private currentFilterStatus;
        private files;
        private fileListData;
        constructor(parent?: Control, options?: any);
        get rootCid(): string;
        set rootCid(value: string);
        get parentDir(): Partial<ICidInfo>;
        set parentDir(value: Partial<ICidInfo>);
        show(): Promise<void>;
        private updateUI;
        hide(): void;
        private onBeforeDrop;
        private onBeforeUpload;
        private filteredFileListData;
        private numPages;
        private setCurrentPage;
        private get isSmallWidth();
        private renderFilterBar;
        private renderFileList;
        private formatBytes;
        private getStatus;
        private getPagination;
        private renderPagination;
        private onChangeCurrentFilterStatus;
        private onClear;
        private onCancel;
        private onChangeFile;
        private updateBtnCaption;
        private onRemove;
        private onRemoveFile;
        private getDirItems;
        private onUpload;
        private reset;
        private toggle;
        protected init(): Promise<void>;
        static create(options?: UploadModalElement, parent?: Control): Promise<UploadModal>;
    }
}
declare module "packages/upload/src/index" {
    export { Upload, UploadElement, UploadRawFile } from "packages/upload/src/upload";
    export { UploadModal } from "packages/upload/src/upload-modal";
}
declare module "packages/tab/src/style/tab.css" {
    import { ITabMediaQuery } from "packages/tab/src/tab";
    export const getTabMediaQueriesStyleClass: (mediaQueries: ITabMediaQuery[]) => string;
}
declare module "packages/tab/src/tab" {
    import { Control, Container, ContainerElement, IFont, IMediaQuery, IControlMediaQueryProps } from "@ijstech/components/base";
    import { Icon, IconElement } from "packages/icon/src/index";
    import "packages/tab/src/style/tab.css";
    type TabModeType = "horizontal" | "vertical";
    type TabsEventCallback = (target: Tabs, activeTab: Tab) => void;
    type TabCloseEventCallback = (target: Tabs, tab: Tab) => void;
    export interface TabsElement extends ContainerElement {
        activeTabIndex?: number;
        closable?: boolean;
        draggable?: boolean;
        mode?: TabModeType;
        mediaQueries?: ITabMediaQuery[];
        onChanged?: TabsEventCallback;
        onCloseTab?: TabCloseEventCallback;
        onBeforeClose?: TabsEventCallback;
    }
    export interface TabElement extends ContainerElement {
        caption?: string;
        icon?: IconElement;
        rightIcon?: IconElement;
        font?: IFont;
    }
    export interface ITab extends TabElement {
        children?: Control | Container;
    }
    export interface ITabMediaQueryProps extends IControlMediaQueryProps {
        mode?: TabModeType;
    }
    export type ITabMediaQuery = IMediaQuery<ITabMediaQueryProps>;
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-tabs']: TabsElement;
                ['i-tab']: TabElement;
            }
        }
    }
    export class Tabs extends Container {
        private tabsNavElm;
        private tabsContentElm;
        private contentPanes;
        private _tabs;
        private _activeTabIndex;
        private _closable;
        private _draggable;
        private _mediaQueries;
        private accumTabIndex;
        private curDragTab;
        onChanged: TabsEventCallback;
        onCloseTab: TabCloseEventCallback;
        onBeforeClose: TabCloseEventCallback;
        constructor(parent?: Container, options?: any);
        get activeTab(): Tab;
        get activeTabIndex(): number;
        set activeTabIndex(index: number);
        get items(): Tab[];
        get closable(): boolean;
        set closable(value: boolean);
        get draggable(): boolean;
        set draggable(value: boolean);
        get mode(): TabModeType;
        set mode(type: TabModeType);
        get mediaQueries(): ITabMediaQuery[];
        set mediaQueries(value: ITabMediaQuery[]);
        add(options?: ITab): Tab;
        delete(tab: Tab): void;
        private appendTab;
        private handleTagDrag;
        _handleClick(event: MouseEvent): boolean;
        private dragStartHandler;
        private dragOverHandler;
        private dropHandler;
        refresh(): void;
        protected init(): void;
        private initTabsNav;
        static create(options?: TabsElement, parent?: Container): Promise<Tabs>;
    }
    export class Tab extends Container {
        private tabContainer;
        private captionElm;
        private _contentElm;
        private _icon;
        private rightElm;
        private _rightIcon;
        private _closeBtn;
        protected _parent: Tabs;
        active(): void;
        protected addChildControl(control: Control): void;
        protected removeChildControl(control: Control): void;
        get caption(): string;
        set caption(value: string);
        close(): void;
        get index(): number;
        get icon(): Icon;
        set icon(elm: Icon);
        get rightIcon(): Icon;
        set rightIcon(elm: Icon);
        get innerHTML(): string;
        set innerHTML(value: string);
        get font(): IFont;
        set font(value: IFont);
        _handleClick(event: MouseEvent): boolean;
        private handleCloseTab;
        private handleDefaultClose;
        init(): void;
        static create(options?: TabElement, parent?: Control): Promise<Tab>;
    }
}
declare module "packages/tab/src/index" {
    export { Tabs, TabsElement, Tab, TabElement } from "packages/tab/src/tab";
}
declare module "packages/combo-box/src/style/combo-box.css" {
    export let ItemListStyle: string;
}
declare module "packages/combo-box/src/combo-box" {
    import { Control, ControlElement, notifyEventCallback, IBorder, Border, IFont, IBackground, Background } from "@ijstech/components/base";
    import { Icon, IconElement } from "packages/icon/src/index";
    import "packages/combo-box/src/style/combo-box.css";
    export interface IComboItem {
        value: string;
        label: string;
        isNew?: boolean;
        description?: string;
        icon?: string;
    }
    type ModeType = 'single' | 'multiple' | 'tags';
    export interface ComboBoxElement extends ControlElement {
        selectedItem?: IComboItem | IComboItem[];
        items?: IComboItem[];
        icon?: IconElement;
        mode?: ModeType;
        readOnly?: boolean;
        placeholder?: string;
        onChanged?: notifyEventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-combo-box"]: ComboBoxElement;
            }
        }
    }
    export class ComboBox extends Control {
        private _selectedItem;
        private _caption;
        private _captionWidth;
        private _items;
        private _icon;
        private _mode;
        private _readOnly;
        private _searchStr;
        private newItem;
        private isListShown;
        private captionSpanElm;
        private labelElm;
        private inputWrapElm;
        private inputElm;
        private iconElm;
        private listElm;
        private callback;
        onChanged: notifyEventCallback;
        constructor(parent?: Control, options?: any);
        get value(): IComboItem | IComboItem[] | undefined;
        set value(value: IComboItem | IComboItem[] | undefined);
        get selectedItem(): IComboItem | IComboItem[] | undefined;
        set selectedItem(value: IComboItem | IComboItem[] | undefined);
        get caption(): string;
        set caption(value: string);
        get captionWidth(): number | string;
        set captionWidth(value: number | string);
        get items(): IComboItem[];
        set items(items: IComboItem[]);
        get icon(): Icon;
        set icon(value: Icon);
        get searchStr(): string;
        set searchStr(str: string);
        get placeholder(): string;
        set placeholder(value: string);
        get mode(): ModeType;
        set mode(value: ModeType);
        get isMulti(): boolean;
        set border(value: IBorder);
        get border(): Border;
        get readOnly(): boolean;
        set readOnly(value: boolean);
        get background(): Background;
        set background(value: IBackground);
        get font(): IFont;
        set font(value: IFont);
        private isValueValid;
        private getItemIndex;
        private openList;
        calculatePositon(): void;
        private closeList;
        private toggleList;
        private escapeRegExp;
        private renderItems;
        private add;
        private handleRemove;
        private onItemClick;
        clear(): void;
        protected init(): void;
        disconnectedCallback(): void;
        static create(options?: ComboBoxElement, parent?: Control): Promise<ComboBox>;
    }
}
declare module "packages/combo-box/src/index" {
    export { ComboBox, ComboBoxElement, IComboItem } from "packages/combo-box/src/combo-box";
}
declare module "packages/datepicker/src/style/datepicker.css" { }
declare module "packages/datepicker/src/datepicker" {
    import { ControlElement, Control, notifyEventCallback, IBorder, Border } from "@ijstech/components/base";
    import "packages/datepicker/src/style/datepicker.css";
    import Moment from 'moment';
    type actionCallback = (target: Datepicker) => void;
    type dateType = 'date' | 'dateTime' | 'time';
    export interface DatepickerElement extends ControlElement {
        caption?: string;
        captionWidth?: number | string;
        value?: Moment.Moment;
        placeholder?: string;
        type?: dateType;
        dateTimeFormat?: string;
        onChanged?: notifyEventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-datepicker']: DatepickerElement;
            }
        }
    }
    export class Datepicker extends Control {
        private _value?;
        private _caption;
        private _captionWidth;
        private _iconWidth;
        private _dateTimeFormat;
        private _type;
        private _placeholder;
        private callback;
        private captionSpanElm;
        private labelElm;
        private inputElm;
        private toggleElm;
        private toggleIconElm;
        private datepickerElm;
        onChanged: notifyEventCallback;
        onBlur: actionCallback;
        constructor(parent?: Control, options?: any);
        _handleClick(event: MouseEvent): boolean;
        get caption(): string;
        set caption(value: string);
        get captionWidth(): number;
        set captionWidth(value: number | string);
        get height(): number;
        set height(value: number | string);
        get width(): number;
        set width(value: number | string);
        set border(value: IBorder);
        get border(): Border;
        get value(): Moment.Moment | undefined;
        set value(value: Moment.Moment | undefined);
        get defaultDateTimeFormat(): string;
        get dateTimeFormat(): string;
        set dateTimeFormat(format: string);
        get datepickerFormat(): string;
        get maxLength(): number;
        get enabled(): boolean;
        set enabled(value: boolean);
        get placeholder(): string;
        set placeholder(value: string);
        get type(): dateType;
        set type(value: dateType);
        set designMode(value: boolean);
        private get formatString();
        private _onDatePickerChange;
        private _onBlur;
        private updateValue;
        private clear;
        protected init(): void;
        protected _handleBlur(event: Event, stopPropagation?: boolean): boolean;
        static create(options?: DatepickerElement, parent?: Control): Promise<Datepicker>;
    }
}
declare module "packages/datepicker/src/index" {
    export { Datepicker, DatepickerElement } from "packages/datepicker/src/datepicker";
}
declare module "packages/range/src/style/range.css" { }
declare module "packages/range/src/range" {
    import { Control, ControlElement, notifyEventCallback, Types } from "@ijstech/components/base";
    import "packages/range/src/style/range.css";
    export interface RangeElement extends ControlElement {
        caption?: string;
        captionWidth?: number | string;
        value?: number;
        min?: number;
        max?: number;
        step?: number;
        stepDots?: boolean | number;
        tooltipFormatter?: any;
        tooltipVisible?: boolean;
        trackColor?: Types.Color;
        onChanged?: notifyEventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-range']: RangeElement;
            }
        }
    }
    export class Range extends Control {
        private _value;
        private _caption;
        private _captionWidth;
        private _tooltipVisible;
        private _trackColor;
        private tooltipFormatter;
        private captionSpanElm;
        private labelElm;
        private inputElm;
        private inputContainerElm;
        private tooltipElm;
        onChanged: notifyEventCallback;
        onKeyUp: notifyEventCallback;
        private callback;
        constructor(parent?: Control, options?: any);
        get caption(): string;
        set caption(value: string);
        get captionWidth(): number;
        set captionWidth(value: number | string);
        get value(): number;
        set value(value: number);
        get width(): number;
        set width(value: number | string);
        get enabled(): boolean;
        set enabled(value: boolean);
        set designMode(value: boolean);
        get tooltipVisible(): boolean;
        set tooltipVisible(value: boolean);
        get trackColor(): Types.Color;
        set trackColor(value: Types.Color);
        private onSliderChange;
        private onUpdateTooltip;
        protected init(): void;
        static create(options?: RangeElement, parent?: Control): Promise<Range>;
    }
}
declare module "packages/range/src/index" {
    export { Range, RangeElement } from "packages/range/src/range";
}
declare module "packages/radio/src/radio.css" {
    export const captionStyle: string;
}
declare module "packages/radio/src/radio" {
    import { Control, ControlElement, notifyEventCallback, IFont } from "@ijstech/components/base";
    export interface RadioElement extends ControlElement {
        caption?: string;
        captionWidth?: number | string;
        value?: string;
    }
    export type RadioGroupLayout = 'vertical' | 'horizontal';
    export interface RadioGroupElement extends ControlElement {
        layout?: RadioGroupLayout;
        selectedValue?: string;
        radioItems?: RadioElement[];
        onChanged?: notifyEventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-radio-group']: RadioGroupElement;
                ['i-radio']: RadioElement;
            }
        }
    }
    export class Radio extends Control {
        private _value;
        private _caption;
        private _captionWidth;
        private labelElm;
        private inputElm;
        private captionSpanElm;
        constructor(parent?: Control, options?: any);
        get value(): string;
        set value(value: string);
        get caption(): string;
        set caption(value: string);
        get captionWidth(): number | string;
        set captionWidth(value: number | string);
        set font(value: IFont);
        get font(): IFont;
        _handleClick(event: MouseEvent): boolean;
        protected init(): void;
        static create(options?: RadioElement, parent?: Control): Promise<Radio>;
    }
    export class RadioGroup extends Control {
        private _selectedValue;
        private _radioItems;
        private _layout;
        private _group;
        private name;
        onChanged: notifyEventCallback;
        constructor(parent?: Control, options?: any);
        get selectedValue(): string;
        set selectedValue(value: string);
        get radioItems(): RadioElement[];
        set radioItems(value: RadioElement[]);
        get layout(): RadioGroupLayout;
        set layout(value: RadioGroupLayout);
        private renderUI;
        private appendItem;
        private _handleChange;
        add(options: RadioElement): Radio;
        delete(index: number): void;
        protected init(): void;
        static create(options?: RadioGroupElement, parent?: Control): Promise<RadioGroup>;
    }
}
declare module "packages/radio/src/index" {
    export { Radio, RadioElement, RadioGroup, RadioGroupElement, RadioGroupLayout } from "packages/radio/src/radio";
}
declare module "packages/color/src/utils" {
    export function stringToArr(color: string, isRgb: boolean): string[];
    export function hslaToHex(h: number, s: number, l: number, a: number): string;
    export function rgbToHex(rgba: string[]): string;
    export function hslaToRgba(h: number, s: number, l: number): {
        r: number;
        g: number;
        b: number;
    };
    export function rgbaToHsla(r: number, g: number, b: number): {
        h: number;
        s: number;
        l: number;
    };
    export function getUnitValues(h: number, s: number, l: number, a: number): {
        hex: string;
        isValid: boolean;
        r: number;
        g: number;
        b: number;
        h: number;
        s: number;
        l: number;
        a: number;
    };
    export function convertColor(color: string): any;
    export function isRgbValid(value: string): boolean;
    export function isHValid(value: string): boolean;
    export function isPercentValid(value: string): boolean;
    export function customRound(value: number, threshold: number): number;
    export function hsvToHsl(h: number, s: number, v: number): {
        h: number;
        s: number;
        l: number;
    };
    export function hslToHsv(h: number, s: number, l: number): {
        h: number;
        s: number;
        v: number;
    };
}
declare module "packages/color/src/style/color.css" { }
declare module "packages/color/src/color" {
    import { ControlElement, Control, notifyEventCallback } from "@ijstech/components/base";
    import "packages/color/src/style/color.css";
    export interface ColorPickerElement extends ControlElement {
        value?: string;
        caption?: string;
        captionWidth?: number | string;
        onChanged?: notifyEventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-color']: ColorPickerElement;
            }
        }
    }
    export class ColorPicker extends Control {
        private wrapperElm;
        private inputSpanElm;
        private captionSpanElm;
        private mdColorPicker;
        private colorPalette;
        private colorSlider;
        private pnlShown;
        private pnlWrap;
        private pnlInput;
        private colorSelected;
        private _caption;
        private _captionWidth;
        private _format;
        private inputMap;
        private currentH;
        private currentColor;
        private currentPalette;
        private isMousePressed;
        onChanged: notifyEventCallback;
        onClosed: () => void;
        constructor(parent?: Control, options?: any);
        get value(): string;
        set value(color: string);
        get caption(): string;
        set caption(value: string);
        get captionWidth(): number | string;
        set captionWidth(value: number | string);
        get height(): number;
        set height(value: number | string);
        protected init(): Promise<void>;
        private onOpenPicker;
        private onClosePicker;
        private createInputGroup;
        private createPreview;
        protected _handleMouseDown(event: MouseEvent): boolean;
        private handleMouseMove;
        private handleMouseUp;
        private createPicker;
        private activeEyeDropper;
        private onPaletteChanged;
        private onSliderChanged;
        private onToggleFormat;
        private updateIconPointer;
        private onColorSelected;
        private updateColor;
        private updateCurrentColor;
        private updateHex;
        private updateUI;
        private initUI;
        private setPalette;
        private onInputChanged;
        static create(options?: ColorPickerElement, parent?: Control): Promise<ColorPicker>;
    }
}
declare module "packages/color/src/index" {
    export { ColorPicker, ColorPickerElement } from "packages/color/src/color";
}
declare module "packages/input/src/style/input.css" { }
declare module "packages/input/src/input" {
    import { Control, ControlElement, notifyEventCallback, IBorder, Border, IBackground, Background, IFont } from "@ijstech/components/base";
    import { Checkbox, CheckboxElement } from "packages/checkbox/src/index";
    import { ComboBox, ComboBoxElement } from "packages/combo-box/src/index";
    import { Datepicker, DatepickerElement } from "packages/datepicker/src/index";
    import { Range, RangeElement } from "packages/range/src/index";
    import { Radio, RadioElement } from "packages/radio/src/index";
    import { ColorPicker } from "packages/color/src/index";
    import "packages/input/src/style/input.css";
    export type InputType = 'checkbox' | 'radio' | 'range' | 'date' | 'time' | 'dateTime' | 'password' | 'combobox' | 'number' | 'textarea' | 'text' | 'color';
    type InputControlType = Checkbox | ComboBox | Datepicker | Range | Radio | ColorPicker;
    type actionCallback = (target: Input) => void;
    type resizeType = "none" | "auto" | "both" | "horizontal" | "vertical" | "initial" | "inherit" | "auto-grow";
    export interface InputElement extends ControlElement, CheckboxElement, ComboBoxElement, DatepickerElement, RangeElement, RadioElement {
        caption?: string;
        captionWidth?: number | string;
        inputType?: InputType;
        value?: any;
        placeholder?: string;
        readOnly?: boolean;
        showClearButton?: boolean;
        rows?: number;
        multiline?: boolean;
        resize?: resizeType;
        maxLength?: number;
        onChanged?: notifyEventCallback;
        onKeyDown?: notifyEventCallback;
        onKeyUp?: notifyEventCallback;
        onBlur?: actionCallback;
        onFocus?: actionCallback;
        onClearClick?: actionCallback;
        onClosed?: () => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-input']: InputElement;
            }
        }
    }
    export class Input extends Control {
        private _value;
        private _caption;
        private _captionWidth;
        private _inputType;
        private _placeholder;
        private _readOnly;
        private _showClearButton;
        private _clearBtnWidth;
        private _rows;
        private _multiline;
        private _resize;
        private _maxLength;
        private captionSpanElm;
        private labelElm;
        private inputElm;
        private _inputControl;
        private clearIconElm;
        private _onClosed;
        onKeyDown: notifyEventCallback;
        onKeyUp: notifyEventCallback;
        onChanged: notifyEventCallback;
        onBlur: actionCallback;
        onFocus: actionCallback;
        onClearClick: actionCallback;
        constructor(parent?: Control, options?: any);
        get caption(): string;
        set caption(value: string);
        get captionWidth(): number | string;
        set captionWidth(value: number | string);
        get height(): number;
        set height(value: number | string);
        get value(): any;
        set value(value: any);
        get width(): number | string;
        set width(value: number | string);
        get readOnly(): boolean;
        set readOnly(value: boolean);
        get inputType(): InputType;
        set inputType(type: InputType);
        get inputControl(): InputControlType;
        get enabled(): boolean;
        set enabled(value: boolean);
        set placeholder(value: string);
        get rows(): number;
        set rows(value: number);
        get multiline(): boolean;
        set multiline(value: boolean);
        get resize(): resizeType;
        set resize(value: resizeType);
        set border(value: IBorder);
        get border(): Border;
        set maxLength(value: number);
        get maxLength(): number;
        get background(): Background;
        set background(value: IBackground);
        get font(): IFont;
        set font(value: IFont);
        set onClosed(callback: () => void);
        get onClosed(): () => void;
        private _createInputElement;
        private _inputCallback;
        private _handleChange;
        private _handleInputKeyDown;
        private _handleInputKeyUp;
        protected _handleBlur(event: Event, stopPropagation?: boolean): boolean;
        private _handleOnFocus;
        private _clearValue;
        focus(): void;
        protected init(): void;
        static create(options?: InputElement, parent?: Control): Promise<Input>;
    }
}
declare module "packages/input/src/index" {
    export { Input, InputElement } from "packages/input/src/input";
}
declare module "packages/switch/src/style/switch.css" { }
declare module "packages/switch/src/switch" {
    import { Control, ControlElement, notifyEventCallback } from "@ijstech/components/base";
    import "packages/switch/src/style/switch.css";
    export interface SwitchElement extends ControlElement {
        checkedThumbColor?: string;
        uncheckedThumbColor?: string;
        checkedThumbText?: string;
        uncheckedThumbText?: string;
        checkedTrackColor?: string;
        uncheckedTrackColor?: string;
        checkedText?: string;
        uncheckedText?: string;
        checked?: boolean;
        onChanged?: notifyEventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-switch"]: SwitchElement;
            }
        }
    }
    export class Switch extends Control {
        private wrapperElm;
        private switchBaseElm;
        private inputElm;
        private thumbElm;
        private rippleElm;
        private trackElm;
        private _checked;
        private _checkedThumbColor;
        private _uncheckedThumbColor;
        private _checkedTrackColor;
        private _uncheckedTrackColor;
        private _checkedText;
        private _uncheckedText;
        private _checkedThumbText;
        private _uncheckedThumbText;
        onChanged: notifyEventCallback;
        constructor(parent?: Control, options?: any);
        get checked(): boolean;
        set checked(value: boolean);
        get checkedThumbColor(): string;
        set checkedThumbColor(value: string);
        get uncheckedThumbColor(): string;
        set uncheckedThumbColor(value: string);
        get checkedTrackColor(): string;
        set checkedTrackColor(value: string);
        get uncheckedTrackColor(): string;
        set uncheckedTrackColor(value: string);
        get checkedText(): string;
        set checkedText(value: string);
        get uncheckedText(): string;
        set uncheckedText(value: string);
        get checkedThumbText(): string;
        set checkedThumbText(value: string);
        get uncheckedThumbText(): string;
        set uncheckedThumbText(value: string);
        protected setAttributeToProperty<P extends keyof Switch>(propertyName: P): void;
        _handleClick(event: MouseEvent): boolean;
        init(): void;
        static create(options?: SwitchElement, parent?: Control): Promise<Switch>;
    }
}
declare module "packages/switch/src/index" {
    export { Switch, SwitchElement } from "packages/switch/src/switch";
}
declare module "packages/application/src/styles/jsonUI.css" {
    export const jsonUICheckboxStyle: string;
    export const jsonUIComboboxStyle: string;
    export const jsonUITabStyle: string;
}
declare module "packages/application/src/jsonUI" {
    import { Control } from "@ijstech/components/base";
    type IJSONSchema4TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'any';
    type IJSONSchema4Type = string | number | boolean | IJSONSchema4Object | IJSONSchema4Array | null;
    interface IJSONSchema4Object {
        [key: string]: IJSONSchema4Type;
    }
    interface IJSONSchema4Array extends Array<IJSONSchema4Type> {
    }
    type IJSONSchema4Version = string;
    interface IJSONSchema4 {
        id?: string | undefined;
        $ref?: string | undefined;
        $schema?: IJSONSchema4Version | undefined;
        title?: string | undefined;
        description?: string | undefined;
        tooltip?: string | undefined;
        default?: IJSONSchema4Type | undefined;
        multipleOf?: number | undefined;
        maximum?: number | undefined;
        exclusiveMaximum?: boolean | undefined;
        minimum?: number | undefined;
        exclusiveMinimum?: boolean | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        pattern?: string | undefined;
        additionalItems?: boolean | IJSONSchema4 | undefined;
        items?: IJSONSchema4 | IJSONSchema4[] | undefined;
        maxItems?: number | undefined;
        minItems?: number | undefined;
        uniqueItems?: boolean | undefined;
        maxProperties?: number | undefined;
        minProperties?: number | undefined;
        required?: boolean | string[] | undefined;
        additionalProperties?: boolean | IJSONSchema4 | undefined;
        definitions?: {
            [k: string]: IJSONSchema4;
        } | undefined;
        properties?: {
            [k: string]: IJSONSchema4;
        } | undefined;
        patternProperties?: {
            [k: string]: IJSONSchema4;
        } | undefined;
        dependencies?: {
            [k: string]: IJSONSchema4 | string[];
        } | undefined;
        enum?: IJSONSchema4Type[] | undefined;
        type?: IJSONSchema4TypeName | IJSONSchema4TypeName[] | undefined;
        allOf?: IJSONSchema4[] | undefined;
        anyOf?: IJSONSchema4[] | undefined;
        oneOf?: IJSONSchema4[] | undefined;
        not?: IJSONSchema4 | undefined;
        extends?: string | string[] | undefined;
        [k: string]: any;
        format?: string | undefined;
    }
    type IJSONSchema6TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'any';
    type IJSONSchema6Type = string | number | boolean | IJSONSchema6Object | IJSONSchema6Array | null;
    interface IJSONSchema6Object {
        [key: string]: IJSONSchema6Type;
    }
    interface IJSONSchema6Array extends Array<IJSONSchema6Type> {
    }
    type IJSONSchema6Version = string;
    type IJSONSchema6Definition = IJSONSchema6 | boolean;
    interface IJSONSchema6 {
        $id?: string | undefined;
        $ref?: string | undefined;
        $schema?: IJSONSchema6Version | undefined;
        multipleOf?: number | undefined;
        maximum?: number | undefined;
        exclusiveMaximum?: number | undefined;
        minimum?: number | undefined;
        exclusiveMinimum?: number | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        pattern?: string | undefined;
        items?: IJSONSchema6Definition | IJSONSchema6Definition[] | undefined;
        additionalItems?: IJSONSchema6Definition | undefined;
        maxItems?: number | undefined;
        minItems?: number | undefined;
        uniqueItems?: boolean | undefined;
        contains?: IJSONSchema6Definition | undefined;
        maxProperties?: number | undefined;
        minProperties?: number | undefined;
        required?: string[] | undefined;
        properties?: {
            [k: string]: IJSONSchema6Definition;
        } | undefined;
        patternProperties?: {
            [k: string]: IJSONSchema6Definition;
        } | undefined;
        additionalProperties?: IJSONSchema6Definition | undefined;
        dependencies?: {
            [k: string]: IJSONSchema6Definition | string[];
        } | undefined;
        propertyNames?: IJSONSchema6Definition | undefined;
        enum?: IJSONSchema6Type[] | undefined;
        const?: IJSONSchema6Type | undefined;
        type?: IJSONSchema6TypeName | IJSONSchema6TypeName[] | undefined;
        allOf?: IJSONSchema6Definition[] | undefined;
        anyOf?: IJSONSchema6Definition[] | undefined;
        oneOf?: IJSONSchema6Definition[] | undefined;
        not?: IJSONSchema6Definition | undefined;
        definitions?: {
            [k: string]: IJSONSchema6Definition;
        } | undefined;
        title?: string | undefined;
        description?: string | undefined;
        tooltip?: string | undefined;
        default?: IJSONSchema6Type | undefined;
        examples?: IJSONSchema6Type[] | undefined;
        format?: string | undefined;
    }
    type IJSONSchema7TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';
    type IJSONSchema7Type = string | number | boolean | IJSONSchema7Object | IJSONSchema7Array | null;
    interface IJSONSchema7Object {
        [key: string]: IJSONSchema7Type;
    }
    interface IJSONSchema7Array extends Array<IJSONSchema7Type> {
    }
    type IJSONSchema7Version = string;
    type IJSONSchema7Definition = IJSONSchema7 | boolean;
    interface IJSONSchema7 {
        $id?: string | undefined;
        $ref?: string | undefined;
        $schema?: IJSONSchema7Version | undefined;
        $comment?: string | undefined;
        $defs?: {
            [key: string]: IJSONSchema7Definition;
        } | undefined;
        type?: IJSONSchema7TypeName | IJSONSchema7TypeName[] | undefined;
        enum?: IJSONSchema7Type[] | undefined;
        const?: IJSONSchema7Type | undefined;
        multipleOf?: number | undefined;
        maximum?: number | undefined;
        exclusiveMaximum?: number | undefined;
        minimum?: number | undefined;
        exclusiveMinimum?: number | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        pattern?: string | undefined;
        items?: IJSONSchema7Definition | IJSONSchema7Definition[] | undefined;
        additionalItems?: IJSONSchema7Definition | undefined;
        maxItems?: number | undefined;
        minItems?: number | undefined;
        uniqueItems?: boolean | undefined;
        contains?: IJSONSchema7 | undefined;
        maxProperties?: number | undefined;
        minProperties?: number | undefined;
        required?: string[] | undefined;
        properties?: {
            [key: string]: IJSONSchema7Definition;
        } | undefined;
        patternProperties?: {
            [key: string]: IJSONSchema7Definition;
        } | undefined;
        additionalProperties?: IJSONSchema7Definition | undefined;
        dependencies?: {
            [key: string]: IJSONSchema7Definition | string[];
        } | undefined;
        propertyNames?: IJSONSchema7Definition | undefined;
        if?: IJSONSchema7Definition | undefined;
        then?: IJSONSchema7Definition | undefined;
        else?: IJSONSchema7Definition | undefined;
        allOf?: IJSONSchema7Definition[] | undefined;
        anyOf?: IJSONSchema7Definition[] | undefined;
        oneOf?: IJSONSchema7Definition[] | undefined;
        not?: IJSONSchema7Definition | undefined;
        format?: string | undefined;
        contentMediaType?: string | undefined;
        contentEncoding?: string | undefined;
        definitions?: {
            [key: string]: IJSONSchema7Definition;
        } | undefined;
        title?: string | undefined;
        description?: string | undefined;
        tooltip?: string | undefined;
        default?: IJSONSchema7Type | undefined;
        readOnly?: boolean | undefined;
        writeOnly?: boolean | undefined;
        examples?: IJSONSchema7Type | undefined;
    }
    export type IUISchemaType = 'VerticalLayout' | 'HorizontalLayout' | 'Group' | 'Categorization' | 'Category' | 'Control';
    export type IUISchemaRulesEffect = 'HIDE' | 'SHOW' | 'DISABLE' | 'ENABLE';
    export interface IUISchemaRulesCondition {
        scope: string;
        schema: {
            [key: string]: any;
        };
    }
    export interface IUISchema {
        type: IUISchemaType;
        elements?: IUISchema[];
        label?: string | boolean;
        scope?: string;
        rule?: IUISchemaRules;
        options?: IUISchemaOptions;
    }
    export interface IUISchemaOptions {
        detail?: 'DEFAULT' | 'GENERATED' | 'REGISTERED' | IUISchema;
        showSortButtons?: boolean;
        elementLabelProp?: string;
        format?: 'date' | 'time' | 'date-time' | 'radio';
        slider?: boolean;
        multi?: boolean;
        color?: boolean;
        restrict?: boolean;
        showUnfocusedDescription?: boolean;
        hideRequiredAsterisk?: boolean;
        toggle?: boolean;
        readonly?: boolean;
        autocomplete?: boolean;
        variant?: 'stepper';
    }
    export interface IUISchemaRules {
        effect?: IUISchemaRulesEffect;
        condition?: IUISchemaRulesCondition;
    }
    interface ValidationResult {
        valid: boolean;
        errors: ValidationError[];
    }
    interface ValidationError {
        property: string;
        scope: string;
        message: string;
    }
    export type IDataSchema = IJSONSchema4 | IJSONSchema6 | IJSONSchema7;
    export const DataSchemaValidator: {
        checkPropertyChange: (value: any, schema: IDataSchema, property: string) => ValidationResult | null;
        mustBeValid: (result: ValidationResult) => void;
        validate: (instance: any, schema: IDataSchema, options: any) => ValidationResult | null;
    };
    export interface IRenderUIOptions {
        jsonSchema: IDataSchema;
        data?: any;
        jsonUISchema?: IUISchema;
        hideConfirmButton?: boolean;
        columnsPerRow?: number;
        showClearButton?: boolean;
        clearButtonCaption?: string;
        confirmButtonCaption?: string;
        confirmButtonBackgroundColor?: string;
        confirmButtonFontColor?: string;
        columnWidth?: string | number;
        clearButtonBackgroundColor?: string;
        clearButtonFontColor?: string;
        dateFormat?: string;
        timeFormat?: string;
        dateTimeFormat?: string;
    }
    export function renderUI(target: Control, options: IRenderUIOptions, confirmCallback?: (result: boolean, data: any) => void, valueChangedCallback?: (data: any, errMsg: string) => void): void;
}
declare module "packages/moment/src/index" {
    import Moment from 'moment';
    var moment: typeof Moment;
    export { moment };
}
declare module "packages/application/src/formatUtils" {
    type RoundingMethod = 'floor' | 'round' | 'ceil';
    export interface IFormatNumberOptions {
        useSeparators?: boolean;
        roundingMethod?: RoundingMethod;
        decimalFigures?: number;
        minValue?: number | string;
        shortScale?: boolean;
        hasTrailingZero?: boolean;
    }
    export class FormatUtils {
        static unixToFormattedDate(unixTimestamp: number): string;
        static truncateTxHash(hash: string, length?: number): string;
        static truncateWalletAddress(address: string): string;
        static formatNumber(value: BigInt | string | number, options?: IFormatNumberOptions): string;
        private static scaleValue;
        private static removeExponential;
        private static compareToMinValue;
        private static processDecimalPart;
        private static customRound;
        private static roundIntegerPart;
        private static incrementLastDigit;
    }
    export class BigDecimal {
        static decimals: number;
        private bigVal;
        constructor(value: string);
        static fromBigInt(bigVal: bigint): any;
        toString(): string;
        divide(value: BigDecimal): any;
    }
}
declare module "packages/application/src/idUtils" {
    export class IdUtils {
        static generateUUID(length?: number): string;
    }
}
declare module "packages/application/src/index" {
    import { Module } from "packages/module/src/index";
    import { EventBus } from "packages/application/src/event-bus";
    import { GlobalEvents } from "packages/application/src/globalEvent";
    import { ICidInfo } from "packages/ipfs/src/index";
    export interface IGeo {
        enabled: boolean;
        apiUrl?: string;
        blockedCountries: string[];
        moduleOnBlocking: string;
    }
    export interface IGeoInfo {
        country: string;
        timezone: string;
    }
    export interface IHasDependencies {
        assets?: string;
        bundle?: boolean;
        ipfs?: string;
        rootDir?: string;
        moduleDir?: string;
        libDir?: string;
        main?: string;
        geo?: IGeo;
        dependencies?: {
            [name: string]: string;
        };
        modules?: {
            [name: string]: {
                path: string;
                dependencies: string[];
            };
        };
        script?: string;
    }
    export interface IModuleRoute extends IHasDependencies {
        url: string;
        module: string;
        default?: boolean;
    }
    export interface IModuleMenuItem {
        text: string;
        to: string;
        isToExternal?: boolean;
        img?: string;
        subItems?: IModuleMenuItem[];
        isDisabled?: boolean;
        supportedChainIds?: number[];
        env?: string[];
    }
    export interface IModuleOptions extends IHasDependencies {
        codeCID?: string;
        name?: string;
        main?: string;
        type?: number;
        version?: string;
        root?: string;
        routes?: IModuleRoute[];
        params?: any;
        menuItems?: IModuleMenuItem[];
        env?: string;
    }
    export enum IpfsDataType {
        Raw = 0,
        Directory = 1,
        File = 2,
        Metadata = 3,
        Symlink = 4,
        HAMTShard = 5
    }
    export interface IUploadResult {
        success: boolean;
        error?: string;
        data?: ICidInfo;
    }
    export interface IUploadItem {
        cid: ICidInfo;
        data?: File | string;
    }
    class Application {
        private static _instance;
        private modules;
        private modulesId;
        private scripts;
        globalEvents: GlobalEvents;
        private id;
        currentModulePath: string;
        currentModuleDir: string;
        LibHost: string;
        private packageNames;
        private packages;
        _assets: {
            [name: string]: any;
        };
        private _initOptions?;
        private _uploadModal;
        private cidItems;
        geoInfo: IGeoInfo;
        private bundleLibs;
        store: Record<string, any>;
        rootDir: string;
        private constructor();
        get EventBus(): EventBus;
        static get Instance(): Application;
        assets(name: string): any;
        private calculateElementScconfigPath;
        private calculatePackageModuleDir;
        createElement(name: string, lazyLoad?: boolean, attributes?: {
            [name: string]: string;
        }, modulePath?: string): Promise<HTMLElement | undefined>;
        fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response>;
        postData(endpoint: string, data: any): Promise<any>;
        showUploadModal(): Promise<void>;
        getUploadUrl(item: ICidInfo): Promise<{
            [cid: string]: string;
        }>;
        uploadData(fileName: string, content: string): Promise<IUploadResult>;
        uploadFile(extensions?: string | string[]): Promise<IUploadResult>;
        uploadTo(targetCid: string, items: IUploadItem[]): Promise<IUploadResult>;
        upload(url: string, data: File | string): Promise<number>;
        private getCidItem;
        private verifyScript;
        private getScript;
        loadScript(modulePath: string, script?: string): Promise<boolean>;
        getContent(modulePath: string): Promise<string>;
        fetchDirectoryInfoByCID(ipfsCid: string): Promise<ICidInfo[]>;
        private calculatePackageModulePath;
        loadPackage(packageName: string, modulePath?: string): Promise<{
            [name: string]: any;
        } | null>;
        loadPackages(packages: string[]): Promise<void>;
        private dynamicImportPackage;
        loadModule(modulePath: string, options?: IHasDependencies): Promise<Module | null>;
        private getModulePath;
        initModule(modulePath: string, script: string): Promise<string | null>;
        init(scconfigPath: string, customData?: Record<string, any>): Promise<Module | null>;
        newModule(module: string, options?: IHasDependencies): Promise<Module | null>;
        copyToClipboard(value: string): Promise<boolean>;
        xssSanitize(value: string): string;
    }
    export const application: Application;
    export { EventBus, IEventBus } from "packages/application/src/event-bus";
    export { IDataSchema, IUISchema, IRenderUIOptions, renderUI, DataSchemaValidator } from "packages/application/src/jsonUI";
    export { FormatUtils, IFormatNumberOptions } from "packages/application/src/formatUtils";
    export { IdUtils } from "packages/application/src/idUtils";
    export default application;
}
declare module "packages/alert/src/style/alert.css" { }
declare module "packages/alert/src/alert" {
    import { Control, Container, ControlElement } from "@ijstech/components/base";
    import "packages/alert/src/style/alert.css";
    export interface AlertElement extends ControlElement {
        status?: "warning" | "success" | "error" | "loading" | "confirm";
        title?: string;
        content?: string;
        link?: {
            caption: string;
            href: string;
        };
        onClose?: any;
        onConfirm?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-alert"]: AlertElement;
            }
        }
    }
    export interface IAlertMessage {
        status: "warning" | "success" | "error" | "loading" | "confirm";
        title?: string;
        content?: string;
        link?: {
            caption: string;
            href: string;
        };
        onClose?: any;
        onConfirm?: any;
    }
    export class Alert extends Control {
        private mdAlert;
        private pnlMain;
        private _status;
        private _title;
        private _content;
        private _link;
        onClose?: any;
        onConfirm?: any;
        constructor(parent?: Container, options?: any);
        get status(): string;
        set status(value: string);
        get title(): string;
        set title(value: string);
        get content(): string;
        set content(value: string);
        get link(): {
            caption: string;
            href: string;
        };
        set link(value: {
            caption: string;
            href: string;
        });
        private get iconName();
        private get color();
        closeModal: () => void;
        showModal: () => void;
        private renderUI;
        private renderContent;
        private renderLink;
        private renderButtons;
        protected init(): Promise<void>;
    }
}
declare module "packages/alert/src/index" {
    export { Alert, AlertElement } from "packages/alert/src/alert";
}
declare module "packages/code-editor/src/editor.api" {
    global {
        let MonacoEnvironment: Environment | undefined;
    }
    export type Thenable<T> = PromiseLike<T>;
    export interface Environment {
        globalAPI?: boolean;
        baseUrl?: string;
        getWorker?(workerId: string, label: string): Worker;
        getWorkerUrl?(workerId: string, label: string): string;
    }
    export interface IDisposable {
        dispose(): void;
    }
    export interface IEvent<T> {
        (listener: (e: T) => any, thisArg?: any): IDisposable;
    }
    export enum MarkerTag {
        Unnecessary = 1,
        Deprecated = 2
    }
    export enum MarkerSeverity {
        Hint = 1,
        Info = 2,
        Warning = 4,
        Error = 8
    }
    export interface CancellationToken {
        readonly isCancellationRequested: boolean;
        readonly onCancellationRequested: (listener: (e: any) => any, thisArgs?: any, disposables?: IDisposable[]) => IDisposable;
    }
    export class Uri implements UriComponents {
        static isUri(thing: any): thing is Uri;
        readonly scheme: string;
        readonly authority: string;
        readonly path: string;
        readonly query: string;
        readonly fragment: string;
        get fsPath(): string;
        with(change: {
            scheme?: string;
            authority?: string | null;
            path?: string | null;
            query?: string | null;
            fragment?: string | null;
        }): Uri;
        static parse(value: string, _strict?: boolean): Uri;
        static file(path: string): Uri;
        static from(components: {
            scheme: string;
            authority?: string;
            path?: string;
            query?: string;
            fragment?: string;
        }): Uri;
        static joinPath(uri: Uri, ...pathFragment: string[]): Uri;
        toString(skipEncoding?: boolean): string;
        toJSON(): UriComponents;
        static revive(data: UriComponents | Uri): Uri;
        static revive(data: UriComponents | Uri | undefined): Uri | undefined;
        static revive(data: UriComponents | Uri | null): Uri | null;
        static revive(data: UriComponents | Uri | undefined | null): Uri | undefined | null;
    }
    export interface UriComponents {
        scheme: string;
        authority: string;
        path: string;
        query: string;
        fragment: string;
    }
    export enum KeyCode {
        DependsOnKbLayout = -1,
        Unknown = 0,
        Backspace = 1,
        Tab = 2,
        Enter = 3,
        Shift = 4,
        Ctrl = 5,
        Alt = 6,
        PauseBreak = 7,
        CapsLock = 8,
        Escape = 9,
        Space = 10,
        PageUp = 11,
        PageDown = 12,
        End = 13,
        Home = 14,
        LeftArrow = 15,
        UpArrow = 16,
        RightArrow = 17,
        DownArrow = 18,
        Insert = 19,
        Delete = 20,
        Digit0 = 21,
        Digit1 = 22,
        Digit2 = 23,
        Digit3 = 24,
        Digit4 = 25,
        Digit5 = 26,
        Digit6 = 27,
        Digit7 = 28,
        Digit8 = 29,
        Digit9 = 30,
        KeyA = 31,
        KeyB = 32,
        KeyC = 33,
        KeyD = 34,
        KeyE = 35,
        KeyF = 36,
        KeyG = 37,
        KeyH = 38,
        KeyI = 39,
        KeyJ = 40,
        KeyK = 41,
        KeyL = 42,
        KeyM = 43,
        KeyN = 44,
        KeyO = 45,
        KeyP = 46,
        KeyQ = 47,
        KeyR = 48,
        KeyS = 49,
        KeyT = 50,
        KeyU = 51,
        KeyV = 52,
        KeyW = 53,
        KeyX = 54,
        KeyY = 55,
        KeyZ = 56,
        Meta = 57,
        ContextMenu = 58,
        F1 = 59,
        F2 = 60,
        F3 = 61,
        F4 = 62,
        F5 = 63,
        F6 = 64,
        F7 = 65,
        F8 = 66,
        F9 = 67,
        F10 = 68,
        F11 = 69,
        F12 = 70,
        F13 = 71,
        F14 = 72,
        F15 = 73,
        F16 = 74,
        F17 = 75,
        F18 = 76,
        F19 = 77,
        NumLock = 78,
        ScrollLock = 79,
        Semicolon = 80,
        Equal = 81,
        Comma = 82,
        Minus = 83,
        Period = 84,
        Slash = 85,
        Backquote = 86,
        BracketLeft = 87,
        Backslash = 88,
        BracketRight = 89,
        Quote = 90,
        OEM_8 = 91,
        IntlBackslash = 92,
        Numpad0 = 93,
        Numpad1 = 94,
        Numpad2 = 95,
        Numpad3 = 96,
        Numpad4 = 97,
        Numpad5 = 98,
        Numpad6 = 99,
        Numpad7 = 100,
        Numpad8 = 101,
        Numpad9 = 102,
        NumpadMultiply = 103,
        NumpadAdd = 104,
        NUMPAD_SEPARATOR = 105,
        NumpadSubtract = 106,
        NumpadDecimal = 107,
        NumpadDivide = 108,
        KEY_IN_COMPOSITION = 109,
        ABNT_C1 = 110,
        ABNT_C2 = 111,
        AudioVolumeMute = 112,
        AudioVolumeUp = 113,
        AudioVolumeDown = 114,
        BrowserSearch = 115,
        BrowserHome = 116,
        BrowserBack = 117,
        BrowserForward = 118,
        MediaTrackNext = 119,
        MediaTrackPrevious = 120,
        MediaStop = 121,
        MediaPlayPause = 122,
        LaunchMediaPlayer = 123,
        LaunchMail = 124,
        LaunchApp2 = 125,
        MAX_VALUE = 126
    }
    export interface IMarkdownString {
        readonly value: string;
        readonly isTrusted?: boolean;
        readonly supportThemeIcons?: boolean;
        readonly supportHtml?: boolean;
        uris?: {
            [href: string]: UriComponents;
        };
    }
    export interface IKeyboardEvent {
        readonly _standardKeyboardEventBrand: true;
        readonly browserEvent: KeyboardEvent;
        readonly target: HTMLElement;
        readonly ctrlKey: boolean;
        readonly shiftKey: boolean;
        readonly altKey: boolean;
        readonly metaKey: boolean;
        readonly keyCode: KeyCode;
        readonly code: string;
        equals(keybinding: number): boolean;
        preventDefault(): void;
        stopPropagation(): void;
    }
    export interface IMouseEvent {
        readonly browserEvent: MouseEvent;
        readonly leftButton: boolean;
        readonly middleButton: boolean;
        readonly rightButton: boolean;
        readonly buttons: number;
        readonly target: HTMLElement;
        readonly detail: number;
        readonly posx: number;
        readonly posy: number;
        readonly ctrlKey: boolean;
        readonly shiftKey: boolean;
        readonly altKey: boolean;
        readonly metaKey: boolean;
        readonly timestamp: number;
        preventDefault(): void;
        stopPropagation(): void;
    }
    export interface IScrollEvent {
        readonly scrollTop: number;
        readonly scrollLeft: number;
        readonly scrollWidth: number;
        readonly scrollHeight: number;
        readonly scrollTopChanged: boolean;
        readonly scrollLeftChanged: boolean;
        readonly scrollWidthChanged: boolean;
        readonly scrollHeightChanged: boolean;
    }
    export interface IPosition {
        readonly lineNumber: number;
        readonly column: number;
    }
    class Position {
        readonly lineNumber: number;
        readonly column: number;
        constructor(lineNumber: number, column: number);
        with(newLineNumber?: number, newColumn?: number): Position;
        delta(deltaLineNumber?: number, deltaColumn?: number): Position;
        equals(other: IPosition): boolean;
        static equals(a: IPosition | null, b: IPosition | null): boolean;
        isBefore(other: IPosition): boolean;
        static isBefore(a: IPosition, b: IPosition): boolean;
        isBeforeOrEqual(other: IPosition): boolean;
        static isBeforeOrEqual(a: IPosition, b: IPosition): boolean;
        static compare(a: IPosition, b: IPosition): number;
        clone(): Position;
        toString(): string;
        static lift(pos: IPosition): Position;
        static isIPosition(obj: any): obj is IPosition;
    }
    export interface IRange {
        readonly startLineNumber: number;
        readonly startColumn: number;
        readonly endLineNumber: number;
        readonly endColumn: number;
    }
    class Range {
        readonly startLineNumber: number;
        readonly startColumn: number;
        readonly endLineNumber: number;
        readonly endColumn: number;
        constructor(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number);
        isEmpty(): boolean;
        static isEmpty(range: IRange): boolean;
        containsPosition(position: IPosition): boolean;
        static containsPosition(range: IRange, position: IPosition): boolean;
        containsRange(range: IRange): boolean;
        static containsRange(range: IRange, otherRange: IRange): boolean;
        strictContainsRange(range: IRange): boolean;
        static strictContainsRange(range: IRange, otherRange: IRange): boolean;
        plusRange(range: IRange): Range;
        static plusRange(a: IRange, b: IRange): Range;
        intersectRanges(range: IRange): Range | null;
        static intersectRanges(a: IRange, b: IRange): Range | null;
        equalsRange(other: IRange | null): boolean;
        static equalsRange(a: IRange | null, b: IRange | null): boolean;
        getEndPosition(): Position;
        static getEndPosition(range: IRange): Position;
        getStartPosition(): Position;
        static getStartPosition(range: IRange): Position;
        toString(): string;
        setEndPosition(endLineNumber: number, endColumn: number): Range;
        setStartPosition(startLineNumber: number, startColumn: number): Range;
        collapseToStart(): Range;
        static collapseToStart(range: IRange): Range;
        static fromPositions(start: IPosition, end?: IPosition): Range;
        static lift(range: undefined | null): null;
        static lift(range: IRange): Range;
        static isIRange(obj: any): obj is IRange;
        static areIntersectingOrTouching(a: IRange, b: IRange): boolean;
        static areIntersecting(a: IRange, b: IRange): boolean;
        static compareRangesUsingStarts(a: IRange | null | undefined, b: IRange | null | undefined): number;
        static compareRangesUsingEnds(a: IRange, b: IRange): number;
        static spansMultipleLines(range: IRange): boolean;
    }
    export interface ISelection {
        readonly selectionStartLineNumber: number;
        readonly selectionStartColumn: number;
        readonly positionLineNumber: number;
        readonly positionColumn: number;
    }
    class Selection extends Range {
        readonly selectionStartLineNumber: number;
        readonly selectionStartColumn: number;
        readonly positionLineNumber: number;
        readonly positionColumn: number;
        constructor(selectionStartLineNumber: number, selectionStartColumn: number, positionLineNumber: number, positionColumn: number);
        toString(): string;
        equalsSelection(other: ISelection): boolean;
        static selectionsEqual(a: ISelection, b: ISelection): boolean;
        getDirection(): SelectionDirection;
        setEndPosition(endLineNumber: number, endColumn: number): Selection;
        getPosition(): Position;
        getSelectionStart(): Position;
        setStartPosition(startLineNumber: number, startColumn: number): Selection;
        static fromPositions(start: IPosition, end?: IPosition): Selection;
        static fromRange(range: Range, direction: SelectionDirection): Selection;
        static liftSelection(sel: ISelection): Selection;
        static selectionsArrEqual(a: ISelection[], b: ISelection[]): boolean;
        static isISelection(obj: any): obj is ISelection;
        static createWithDirection(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, direction: SelectionDirection): Selection;
    }
    export enum SelectionDirection {
        LTR = 0,
        RTL = 1
    }
    class Token {
        _tokenBrand: void;
        readonly offset: number;
        readonly type: string;
        readonly language: string;
        constructor(offset: number, type: string, language: string);
        toString(): string;
    }
    export namespace editor {
        interface IDiffNavigator {
            canNavigate(): boolean;
            next(): void;
            previous(): void;
            dispose(): void;
        }
        function create(domElement: HTMLElement, options?: IStandaloneEditorConstructionOptions, override?: IEditorOverrideServices): IStandaloneCodeEditor;
        function onDidCreateEditor(listener: (codeEditor: ICodeEditor) => void): IDisposable;
        function createDiffEditor(domElement: HTMLElement, options?: IStandaloneDiffEditorConstructionOptions, override?: IEditorOverrideServices): IStandaloneDiffEditor;
        interface IDiffNavigatorOptions {
            readonly followsCaret?: boolean;
            readonly ignoreCharChanges?: boolean;
            readonly alwaysRevealFirst?: boolean;
        }
        function createDiffNavigator(diffEditor: IStandaloneDiffEditor, opts?: IDiffNavigatorOptions): IDiffNavigator;
        function createModel(value: string, language?: string, uri?: Uri): ITextModel;
        function setModelLanguage(model: ITextModel, languageId: string): void;
        function setModelMarkers(model: ITextModel, owner: string, markers: IMarkerData[]): void;
        function getModelMarkers(filter: {
            owner?: string;
            resource?: Uri;
            take?: number;
        }): IMarker[];
        function onDidChangeMarkers(listener: (e: readonly Uri[]) => void): IDisposable;
        function getModel(uri: Uri): ITextModel | null;
        function getModels(): ITextModel[];
        function onDidCreateModel(listener: (model: ITextModel) => void): IDisposable;
        function onWillDisposeModel(listener: (model: ITextModel) => void): IDisposable;
        function onDidChangeModelLanguage(listener: (e: {
            readonly model: ITextModel;
            readonly oldLanguage: string;
        }) => void): IDisposable;
        function createWebWorker<T>(opts: IWebWorkerOptions): MonacoWebWorker<T>;
        function colorizeElement(domNode: HTMLElement, options: IColorizerElementOptions): Promise<void>;
        function colorize(text: string, languageId: string, options: IColorizerOptions): Promise<string>;
        function colorizeModelLine(model: ITextModel, lineNumber: number, tabSize?: number): string;
        function tokenize(text: string, languageId: string): Token[][];
        function defineTheme(themeName: string, themeData: IStandaloneThemeData): void;
        function setTheme(themeName: string): void;
        function remeasureFonts(): void;
        function registerCommand(id: string, handler: (accessor: any, ...args: any[]) => void): IDisposable;
        type BuiltinTheme = 'vs' | 'vs-dark' | 'hc-black';
        interface IStandaloneThemeData {
            base: BuiltinTheme;
            inherit: boolean;
            rules: ITokenThemeRule[];
            encodedTokensColors?: string[];
            colors: IColors;
        }
        type IColors = {
            [colorId: string]: string;
        };
        interface ITokenThemeRule {
            token: string;
            foreground?: string;
            background?: string;
            fontStyle?: string;
        }
        interface MonacoWebWorker<T> {
            dispose(): void;
            getProxy(): Promise<T>;
            withSyncedResources(resources: Uri[]): Promise<T>;
        }
        interface IWebWorkerOptions {
            moduleId: string;
            createData?: any;
            label?: string;
            host?: any;
            keepIdleModels?: boolean;
        }
        interface IActionDescriptor {
            id: string;
            label: string;
            precondition?: string;
            keybindings?: number[];
            keybindingContext?: string;
            contextMenuGroupId?: string;
            contextMenuOrder?: number;
            run(editor: ICodeEditor, ...args: any[]): void | Promise<void>;
        }
        interface IGlobalEditorOptions {
            tabSize?: number;
            insertSpaces?: boolean;
            detectIndentation?: boolean;
            trimAutoWhitespace?: boolean;
            largeFileOptimizations?: boolean;
            wordBasedSuggestions?: boolean;
            wordBasedSuggestionsOnlySameLanguage?: boolean;
            'semanticHighlighting.enabled'?: true | false | 'configuredByTheme';
            stablePeek?: boolean;
            maxTokenizationLineLength?: number;
            theme?: string;
            autoDetectHighContrast?: boolean;
        }
        interface IStandaloneEditorConstructionOptions extends IEditorConstructionOptions, IGlobalEditorOptions {
            model?: ITextModel | null;
            value?: string;
            language?: string;
            theme?: string;
            autoDetectHighContrast?: boolean;
            accessibilityHelpUrl?: string;
            ariaContainerElement?: HTMLElement;
        }
        interface IStandaloneDiffEditorConstructionOptions extends IDiffEditorConstructionOptions {
            theme?: string;
            autoDetectHighContrast?: boolean;
        }
        interface IStandaloneCodeEditor extends ICodeEditor {
            updateOptions(newOptions: IEditorOptions & IGlobalEditorOptions): void;
            addCommand(keybinding: number, handler: ICommandHandler, context?: string): string | null;
            createContextKey<T>(key: string, defaultValue: T): IContextKey<T>;
            addAction(descriptor: IActionDescriptor): IDisposable;
        }
        interface IStandaloneDiffEditor extends IDiffEditor {
            addCommand(keybinding: number, handler: ICommandHandler, context?: string): string | null;
            createContextKey<T>(key: string, defaultValue: T): IContextKey<T>;
            addAction(descriptor: IActionDescriptor): IDisposable;
            getOriginalEditor(): IStandaloneCodeEditor;
            getModifiedEditor(): IStandaloneCodeEditor;
        }
        interface ICommandHandler {
            (...args: any[]): void;
        }
        interface IContextKey<T> {
            set(value: T): void;
            reset(): void;
            get(): T | undefined;
        }
        interface IEditorOverrideServices {
            [index: string]: any;
        }
        interface IMarker {
            owner: string;
            resource: Uri;
            severity: MarkerSeverity;
            code?: string | {
                value: string;
                target: Uri;
            };
            message: string;
            source?: string;
            startLineNumber: number;
            startColumn: number;
            endLineNumber: number;
            endColumn: number;
            relatedInformation?: IRelatedInformation[];
            tags?: MarkerTag[];
        }
        interface IMarkerData {
            code?: string | {
                value: string;
                target: Uri;
            };
            severity: MarkerSeverity;
            message: string;
            source?: string;
            startLineNumber: number;
            startColumn: number;
            endLineNumber: number;
            endColumn: number;
            relatedInformation?: IRelatedInformation[];
            tags?: MarkerTag[];
        }
        interface IRelatedInformation {
            resource: Uri;
            message: string;
            startLineNumber: number;
            startColumn: number;
            endLineNumber: number;
            endColumn: number;
        }
        interface IColorizerOptions {
            tabSize?: number;
        }
        interface IColorizerElementOptions extends IColorizerOptions {
            theme?: string;
            mimeType?: string;
        }
        enum ScrollbarVisibility {
            Auto = 1,
            Hidden = 2,
            Visible = 3
        }
        interface ThemeColor {
            id: string;
        }
        enum OverviewRulerLane {
            Left = 1,
            Center = 2,
            Right = 4,
            Full = 7
        }
        enum MinimapPosition {
            Inline = 1,
            Gutter = 2
        }
        interface IDecorationOptions {
            color: string | ThemeColor | undefined;
            darkColor?: string | ThemeColor;
        }
        interface IModelDecorationOverviewRulerOptions extends IDecorationOptions {
            position: OverviewRulerLane;
        }
        interface IModelDecorationMinimapOptions extends IDecorationOptions {
            position: MinimapPosition;
        }
        interface IModelDecorationOptions {
            stickiness?: TrackedRangeStickiness;
            className?: string | null;
            glyphMarginHoverMessage?: IMarkdownString | IMarkdownString[] | null;
            hoverMessage?: IMarkdownString | IMarkdownString[] | null;
            isWholeLine?: boolean;
            zIndex?: number;
            overviewRuler?: IModelDecorationOverviewRulerOptions | null;
            minimap?: IModelDecorationMinimapOptions | null;
            glyphMarginClassName?: string | null;
            linesDecorationsClassName?: string | null;
            firstLineDecorationClassName?: string | null;
            marginClassName?: string | null;
            inlineClassName?: string | null;
            inlineClassNameAffectsLetterSpacing?: boolean;
            beforeContentClassName?: string | null;
            afterContentClassName?: string | null;
            after?: InjectedTextOptions | null;
            before?: InjectedTextOptions | null;
        }
        interface InjectedTextOptions {
            readonly content: string;
            readonly inlineClassName?: string | null;
            readonly inlineClassNameAffectsLetterSpacing?: boolean;
        }
        interface IModelDeltaDecoration {
            range: IRange;
            options: IModelDecorationOptions;
        }
        interface IModelDecoration {
            readonly id: string;
            readonly ownerId: number;
            readonly range: Range;
            readonly options: IModelDecorationOptions;
        }
        interface IWordAtPosition {
            readonly word: string;
            readonly startColumn: number;
            readonly endColumn: number;
        }
        enum EndOfLinePreference {
            TextDefined = 0,
            LF = 1,
            CRLF = 2
        }
        enum DefaultEndOfLine {
            LF = 1,
            CRLF = 2
        }
        enum EndOfLineSequence {
            LF = 0,
            CRLF = 1
        }
        interface ISingleEditOperation {
            range: IRange;
            text: string | null;
            forceMoveMarkers?: boolean;
        }
        interface IIdentifiedSingleEditOperation {
            range: IRange;
            text: string | null;
            forceMoveMarkers?: boolean;
        }
        interface IValidEditOperation {
            range: Range;
            text: string;
        }
        interface ICursorStateComputer {
            (inverseEditOperations: IValidEditOperation[]): Selection[] | null;
        }
        class TextModelResolvedOptions {
            _textModelResolvedOptionsBrand: void;
            readonly tabSize: number;
            readonly indentSize: number;
            readonly insertSpaces: boolean;
            readonly defaultEOL: DefaultEndOfLine;
            readonly trimAutoWhitespace: boolean;
            readonly bracketPairColorizationOptions: BracketPairColorizationOptions;
        }
        interface BracketPairColorizationOptions {
            enabled: boolean;
        }
        interface ITextModelUpdateOptions {
            tabSize?: number;
            indentSize?: number;
            insertSpaces?: boolean;
            trimAutoWhitespace?: boolean;
            bracketColorizationOptions?: BracketPairColorizationOptions;
        }
        class FindMatch {
            _findMatchBrand: void;
            readonly range: Range;
            readonly matches: string[] | null;
        }
        enum TrackedRangeStickiness {
            AlwaysGrowsWhenTypingAtEdges = 0,
            NeverGrowsWhenTypingAtEdges = 1,
            GrowsOnlyWhenTypingBefore = 2,
            GrowsOnlyWhenTypingAfter = 3
        }
        interface ITextModel {
            readonly uri: Uri;
            readonly id: string;
            getOptions(): TextModelResolvedOptions;
            getVersionId(): number;
            getAlternativeVersionId(): number;
            setValue(newValue: string): void;
            getValue(eol?: EndOfLinePreference, preserveBOM?: boolean): string;
            getValueLength(eol?: EndOfLinePreference, preserveBOM?: boolean): number;
            getValueInRange(range: IRange, eol?: EndOfLinePreference): string;
            getValueLengthInRange(range: IRange): number;
            getCharacterCountInRange(range: IRange): number;
            getLineCount(): number;
            getLineContent(lineNumber: number): string;
            getLineLength(lineNumber: number): number;
            getLinesContent(): string[];
            getEOL(): string;
            getEndOfLineSequence(): EndOfLineSequence;
            getLineMinColumn(lineNumber: number): number;
            getLineMaxColumn(lineNumber: number): number;
            getLineFirstNonWhitespaceColumn(lineNumber: number): number;
            getLineLastNonWhitespaceColumn(lineNumber: number): number;
            validatePosition(position: IPosition): Position;
            modifyPosition(position: IPosition, offset: number): Position;
            validateRange(range: IRange): Range;
            getOffsetAt(position: IPosition): number;
            getPositionAt(offset: number): Position;
            getFullModelRange(): Range;
            isDisposed(): boolean;
            findMatches(searchString: string, searchOnlyEditableRange: boolean, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean, limitResultCount?: number): FindMatch[];
            findMatches(searchString: string, searchScope: IRange | IRange[], isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean, limitResultCount?: number): FindMatch[];
            findNextMatch(searchString: string, searchStart: IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean): FindMatch | null;
            findPreviousMatch(searchString: string, searchStart: IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean): FindMatch | null;
            getLanguageId(): string;
            getWordAtPosition(position: IPosition): IWordAtPosition | null;
            getWordUntilPosition(position: IPosition): IWordAtPosition;
            deltaDecorations(oldDecorations: string[], newDecorations: IModelDeltaDecoration[], ownerId?: number): string[];
            getDecorationOptions(id: string): IModelDecorationOptions | null;
            getDecorationRange(id: string): Range | null;
            getLineDecorations(lineNumber: number, ownerId?: number, filterOutValidation?: boolean): IModelDecoration[];
            getLinesDecorations(startLineNumber: number, endLineNumber: number, ownerId?: number, filterOutValidation?: boolean): IModelDecoration[];
            getDecorationsInRange(range: IRange, ownerId?: number, filterOutValidation?: boolean): IModelDecoration[];
            getAllDecorations(ownerId?: number, filterOutValidation?: boolean): IModelDecoration[];
            getOverviewRulerDecorations(ownerId?: number, filterOutValidation?: boolean): IModelDecoration[];
            getInjectedTextDecorations(ownerId?: number): IModelDecoration[];
            normalizeIndentation(str: string): string;
            updateOptions(newOpts: ITextModelUpdateOptions): void;
            detectIndentation(defaultInsertSpaces: boolean, defaultTabSize: number): void;
            pushStackElement(): void;
            popStackElement(): void;
            pushEditOperations(beforeCursorState: Selection[] | null, editOperations: IIdentifiedSingleEditOperation[], cursorStateComputer: ICursorStateComputer): Selection[] | null;
            pushEOL(eol: EndOfLineSequence): void;
            applyEdits(operations: IIdentifiedSingleEditOperation[]): void;
            applyEdits(operations: IIdentifiedSingleEditOperation[], computeUndoEdits: false): void;
            applyEdits(operations: IIdentifiedSingleEditOperation[], computeUndoEdits: true): IValidEditOperation[];
            setEOL(eol: EndOfLineSequence): void;
            onDidChangeContent(listener: (e: IModelContentChangedEvent) => void): IDisposable;
            onDidChangeDecorations(listener: (e: IModelDecorationsChangedEvent) => void): IDisposable;
            onDidChangeOptions(listener: (e: IModelOptionsChangedEvent) => void): IDisposable;
            onDidChangeLanguage(listener: (e: IModelLanguageChangedEvent) => void): IDisposable;
            onDidChangeLanguageConfiguration(listener: (e: IModelLanguageConfigurationChangedEvent) => void): IDisposable;
            onDidChangeAttached(listener: () => void): IDisposable;
            onWillDispose(listener: () => void): IDisposable;
            dispose(): void;
            isAttachedToEditor(): boolean;
        }
        interface IEditOperationBuilder {
            addEditOperation(range: IRange, text: string | null, forceMoveMarkers?: boolean): void;
            addTrackedEditOperation(range: IRange, text: string | null, forceMoveMarkers?: boolean): void;
            trackSelection(selection: Selection, trackPreviousOnEmpty?: boolean): string;
        }
        interface ICursorStateComputerData {
            getInverseEditOperations(): IValidEditOperation[];
            getTrackedSelection(id: string): Selection;
        }
        interface ICommand {
            getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void;
            computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection;
        }
        interface IDiffEditorModel {
            original: ITextModel;
            modified: ITextModel;
        }
        interface IModelChangedEvent {
            readonly oldModelUrl: Uri | null;
            readonly newModelUrl: Uri | null;
        }
        interface IDimension {
            width: number;
            height: number;
        }
        interface IChange {
            readonly originalStartLineNumber: number;
            readonly originalEndLineNumber: number;
            readonly modifiedStartLineNumber: number;
            readonly modifiedEndLineNumber: number;
        }
        interface ICharChange extends IChange {
            readonly originalStartColumn: number;
            readonly originalEndColumn: number;
            readonly modifiedStartColumn: number;
            readonly modifiedEndColumn: number;
        }
        interface ILineChange extends IChange {
            readonly charChanges: ICharChange[] | undefined;
        }
        interface IContentSizeChangedEvent {
            readonly contentWidth: number;
            readonly contentHeight: number;
            readonly contentWidthChanged: boolean;
            readonly contentHeightChanged: boolean;
        }
        interface INewScrollPosition {
            scrollLeft?: number;
            scrollTop?: number;
        }
        interface IEditorAction {
            readonly id: string;
            readonly label: string;
            readonly alias: string;
            isSupported(): boolean;
            run(): Promise<void>;
        }
        type IEditorModel = ITextModel | IDiffEditorModel;
        interface ICursorState {
            inSelectionMode: boolean;
            selectionStart: IPosition;
            position: IPosition;
        }
        interface IViewState {
            scrollTop?: number;
            scrollTopWithoutViewZones?: number;
            scrollLeft: number;
            firstPosition: IPosition;
            firstPositionDeltaTop: number;
        }
        interface ICodeEditorViewState {
            cursorState: ICursorState[];
            viewState: IViewState;
            contributionsState: {
                [id: string]: any;
            };
        }
        interface IDiffEditorViewState {
            original: ICodeEditorViewState | null;
            modified: ICodeEditorViewState | null;
        }
        type IEditorViewState = ICodeEditorViewState | IDiffEditorViewState;
        enum ScrollType {
            Smooth = 0,
            Immediate = 1
        }
        interface IEditor {
            onDidDispose(listener: () => void): IDisposable;
            dispose(): void;
            getId(): string;
            getEditorType(): string;
            updateOptions(newOptions: IEditorOptions): void;
            layout(dimension?: IDimension): void;
            focus(): void;
            hasTextFocus(): boolean;
            getSupportedActions(): IEditorAction[];
            saveViewState(): IEditorViewState | null;
            restoreViewState(state: IEditorViewState): void;
            getVisibleColumnFromPosition(position: IPosition): number;
            getPosition(): Position | null;
            setPosition(position: IPosition): void;
            revealLine(lineNumber: number, scrollType?: ScrollType): void;
            revealLineInCenter(lineNumber: number, scrollType?: ScrollType): void;
            revealLineInCenterIfOutsideViewport(lineNumber: number, scrollType?: ScrollType): void;
            revealLineNearTop(lineNumber: number, scrollType?: ScrollType): void;
            revealPosition(position: IPosition, scrollType?: ScrollType): void;
            revealPositionInCenter(position: IPosition, scrollType?: ScrollType): void;
            revealPositionInCenterIfOutsideViewport(position: IPosition, scrollType?: ScrollType): void;
            revealPositionNearTop(position: IPosition, scrollType?: ScrollType): void;
            getSelection(): Selection | null;
            getSelections(): Selection[] | null;
            setSelection(selection: IRange): void;
            setSelection(selection: Range): void;
            setSelection(selection: ISelection): void;
            setSelection(selection: Selection): void;
            setSelections(selections: readonly ISelection[]): void;
            revealLines(startLineNumber: number, endLineNumber: number, scrollType?: ScrollType): void;
            revealLinesInCenter(lineNumber: number, endLineNumber: number, scrollType?: ScrollType): void;
            revealLinesInCenterIfOutsideViewport(lineNumber: number, endLineNumber: number, scrollType?: ScrollType): void;
            revealLinesNearTop(lineNumber: number, endLineNumber: number, scrollType?: ScrollType): void;
            revealRange(range: IRange, scrollType?: ScrollType): void;
            revealRangeInCenter(range: IRange, scrollType?: ScrollType): void;
            revealRangeAtTop(range: IRange, scrollType?: ScrollType): void;
            revealRangeInCenterIfOutsideViewport(range: IRange, scrollType?: ScrollType): void;
            revealRangeNearTop(range: IRange, scrollType?: ScrollType): void;
            revealRangeNearTopIfOutsideViewport(range: IRange, scrollType?: ScrollType): void;
            trigger(source: string | null | undefined, handlerId: string, payload: any): void;
            getModel(): IEditorModel | null;
            setModel(model: IEditorModel | null): void;
        }
        interface IEditorContribution {
            dispose(): void;
            saveViewState?(): any;
            restoreViewState?(state: any): void;
        }
        const EditorType: {
            ICodeEditor: string;
            IDiffEditor: string;
        };
        interface IModelLanguageChangedEvent {
            readonly oldLanguage: string;
            readonly newLanguage: string;
        }
        interface IModelLanguageConfigurationChangedEvent {
        }
        interface IModelContentChange {
            readonly range: IRange;
            readonly rangeOffset: number;
            readonly rangeLength: number;
            readonly text: string;
        }
        interface IModelContentChangedEvent {
            readonly changes: IModelContentChange[];
            readonly eol: string;
            readonly versionId: number;
            readonly isUndoing: boolean;
            readonly isRedoing: boolean;
            readonly isFlush: boolean;
        }
        interface IModelDecorationsChangedEvent {
            readonly affectsMinimap: boolean;
            readonly affectsOverviewRuler: boolean;
        }
        interface IModelOptionsChangedEvent {
            readonly tabSize: boolean;
            readonly indentSize: boolean;
            readonly insertSpaces: boolean;
            readonly trimAutoWhitespace: boolean;
        }
        enum CursorChangeReason {
            NotSet = 0,
            ContentFlush = 1,
            RecoverFromMarkers = 2,
            Explicit = 3,
            Paste = 4,
            Undo = 5,
            Redo = 6
        }
        interface ICursorPositionChangedEvent {
            readonly position: Position;
            readonly secondaryPositions: Position[];
            readonly reason: CursorChangeReason;
            readonly source: string;
        }
        interface ICursorSelectionChangedEvent {
            readonly selection: Selection;
            readonly secondarySelections: Selection[];
            readonly modelVersionId: number;
            readonly oldSelections: Selection[] | null;
            readonly oldModelVersionId: number;
            readonly source: string;
            readonly reason: CursorChangeReason;
        }
        enum AccessibilitySupport {
            Unknown = 0,
            Disabled = 1,
            Enabled = 2
        }
        type EditorAutoClosingStrategy = 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
        type EditorAutoSurroundStrategy = 'languageDefined' | 'quotes' | 'brackets' | 'never';
        type EditorAutoClosingEditStrategy = 'always' | 'auto' | 'never';
        enum EditorAutoIndentStrategy {
            None = 0,
            Keep = 1,
            Brackets = 2,
            Advanced = 3,
            Full = 4
        }
        interface IEditorOptions {
            inDiffEditor?: boolean;
            ariaLabel?: string;
            tabIndex?: number;
            rulers?: (number | IRulerOption)[];
            wordSeparators?: string;
            selectionClipboard?: boolean;
            lineNumbers?: LineNumbersType;
            cursorSurroundingLines?: number;
            cursorSurroundingLinesStyle?: 'default' | 'all';
            renderFinalNewline?: boolean;
            unusualLineTerminators?: 'auto' | 'off' | 'prompt';
            selectOnLineNumbers?: boolean;
            lineNumbersMinChars?: number;
            glyphMargin?: boolean;
            lineDecorationsWidth?: number | string;
            revealHorizontalRightPadding?: number;
            roundedSelection?: boolean;
            extraEditorClassName?: string;
            readOnly?: boolean;
            domReadOnly?: boolean;
            linkedEditing?: boolean;
            renameOnType?: boolean;
            renderValidationDecorations?: 'editable' | 'on' | 'off';
            scrollbar?: IEditorScrollbarOptions;
            minimap?: IEditorMinimapOptions;
            find?: IEditorFindOptions;
            fixedOverflowWidgets?: boolean;
            overviewRulerLanes?: number;
            overviewRulerBorder?: boolean;
            cursorBlinking?: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
            mouseWheelZoom?: boolean;
            mouseStyle?: 'text' | 'default' | 'copy';
            cursorSmoothCaretAnimation?: boolean;
            cursorStyle?: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
            cursorWidth?: number;
            fontLigatures?: boolean | string;
            disableLayerHinting?: boolean;
            disableMonospaceOptimizations?: boolean;
            hideCursorInOverviewRuler?: boolean;
            scrollBeyondLastLine?: boolean;
            scrollBeyondLastColumn?: number;
            smoothScrolling?: boolean;
            automaticLayout?: boolean;
            wordWrap?: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
            wordWrapOverride1?: 'off' | 'on' | 'inherit';
            wordWrapOverride2?: 'off' | 'on' | 'inherit';
            wordWrapColumn?: number;
            wrappingIndent?: 'none' | 'same' | 'indent' | 'deepIndent';
            wrappingStrategy?: 'simple' | 'advanced';
            wordWrapBreakBeforeCharacters?: string;
            wordWrapBreakAfterCharacters?: string;
            stopRenderingLineAfter?: number;
            hover?: IEditorHoverOptions;
            links?: boolean;
            colorDecorators?: boolean;
            comments?: IEditorCommentsOptions;
            contextmenu?: boolean;
            mouseWheelScrollSensitivity?: number;
            fastScrollSensitivity?: number;
            scrollPredominantAxis?: boolean;
            columnSelection?: boolean;
            multiCursorModifier?: 'ctrlCmd' | 'alt';
            multiCursorMergeOverlapping?: boolean;
            multiCursorPaste?: 'spread' | 'full';
            accessibilitySupport?: 'auto' | 'off' | 'on';
            accessibilityPageSize?: number;
            suggest?: ISuggestOptions;
            inlineSuggest?: IInlineSuggestOptions;
            smartSelect?: ISmartSelectOptions;
            gotoLocation?: IGotoLocationOptions;
            quickSuggestions?: boolean | IQuickSuggestionsOptions;
            quickSuggestionsDelay?: number;
            padding?: IEditorPaddingOptions;
            parameterHints?: IEditorParameterHintOptions;
            autoClosingBrackets?: EditorAutoClosingStrategy;
            autoClosingQuotes?: EditorAutoClosingStrategy;
            autoClosingDelete?: EditorAutoClosingEditStrategy;
            autoClosingOvertype?: EditorAutoClosingEditStrategy;
            autoSurround?: EditorAutoSurroundStrategy;
            autoIndent?: 'none' | 'keep' | 'brackets' | 'advanced' | 'full';
            stickyTabStops?: boolean;
            formatOnType?: boolean;
            formatOnPaste?: boolean;
            dragAndDrop?: boolean;
            suggestOnTriggerCharacters?: boolean;
            acceptSuggestionOnEnter?: 'on' | 'smart' | 'off';
            acceptSuggestionOnCommitCharacter?: boolean;
            snippetSuggestions?: 'top' | 'bottom' | 'inline' | 'none';
            emptySelectionClipboard?: boolean;
            copyWithSyntaxHighlighting?: boolean;
            suggestSelection?: 'first' | 'recentlyUsed' | 'recentlyUsedByPrefix';
            suggestFontSize?: number;
            suggestLineHeight?: number;
            tabCompletion?: 'on' | 'off' | 'onlySnippets';
            selectionHighlight?: boolean;
            occurrencesHighlight?: boolean;
            codeLens?: boolean;
            codeLensFontFamily?: string;
            codeLensFontSize?: number;
            lightbulb?: IEditorLightbulbOptions;
            codeActionsOnSaveTimeout?: number;
            folding?: boolean;
            foldingStrategy?: 'auto' | 'indentation';
            foldingHighlight?: boolean;
            foldingImportsByDefault?: boolean;
            showFoldingControls?: 'always' | 'mouseover';
            unfoldOnClickAfterEndOfLine?: boolean;
            matchBrackets?: 'never' | 'near' | 'always';
            renderWhitespace?: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
            renderControlCharacters?: boolean;
            renderLineHighlight?: 'none' | 'gutter' | 'line' | 'all';
            renderLineHighlightOnlyWhenFocus?: boolean;
            useTabStops?: boolean;
            fontFamily?: string;
            fontWeight?: string;
            fontSize?: number;
            lineHeight?: number;
            letterSpacing?: number;
            showUnused?: boolean;
            peekWidgetDefaultFocus?: 'tree' | 'editor';
            definitionLinkOpensInPeek?: boolean;
            showDeprecated?: boolean;
            inlayHints?: IEditorInlayHintsOptions;
            useShadowDOM?: boolean;
            guides?: IGuidesOptions;
            unicodeHighlight?: IUnicodeHighlightOptions;
        }
        interface IDiffEditorBaseOptions {
            enableSplitViewResizing?: boolean;
            renderSideBySide?: boolean;
            maxComputationTime?: number;
            maxFileSize?: number;
            ignoreTrimWhitespace?: boolean;
            renderIndicators?: boolean;
            originalEditable?: boolean;
            diffCodeLens?: boolean;
            renderOverviewRuler?: boolean;
            diffWordWrap?: 'off' | 'on' | 'inherit';
        }
        interface IDiffEditorOptions extends IEditorOptions, IDiffEditorBaseOptions {
        }
        class ConfigurationChangedEvent {
            hasChanged(id: EditorOption): boolean;
        }
        interface IComputedEditorOptions {
            get<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T>;
        }
        interface IEditorOption<K1 extends EditorOption, V> {
            readonly id: K1;
            readonly name: string;
            defaultValue: V;
            applyUpdate(value: V, update: V): ApplyUpdateResult<V>;
        }
        class ApplyUpdateResult<T> {
            readonly newValue: T;
            readonly didChange: boolean;
            constructor(newValue: T, didChange: boolean);
        }
        interface IEditorCommentsOptions {
            insertSpace?: boolean;
            ignoreEmptyLines?: boolean;
        }
        enum TextEditorCursorBlinkingStyle {
            Hidden = 0,
            Blink = 1,
            Smooth = 2,
            Phase = 3,
            Expand = 4,
            Solid = 5
        }
        enum TextEditorCursorStyle {
            Line = 1,
            Block = 2,
            Underline = 3,
            LineThin = 4,
            BlockOutline = 5,
            UnderlineThin = 6
        }
        interface IEditorFindOptions {
            cursorMoveOnType?: boolean;
            seedSearchStringFromSelection?: 'never' | 'always' | 'selection';
            autoFindInSelection?: 'never' | 'always' | 'multiline';
            addExtraSpaceOnTop?: boolean;
            loop?: boolean;
        }
        type GoToLocationValues = 'peek' | 'gotoAndPeek' | 'goto';
        interface IGotoLocationOptions {
            multiple?: GoToLocationValues;
            multipleDefinitions?: GoToLocationValues;
            multipleTypeDefinitions?: GoToLocationValues;
            multipleDeclarations?: GoToLocationValues;
            multipleImplementations?: GoToLocationValues;
            multipleReferences?: GoToLocationValues;
            alternativeDefinitionCommand?: string;
            alternativeTypeDefinitionCommand?: string;
            alternativeDeclarationCommand?: string;
            alternativeImplementationCommand?: string;
            alternativeReferenceCommand?: string;
        }
        interface IEditorHoverOptions {
            enabled?: boolean;
            delay?: number;
            sticky?: boolean;
            above?: boolean;
        }
        interface OverviewRulerPosition {
            readonly width: number;
            readonly height: number;
            readonly top: number;
            readonly right: number;
        }
        enum RenderMinimap {
            None = 0,
            Text = 1,
            Blocks = 2
        }
        interface EditorLayoutInfo {
            readonly width: number;
            readonly height: number;
            readonly glyphMarginLeft: number;
            readonly glyphMarginWidth: number;
            readonly lineNumbersLeft: number;
            readonly lineNumbersWidth: number;
            readonly decorationsLeft: number;
            readonly decorationsWidth: number;
            readonly contentLeft: number;
            readonly contentWidth: number;
            readonly minimap: EditorMinimapLayoutInfo;
            readonly viewportColumn: number;
            readonly isWordWrapMinified: boolean;
            readonly isViewportWrapping: boolean;
            readonly wrappingColumn: number;
            readonly verticalScrollbarWidth: number;
            readonly horizontalScrollbarHeight: number;
            readonly overviewRuler: OverviewRulerPosition;
        }
        interface EditorMinimapLayoutInfo {
            readonly renderMinimap: RenderMinimap;
            readonly minimapLeft: number;
            readonly minimapWidth: number;
            readonly minimapHeightIsEditorHeight: boolean;
            readonly minimapIsSampling: boolean;
            readonly minimapScale: number;
            readonly minimapLineHeight: number;
            readonly minimapCanvasInnerWidth: number;
            readonly minimapCanvasInnerHeight: number;
            readonly minimapCanvasOuterWidth: number;
            readonly minimapCanvasOuterHeight: number;
        }
        interface IEditorLightbulbOptions {
            enabled?: boolean;
        }
        interface IEditorInlayHintsOptions {
            enabled?: boolean;
            fontSize?: number;
            fontFamily?: string;
        }
        interface IEditorMinimapOptions {
            enabled?: boolean;
            side?: 'right' | 'left';
            size?: 'proportional' | 'fill' | 'fit';
            showSlider?: 'always' | 'mouseover';
            renderCharacters?: boolean;
            maxColumn?: number;
            scale?: number;
        }
        interface IEditorPaddingOptions {
            top?: number;
            bottom?: number;
        }
        interface IEditorParameterHintOptions {
            enabled?: boolean;
            cycle?: boolean;
        }
        interface IQuickSuggestionsOptions {
            other?: boolean;
            comments?: boolean;
            strings?: boolean;
        }
        type LineNumbersType = 'on' | 'off' | 'relative' | 'interval' | ((lineNumber: number) => string);
        enum RenderLineNumbersType {
            Off = 0,
            On = 1,
            Relative = 2,
            Interval = 3,
            Custom = 4
        }
        interface InternalEditorRenderLineNumbersOptions {
            readonly renderType: RenderLineNumbersType;
            readonly renderFn: ((lineNumber: number) => string) | null;
        }
        interface IRulerOption {
            readonly column: number;
            readonly color: string | null;
        }
        interface IEditorScrollbarOptions {
            arrowSize?: number;
            vertical?: 'auto' | 'visible' | 'hidden';
            horizontal?: 'auto' | 'visible' | 'hidden';
            useShadows?: boolean;
            verticalHasArrows?: boolean;
            horizontalHasArrows?: boolean;
            handleMouseWheel?: boolean;
            alwaysConsumeMouseWheel?: boolean;
            horizontalScrollbarSize?: number;
            verticalScrollbarSize?: number;
            verticalSliderSize?: number;
            horizontalSliderSize?: number;
            scrollByPage?: boolean;
        }
        interface InternalEditorScrollbarOptions {
            readonly arrowSize: number;
            readonly vertical: ScrollbarVisibility;
            readonly horizontal: ScrollbarVisibility;
            readonly useShadows: boolean;
            readonly verticalHasArrows: boolean;
            readonly horizontalHasArrows: boolean;
            readonly handleMouseWheel: boolean;
            readonly alwaysConsumeMouseWheel: boolean;
            readonly horizontalScrollbarSize: number;
            readonly horizontalSliderSize: number;
            readonly verticalScrollbarSize: number;
            readonly verticalSliderSize: number;
            readonly scrollByPage: boolean;
        }
        type InUntrustedWorkspace = 'inUntrustedWorkspace';
        interface IUnicodeHighlightOptions {
            nonBasicASCII?: boolean | InUntrustedWorkspace;
            invisibleCharacters?: boolean;
            ambiguousCharacters?: boolean;
            includeComments?: boolean | InUntrustedWorkspace;
            allowedCharacters?: Record<string, true>;
        }
        interface IInlineSuggestOptions {
            enabled?: boolean;
            mode?: 'prefix' | 'subword' | 'subwordSmart';
        }
        interface IBracketPairColorizationOptions {
            enabled?: boolean;
        }
        interface IGuidesOptions {
            bracketPairs?: boolean | 'active';
            bracketPairsHorizontal?: boolean | 'active';
            highlightActiveBracketPair?: boolean;
            indentation?: boolean;
            highlightActiveIndentation?: boolean;
        }
        interface ISuggestOptions {
            insertMode?: 'insert' | 'replace';
            filterGraceful?: boolean;
            snippetsPreventQuickSuggestions?: boolean;
            localityBonus?: boolean;
            shareSuggestSelections?: boolean;
            showIcons?: boolean;
            showStatusBar?: boolean;
            preview?: boolean;
            previewMode?: 'prefix' | 'subword' | 'subwordSmart';
            showInlineDetails?: boolean;
            showMethods?: boolean;
            showFunctions?: boolean;
            showConstructors?: boolean;
            showDeprecated?: boolean;
            showFields?: boolean;
            showVariables?: boolean;
            showClasses?: boolean;
            showStructs?: boolean;
            showInterfaces?: boolean;
            showModules?: boolean;
            showProperties?: boolean;
            showEvents?: boolean;
            showOperators?: boolean;
            showUnits?: boolean;
            showValues?: boolean;
            showConstants?: boolean;
            showEnums?: boolean;
            showEnumMembers?: boolean;
            showKeywords?: boolean;
            showWords?: boolean;
            showColors?: boolean;
            showFiles?: boolean;
            showReferences?: boolean;
            showFolders?: boolean;
            showTypeParameters?: boolean;
            showIssues?: boolean;
            showUsers?: boolean;
            showSnippets?: boolean;
        }
        interface ISmartSelectOptions {
            selectLeadingAndTrailingWhitespace?: boolean;
        }
        enum WrappingIndent {
            None = 0,
            Same = 1,
            Indent = 2,
            DeepIndent = 3
        }
        interface EditorWrappingInfo {
            readonly isDominatedByLongLines: boolean;
            readonly isWordWrapMinified: boolean;
            readonly isViewportWrapping: boolean;
            readonly wrappingColumn: number;
        }
        enum EditorOption {
            acceptSuggestionOnCommitCharacter = 0,
            acceptSuggestionOnEnter = 1,
            accessibilitySupport = 2,
            accessibilityPageSize = 3,
            ariaLabel = 4,
            autoClosingBrackets = 5,
            autoClosingDelete = 6,
            autoClosingOvertype = 7,
            autoClosingQuotes = 8,
            autoIndent = 9,
            automaticLayout = 10,
            autoSurround = 11,
            bracketPairColorization = 12,
            guides = 13,
            codeLens = 14,
            codeLensFontFamily = 15,
            codeLensFontSize = 16,
            colorDecorators = 17,
            columnSelection = 18,
            comments = 19,
            contextmenu = 20,
            copyWithSyntaxHighlighting = 21,
            cursorBlinking = 22,
            cursorSmoothCaretAnimation = 23,
            cursorStyle = 24,
            cursorSurroundingLines = 25,
            cursorSurroundingLinesStyle = 26,
            cursorWidth = 27,
            disableLayerHinting = 28,
            disableMonospaceOptimizations = 29,
            domReadOnly = 30,
            dragAndDrop = 31,
            emptySelectionClipboard = 32,
            extraEditorClassName = 33,
            fastScrollSensitivity = 34,
            find = 35,
            fixedOverflowWidgets = 36,
            folding = 37,
            foldingStrategy = 38,
            foldingHighlight = 39,
            foldingImportsByDefault = 40,
            unfoldOnClickAfterEndOfLine = 41,
            fontFamily = 42,
            fontInfo = 43,
            fontLigatures = 44,
            fontSize = 45,
            fontWeight = 46,
            formatOnPaste = 47,
            formatOnType = 48,
            glyphMargin = 49,
            gotoLocation = 50,
            hideCursorInOverviewRuler = 51,
            hover = 52,
            inDiffEditor = 53,
            inlineSuggest = 54,
            letterSpacing = 55,
            lightbulb = 56,
            lineDecorationsWidth = 57,
            lineHeight = 58,
            lineNumbers = 59,
            lineNumbersMinChars = 60,
            linkedEditing = 61,
            links = 62,
            matchBrackets = 63,
            minimap = 64,
            mouseStyle = 65,
            mouseWheelScrollSensitivity = 66,
            mouseWheelZoom = 67,
            multiCursorMergeOverlapping = 68,
            multiCursorModifier = 69,
            multiCursorPaste = 70,
            occurrencesHighlight = 71,
            overviewRulerBorder = 72,
            overviewRulerLanes = 73,
            padding = 74,
            parameterHints = 75,
            peekWidgetDefaultFocus = 76,
            definitionLinkOpensInPeek = 77,
            quickSuggestions = 78,
            quickSuggestionsDelay = 79,
            readOnly = 80,
            renameOnType = 81,
            renderControlCharacters = 82,
            renderFinalNewline = 83,
            renderLineHighlight = 84,
            renderLineHighlightOnlyWhenFocus = 85,
            renderValidationDecorations = 86,
            renderWhitespace = 87,
            revealHorizontalRightPadding = 88,
            roundedSelection = 89,
            rulers = 90,
            scrollbar = 91,
            scrollBeyondLastColumn = 92,
            scrollBeyondLastLine = 93,
            scrollPredominantAxis = 94,
            selectionClipboard = 95,
            selectionHighlight = 96,
            selectOnLineNumbers = 97,
            showFoldingControls = 98,
            showUnused = 99,
            snippetSuggestions = 100,
            smartSelect = 101,
            smoothScrolling = 102,
            stickyTabStops = 103,
            stopRenderingLineAfter = 104,
            suggest = 105,
            suggestFontSize = 106,
            suggestLineHeight = 107,
            suggestOnTriggerCharacters = 108,
            suggestSelection = 109,
            tabCompletion = 110,
            tabIndex = 111,
            unicodeHighlighting = 112,
            unusualLineTerminators = 113,
            useShadowDOM = 114,
            useTabStops = 115,
            wordSeparators = 116,
            wordWrap = 117,
            wordWrapBreakAfterCharacters = 118,
            wordWrapBreakBeforeCharacters = 119,
            wordWrapColumn = 120,
            wordWrapOverride1 = 121,
            wordWrapOverride2 = 122,
            wrappingIndent = 123,
            wrappingStrategy = 124,
            showDeprecated = 125,
            inlayHints = 126,
            editorClassName = 127,
            pixelRatio = 128,
            tabFocusMode = 129,
            layoutInfo = 130,
            wrappingInfo = 131
        }
        const EditorOptions: {
            acceptSuggestionOnCommitCharacter: IEditorOption<EditorOption.acceptSuggestionOnCommitCharacter, boolean>;
            acceptSuggestionOnEnter: IEditorOption<EditorOption.acceptSuggestionOnEnter, 'on' | 'off' | 'smart'>;
            accessibilitySupport: IEditorOption<EditorOption.accessibilitySupport, AccessibilitySupport>;
            accessibilityPageSize: IEditorOption<EditorOption.accessibilityPageSize, number>;
            ariaLabel: IEditorOption<EditorOption.ariaLabel, string>;
            autoClosingBrackets: IEditorOption<EditorOption.autoClosingBrackets, 'always' | 'languageDefined' | 'beforeWhitespace' | 'never'>;
            autoClosingDelete: IEditorOption<EditorOption.autoClosingDelete, 'always' | 'never' | 'auto'>;
            autoClosingOvertype: IEditorOption<EditorOption.autoClosingOvertype, 'always' | 'never' | 'auto'>;
            autoClosingQuotes: IEditorOption<EditorOption.autoClosingQuotes, 'always' | 'languageDefined' | 'beforeWhitespace' | 'never'>;
            autoIndent: IEditorOption<EditorOption.autoIndent, EditorAutoIndentStrategy>;
            automaticLayout: IEditorOption<EditorOption.automaticLayout, boolean>;
            autoSurround: IEditorOption<EditorOption.autoSurround, 'languageDefined' | 'never' | 'quotes' | 'brackets'>;
            bracketPairColorization: IEditorOption<EditorOption.bracketPairColorization, Readonly<Required<IBracketPairColorizationOptions>>>;
            bracketPairGuides: IEditorOption<EditorOption.guides, Readonly<Required<IGuidesOptions>>>;
            stickyTabStops: IEditorOption<EditorOption.stickyTabStops, boolean>;
            codeLens: IEditorOption<EditorOption.codeLens, boolean>;
            codeLensFontFamily: IEditorOption<EditorOption.codeLensFontFamily, string>;
            codeLensFontSize: IEditorOption<EditorOption.codeLensFontSize, number>;
            colorDecorators: IEditorOption<EditorOption.colorDecorators, boolean>;
            columnSelection: IEditorOption<EditorOption.columnSelection, boolean>;
            comments: IEditorOption<EditorOption.comments, Readonly<Required<IEditorCommentsOptions>>>;
            contextmenu: IEditorOption<EditorOption.contextmenu, boolean>;
            copyWithSyntaxHighlighting: IEditorOption<EditorOption.copyWithSyntaxHighlighting, boolean>;
            cursorBlinking: IEditorOption<EditorOption.cursorBlinking, TextEditorCursorBlinkingStyle>;
            cursorSmoothCaretAnimation: IEditorOption<EditorOption.cursorSmoothCaretAnimation, boolean>;
            cursorStyle: IEditorOption<EditorOption.cursorStyle, TextEditorCursorStyle>;
            cursorSurroundingLines: IEditorOption<EditorOption.cursorSurroundingLines, number>;
            cursorSurroundingLinesStyle: IEditorOption<EditorOption.cursorSurroundingLinesStyle, 'default' | 'all'>;
            cursorWidth: IEditorOption<EditorOption.cursorWidth, number>;
            disableLayerHinting: IEditorOption<EditorOption.disableLayerHinting, boolean>;
            disableMonospaceOptimizations: IEditorOption<EditorOption.disableMonospaceOptimizations, boolean>;
            domReadOnly: IEditorOption<EditorOption.domReadOnly, boolean>;
            dragAndDrop: IEditorOption<EditorOption.dragAndDrop, boolean>;
            emptySelectionClipboard: IEditorOption<EditorOption.emptySelectionClipboard, boolean>;
            extraEditorClassName: IEditorOption<EditorOption.extraEditorClassName, string>;
            fastScrollSensitivity: IEditorOption<EditorOption.fastScrollSensitivity, number>;
            find: IEditorOption<EditorOption.find, Readonly<Required<IEditorFindOptions>>>;
            fixedOverflowWidgets: IEditorOption<EditorOption.fixedOverflowWidgets, boolean>;
            folding: IEditorOption<EditorOption.folding, boolean>;
            foldingStrategy: IEditorOption<EditorOption.foldingStrategy, 'auto' | 'indentation'>;
            foldingHighlight: IEditorOption<EditorOption.foldingHighlight, boolean>;
            foldingImportsByDefault: IEditorOption<EditorOption.foldingImportsByDefault, boolean>;
            unfoldOnClickAfterEndOfLine: IEditorOption<EditorOption.unfoldOnClickAfterEndOfLine, boolean>;
            fontFamily: IEditorOption<EditorOption.fontFamily, string>;
            fontInfo: IEditorOption<EditorOption.fontInfo, FontInfo>;
            fontLigatures2: IEditorOption<EditorOption.fontLigatures, string>;
            fontSize: IEditorOption<EditorOption.fontSize, number>;
            fontWeight: IEditorOption<EditorOption.fontWeight, string>;
            formatOnPaste: IEditorOption<EditorOption.formatOnPaste, boolean>;
            formatOnType: IEditorOption<EditorOption.formatOnType, boolean>;
            glyphMargin: IEditorOption<EditorOption.glyphMargin, boolean>;
            gotoLocation: IEditorOption<EditorOption.gotoLocation, Readonly<Required<IGotoLocationOptions>>>;
            hideCursorInOverviewRuler: IEditorOption<EditorOption.hideCursorInOverviewRuler, boolean>;
            hover: IEditorOption<EditorOption.hover, Readonly<Required<IEditorHoverOptions>>>;
            inDiffEditor: IEditorOption<EditorOption.inDiffEditor, boolean>;
            letterSpacing: IEditorOption<EditorOption.letterSpacing, number>;
            lightbulb: IEditorOption<EditorOption.lightbulb, Readonly<Required<IEditorLightbulbOptions>>>;
            lineDecorationsWidth: IEditorOption<EditorOption.lineDecorationsWidth, string | number>;
            lineHeight: IEditorOption<EditorOption.lineHeight, number>;
            lineNumbers: IEditorOption<EditorOption.lineNumbers, InternalEditorRenderLineNumbersOptions>;
            lineNumbersMinChars: IEditorOption<EditorOption.lineNumbersMinChars, number>;
            linkedEditing: IEditorOption<EditorOption.linkedEditing, boolean>;
            links: IEditorOption<EditorOption.links, boolean>;
            matchBrackets: IEditorOption<EditorOption.matchBrackets, 'always' | 'never' | 'near'>;
            minimap: IEditorOption<EditorOption.minimap, Readonly<Required<IEditorMinimapOptions>>>;
            mouseStyle: IEditorOption<EditorOption.mouseStyle, 'default' | 'text' | 'copy'>;
            mouseWheelScrollSensitivity: IEditorOption<EditorOption.mouseWheelScrollSensitivity, number>;
            mouseWheelZoom: IEditorOption<EditorOption.mouseWheelZoom, boolean>;
            multiCursorMergeOverlapping: IEditorOption<EditorOption.multiCursorMergeOverlapping, boolean>;
            multiCursorModifier: IEditorOption<EditorOption.multiCursorModifier, 'altKey' | 'metaKey' | 'ctrlKey'>;
            multiCursorPaste: IEditorOption<EditorOption.multiCursorPaste, 'spread' | 'full'>;
            occurrencesHighlight: IEditorOption<EditorOption.occurrencesHighlight, boolean>;
            overviewRulerBorder: IEditorOption<EditorOption.overviewRulerBorder, boolean>;
            overviewRulerLanes: IEditorOption<EditorOption.overviewRulerLanes, number>;
            padding: IEditorOption<EditorOption.padding, Readonly<Required<IEditorPaddingOptions>>>;
            parameterHints: IEditorOption<EditorOption.parameterHints, Readonly<Required<IEditorParameterHintOptions>>>;
            peekWidgetDefaultFocus: IEditorOption<EditorOption.peekWidgetDefaultFocus, 'tree' | 'editor'>;
            definitionLinkOpensInPeek: IEditorOption<EditorOption.definitionLinkOpensInPeek, boolean>;
            quickSuggestions: IEditorOption<EditorOption.quickSuggestions, any>;
            quickSuggestionsDelay: IEditorOption<EditorOption.quickSuggestionsDelay, number>;
            readOnly: IEditorOption<EditorOption.readOnly, boolean>;
            renameOnType: IEditorOption<EditorOption.renameOnType, boolean>;
            renderControlCharacters: IEditorOption<EditorOption.renderControlCharacters, boolean>;
            renderFinalNewline: IEditorOption<EditorOption.renderFinalNewline, boolean>;
            renderLineHighlight: IEditorOption<EditorOption.renderLineHighlight, 'all' | 'line' | 'none' | 'gutter'>;
            renderLineHighlightOnlyWhenFocus: IEditorOption<EditorOption.renderLineHighlightOnlyWhenFocus, boolean>;
            renderValidationDecorations: IEditorOption<EditorOption.renderValidationDecorations, 'on' | 'off' | 'editable'>;
            renderWhitespace: IEditorOption<EditorOption.renderWhitespace, 'all' | 'none' | 'boundary' | 'selection' | 'trailing'>;
            revealHorizontalRightPadding: IEditorOption<EditorOption.revealHorizontalRightPadding, number>;
            roundedSelection: IEditorOption<EditorOption.roundedSelection, boolean>;
            rulers: IEditorOption<EditorOption.rulers, {}>;
            scrollbar: IEditorOption<EditorOption.scrollbar, InternalEditorScrollbarOptions>;
            scrollBeyondLastColumn: IEditorOption<EditorOption.scrollBeyondLastColumn, number>;
            scrollBeyondLastLine: IEditorOption<EditorOption.scrollBeyondLastLine, boolean>;
            scrollPredominantAxis: IEditorOption<EditorOption.scrollPredominantAxis, boolean>;
            selectionClipboard: IEditorOption<EditorOption.selectionClipboard, boolean>;
            selectionHighlight: IEditorOption<EditorOption.selectionHighlight, boolean>;
            selectOnLineNumbers: IEditorOption<EditorOption.selectOnLineNumbers, boolean>;
            showFoldingControls: IEditorOption<EditorOption.showFoldingControls, 'always' | 'mouseover'>;
            showUnused: IEditorOption<EditorOption.showUnused, boolean>;
            showDeprecated: IEditorOption<EditorOption.showDeprecated, boolean>;
            inlayHints: IEditorOption<EditorOption.inlayHints, Readonly<Required<IEditorInlayHintsOptions>>>;
            snippetSuggestions: IEditorOption<EditorOption.snippetSuggestions, 'none' | 'top' | 'bottom' | 'inline'>;
            smartSelect: IEditorOption<EditorOption.smartSelect, Readonly<Required<ISmartSelectOptions>>>;
            smoothScrolling: IEditorOption<EditorOption.smoothScrolling, boolean>;
            stopRenderingLineAfter: IEditorOption<EditorOption.stopRenderingLineAfter, number>;
            suggest: IEditorOption<EditorOption.suggest, Readonly<Required<ISuggestOptions>>>;
            inlineSuggest: IEditorOption<EditorOption.inlineSuggest, Readonly<Required<IInlineSuggestOptions>>>;
            suggestFontSize: IEditorOption<EditorOption.suggestFontSize, number>;
            suggestLineHeight: IEditorOption<EditorOption.suggestLineHeight, number>;
            suggestOnTriggerCharacters: IEditorOption<EditorOption.suggestOnTriggerCharacters, boolean>;
            suggestSelection: IEditorOption<EditorOption.suggestSelection, 'first' | 'recentlyUsed' | 'recentlyUsedByPrefix'>;
            tabCompletion: IEditorOption<EditorOption.tabCompletion, 'on' | 'off' | 'onlySnippets'>;
            tabIndex: IEditorOption<EditorOption.tabIndex, number>;
            unicodeHighlight: IEditorOption<EditorOption.unicodeHighlighting, Required<Readonly<IUnicodeHighlightOptions>>>;
            unusualLineTerminators: IEditorOption<EditorOption.unusualLineTerminators, 'auto' | 'off' | 'prompt'>;
            useShadowDOM: IEditorOption<EditorOption.useShadowDOM, boolean>;
            useTabStops: IEditorOption<EditorOption.useTabStops, boolean>;
            wordSeparators: IEditorOption<EditorOption.wordSeparators, string>;
            wordWrap: IEditorOption<EditorOption.wordWrap, 'on' | 'off' | 'wordWrapColumn' | 'bounded'>;
            wordWrapBreakAfterCharacters: IEditorOption<EditorOption.wordWrapBreakAfterCharacters, string>;
            wordWrapBreakBeforeCharacters: IEditorOption<EditorOption.wordWrapBreakBeforeCharacters, string>;
            wordWrapColumn: IEditorOption<EditorOption.wordWrapColumn, number>;
            wordWrapOverride1: IEditorOption<EditorOption.wordWrapOverride1, 'on' | 'off' | 'inherit'>;
            wordWrapOverride2: IEditorOption<EditorOption.wordWrapOverride2, 'on' | 'off' | 'inherit'>;
            wrappingIndent: IEditorOption<EditorOption.wrappingIndent, WrappingIndent>;
            wrappingStrategy: IEditorOption<EditorOption.wrappingStrategy, 'simple' | 'advanced'>;
            editorClassName: IEditorOption<EditorOption.editorClassName, string>;
            pixelRatio: IEditorOption<EditorOption.pixelRatio, number>;
            tabFocusMode: IEditorOption<EditorOption.tabFocusMode, boolean>;
            layoutInfo: IEditorOption<EditorOption.layoutInfo, EditorLayoutInfo>;
            wrappingInfo: IEditorOption<EditorOption.wrappingInfo, EditorWrappingInfo>;
        };
        type EditorOptionsType = typeof EditorOptions;
        type FindEditorOptionsKeyById<T extends EditorOption> = {
            [K in keyof EditorOptionsType]: EditorOptionsType[K]['id'] extends T ? K : never;
        }[keyof EditorOptionsType];
        type ComputedEditorOptionValue<T extends IEditorOption<any, any>> = T extends IEditorOption<any, infer R> ? R : never;
        type FindComputedEditorOptionValueById<T extends EditorOption> = NonNullable<ComputedEditorOptionValue<EditorOptionsType[FindEditorOptionsKeyById<T>]>>;
        interface IViewZone {
            afterLineNumber: number;
            afterColumn?: number;
            suppressMouseDown?: boolean;
            heightInLines?: number;
            heightInPx?: number;
            minWidthInPx?: number;
            domNode: HTMLElement;
            marginDomNode?: HTMLElement | null;
            onDomNodeTop?: (top: number) => void;
            onComputedHeight?: (height: number) => void;
        }
        interface IViewZoneChangeAccessor {
            addZone(zone: IViewZone): string;
            removeZone(id: string): void;
            layoutZone(id: string): void;
        }
        enum ContentWidgetPositionPreference {
            EXACT = 0,
            ABOVE = 1,
            BELOW = 2
        }
        interface IContentWidgetPosition {
            position: IPosition | null;
            range?: IRange | null;
            preference: ContentWidgetPositionPreference[];
        }
        interface IContentWidget {
            allowEditorOverflow?: boolean;
            suppressMouseDown?: boolean;
            getId(): string;
            getDomNode(): HTMLElement;
            getPosition(): IContentWidgetPosition | null;
            beforeRender?(): IDimension | null;
            afterRender?(position: ContentWidgetPositionPreference | null): void;
        }
        enum OverlayWidgetPositionPreference {
            TOP_RIGHT_CORNER = 0,
            BOTTOM_RIGHT_CORNER = 1,
            TOP_CENTER = 2
        }
        interface IOverlayWidgetPosition {
            preference: OverlayWidgetPositionPreference | null;
        }
        interface IOverlayWidget {
            getId(): string;
            getDomNode(): HTMLElement;
            getPosition(): IOverlayWidgetPosition | null;
        }
        enum MouseTargetType {
            UNKNOWN = 0,
            TEXTAREA = 1,
            GUTTER_GLYPH_MARGIN = 2,
            GUTTER_LINE_NUMBERS = 3,
            GUTTER_LINE_DECORATIONS = 4,
            GUTTER_VIEW_ZONE = 5,
            CONTENT_TEXT = 6,
            CONTENT_EMPTY = 7,
            CONTENT_VIEW_ZONE = 8,
            CONTENT_WIDGET = 9,
            OVERVIEW_RULER = 10,
            SCROLLBAR = 11,
            OVERLAY_WIDGET = 12,
            OUTSIDE_EDITOR = 13
        }
        interface IMouseTarget {
            readonly element: Element | null;
            readonly type: MouseTargetType;
            readonly position: Position | null;
            readonly mouseColumn: number;
            readonly range: Range | null;
            readonly detail: any;
        }
        interface IEditorMouseEvent {
            readonly event: IMouseEvent;
            readonly target: IMouseTarget;
        }
        interface IPartialEditorMouseEvent {
            readonly event: IMouseEvent;
            readonly target: IMouseTarget | null;
        }
        interface IPasteEvent {
            readonly range: Range;
            readonly languageId: string | null;
        }
        interface IEditorConstructionOptions extends IEditorOptions {
            dimension?: IDimension;
            overflowWidgetsDomNode?: HTMLElement;
        }
        interface IDiffEditorConstructionOptions extends IDiffEditorOptions {
            dimension?: IDimension;
            overflowWidgetsDomNode?: HTMLElement;
            originalAriaLabel?: string;
            modifiedAriaLabel?: string;
            isInEmbeddedEditor?: boolean;
        }
        interface ICodeEditor extends IEditor {
            onDidChangeModelContent: IEvent<IModelContentChangedEvent>;
            onDidChangeModelLanguage: IEvent<IModelLanguageChangedEvent>;
            onDidChangeModelLanguageConfiguration: IEvent<IModelLanguageConfigurationChangedEvent>;
            onDidChangeModelOptions: IEvent<IModelOptionsChangedEvent>;
            onDidChangeConfiguration: IEvent<ConfigurationChangedEvent>;
            onDidChangeCursorPosition: IEvent<ICursorPositionChangedEvent>;
            onDidChangeCursorSelection: IEvent<ICursorSelectionChangedEvent>;
            onDidChangeModel: IEvent<IModelChangedEvent>;
            onDidChangeModelDecorations: IEvent<IModelDecorationsChangedEvent>;
            onDidFocusEditorText(listener: () => void): IDisposable;
            onDidBlurEditorText(listener: () => void): IDisposable;
            onDidFocusEditorWidget(listener: () => void): IDisposable;
            onDidBlurEditorWidget(listener: () => void): IDisposable;
            onDidCompositionStart(listener: () => void): IDisposable;
            onDidCompositionEnd(listener: () => void): IDisposable;
            onDidAttemptReadOnlyEdit(listener: () => void): IDisposable;
            onDidPaste: IEvent<IPasteEvent>;
            onMouseUp: IEvent<IEditorMouseEvent>;
            onMouseDown: IEvent<IEditorMouseEvent>;
            onContextMenu: IEvent<IEditorMouseEvent>;
            onMouseMove: IEvent<IEditorMouseEvent>;
            onMouseLeave: IEvent<IPartialEditorMouseEvent>;
            onKeyUp: IEvent<IKeyboardEvent>;
            onKeyDown: IEvent<IKeyboardEvent>;
            onDidLayoutChange: IEvent<EditorLayoutInfo>;
            onDidContentSizeChange: IEvent<IContentSizeChangedEvent>;
            onDidScrollChange: IEvent<IScrollEvent>;
            onDidChangeHiddenAreas: IEvent<void>;
            saveViewState(): ICodeEditorViewState | null;
            restoreViewState(state: ICodeEditorViewState): void;
            hasWidgetFocus(): boolean;
            getContribution<T extends IEditorContribution>(id: string): T;
            getModel(): ITextModel | null;
            setModel(model: ITextModel | null): void;
            getOptions(): IComputedEditorOptions;
            getOption<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T>;
            getRawOptions(): IEditorOptions;
            getValue(options?: {
                preserveBOM: boolean;
                lineEnding: string;
            }): string;
            setValue(newValue: string): void;
            getContentWidth(): number;
            getScrollWidth(): number;
            getScrollLeft(): number;
            getContentHeight(): number;
            getScrollHeight(): number;
            getScrollTop(): number;
            setScrollLeft(newScrollLeft: number, scrollType?: ScrollType): void;
            setScrollTop(newScrollTop: number, scrollType?: ScrollType): void;
            setScrollPosition(position: INewScrollPosition, scrollType?: ScrollType): void;
            getAction(id: string): IEditorAction;
            executeCommand(source: string | null | undefined, command: ICommand): void;
            pushUndoStop(): boolean;
            popUndoStop(): boolean;
            executeEdits(source: string | null | undefined, edits: IIdentifiedSingleEditOperation[], endCursorState?: ICursorStateComputer | Selection[]): boolean;
            executeCommands(source: string | null | undefined, commands: (ICommand | null)[]): void;
            getLineDecorations(lineNumber: number): IModelDecoration[] | null;
            deltaDecorations(oldDecorations: string[], newDecorations: IModelDeltaDecoration[]): string[];
            getLayoutInfo(): EditorLayoutInfo;
            getVisibleRanges(): Range[];
            getTopForLineNumber(lineNumber: number): number;
            getTopForPosition(lineNumber: number, column: number): number;
            getContainerDomNode(): HTMLElement;
            getDomNode(): HTMLElement | null;
            addContentWidget(widget: IContentWidget): void;
            layoutContentWidget(widget: IContentWidget): void;
            removeContentWidget(widget: IContentWidget): void;
            addOverlayWidget(widget: IOverlayWidget): void;
            layoutOverlayWidget(widget: IOverlayWidget): void;
            removeOverlayWidget(widget: IOverlayWidget): void;
            changeViewZones(callback: (accessor: IViewZoneChangeAccessor) => void): void;
            getOffsetForColumn(lineNumber: number, column: number): number;
            render(forceRedraw?: boolean): void;
            getTargetAtClientPoint(clientX: number, clientY: number): IMouseTarget | null;
            getScrolledVisiblePosition(position: IPosition): {
                top: number;
                left: number;
                height: number;
            } | null;
            applyFontInfo(target: HTMLElement): void;
            setBanner(bannerDomNode: HTMLElement | null, height: number): void;
        }
        interface IDiffLineInformation {
            readonly equivalentLineNumber: number;
        }
        interface IDiffEditor extends IEditor {
            getDomNode(): HTMLElement;
            onDidUpdateDiff(listener: () => void): IDisposable;
            saveViewState(): IDiffEditorViewState | null;
            restoreViewState(state: IDiffEditorViewState): void;
            getModel(): IDiffEditorModel | null;
            setModel(model: IDiffEditorModel | null): void;
            getOriginalEditor(): ICodeEditor;
            getModifiedEditor(): ICodeEditor;
            getLineChanges(): ILineChange[] | null;
            getDiffLineInformationForOriginal(lineNumber: number): IDiffLineInformation | null;
            getDiffLineInformationForModified(lineNumber: number): IDiffLineInformation | null;
            updateOptions(newOptions: IDiffEditorOptions): void;
        }
        class FontInfo extends BareFontInfo {
            readonly _editorStylingBrand: void;
            readonly version: number;
            readonly isTrusted: boolean;
            readonly isMonospace: boolean;
            readonly typicalHalfwidthCharacterWidth: number;
            readonly typicalFullwidthCharacterWidth: number;
            readonly canUseHalfwidthRightwardsArrow: boolean;
            readonly spaceWidth: number;
            readonly middotWidth: number;
            readonly wsmiddotWidth: number;
            readonly maxDigitWidth: number;
        }
        class BareFontInfo {
            readonly _bareFontInfoBrand: void;
            readonly zoomLevel: number;
            readonly pixelRatio: number;
            readonly fontFamily: string;
            readonly fontWeight: string;
            readonly fontSize: number;
            readonly fontFeatureSettings: string;
            readonly lineHeight: number;
            readonly letterSpacing: number;
        }
        type IReadOnlyModel = ITextModel;
        type IModel = ITextModel;
    }
    export namespace languages {
        function register(language: ILanguageExtensionPoint): void;
        function getLanguages(): ILanguageExtensionPoint[];
        function getEncodedLanguageId(languageId: string): number;
        function onLanguage(languageId: string, callback: () => void): IDisposable;
        function setLanguageConfiguration(languageId: string, configuration: LanguageConfiguration): IDisposable;
        interface IToken {
            startIndex: number;
            scopes: string;
        }
        interface ILineTokens {
            tokens: IToken[];
            endState: IState;
        }
        interface IEncodedLineTokens {
            tokens: Uint32Array;
            endState: IState;
        }
        interface TokensProvider {
            getInitialState(): IState;
            tokenize(line: string, state: IState): ILineTokens;
        }
        interface EncodedTokensProvider {
            getInitialState(): IState;
            tokenizeEncoded(line: string, state: IState): IEncodedLineTokens;
            tokenize?(line: string, state: IState): ILineTokens;
        }
        function setColorMap(colorMap: string[] | null): void;
        function setTokensProvider(languageId: string, provider: TokensProvider | EncodedTokensProvider | Thenable<TokensProvider | EncodedTokensProvider>): IDisposable;
        function setMonarchTokensProvider(languageId: string, languageDef: IMonarchLanguage | Thenable<IMonarchLanguage>): IDisposable;
        function registerReferenceProvider(languageId: string, provider: ReferenceProvider): IDisposable;
        function registerRenameProvider(languageId: string, provider: RenameProvider): IDisposable;
        function registerSignatureHelpProvider(languageId: string, provider: SignatureHelpProvider): IDisposable;
        function registerHoverProvider(languageId: string, provider: HoverProvider): IDisposable;
        function registerDocumentSymbolProvider(languageId: string, provider: DocumentSymbolProvider): IDisposable;
        function registerDocumentHighlightProvider(languageId: string, provider: DocumentHighlightProvider): IDisposable;
        function registerLinkedEditingRangeProvider(languageId: string, provider: LinkedEditingRangeProvider): IDisposable;
        function registerDefinitionProvider(languageId: string, provider: DefinitionProvider): IDisposable;
        function registerImplementationProvider(languageId: string, provider: ImplementationProvider): IDisposable;
        function registerTypeDefinitionProvider(languageId: string, provider: TypeDefinitionProvider): IDisposable;
        function registerCodeLensProvider(languageId: string, provider: CodeLensProvider): IDisposable;
        function registerCodeActionProvider(languageId: string, provider: CodeActionProvider, metadata?: CodeActionProviderMetadata): IDisposable;
        function registerDocumentFormattingEditProvider(languageId: string, provider: DocumentFormattingEditProvider): IDisposable;
        function registerDocumentRangeFormattingEditProvider(languageId: string, provider: DocumentRangeFormattingEditProvider): IDisposable;
        function registerOnTypeFormattingEditProvider(languageId: string, provider: OnTypeFormattingEditProvider): IDisposable;
        function registerLinkProvider(languageId: string, provider: LinkProvider): IDisposable;
        function registerCompletionItemProvider(languageId: string, provider: CompletionItemProvider): IDisposable;
        function registerColorProvider(languageId: string, provider: DocumentColorProvider): IDisposable;
        function registerFoldingRangeProvider(languageId: string, provider: FoldingRangeProvider): IDisposable;
        function registerDeclarationProvider(languageId: string, provider: DeclarationProvider): IDisposable;
        function registerSelectionRangeProvider(languageId: string, provider: SelectionRangeProvider): IDisposable;
        function registerDocumentSemanticTokensProvider(languageId: string, provider: DocumentSemanticTokensProvider): IDisposable;
        function registerDocumentRangeSemanticTokensProvider(languageId: string, provider: DocumentRangeSemanticTokensProvider): IDisposable;
        function registerInlineCompletionsProvider(languageId: string, provider: InlineCompletionsProvider): IDisposable;
        function registerInlayHintsProvider(languageId: string, provider: InlayHintsProvider): IDisposable;
        interface CodeActionContext {
            readonly markers: editor.IMarkerData[];
            readonly only?: string;
        }
        interface CodeActionProvider {
            provideCodeActions(model: editor.ITextModel, range: Range, context: CodeActionContext, token: CancellationToken): ProviderResult<CodeActionList>;
            resolveCodeAction?(codeAction: CodeAction, token: CancellationToken): ProviderResult<CodeAction>;
        }
        interface CodeActionProviderMetadata {
            readonly providedCodeActionKinds?: readonly string[];
        }
        interface CommentRule {
            lineComment?: string | null;
            blockComment?: CharacterPair | null;
        }
        interface LanguageConfiguration {
            comments?: CommentRule;
            brackets?: CharacterPair[];
            wordPattern?: RegExp;
            indentationRules?: IndentationRule;
            onEnterRules?: OnEnterRule[];
            autoClosingPairs?: IAutoClosingPairConditional[];
            surroundingPairs?: IAutoClosingPair[];
            colorizedBracketPairs?: CharacterPair[];
            autoCloseBefore?: string;
            folding?: FoldingRules;
            __electricCharacterSupport?: {
                docComment?: IDocComment;
            };
        }
        interface IndentationRule {
            decreaseIndentPattern: RegExp;
            increaseIndentPattern: RegExp;
            indentNextLinePattern?: RegExp | null;
            unIndentedLinePattern?: RegExp | null;
        }
        interface FoldingMarkers {
            start: RegExp;
            end: RegExp;
        }
        interface FoldingRules {
            offSide?: boolean;
            markers?: FoldingMarkers;
        }
        interface OnEnterRule {
            beforeText: RegExp;
            afterText?: RegExp;
            previousLineText?: RegExp;
            action: EnterAction;
        }
        interface IDocComment {
            open: string;
            close?: string;
        }
        type CharacterPair = [string, string];
        interface IAutoClosingPair {
            open: string;
            close: string;
        }
        interface IAutoClosingPairConditional extends IAutoClosingPair {
            notIn?: string[];
        }
        enum IndentAction {
            None = 0,
            Indent = 1,
            IndentOutdent = 2,
            Outdent = 3
        }
        interface EnterAction {
            indentAction: IndentAction;
            appendText?: string;
            removeText?: number;
        }
        interface IState {
            clone(): IState;
            equals(other: IState): boolean;
        }
        type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;
        interface Hover {
            contents: IMarkdownString[];
            range?: IRange;
        }
        interface HoverProvider {
            provideHover(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<Hover>;
        }
        enum CompletionItemKind {
            Method = 0,
            Function = 1,
            Constructor = 2,
            Field = 3,
            Variable = 4,
            Class = 5,
            Struct = 6,
            Interface = 7,
            Module = 8,
            Property = 9,
            Event = 10,
            Operator = 11,
            Unit = 12,
            Value = 13,
            Constant = 14,
            Enum = 15,
            EnumMember = 16,
            Keyword = 17,
            Text = 18,
            Color = 19,
            File = 20,
            Reference = 21,
            Customcolor = 22,
            Folder = 23,
            TypeParameter = 24,
            User = 25,
            Issue = 26,
            Snippet = 27
        }
        interface CompletionItemLabel {
            label: string;
            detail?: string;
            description?: string;
        }
        enum CompletionItemTag {
            Deprecated = 1
        }
        enum CompletionItemInsertTextRule {
            KeepWhitespace = 1,
            InsertAsSnippet = 4
        }
        interface CompletionItemRanges {
            insert: IRange;
            replace: IRange;
        }
        interface CompletionItem {
            label: string | CompletionItemLabel;
            kind: CompletionItemKind;
            tags?: ReadonlyArray<CompletionItemTag>;
            detail?: string;
            documentation?: string | IMarkdownString;
            sortText?: string;
            filterText?: string;
            preselect?: boolean;
            insertText: string;
            insertTextRules?: CompletionItemInsertTextRule;
            range: IRange | CompletionItemRanges;
            commitCharacters?: string[];
            additionalTextEdits?: editor.ISingleEditOperation[];
            command?: Command;
        }
        interface CompletionList {
            suggestions: CompletionItem[];
            incomplete?: boolean;
            dispose?(): void;
        }
        enum CompletionTriggerKind {
            Invoke = 0,
            TriggerCharacter = 1,
            TriggerForIncompleteCompletions = 2
        }
        interface CompletionContext {
            triggerKind: CompletionTriggerKind;
            triggerCharacter?: string;
        }
        interface CompletionItemProvider {
            triggerCharacters?: string[];
            provideCompletionItems(model: editor.ITextModel, position: Position, context: CompletionContext, token: CancellationToken): ProviderResult<CompletionList>;
            resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem>;
        }
        enum InlineCompletionTriggerKind {
            Automatic = 0,
            Explicit = 1
        }
        interface InlineCompletionContext {
            readonly triggerKind: InlineCompletionTriggerKind;
            readonly selectedSuggestionInfo: SelectedSuggestionInfo | undefined;
        }
        interface SelectedSuggestionInfo {
            range: IRange;
            text: string;
            isSnippetText: boolean;
            completionKind: CompletionItemKind;
        }
        interface InlineCompletion {
            readonly text: string;
            readonly range?: IRange;
            readonly command?: Command;
        }
        interface InlineCompletions<TItem extends InlineCompletion = InlineCompletion> {
            readonly items: readonly TItem[];
        }
        interface InlineCompletionsProvider<T extends InlineCompletions = InlineCompletions> {
            provideInlineCompletions(model: editor.ITextModel, position: Position, context: InlineCompletionContext, token: CancellationToken): ProviderResult<T>;
            handleItemDidShow?(completions: T, item: T['items'][number]): void;
            freeInlineCompletions(completions: T): void;
        }
        interface CodeAction {
            title: string;
            command?: Command;
            edit?: WorkspaceEdit;
            diagnostics?: editor.IMarkerData[];
            kind?: string;
            isPreferred?: boolean;
            disabled?: string;
        }
        interface CodeActionList extends IDisposable {
            readonly actions: ReadonlyArray<CodeAction>;
        }
        interface ParameterInformation {
            label: string | [number, number];
            documentation?: string | IMarkdownString;
        }
        interface SignatureInformation {
            label: string;
            documentation?: string | IMarkdownString;
            parameters: ParameterInformation[];
            activeParameter?: number;
        }
        interface SignatureHelp {
            signatures: SignatureInformation[];
            activeSignature: number;
            activeParameter: number;
        }
        interface SignatureHelpResult extends IDisposable {
            value: SignatureHelp;
        }
        enum SignatureHelpTriggerKind {
            Invoke = 1,
            TriggerCharacter = 2,
            ContentChange = 3
        }
        interface SignatureHelpContext {
            readonly triggerKind: SignatureHelpTriggerKind;
            readonly triggerCharacter?: string;
            readonly isRetrigger: boolean;
            readonly activeSignatureHelp?: SignatureHelp;
        }
        interface SignatureHelpProvider {
            readonly signatureHelpTriggerCharacters?: ReadonlyArray<string>;
            readonly signatureHelpRetriggerCharacters?: ReadonlyArray<string>;
            provideSignatureHelp(model: editor.ITextModel, position: Position, token: CancellationToken, context: SignatureHelpContext): ProviderResult<SignatureHelpResult>;
        }
        enum DocumentHighlightKind {
            Text = 0,
            Read = 1,
            Write = 2
        }
        interface DocumentHighlight {
            range: IRange;
            kind?: DocumentHighlightKind;
        }
        interface DocumentHighlightProvider {
            provideDocumentHighlights(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<DocumentHighlight[]>;
        }
        interface LinkedEditingRangeProvider {
            provideLinkedEditingRanges(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<LinkedEditingRanges>;
        }
        interface LinkedEditingRanges {
            ranges: IRange[];
            wordPattern?: RegExp;
        }
        interface ReferenceContext {
            includeDeclaration: boolean;
        }
        interface ReferenceProvider {
            provideReferences(model: editor.ITextModel, position: Position, context: ReferenceContext, token: CancellationToken): ProviderResult<Location[]>;
        }
        interface Location {
            uri: Uri;
            range: IRange;
        }
        interface LocationLink {
            originSelectionRange?: IRange;
            uri: Uri;
            range: IRange;
            targetSelectionRange?: IRange;
        }
        type Definition = Location | Location[] | LocationLink[];
        interface DefinitionProvider {
            provideDefinition(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]>;
        }
        interface DeclarationProvider {
            provideDeclaration(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]>;
        }
        interface ImplementationProvider {
            provideImplementation(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]>;
        }
        interface TypeDefinitionProvider {
            provideTypeDefinition(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]>;
        }
        enum SymbolKind {
            File = 0,
            Module = 1,
            Namespace = 2,
            Package = 3,
            Class = 4,
            Method = 5,
            Property = 6,
            Field = 7,
            Constructor = 8,
            Enum = 9,
            Interface = 10,
            Function = 11,
            Variable = 12,
            Constant = 13,
            String = 14,
            Number = 15,
            Boolean = 16,
            Array = 17,
            Object = 18,
            Key = 19,
            Null = 20,
            EnumMember = 21,
            Struct = 22,
            Event = 23,
            Operator = 24,
            TypeParameter = 25
        }
        enum SymbolTag {
            Deprecated = 1
        }
        interface DocumentSymbol {
            name: string;
            detail: string;
            kind: SymbolKind;
            tags: ReadonlyArray<SymbolTag>;
            containerName?: string;
            range: IRange;
            selectionRange: IRange;
            children?: DocumentSymbol[];
        }
        interface DocumentSymbolProvider {
            displayName?: string;
            provideDocumentSymbols(model: editor.ITextModel, token: CancellationToken): ProviderResult<DocumentSymbol[]>;
        }
        type TextEdit = {
            range: IRange;
            text: string;
            eol?: editor.EndOfLineSequence;
        };
        interface FormattingOptions {
            tabSize: number;
            insertSpaces: boolean;
        }
        interface DocumentFormattingEditProvider {
            readonly displayName?: string;
            provideDocumentFormattingEdits(model: editor.ITextModel, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
        }
        interface DocumentRangeFormattingEditProvider {
            readonly displayName?: string;
            provideDocumentRangeFormattingEdits(model: editor.ITextModel, range: Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
        }
        interface OnTypeFormattingEditProvider {
            autoFormatTriggerCharacters: string[];
            provideOnTypeFormattingEdits(model: editor.ITextModel, position: Position, ch: string, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
        }
        interface ILink {
            range: IRange;
            url?: Uri | string;
            tooltip?: string;
        }
        interface ILinksList {
            links: ILink[];
            dispose?(): void;
        }
        interface LinkProvider {
            provideLinks(model: editor.ITextModel, token: CancellationToken): ProviderResult<ILinksList>;
            resolveLink?: (link: ILink, token: CancellationToken) => ProviderResult<ILink>;
        }
        interface IColor {
            readonly red: number;
            readonly green: number;
            readonly blue: number;
            readonly alpha: number;
        }
        interface IColorPresentation {
            label: string;
            textEdit?: TextEdit;
            additionalTextEdits?: TextEdit[];
        }
        interface IColorInformation {
            range: IRange;
            color: IColor;
        }
        interface DocumentColorProvider {
            provideDocumentColors(model: editor.ITextModel, token: CancellationToken): ProviderResult<IColorInformation[]>;
            provideColorPresentations(model: editor.ITextModel, colorInfo: IColorInformation, token: CancellationToken): ProviderResult<IColorPresentation[]>;
        }
        interface SelectionRange {
            range: IRange;
        }
        interface SelectionRangeProvider {
            provideSelectionRanges(model: editor.ITextModel, positions: Position[], token: CancellationToken): ProviderResult<SelectionRange[][]>;
        }
        interface FoldingContext {
        }
        interface FoldingRangeProvider {
            onDidChange?: IEvent<this>;
            provideFoldingRanges(model: editor.ITextModel, context: FoldingContext, token: CancellationToken): ProviderResult<FoldingRange[]>;
        }
        interface FoldingRange {
            start: number;
            end: number;
            kind?: FoldingRangeKind;
        }
        class FoldingRangeKind {
            value: string;
            static readonly Comment: FoldingRangeKind;
            static readonly Imports: FoldingRangeKind;
            static readonly Region: FoldingRangeKind;
            constructor(value: string);
        }
        interface WorkspaceEditMetadata {
            needsConfirmation: boolean;
            label: string;
            description?: string;
        }
        interface WorkspaceFileEditOptions {
            overwrite?: boolean;
            ignoreIfNotExists?: boolean;
            ignoreIfExists?: boolean;
            recursive?: boolean;
            copy?: boolean;
            folder?: boolean;
            skipTrashBin?: boolean;
            maxSize?: number;
        }
        interface WorkspaceFileEdit {
            oldUri?: Uri;
            newUri?: Uri;
            options?: WorkspaceFileEditOptions;
            metadata?: WorkspaceEditMetadata;
        }
        interface WorkspaceTextEdit {
            resource: Uri;
            edit: TextEdit;
            modelVersionId?: number;
            metadata?: WorkspaceEditMetadata;
        }
        interface WorkspaceEdit {
            edits: Array<WorkspaceTextEdit | WorkspaceFileEdit>;
        }
        interface Rejection {
            rejectReason?: string;
        }
        interface RenameLocation {
            range: IRange;
            text: string;
        }
        interface RenameProvider {
            provideRenameEdits(model: editor.ITextModel, position: Position, newName: string, token: CancellationToken): ProviderResult<WorkspaceEdit & Rejection>;
            resolveRenameLocation?(model: editor.ITextModel, position: Position, token: CancellationToken): ProviderResult<RenameLocation & Rejection>;
        }
        interface Command {
            id: string;
            title: string;
            tooltip?: string;
            arguments?: any[];
        }
        interface CodeLens {
            range: IRange;
            id?: string;
            command?: Command;
        }
        interface CodeLensList {
            lenses: CodeLens[];
            dispose(): void;
        }
        interface CodeLensProvider {
            onDidChange?: IEvent<this>;
            provideCodeLenses(model: editor.ITextModel, token: CancellationToken): ProviderResult<CodeLensList>;
            resolveCodeLens?(model: editor.ITextModel, codeLens: CodeLens, token: CancellationToken): ProviderResult<CodeLens>;
        }
        enum InlayHintKind {
            Other = 0,
            Type = 1,
            Parameter = 2
        }
        interface InlayHint {
            text: string;
            position: IPosition;
            kind: InlayHintKind;
            whitespaceBefore?: boolean;
            whitespaceAfter?: boolean;
        }
        interface InlayHintsProvider {
            onDidChangeInlayHints?: IEvent<void>;
            provideInlayHints(model: editor.ITextModel, range: Range, token: CancellationToken): ProviderResult<InlayHint[]>;
        }
        interface SemanticTokensLegend {
            readonly tokenTypes: string[];
            readonly tokenModifiers: string[];
        }
        interface SemanticTokens {
            readonly resultId?: string;
            readonly data: Uint32Array;
        }
        interface SemanticTokensEdit {
            readonly start: number;
            readonly deleteCount: number;
            readonly data?: Uint32Array;
        }
        interface SemanticTokensEdits {
            readonly resultId?: string;
            readonly edits: SemanticTokensEdit[];
        }
        interface DocumentSemanticTokensProvider {
            onDidChange?: IEvent<void>;
            getLegend(): SemanticTokensLegend;
            provideDocumentSemanticTokens(model: editor.ITextModel, lastResultId: string | null, token: CancellationToken): ProviderResult<SemanticTokens | SemanticTokensEdits>;
            releaseDocumentSemanticTokens(resultId: string | undefined): void;
        }
        interface DocumentRangeSemanticTokensProvider {
            getLegend(): SemanticTokensLegend;
            provideDocumentRangeSemanticTokens(model: editor.ITextModel, range: Range, token: CancellationToken): ProviderResult<SemanticTokens>;
        }
        interface ILanguageExtensionPoint {
            id: string;
            extensions?: string[];
            filenames?: string[];
            filenamePatterns?: string[];
            firstLine?: string;
            aliases?: string[];
            mimetypes?: string[];
            configuration?: Uri;
        }
        interface IMonarchLanguage {
            tokenizer: {
                [name: string]: IMonarchLanguageRule[];
            };
            ignoreCase?: boolean;
            unicode?: boolean;
            defaultToken?: string;
            brackets?: IMonarchLanguageBracket[];
            start?: string;
            tokenPostfix?: string;
            includeLF?: boolean;
            [key: string]: any;
        }
        type IShortMonarchLanguageRule1 = [string | RegExp, IMonarchLanguageAction];
        type IShortMonarchLanguageRule2 = [string | RegExp, IMonarchLanguageAction, string];
        interface IExpandedMonarchLanguageRule {
            regex?: string | RegExp;
            action?: IMonarchLanguageAction;
            include?: string;
        }
        type IMonarchLanguageRule = IShortMonarchLanguageRule1 | IShortMonarchLanguageRule2 | IExpandedMonarchLanguageRule;
        type IShortMonarchLanguageAction = string;
        interface IExpandedMonarchLanguageAction {
            group?: IMonarchLanguageAction[];
            cases?: Object;
            token?: string;
            next?: string;
            switchTo?: string;
            goBack?: number;
            bracket?: string;
            nextEmbedded?: string;
            log?: string;
        }
        type IMonarchLanguageAction = IShortMonarchLanguageAction | IExpandedMonarchLanguageAction | IShortMonarchLanguageAction[] | IExpandedMonarchLanguageAction[];
        interface IMonarchLanguageBracket {
            open: string;
            close: string;
            token: string;
        }
    }
    export namespace worker {
        interface IMirrorTextModel {
            readonly version: number;
        }
        interface IMirrorModel extends IMirrorTextModel {
            readonly uri: Uri;
            readonly version: number;
            getValue(): string;
        }
        interface IWorkerContext<H = undefined> {
            host: H;
            getMirrorModels(): IMirrorModel[];
        }
    }
    export namespace languages.typescript {
        enum ModuleKind {
            None = 0,
            CommonJS = 1,
            AMD = 2,
            UMD = 3,
            System = 4,
            ES2015 = 5,
            ESNext = 99
        }
        enum JsxEmit {
            None = 0,
            Preserve = 1,
            React = 2,
            ReactNative = 3,
            ReactJSX = 4,
            ReactJSXDev = 5
        }
        enum NewLineKind {
            CarriageReturnLineFeed = 0,
            LineFeed = 1
        }
        enum ScriptTarget {
            ES3 = 0,
            ES5 = 1,
            ES2015 = 2,
            ES2016 = 3,
            ES2017 = 4,
            ES2018 = 5,
            ES2019 = 6,
            ES2020 = 7,
            ESNext = 99,
            JSON = 100,
            Latest = 99
        }
        enum ModuleResolutionKind {
            Classic = 1,
            NodeJs = 2
        }
        interface MapLike<T> {
            [index: string]: T;
        }
        type CompilerOptionsValue = string | number | boolean | (string | number)[] | string[] | MapLike<string[]> | null | undefined;
        interface CompilerOptions {
            allowJs?: boolean;
            allowSyntheticDefaultImports?: boolean;
            allowUmdGlobalAccess?: boolean;
            allowUnreachableCode?: boolean;
            allowUnusedLabels?: boolean;
            alwaysStrict?: boolean;
            baseUrl?: string;
            charset?: string;
            checkJs?: boolean;
            declaration?: boolean;
            declarationMap?: boolean;
            emitDeclarationOnly?: boolean;
            declarationDir?: string;
            disableSizeLimit?: boolean;
            disableSourceOfProjectReferenceRedirect?: boolean;
            downlevelIteration?: boolean;
            emitBOM?: boolean;
            emitDecoratorMetadata?: boolean;
            experimentalDecorators?: boolean;
            forceConsistentCasingInFileNames?: boolean;
            importHelpers?: boolean;
            inlineSourceMap?: boolean;
            inlineSources?: boolean;
            isolatedModules?: boolean;
            jsx?: JsxEmit;
            keyofStringsOnly?: boolean;
            lib?: string[];
            locale?: string;
            mapRoot?: string;
            maxNodeModuleJsDepth?: number;
            module?: ModuleKind;
            moduleResolution?: ModuleResolutionKind;
            newLine?: NewLineKind;
            noEmit?: boolean;
            noEmitHelpers?: boolean;
            noEmitOnError?: boolean;
            noErrorTruncation?: boolean;
            noFallthroughCasesInSwitch?: boolean;
            noImplicitAny?: boolean;
            noImplicitReturns?: boolean;
            noImplicitThis?: boolean;
            noStrictGenericChecks?: boolean;
            noUnusedLocals?: boolean;
            noUnusedParameters?: boolean;
            noImplicitUseStrict?: boolean;
            noLib?: boolean;
            noResolve?: boolean;
            out?: string;
            outDir?: string;
            outFile?: string;
            paths?: MapLike<string[]>;
            preserveConstEnums?: boolean;
            preserveSymlinks?: boolean;
            project?: string;
            reactNamespace?: string;
            jsxFactory?: string;
            composite?: boolean;
            removeComments?: boolean;
            rootDir?: string;
            rootDirs?: string[];
            skipLibCheck?: boolean;
            skipDefaultLibCheck?: boolean;
            sourceMap?: boolean;
            sourceRoot?: string;
            strict?: boolean;
            strictFunctionTypes?: boolean;
            strictBindCallApply?: boolean;
            strictNullChecks?: boolean;
            strictPropertyInitialization?: boolean;
            stripInternal?: boolean;
            suppressExcessPropertyErrors?: boolean;
            suppressImplicitAnyIndexErrors?: boolean;
            target?: ScriptTarget;
            traceResolution?: boolean;
            resolveJsonModule?: boolean;
            types?: string[];
            typeRoots?: string[];
            esModuleInterop?: boolean;
            useDefineForClassFields?: boolean;
            [option: string]: CompilerOptionsValue | undefined;
        }
        interface DiagnosticsOptions {
            noSemanticValidation?: boolean;
            noSyntaxValidation?: boolean;
            noSuggestionDiagnostics?: boolean;
            onlyVisible?: boolean;
            diagnosticCodesToIgnore?: number[];
        }
        interface WorkerOptions {
            customWorkerPath?: string;
        }
        interface InlayHintsOptions {
            readonly includeInlayParameterNameHints?: 'none' | 'literals' | 'all';
            readonly includeInlayParameterNameHintsWhenArgumentMatchesName?: boolean;
            readonly includeInlayFunctionParameterTypeHints?: boolean;
            readonly includeInlayVariableTypeHints?: boolean;
            readonly includeInlayPropertyDeclarationTypeHints?: boolean;
            readonly includeInlayFunctionLikeReturnTypeHints?: boolean;
            readonly includeInlayEnumMemberValueHints?: boolean;
        }
        interface IExtraLib {
            content: string;
            version: number;
        }
        interface IExtraLibs {
            [path: string]: IExtraLib;
        }
        interface DiagnosticMessageChain {
            messageText: string;
            category: 0 | 1 | 2 | 3;
            code: number;
            next?: DiagnosticMessageChain[];
        }
        interface Diagnostic extends DiagnosticRelatedInformation {
            reportsUnnecessary?: {};
            reportsDeprecated?: {};
            source?: string;
            relatedInformation?: DiagnosticRelatedInformation[];
        }
        interface DiagnosticRelatedInformation {
            category: 0 | 1 | 2 | 3;
            code: number;
            file: {
                fileName: string;
            } | undefined;
            start: number | undefined;
            length: number | undefined;
            messageText: string | DiagnosticMessageChain;
        }
        interface EmitOutput {
            outputFiles: OutputFile[];
            emitSkipped: boolean;
        }
        interface OutputFile {
            name: string;
            writeByteOrderMark: boolean;
            text: string;
        }
        interface LanguageServiceDefaults {
            readonly onDidChange: IEvent<void>;
            readonly onDidExtraLibsChange: IEvent<void>;
            readonly workerOptions: WorkerOptions;
            readonly inlayHintsOptions: InlayHintsOptions;
            getExtraLibs(): IExtraLibs;
            addExtraLib(content: string, filePath?: string): IDisposable;
            setExtraLibs(libs: {
                content: string;
                filePath?: string;
            }[]): void;
            getCompilerOptions(): CompilerOptions;
            setCompilerOptions(options: CompilerOptions): void;
            getDiagnosticsOptions(): DiagnosticsOptions;
            setDiagnosticsOptions(options: DiagnosticsOptions): void;
            setWorkerOptions(options: WorkerOptions): void;
            setMaximumWorkerIdleTime(value: number): void;
            setEagerModelSync(value: boolean): void;
            getEagerModelSync(): boolean;
            setInlayHintsOptions(options: InlayHintsOptions): void;
        }
        interface TypeScriptWorker {
            getSyntacticDiagnostics(fileName: string): Promise<Diagnostic[]>;
            getSemanticDiagnostics(fileName: string): Promise<Diagnostic[]>;
            getSuggestionDiagnostics(fileName: string): Promise<Diagnostic[]>;
            getScriptText(fileName: string): Promise<string | undefined>;
            getCompilerOptionsDiagnostics(fileName: string): Promise<Diagnostic[]>;
            getCompletionsAtPosition(fileName: string, position: number): Promise<any | undefined>;
            getCompletionEntryDetails(fileName: string, position: number, entry: string): Promise<any | undefined>;
            getSignatureHelpItems(fileName: string, position: number, options: any): Promise<any | undefined>;
            getQuickInfoAtPosition(fileName: string, position: number): Promise<any | undefined>;
            getOccurrencesAtPosition(fileName: string, position: number): Promise<ReadonlyArray<any> | undefined>;
            getDefinitionAtPosition(fileName: string, position: number): Promise<ReadonlyArray<any> | undefined>;
            getReferencesAtPosition(fileName: string, position: number): Promise<any[] | undefined>;
            getNavigationBarItems(fileName: string): Promise<any[]>;
            getFormattingEditsForDocument(fileName: string, options: any): Promise<any[]>;
            getFormattingEditsForRange(fileName: string, start: number, end: number, options: any): Promise<any[]>;
            getFormattingEditsAfterKeystroke(fileName: string, postion: number, ch: string, options: any): Promise<any[]>;
            findRenameLocations(fileName: string, positon: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename: boolean): Promise<readonly any[] | undefined>;
            getRenameInfo(fileName: string, positon: number, options: any): Promise<any>;
            getEmitOutput(fileName: string): Promise<EmitOutput>;
            getCodeFixesAtPosition(fileName: string, start: number, end: number, errorCodes: number[], formatOptions: any): Promise<ReadonlyArray<any>>;
            provideInlayHints(fileName: string, start: number, end: number): Promise<ReadonlyArray<any>>;
        }
        const typescriptVersion: string;
        const typescriptDefaults: LanguageServiceDefaults;
        const javascriptDefaults: LanguageServiceDefaults;
        const getTypeScriptWorker: () => Promise<(...uris: Uri[]) => Promise<TypeScriptWorker>>;
        const getJavaScriptWorker: () => Promise<(...uris: Uri[]) => Promise<TypeScriptWorker>>;
    }
    export namespace languages.css {
        interface Options {
            readonly validate?: boolean;
            readonly lint?: {
                readonly compatibleVendorPrefixes?: 'ignore' | 'warning' | 'error';
                readonly vendorPrefix?: 'ignore' | 'warning' | 'error';
                readonly duplicateProperties?: 'ignore' | 'warning' | 'error';
                readonly emptyRules?: 'ignore' | 'warning' | 'error';
                readonly importStatement?: 'ignore' | 'warning' | 'error';
                readonly boxModel?: 'ignore' | 'warning' | 'error';
                readonly universalSelector?: 'ignore' | 'warning' | 'error';
                readonly zeroUnits?: 'ignore' | 'warning' | 'error';
                readonly fontFaceProperties?: 'ignore' | 'warning' | 'error';
                readonly hexColorLength?: 'ignore' | 'warning' | 'error';
                readonly argumentsInColorFunction?: 'ignore' | 'warning' | 'error';
                readonly unknownProperties?: 'ignore' | 'warning' | 'error';
                readonly ieHack?: 'ignore' | 'warning' | 'error';
                readonly unknownVendorSpecificProperties?: 'ignore' | 'warning' | 'error';
                readonly propertyIgnoredDueToDisplay?: 'ignore' | 'warning' | 'error';
                readonly important?: 'ignore' | 'warning' | 'error';
                readonly float?: 'ignore' | 'warning' | 'error';
                readonly idSelector?: 'ignore' | 'warning' | 'error';
            };
            readonly data?: CSSDataConfiguration;
        }
        interface ModeConfiguration {
            readonly completionItems?: boolean;
            readonly hovers?: boolean;
            readonly documentSymbols?: boolean;
            readonly definitions?: boolean;
            readonly references?: boolean;
            readonly documentHighlights?: boolean;
            readonly rename?: boolean;
            readonly colors?: boolean;
            readonly foldingRanges?: boolean;
            readonly diagnostics?: boolean;
            readonly selectionRanges?: boolean;
        }
        interface LanguageServiceDefaults {
            readonly languageId: string;
            readonly onDidChange: IEvent<LanguageServiceDefaults>;
            readonly modeConfiguration: ModeConfiguration;
            readonly options: Options;
            setOptions(options: Options): void;
            setModeConfiguration(modeConfiguration: ModeConfiguration): void;
            readonly diagnosticsOptions: DiagnosticsOptions;
            setDiagnosticsOptions(options: DiagnosticsOptions): void;
        }
        type DiagnosticsOptions = Options;
        const cssDefaults: LanguageServiceDefaults;
        const scssDefaults: LanguageServiceDefaults;
        const lessDefaults: LanguageServiceDefaults;
        interface CSSDataConfiguration {
            useDefaultDataProvider?: boolean;
            dataProviders?: {
                [providerId: string]: CSSDataV1;
            };
        }
        interface CSSDataV1 {
            version: 1 | 1.1;
            properties?: IPropertyData[];
            atDirectives?: IAtDirectiveData[];
            pseudoClasses?: IPseudoClassData[];
            pseudoElements?: IPseudoElementData[];
        }
        type EntryStatus = 'standard' | 'experimental' | 'nonstandard' | 'obsolete';
        interface IReference {
            name: string;
            url: string;
        }
        interface IPropertyData {
            name: string;
            description?: string | MarkupContent;
            browsers?: string[];
            restrictions?: string[];
            status?: EntryStatus;
            syntax?: string;
            values?: IValueData[];
            references?: IReference[];
            relevance?: number;
        }
        interface IAtDirectiveData {
            name: string;
            description?: string | MarkupContent;
            browsers?: string[];
            status?: EntryStatus;
            references?: IReference[];
        }
        interface IPseudoClassData {
            name: string;
            description?: string | MarkupContent;
            browsers?: string[];
            status?: EntryStatus;
            references?: IReference[];
        }
        interface IPseudoElementData {
            name: string;
            description?: string | MarkupContent;
            browsers?: string[];
            status?: EntryStatus;
            references?: IReference[];
        }
        interface IValueData {
            name: string;
            description?: string | MarkupContent;
            browsers?: string[];
            status?: EntryStatus;
            references?: IReference[];
        }
        interface MarkupContent {
            kind: MarkupKind;
            value: string;
        }
        type MarkupKind = 'plaintext' | 'markdown';
    }
    export namespace languages.json {
        interface DiagnosticsOptions {
            readonly validate?: boolean;
            readonly allowComments?: boolean;
            readonly schemas?: {
                readonly uri: string;
                readonly fileMatch?: string[];
                readonly schema?: any;
            }[];
            readonly enableSchemaRequest?: boolean;
            readonly schemaValidation?: SeverityLevel;
            readonly schemaRequest?: SeverityLevel;
            readonly trailingCommas?: SeverityLevel;
            readonly comments?: SeverityLevel;
        }
        type SeverityLevel = 'error' | 'warning' | 'ignore';
        interface ModeConfiguration {
            readonly documentFormattingEdits?: boolean;
            readonly documentRangeFormattingEdits?: boolean;
            readonly completionItems?: boolean;
            readonly hovers?: boolean;
            readonly documentSymbols?: boolean;
            readonly tokens?: boolean;
            readonly colors?: boolean;
            readonly foldingRanges?: boolean;
            readonly diagnostics?: boolean;
            readonly selectionRanges?: boolean;
        }
        interface LanguageServiceDefaults {
            readonly languageId: string;
            readonly onDidChange: IEvent<LanguageServiceDefaults>;
            readonly diagnosticsOptions: DiagnosticsOptions;
            readonly modeConfiguration: ModeConfiguration;
            setDiagnosticsOptions(options: DiagnosticsOptions): void;
            setModeConfiguration(modeConfiguration: ModeConfiguration): void;
        }
        const jsonDefaults: LanguageServiceDefaults;
    }
    export namespace languages.html {
        interface HTMLFormatConfiguration {
            readonly tabSize: number;
            readonly insertSpaces: boolean;
            readonly wrapLineLength: number;
            readonly unformatted: string;
            readonly contentUnformatted: string;
            readonly indentInnerHtml: boolean;
            readonly preserveNewLines: boolean;
            readonly maxPreserveNewLines: number | undefined;
            readonly indentHandlebars: boolean;
            readonly endWithNewline: boolean;
            readonly extraLiners: string;
            readonly wrapAttributes: 'auto' | 'force' | 'force-aligned' | 'force-expand-multiline';
        }
        interface CompletionConfiguration {
            readonly [providerId: string]: boolean;
        }
        interface Options {
            readonly format?: HTMLFormatConfiguration;
            readonly suggest?: CompletionConfiguration;
            readonly data?: HTMLDataConfiguration;
        }
        interface ModeConfiguration {
            readonly completionItems?: boolean;
            readonly hovers?: boolean;
            readonly documentSymbols?: boolean;
            readonly links?: boolean;
            readonly documentHighlights?: boolean;
            readonly rename?: boolean;
            readonly colors?: boolean;
            readonly foldingRanges?: boolean;
            readonly diagnostics?: boolean;
            readonly selectionRanges?: boolean;
            readonly documentFormattingEdits?: boolean;
            readonly documentRangeFormattingEdits?: boolean;
        }
        interface LanguageServiceDefaults {
            readonly languageId: string;
            readonly modeConfiguration: ModeConfiguration;
            readonly onDidChange: IEvent<LanguageServiceDefaults>;
            readonly options: Options;
            setOptions(options: Options): void;
            setModeConfiguration(modeConfiguration: ModeConfiguration): void;
        }
        const htmlLanguageService: LanguageServiceRegistration;
        const htmlDefaults: LanguageServiceDefaults;
        const handlebarLanguageService: LanguageServiceRegistration;
        const handlebarDefaults: LanguageServiceDefaults;
        const razorLanguageService: LanguageServiceRegistration;
        const razorDefaults: LanguageServiceDefaults;
        interface LanguageServiceRegistration extends IDisposable {
            readonly defaults: LanguageServiceDefaults;
        }
        function registerHTMLLanguageService(languageId: string, options?: Options, modeConfiguration?: ModeConfiguration): LanguageServiceRegistration;
        interface HTMLDataConfiguration {
            readonly useDefaultDataProvider?: boolean;
            readonly dataProviders?: {
                [providerId: string]: HTMLDataV1;
            };
        }
        interface HTMLDataV1 {
            readonly version: 1 | 1.1;
            readonly tags?: ITagData[];
            readonly globalAttributes?: IAttributeData[];
            readonly valueSets?: IValueSet[];
        }
        interface IReference {
            readonly name: string;
            readonly url: string;
        }
        interface ITagData {
            readonly name: string;
            readonly description?: string | MarkupContent;
            readonly attributes: IAttributeData[];
            readonly references?: IReference[];
        }
        interface IAttributeData {
            readonly name: string;
            readonly description?: string | MarkupContent;
            readonly valueSet?: string;
            readonly values?: IValueData[];
            readonly references?: IReference[];
        }
        interface IValueData {
            readonly name: string;
            readonly description?: string | MarkupContent;
            readonly references?: IReference[];
        }
        interface IValueSet {
            readonly name: string;
            readonly values: IValueData[];
        }
        interface MarkupContent {
            readonly kind: MarkupKind;
            readonly value: string;
        }
        type MarkupKind = 'plaintext' | 'markdown';
    }
}
declare module "packages/code-editor/src/monaco" {
    import * as IMonaco from "packages/code-editor/src/editor.api";
    export type LanguageType = "txt" | "css" | "json" | "javascript" | "typescript" | "solidity" | "markdown" | "html" | "xml" | "shell";
    export function getLanguageType(fileName: string): LanguageType | undefined;
    export interface Monaco {
        editor: typeof IMonaco.editor;
        Uri: typeof IMonaco.Uri;
        languages: typeof IMonaco.languages;
        $loaded: boolean;
    }
    export function addFile(fileName: string, content: string): Promise<IMonaco.editor.ITextModel | null>;
    export function updateFile(fileName: string, content: string): Promise<IMonaco.editor.ITextModel | null>;
    export function getFileModel(fileName: string): Promise<IMonaco.editor.ITextModel | null>;
    export function getModels(): Promise<IMonaco.editor.ITextModel[] | undefined>;
    export function addLib(lib: string, dts: string): Promise<void>;
    export function initMonaco(): Promise<Monaco>;
}
declare module "packages/code-editor/src/style/code-editor.css" { }
declare module "packages/code-editor/src/code-editor" {
    import { Control, ControlElement, notifyEventCallback, notifyKeyboardEventCallback } from "@ijstech/components/base";
    import { addLib, addFile, getFileModel, updateFile, LanguageType, Monaco } from "packages/code-editor/src/monaco";
    import * as IMonaco from "packages/code-editor/src/editor.api";
    import "packages/code-editor/src/style/code-editor.css";
    export interface CodeEditorElement extends ControlElement {
        language?: LanguageType;
        onChange?: notifyEventCallback;
        onKeyDown?: notifyKeyboardEventCallback;
        onKeyUp?: notifyKeyboardEventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-code-editor"]: CodeEditorElement;
            }
        }
    }
    export class CodeEditor extends Control {
        private _editor;
        private _language;
        private _fileName;
        private _value;
        private _options;
        onChange: notifyEventCallback;
        onKeyDown: notifyKeyboardEventCallback;
        onKeyUp: notifyKeyboardEventCallback;
        static addLib: typeof addLib;
        static addFile: typeof addFile;
        static getFileModel: typeof getFileModel;
        static updateFile: typeof updateFile;
        get monaco(): Monaco;
        protected init(): void;
        get editor(): IMonaco.editor.IStandaloneCodeEditor;
        focus(): void;
        setCursor(line: number, column: number): void;
        get language(): LanguageType;
        set language(value: LanguageType);
        get designMode(): boolean;
        set designMode(value: boolean);
        loadContent(content?: string, language?: LanguageType, fileName?: string): Promise<void>;
        updateFileName(oldValue: string, newValue: string): Promise<void>;
        dispose(): void;
        disposeEditor(): Promise<void>;
        scrollToLine(line: number, column: number): void;
        loadFile(fileName: string): Promise<void>;
        updateOptions(options: IMonaco.editor.IEditorOptions): void;
        get value(): string;
        set value(value: string);
    }
}
declare module "packages/code-editor/src/diff-editor" {
    import { Control } from "@ijstech/components/base";
    import { addLib, addFile, getFileModel, updateFile, LanguageType } from "packages/code-editor/src/monaco";
    import { CodeEditorElement } from "packages/code-editor/src/code-editor";
    import * as IMonaco from "packages/code-editor/src/editor.api";
    import "packages/code-editor/src/style/code-editor.css";
    enum EditorType {
        'modified' = 0,
        'original' = 1
    }
    export interface CodeDiffEditorElement extends CodeEditorElement {
        onChange?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-code-diff-editor"]: CodeDiffEditorElement;
            }
        }
    }
    export class CodeDiffEditor extends Control {
        private _editor;
        private _originalModel;
        private _modifiedModel;
        private _language;
        private _fileName;
        private _originalValue;
        private _modifiedValue;
        onChange: any;
        static addLib: typeof addLib;
        static addFile: typeof addFile;
        static getFileModel: typeof getFileModel;
        static updateFile: typeof updateFile;
        protected init(): void;
        get editor(): IMonaco.editor.IDiffEditor;
        get language(): LanguageType;
        set language(value: LanguageType);
        get designMode(): boolean;
        set designMode(value: boolean);
        setModelLanguage(value: LanguageType, functionName: 'getModifiedEditor' | 'getOriginalEditor'): void;
        dispose(): void;
        updateFileName(): void;
        getEditor(type: EditorType): IMonaco.editor.ICodeEditor;
        getModel(type: EditorType): IMonaco.editor.ITextModel | null;
        loadContent(type: EditorType, content?: string, language?: LanguageType, fileName?: string): Promise<void>;
        updateOptions(options: IMonaco.editor.IEditorOptions): void;
        get originalValue(): string;
        set originalValue(value: string);
        get modifiedValue(): string;
        set modifiedValue(value: string);
    }
}
declare module "packages/code-editor/src/index" {
    export { CodeEditor, CodeEditorElement } from "packages/code-editor/src/code-editor";
    export { CodeDiffEditor, CodeDiffEditorElement } from "packages/code-editor/src/diff-editor";
    export { LanguageType } from "packages/code-editor/src/monaco";
}
declare module "packages/data-grid/src/style/dataGrid.css" { }
declare module "packages/data-grid/src/dataGrid" {
    import { Control, Container, ControlElement } from "@ijstech/components/base";
    import { IComboItem } from "packages/combo-box/src/index";
    import "packages/data-grid/src/style/dataGrid.css";
    export type ColRowType = "datePicker" | "dateTimePicker" | "timePicker" | "checkBox" | "comboBox" | "number" | "integer" | "string";
    type DataType = "date" | "dateTime" | "time" | "boolean" | "number" | "integer" | "string";
    export type cellValueChangedCallback = (source: DataGrid, cell: DataGridCell, oldValue: any, newValue: any) => void;
    export interface IDataGridElement extends ControlElement {
        caption?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-data-grid']: IDataGridElement;
            }
        }
    }
    interface IDataGrid {
        colCount: number;
        columns: {
            [colIdx: number]: any;
        };
        rowHeights: any[];
        getColWidth(col: number): number;
        setColWidth(col: number, value: number): void;
        enableUpdateTimer(): void;
    }
    export class DataGridCell {
        private grid;
        private _col;
        private _row;
        private _visible;
        private _button;
        private _checkBox;
        private _color;
        private _formula;
        private _hint;
        private _horizontalAlign;
        private _html;
        private _image;
        private _object;
        private _readOnly;
        private _text;
        private _value;
        mergeRect: any;
        constructor(grid: DataGrid, col: number, row: number);
        get button(): boolean;
        set button(value: boolean);
        get checkBox(): boolean;
        set checkBox(value: boolean);
        get col(): number;
        set col(value: number);
        get color(): string;
        set color(value: string);
        get displayValue(): any;
        get formula(): any;
        set formula(value: any);
        get hint(): string;
        set hint(value: string);
        get horizontalAlign(): boolean;
        set horizontalAlign(value: boolean);
        get html(): string;
        set html(value: string);
        get image(): string;
        set image(value: string);
        get object(): any;
        set object(value: any);
        get readOnly(): boolean;
        set readOnly(value: boolean);
        get row(): number;
        set row(value: number);
        get text(): string;
        set text(value: string);
        get value(): any;
        set value(value: any);
        get visible(): boolean;
        set visible(value: boolean);
    }
    class TGridColumn {
        private grid;
        private _colIdx;
        private _dataType;
        private _visible;
        private _resizable;
        private _sortable;
        private _color;
        private _horizontalAlign;
        private _type;
        private _readOnly;
        private _lookupContext;
        private _lookupTable;
        private _suggestTable;
        private _lookupField;
        private _lookupDetailField;
        private _lookupDetailValue;
        private _lookupDetailType;
        private _listOfValue;
        private _format;
        private _formula;
        private _displayUserName;
        private _binding;
        private _comboItems;
        private _rows;
        constructor(grid: IDataGrid, colIdx: number);
        get asJSON(): any;
        set asJSON(value: any);
        get binding(): any;
        set binding(value: any);
        get colIdx(): number;
        set colIdx(value: number);
        get color(): string;
        set color(value: string);
        get comboItems(): IComboItem[];
        set comboItems(value: IComboItem[]);
        get default(): boolean;
        get format(): string;
        set format(value: string);
        get formula(): string;
        set formula(value: string);
        get horizontalAlign(): number;
        set horizontalAlign(value: number);
        get readOnly(): boolean;
        set readOnly(value: boolean);
        get resizable(): boolean;
        set resizable(value: boolean);
        get sortable(): boolean;
        set sortable(value: boolean);
        get type(): ColRowType;
        set type(value: ColRowType);
        get dataType(): DataType;
        get visible(): boolean;
        set visible(value: boolean);
        get width(): number;
        set width(value: number);
    }
    class TGridColumns {
        private grid;
        private columns;
        private count;
        constructor(grid: DataGrid);
        clear(): void;
        deleteCol(aCol: number): void;
        getColumn(index: number): TGridColumn;
        insertCol(colIdx: number): void;
        loadFromJSON(value: any): void;
        _loadFromJSON(value: any): void;
        saveToJSON(): any[] | undefined;
        setColCount(value: number): void;
        updateColIndex(): void;
    }
    class TGridRow {
        private grid;
        private _comboItems;
        private _visible;
        private _color;
        private _height;
        private _readOnly;
        private _resizable;
        private _type;
        private _dataType;
        constructor(grid: DataGrid);
        get color(): string;
        set color(value: string);
        get comboItems(): IComboItem[];
        set comboItems(value: IComboItem[]);
        get height(): number;
        set height(value: number);
        get readOnly(): boolean;
        set readOnly(value: boolean);
        get resizable(): boolean;
        set resizable(value: boolean);
        get type(): ColRowType;
        set type(value: ColRowType);
        get dataType(): DataType;
        get visible(): boolean;
        set visible(value: boolean);
    }
    class TGridRows {
        private grid;
        rows: any[];
        private defaultHeight;
        constructor(grid: DataGrid, defaultHeight: number);
        clear(): void;
        getHeight(index: number): any;
        getRow(index: number): TGridRow;
    }
    export type TGridLayout = 'grid' | 'card';
    export class DataGrid extends Control {
        private _colResizing;
        private _listOfValue;
        private _defaultRowHeight;
        private _defaultColWidth;
        private _layout;
        private mergeRect;
        private tableCells;
        private tableSplitters;
        private selectedCells;
        private selectedCellsHighlight;
        private placeHolder;
        private _table;
        private edit;
        private cellHighlight;
        private selectedRangeHighlight;
        private _scrollBox;
        private tableContainer;
        private data;
        columns: TGridColumns;
        gridRows: TGridRows;
        private _colCount;
        private _rowCount;
        private editor;
        private editorMode;
        private _cardPanel;
        private colWidths;
        private _rowHeights;
        private mouseDownPosX;
        private resizeCol;
        private origColWidth;
        private _fixedCol;
        private _fixedRow;
        private _leftCol;
        private _topRow;
        private _row;
        private _col;
        private _readOnly;
        private _scrollLeft;
        private _scrollTop;
        private _dataBindingContext;
        private dataBinding;
        private _skipRefreshData;
        private _bindingRecordSet;
        private showDataInternalFlag;
        private _updateTableTimer;
        private _sorting;
        private _setScrollLeftInterval;
        private _setScrollTopInterval;
        private _restScrollboxHandler;
        private scrollHorizontalTimer;
        private scrollVerticalTimer;
        private _updateTableInternalFlag;
        private _totalColWidth;
        private _totalRowHeight;
        private visibleRowCount;
        private visibleColCount;
        private _needUpdate;
        private showDataFlag;
        private _showDataTimeout;
        private _refreshDataTimeout;
        private _destroyed;
        private sortingCol;
        private sortingDescending;
        private _currCell;
        private resizeTimer;
        private lastClickCell;
        private formula;
        private formulaCell;
        private origValue;
        onSort: any;
        onRowChange: any;
        onCellSelect: any;
        onColResize: any;
        onButtonClick: any;
        onCellClick: any;
        onCellChange: cellValueChangedCallback;
        onDisplayCell: any;
        onEditModeChanged: any;
        onGetEditControl: any;
        onKeyDown: any;
        static create(options?: IDataGridElement, parent?: Container): Promise<DataGrid>;
        constructor(parent?: Control, options?: IDataGridElement);
        get fixedCol(): number;
        set fixedCol(value: number);
        get fixedRow(): number;
        set fixedRow(value: number);
        get layout(): TGridLayout;
        set layout(value: TGridLayout);
        init(): Promise<void>;
        private _init;
        calcTopRow(rowIdx: number): number;
        cells(aCol: number, aRow: number, refresh?: boolean): DataGridCell;
        get col(): number;
        set col(value: number);
        get row(): number;
        set row(value: number);
        get colCount(): number;
        set colCount(value: number);
        get readOnly(): boolean;
        set readOnly(value: boolean);
        get rowCount(): number;
        set rowCount(value: number);
        get topRow(): number;
        set topRow(value: number);
        private _updateRowHeights;
        setObject(aCol: number, aRow: number, aObject: any): void;
        private setJSONValue;
        private updateBindingData;
        private _updateCurrCellValue;
        private hideEditor;
        checkEmptyRow(row: number): boolean;
        setRowCount(aRowCount: number): void;
        refresh(): void;
        deleteRow(row: number): void;
        getObject(aCol: number, aRow: number): any;
        getValue(col: number, row: number): any;
        setScrollLeft(): void;
        setScrollLeftInternal(): void;
        setScrollTop(): void;
        setScrollTopInternal(): void;
        setLeftCol(aLeftCol: number, skipSetScroll?: boolean): void;
        private setTopRow;
        showData(interval: number): void;
        getTableCellByActualIndex(aColIdx: number, aRowIdx: number): HTMLTableCellElement | undefined;
        getTableCell(aColIdx: number, aRowIdx: number): any;
        highlightCurrCell(): void;
        setCurrCell(aCol: number, aRow: number, triggerEvent?: boolean): void;
        private highlightSelectedCell;
        private _updateLanguage;
        private _updateListOfValues;
        private _handleScrollHorizontal;
        _handleScrollVertical(sender: HTMLElement): void;
        private _handleScroll;
        private _handleFileDrop;
        private _handleDragOver;
        private _handleInput;
        protected _handleMouseWheel(event: WheelEvent, delta: number): void;
        private getColLeft;
        private getColRight;
        getColWidth(col: number): number;
        private getRowHeight;
        private _updateTotalRowHeight;
        private _updateTotalColWidth;
        private _updateTableRows;
        private getActualColIdx;
        private getActualRowIdx;
        cols(colIdx: number): TGridColumn;
        rows(rowIdx: number): TGridRow;
        private _updateTableCellDiv;
        private _updateTableCols;
        setColWidth(aColIndex: number, width: number, trigerEvent?: boolean): void;
        private _updateTableMergedCells;
        sort(col: number, descending?: boolean): void;
        private getEditor;
        private handleEditControlChange;
        protected _handleEditDblClick(event: Event, stopPropagation?: boolean): boolean;
        protected colLeft(): void;
        protected colRight(): void;
        protected autoAddRow(): void;
        protected rowDown(disableAutoAddRow?: boolean): void;
        protected calcBottomRow(topRowIdx: number): number;
        protected calcLeftCol(colIdx: number): number;
        protected rowUp(): void;
        protected restoreOrigCellValue(): void;
        protected _handleKeyDown(event: KeyboardEvent, stopPropagation?: boolean): boolean | undefined;
        protected _handleBlur(event: Event, stopPropagation?: boolean): boolean;
        private showEditor;
        protected _handleMouseDown(event: MouseEvent): boolean;
        private _updateCell;
        private checkCellReadOnly;
        private toggleCellValue;
        protected _handleMouseMove(event: MouseEvent): boolean;
        protected _handleMouseUp(event: Event): boolean;
        private _handleColumnResizeStart;
        private _updateTableSplitter;
        private _showDataInternalGrid;
        private showDataInternal;
        private _updateTableInternal;
        enableUpdateTimer(updateRowHeightFlag?: boolean, updateColWidthFlag?: boolean): void;
    }
}
/// <amd-module name="@ijstech/components/dataGrid" />
declare module "@ijstech/components/dataGrid" {
    export { DataGrid, DataGridCell } from "packages/data-grid/src/dataGrid";
}
declare module "packages/markdown/src/styles/index.css" { }
declare module "packages/markdown/src/plaintify" {
    export const TxtRenderer: any;
}
declare module "packages/markdown/src/markdown" {
    import { Control, ControlElement, ISpace } from "@ijstech/components/base";
    import "packages/markdown/src/styles/index.css";
    export interface MarkdownElement extends ControlElement {
        caption?: string;
        src?: string;
        assetPath?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-markdown"]: MarkdownElement;
            }
        }
    }
    export function markdownToPlainText(text: string): Promise<string>;
    export class Markdown extends Control {
        private elm;
        private marked;
        gitbookProcess: boolean;
        fileRoot: string;
        private _theme;
        private _space;
        constructor(parent?: Control, options?: MarkdownElement);
        get theme(): 'light' | 'dark';
        set theme(value: 'light' | 'dark');
        get padding(): ISpace;
        set padding(value: ISpace);
        private getRenderer;
        getTokens(text: string): Promise<any>;
        toPlainText(text: string): Promise<string>;
        load(text: string): Promise<any>;
        private preParse;
        beforeRender(text: string): Promise<void>;
        processText(text: string): Promise<string>;
        loadLib(): Promise<unknown>;
        protected init(): void;
    }
}
declare module "packages/markdown/src/index" {
    export { Markdown, MarkdownElement, markdownToPlainText } from "packages/markdown/src/markdown";
}
declare module "packages/markdown-editor/src/styles/index.css" { }
declare module "packages/markdown-editor/src/markdown-editor" {
    import { Border, Container, Control, IBorder, ISpace, notifyEventCallback } from "@ijstech/components/base";
    import { Markdown } from "packages/markdown/src/index";
    import { Text, TextElement } from "packages/text/src/index";
    import "packages/markdown-editor/src/styles/index.css";
    export interface MarkdownEditorElement extends TextElement {
        mode?: 'wysiwyg' | 'markdown';
        theme?: 'light' | 'dark';
        previewStyle?: 'tab' | 'vertical';
        hideModeSwitch?: boolean;
        value?: string;
        viewer?: boolean;
        toolbarItems?: any[];
        plugins?: any[];
        widgetRules?: {
            rule: string | object;
            toDOM: (text: string) => any;
        }[];
        placeholder?: string;
        autoFocus?: boolean;
        onChanged?: notifyEventCallback;
        onFocus?: notifyEventCallback;
        onBlur?: notifyEventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-markdown-editor"]: MarkdownEditorElement;
            }
        }
    }
    export class MarkdownEditor extends Text {
        private editor;
        private editorPlugins;
        private editorObj;
        private mdViewer;
        private elm;
        private _theme;
        private _mode;
        private _previewStyle;
        private _value;
        private _viewer;
        private _heightValue;
        private _toolbarItems;
        private _customPlugins;
        private _widgetRules;
        private _hideModeSwitch;
        private _placeholder;
        private _autoFocus;
        private overlayElm;
        onChanged: notifyEventCallback;
        onFocus: notifyEventCallback;
        onBlur: notifyEventCallback;
        setFocus(): void;
        get mode(): 'wysiwyg' | 'markdown';
        set mode(value: 'wysiwyg' | 'markdown');
        get theme(): 'light' | 'dark';
        set theme(value: 'light' | 'dark');
        get previewStyle(): 'tab' | 'vertical';
        set previewStyle(value: 'tab' | 'vertical');
        get viewer(): boolean;
        set viewer(value: boolean);
        set designMode(value: boolean);
        get value(): string;
        set value(value: string);
        setValue(value: string): Promise<void>;
        get height(): string | number;
        set height(value: string | number);
        get toolbarItems(): any[];
        set toolbarItems(items: any[]);
        get plugins(): any[];
        set plugins(plugins: any[]);
        get widgetRules(): {
            rule: string | object;
            toDOM: (text: string) => any;
        }[];
        set widgetRules(rules: {
            rule: string | object;
            toDOM: (text: string) => any;
        }[]);
        get hideModeSwitch(): boolean;
        set hideModeSwitch(value: boolean);
        get autoFocus(): boolean;
        set autoFocus(value: boolean);
        get placeholder(): string;
        set placeholder(value: string);
        get padding(): ISpace;
        set padding(value: ISpace);
        get border(): Border;
        set border(value: IBorder);
        static create(options?: MarkdownEditorElement, parent?: Container): Promise<MarkdownEditor>;
        constructor(parent?: Control, options?: MarkdownEditorElement);
        private loadPlugin;
        private loadSyntaxHighlightPlugin;
        private loadPlugins;
        private addCSS;
        private initEditor;
        private renderEditor;
        getMarkdownValue(): any;
        getEditorElm(): any;
        getViewerElm(): Markdown | null;
        protected init(): Promise<void>;
    }
}
declare module "packages/markdown-editor/src/index" {
    export { MarkdownEditor, MarkdownEditorElement } from "packages/markdown-editor/src/markdown-editor";
}
declare module "packages/menu/src/style/menu.css" {
    export const menuStyle: string;
    export const meunItemStyle: string;
    export const modalStyle: string;
}
declare module "packages/menu/src/menu" {
    import { Control, ControlElement, IContextMenu, IFont, ISpace } from "@ijstech/components/base";
    import { Link, LinkElement } from "packages/link/src/index";
    import { Icon, IconElement } from "packages/icon/src/index";
    export type MenuMode = "horizontal" | "vertical" | "inline";
    type AlignType = 'left' | 'right' | 'center';
    export interface MenuItemElement extends IMenuItem {
        level?: number;
    }
    export interface IMenuItem extends ControlElement {
        title?: string;
        link?: LinkElement;
        icon?: IconElement;
        items?: IMenuItem[];
        textAlign?: AlignType;
    }
    export interface MenuElement extends ControlElement {
        mode?: MenuMode;
        data?: IMenuItem[];
        items?: MenuItem[];
        onItemClick?: (target: Menu, item: MenuItem) => void;
    }
    export interface ContextMenuElement extends ControlElement {
        data?: IMenuItem[];
        items?: MenuItem[];
        onItemClick?: (target: Menu, item: MenuItem) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-menu"]: MenuElement;
                ["i-menu-item"]: MenuItemElement;
                ["i-context-menu"]: ContextMenuElement;
            }
        }
    }
    export class Menu extends Control {
        private menuElm;
        private _mode;
        private _data;
        private _items;
        private moreItem;
        onItemClick: (target: Menu, item: MenuItem) => void;
        private _oldWidth;
        private itemsWidth;
        private resizeTimeout;
        private _selectedItem;
        add(options?: IMenuItem): MenuItem;
        delete(item: MenuItem): void;
        get mode(): MenuMode;
        set mode(value: MenuMode);
        get data(): IMenuItem[];
        set data(value: IMenuItem[]);
        get items(): MenuItem[];
        set items(items: MenuItem[]);
        get selectedItem(): MenuItem | undefined;
        set selectedItem(item: MenuItem | undefined);
        private updateItemOptions;
        get menuItems(): MenuItem[];
        private clear;
        private renderItem;
        private handleUpdateMode;
        private rerenderItems;
        private onResize;
        private handleResize;
        protected init(): void;
        disconnectedCallback(): void;
        static create(options?: MenuElement, parent?: Control): Promise<Menu>;
    }
    export class ContextMenu extends Menu implements IContextMenu {
        private modal;
        private openTimeout;
        private itemPanel;
        show(pos: {
            x: number;
            y: number;
        }): void;
        hide(): void;
        private renderItemModal;
        private getModalContainer;
        private handleModalOpen;
    }
    export class MenuItem extends Control {
        private itemElm;
        private itemWrapperElm;
        private captionElm;
        private subMenu;
        private arrowIcon;
        private modal;
        private itemPanel;
        protected _linkTo: Menu;
        private _link;
        private _icon;
        private _items;
        private openTimeout;
        private closeTimeout;
        private _level;
        private _textAlign;
        constructor(parent?: Control, options?: MenuItemElement);
        add(options?: IMenuItem): MenuItem;
        delete(item: MenuItem): void;
        get title(): string;
        set title(value: string);
        set font(value: IFont);
        get font(): IFont;
        get link(): Link;
        set link(value: Link);
        get icon(): Icon;
        set icon(elm: Icon);
        get items(): MenuItem[];
        set items(items: MenuItem[]);
        get textAlign(): AlignType;
        set textAlign(value: AlignType);
        set level(value: number);
        get padding(): ISpace;
        set padding(value: ISpace);
        set selected(value: boolean);
        private get isSelected();
        private set isSelected(value);
        private updateLevel;
        private menuMode;
        private renderArrowIcon;
        private renderSubMenuItem;
        private renderItemModal;
        private getModalPlacement;
        private getModalContainer;
        private setSelectedItem;
        private handleSelectItem;
        _handleClick(event: MouseEvent): boolean;
        private handleModalOpen;
        private handleModalClose;
        protected init(): void;
        static create(options?: MenuItemElement, parent?: Control): Promise<MenuItem>;
    }
}
declare module "packages/menu/src/index" {
    export { Menu, ContextMenu, IMenuItem, MenuElement, MenuItem, MenuItemElement } from "packages/menu/src/menu";
}
declare module "packages/tree-view/src/style/treeView.css" { }
declare module "packages/tree-view/src/treeView" {
    import { Control, ControlElement } from "@ijstech/components/base";
    import { Icon, IconElement } from "packages/icon/src/index";
    import { Button, ButtonElement } from "packages/button/src/index";
    import "packages/tree-view/src/style/treeView.css";
    type activedChangeCallback = (target: TreeView, prevNode?: TreeNode, event?: Event) => void;
    type changeCallback = (target: TreeView, node: TreeNode, oldValue: string, newValue: string) => void;
    type beforeChangeCallback = (target: TreeView, node: TreeNode, oldValue: string, newValue: string) => boolean;
    type renderCallback = (target: TreeView, node: TreeNode) => void;
    type mouseEnterCallback = (target: TreeView, node: TreeNode) => void;
    type mouseLeaveCallback = (target: TreeView, node: TreeNode) => void;
    type actionButtonCallback = (target: TreeView, actionButton: Button, event: Event) => void;
    type lazyLoadCallback = (target: TreeView, node: TreeNode) => void;
    export interface ITreeNode {
        caption?: string;
        icon?: IconElement;
        rightIcon?: IconElement;
        collapsible?: boolean;
        expanded?: boolean;
        isLazyLoad?: boolean;
        active?: boolean;
        children?: ITreeNode[];
        alwaysExpanded?: boolean;
    }
    export interface TreeViewElement extends ControlElement {
        activeItem?: TreeNode;
        data?: ITreeNode[];
        editable?: boolean;
        actionButtons?: ButtonElement[];
        alwaysExpanded?: boolean;
        deleteNodeOnEmptyCaption?: boolean;
        onActiveChange?: activedChangeCallback;
        onChange?: changeCallback;
        onBeforeChange?: beforeChangeCallback;
        onRenderNode?: renderCallback;
        onMouseEnterNode?: mouseEnterCallback;
        onMouseLeaveNode?: mouseLeaveCallback;
        onLazyLoad?: lazyLoadCallback;
        onActionButtonClick?: actionButtonCallback;
    }
    export interface TreeNodeElement extends ControlElement {
        caption?: string;
        icon?: IconElement;
        rightIcon?: IconElement;
        collapsible?: boolean;
        expanded?: boolean;
        isLazyLoad?: boolean;
        active?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-tree-view']: TreeViewElement;
                ['i-tree-node']: TreeNodeElement;
            }
        }
    }
    export class TreeView extends Control {
        private _activeItem;
        private _data;
        private _editable;
        private _items;
        private _actionButtons;
        private _alwaysExpanded;
        _deleteNodeOnEmptyCaption: boolean;
        onRenderNode: renderCallback;
        onActiveChange: activedChangeCallback;
        onChange: changeCallback;
        onBeforeChange: beforeChangeCallback;
        onMouseEnterNode: mouseEnterCallback;
        onMouseLeaveNode: mouseLeaveCallback;
        onLazyLoad: lazyLoadCallback;
        onActionButtonClick: actionButtonCallback;
        constructor(parent?: Control, options?: any);
        get activeItem(): TreeNode | undefined;
        set activeItem(value: TreeNode | undefined);
        get alwaysExpanded(): boolean;
        set alwaysExpanded(value: boolean);
        get data(): ITreeNode[];
        set data(value: ITreeNode[]);
        get items(): TreeNode[];
        get editable(): boolean;
        set editable(value: boolean);
        get actionButtons(): ButtonElement[];
        set actionButtons(value: ButtonElement[]);
        add(parentNode?: TreeNode | null, caption?: string): TreeNode;
        appendNode(childNode: TreeNode): void;
        delete(node: TreeNode): void;
        clear(): void;
        _setActiveItem(node: TreeNode, event?: Event): void;
        private handleMouseEnter;
        private handleMouseLeave;
        private handleLazyLoad;
        private initNode;
        private registerEvents;
        private renderTreeNode;
        private renderTree;
        private renderActions;
        protected init(): void;
        static create(options?: TreeViewElement, parent?: Control): Promise<TreeView>;
    }
    export class TreeNode extends Control {
        private _caption;
        private _collapsible;
        private _expanded;
        private _active;
        private _isLazyLoad;
        private _editable;
        private _data;
        private _alwaysExpanded;
        private _wrapperElm;
        private _expandElm;
        private _captionElm;
        private _childNodeElm;
        private _iconElm;
        private _iconRightElm;
        constructor(parent?: Control, options?: any);
        get data(): ITreeNode;
        set data(value: ITreeNode);
        get caption(): string;
        set caption(value: string);
        get collapsible(): boolean;
        set collapsible(value: any);
        get expanded(): boolean;
        set expanded(value: any);
        get alwaysExpanded(): boolean;
        set alwaysExpanded(value: boolean);
        get active(): boolean;
        set active(value: any);
        get isLazyLoad(): boolean;
        set isLazyLoad(value: boolean);
        get editable(): boolean;
        set editable(value: boolean);
        get rootParent(): TreeView;
        get icon(): Icon;
        get rightIcon(): Icon;
        get height(): number | string;
        set height(value: number | string);
        private handleChange;
        private renderEditMode;
        private handleEdit;
        edit(): void;
        appendNode(childNode: TreeNode): TreeNode;
        private initChildNodeElm;
        _handleClick(event: MouseEvent): boolean;
        _handleDblClick(event: MouseEvent): boolean;
        _handleContextMenu(event: MouseEvent): boolean;
        protected init(): void;
        static create(options?: TreeNodeElement, parent?: Control): Promise<TreeNode>;
    }
}
declare module "packages/tree-view/src/index" {
    export { TreeView, TreeViewElement, TreeNode, TreeNodeElement } from "packages/tree-view/src/treeView";
}
declare module "packages/popover/src/style/popover.css" {
    export const getOverlayStyle: () => string;
    export const getNoBackdropStyle: () => string;
    export const getAbsoluteWrapperStyle: (left: string, top: string) => string;
    export const popoverMainContentStyle: string;
}
declare module "packages/popover/src/popover" {
    import { Control, ControlElement, Container, IBackground, IBorder, Background, Border, ISpace } from "@ijstech/components/base";
    export type popoverPlacementType = 'center' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'top' | 'topLeft' | 'topRight' | 'rightTop' | 'left' | 'right';
    type eventCallback = (target: Control) => void;
    type PopoverPositionType = "fixed" | "absolute";
    export interface PopoverElement extends ControlElement {
        placement?: popoverPlacementType;
        closeOnScrollChildFixed?: boolean;
        item?: Control;
        onOpen?: eventCallback;
        onClose?: eventCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-popover']: PopoverElement;
            }
        }
    }
    export class Popover extends Container {
        protected _visible: boolean;
        private wrapperDiv;
        private popoverDiv;
        private bodyDiv;
        private overlayDiv;
        private _placement;
        private _wrapperPositionAt;
        private insideClick;
        private boundHandlePopoverMouseDown;
        private boundHandlePopoverMouseUp;
        protected _onOpen: eventCallback;
        onClose: eventCallback;
        constructor(parent?: Control, options?: any);
        get visible(): boolean;
        set visible(value: boolean);
        get onOpen(): any;
        set onOpen(callback: any);
        get placement(): popoverPlacementType;
        set placement(value: popoverPlacementType);
        get item(): Control;
        set item(value: Control);
        get position(): PopoverPositionType;
        set position(value: PopoverPositionType);
        _handleClick(event: MouseEvent): boolean;
        private positionPopoverRelativeToParent;
        private calculatePopoverWrapperCoordinates;
        protected _handleOnShow(event: Event): void;
        private handlePopoverMouseDown;
        private handlePopoverMouseUp;
        private setInsideClick;
        private setPropertyValue;
        refresh(): void;
        get background(): Background;
        set background(value: IBackground);
        get width(): number | string;
        set width(value: number | string);
        get height(): number | string;
        set height(value: number | string);
        get border(): Border;
        set border(value: IBorder);
        get padding(): ISpace;
        set padding(value: ISpace);
        protected removeTargetStyle(target: HTMLElement, propertyName: string): void;
        protected setTargetStyle(target: HTMLElement, propertyName: string, value: string): void;
        protected init(): void;
        static create(options?: PopoverElement, parent?: Container): Promise<Popover>;
    }
}
declare module "packages/popover/src/index" {
    export { Popover, PopoverElement, popoverPlacementType } from "packages/popover/src/popover";
}
declare module "packages/chart/src/chart" {
    import { Control, ControlElement } from "@ijstech/components/base";
    export interface EchartElement extends ControlElement {
        theme?: 'light' | 'dark';
    }
    export class Chart<T> extends Control {
        private _data;
        private _theme;
        private _echart;
        private _chartDom;
        private _chartIns;
        constructor(parent?: Control, options?: any);
        get data(): T;
        set data(value: T);
        get theme(): 'light' | 'dark';
        set theme(value: 'light' | 'dark');
        private get dataObj();
        showLoading(): void;
        drawChart(): void;
        private _drawChart;
        updateChartOptions(): void;
        resize(): void;
        private initChartDom;
        protected init(): void;
    }
}
declare module "packages/chart/src/lineChart" {
    import { Control } from "@ijstech/components/base";
    import { Chart, EchartElement } from "packages/chart/src/chart";
    export interface LineEchartElement extends EchartElement {
        data?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-line-chart']: LineEchartElement;
            }
        }
    }
    export class LineChart extends Chart<any> {
        constructor(parent?: Control, options?: any);
        protected init(): void;
    }
}
declare module "packages/chart/src/barChart" {
    import { Control } from "@ijstech/components/base";
    import { Chart, EchartElement } from "packages/chart/src/chart";
    export interface IBarChartAxisTick {
        show?: boolean;
    }
    export interface IBarChartAxisLineStyle {
        type?: string;
    }
    export interface IBarChartAxisLine {
        show?: boolean;
        lineStyle?: IBarChartAxisLineStyle;
    }
    export interface IBarChartAxisSplitLine {
        show?: boolean;
        lineStyle?: IBarChartAxisLineStyle;
    }
    export interface IBarChartAxisLabel {
        color?: string;
        fontSize?: number;
        fontFamily?: string;
    }
    export interface IBarChartAxisNameTextStyle {
        fontSize?: number;
        color?: string;
    }
    export interface IBarChartAxis {
        type?: string;
        name?: string;
        nameGap?: number;
        nameTextStyle?: IBarChartAxisNameTextStyle;
        boundaryGap?: boolean;
        data?: string[];
        min?: number;
        max?: number;
        axisTick?: IBarChartAxisTick;
        axisLabel?: IBarChartAxisLabel;
        axisLine?: IBarChartAxisLine;
        splitLine?: IBarChartAxisSplitLine;
    }
    export interface IBarChartSeriesLabel {
        show: boolean;
        position: string;
    }
    export interface IBarChartSeries {
        type?: string;
        name?: string;
        data?: any[];
        label?: IBarChartSeriesLabel;
    }
    export interface IBarChartData {
        xAxis?: IBarChartAxis;
        yAxis?: IBarChartAxis;
        color?: string[];
        series?: IBarChartSeries[];
    }
    export interface BarEchartElement extends EchartElement {
        data?: IBarChartData;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-bar-chart']: BarEchartElement;
            }
        }
    }
    export class BarChart extends Chart<IBarChartData> {
        constructor(parent?: Control, options?: any);
        protected init(): void;
    }
}
declare module "packages/chart/src/barStackChart" {
    import { Control } from "@ijstech/components/base";
    import { Chart, EchartElement } from "packages/chart/src/chart";
    export interface BarEchartElement extends EchartElement {
        data?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-bar-stack-chart']: BarEchartElement;
            }
        }
    }
    export class BarStackChart extends Chart<any> {
        constructor(parent?: Control, options?: any);
        protected init(): void;
    }
}
declare module "packages/chart/src/pieChart" {
    import { Control } from "@ijstech/components/base";
    import { Chart, EchartElement } from "packages/chart/src/chart";
    export interface IPieChartTooltip {
        trigger?: string;
        formatter?: string;
    }
    export interface IPieChartSeries {
        type?: string;
        radius?: string[];
        avoidLabelOverlap?: boolean;
        data?: any[];
    }
    export interface IPieChartData {
        tooltip?: IPieChartTooltip;
        series?: IPieChartSeries[];
    }
    export interface PieEchartElement extends EchartElement {
        data?: IPieChartData;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-pie-chart']: PieEchartElement;
            }
        }
    }
    export class PieChart extends Chart<IPieChartData> {
        constructor(parent?: Control, options?: any);
        protected init(): void;
    }
}
declare module "packages/chart/src/scatterChart" {
    import { Control } from "@ijstech/components/base";
    import { Chart, EchartElement } from "packages/chart/src/chart";
    export interface ScatterChartElement extends EchartElement {
        data?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scatter-chart']: ScatterChartElement;
            }
        }
    }
    export class ScatterChart extends Chart<any> {
        constructor(parent?: Control, options?: any);
        protected init(): void;
    }
}
declare module "packages/chart/src/scatterLineChart" {
    import { Control } from "@ijstech/components/base";
    import { Chart, EchartElement } from "packages/chart/src/chart";
    export interface ScatterLineChartElement extends EchartElement {
        data?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scatter-line-chart']: ScatterLineChartElement;
            }
        }
    }
    export class ScatterLineChart extends Chart<any> {
        constructor(parent?: Control, options?: any);
        protected init(): void;
    }
}
declare module "packages/chart/src/index" {
    export { Chart } from "packages/chart/src/chart";
    export { LineChart } from "packages/chart/src/lineChart";
    export { BarChart } from "packages/chart/src/barChart";
    export { BarStackChart } from "packages/chart/src/barStackChart";
    export { PieChart } from "packages/chart/src/pieChart";
    export { ScatterChart } from "packages/chart/src/scatterChart";
    export { ScatterLineChart } from "packages/chart/src/scatterLineChart";
}
declare module "packages/iframe/src/style/iframe.css" { }
declare module "packages/iframe/src/iframe" {
    import { Control, ControlElement } from "@ijstech/components/base";
    import "packages/iframe/src/style/iframe.css";
    export interface IframeElement extends ControlElement {
        url?: string;
        allowFullscreen?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-iframe']: IframeElement;
            }
        }
    }
    export class Iframe extends Control {
        private _url;
        private allowFullscreen;
        private iframeElm;
        private overlayElm;
        constructor(parent?: Control, options?: any);
        reload(): Promise<void>;
        postMessage(msg: string): void;
        get url(): string;
        set url(value: string);
        set designMode(value: boolean);
        protected init(): void;
        static create(options?: IframeElement, parent?: Control): Promise<Iframe>;
    }
}
declare module "packages/iframe/src/index" {
    export { Iframe, IframeElement } from "packages/iframe/src/iframe";
}
declare module "packages/pagination/src/style/pagination.css" { }
declare module "packages/pagination/src/pagination" {
    import { Control, ControlElement } from "@ijstech/components/base";
    import "packages/pagination/src/style/pagination.css";
    type notifyCallback = (target: Pagination, lastActivePage: number) => void;
    export interface PaginationElement extends ControlElement {
        totalPages?: number;
        currentPage?: number;
        pageSize?: number;
        onPageChanged?: notifyCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-pagination']: PaginationElement;
            }
        }
    }
    export class Pagination extends Control {
        private _totalPages;
        private _curPage;
        private _pageSize;
        private _showPrevMore;
        private _showNextMore;
        private pagers;
        private pageItems;
        private activeItem;
        private _paginationDiv;
        private _prevElm;
        private _nextElm;
        private pagerCount;
        onPageChanged: notifyCallback;
        constructor(parent?: Control, options?: any);
        get totalPages(): number;
        set totalPages(value: number);
        get currentPage(): number;
        set currentPage(value: number);
        get pageSize(): number;
        set pageSize(value: number);
        private onActiveItem;
        private onDisablePrevNext;
        protected _handleOnClickIndex(value: number, event: Event): void;
        private _handleOnClickMore;
        protected _handleOnNext(event: Event): void;
        protected _handleOnPrev(event: Event): void;
        private onMouseenter;
        private renderEllipsis;
        private renderPage;
        private updatePagers;
        private renderPageItem;
        protected init(): void;
        static create(options?: PaginationElement, parent?: Control): Promise<Pagination>;
    }
}
declare module "packages/pagination/src/index" {
    export { Pagination, PaginationElement } from "packages/pagination/src/pagination";
}
declare module "packages/table/src/style/table.css" {
    import { TableColumnElement } from "packages/table/src/tableColumn";
    import { ITableMediaQuery } from "packages/table/src/table";
    import { ControlElement } from "@ijstech/components/base";
    export const tableStyle: string;
    export const getCustomStylesClass: (styles: ControlElement) => string;
    export const getTableMediaQueriesStyleClass: (columns: TableColumnElement[], mediaQueries: ITableMediaQuery[]) => string;
}
declare module "packages/table/src/tableCell" {
    import "packages/table/src/style/table.css";
    export interface ITableCell {
        rowSpan: number;
        columnSpan: number;
        value: string;
    }
    export class TableCell {
        private _rowSpan;
        private _columnSpan;
        private _value;
        constructor(options: ITableCell);
        get rowSpan(): number;
        set rowSpan(value: number);
        get columnSpan(): number;
        set columnSpan(value: number);
        get value(): string;
        set value(data: string);
    }
}
declare module "packages/table/src/tableColumn" {
    import { Control, ControlElement } from "@ijstech/components/base";
    import { TableCell } from "packages/table/src/tableCell";
    import "packages/table/src/style/table.css";
    export type SortDirection = 'asc' | 'desc' | 'none';
    type renderCallback = (target: TableColumn, columnData: any, rowData: any, rowIndex?: number, cell?: TableCell) => any;
    type TextAlign = 'left' | 'right' | 'center';
    export interface TableColumnElement extends ControlElement {
        title: string;
        fieldName: string;
        key?: string | number;
        sortable?: boolean;
        sortOrder?: SortDirection;
        textAlign?: TextAlign;
        sorter?: (a: any, b: any) => number;
        onRenderCell?: renderCallback;
    }
    export class TableColumn extends Control {
        caption: string;
        fieldName: string;
        key?: string | number;
        sortable?: boolean;
        private columnElm;
        private sortElm;
        private ascElm;
        private descElm;
        private isHeader;
        private _sortOrder;
        private _data;
        private _textAlign;
        private _rowData;
        onSortChange: (source: Control, key: string, value: SortDirection) => void;
        onRenderCell: renderCallback;
        sorter: (a: any, b: any) => number;
        constructor(parent?: Control, options?: any);
        get data(): number | string;
        set data(value: number | string);
        get rowData(): number | string;
        set rowData(value: any);
        get sortOrder(): SortDirection;
        set sortOrder(value: SortDirection);
        get textAlign(): TextAlign;
        set textAlign(value: TextAlign);
        renderSort(): void;
        appendNode(params: any): Promise<void>;
        init(): void;
    }
}
declare module "packages/table/src/utils" {
    import { TableColumnElement } from "packages/table/src/tableColumn";
    export const paginate: <Type>(array: Type[], pageSize: number, pageNumber: number) => Type[];
    export const getColumnIndex: (columns: TableColumnElement[], key: string) => number;
    export const getColumnKey: (columns: TableColumnElement[], columnIdx: number) => string;
    export const getSorter: (columns: TableColumnElement[], key: string) => ((a: any, b: any) => number) | null | undefined;
    export const getValueByPath: (object: any, prop: string) => any;
    export const orderBy: (list: any, sortConfig: any, columns: TableColumnElement[]) => any;
    export const filterBy: (list: any[], value: any, columnKey: string | number) => any[];
}
declare module "packages/table/src/tableRow" {
    import "packages/table/src/style/table.css";
    import { TableCell } from "packages/table/src/tableCell";
    export class TableRow {
        private _cells;
        constructor(cells: TableCell[]);
        get cells(): TableCell[];
        set cells(value: TableCell[]);
    }
}
declare module "packages/table/src/table" {
    import { Control, ControlElement, IMediaQuery, IControlMediaQueryProps } from "@ijstech/components/base";
    import { TableColumnElement } from "packages/table/src/tableColumn";
    import { Pagination } from "packages/pagination/src/index";
    import { TableRow } from "packages/table/src/tableRow";
    import { Icon } from "packages/icon/src/index";
    type cellClickCallback = (target: Table, rowIndex: number, columnIdx: number, record: any) => void;
    type emptyCallback = (target: Table) => void;
    type sortCallback = (target: Table, key: string, value: string) => void;
    interface ITableExpandable {
        onRenderExpandedRow: (record: any) => any;
        rowExpandable: boolean;
        onRenderExpandIcon?: (target: Table, expand: boolean) => Icon;
    }
    export interface ITableMediaQueryProps extends IControlMediaQueryProps {
        fieldNames?: string[];
        expandable?: ITableExpandable;
    }
    export type ITableMediaQuery = IMediaQuery<ITableMediaQueryProps>;
    export interface TableElement extends ControlElement {
        heading?: boolean;
        data?: any;
        columns?: TableColumnElement[];
        rows?: TableRow[];
        pagination?: string;
        expandable?: ITableExpandable;
        mediaQueries?: ITableMediaQuery[];
        headingStyles?: ControlElement;
        bodyStyles?: ControlElement;
        onRenderEmptyTable?: emptyCallback;
        onCellClick?: cellClickCallback;
        onColumnSort?: sortCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-table']: TableElement;
            }
        }
    }
    export class Table extends Control {
        private wrapperElm;
        private tableElm;
        private tHeadElm;
        private tBodyElm;
        private pagingElm;
        onCellClick: cellClickCallback;
        onRenderEmptyTable: emptyCallback;
        onColumnSort: sortCallback;
        private _data;
        private _filteredData;
        private _tableID;
        private _columns;
        private _rows;
        private _pagination;
        private firstLoad;
        private _mediaQueries;
        private _expandable;
        private _sortConfig;
        private _heading;
        private _headingStyles;
        private _bodyStyles;
        private _bodyStyle;
        private _headingStyle;
        constructor(parent?: Control, options?: any);
        get data(): any;
        set data(value: any);
        get filteredData(): any;
        set filteredData(value: any);
        private get hasData();
        private get sortConfig();
        private sortFn;
        get columns(): TableColumnElement[];
        set columns(value: TableColumnElement[]);
        get rows(): TableRow[];
        get pagination(): Pagination;
        set pagination(value: string | Pagination);
        get expandable(): ITableExpandable;
        set expandable(value: ITableExpandable);
        private get hasExpandColumn();
        private get columnLength();
        get mediaQueries(): ITableMediaQuery[];
        set mediaQueries(value: ITableMediaQuery[]);
        get headingStyles(): ControlElement;
        set headingStyles(value: ControlElement);
        get bodyStyles(): ControlElement;
        set bodyStyles(value: ControlElement);
        private onPageChanged;
        private onSortChange;
        private renderHeader;
        _handleClick(event: MouseEvent): boolean;
        private expandRow;
        private renderRow;
        private renderBody;
        private createTable;
        filter(predicate: (dataItem: any) => boolean): void;
        protected init(): void;
        connectedCallback(): void;
        static create(options?: TableElement, parent?: Control): Promise<Table>;
    }
}
declare module "packages/table/src/index" {
    export { Table, TableElement } from "packages/table/src/table";
    export { TableColumn } from "packages/table/src/tableColumn";
    export { TableRow } from "packages/table/src/tableRow";
    export { TableCell } from "packages/table/src/tableCell";
}
declare module "packages/carousel/src/style/carousel.css" {
    import { ICarouselMediaQuery } from "packages/carousel/src/carousel";
    export const sliderStyle: string;
    export const getCarouselMediaQueriesStyleClass: (mediaQueries: ICarouselMediaQuery[]) => string;
}
declare module "packages/carousel/src/carousel" {
    import { Control, ControlElement, ContainerElement, IMediaQuery, IControlMediaQueryProps } from "@ijstech/components/base";
    type SwipeStartEventCallback = () => void;
    type SwipeEndEventCallback = (isSwiping: boolean) => void;
    type SlideChangeCallback = (index: number) => void;
    export interface ICarouselMediaQueryProps extends IControlMediaQueryProps {
        indicators?: boolean;
    }
    export type ICarouselMediaQuery = IMediaQuery<ICarouselMediaQueryProps>;
    export interface CarouselItemElement extends ContainerElement {
        name?: string;
    }
    type CarouselType = 'dot' | 'arrow';
    export interface CarouselSliderElement extends ControlElement {
        slidesToShow?: number;
        transitionSpeed?: number;
        autoplay?: boolean;
        autoplaySpeed?: number;
        items?: CarouselItemElement[];
        activeSlide?: number;
        type?: CarouselType;
        indicators?: boolean;
        swipe?: boolean;
        mediaQueries?: ICarouselMediaQuery[];
        onSwipeStart?: SwipeStartEventCallback;
        onSwipeEnd?: SwipeEndEventCallback;
        onSlideChange?: SlideChangeCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-carousel-slider']: CarouselSliderElement;
            }
        }
    }
    export class CarouselSlider extends Control {
        private _slidesToShow;
        private _transitionSpeed;
        private _type;
        private _autoplay;
        private _autoplaySpeed;
        private _activeSlide;
        private _items;
        private _slider;
        private timer;
        private sliderListElm;
        private dotPagination;
        private dotsElm;
        private wrapperSliderElm;
        private arrowPrev;
        private arrowNext;
        private pos1;
        private pos2;
        private threshold;
        private _swipe;
        private _indicators;
        private _mediaQueries;
        onSwipeStart: SwipeStartEventCallback;
        onSwipeEnd: SwipeEndEventCallback;
        onSlideChange: SlideChangeCallback;
        private isSwiping;
        private isHorizontalSwiping;
        constructor(parent?: Control, options?: any);
        get slidesToShow(): number;
        set slidesToShow(value: number);
        get transitionSpeed(): number;
        set transitionSpeed(value: number);
        get autoplay(): boolean;
        set autoplay(value: boolean);
        get autoplaySpeed(): number;
        set autoplaySpeed(value: number);
        get activeSlide(): number;
        set activeSlide(value: number);
        get items(): CarouselItemElement[];
        set items(nodes: CarouselItemElement[]);
        add(control: Control): Control;
        get type(): 'dot' | 'arrow';
        set type(value: 'dot' | 'arrow');
        get swipe(): boolean;
        set swipe(value: boolean);
        get mediaQueries(): ICarouselMediaQuery[];
        set mediaQueries(value: ICarouselMediaQuery[]);
        _handleMouseDown(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseMove(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseUp(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        get indicators(): boolean;
        set indicators(value: boolean);
        get isArrow(): boolean;
        private updateArrows;
        private updateSliderByArrows;
        private updateWrapperClass;
        private renderItems;
        private renderDotPagination;
        private renderArrows;
        private onDotClick;
        private setAutoplay;
        prev(): void;
        next(): void;
        refresh(): void;
        dragStartHandler(event: MouseEvent | TouchEvent): void;
        dragHandler(event: MouseEvent | TouchEvent): void;
        dragEndHandler(event: MouseEvent | TouchEvent): void;
        protected init(): void;
        static create(options?: CarouselSliderElement, parent?: Control): Promise<CarouselSlider>;
    }
}
declare module "packages/carousel/src/index" {
    export { CarouselSlider } from "packages/carousel/src/carousel";
}
declare module "packages/video/src/style/video.css" { }
declare module "packages/video/src/video" {
    import { Container, ControlElement, Control, Border, IBorder } from "@ijstech/components/base";
    import "packages/video/src/style/video.css";
    export interface VideoElement extends ControlElement {
        url?: string;
        isStreaming?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-video']: VideoElement;
            }
        }
    }
    export class Video extends Container {
        private videoElm;
        private sourceElm;
        private overlayElm;
        private player;
        private _url;
        private _isPlayed;
        get url(): string;
        set url(value: string);
        get border(): Border;
        set border(value: IBorder);
        set designMode(value: boolean);
        getPlayer(): any;
        private getVideoTypeFromExtension;
        protected init(): void;
        static create(options?: VideoElement, parent?: Control): Promise<Video>;
    }
}
declare module "packages/video/src/index" {
    export { Video, VideoElement } from "packages/video/src/video";
}
declare module "packages/schema-designer/src/uiSchema" {
    import { Container, ControlElement } from "@ijstech/components/base";
    import { ISchemaDesignerData } from "packages/schema-designer/src/schemaDesigner";
    type IUISchemaOptions = 'DEFAULT' | 'GENERATED' | 'REGISTERED' | 'INLINED';
    type IUISchemaRuleEffect = 'HIDE' | 'SHOW' | 'ENABLE' | 'DISABLE';
    type IUISchemaType = 'VerticalLayout' | 'HorizontalLayout' | 'Group' | 'Categorization' | 'Category' | 'Control';
    export interface ISchemaDesignerUI {
        type: IUISchemaType;
        scope?: string;
        label?: string;
        elements?: ISchemaDesignerUI[];
        options?: {
            format?: string;
            readonly?: boolean;
        } | {
            detail: IUISchemaOptions | {
                type: IUISchemaType;
                elements: ISchemaDesignerUI;
            };
        };
        rule?: IUISchemaRule;
    }
    interface IRules {
        not?: IRules;
        const?: string | number | boolean;
        minimum?: number;
        exclusiveMaximum?: number;
        enum?: string[] | number[];
    }
    interface IUISchemaRule {
        effect: IUISchemaRuleEffect;
        condition: {
            scope: string;
            schema: IRules;
        };
    }
    export class SchemaDesignerUI extends Container {
        private txtUISchema;
        private pnlUISchemaBuilder;
        private uiSchema;
        schema: ISchemaDesignerData;
        constructor(parent?: Container, options?: ControlElement);
        protected init(): void;
        refresh(): void;
        getUISchema(): ISchemaDesignerUI;
        private updateJsonUISchema;
        private getUISchemaMap;
        private getScopeByFields;
        updateActionsItems(): Promise<void>;
        updateActionsRules(): Promise<void>;
        updateUISchemaItemsByRename(fields: string[], newFields: string[]): Promise<void>;
        updateUISchemaByType(fields: string[], isOption?: boolean): Promise<void>;
        deleteUISchema(fields: string[], onlyChild?: boolean): void;
        private createUISchema;
        private initUI;
    }
}
declare module "packages/schema-designer/src/style/schema-designer.css" { }
declare module "packages/schema-designer/src/schemaDesigner" {
    import { Container, ControlElement } from "@ijstech/components/base";
    import { ISchemaDesignerUI } from "packages/schema-designer/src/uiSchema";
    export { ISchemaDesignerUI };
    import "packages/schema-designer/src/style/schema-designer.css";
    type IDataType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';
    export interface ISchemaDesignerData {
        type: IDataType;
        properties: {
            [key: string]: {
                type: IDataType;
                title?: string;
                description?: string;
                pattern?: number | string;
                format?: string;
                const?: string | number | boolean;
                default?: string | number | boolean;
                multipleOf?: number;
                minimum?: number;
                maximum?: number;
                exclusiveMinimum?: number;
                exclusiveMaximum?: number;
                minLength?: number;
                maxLength?: number;
                minItems?: number;
                maxItems?: number;
                uniqueItems?: boolean;
                deprecated?: boolean;
                readOnly?: boolean;
                writeOnly?: boolean;
                additionalProperties?: boolean;
                enum?: string[] | number[];
                oneOf?: {
                    title?: string;
                    const: number | string;
                }[];
                items?: ISchemaDesignerData | false;
                prefixItems?: {
                    type?: string | number;
                    enum?: string | number;
                }[];
                required?: string[];
            };
        };
        required?: string[];
    }
    export interface SchemaDesignerElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-schema-designer']: SchemaDesignerElement;
            }
        }
    }
    export class SchemaDesigner extends Container {
        private txtSchema;
        private pnlSchemaBuilder;
        private schema;
        private pnlUISchema;
        private uiSchemaPanel;
        static create(options?: SchemaDesignerElement, parent?: Container): Promise<SchemaDesigner>;
        constructor(parent?: Container, options?: SchemaDesignerElement);
        refresh(): void;
        protected init(): void;
        getJsonData(): ISchemaDesignerData;
        getJsonUI(): ISchemaDesignerUI;
        private getJSON;
        private updateJsonData;
        private convertFieldNameToLabel;
        private generateFieldName;
        private createDataSchema;
        private renderEnum;
        private renderOneOf;
        private renderPrefixItems;
        private updateControls;
        private getControlByPath;
        private renderSchema;
        private addSchemaByType;
        private renderObjectSchema;
        private renderStringSchema;
        private renderNumberSchema;
        private renderBooleanSchema;
        private renderArraySchema;
        private initUI;
    }
}
declare module "packages/schema-designer/src/index" {
    export { SchemaDesigner, SchemaDesignerElement, ISchemaDesignerData, ISchemaDesignerUI } from "packages/schema-designer/src/schemaDesigner";
}
declare module "packages/navigator/src/style/navigator.css" { }
declare module "packages/navigator/src/navigator" {
    import { Container, Control, ControlElement } from "@ijstech/components/base";
    import "packages/navigator/src/style/navigator.css";
    interface INavOption {
        searchPlaceholder?: string;
    }
    interface INavItem {
        id: number | string;
        caption: string;
        navItems: INavItem[];
        data: any;
    }
    export interface NavElement extends ControlElement {
        navItems?: INavItem[];
        options?: INavOption;
        onItemClick?: () => void;
    }
    export interface NavItemElement extends ControlElement {
        caption: string;
        navItems: INavItem[];
        data: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-nav"]: NavElement;
            }
        }
    }
    export class Nav extends Control {
        private _navItems;
        private _flatNavItems;
        private _parentNavItem;
        private _wrapper;
        private txtSearch;
        private _navWrapper;
        private _options;
        private _onItemClick;
        private _searching;
        private _activeNavItem;
        constructor(parent?: Control, options?: any);
        static create(options?: NavElement, parent?: Container): Promise<Nav>;
        protected init(): void;
        set navItems(navItems: INavItem[]);
        get navItems(): INavItem[];
        setRootActive(): void;
        setSelectedItemById(id: number | string): void;
        getSelectedItemById(id: number | string): INavItem | undefined;
        getActiveRoute(): INavItem[];
        clear(): void;
        private render;
        private renderNav;
        private setNavItemActive;
        private handleSearchOnChange;
        private flattenNavItem;
        private findSiblingsById;
        private findParentNavItem;
        private findParentPathByNavItem;
    }
    export class NavItem extends Control {
        private _navItems;
        private _wrapper;
        private _caption;
        private _back;
        constructor(parent?: Control, options?: any);
        static create(options?: NavItemElement, parent?: Container): Promise<NavItem>;
        protected init(): void;
        private render;
    }
}
declare module "packages/navigator/src/index" {
    export { Nav, NavItem } from "packages/navigator/src/navigator";
}
declare module "packages/breadcrumb/src/style/breadcrumb.css" { }
declare module "packages/breadcrumb/src/breadcrumb" {
    import { Container, Control, ControlElement } from "@ijstech/components/base";
    import "packages/breadcrumb/src/style/breadcrumb.css";
    interface IBreadcrumbItem {
        caption: string;
        data?: any;
    }
    export interface BreadcrumbElement extends ControlElement {
        onItemClick: (breadcrumbItem?: IBreadcrumbItem) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-breadcrumb"]: BreadcrumbElement;
            }
        }
    }
    export class Breadcrumb extends Control {
        private _wrapper;
        private _breadcrumbItems;
        private _onItemClick;
        constructor(parent?: Control, options?: any);
        static create(options?: BreadcrumbElement, parent?: Container): Promise<Breadcrumb>;
        protected init(): void;
        set breadcrumbItems(breadcrumbItems: IBreadcrumbItem[]);
        get breadcrumbItems(): IBreadcrumbItem[];
        private clear;
        private render;
    }
}
declare module "packages/breadcrumb/src/index" {
    export { Breadcrumb } from "packages/breadcrumb/src/breadcrumb";
}
declare module "packages/form/src/styles/index.css" {
    export const formStyle: string;
    export const formGroupStyle: string;
    export const groupStyle: string;
    export const groupHeaderStyle: string;
    export const groupBodyStyle: string;
    export const collapseBtnStyle: string;
    export const inputStyle: string;
    export const datePickerStyle: string;
    export const comboBoxStyle: string;
    export const buttonStyle: string;
    export const iconButtonStyle: string;
    export const checkboxStyle: string;
    export const listHeaderStyle: string;
    export const listBtnAddStyle: string;
    export const listColumnHeaderStyle: string;
    export const listItemStyle: string;
    export const listVerticalLayoutStyle: string;
    export const listItemBtnDelete: string;
    export const tabsStyle: string;
    export const cardStyle: string;
    export const cardHeader: string;
    export const cardBody: string;
    export const uploadStyle: string;
    export const tokenInputStyle: string;
}
declare module "packages/form/src/types/jsonSchema4" {
    export type IJSONSchema4TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'any';
    type IJSONSchema4Type = string | number | boolean | IJSONSchema4Object | IJSONSchema4Array | null;
    interface IJSONSchema4Object {
        [key: string]: IJSONSchema4Type;
    }
    interface IJSONSchema4Array extends Array<IJSONSchema4Type> {
    }
    type IJSONSchema4Version = string;
    export interface IJSONSchema4 {
        id?: string | undefined;
        $ref?: string | undefined;
        $schema?: IJSONSchema4Version | undefined;
        title?: string | undefined;
        placeholder?: string | undefined;
        description?: string | undefined;
        tooltip?: string | undefined;
        default?: IJSONSchema4Type | undefined;
        multipleOf?: number | undefined;
        maximum?: number | undefined;
        exclusiveMaximum?: boolean | undefined;
        minimum?: number | undefined;
        exclusiveMinimum?: boolean | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        pattern?: string | undefined;
        additionalItems?: boolean | IJSONSchema4 | undefined;
        items?: IJSONSchema4 | IJSONSchema4[] | undefined;
        maxItems?: number | undefined;
        minItems?: number | undefined;
        uniqueItems?: boolean | undefined;
        maxProperties?: number | undefined;
        minProperties?: number | undefined;
        required?: boolean | string[] | undefined;
        additionalProperties?: boolean | IJSONSchema4 | undefined;
        definitions?: {
            [k: string]: IJSONSchema4;
        } | undefined;
        properties?: {
            [k: string]: IJSONSchema4;
        } | undefined;
        patternProperties?: {
            [k: string]: IJSONSchema4;
        } | undefined;
        dependencies?: {
            [k: string]: IJSONSchema4 | string[];
        } | undefined;
        enum?: IJSONSchema4Type[] | undefined;
        type?: IJSONSchema4TypeName | IJSONSchema4TypeName[] | undefined;
        allOf?: IJSONSchema4[] | undefined;
        anyOf?: IJSONSchema4[] | undefined;
        oneOf?: IJSONSchema4[] | undefined;
        not?: IJSONSchema4 | undefined;
        extends?: string | string[] | undefined;
        [k: string]: any;
        format?: string | undefined;
    }
}
declare module "packages/form/src/types/jsonSchema6" {
    export type IJSONSchema6TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'any';
    type IJSONSchema6Type = string | number | boolean | IJSONSchema6Object | IJSONSchema6Array | null;
    interface IJSONSchema6Object {
        [key: string]: IJSONSchema6Type;
    }
    interface IJSONSchema6Array extends Array<IJSONSchema6Type> {
    }
    type IJSONSchema6Version = string;
    type IJSONSchema6Definition = IJSONSchema6 | boolean;
    export interface IJSONSchema6 {
        $id?: string | undefined;
        $ref?: string | undefined;
        $schema?: IJSONSchema6Version | undefined;
        multipleOf?: number | undefined;
        maximum?: number | undefined;
        exclusiveMaximum?: number | undefined;
        minimum?: number | undefined;
        exclusiveMinimum?: number | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        pattern?: string | undefined;
        items?: IJSONSchema6Definition | IJSONSchema6Definition[] | undefined;
        additionalItems?: IJSONSchema6Definition | undefined;
        maxItems?: number | undefined;
        minItems?: number | undefined;
        uniqueItems?: boolean | undefined;
        contains?: IJSONSchema6Definition | undefined;
        maxProperties?: number | undefined;
        minProperties?: number | undefined;
        required?: string[] | undefined;
        properties?: {
            [k: string]: IJSONSchema6Definition;
        } | undefined;
        patternProperties?: {
            [k: string]: IJSONSchema6Definition;
        } | undefined;
        additionalProperties?: IJSONSchema6Definition | undefined;
        dependencies?: {
            [k: string]: IJSONSchema6Definition | string[];
        } | undefined;
        propertyNames?: IJSONSchema6Definition | undefined;
        enum?: IJSONSchema6Type[] | undefined;
        const?: IJSONSchema6Type | undefined;
        type?: IJSONSchema6TypeName | IJSONSchema6TypeName[] | undefined;
        allOf?: IJSONSchema6Definition[] | undefined;
        anyOf?: IJSONSchema6Definition[] | undefined;
        oneOf?: IJSONSchema6Definition[] | undefined;
        not?: IJSONSchema6Definition | undefined;
        definitions?: {
            [k: string]: IJSONSchema6Definition;
        } | undefined;
        title?: string | undefined;
        placeholder?: string | undefined;
        description?: string | undefined;
        tooltip?: string | undefined;
        default?: IJSONSchema6Type | undefined;
        examples?: IJSONSchema6Type[] | undefined;
        format?: string | undefined;
    }
}
declare module "packages/form/src/types/jsonSchema7" {
    export type IJSONSchema7TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';
    type IJSONSchema7Type = string | number | boolean | IJSONSchema7Object | IJSONSchema7Array | null;
    interface IJSONSchema7Object {
        [key: string]: IJSONSchema7Type;
    }
    interface IJSONSchema7Array extends Array<IJSONSchema7Type> {
    }
    type IJSONSchema7Version = string;
    type IJSONSchema7Definition = IJSONSchema7 | boolean;
    export interface IJSONSchema7 {
        $id?: string | undefined;
        $ref?: string | undefined;
        $schema?: IJSONSchema7Version | undefined;
        $comment?: string | undefined;
        $defs?: {
            [key: string]: IJSONSchema7Definition;
        } | undefined;
        type?: IJSONSchema7TypeName | IJSONSchema7TypeName[] | undefined;
        enum?: IJSONSchema7Type[] | undefined;
        const?: IJSONSchema7Type | undefined;
        multipleOf?: number | undefined;
        maximum?: number | undefined;
        exclusiveMaximum?: number | undefined;
        minimum?: number | undefined;
        exclusiveMinimum?: number | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        pattern?: string | undefined;
        items?: IJSONSchema7Definition | IJSONSchema7Definition[] | undefined;
        additionalItems?: IJSONSchema7Definition | undefined;
        maxItems?: number | undefined;
        minItems?: number | undefined;
        uniqueItems?: boolean | undefined;
        contains?: IJSONSchema7 | undefined;
        maxProperties?: number | undefined;
        minProperties?: number | undefined;
        required?: string[] | undefined;
        properties?: {
            [key: string]: IJSONSchema7Definition;
        } | undefined;
        patternProperties?: {
            [key: string]: IJSONSchema7Definition;
        } | undefined;
        additionalProperties?: IJSONSchema7Definition | undefined;
        dependencies?: {
            [key: string]: IJSONSchema7Definition | string[];
        } | undefined;
        propertyNames?: IJSONSchema7Definition | undefined;
        if?: IJSONSchema7Definition | undefined;
        then?: IJSONSchema7Definition | undefined;
        else?: IJSONSchema7Definition | undefined;
        allOf?: IJSONSchema7Definition[] | undefined;
        anyOf?: IJSONSchema7Definition[] | undefined;
        oneOf?: IJSONSchema7Definition[] | undefined;
        not?: IJSONSchema7Definition | undefined;
        format?: string | undefined;
        contentMediaType?: string | undefined;
        contentEncoding?: string | undefined;
        definitions?: {
            [key: string]: IJSONSchema7Definition;
        } | undefined;
        title?: string | undefined;
        placeholder?: string | undefined;
        description?: string | undefined;
        tooltip?: string | undefined;
        default?: IJSONSchema7Type | undefined;
        readOnly?: boolean | undefined;
        writeOnly?: boolean | undefined;
        examples?: IJSONSchema7Type | undefined;
    }
}
declare module "packages/form/src/types/index" {
    import { IJSONSchema4TypeName, IJSONSchema4 } from "packages/form/src/types/jsonSchema4";
    import { IJSONSchema6TypeName, IJSONSchema6 } from "packages/form/src/types/jsonSchema6";
    import { IJSONSchema7TypeName, IJSONSchema7 } from "packages/form/src/types/jsonSchema7";
    export type IUISchemaType = 'VerticalLayout' | 'HorizontalLayout' | 'Group' | 'Categorization' | 'Category' | 'Control';
    export type IUISchemaRulesEffect = 'HIDE' | 'SHOW' | 'DISABLE' | 'ENABLE';
    export interface IUISchemaRulesCondition {
        scope: string;
        schema: IDataSchema;
    }
    export interface IUISchemaOptions {
        detail?: 'DEFAULT' | 'GENERATED' | 'REGISTERED' | IUISchema;
        showSortButtons?: boolean;
        elementLabelProp?: string;
        format?: 'date' | 'time' | 'date-time' | 'radio';
        slider?: boolean;
        multi?: boolean;
        color?: boolean;
        restrict?: boolean;
        showUnfocusedDescription?: boolean;
        hideRequiredAsterisk?: boolean;
        toggle?: boolean;
        readonly?: boolean;
        autocomplete?: boolean;
        variant?: 'stepper';
    }
    export interface IUISchemaRules {
        effect?: IUISchemaRulesEffect;
        condition?: IUISchemaRulesCondition;
    }
    export interface ValidationError {
        property: string;
        scope: string;
        message: string;
    }
    export interface ValidationResult {
        valid: boolean;
        errors: ValidationError[];
    }
    export type IDataSchemaTypeName = IJSONSchema4TypeName | IJSONSchema6TypeName | IJSONSchema7TypeName;
    export type IDataSchema = IJSONSchema4 & IJSONSchema6 & IJSONSchema7;
    export interface IUISchema {
        type: IUISchemaType;
        elements?: IUISchema[];
        label?: string | boolean;
        scope?: string;
        rule?: IUISchemaRules;
        options?: IUISchemaOptions;
    }
}
declare module "packages/form/src/form" {
    import { Control, ControlElement, notifyMouseEventCallback } from "@ijstech/components/base";
    import { IDataSchema, IUISchema, ValidationResult } from "packages/form/src/types/index";
    import "packages/form/src/styles/index.css";
    export { IDataSchema, IUISchema };
    export interface FormElement extends ControlElement {
        jsonSchema?: IDataSchema;
        uiSchema?: IUISchema;
        data?: any;
        options?: IFormOptions;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-form']: FormElement;
            }
        }
    }
    interface IButtonOptions {
        caption?: string;
        backgroundColor?: string;
        fontColor?: string;
        hide?: boolean;
        onClick?: notifyMouseEventCallback;
    }
    export interface IFormOptions {
        columnsPerRow?: number;
        confirmButtonOptions?: IButtonOptions;
        clearButtonOptions?: IButtonOptions;
        columnWidth?: string | number;
        dateTimeFormat: {
            date?: string;
            time?: string;
            dateTime?: string;
        };
        customControls?: {
            [key: string]: {
                render: (parent?: Control) => Control;
                getData: (control: Control) => any;
                setData: (control: Control, value: any, rowData?: any) => void;
            };
        };
        onChange?: (control: Control, value?: any) => void;
    }
    export class Form extends Control {
        private _jsonSchema;
        private _uiSchema;
        private _formOptions;
        private _formRules;
        private _formControls;
        private validationData;
        private validationResult;
        constructor(parent?: Control, options?: any);
        protected init(): void;
        set formOptions(options: any);
        get formOptions(): any;
        set jsonSchema(jsonSchema: IDataSchema);
        get jsonSchema(): IDataSchema;
        set uiSchema(uiSchema: IUISchema);
        get uiSchema(): IUISchema;
        clearFormData(): void;
        setFormData(data: any): void;
        private setCustomData;
        private setData;
        getFormData(isErrorShown?: boolean): Promise<any>;
        private getDataBySchema;
        private isNumber;
        private findTabByElm;
        renderForm(): void;
        private renderFormByJSONSchema;
        private replacePhrase;
        private renderFormByUISchema;
        private setupRules;
        private setupControlRule;
        private validateRule;
        private validateAllRule;
        private getDataSchemaByScope;
        private renderGroup;
        private renderLabel;
        private renderInput;
        private renderNumberInput;
        private renderTextArea;
        private renderColorPicker;
        private renderUploader;
        private renderDatePicker;
        private renderComboBox;
        private renderRadioGroup;
        private renderCheckBox;
        private renderList;
        private renderCard;
        private validateOnValueChanged;
        private checkPropertyChange;
        private mustBeValid;
        validate(instance: any, schema: IDataSchema, options: any): ValidationResult;
        private convertFieldNameToLabel;
        private setDataUpload;
    }
}
declare module "packages/form/src/index" {
    export { Form, FormElement, IDataSchema, IUISchema, IFormOptions } from "packages/form/src/form";
}
declare module "packages/repeater/src/style/repeater.css" { }
declare module "packages/repeater/src/repeater" {
    import { Control, ControlElement, Container } from "@ijstech/components/base";
    import "packages/repeater/src/style/repeater.css";
    type onRenderCallback = (parent: Control, index: number) => void;
    export interface RepeaterElement extends ControlElement {
        onRender?: onRenderCallback;
        count?: number;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-repeater']: RepeaterElement;
            }
        }
    }
    export class Repeater extends Container {
        private _count;
        private wrapper;
        private pnlPanel;
        private templateEl;
        onRender: onRenderCallback;
        constructor(parent?: Control, options?: any);
        get count(): number;
        set count(value: number);
        private foreachNode;
        private isEmpty;
        private cloneItems;
        add(item: Control): Control;
        update(): void;
        clear(): void;
        protected init(): void;
        static create(options?: RepeaterElement, parent?: Container): Promise<Repeater>;
    }
}
declare module "packages/repeater/src/index" {
    export { Repeater, RepeaterElement } from "packages/repeater/src/repeater";
}
declare module "packages/accordion/src/interface" {
    import { ControlElement } from "@ijstech/components/base";
    export interface IAccordionItem extends ControlElement {
        name: string;
        defaultExpanded?: boolean;
        showRemove?: boolean;
    }
    export interface IAccordion {
        items: IAccordionItem[];
        isFlush?: boolean;
    }
}
declare module "packages/accordion/src/style/accordion.css" {
    export const customStyles: string;
    export const expandablePanelStyle: string;
}
declare module "packages/accordion/src/accordion-item" {
    import { Control, Container } from "@ijstech/components/base";
    import { IAccordionItem } from "packages/accordion/src/interface";
    type onSelectedFn = (target: AccordionItem) => void;
    export interface AccordionItemElement extends IAccordionItem {
        onSelected?: onSelectedFn;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-accordion-item']: AccordionItemElement;
            }
        }
    }
    export class AccordionItem extends Container {
        private pnlAccordionItem;
        private lbTitle;
        private pnlContent;
        private iconExpand;
        private iconRemove;
        private _name;
        private _defaultExpanded;
        private _expanded;
        private _showRemove;
        onSelected: onSelectedFn;
        onRemoved: onSelectedFn;
        constructor(parent?: Container, options?: any);
        static create(options?: AccordionItemElement, parent?: Container): Promise<AccordionItem>;
        get name(): string;
        set name(value: string);
        get defaultExpanded(): boolean;
        set defaultExpanded(value: boolean);
        get expanded(): boolean;
        set expanded(value: boolean);
        get showRemove(): boolean;
        set showRemove(value: boolean);
        get contentControl(): Control;
        private renderUI;
        private updatePanel;
        private onSelectClick;
        private onRemoveClick;
        add(item: Control): Control;
        protected init(): Promise<void>;
    }
}
declare module "packages/accordion/src/accordion" {
    import { Control, Container, ControlElement } from "@ijstech/components/base";
    import { AccordionItem, AccordionItemElement } from "packages/accordion/src/accordion-item";
    import { IAccordionItem } from "packages/accordion/src/interface";
    export { AccordionItem, AccordionItemElement };
    type onCustomItemRemovedCallback = (item: Control) => Promise<void>;
    export interface AccordionElement extends ControlElement {
        items?: IAccordionItem[];
        isFlush?: boolean;
        onCustomItemRemoved?: onCustomItemRemovedCallback;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-accordion"]: AccordionElement;
            }
        }
    }
    export interface IAccordionMessage {
    }
    export class Accordion extends Control {
        private wrapper;
        private _items;
        private _isFlush;
        private accordionItemMapper;
        onCustomItemRemoved: onCustomItemRemovedCallback;
        static create(options?: AccordionElement, parent?: Container): Promise<Accordion>;
        constructor(parent?: Container, options?: any);
        get isFlush(): boolean;
        set isFlush(value: boolean);
        get items(): IAccordionItem[];
        set items(value: IAccordionItem[]);
        private createAccordionItem;
        private onItemClick;
        private onRemoveClick;
        add(item: IAccordionItem): AccordionItem;
        updateItemName(id: string, name: string): void;
        removeItem(id: string): void;
        clear(): void;
        private appendItem;
        protected init(): Promise<void>;
    }
}
declare module "packages/accordion/src/index" {
    export { Accordion, AccordionElement, AccordionItem } from "packages/accordion/src/accordion";
}
declare module "@ijstech/components" {
    export * as Styles from "packages/style/src/index";
    export { application, EventBus, IEventBus, IHasDependencies, IModuleOptions, IModuleRoute, IModuleMenuItem, IRenderUIOptions, DataSchemaValidator, renderUI, FormatUtils, IFormatNumberOptions, IdUtils } from "packages/application/src/index";
    export { customModule, customElements, getCustomElements, Component, Control, ControlElement, Container, Observe, Unobserve, ClearObservers, isObservable, observable, LibPath, RequireJS, ISpace, IBorder, IFont } from "@ijstech/components/base";
    export { Alert } from "packages/alert/src/index";
    export { Button } from "packages/button/src/index";
    export { CodeEditor, LanguageType, CodeDiffEditor } from "packages/code-editor/src/index";
    export { ComboBox, IComboItem } from "packages/combo-box/src/index";
    export { DataGrid, DataGridCell } from "@ijstech/components/dataGrid";
    export { Input } from "packages/input/src/index";
    export { Icon, IconName } from "packages/icon/src/index";
    export { Image } from "packages/image/src/index";
    export { Markdown, markdownToPlainText } from "packages/markdown/src/index";
    export { MarkdownEditor } from "packages/markdown-editor/src/index";
    export { Menu, ContextMenu, IMenuItem, MenuItem } from "packages/menu/src/index";
    export { Module } from "packages/module/src/index";
    export { Label } from "packages/label/src/index";
    export { Tooltip } from "packages/tooltip/src/index";
    export { TreeView, TreeNode } from "packages/tree-view/src/index";
    export { Switch } from "packages/switch/src/index";
    export { Modal } from "packages/modal/src/index";
    export { Popover } from "packages/popover/src/index";
    export { Checkbox } from "packages/checkbox/src/index";
    export { Datepicker } from "packages/datepicker/src/index";
    export { LineChart, BarChart, PieChart, ScatterChart, ScatterLineChart } from "packages/chart/src/index";
    export { Upload, UploadModal } from "packages/upload/src/index";
    export { Tabs, Tab } from "packages/tab/src/index";
    export { Iframe } from "packages/iframe/src/index";
    export { Range } from "packages/range/src/index";
    export { Radio, RadioGroup } from "packages/radio/src/index";
    export { Panel, VStack, HStack, CardLayout, GridLayout, StackLayout } from "packages/layout/src/index";
    export { Pagination } from "packages/pagination/src/index";
    export { Progress } from "packages/progress/src/index";
    export { Link } from "packages/link/src/index";
    export { Table, TableColumn, TableCell } from "packages/table/src/index";
    export { CarouselSlider } from "packages/carousel/src/index";
    export * as IPFS from "packages/ipfs/src/index";
    export { moment } from "packages/moment/src/index";
    export { Video } from "packages/video/src/index";
    export { SchemaDesigner } from "packages/schema-designer/src/index";
    export { Nav } from "packages/navigator/src/index";
    export { Breadcrumb } from "packages/breadcrumb/src/index";
    export { Form, IDataSchema, IUISchema, IFormOptions } from "packages/form/src/index";
    export { ColorPicker } from "packages/color/src/index";
    export { Repeater } from "packages/repeater/src/index";
    export { Accordion, AccordionItem } from "packages/accordion/src/index";
}
