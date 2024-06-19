const objectToParams = (data: any): string => {
    return encodeURIComponent(JSON.stringify(data));
}

const paramsToObject = (params: string): any => {
    return JSON.parse(decodeURIComponent(JSON.parse(params)));
}

const sleep = (ms: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

export { objectToParams, paramsToObject, sleep };
