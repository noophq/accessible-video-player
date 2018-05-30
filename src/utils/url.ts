/**
 * Add query parameters to a given url
 *
 * @param url Url on which we append the new parameters
 * @param params New parameters to add
 * @return new built url with new query parameters
 */
export function buildUrlWithQueryParams(url: string, params: any) {
    // Add additionalParams
    const queryStringParams = [];

    for (const key of Object.keys(params)) {
        queryStringParams.push(key + "=" + encodeURIComponent(params[key]))
    }

    const queryString = queryStringParams.join("&");

    if (url.indexOf("?") >= 0) {
        return url + "&" + queryString;
    } else {
        return url + "?" + queryString;
    }
}
