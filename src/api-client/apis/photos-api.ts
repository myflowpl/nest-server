/* tslint:disable */
/* eslint-disable */
/**
 * Mój Projekt w Nest
 * Przykładowy projekt w Node.js i TypeScript
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
/**
 * PhotosApi - axios parameter creator
 * @export
 */
export const PhotosApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        download: async (filename: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'filename' is not null or undefined
            if (filename === null || filename === undefined) {
                throw new RequiredError('filename','Required parameter filename was null or undefined when calling download.');
            }
            const localVarPath = `/photos/download/{filename}`
                .replace(`{${"filename"}}`, encodeURIComponent(String(filename)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        index: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/photos`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} file 
         * @param {string} description 
         * @param {string} title 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadFile: async (file: string, description: string, title: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'file' is not null or undefined
            if (file === null || file === undefined) {
                throw new RequiredError('file','Required parameter file was null or undefined when calling uploadFile.');
            }
            // verify required parameter 'description' is not null or undefined
            if (description === null || description === undefined) {
                throw new RequiredError('description','Required parameter description was null or undefined when calling uploadFile.');
            }
            // verify required parameter 'title' is not null or undefined
            if (title === null || title === undefined) {
                throw new RequiredError('title','Required parameter title was null or undefined when calling uploadFile.');
            }
            const localVarPath = `/photos/upload`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new FormData();

            // authentication bearer required


            if (file !== undefined) { 
                localVarFormParams.append('file', file as any);
            }

            if (description !== undefined) { 
                localVarFormParams.append('description', description as any);
            }

            if (title !== undefined) { 
                localVarFormParams.append('title', title as any);
            }

            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PhotosApi - functional programming interface
 * @export
 */
export const PhotosApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async download(filename: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await PhotosApiAxiosParamCreator(configuration).download(filename, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async index(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await PhotosApiAxiosParamCreator(configuration).index(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} file 
         * @param {string} description 
         * @param {string} title 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async uploadFile(file: string, description: string, title: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await PhotosApiAxiosParamCreator(configuration).uploadFile(file, description, title, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * PhotosApi - factory interface
 * @export
 */
export const PhotosApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @param {string} filename 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        download(filename: string, options?: any): AxiosPromise<void> {
            return PhotosApiFp(configuration).download(filename, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        index(options?: any): AxiosPromise<void> {
            return PhotosApiFp(configuration).index(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} file 
         * @param {string} description 
         * @param {string} title 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadFile(file: string, description: string, title: string, options?: any): AxiosPromise<void> {
            return PhotosApiFp(configuration).uploadFile(file, description, title, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * PhotosApi - object-oriented interface
 * @export
 * @class PhotosApi
 * @extends {BaseAPI}
 */
export class PhotosApi extends BaseAPI {
    /**
     * 
     * @param {string} filename 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PhotosApi
     */
    public download(filename: string, options?: any) {
        return PhotosApiFp(this.configuration).download(filename, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PhotosApi
     */
    public index(options?: any) {
        return PhotosApiFp(this.configuration).index(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} file 
     * @param {string} description 
     * @param {string} title 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PhotosApi
     */
    public uploadFile(file: string, description: string, title: string, options?: any) {
        return PhotosApiFp(this.configuration).uploadFile(file, description, title, options).then((request) => request(this.axios, this.basePath));
    }
}
