class HashTable {
    constructor(max = 1000) {
        this.max = max;
        this.size = 0;
        this.buckets = new Array(max);
    }

    hashFunction = (key) => {
        let hash = 0;
        let string = key.toString();
        if (string.length === 0) throw "invalid key";
        for (let i = 0; i < string.length; i++) {
            hash = (hash << 5) - hash;
            hash += string.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash % this.max);
    };

    getIndex = (key) => {
        return this.hashFunction(key);
    };

    getBucket = (key) => {
        return this.buckets[this.getIndex(key)];
    };

    set = (key, value) => {
        const index = this.getIndex(key);

        if (!this.getBucket(key)) this.buckets[index] = [];

        let bucket = this.getBucket(key);
        let overwritten = false;

        for (let i = 0; i < bucket.length; i++) {
            let node = bucket[i];
            if (node[0] === key) {
                node[1] = value;
                overwritten = true;
            }
        }

        if (!overwritten) {
            bucket.push([key, value]);
            this.size++;
        }

        if (this.size / this.max >= 0.7) {
            this.resize(this.max * 2);
        }

        return value;
    };

    get = (key) => {
        const bucket = this.getBucket(key);
        if (!bucket) return;
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) return bucket[i][1];
        }
    };

    remove = (key) => {
        if (!this.getBucket(key)) return;
        let bucket = this.getBucket(key);
        for (let i = 0; i < bucket.length; i++) {
            let node = bucket[i];
            if (node[0] === key) {
                bucket.splice(i, 1);
                if (bucket.length < 1) bucket = undefined;
                this.size--;

                if (this.size / this.max <= .25) this.resize(Math.ceil(this.max / 2));
                return node[1];
            }

        }
    }

    resize = (newSize) => {
        const tempBuckets = this.buckets;
        this.max = newSize;
        this.size = 0;
        this.buckets = [];
        tempBuckets.forEach((bucket) => {
            if (!!bucket) {
                bucket.forEach(node => {
                    this.set(node[0], node[1]);
                })
            }
        });
    };
}

const ht = new HashTable();
ht.set('a', 1);
ht.set('b', 2);
ht.set('c', 3);
