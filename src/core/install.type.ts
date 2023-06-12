export interface INodeVersion {
    version: string;
    files: string[];
    npm?: string;
    v8?: string;
    uv?: string;
    zlib?: string;
    openssl?: string;
    modules?: string;
    lts?: boolean;
}

export interface ResultPromise {
    success: boolean;
    message?: string;
}