'use strict';

import Player from './player';
import Ball from './ball';
import PlayablePlayer from './playablePlayer';

class Game {
    public player1: Player;
    public player2: Player;
    public ball: Ball;
    public fieldHeight: number;
    public fieldWidth: number;

    constructor(fieldHeight: number, fieldWidth: number) {
        this.fieldHeight = fieldHeight;
        this.fieldWidth = fieldWidth;

        this.player1 = new Player(
            fieldWidth / 10,
            fieldHeight / 2,
            fieldHeight / 5,
            fieldWidth / 20,
        );

        this.player2 = new Player(
            fieldWidth - fieldWidth / 10,
            fieldHeight / 2,
            fieldHeight / 5,
            fieldWidth / 20,
        );
        this.ball = new Ball(10, fieldWidth / 2, fieldHeight / 2, 2, 2);
    }

    public getInfo(): any {
        return {
            ratio: this.fieldWidth / this.fieldHeight,
            racket: {
                w: this.player1.width / this.fieldWidth,
                h: this.player1.height / this.fieldHeight,
            },
            ball: {
                diameter: this.ball.diameter / this.fieldHeight,
            },
        };
    }

    public getState(): any {
        return {
            player_1: {
                x: this.player1.x / this.fieldWidth,
                y: this.player1.y / this.fieldHeight,
            },
            player_2: {
                x: this.player2.x / this.fieldWidth,
                y: this.player2.y / this.fieldHeight,
            },
            ball: {
                x: this.ball.x / this.fieldWidth,
                y: this.ball.y / this.fieldHeight,
            },
        };
    }

    public isDone(): number {
        if (this.ball.x - this.ball.diameter / 2 <= 0)
            return 2;
        if (this.ball.x + this.ball.diameter / 2 >= this.fieldWidth)
            return 1;
        return 0;
    }

    public getObjectsP1(): [PlayablePlayer, Player, Ball] {
        return [new PlayablePlayer(this.player1), Object.assign({}, this.player2), Object.assign({}, this.ball)];
    }

    public getObjectsP2(): [PlayablePlayer, Player, Ball] {
        return [new PlayablePlayer(this.player2), Object.assign({}, this.player1), Object.assign({}, this.ball)];
    }

    public intersection(ax1: number,
                        ay1: number,
                        ax2: number,
                        ay2: number,
                        bx1: number,
                        by1: number,
                        bx2: number,
                        by2: number): boolean {

        const v1 = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
        const v2 = (bx2 - bx1) * (ay2 - by1) - (by2 - by1) * (ax2 - bx1);
        const v3 = (ax2 - ax1) * (by1 - ay1) - (ay2 - ay1) * (bx1 - ax1);
        const v4 = (ax2 - ax1) * (by2 - ay1) - (ay2 - ay1) * (bx2 - ax1);
        return ((v1 * v2 < 0) && (v3 * v4 < 0)) ||
            (ax1 === bx1 && ay1 === by1) ||
            (ax2 === bx2 && ay1 === by1) ||
            (ax1 === bx1 && ay2 === by2) ||
            (ax2 === bx2 && ay2 === by2);
    }

    public collision(p: Player, b: Ball) {
        const bRelVx = b.vX - p.vX;
        const bRelVy = b.vY - p.vY;

        const pLeft = p.x - p.width / 2;
        const pRight = p.x + p.width / 2;
        const pDown = p.y - p.height / 2;
        const pUp = p.y + p.height / 2;

        const bLeft = b.x - b.diameter / 2;
        const bRight = b.x + b.diameter / 2;
        const bDown = b.y - b.diameter / 2;
        const bUp = b.y + b.diameter / 2;


        if (pRight < bLeft) {
            const inter =
                this.intersection(
                    pDown,
                    pRight,
                    pUp,
                    pRight,
                    bDown,
                    bLeft,
                    bDown + bRelVy,
                    bLeft + bRelVx,
                ) ||
                this.intersection(
                    pDown,
                    pRight,
                    pUp,
                    pRight,
                    bUp,
                    bLeft,
                    bUp + bRelVy,
                    bLeft + bRelVx,
                );
            if (inter) {
                const toRatio = Math.abs((bLeft - pRight) / bRelVx);
                const outRatio = 1 - toRatio;
                const newSpeed = -b.vX;
                b.x += toRatio * b.vX + outRatio * newSpeed;
                b.y += b.vY;
                b.vX = newSpeed;

                return inter;
            }
        }

        if (pLeft > bRight) {
            //console.log(pDown, pLeft, pUp, pLeft, bDown, bRight, bDown + bRelVy, bRight + bRelVx);
            //console.log(pDown, pLeft, pUp, pLeft, bUp, bRight, bUp + bRelVy, bRight + bRelVx);
            //console.log(this.intersection(pDown, pLeft, pUp, pLeft, bDown, bRight, bDown + bRelVy, bRight + bRelVx));
            //console.log(this.intersection(pDown, pLeft, pUp, pLeft, bUp, bRight, bUp + bRelVy, bRight + bRelVx));
            const inter =
                this.intersection(
                    pDown,
                    pLeft,
                    pUp,
                    pLeft,
                    bDown,
                    bRight,
                    bDown + bRelVy,
                    bRight + bRelVx,
                ) ||
                this.intersection(
                    pDown,
                    pLeft,
                    pUp,
                    pLeft,
                    bUp,
                    bRight,
                    bUp + bRelVy,
                    bRight + bRelVx,
                );

            if (inter) {
                const toRatio = Math.abs((pLeft - bRight) / bRelVx);
                const outRatio = 1 - toRatio;
                const newSpeed = - b.vX;
                b.x += toRatio * b.vX + outRatio * newSpeed;
                b.y += b.vY;
                b.vX = newSpeed;
                return inter;
            }
        }

        if (pUp < bDown) {
            const inter =
                this.intersection(
                    pLeft,
                    pUp,
                    pRight,
                    pUp,
                    bLeft,
                    bDown,
                    bLeft + bRelVx,
                    bDown + bRelVy,
                ) ||
                this.intersection(
                    pLeft,
                    pUp,
                    pRight,
                    pUp,
                    bRight,
                    bDown,
                    bRight + bRelVx,
                    bDown + bRelVy,
                );

            if (inter) {
                const toRatio = Math.abs((bDown - pUp) / bRelVy);
                const outRatio = 1 - toRatio;
                const newSpeed = -b.vY;
                b.y += toRatio * b.vY - outRatio * newSpeed;
                b.x += b.vX;
                b.vY = newSpeed;
                return inter;
            }
        }

        if (pDown > bUp) {
            const inter =
                this.intersection(
                    pLeft,
                    pDown,
                    pRight,
                    pDown,
                    bLeft,
                    bUp,
                    bLeft + bRelVx,
                    bUp + bRelVy,
                ) ||
                this.intersection(
                    pLeft,
                    pDown,
                    pRight,
                    pDown,
                    bRight,
                    bUp,
                    bRight + bRelVx,
                    bUp + bRelVy,
                );

            if (inter) {
                const toRatio = Math.abs((pDown - bUp) / bRelVy);
                const outRatio = 1 - toRatio;
                const newSpeed = - b.vY;
                b.y += toRatio * b.vY - outRatio * newSpeed;
                b.x += b.vX;
                b.vY = newSpeed;
                return inter;
            }
        }

        return false;
    }

    public ballPossitionCorrection() {
        if (this.ball.y + this.ball.diameter / 2 > this.fieldHeight) {
            this.ball.y -= this.ball.y * 2 + this.ball.diameter - this.fieldHeight * 2;
            this.ball.vY = -this.ball.vY;
        }
        if (this.ball.y - this.ball.diameter / 2 < 0) {
            this.ball.y += this.ball.y * 2 + this.ball.diameter;
            this.ball.vY = -this.ball.vY;
        }
    }

    public playerPossitionCorrection(p: Player, left: number, right: number, bottom: number, top: number) {
        if (p.x - p.width / 2 < left) {
            p.x = left + p.width / 2;
        }

        if (p.x + p.width / 2 > right) {
            p.x = right - p.width / 2;
        }

        if (p.y - p.height / 2 < bottom) {
            p.y = bottom + p.height / 2;
        }

        if (p.y + p.height / 2 > top) {
            p.y = top - p.height / 2;
        }
    }

    public saveObjects(st1: [PlayablePlayer, Player, Ball], st2: [PlayablePlayer, Player, Ball]) {
        const p1 = st1[0];
        const p2 = st2[0];
        this.checkSpeed(p1);
        this.checkSpeed(p2);

        this.player1.vX = p1.vX;
        this.player1.vY = p1.vY;
        this.player2.vX = p2.vX;
        this.player2.vY = p2.vY;

        const coll1 = this.collision(this.player1, this.ball);
        const coll2 = this.collision(this.player2, this.ball);

        if (!coll1 && !coll2) {
            this.ball.x += this.ball.vX;
            this.ball.y += this.ball.vY;
        }

        const ballSpeed = Math.sqrt(this.ball.vX * this.ball.vX + this.ball.vY * this.ball.vY);

        if (ballSpeed > 6) {
            this.ball.vX *= 6 / ballSpeed;
            this.ball.vY *= 6 / ballSpeed;
        }

        this.ballPossitionCorrection();

        if (!coll1) {
            this.player1.x += this.player1.vX;
            this.player1.y += this.player1.vY;
        }
        if (!coll2) {
            this.player2.x += this.player2.vX;
            this.player2.y += this.player2.vY;
        }

        this.playerPossitionCorrection(
            this.player1,
            0,
            (1 / 3) * this.fieldWidth,
            0, this.fieldHeight,
        );

        this.playerPossitionCorrection(
            this.player2,
            (2 / 3) * this.fieldWidth,
            this.fieldWidth,
            0, this.fieldHeight,
        );
    }

    // Validators
    public checkSpeed(p: Player) {

        if (Math.sqrt(p.vX * p.vX + p.vY * p.vY) > 10) {
            throw new Error("speed can not be > 10");
        }
    }
}

export default Game;