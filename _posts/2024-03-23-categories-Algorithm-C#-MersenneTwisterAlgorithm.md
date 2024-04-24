---
layout: single
title: "C# MersenneTwisterAlgorithm"
permalink: /CSharp/MersenneTwisterAlgorithm
categories: C#
typora-root-url: ../
tag: [C#, CSharp, Algorithm, MersenneTwisterAlgorithm, MersenneTwister, Random]
toc: true
toc_sticky: true
author_profile: false
sidebar:
  nav: docs
---

# MersenneTwisterAlgorithm

```c#
public class MersenneTwisterAlgorithm
{
    // 알고리즘에서 사용되는 상수들
    private const int N = 624;
    private const int M = 397;
    private const uint MatrixA = 0x9908b0df;
    private const uint UpperMask = 0x80000000;
    private const uint LowerMask = 0x7fffffff;

    // 난수 생성을 위한 상태 배열과 인덱스
    private uint[] mt = new uint[N];
    private int mti = N + 1;

    // 생성자: 초기 시드(seed)를 받아 초기화하는 함수 호출
    public MersenneTwisterAlgorithm(uint seed)
    {
        Initialize(seed);
    }

    // 난수 생성기의 초기화 함수
    private void Initialize(uint seed)
    {
        mt[0] = seed;
        for (int i = 1; i < N; i++)
        {
            mt[i] = 1812433253 * (mt[i - 1] ^ (mt[i - 1] >> 30)) + (uint)i;
        }
    }

    // 난수를 생성하는 함수
    public uint Next()
    {
        // 필요시 상태 배열을 재생성
        if (mti >= N)
            Twist();

        uint y = mt[mti++];
        // 알고리즘의 핵심 연산
        y ^= (y >> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >> 18);

        return y;
    }

    // 상태 배열을 재생성하는 함수
    private void Twist()
    {
        for (int i = 0; i < N; i++)
        {
            uint y = (mt[i] & UpperMask) | (mt[(i + 1) % N] & LowerMask);
            mt[i] = mt[(i + M) % N] ^ (y >> 1) ^ ((y & 1) * MatrixA);
        }
        mti = 0;
    }

    // 최대값을 지정해 난수 생성
    public int Next(int maxValue)
    {
        if (maxValue < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(maxValue), "maxValue must be greater than or equal to 0.");
        }
        return (int)(Next() % (uint)maxValue);
    }

    // 최소값과 최대값 범위 내에서 난수 생성
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
