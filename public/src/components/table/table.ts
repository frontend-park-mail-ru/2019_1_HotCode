'use strict';


import Component from '../baseComponent/index';
import Button from '../button/button';
import Row from './row/row';

class Table extends Component{

    private static template = require('./table.pug');

    private rowsContent: Component;
    private rows: Row[];

    constructor(el: HTMLElement) {
        super(el);

        this.rows = [];
    }

    public render(data: {[key: string]: any}[]): void {
        this.el.innerHTML = Table.template();


        this.rowsContent = new Component(this.el.querySelector('.matches-content'));

        data.map((row, i) => {
            const newRow = Row.CreateRow(i + 1, row.id, row.author, row.score);
            this.rows.push(newRow);

            this.rowsContent.append(
                newRow
            );
        });
    }

    public updateScore = (id: number, newScore: string) => {

        this.rows.map((row) => {

            if (row.id === id) {
                row.score = parseInt(newScore);

            }
        });

        this.rows.sort((a: Row, b: Row) => {

            return b.score - a.score;
        });

        this.updateTable();
    };

    private updateTable = () => {
        Array.from(this.rowsContent.el.querySelectorAll('.match'))
            .map((row) => {
                row.parentNode.removeChild(row);
            });

        this.rows.map((row, i) => {
            row.position = i + 1;
            this.rowsContent.append(row);
        })
    };
}

export default Table;