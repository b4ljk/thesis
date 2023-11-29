Building RSA encryption from scratch is an educational but complex process that requires a solid understanding of mathematics, particularly number theory and modular arithmetic. Below, I'll give you a step-by-step guide on how to implement RSA encryption in TypeScript. This guide assumes you have a basic knowledge of TypeScript and concepts such as big integer arithmetic.

Keep in mind that implementing cryptographic algorithms from scratch for production use is not recommended due to the high potential for security vulnerabilities. However, for educational purposes and your thesis, it can be a valuable experience.

### Step 1: Environment Setup

Before you start coding, make sure you have Node.js and npm installed, as well as a TypeScript setup. You might also need a big integer library since JavaScript's `Number` type cannot handle the large integers required by RSA. A popular choice for a big integer library in JavaScript/TypeScript is `BigInt`, which is built into modern JavaScript engines, or you can use an external library such as `bn.js`.

### Step 2: Generate Key Pair

RSA key generation involves creating two keys: a public key and a private key. These keys are derived from large prime numbers.

1. **Generate two distinct large prime numbers**, `p` and `q`. The size of these primes determines the security of your RSA system; for a secure system, you would want primes that are several hundred digits long. For your project, you can start with smaller primes.
   
   To generate primes, you can use a primality test such as the Miller-Rabin algorithm.

2. **Calculate `n` (the modulus)**: `n = p * q`. The modulus is used as part of the public and private keys.

3. **Calculate the totient of `n`**: `φ(n) = (p - 1) * (q - 1)`. This value is used to generate the keys.

4. **Choose an integer `e` (the public exponent)**: `e` must be greater than 1 and less than `φ(n)` and coprime to `φ(n)`. Commonly, `e` is chosen as 65537 for its properties of being a prime and having a short binary representation.

5. **Compute `d` (the private exponent)**: `d` is the modular multiplicative inverse of `e` modulo `φ(n)`. It can be computed using the extended Euclidean algorithm.

```typescript
// Example code for generating an RSA key pair
function generateKeyPair(bits: number): { publicKey: PublicKey, privateKey: PrivateKey } {
    // Implement prime generation, then calculate n, φ(n), e, and d
    return {
        publicKey: {
            n: /* calculated value */,
            e: /* chosen value */
        },
        privateKey: {
            n: /* calculated value */,
            d: /* calculated value */
        }
    };
}
```

### Step 3: Encryption

The encryption function takes a message `m` and a public key `{e, n}` and returns the ciphertext `c`:

1. **Convert the message to a number**: This can be done using a padding scheme like PKCS#1. Ensure that the message, as a number, is less than `n`.

2. **Compute the ciphertext**: `c = m^e mod n`.

```typescript
// Example code for RSA encryption
function encrypt(message: bigint, publicKey: PublicKey): bigint {
    return message ** publicKey.e % publicKey.n;
}
```

### Step 4: Decryption

To decrypt a ciphertext `c` with a private key `{d, n}`, do the following:

1. **Compute the original message**: `m = c^d mod n`.

```typescript
// Example code for RSA decryption
function decrypt(ciphertext: bigint, privateKey: PrivateKey): bigint {
    return ciphertext ** privateKey.d % privateKey.n;
}
```

### Step 5: Testing

After implementing the functions, you should test the encryption and decryption with sample messages and ensure that the decryption of the encrypted message returns the original message.

### Important Security Considerations

1. **Never use this implementation in a production environment**. Cryptography libraries like OpenSSL or libraries in higher-level languages already have time-tested implementations.

2. **Randomness is crucial**. The random numbers used to generate the primes must be cryptographically secure.

3. **Input validation**. Always validate inputs to ensure they are within the expected ranges.

4. **Performance optimizations**. RSA operations are computationally expensive. Consider performance implications, especially as you scale to larger numbers.

5. **Side-channel attacks**. Be aware that your implementation could be susceptible to timing attacks or other side channels. Look into securing against these if you're going into depth in your thesis.

6. **Code reviews and audits**. If this were for production, you'd want multiple experts to review and audit your code.

7. **Error handling**. Proper error handling should be implemented to manage edge cases gracefully.

### Conclusion

This is just an outline of the steps required to implement RSA encryption in TypeScript. Each step has its own complexities and would require a detailed explanation which is beyond the scope of this singular response. However, you should now have a roadmap on how to implement RSA and what areas require your attention. Be sure to dive deeper into each step, and consult existing open-source implementations and cryptography texts for further guidance.