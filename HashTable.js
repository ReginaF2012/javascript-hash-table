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
}
