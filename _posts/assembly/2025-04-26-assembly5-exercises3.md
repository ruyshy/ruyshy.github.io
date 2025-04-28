---
title: "Assembly 조건 분기와 스택프레임 연습문제 풀이3 - NASM 실습 퀴즈"
description: "Assembly NASM 기반으로 조건 분기 명령어(jmp, je, jne, jl, jg)와 함수 호출 구조(call, ret) 및 스택프레임 접근을 객관식, 단답형 퀴즈로 복습합니다."
date: 2025-04-28
tags: [assembly, nasm, 조건 분기, call ret 구조, 스택프레임, x64, reversing, 어셈블리어]
---

NASM 어셈블리어에서 조건 분기(jmp, je, jne, jl, jg), 함수 호출 구조(call, ret), 스택프레임과 지역 변수 접근 방식을 복습하는 퀴즈입니다. 기본 명령어 흐름을 명확히 이해하는 데 도움이 됩니다.


{% quiz "
`1.` `cmp rax, rbx` 실행 후 `je label` 명령이 의미하는 것은?
" %}

- rax > rbx이면 점프
- rax == rbx이면 점프 [correct]
- rax < rbx이면 점프
- 무조건 점프

{% explanation %}
**해설:** `je (jump if equal)`는 `cmp` 결과가 같을 때 점프.
{% endexplanation %}
{% endquiz %}

{% quiz "
`2.` `cmp rax, rbx` 후 `jg label` 조건은 어떤 경우인가?
" %}

- rax가 rbx보다 작을 때
- rax가 rbx보다 클 때 [correct]
- rax와 rbx가 같을 때
- 항상 점프할 때

{% explanation %}
**해설:** `jg`는 greater(크다) 조건이야.
{% endexplanation %}

{% endquiz %}

{% quiz "
`3.` `jl` 명령어는 어떤 조건일 때 점프하는가?
" %}

- rax == rbx
- rax < rbx [correct]
- rax > rbx
- 조건 없이

{% explanation %}
**해설:** `jl`은 less (작을 때) 점프.
{% endexplanation %}
{% endquiz %}

{% quiz "
`4.` [단답형] 조건이 같을 때 점프하는 명령어는? (소문자 입력)
" %}

- [text: je]

{% explanation %}
**해설:** je 는 Jump if Equal (같으면 점프).
{% endexplanation %}
{% endquiz %}

{% quiz "
`5.` `loop label` 명령어가 사용되려면 어떤 레지스터가 0이 아니어야 할까?
" %}

- RAX
- RCX [correct]
- RSP
- RBP

{% explanation %}
**해설:** `loop`는 RCX를 자동으로 감소시키고, 0 아니면 점프.
{% endexplanation %}
{% endquiz %}

{% quiz "
`6.` 반복문에서 주로 사용되는 조건 분기 명령어는?
" %}

- jmp
- jne [correct]
- call
- ret

{% explanation %}
**해설:** `jne`는 비교 결과가 다를 때 점프해서 반복을 제어할 때 자주 써.
{% endexplanation %}
{% endquiz %}

{% quiz "
`7.` [단답형] 64bit 환경에서 루프 카운터로 가장 많이 쓰이는 레지스터는? (대문자로 입력)
" %}

-[text: RCX]

{% explanation %}
**해설:** 루프 돌릴 때 기본적으로 RCX를 씀.
{% endexplanation %}
{% endquiz %}

{% quiz "
`8.` `call func` 명령어를 실행하면 어떤 일이 일어날까?
" %}

- func의 주소를 RAX에 저장
- func로 점프하고, 복귀 주소를 스택에 저장 [correct]
- 함수를 끝냄
- func를 복사함

{% explanation %}
**해설:** `call`은 현재 RIP를 스택에 push하고 func로 jump.
{% endexplanation %}
{% endquiz %}

{% quiz "
`9.` `ret` 명령어를 실행하면 무엇을 수행하는가?
" %}

- RSP 초기화
- 스택의 복귀 주소를 pop해서 복귀 [correct]
- 함수를 다시 호출
- 프로그램 종료

{% explanation %}
**해설:** `ret`은 call 시 push한 return address를 pop해서 복귀해.
{% endexplanation %}
{% endquiz %}

{% quiz "
`10.` [단답형] 함수 호출 시 push되는 레지스터 이름은 무엇인가? (프로그램 카운터 역할)
" %}

-[text: RIP]

{% explanation %}
**해설:** 호출 시 현재 실행 주소(RIP)를 스택에 저장.
{% endexplanation %}
{% endquiz %}

{% quiz "
`11.` `mov eax, [rbp-4]` 명령은 무엇을 의미하는가?
" %}

- rbp 값을 eax로 복사
- rbp가 가리키는 주소에서 4바이트 뒤 값을 복사
- rbp보다 4 적은 주소의 값을 eax에 복사 [correct]
- eax를 rbp-4로 설정

{% explanation %}
**해설:** `[rbp-4]`는 현재 스택 기준에서 지역 변수 접근할 때 쓰는 주소 계산 방식.
{% endexplanation %}
{% endquiz %}

{% quiz "
`12.` 스택에 저장된 값에 접근할 때 많이 쓰는 레지스터는?
" %}

- RSP
- RBP [correct]
- RCX
- RAX

{% explanation %}
**해설:** RBP는 스택 프레임 기준, 지역 변수나 인자 접근할 때 주로 사용.
{% endexplanation %}
{% endquiz %}

{% quiz "
`13.` [단답형] 메모리 주소 계산 표현식 [rbx+rcx*4] 에서 rcx는 무엇으로 해석되는가? (1단어)
" %}

- [text: index]

{% explanation %}
**해설:** `rcx*4`는 인덱스 역할, 배열 접근할 때 사용.
{% endexplanation %}
{% endquiz %}