class HashTable {
    constructor(max = 1000) {
        // maximum number of buckets in the hash table
        this.max = max;
        // current number of buckets filled in the hash table
        this.size = 0
        // initialize the buckets
        this.buckets = new Array(max);
    }

    hashFunction = (key) => {
        let hash = 0;
        // take any key that can be converted to a string (ie: string, number, object)
        let string = key.toString();
        // no empty keys
        if (string.length === 0) throw "invalid key";
        for (let i = 0; i < string.length; i++) {
            // left bitwise shift
            hash = (hash << 5) - hash;
            // add value of character code
            hash += string.charCodeAt(i);
            // ensures 32 bit unsigned integer
            hash = hash & hash;
        }
        // don't want negative numbers, modulus to make sure we are within the bounds of our max size
        return Math.abs(hash % this.max);
    };

    // given a key, return the index after hashing
    getIndex = (key) => {
        return this.hashFunction(key);
    };

    // given a key, return the bucket
    getBucket = (key) => {
        return this.buckets[this.getIndex(key)];
    };

    // assign a key value pair, will also overwrite if key is already in table
    set = (key, value) => {
        const index = this.getIndex(key);
        
        // if the bucket doesn't have anything in it, assign it to an empty array
        if (!this.getBucket(key)) this.buckets[index] = [];

        // now that we know there is something there, get the bucket
        let bucket = this.getBucket(key);

        // to determine if the key was already in the table
        let overwritten = false;

        for (let i = 0; i < bucket.length; i++) {
            // nodes in hash table are stored as tuples, an array containing 2 items
            // [k, v]
            let node = bucket[i];
            // overwrite the value of the key if it exists
            if (node[0] === key) {
                node[1] = value;
                overwritten = true;
            }
        }
        
        // if it wasn't in the table, add it
        if (!overwritten) {
            bucket.push([key, value]);
            this.size++;
        }

        // if it now exceeds max size, we need to resize our hash table to twice the size
        // this keeps the load factor in a good range for time and space complexity trade off
        if (this.size / this.max >= 0.75) {
            this.resize(this.max * 2);
        }

        return value;
    };

    // lookup
    get = (key) => {
        const bucket = this.getBucket(key);
        // if there is no bucket return undefined
        if (!bucket) return;

        // search through the bucket and return the value of the corresponding key
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) return bucket[i][1];
        }
    };


    remove = (key) => {
        // return undefined if bucket doesn't exist
        if (!this.getBucket(key)) return;

        let bucket = this.getBucket(key);
        //search through the bucket
        for (let i = 0; i < bucket.length; i++) {
            let node = bucket[i];
            // until we find the node with the correct key
            if (node[0] === key) {
                // remove the node
                bucket.splice(i, 1);
                // if that was the only element, reassign it to undefined 
                if (bucket.length < 1) bucket = undefined;
                this.size--;

                // resize if the load factor is too low
                if (this.size / this.max <= .25) this.resize(Math.ceil(this.max / 2));

                // return removed element value
                return node[1];
            }

        }
    }

    // this is necessary to keep our hashing algorithm efficient
    resize = (newMax) => {
        // store current buckets
        const tempBuckets = this.buckets;
        this.max = newMax;
        // reset size to 0
        this.size = 0;
        // empty buckets
        this.buckets = new Array(newMax);

        // work through old buckets
        tempBuckets.forEach((bucket) => {
            // add values back into table
            if (!!bucket) {
                bucket.forEach(node => {
                    // need to rehash the keys because hashing algo is based on size
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
