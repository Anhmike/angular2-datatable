import { KeyValueDiffers } from "angular2/angular2";
export declare class NgDataTable {
    private _differs;
    columnSet: any;
    columnKeys: Array<string>;
    sortBy: string;
    sortIndex: number;
    sortAsc: boolean;
    filterObject: any;
    rawData: Array<any>;
    viewData: Array<any>;
    private _filterDiffer;
    constructor(_differs: KeyValueDiffers);
    filters: any;
    sortAscending: boolean;
    sortColumn: string;
    columnOrder: any;
    data: Array<any>;
    doCheck(): boolean;
    filterData(): void;
    sortData(): void;
    sortClick(colNum: number): void;
    ucfirst(str: string): string;
    underscoreToCamel(str: string): string;
}
