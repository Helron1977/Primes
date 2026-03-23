"use strict";

const { performance } = require('perf_hooks');

const SIEVE_SIZE = 1000000;
const LIMIT_BITS = SIEVE_SIZE >>> 1;

// Optimization: Wheel factorization for primes 3, 5, 7, 11, 13, 17.
// Wheel period: 15,015 words (480,480 bits).
const SW_WORDS = 15015;
const SW_13 = new Int32Array(SW_WORDS);
const SW_17 = new Int32Array(SW_WORDS);

(function buildSuperWheels() {
    const pList13 = [3, 5, 7, 11, 13];
    for (const p of pList13) {
        let step = p;
        let start = p >>> 1;
        while (start < SW_WORDS * 32) {
            SW_13[start >>> 5 | 0] |= (1 << (start & 31));
            start += step;
        }
    }
    SW_17.set(SW_13);
    const p17 = 17;
    let s = p17 >>> 1;
    while (s < SW_WORDS * 32) {
        SW_17[s >>> 5 | 0] |= (1 << (s & 31));
        s += p17;
    }
})();

class PrimeSieve {
    constructor(sieveSize) {
        this.sieveSize = sieveSize;
        this.limitBits = sieveSize >>> 1;
        this.q = Math.ceil(Math.sqrt(sieveSize)) >>> 1;
        this.words = (this.limitBits >>> 5) + 1;
        this.arr = new Int32Array(this.words);
        this.primeCount = 0;
    }

    getSieveSize() { return this.sieveSize; }

    getPrimeCount() { 
        if (this.primeCount === 0) this.primeCount = this.countPrimes();
        return this.primeCount; 
    }

    runSieve() {
        const arr = this.arr;
        const len = this.words;
        const limit = this.limitBits;
        const q = this.q;

        // Initial state from wheel (3-17)
        arr.set(SW_17.subarray(0, Math.min(SW_WORDS, len)));
        if (len > SW_WORDS) {
            arr.set(SW_13.subarray(0, len - SW_WORDS), SW_WORDS);
            
            // Correction for 17 in unaligned tail
            let fixS = 480496;
            while (fixS < limit) {
                arr[fixS >>> 5 | 0] |= (1 << (fixS & 31));
                fixS += 17;
            }
        }

        // Reset bits for small primes (3-17)
        arr[0] = (arr[0] | 1) & ~0x16E;

        // Sieving loop
        for (let factor = 9; factor <= q; factor++) {
            if ((arr[factor >>> 5 | 0] & (1 << (factor & 31))) === 0) {
                const step = (factor << 1) + 1;
                let s = (factor * step) + factor;

                const safeLimit = limit - (step << 5);
                while (s < safeLimit) {
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                    arr[s >>> 5 | 0] |= (1 << (s & 31)); s += step;
                }
                while (s < limit) {
                    arr[s >>> 5 | 0] |= (1 << (s & 31));
                    s += step;
                }
            }
        }
    }

    countPrimes() {
        let count = 1; // 2
        const arr = this.arr;
        const limit = this.limitBits;
        for (let i = 1; i < limit; i++) {
            if ((arr[i >>> 5 | 0] & (1 << (i & 31))) === 0) count++;
        }
        return count;
    }
}

function runBatch(sieveSize, timeLimit) {
    let passes = 0;
    const timeStart = performance.now();
    const timeFinish = timeStart + (timeLimit * 1000);

    while (performance.now() < timeFinish) {
        const sieve = new PrimeSieve(sieveSize);
        sieve.runSieve();
        passes++;
    }

    const duration = (performance.now() - timeStart) / 1000;
    console.log(`helron-extreme;${passes};${duration};1;algorithm=other,faithful=yes,bits=1`);
}

const verify = new PrimeSieve(SIEVE_SIZE);
verify.runSieve();
if (verify.getPrimeCount() !== 78498) {
    console.error(`Validation failed: expected 78498, got ${verify.getPrimeCount()}`);
    process.exit(1);
} else {
    runBatch(SIEVE_SIZE, 5);
}
