# JavaScript solution 2 by Helron1977

This solution contains two different implementations of the Prime Sieve.

## Implementations

### 1. static_mask
- **Algorithm**: `other` (Static Mask up to 37)
- **Faithfulness**: `no` (Global buffer and pre-calculated mask)
- **Badges**:
  ![Algorithm](https://img.shields.io/badge/Algorithm-other-yellow)
  ![Faithfulness](https://img.shields.io/badge/Faithful-no-yellowgreen)
  ![Parallelism](https://img.shields.io/badge/Parallel-no-green)
  ![Bit count](https://img.shields.io/badge/Bits-1-green)

### 2. wheel
- **Algorithm**: `other` (Wheel Factorization 3-17)
- **Faithfulness**: `yes`
- **Badges**:
  ![Algorithm](https://img.shields.io/badge/Algorithm-other-yellowgreen)
  ![Faithfulness](https://img.shields.io/badge/Faithful-yes-green)
  ![Parallelism](https://img.shields.io/badge/Parallel-no-green)
  ![Bit count](https://img.shields.io/badge/Bits-1-green)

## Run instructions

```bash
./run.sh
```

This will run both implementations sequentially. You can also run them individually:

```bash
node PrimeJavaScript_sniper.js
node PrimeJavaScript_extreme_sieve.js
```

## Output format

```log
helron-sniper;[PASSES];[DURATION];1;algorithm=other,faithful=no,bits=1
helron-extreme;[PASSES];[DURATION];1;algorithm=other,faithful=yes,bits=1
```
