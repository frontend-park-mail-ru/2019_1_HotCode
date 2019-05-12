'use strict';


import Component from '../baseComponent/index';
import Button from '../button/button';
import Row from './row/row';

class Table extends Component{

    private static template = require('./table.pug');

    private rows: Row[];

    constructor(el: HTMLElement) {
        super(el);
    }

    public render(data: {[key: string]: any}): void {
        this.el.innerHTML = Table.template(data);

        this.rows = Array.from(this.el.querySelectorAll('.table__row_theme_data'))
            .map((row) => {
                return new Row(row as HTMLElement);
            });
    }

    public updateScore = (id: number, newScore: string) => {

        this.rows.map((row) => {

            if (row.id === id) {
                row.cells[2].setText(newScore);

            }
        });

        this.rows.sort((a: Row, b: Row) => {

            return +b.cells[2].getText() - +a.cells[2].getText();
        });

        this.updateTable();
    };

    private updateTable = () => {
        const rows = Array.from(this.el.querySelectorAll('.table__row_theme_data'))
            .map((row) => {
                row.parentNode.removeChild(row);
            });

        this.rows.map((row, i) => {
            row.cells[0].setText((i + 1).toString());
            this.el.appendChild(row.el);
        })
    };
}

export default Table;