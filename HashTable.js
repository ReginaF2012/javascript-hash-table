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
        if (!bucket) return undefined;
        for (let i = 0; i < bucket.length; i++) {
            if(bucket[i][0] === key) return bucket[i][1];
        }

        return undefined;
    };
}
