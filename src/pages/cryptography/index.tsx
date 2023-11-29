/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bigInt from "big-integer";
import { useMemo } from "react";

function isProbablyPrime(n: bigInt.BigInteger, k: number): boolean {
  if (n.equals(2) || n.equals(3)) return true;
  if (n.equals(1) || n.isEven()) return false;

  let s = bigInt.zero;
  let d = n.minus(1);

  while (d.isEven()) {
    d = d.divide(2);
    s = s.plus(1);
  }

  for (let i = 0; i < k; i++) {
    const a = bigInt.randBetween(2, n.minus(2));
    let x = a.modPow(d, n);

    if (x.equals(bigInt.one) || x.equals(n.minus(1))) continue;

    let passed = false;
    for (let j = 0; j < Number(s) - 1; j++) {
      x = x.modPow(2, n);
      if (x.equals(1)) return false;
      if (x.equals(n.minus(1))) {
        passed = true;
        break;
      }
    }

    if (!passed) return false;
  }

  return true;
}

function generateLargePrime(numDigits: number): bigInt.BigInteger {
  const min = bigInt(10).pow(numDigits - 1);
  const max = bigInt(10).pow(numDigits).minus(1);

  while (true) {
    console.log("not found");
    const possiblePrime = bigInt.randBetween(min, max);
    if (possiblePrime.isProbablePrime(256)) return possiblePrime;
  }
}

function RSA(bitSize: number) {
  console.log("RSA START");
  const p = generateLargePrime(bitSize);
  const q = generateLargePrime(bitSize);
  console.log(p, q);

  const n = p.multiply(q);
  const phi = p.minus(1).multiply(q.minus(1));

  let e = bigInt(65537);

  while (!e.greater(phi) || bigInt.gcd(e, phi).notEquals(1)) {
    console.log("RSA");
    e = e.plus(2);
  }

  const d = e.modInv(phi);
  console.log("RSA end");

  return {
    publicKey: {
      e,
      n,
    },
    privateKey: {
      d,
      n,
    },
  };
}

export default function Cryptography() {
  // const { publicKey, privateKey } = useMemo(() => RSA(1024), []);
  console.log("hello i am on server");

  return (
    <div className="container">
      <h1 className="text-3xl font-bold">Криптограф</h1>
      <p className="text-muted-foreground">
        Криптографын алгоритмуудыг ашиглах
      </p>
      <p>test</p>
    </div>
  );
}
