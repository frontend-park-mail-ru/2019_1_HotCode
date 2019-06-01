'use strict';

import * as inter from "./intersection"

import GameInfo from "./gameInfo"

class obstacle {
    width: number
    height: number
    x: number
    y: number

    constructor(width: number, height: number, x: number, y: number, ) {
        this.width = width
        this.height = height
        this.x = x
        this.y = y
    }

}

class unit {
    carriedFlag: flag
    x: number
    y: number
    radius: number
    vX: number
    vY: number
    health: number
    viewRange: number
    maxSpeed: number
    bulletDamage: number
    bulletSpeed: number
    bulletRange: number
    reloadTime: number
    reloadLeft: number
    specialTime: number
    specialLeft: number
    unitType: string
    shot: (x: number, y: number) => projectile
    special: (x: number, y: number) => projectile

    constructor(x: number, y: number, radius: number, vX: number, vY: number, health: number, viewRange: number, maxSpeed: number, bulletDamage: number, bulletSpeed: number, bulletRange: number, reloadTime: number, reloadLeft: number, specialTime: number, specialLeft: number, unitType: string) {
        this.x = x
        this.y = y
        this.radius = radius
        this.vX = vX
        this.vY = vY
        this.health = health
        this.viewRange = viewRange
        this.maxSpeed = maxSpeed
        this.bulletDamage = bulletDamage
        this.bulletSpeed = bulletSpeed
        this.bulletRange = bulletRange
        this.reloadTime = reloadTime
        this.reloadLeft = reloadLeft
        this.specialTime = specialTime
        this.specialLeft = specialLeft
        this.unitType = unitType
        this.carriedFlag = null
        this.shot = (x: number, y: number) => null
        this.special = (x: number, y: number) => null
    }
}
interface projectile {
    unitIntersect: (u: unit) => boolean
    obstacleIntersect: (o: obstacle) => boolean
    move: () => boolean

    getType: () => string
    getX: () => number
    getY: () => number
    getVX: () => number
    getVY: () => number
    getDamage: () => number
}

class dropzone {
    x: number
    y: number
    radius: number
    constructor(x: number, y: number, radius: number) {
        this.x = x
        this.y = y
        this.radius = radius
    }
}

class flag {
    x: number
    y: number
    carrier: unit
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.carrier = null
    }
}

// Atod - game of 2AtoD
class Atod {
    ticksLeft: number
    width: number
    heihgt: number
    obstacles: obstacle[]
    dropzone1: dropzone
    dropzone2: dropzone

    projectiles: projectile[]

    player1Units: unit[]
    player2Units: unit[]
    flags1: flag[]
    flags2: flag[]

    winner: number
    isEnded: boolean
    constructor(ticksLeft: number, width: number, heihgt: number, obstacles: obstacle[], dropzone1: dropzone, dropzone2: dropzone, projectiles: projectile[], player1Units: unit[], player2Units: unit[], flags1: flag[], flags2: flag[], winner: number, isEnded: boolean) {
        this.ticksLeft = ticksLeft
        this.width = width
        this.heihgt = heihgt
        this.obstacles = obstacles
        this.dropzone1 = dropzone1
        this.dropzone2 = dropzone2

        this.projectiles = projectiles

        this.player1Units = player1Units
        this.player2Units = player2Units
        this.flags1 = flags1
        this.flags2 = flags2

        this.winner = 0
        this.isEnded = false
    }

    public setTicksLeft(left: number): void {
        this.ticksLeft = left;
    }

    public getInfo(): any {
        return {
            ratio: this.width / this.heihgt,
            p1_dropzone: {
                x: this.dropzone1.x / this.width,
                y: this.dropzone1.y / this.heihgt,
                radius: this.dropzone1.radius / this.heihgt,
            },
            p2_dropzone: {
                x: this.dropzone2.x / this.width,
                y: this.dropzone2.y / this.heihgt,
                radius: this.dropzone2.radius / this.heihgt,
            },
        };
    }

    public getState(): any {
        let tmpState = {
            obstacles: obstaclesToShot(this.obstacles),
            projectiles: projectilesToShot(this.projectiles),
            p1_units: unitsToShot(this.player1Units),
            p2_units: unitsToShot(this.player2Units),
            p1_flags: flagsToShot(this.flags1),
            p2_flags: flagsToShot(this.flags2),
        };

        for (let o of tmpState.obstacles) {
            o.x /= this.width;
            o.y /= this.heihgt;

            o.width /= this.width;
            o.height /= this.heihgt;
        }

        for (let o of tmpState.projectiles) {
            o.x /= this.width;
            o.y /= this.heihgt;
        }

        for (let o of tmpState.p1_units) {
            o.x /= this.width;
            o.y /= this.heihgt;
            o.radius /= this.heihgt;
            o.view_range /= this.heihgt;
        }


        for (let o of tmpState.p1_flags) {
            o.x /= this.width;
            o.y /= this.heihgt;
        }

        for (let o of tmpState.p2_flags) {
            o.x /= this.width;
            o.y /= this.heihgt;
        }

        return tmpState;
    }

    public isDone(): number {
        return this.winner;
    }

    public getObjectsP1(): [unitShot[], unitShot[], dropzoneShot, dropzoneShot, flagShot[], flagShot[], obstacleShot[], projectileShot[], GameInfo] {
        let s = this.createShot1()
        return [s.units, s.enemy_units, s.dropzone, s.enemy_dropzone, s.flags, s.enemy_flags, s.obstacles, s.projectiles, new GameInfo(this.heihgt, this.width, this.ticksLeft)];
    }

    public getObjectsP2(): [unitShot[], unitShot[], dropzoneShot, dropzoneShot, flagShot[], flagShot[], obstacleShot[], projectileShot[], GameInfo] {
        let s = this.createShot2()
        return [s.enemy_units, s.units, s.enemy_dropzone, s.dropzone, s.enemy_flags, s.flags, s.obstacles, s.projectiles, new GameInfo(this.heihgt, this.width, this.ticksLeft)];
    }


    public saveObjects(st1: [unitShot[], unitShot[], dropzoneShot, dropzoneShot, flagShot[], flagShot[], obstacleShot[], projectileShot[]], st2: [unitShot[], unitShot[], dropzoneShot, dropzoneShot, flagShot[], flagShot[], obstacleShot[], projectileShot[]]) {
        let s1 = new shot(
            st1[2],
            st1[3],
            st1[7],
            st1[6],
            st1[0],
            st1[1],
            st1[4],
            st1[5],
        )
        let s2 = new shot(
            st2[2],
            st2[3],
            st2[7],
            st2[6],
            st2[0],
            st2[1],
            st2[4],
            st2[5],
        )

        for (let p of s2.units) {
            inverse3(p, this.heihgt, this.width)
        }

        // loading movement
        this.loadSpeed(s1.units, this.player1Units)
        this.loadSpeed(s2.units, this.player2Units)
        // loading projectiles
        this.loadProjectiles(s1.units, this.player1Units)
        this.loadProjectiles(s2.units, this.player2Units)

        this.loadFlags(s1.units, this.player1Units, this.flags1)
        this.loadFlags(s1.units, this.player1Units, this.flags2)
        this.loadFlags(s2.units, this.player2Units, this.flags2)
        this.loadFlags(s2.units, this.player2Units, this.flags1)

        this.moveProjectiles()
        this.moveUnits(this.player1Units)
        this.moveUnits(this.player2Units)

        this.ticksLeft--
        let res = this.checkWinner()
        if (res == 1) {
            this.winner = 1
            this.isEnded = true
        }
        if (res == 2) {
            this.winner = 2
            this.isEnded = true
        }
        if (this.ticksLeft == 0) {
            this.winner = 0
            this.isEnded = true
        }
    }

    public loadFlags(shot: unitShot[], un: unit[], fs: flag[]) {
        let amount = shot.length
        if (amount > un.length) {
            amount = un.length
        }
        for (let i = 0; i < amount; i++) {
            if (un[i].health <= 0) {
                continue
            }
            if (shot[i].is_carring_flag && un[i].carriedFlag == null) {
                for (let f of fs) {
                    if (f.carrier == null && Math.abs(f.x - un[i].x) < un[i].radius && Math.abs(f.y - un[i].y) < un[i].radius) {
                        f.carrier = un[i]
                        un[i].carriedFlag = f
                        f.x = un[i].x
                        f.y = un[i].y
                    }
                }
            }
            if (!shot[i].is_carring_flag && un[i].carriedFlag != null) {
                un[i].carriedFlag.carrier = null
                un[i].carriedFlag = null
            }
        }
    }

    public loadSpeed(shot: unitShot[], un: unit[]) {
        let amount = shot.length
        if (amount > un.length) {
            amount = un.length
        }
        for (let i = 0; i < amount; i++) {
            if (un[i].health <= 0) {
                continue
            }
            let vX = shot[i].vX
            let vY = shot[i].vY
            let v = Math.sqrt(vX * vX + vY * vY)
            if (v > un[i].maxSpeed) {
                vX *= un[i].maxSpeed / v
                vY *= un[i].maxSpeed / v
            }
            un[i].vX = vX
            un[i].vY = vY
        }
    }

    public loadProjectiles(shot: unitShot[], un: unit[]) {
        let amount = shot.length
        if (amount > un.length) {
            amount = un.length
        }
        for (let i = 0; i < amount; i++) {
            if (un[i].health <= 0) {
                continue
            }
            if (un[i].reloadLeft == 0 && (shot[i].bullet_dir_x != 0 || shot[i].bullet_dir_y != 0)) {
                un[i].reloadLeft = un[i].reloadTime
                let p = un[i].shot(shot[i].bullet_dir_x, shot[i].bullet_dir_y)
                if (p != null) {
                    this.projectiles.push(p)
                }
            }
        }
    }

    public moveProjectiles() {
        let ps = new Array<projectile>()
        for (let p of this.projectiles) {
            if (p.move()) {
                let coll = false
                for (let o of this.obstacles) {
                    if (p.obstacleIntersect(o)) {
                        coll = true
                        continue
                    }
                }
                for (let u of this.player1Units) {
                    if (p.unitIntersect(u)) {
                        coll = true
                        u.health -= p.getDamage()
                        if (u.health <= 0 && u.carriedFlag != null) {
                            u.carriedFlag.carrier = null
                            u.carriedFlag = null
                        }
                    }
                }
                for (let u of this.player2Units) {
                    if (p.unitIntersect(u)) {
                        coll = true
                        u.health -= p.getDamage()
                        if (u.health <= 0 && u.carriedFlag != null) {
                            u.carriedFlag.carrier = null
                            u.carriedFlag = null
                        }
                    }
                }
                if (!coll &&
                    p.getX() < this.heihgt && 0 < p.getX() &&
                    p.getY() < this.width && 0 < p.getY()) {
                    ps.push(p)
                }
            }
        }

        this.projectiles = ps
    }

    public moveUnits(un: unit[]) {
        for (let u of un) {
            if (u.health <= 0) {
                continue
            }

            let deltaX = u.vX
            let deltaY = u.vY
            let movedY = true
            while (movedY) {
                let r = false;
                [r, deltaX] = this.moveUnitX(u, deltaX);
                [movedY, deltaY] = this.moveUnitX(u, deltaY);
            }

            if (u.carriedFlag != null) {
                u.carriedFlag.x = u.x
                u.carriedFlag.y = u.y
            }
        }
    }

    public moveUnitX(u: unit, delta: number): [boolean, number] {
        if (Math.abs(delta) < inter.lEPS) {
            return [false, 0]
        }
        let movement = delta
        let adj = - inter.lEPS
        if (delta > 0) {
            for (let obst of this.obstacles) {
                movement = Math.min(
                    movement,
                    inter.moveCircle(u.x, u.y, u.radius,
                        obst.x - obst.width / 2, obst.y - obst.height / 2, obst.y + obst.height / 2, delta),
                )
            }
        } else {
            adj = inter.lEPS
            for (let obst of this.obstacles) {
                movement = Math.min(
                    movement,
                    inter.moveCircle(u.x, u.y, u.radius,
                        obst.x + obst.width / 2, obst.y + obst.height / 2, obst.y + obst.height / 2, delta),
                )
            }
        }

        u.x += movement + adj
        return [Math.abs(movement) > inter.lEPS, delta - movement - adj]
    }

    public moveUnitY(u: unit, delta: number): [boolean, number] {
        if (Math.abs(delta) < inter.lEPS) {
            return [false, 0]
        }
        let movement = delta
        let adj = - inter.lEPS
        if (delta > 0) {
            for (let obst of this.obstacles) {
                movement = Math.min(
                    movement,
                    inter.moveCircle(u.y, u.x, u.radius,
                        obst.y - obst.height / 2, obst.x - obst.width / 2, obst.x + obst.width / 2, delta),
                )
            }
        } else {
            adj = inter.lEPS
            for (let obst of this.obstacles) {
                movement = Math.min(
                    movement,
                    inter.moveCircle(u.y, u.x, u.radius,
                        obst.y + obst.height / 2, obst.x - obst.width / 2, obst.x + obst.width / 2, delta),
                )
            }
        }

        u.y += movement + adj
        return [Math.abs(movement) > inter.lEPS, delta - movement - adj]
    }

    public checkWinner(): number {
        let f1 = new Array<flag>()
        for (let f of this.flags1) {
            if (!(f.carrier == null &&
                Math.abs(f.x - this.dropzone2.x) < this.dropzone2.radius &&
                Math.abs(f.y - this.dropzone2.y) < this.dropzone2.radius)) {

                f1.push(f)
            }
        }
        this.flags1 = f1
        let f2 = new Array<flag>()
        for (let f of this.flags2) {
            if (!(f.carrier == null &&
                Math.abs(f.x - this.dropzone1.x) < this.dropzone1.radius &&
                Math.abs(f.y - this.dropzone1.y) < this.dropzone1.radius)) {

                f2.push(f)
            }
        }
        this.flags2 = f2

        let p1ct = this.player1Units.length
        for (let u of this.player1Units) {
            if (u.health <= 0) {
                p1ct--
            }
        }
        let p2ct = this.player2Units.length
        for (let u of this.player2Units) {
            if (u.health <= 0) {
                p2ct--
            }
        }


        if (f1.length == 0 || f2.length == 0 || p1ct == 0 || p2ct == 0) {
            if (f1.length == f2.length) {
                if (p1ct > p2ct) {
                    return 1
                } else if (p1ct < p2ct) {
                    return 2
                } else {
                    return 0
                }
            }
            if (p1ct == 0 && p2ct == 0) {
                if (f1.length > f2.length) {
                    return 1
                } else if (f1.length < f2.length) {
                    return 2
                } else {
                    return 0
                }
            }
            if (f2.length == 0 || p2ct == 0) {
                return 1
            }
            if (f1.length == 0 || p1ct == 0) {
                return 2
            }
        }
        return 0
    }

    public createShot1(): shot {
        return new shot(
            dropzoneToShot(this.dropzone1),
            dropzoneToShot(this.dropzone2),
            projectilesToShot(this.projectiles),
            obstaclesToShot(this.obstacles),
            unitsToShot(this.player1Units),
            unitsToShot(this.player2Units),
            flagsToShot(this.flags1),
            flagsToShot(this.flags2),
        )
    }

    public createShot2(): shot {
        let s = new shot(
            dropzoneToShot(this.dropzone2),
            dropzoneToShot(this.dropzone1),
            projectilesToShot(this.projectiles),
            obstaclesToShot(this.obstacles),
            unitsToShot(this.player2Units),
            unitsToShot(this.player1Units),
            flagsToShot(this.flags2),
            flagsToShot(this.flags1),
        )
        inverse4(s.dropzone, this.heihgt, this.width)
        inverse4(s.enemy_dropzone, this.heihgt, this.width)
        for (let p of s.projectiles) {
            inverse5(p, this.heihgt, this.width)
        }
        for (let p of s.obstacles) {
            inverse1(p, this.heihgt, this.width)
        }
        for (let p of s.units) {
            inverse3(p, this.heihgt, this.width)
        }
        for (let p of s.enemy_units) {
            inverse3(p, this.heihgt, this.width)
        }
        for (let p of s.flags) {
            inverse2(p, this.heihgt, this.width)
        }
        for (let p of s.enemy_flags) {
            inverse2(p, this.heihgt, this.width)
        }

        return s
    }
}

class obstacleShot {
    x: number
    y: number
    height: number
    width: number
}

function inverse1(s: obstacleShot, height: number, width: number) {
    s.x = width - s.x
    s.y = height - s.y
}

class flagShot {
    x: number
    y: number
    is_carried: boolean
}

function inverse2(s: flagShot, height: number, width: number) {
    s.x = width - s.x
    s.y = height - s.y
}

class unitShot {
    is_carring_flag: boolean
    x: number
    y: number
    radius: number
    vX: number
    vY: number
    health: number
    view_range: number
    max_speed: number
    bullet_damage: number
    bullet_speed: number
    bullet_range: number
    reload_time: number
    reload_left: number
    special_time: number
    special_left: number
    unit_type: string
    bullet_dir_x: number
    bullet_dir_y: number
    special_dir_x: number
    special_dir_y: number
}

function inverse3(s: unitShot, height: number, width: number) {
    s.x = width - s.x
    s.y = height - s.y
    s.vX = -s.vX
    s.vY = -s.vY
}

class dropzoneShot {
    x: number
    y: number
    radius: number
}

function inverse4(s: dropzoneShot, height: number, width: number) {
    s.x = width - s.x
    s.y = height - s.y
}

class projectileShot {
    type: string
    x: number
    y: number
    vX: number
    vY: number
}

function inverse5(s: projectileShot, height: number, width: number) {
    s.x = width - s.x
    s.y = height - s.y
    s.vX = -s.vX
    s.vY = -s.vY
}

class shot {
    dropzone: dropzoneShot
    enemy_dropzone: dropzoneShot
    projectiles: projectileShot[]
    obstacles: obstacleShot[]
    units: unitShot[]
    enemy_units: unitShot[]
    flags: flagShot[]
    enemy_flags: flagShot[]
    constructor(dropzone: dropzoneShot, enemy_dropzone: dropzoneShot, projectiles: projectileShot[], obstacles: obstacleShot[], units: unitShot[], enemy_units: unitShot[], flags: flagShot[], enemy_flags: flagShot[]) {
        this.dropzone = dropzone
        this.enemy_dropzone = enemy_dropzone
        this.projectiles = projectiles
        this.obstacles = obstacles
        this.units = units
        this.enemy_units = enemy_units
        this.flags = flags
        this.enemy_flags = enemy_flags
    }
}


function obstaclesToShot(os: obstacle[]): obstacleShot[] {
    let r = new Array<obstacleShot>()
    for (let o of os) {
        r.push(new obstacleShot())
        let i = r.length - 1
        r[i].x = o.x
        r[i].y = o.y
        r[i].height = o.height
        r[i].width = o.width
    }
    return r
}

function unitsToShot(us: unit[]): unitShot[] {
    let r = new Array<unitShot>()
    for (let u of us) {
        r.push(new unitShot())
        let i = r.length - 1
        r[i].is_carring_flag = u.carriedFlag != null
        r[i].x = u.x
        r[i].y = u.y
        r[i].radius = u.radius
        r[i].vX = u.vX
        r[i].vY = u.vY
        r[i].health = u.health
        r[i].view_range = u.viewRange
        r[i].max_speed = u.maxSpeed
        r[i].bullet_damage = u.bulletDamage
        r[i].bullet_range = u.bulletRange
        r[i].bullet_speed = u.bulletSpeed
        r[i].bullet_dir_x = 0
        r[i].bullet_dir_y = 0
        r[i].special_left = u.specialLeft
        r[i].special_time = u.specialTime
        r[i].unit_type = u.unitType
    }
    return r
}

function flagsToShot(os: flag[]): flagShot[] {
    let r = new Array<flagShot>()
    for (let o of os) {
        r.push(new flagShot())
        let i = r.length - 1
        r[i].x = o.x
        r[i].y = o.y
        r[i].is_carried = o.carrier != null
    }
    return r
}



function dropzoneToShot(d: dropzone): dropzoneShot {
    let r = new dropzoneShot()
    r.x = d.x
    r.y = d.y
    r.radius = d.radius

    return r
}

function projectilesToShot(os: projectile[]): projectileShot[] {
    let r = new Array<projectileShot>()
    for (let o of os) {
        r.push(new projectileShot())
        let i = r.length - 1
        r[i].x = o.getX()
        r[i].y = o.getY()
        r[i].vX = o.getVX()
        r[i].vY = o.getVY()
        r[i].type = o.getType()
    }
    return r
}



export { Atod, flag, unit, dropzone, projectile, obstacle }