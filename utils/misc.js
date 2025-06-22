export class ExpiringArray {
    _arr;

    constructor(maxsize, ttl) {
        this.lastReset = Date.now()
        this.ttl = ttl
        this.maxsize = maxsize
        this._arr = []
    }

    _update() {
        const now = Date.now()
        let i = 0
        while (i < this._arr.length && now - this._arr[i].t > this.ttl) {
            i++
        }
        // remove expired elements before operations
        if (i > 0) this._arr.splice(0, i)
    }


    add(element) {
        this._update()
        const time = Date.now()
        this._arr.push({
            e: element,
            t: time
        })

        if (this._arr.length > this.maxsize) {
            this._arr.shift()  // Remove the oldest
        }
        return time
    }

    remove(element, time = null) {
        this._update()
        for (let i = 0; i < this._arr.length; i++) {
            if (this._arr[i].e === element && (time ? this._arr[i].t === time : true)) {
                const item = this._arr[i]
                this._arr.splice(i, 1)
                return [item.e, item.t]
            }
        }
        return [null, null]
    }


    get(element, time = null) {
        this._update()
        for (let i = 0; i < this._arr.length; i++) {
            if (this._arr[i].e === element && (time ? this._arr[i].t === time : true))
                return [this._arr[i], this._arr[i].t]
            // const [it, time] = TGA.get(testElement)
        }
        return [null, null]
    }

    size() {
        this._update()
        return this._arr.length
    }

    clear() {
        this._arr = []
        this.lastReset = Date.now()
    }
}