declare type QueryStringValue = string | null | undefined;
declare type QueryStringObject = {
    [key: string]: QueryStringValue | QueryStringValue[];
};
export declare function urljoins(...parts: (string | QueryStringObject)[]): string;
export declare function urljoin(...parts: string[]): string;
export declare function hasQueryParameters(targetURL: string): boolean;
export {};
//# sourceMappingURL=urljoins.d.ts.map