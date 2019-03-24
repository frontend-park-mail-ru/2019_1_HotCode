'use strict';

class GameObject {
    x: number;
    y: number;

    vX: number;
    vY: number;
    constructor(x: number, y: number, vX: number, vY: number) {
        this.x = x;
        this.y = y;

        this.vX = vX;
        this.vY = vY;
    }
}

export class Player extends GameObject {
    height: number;
    width: number;

    constructor(x: number, y: number, height: number, width: number) {
        super(x, y, 0, 0);

        this.height = height;
        this.width = width;
    }
}

export class PlayablePlayer extends Player {
    constructor(p: Player) {
        super(p.x, p.y, p.height, p.width);
    }

    setMoveVector(speed: number, x: number, y: number) {
        let nSpeed = speed / Math.sqrt(x * x + y * y);
        this.vX = x * nSpeed;
        this.vY = y * nSpeed;
    }
}
export class Ball extends GameObject {
    diameter: number;
    constructor(diameter: number, x: number, y: number, vX: number, vY: number) {
        super(x, y, vX, vY);
        this.diameter = diameter;
    }
}

export class Game {
    player1: Player;
    player2: Player;
    ball: Ball;
    fieldHeight: number;
    fieldWidth: number;

    constructor(fieldHeight: number, fieldWidth: number) {
        this.fieldHeight = fieldHeight;
        this.fieldWidth = fieldWidth;

        this.player1 = new Player(fieldWidth / 10, fieldHeight / 2, fieldHeight / 5, fieldWidth / 20);
        this.player2 = new Player(fieldWidth - fieldWidth / 10, fieldHeight / 2, fieldHeight / 5, fieldWidth / 20);
        this.ball = new Ball(10, fieldWidth / 2, fieldHeight / 2, 5, 0);
    }

    getInfo(): any {
        return {
            "ratio": this.fieldWidth / this.fieldHeight
        }
    }

    getState(): any {
        return {
            "player_1": {
                "x": this.player1.x / this.fieldWidth,
                "y": this.player1.y / this.fieldHeight
            },
            "player_2": {
                "x": this.player2.x / this.fieldWidth,
                "y": this.player2.y / this.fieldHeight
            },
            "ball": {
                "x": this.ball.x / this.fieldWidth,
                "y": this.ball.y / this.fieldHeight
            }
        };
    }

    isDone(): number {
        if (this.ball.x - this.ball.diameter / 2 <= 0)
            return 2;
        if (this.ball.x + this.ball.diameter / 2 >= this.fieldWidth)
            return 1;
        return 0;
    }

    getObjectsP1(): [PlayablePlayer, Player, Ball] {
        return [new PlayablePlayer(this.player1), Object.assign({}, this.player2), Object.assign({}, this.ball)];
    }

    getObjectsP2(): [PlayablePlayer, Player, Ball] {
        return [new PlayablePlayer(this.player2), Object.assign({}, this.player1), Object.assign({}, this.ball)];
    }

    intersection(ax1: number, ay1: number, ax2: number, ay2: number, bx1: number, by1: number, bx2: number, by2: number): boolean {
        let v1 = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
        let v2 = (bx2 - bx1) * (ay2 - by1) - (by2 - by1) * (ax2 - bx1);
        let v3 = (ax2 - ax1) * (by1 - ay1) - (ay2 - ay1) * (bx1 - ax1);
        let v4 = (ax2 - ax1) * (by2 - ay1) - (ay2 - ay1) * (bx2 - ax1);
        return (v1 * v2 < 0) && (v3 * v4 < 0);
    }

    collision(p: Player, b: Ball) {
        let bRelVx = b.vX - p.vX;
        let bRelVy = b.vY - p.vY;

        let p_left = p.x - p.width / 2;
        let p_right = p.x + p.width / 2;
        let p_down = p.y - p.height / 2;
        let p_up = p.x + p.height / 2;

        let b_left = b.x - b.diameter / 2;
        let b_right = b.x + b.diameter / 2;
        let b_down = b.y - b.diameter / 2;
        let b_up = b.x + b.diameter / 2;


        if (p_right < b_left) {
            let inter =
                this.intersection(p_down, p_right, p_up, p_right, b_down, b_left, b_down + bRelVy, b_left + bRelVx) ||
                this.intersection(p_down, p_right, p_up, p_right, b_up, b_left, b_up + bRelVy, b_left + bRelVx);
            if (inter) {
                let to_ratio = bRelVx / (b_left - p_right);
                let out_ratio = 1 - to_ratio;
                b.x += to_ratio * b.vX - out_ratio * b.vX;
                b.y += b.vY;
                b.vX = - b.vX;
                console.log(1);
                return inter;
            }
        }

        if (p_left > b_right) {
            let inter =
                this.intersection(p_down, p_left, p_up, p_left, b_down, b_right, b_down + bRelVy, b_right + bRelVx) ||
                this.intersection(p_down, p_left, p_up, p_left, b_up, b_right, b_up + bRelVy, b_right + bRelVx);
            if (inter) {
                let to_ratio = bRelVx / (p_left - b_right);
                let out_ratio = 1 - to_ratio;
                b.x += to_ratio * b.vX - out_ratio * b.vX;
                b.y += b.vY;
                b.vX = - b.vX;
                console.log(2);
            return inter;
            }
        }

        if (p_up < b_down) {
            let inter =
                this.intersection(p_left, p_up, p_right, p_up, b_left, b_down, b_left + bRelVx, b_down + bRelVy) ||
                this.intersection(p_left, p_up, p_right, p_up, b_right, b_down, b_right + bRelVx, b_down + bRelVy);
            if (inter) {
                let to_ratio = bRelVy / (b_down - p_up);
                let out_ratio = 1 - to_ratio;
                b.y += to_ratio * b.vY - out_ratio * b.vY;
                b.x += b.vX;
                b.vY = - b.vY;
                console.log(3);
                return inter;
            }
        }

        if (p_down > b_up) {
            let inter =
                this.intersection(p_left, p_down, p_right, p_down, b_left, b_up, b_left + bRelVx, b_up + bRelVy) ||
                this.intersection(p_left, p_down, p_right, p_down, b_right, b_up, b_right + bRelVx, b_up + bRelVy);
            if (inter) {
                let to_ratio = bRelVy / (p_down - b_up);
                let out_ratio = 1 - to_ratio;
                b.y += to_ratio * b.vY - out_ratio * b.vY;
                b.x += b.vX;
                b.vY = - b.vY;
                console.log(4);
                return inter;
            }
        }

        return false;
    }

    ballPossitionCorrection() {

    }

    playerPossitionCorrection(p: Player, left: number, right: number, bottom: number, top: number) {
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
            p.y = top + p.height / 2;
        }
    }

    saveObjects(st1: [PlayablePlayer, Player, Ball], st2: [PlayablePlayer, Player, Ball]) {
        let p1 = st1[0];
        let p2 = st2[0];
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
        
        this.player1.x += this.player1.vX;
        this.player1.y += this.player1.vY;
        this.player2.x += this.player2.vX;
        this.player2.y += this.player2.vY;

        this.playerPossitionCorrection(this.player1, 0, (1/3) * this.fieldWidth, 0, this.fieldHeight);
        this.playerPossitionCorrection(this.player2, (2/3) * this.fieldWidth, this.fieldWidth, 0, this.fieldHeight);
    }

    // Validators
    checkSpeed(p: Player) {
        if (Math.sqrt(p.vX * p.vX + p.vY * p.vY) > 10) {
            throw new Error("speed can not be > 10")
        }
    }
}