---
title: "Assembly 기초 연습문제 풀이1 - NASM 기반 개념 정리 퀴즈"
description: "64비트 NASM 어셈블리어의 레지스터, 스택 구조, 리틀 엔디안, 함수 호출 구조 등 핵심 개념을 객관식 퀴즈로 복습합니다."
date: 2025-04-25
tags: [assembly, nasm, x64, 어셈블리 퀴즈, 리틀엔디안, 스택프레임, 레지스터]
---

Assembly(NASM) 학습 내용을 복습하는 기초 연습문제입니다. 64비트 레지스터 구분, 스택 구조 이해, 리틀 엔디안 메모리 저장 방식, 함수 호출 시 RSP/RBP 역할 등 퀴즈로 정리합니다.

{% quiz ”
`1.` 다음 중 64비트 레지스터가 아닌 것은?
" %}

- RAX
- RBX
- EAX [correct]
- RDI

{% explanation %}
**해설:** EAX는 32비트 레지스터. RAX의 하위 32비트 버전.
{% endexplanation %}
{% endquiz %}

{% quiz ”
`2.` 스택에서 함수 호출 시 사용하는 레지스터 조합으로 올바른 것은?
" %}

- RSP와 RBP [correct]
- RCX와 RDX
- RAX와 RBX
- RSI와 RDI

{% explanation %}
**해설:**

- **RSP (Stack Pointer):** 현재 스택의 top 위치
- **RBP (Base Pointer):** 함수 진입 시 기준점 (스택프레임 기준)
  {% endexplanation %}
  {% endquiz %}

{% quiz ”
`3.` x86-64에서 `mov eax, [rbx]` 의미는?
" %}

- rbx 값을 eax에 복사
- 메모리 주소 rbx에 eax 저장
- rbx가 가리키는 주소의 값을 eax에 저장 [correct]
- eax가 가리키는 주소 값을 rbx에 저장

{% explanation %}
**해설**: `[rbx]`는 **rbx가 가리키는 주소의 값**을 뜻해. 즉, 메모리에서 값을 읽어와 eax에 저장.
{% endexplanation %}
{% endquiz %}

{% quiz ”
 `4.` 다음 중 메모리의 가장 낮은 주소에 저장되는 값은? (리틀 엔디안 기준, `0x12345678` 저장 시)
" %}

- 0x78 [correct]
- 0x56
- 0x34
- 0x12

{% explanation %}
**해설**:
리틀 엔디안은 **하위 바이트부터 저장**.
`0x12345678` → 메모리: `78 56 34 12` (낮은 주소부터 차례대로)
{% endexplanation %}
{% endquiz %}

{% quiz ”
`5.` 다음 중 스택 구조의 특징으로 옳은 것은?
" %}

- FIFO
- 데이터가 높은 주소에서 낮은 주소로 저장됨 [correct]
- 데이터를 랜덤하게 접근 가능함
- 레지스터만 사용하는 구조임

{% explanation %}
**해설**:
스택은 **높은 주소 → 낮은 주소** 방향으로 push됨.
또한 **LIFO 구조**지 (Last In First Out).
{% endexplanation %}
{% endquiz %}

{% quiz ”
`6.` `mov [rax], rbx` 의미는?
" %}

- rax의 값을 rbx에 저장
- rbx의 값을 rax가 가리키는 메모리에 저장 [correct]
- rax와 rbx를 스왑함
- rax가 가리키는 주소에 rbx 주소를 저장

{% explanation %}
**해설**: rbx의 값을 **rax가 가리키는 메모리 주소에 저장**하는 명령어.
{% endexplanation %}
{% endquiz %}

{% quiz ”
`7.` 다음 중 스택 포인터를 의미하는 레지스터는?
" %}

- RAX
- RBP
- RSP [correct]
- RCX

{% explanation %}
**해설**: RSP는 Stack Pointer. 함수 호출, push/pop 등에서 스택 위치 추적에 사용됌.
{% endexplanation %}
{% endquiz %}

{% quiz ”
`8.` 메모리 주소 0x1000에 `db 0xAA, 0xBB, 0xCC, 0xDD`가 저장되어 있을 때, `mov eax, [0x1000]` 수행 결과는? (리틀 엔디안)
" %}

- 0xDDCCBBAA [correct]
- 0xAABBCCDD
- 0xCCBBAA00
- 0xAABB0000

{% explanation %}
**해설**: 메모리에 `AA BB CC DD` 순서로 저장돼도, 리틀 엔디안 읽을 때는 역순으로 결합: `0xDDCCBBAA`.
{% endexplanation %}
{% endquiz %}

{% quiz ”
`9.` 스택프레임 내에서 지역 변수를 접근할 때 보통 사용하는 기준점은?
" %}

- RSP
- RAX
- RBP [correct]
- RIP

{% explanation %}
**해설**: RBP는 스택 프레임의 기준점으로 사용돼서, 지역 변수는 `[RBP - x]` 방식으로 접근함.
{% endexplanation %}
{% endquiz %}

{% quiz ”
`10.` 다음 중 레지스터의 역할과 설명이 올바르게 연결된 것은?
" %}

- RSP - 루프 카운터
- RDI - 함수 반환값 저장
- RCX - 카운터 또는 루프 [correct]
- RAX - 스택 포인터

{% explanation %}
**해설**: RCX는 루프 카운터로 자주 사용됨. 반면,

- RAX는 연산/반환값
- RDI는 함수 인자
- RSP는 스택 포인터
  {% endexplanation %}
  {% endquiz %}
