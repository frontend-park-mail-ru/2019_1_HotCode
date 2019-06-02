'use strict';


import Component from '../baseComponent/index';
import Button from '../button/button';
import Row2 from './row/row2';
import ScrollableBlock from '../scrollable/scrollable';

class Table2 extends Component{

    private static template = require('./table2.pug');

    private rowsContent: ScrollableBlock;
    private partRowsContent: Component;
    private rows: Row2[];

    private lastRowIdField: number;

    constructor(el: HTMLElement) {
        super(el);

        this.rows = [];
        this.lastRowIdField = 0;
    }

    get lastRowId(): number {
        return this.lastRowIdField;
    }

    public render(data: {[key: string]: any}[]): void {
        this.el.innerHTML = Table2.template();


        this.partRowsContent = new Component(this.el.querySelector('.part-matches-content'));

        this.rowsContent = new ScrollableBlock(this.el.querySelector('.matches-content'));
        this.rowsContent.decorate();

        this.fillTable(data);
    }

    public fillTable(data: {[key: string]: any}[]): void {

        data.map((row) => {
            const newRow = Row2.CreateRow(this.lastRowIdField + 1, row.id, row.game_slug, row.is_verified, row.score);
            this.rows.push(newRow);

            this.partRowsContent.append(
                newRow
            );

            this.lastRowIdField++;
        });
    }

    public handleEndTable(onEndTable: () => Promise<any>): void {
        this.rowsContent.onEndScroll = onEndTable;
    }

    // public updateScore = (id: number, newScore: number, author: {[key: string]: any}) => {
    //
    //     let virginity = true;
    //
    //     this.rows.map((row) => {
    //
    //         if (row.id === id) {
    //
    //             virginity = false;
    //             row.score = newScore;
    //
    //         }
    //     });
    //
    //     if (virginity) {
    //
    //         console.log('new Row');
    //         const tempRow = Row.CreateRow(this.lastRowIdField + 1, id, author, newScore);
    //         this.rows.push(tempRow);
    //     }
    //
    //     this.rows.sort((a: Row, b: Row) => {
    //
    //         return b.score - a.score;
    //     });
    //
    //     this.updateTable();
    //
    // };
    //
    // private updateTable = () => {
    //     const curRows = Array.from(this.partRowsContent.el.querySelectorAll('.match'));
    //     const lengthOfCurRows = curRows.length;
    //     curRows
    //         .map((row) => {
    //             row.parentNode.removeChild(row);
    //         });
    //
    //     for (let i = 0; i < lengthOfCurRows; i++) {
    //
    //         this.rows[i].position = i + 1;
    //         this.partRowsContent.append(this.rows[i]);
    //     }
    // };
}

export default Table2;