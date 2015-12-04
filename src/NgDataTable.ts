import { Component, View, KeyValueDiffers, KeyValueDiffer, CORE_DIRECTIVES } from "angular2/angular2";

@Component({
	selector: 'data-table',
	inputs: ['data', 'columnOrder', 'sortColumn', 'sortAscending', 'filters'],
	// outputs: ['columnOrder', 'sortColumn', 'sortAscending', 'filters'],
})
@View({
	templateUrl: 'NgDataTable.html',
	styleUrls: ['NgDataTable.css'],
	directives: [CORE_DIRECTIVES],
})
export class NgDataTable {
	public columnSet: Array<string> = ['id', 'gender', 'first_name', 'last_name', 'email', 'country', 'ip_address'];
	public sortBy: string = '';
	public sortIndex: number = 0;
	public sortAsc: boolean = true;
	public filterObject: any = {};
	public rawData: Array<any> = [];
	public viewData: Array<any> = [];
	private _filterDiffer: KeyValueDiffer;
	
	constructor(private _differs: KeyValueDiffers) { }
	
	get filters(): any {
		return this.filterObject;
	}
	get sortAscending(): boolean {
		return this.sortAsc;
	}
	get sortColumn(): string {
		return this.sortBy;
	}
	get columnOrder(): Array<string> {
		return this.columnSet;
	}
	
	set data(v: Array<any>) {
		this.rawData = v;
		this.viewData = v;
		
		this.filterData();
	}
	set filters(v: any) {
		this.filterObject = v;
		
		if (this._filterDiffer == null && v != null) {
			this._filterDiffer = this._differs.find(this.filterObject).create(null);
		}
		
		this.filterData();
	}
	set sortAscending(v: boolean) {
		this.sortAsc = v;
		
		this.sortData();
	}
	set sortColumn(v: string) {
		var newIndex = this.columnSet.indexOf(v);
		
		if (newIndex > -1) {
			this.sortBy = v;
			this.sortIndex = newIndex;
			this.sortData();
		}
	}
	set columnOrder(v: Array<string>) {
		this.columnSet = v;
		
		if (this.sortBy) {
			var newIndex = this.columnSet.indexOf(this.sortBy);
			
			if (newIndex > -1) {
				this.sortIndex = newIndex;
			} else {
				this.sortBy = this.columnSet[Math.max(this.sortIndex, 0)];
			}
		} else {
			this.sortBy = this.columnSet[Math.max(this.sortIndex, 0)];
		}
		
		this.sortData();
	}

	public doCheck(): boolean {
		if (this._filterDiffer != null) {
			var changes = this._filterDiffer.diff(this.filterObject);

			if (changes != null) {
				changes.forEachAddedItem((record: any) => { this.filterObject[record.key] = record.currentValue; });
				changes.forEachChangedItem((record: any) => { this.filterObject[record.key] = record.currentValue; });
				changes.forEachRemovedItem((record: any) => { delete this.filterObject[record.key]; });

				this.filterData();

				return true;
			}
		}

		return false;
	}
	
	public filterData() {
		var startData = JSON.parse(JSON.stringify(this.rawData));
		
		if (Object.keys(this.filterObject).length > 0) {
			var that = this;
			
			startData.filter(function(el) {
				for (var x in that.filterObject) {
					return (el[x] == that.filterObject[x]);
				}
			});
		}
		
		this.viewData = startData;
		
		this.sortData();
	}
	
	public sortData() {
		var that = this;
		
		if (!this.viewData) return this.filterData();
		if (!this.sortBy) this.sortBy = this.columnSet[this.sortIndex];
		
		this.viewData.sort(function(a, b) {
			if (a[that.sortBy] == b[that.sortBy]) return 0;

			if (a[that.sortBy] < b[that.sortBy]) return that.sortAsc ? -1 : 1;
			if (a[that.sortBy] > b[that.sortBy]) return that.sortAsc ? 1 : -1;
		});
	}
	
	public sortClick(colNum: number) {
		if (this.sortIndex == colNum) {
			this.sortAsc = !this.sortAsc;
			this.sortData();
			return;
		}
		
		this.sortIndex = colNum;
		this.sortBy = this.columnSet[colNum];
		this.sortAsc = true;
		
		this.sortData();
	}
	
	public ucfirst(str: string): string {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}

	public underscoreToCamel(str: string): string {
		var that = this;
		
		var segs = str.split("_");
		
		segs = segs.map(function(el) {
			return that.ucfirst(el);
		});
		
		return segs.join(" ");
	}
}