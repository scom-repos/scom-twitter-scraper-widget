declare const objectToParams: (data: any) => string;
declare const paramsToObject: (params: string) => any;
declare const sleep: (ms: number) => Promise<void>;
export { objectToParams, paramsToObject, sleep };
