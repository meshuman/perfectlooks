export interface SheetString {
  key: string;
  where: string;
  english: string;
  note?: string;
}
export declare function itemStrings(item: Record<string, any>): SheetString[];
export declare function postStrings(post: Record<string, any>): SheetString[];
export declare function isBarberKey(key: string): boolean;
