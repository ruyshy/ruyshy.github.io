---
title: "Assembly 기초 연습문제 풀이2 - 명령어 개념 정리 퀴즈"
description: "NASM 어셈블리어 기본 명령어 mov, add, sub, cmp, jmp 등과 스택 조작, 함수 호출 구조를 퀴즈로 복습합니다."
date: 2025-04-25
tags: [assembly, nasm, x64, 어셈블리 퀴즈, 명령어 실습, call, ret, push, pop]
---

NASM 어셈블리어 명령어에 대한 이해도를 높이기 위한 연습문제입니다. `mov`, `add`, `cmp`, `jmp`, `push`, `pop`, `call`, `ret` 등 핵심 명령어와 스택 동작 구조를 객관식 퀴즈 형식으로 정리했습니다.

{% quiz "
`1.` 다음 중 `mov` 명령어의 올바른 사용 예시는?
" %}

- `mov [rax], [rbx]`
- `mov rax, 1234h`
- `mov 1234h, rax`
- `mov rax, [rbx + rcx]` [correct]

{% explanation %}
**해설:** `[rbx + rcx]`는 유효한 메모리 주소. `mov [mem], [mem]`은 금지라서 A는 틀림.  
{% endexplanation %}
{% endquiz %}

{% quiz "
`2.` `add rax, 5` 명령어 실행 후 결과로 올바른 설명은?
" %}

- `rax`에 5가 저장된다
- `rax` 값이 5로 교체된다
- `rax` 값에 5가 더해진다 [correct]
- 5의 주소를 `rax`에 저장한다

{% explanation %}
**해설:** `add`는 기존 값에 값을 더하는 연산. 즉, `rax` += 5 와 같음.
{% endexplanation %}
{% endquiz %}

{% quiz "
`3.` `sub rax, 3` 실행 전 `rax`가 10이었다면, 결과는?
" %}

- `rax` = 7 [correct]
- `rax` = 13
- `rax` = -3
- `rax` = 3

{% explanation %}
**해설:** `sub`는 뺄셈이므로 10 - 3 = 7이 됨.
{% endexplanation %}
{% endquiz %}

{% quiz "
`4.` `cmp rax, rbx`의 의미는?
" %}

- `rax` 값을 `rbx`로 바꿈
- `rbx` 값을 `rax`에서 뺀 뒤 저장
- 두 값을 비교하고 플래그만 설정 [correct]
- `rax`와 `rbx`를 교환

{% explanation %}
**해설:** `cmp`는 뺄셈을 하되 결과를 저장하지 않고 플래그만 설정해서 조건 분기 판단에 사용.
{% endexplanation %}
{% endquiz %}

{% quiz "
`5.` 조건 분기와 가장 밀접한 관계가 있는 명령어는?
" %}

- `call`
- `cmp` [correct]
- `ret`
- `push`

{% explanation %}
**해설:** 조건 분기(`jz`, `jne` 등)는 `cmp`로 플래그 설정 후 분기.
{% endexplanation %}
{% endquiz %}

{% quiz "
`6.` 다음 중 무조건 점프하는 명령어는?
" %}

- `je`
- `jne`
- `jmp` [correct]
- `jg`

{% explanation %}
**해설:** `jmp`는 조건 없이 무조건 지정한 주소로 점프함.
{% endexplanation %}
{% endquiz %}

{% quiz "
`7.` `push rax` 수행 시 어떤 일이 일어나는가?
" %}

- `rax` 값을 스택에 저장하고 `RSP`는 증가
- `rax` 값을 스택에 저장하고 `RSP`는 감소 [correct]
- 스택에서 값을 꺼내 `rax`에 저장
- `rax`가 스택 포인터로 바뀜

{% explanation %}
**해설:** 스택은 위에서 아래로 쌓이기 때문에 `push` 시 `RSP`가 감소.
{% endexplanation %}
{% endquiz %}

{% quiz "
`8.` `pop rbx` 수행 후 상태는?
" %}

- `rbx`에 스택의 맨 위 값이 들어가고 `RSP`는 증가 [correct]
- `rbx`에 스택의 맨 위 값이 들어가고 `RSP`는 감소
- `rbx`의 값이 스택에 들어감
- `rbx`와 `rsp`를 교환함

{% explanation %}
**해설:** `pop`은 `RSP`가 가리키는 값을 꺼내고, `RSP`는 증가.
{% endexplanation %}
{% endquiz %}

{% quiz "
`9.` `call func` 명령어는 어떤 동작을 수행하는가?
" %}

- 현재 위치를 저장하고 `func`로 점프 [correct]
- `func`의 결과를 `rax`에 저장
- 함수를 종료시킴
- `func`를 `push`함

{% explanation %}
**해설:** `call`은 현재 `RIP`를 스택에 저장하고, 해당 함수로 점프.
{% endexplanation %}
{% endquiz %}

{% quiz "
`10.` `ret` 명령어의 기능은?
" %}

- rax를 초기화
- 함수 인자를 정리
- 스택에서 `return` 주소를 꺼내 복귀 [correct]
- 프로그램 종료

{% explanation %}
**해설:** `ret`은 `call` 시 `push`된 `RIP` 값을 `pop`해서 해당 위치로 복귀.
{% endexplanation %}
{% endquiz %}
