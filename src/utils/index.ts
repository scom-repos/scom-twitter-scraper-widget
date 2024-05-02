const objectToParams = (data: any): string => {
    return encodeURIComponent(JSON.stringify(data));
}

const paramsToObject = (params: string): any => {
    return JSON.parse(decodeURIComponent(JSON.parse(params)));
}

export {objectToParams, paramsToObject};
