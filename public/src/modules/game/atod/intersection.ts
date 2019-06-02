'use strict';

export
    const lEPS = (.0000001)
export
    const qEPS = (.01)

function between(px: number, py: number, x1: number, y1: number, x2: number, y2: number): boolean {
    return ((x1 < px) && (px < x2)) && ((y1 < py) && (py < y2));
}

export
    function circleSectionInter(cX: number, cY: number, cR: number,
        x1: number, y1: number, x2: number, y2: number): number[] {
    x1 -= cX
    x2 -= cX
    y1 -= cY
    y2 -= cY

    let a = y2 - y1
    let b = x1 - x2
    let c = x1 * (y1 - y2) + y1 * (x2 - x1)
    let x0 = -a * c / (a * a + b * b)
    let y0 = -b * c / (a * a + b * b)
    if (c * c > cR * cR * (a * a + b * b) + lEPS) {
        return [0, 0, 0, 0, 0]
    } else if (Math.abs(c * c - cR * cR * (a * a + b * b)) < lEPS) {
        let count = 1;
        if (!between(x0, y0, x1, y1, x2, y2)) {
            count = 0;
            x0 = 0;
            y0 = 0;
        } 
        return [count, x0, y0, 0, 0]
    } else {
        let d = cR * cR - c * c / (a * a + b * b)
        let mult = Math.sqrt(d / (a * a + b * b))
        let ax = x0 + b * mult
        let bx = x0 - b * mult
        let ay = y0 - a * mult
        let by = y0 + a * mult
        let count = 2;
        if (!between(ax, ay, x1, y1, x2, y2)) {
            count--;
            ax = 0;
            ay = 0;
        }

        if (!between(bx, by, x1, y1, x2, y2)) {
            count--;
            bx = 0;
            by = 0;
        }

        return [count, ax, ay, bx, by]
    }
}
export
    class point {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}
export
    class line {
    beg: point
    end: point
    constructor(beg: point, end: point) {
        this.beg = beg
        this.end = end
    }
}
export
    function vMult(ax: number, ay: number, bx: number, by: number): number {
    return ax * by - bx * ay
}
export
    function sectionsInter(l1: line, l2: line): [boolean, number, number] {
    let v1 = vMult(l2.end.x - l2.beg.x, l2.end.y - l2.beg.y, l1.beg.x - l2.beg.x, l1.beg.y - l2.beg.y)
    let v2 = vMult(l2.end.x - l2.beg.x, l2.end.y - l2.beg.y, l1.end.x - l2.beg.x, l1.end.y - l2.beg.y)
    let v3 = vMult(l1.end.x - l1.beg.x, l1.end.y - l1.beg.y, l2.beg.x - l1.beg.x, l2.beg.y - l1.beg.y)
    let v4 = vMult(l1.end.x - l1.beg.x, l1.end.y - l1.beg.y, l2.end.x - l1.beg.x, l2.end.y - l1.beg.y)

    let intersect = ((v1 * v2) < 0 && (v3 * v4) < 0)
    if (intersect) {
        let A1 = l1.end.y - l1.beg.y
        let B1 = l1.beg.x - l1.end.x
        let C1 = -l1.beg.x * (l1.end.y - l1.beg.y) + l1.beg.y * (l1.end.x - l1.beg.x)

        let A2 = l2.end.y - l2.beg.y
        let B2 = l2.beg.x - l2.end.x
        let C2 = -l2.beg.x * (l2.end.y - l2.beg.y) + l2.beg.y * (l2.end.x - l2.beg.x)

        let d = (A1 * B2 - B1 * A2)
        let dx = (-C1 * B2 + B1 * C2)
        let dy = (-A1 * C2 + C1 * A2)
        let x = (dx / d)
        let y = (dy / d)
        return [intersect, x, y]
    }
    return [false, 0, 0]
}
export
    function moveCircle(pM: number, pS: number, rad: number, d: number, f: number, s: number, mv: number): number {
    if (f > s) {
        [f, s] = [s, f]
    }
    let inv = false
    if (pM < d) {
        if (mv < 0) {
            return mv
        }
    } else {
        if (mv > 0) {
            return mv
        }
        [d, pM] = [pM, d]
        inv = true
        mv = -mv
    }
    let res = mv
    if (f <= pS && pS <= s) {
        res = Math.min(d - rad - pM, mv)
    } else if (pS - s < rad && pS - s > 0) {
        let shift = Math.sqrt(rad * rad - (pS - s) * (pS - s))
        res = Math.min(d - shift - pM, mv)
    } else if (f - pS < rad && f - pS > 0) {
        let shift = Math.sqrt(rad * rad - (f - pS) * (f - pS))
        res = Math.min(d - shift - pM, mv)
    }

    if (inv) {
        return -res
    }
    return res
}