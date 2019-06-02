import { Atod, flag, unit, dropzone, projectile, obstacle } from "./game"
import * as inter from "./intersection"


const stdObstAmount = 10
const stdHeight = 1000
const stdWidth = 2000
const stdNoObstacleZone = 350
const stdSafeZone = 350
const stdDropZoneRad = 50
const stdDropZoneX = 100
const stdDropZoneY = 500
const stdUnitRad = 25
const stdFlag1PosX = 100
const stdFlag1PosY = 100
const stdFlag2PosX = 100
const stdFlag2PosY = 900

const stdObstHeight = 200
const stdObstWidth = 200

const stdObst1PosX = 500
const stdObst1PosY = 300
const stdObst2PosX = 500
const stdObst2PosY = 700

export
    function stdField(): Atod {
    return new Atod(
        10000,
        stdWidth,
        stdHeight,
        stdObstacles(),
        new dropzone(
            stdDropZoneX,
            stdDropZoneY,
            stdDropZoneRad,
        ),
        new dropzone(
            stdWidth - stdDropZoneX,
            stdHeight - stdDropZoneY,
            stdDropZoneRad,
        ),
        new Array<projectile>(),

        stdUnits(false),
        stdUnits(true),
        [
            new flag(
                stdFlag1PosX,
                stdFlag1PosY,
            ),
            new flag(
                stdFlag2PosX,
                stdFlag2PosY,
            ),
        ],
        [
            new flag(
                stdWidth - stdFlag1PosX,
                stdHeight - stdFlag1PosY,
            ),
            new flag(
                stdWidth - stdFlag2PosX,
                stdHeight - stdFlag2PosY,
            ),
        ],
        0,
        false,
    )
}

function stdObstacles(): obstacle[] {
    let obstacles = new Array<obstacle>()
    Math.random()
    obstacles.push(new obstacle(
        stdObstWidth,
        stdObstHeight,
        stdObst1PosX,
        stdObst1PosY,
    ))
    obstacles.push(new obstacle(
        stdObstWidth,
        stdObstHeight,
        stdObst2PosX,
        stdObst2PosY,
    ))
    obstacles.push(new obstacle(
        stdObstWidth,
        stdObstHeight,
        stdWidth - stdObst1PosX,
        stdHeight - stdObst1PosY,
    ))
    obstacles.push(new obstacle(
        stdObstWidth,
        stdObstHeight,
        stdWidth - stdObst2PosX,
        stdHeight - stdObst2PosY,
    ))
    return obstacles
}

class stdBullet {
    prevX: number
    prevY: number
    x: number
    y: number
    vX: number
    vY: number
    v: number
    distLeft: number
    damage: number

    constructor(x: number, y: number, vX: number, vY: number, v: number, distLeft: number, damage: number) {
        this.prevX = x
        this.prevY = y
        this.x = x
        this.y = y
        this.vX = vX
        this.vY = vY
        this.v = v
        this.distLeft = distLeft
        this.damage = damage
    }

    public unitIntersect(u: unit): boolean {
        let [p, _1, _2, _3, _4] = inter.circleSectionInter(u.x, u.y, u.radius, this.prevX, this.prevY, this.x, this.y)
        return p > 0
    }

    public obstacleIntersect(o: obstacle): boolean {
        let bulletLine = new inter.line(
            new inter.point(this.prevX, this.prevY),
            new inter.point(this.x, this.y),
        )

        let deltX = o.width / 2
        let deltY = o.height / 2
        let obstacleLine1 = new inter.line(
            new inter.point(o.x + deltX, o.y + deltY),
            new inter.point(o.x - deltX, o.y + deltY),
        )
        let [p, _2, _3] = inter.sectionsInter(bulletLine, obstacleLine1);
        if (p) {
            return true
        }
        let obstacleLine2 = new inter.line(
            new inter.point(o.x - deltX, o.y + deltY),
            new inter.point(o.x - deltX, o.y - deltY),
        );
        [p, _2, _3] = inter.sectionsInter(bulletLine, obstacleLine2);
        if (p) {
            return true
        }
        let obstacleLine3 = new inter.line(
            new inter.point(o.x - deltX, o.y - deltY),
            new inter.point(o.x + deltX, o.y - deltY),
        );
        [p, _2, _3] = inter.sectionsInter(bulletLine, obstacleLine3);
        if (p) {
            return true
        }
        let obstacleLine4 = new inter.line(
            new inter.point(o.x + deltX, o.y - deltY),
            new inter.point(o.x + deltX, o.y + deltY),
        );
        [p, _2, _3] = inter.sectionsInter(bulletLine, obstacleLine4);
        if (p) {
            return true
        }
        return false
    }

    public move(): boolean {
        if (this.distLeft <= 0) {
            return false
        }
        this.distLeft -= this.v
        this.prevX = this.x
        this.prevY = this.y
        if (this.distLeft <= 0) {
            let newV = this.distLeft + this.v
            this.vX *= newV / this.v
            this.vY *= newV / this.v
        }
        this.x += this.vX
        this.y += this.vY

        return true
    }

    public getType(): string {
        return "bullet"
    }

    public getX(): number {
        return this.x
    }

    public getY(): number {
        return this.y
    }

    public getVX(): number {
        return this.vX
    }

    public getVY(): number {
        return this.vY
    }

    public getDamage(): number {
        return this.damage
    }
}



function bulletProducer(u: unit): ((x: number, y: number) => projectile) {
    return (x: number, y: number): projectile => {
        if (x == 0 && y == 0) {
            return null
        }

        let mod = Math.sqrt(x * x + y * y) *(1- inter.lEPS*10000)
        let dirX = x / mod
        let dirY = y / mod

        return new stdBullet(
            u.x + dirX * u.radius,
            u.y + dirY * u.radius,
            dirX * u.bulletSpeed,
            dirY * u.bulletSpeed,
            u.bulletSpeed,
            u.bulletRange,
            u.bulletDamage,
        )
    }
}

function stdUnits(reversed: boolean): unit[] {

    let sniper = new unit(
        125,
        625,
        stdUnitRad,
        15,
        0,
        0,
        500,
        500,
        800,
        200,
        2000,
        50,
        0,
        0,
        0,
        "sniper",
    )
    sniper.shot = bulletProducer(sniper)
    let healer = new unit(
        125,
        375,
        stdUnitRad,
        15,
        0,
        0,
        600,
        200,
        50,
        50,
        200,
        25,
        0,
        0,
        0,
        "medic"
    )
    healer.shot = bulletProducer(healer)
    let tank = new unit(
        225,
        500,
        stdUnitRad * 2,
        15,
        0,
        0,
        2000,
        200,
        200,
        50,
        200,
        25,
        0,
        0,
        0,
        "tank",
    )
    tank.shot = bulletProducer(tank)
    let sld1 = new unit(
        200,
        575,
        stdUnitRad,
        40,
        0,
        0,
        1000,
        200,
        400,
        50,
        300,
        25,
        0,
        0,
        0,
        "soldier1",
    )
    sld1.shot = bulletProducer(sld1)
    let sld2 = new unit(
        200,
        425,
        stdUnitRad,
        40,
        0,
        0,
        1000,
        200,
        400,
        50,
        300,
        25,
        0,
        0,
        0,
        "soldier2",
    )
    sld2.shot = bulletProducer(sld2)

    let units = new Array<unit>()
    units.push(sniper, healer, tank, sld1, sld2)
    if (reversed) {
        for (let u of units) {
            u.x = stdWidth - u.x
            u.y = stdHeight - u.y
        }
    }
    return units
}
