---
layout: single
title:  "C# MersenneTwisterAlgorithm"
permalink: /CSharp/MersenneTwisterAlgorithm
categories: C#
typora-root-url: ../
tag: [C#, CSharp, Algorithm, MersenneTwisterAlgorithm, MersenneTwister, Random]
toc: true
toc_sticky : true
author_profile: false
sidebar:
    nav: docs
---

```c#
public class MersenneTwisterAlgorithm
{
    private const int N = 624;
    private const int M = 397;
    private const uint MatrixA = 0x9908b0df;
    private const uint UpperMask = 0x80000000;
    private const uint LowerMask = 0x7fffffff;

    private uint[] mt = new uint[N];
    private int mti = N + 1;

    public MersenneTwisterAlgorithm(uint seed)
    {
        Initialize(seed);
    }

    private void Initialize(uint seed)
    {
        mt[0] = seed;
        for (int i = 1; i < N; i++)
        {
            mt[i] = 1812433253 * (mt[i - 1] ^ (mt[i - 1] >> 30)) + (uint)i;
        }
    }

    public uint Next()
    {
        if (mti >= N)
            Twist();

        uint y = mt[mti++];
        y ^= (y >> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >> 18);

        return y;
    }

    private void Twist()
    {
        for (int i = 0; i < N; i++)
        {
            uint y = (mt[i] & UpperMask) | (mt[(i + 1) % N] & LowerMask);
            mt[i] = mt[(i + M) % N] ^ (y >> 1) ^ ((y & 1) * MatrixA);
        }
        mti = 0;
    }

    public int Next(int maxValue)
    {
        if (maxValue < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(maxValue), "maxValue must be greater than or equal to 0.");
        }
        return (int)(Next() % (uint)maxValue);
    }

    public int Next(int minValue, int maxValue)
    {
        if (minValue > maxValue)
        {
            throw new ArgumentOutOfRangeException(nameof(minValue), "minValue must be less than or equal to maxValue.");
        }
        return (int)(Next() % (uint)(maxValue - minValue)) + minValue;
    }
}
```