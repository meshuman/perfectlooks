export declare function parseCsv(text: string): string[][];
export declare function writeCsv(rows: unknown[][]): string;
export declare function readSheet(text: string): Record<string, { english: string; translation: string; status: string }>;
