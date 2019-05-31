'use strict';

import Player from './player';
import Ball from './ball';
import GameInfo from './gameInfo';
import PlayablePlayer from './playablePlayer';

class point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

}

class line {
    public beg: point;
    public end: point;
    constructor(beg: point, end: point) {
        this.beg = beg;
        this.end = end;
    }
}

function vMult(ax: number, ay: number, bx: number, by: number): number {
    return ax * by - bx * ay;
}

function intersection(l1: line, l2: line): [boolean, number, number] {
    let intersect = true;
    let x = 0;
    let y = 0;
    let v1 = vMult(l2.end.x - l2.beg.x, l2.end.y - l2.beg.y, l1.beg.x - l2.beg.x, l1.beg.y - l2.beg.y);
    let v2 = vMult(l2.end.x - l2.beg.x, l2.end.y - l2.beg.y, l1.end.x - l2.beg.x, l1.end.y - l2.beg.y);
    let v3 = vMult(l1.end.x - l1.beg.x, l1.end.y - l1.beg.y, l2.beg.x - l1.beg.x, l2.beg.y - l1.beg.y);
    let v4 = vMult(l1.end.x - l1.beg.x, l1.end.y - l1.beg.y, l2.end.x - l1.beg.x, l2.end.y - l1.beg.y);

    intersect = ((v1 * v2) < 0 && (v3 * v4) < 0);
    if (intersect) {
        let A1 = l1.end.y - l1.beg.y;
        let B1 = l1.beg.x - l1.end.x;
        let C1 = -l1.beg.x * (l1.end.y - l1.beg.y) + l1.beg.y * (l1.end.x - l1.beg.x);

        let A2 = l2.end.y - l2.beg.y;
        let B2 = l2.beg.x - l2.end.x;
        let C2 = -l2.beg.x * (l2.end.y - l2.beg.y) + l2.beg.y * (l2.end.x - l2.beg.x);

        let d = (A1 * B2 - B1 * A2);
        let dx = (-C1 * B2 + B1 * C2);
        let dy = (-A1 * C2 + C1 * A2);
        x = (dx / d);
        y = (dy / d);
        return [intersect, x, y];
    }
    return [intersect, x, y];
}

const epsilonMove = 0.01;

enum side {
    none,
    up,
    down,
    right,
    left,
}

function collidePlayerBall(player: Player, ball: Ball): [boolean, side, number, number] {
    let isColliding = false;
    let collisionSide = side.none;
    let collisionPointX = 0;
    let collisionPointY = 0;
    // translate to player's fixed system
    ball.vX -= player.vX;
    ball.vY -= player.vY;



    let pRight = player.x + player.width / 2;
    let pLeft = player.x - player.width / 2;
    let pUp = player.y + player.height / 2;
    let pDown = player.y - player.height / 2;

    let bRight = ball.x + ball.diameter / 2;
    let bLeft = ball.x - ball.diameter / 2;
    let bUp = ball.y + ball.diameter / 2;
    let bDown = ball.y - ball.diameter / 2;

    let pLeftLine = new line(new point(pLeft, pUp), new point(pLeft, pDown))
    let pRightLine = new line(new point(pRight, pUp), new point(pRight, pDown))
    let pUpLine = new line(new point(pLeft, pUp), new point(pRight, pUp))
    let pDownLine = new line(new point(pLeft, pDown), new point(pRight, pDown))

    let bRightDownLine = new line(new point(bRight, bDown), new point(bRight + ball.vX, bDown + ball.vY))
    let bLeftDownLine = new line(new point(bLeft, bDown), new point(bLeft + ball.vX, bDown + ball.vY))
    let bRightUpLine = new line(new point(bRight, bUp), new point(bRight + ball.vX, bUp + ball.vY))
    let bLeftUpLine = new line(new point(bLeft, bUp), new point(bLeft + ball.vX, bUp + ball.vY))

    // collision detection
    if (bRight <= pLeft) {
        [isColliding, collisionPointX, collisionPointY] = intersection(pLeftLine, bRightDownLine);
        if (isColliding) {
            collisionPointX -= ball.diameter / 2
            collisionPointY += ball.diameter / 2

            collisionSide = side.left

        } 
        if (!isColliding) {
            [isColliding, collisionPointX, collisionPointY] = intersection(pLeftLine, bRightUpLine);
            if (isColliding) {
                collisionPointX -= ball.diameter / 2
                collisionPointY -= ball.diameter / 2

                collisionSide = side.left

            }
        }
    }
    if (!isColliding)
        if (pRight <= bLeft) {
            [isColliding, collisionPointX, collisionPointY] = intersection(pRightLine, bLeftDownLine);
            if (isColliding) {
                collisionPointX += ball.diameter / 2
                collisionPointY += ball.diameter / 2

                collisionSide = side.right

            }
            if (!isColliding) {
                [isColliding, collisionPointX, collisionPointY] = intersection(pRightLine, bLeftUpLine);
                if (isColliding) {
                    collisionPointX += ball.diameter / 2
                    collisionPointY -= ball.diameter / 2

                    collisionSide = side.right

                }
            }
        }
    if (!isColliding)
        if (pUp <= bDown) {
            [isColliding, collisionPointX, collisionPointY] = intersection(pUpLine, bLeftDownLine);
            if (isColliding) {
                collisionPointX += ball.diameter / 2
                collisionPointY += ball.diameter / 2

                collisionSide = side.up

            } 
            if (!isColliding) {
                [isColliding, collisionPointX, collisionPointY] = intersection(pUpLine, bRightDownLine);
                if (isColliding) {
                    collisionPointX -= ball.diameter / 2
                    collisionPointY += ball.diameter / 2

                    collisionSide = side.up

                }
            }
        }
    if (!isColliding)
        if (bUp <= pDown) {
            [isColliding, collisionPointX, collisionPointY] = intersection(pDownLine, bLeftUpLine);
            if (isColliding) {
                collisionPointX += ball.diameter / 2
                collisionPointY -= ball.diameter / 2

                collisionSide = side.down

            }
            if (!isColliding) {
                [isColliding, collisionPointX, collisionPointY] = intersection(pDownLine, bRightUpLine);
                if (isColliding) {
                    collisionPointX -= ball.diameter / 2
                    collisionPointY -= ball.diameter / 2

                    collisionSide = side.down

                }
            }
        }


    ball.vX += player.vX
    ball.vY += player.vY
    if (isColliding) {
        ball.x = collisionPointX
        ball.y = collisionPointY
        if (collisionSide == side.right) {
            if (ball.vX < 0)
                ball.vX = -ball.vX
            ball.x += epsilonMove
            return [isColliding, collisionSide, collisionPointX, collisionPointY]
        }
        if (collisionSide == side.left) {
            if (ball.vX > 0)
                ball.vX = -ball.vX
            ball.x -= epsilonMove
            return [isColliding, collisionSide, collisionPointX, collisionPointY]
        }
        if (collisionSide == side.up) {
            if (ball.vY < 0)
                ball.vY = -ball.vY
            ball.y += epsilonMove
            return [isColliding, collisionSide, collisionPointX, collisionPointY]
        }
        if (collisionSide == side.down) {
            if (ball.vY > 0)
                ball.vY = -ball.vY
            ball.y -= epsilonMove
            return [isColliding, collisionSide, collisionPointX, collisionPointY]
        }
    }

    return [isColliding, collisionSide, collisionPointX, collisionPointY]
}


function movePlayer(player: Player, up: number, down: number, left: number, right: number) {
    player.x += player.vX
    player.y += player.vY

    // controls player not to cross bounds
    // on x && width
    if (player.x - player.width / 2 < left) {
        player.x = left + player.width / 2
    }
    if (player.x + player.width / 2 > right) {
        player.x = right - player.width / 2
    }
    // on y && height
    if (player.y - player.height / 2 < down) {
        player.y = down + player.height / 2
    }
    if (player.y + player.height / 2 > up) {
        player.y = up - player.height / 2
    }
}

function movePlayerWithBall(player: Player, ball: Ball, up: number, down: number, left: number, right: number, collSide: side, collPX: number, collPY: number) {
    player.x += player.vX
    player.y += player.vY
    ball.x += player.vX
    ball.y += player.vY

    // controls player not to cross bounds
    // on x && width
    if (player.x - player.width / 2 < left) {
        player.x = left + player.width / 2
    }
    if (player.x + player.width / 2 > right) {
        player.x = right - player.width / 2
    }
    // on y && height
    if (player.y - player.height / 2 < down) {
        player.y = down + player.height / 2
    }
    if (player.y + player.height / 2 > up) {
        player.y = up - player.height / 2
    }

    let bounceSpeedCorr = true;
    if (up < ball.y + ball.diameter / 2 && collSide == side.up) {
        bounceSpeedCorr = false;
        ball.y = up - ball.diameter / 2 - epsilonMove
        player.y = ball.y - ball.diameter / 2 - epsilonMove - player.height / 2

        let fullBallV = Math.sqrt(ball.vX * ball.vX + ball.vY * ball.vY)
        ////console.log(ball.vX, ball.vY, ball.vX * ball.vX, ball.vY * ball.vY, ball.vX * ball.vX + ball.vY * ball.vY)
        ball.vY = 0
        if (ball.vX < 0) {
            ball.vX = -fullBallV
        } else {
            ball.vX = fullBallV
        }
    }
    if (down > ball.y - ball.diameter / 2 && collSide == side.down) {
        bounceSpeedCorr = false;
        ball.y = down + ball.diameter / 2 + epsilonMove
        player.y = ball.y + ball.diameter / 2 + epsilonMove + player.height / 2

        let fullBallV = Math.sqrt(ball.vX * ball.vX + ball.vY * ball.vY)
        ball.vY = 0
        if (ball.vX < 0) {
            ball.vX = -fullBallV
        } else {
            ball.vX = fullBallV
        }
    }

    if (Math.abs(player.vX) < Math.abs(ball.vX)) {
        ball.x += ball.vX - player.vX
    }
    if (Math.abs(player.vY) < Math.abs(ball.vY)) {
        ball.y += ball.vY - player.vY
    }

    if (bounceSpeedCorr) {
        let xDir = ball.x - player.x;
        let yDir = ball.y - player.y;
        const dirMod = Math.sqrt(xDir*xDir + yDir*yDir);
        const vMod = Math.sqrt(ball.vX*ball.vX + ball.vY*ball.vY)

        xDir = xDir/dirMod;
        yDir = yDir/dirMod;
        ball.vX = xDir * vMod;
        ball.vY = yDir * vMod;
    }
}

enum winner {
    noWinner,
    p1Win,
    p2Win,
}

function moveBall(ball: Ball) {
    ball.x += ball.vX
    ball.y += ball.vY
}

function fixBallPos(ball: Ball, height: number) {
    if (ball.y - ball.diameter < 0) {
        ball.y = ball.diameter
        ball.vY = -ball.vY
    }
    if (ball.y + ball.diameter > height) {
        ball.y = height - ball.diameter
        ball.vY = -ball.vY
    }
}

function winnerCheck(ball: Ball, width: number): number {
    if (ball.x - ball.diameter < 0) {
        return winner.p2Win
    }
    if (ball.x + ball.diameter > width) {
        return winner.p1Win
    }
    return winner.noWinner
}

class Game {
    public player1: Player;
    public player2: Player;
    public ball: Ball;
    public fieldHeight: number;
    public fieldWidth: number;
    public ticksLeft: number;

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

    public setTicksLeft(left: number): void {
        this.ticksLeft = left;
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

    public getObjectsP1(): [PlayablePlayer, Player, Ball, GameInfo] {
        return [new PlayablePlayer(this.player1), Object.assign({}, this.player2),
             Object.assign({}, this.ball), new GameInfo(this.fieldHeight, this.fieldWidth, this.ticksLeft)];
    }

    public getObjectsP2(): [PlayablePlayer, Player, Ball, GameInfo] {
        return [new PlayablePlayer(this.player2), Object.assign({}, this.player1),
             Object.assign({}, this.ball), new GameInfo(this.fieldHeight, this.fieldWidth, this.ticksLeft)];
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
        if (Math.abs(this.ball.x - 173.48739435875638) < epsilonMove && Math.abs(this.ball.y - 190.6122070010947) < epsilonMove) {
            k++;
            ////console.log("ON POSITION")
        }
        if (this.ball.x - this.ball.diameter / 2 <= this.player1.x + this.player1.width / 2) {
            k++;
            if (k == 2)
                k++;
            ////console.log("\n\n\nwidth bitch", this.ball.y - this.ball.diameter / 2 <= this.player1.y + this.player1.height / 2)

        }

        if (k > 0) {
            ////console.log("ABTER HIT", this.ball, this.player1)
        }
        let [collide1, collSide1, collPX1, collPY1] = collidePlayerBall(this.player1, this.ball)

        let [collide2, collSide2, collPX2, collPY2] = collidePlayerBall(this.player2, this.ball)

        if (k >= 2) {
            ////console.log("p1 coll", collSide1, collPX1, collPY1)
        }
        if (k >= 2) {
            ////console.log("p2 coll", collSide2, collPX2, collPY2)
        }
        if (collide1) {
            movePlayerWithBall(this.player1, this.ball, this.fieldHeight, 0, 0, this.fieldWidth / 3, collSide1, collPX1, collPY1)
            movePlayer(this.player2, this.fieldHeight, 0, this.fieldWidth * 2 / 3, this.fieldWidth)
        } else if (collide2) {
            movePlayer(this.player1, this.fieldHeight, 0, 0, this.fieldWidth / 3)
            movePlayerWithBall(this.player2, this.ball, this.fieldHeight, 0, this.fieldWidth * 2 / 3, this.fieldWidth, collSide2, collPX2, collPY2)
        } else {
            this.ball.y += this.ball.vY;
            let prev = this.ball.y
            fixBallPos(this.ball, this.fieldHeight)
            if (this.ball.y != prev) {
                p++;
                //console.log("AAAAAAAAAAAAAA", p)
                let [collide1, collSide1, collPX1, collPY1] = collidePlayerBall(this.player1, this.ball)
                let [collide2, collSide2, collPX2, collPY2] = collidePlayerBall(this.player2, this.ball)
                if (collide1) {
                    //console.log("BBBBBBBBBBBBBB", p)
                    //console.log(this.ball, collSide1)
                    movePlayerWithBall(this.player1, this.ball, this.fieldHeight, 0, 0, this.fieldWidth / 3, collSide1, collPX1, collPY1)
                    movePlayer(this.player2, this.fieldHeight, 0, this.fieldWidth * 2 / 3, this.fieldWidth)
                    //console.log(this.ball, collSide1)
                } else if (collide2) {
                    //console.log("CCCCCCCCCCCCCC", p)
                    movePlayer(this.player1, this.fieldHeight, 0, 0, this.fieldWidth / 3)
                    movePlayerWithBall(this.player2, this.ball, this.fieldHeight, 0, this.fieldWidth * 2 / 3, this.fieldWidth, collSide2, collPX2, collPY2)
                }
            } else {
                //console.log("DDDDDDDDDD", p)
                this.ball.x += this.ball.vX;
                movePlayer(this.player1, this.fieldHeight, 0, 0, this.fieldWidth / 3)
                movePlayer(this.player2, this.fieldHeight, 0, this.fieldWidth * 2 / 3, this.fieldWidth)
            }
        }

        //////console.log("collision?", this.ball, this.player1)

    }

    // Validators
    public checkSpeed(p: Player) {

        if (Math.sqrt(p.vX * p.vX + p.vY * p.vY) > 10) {
            throw new Error("speed can not be > 10");
        }
    }
}

let k = 0;
let p = 0;

export default Game;