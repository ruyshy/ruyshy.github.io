---
title: "OpenGL puzzle pang"
date: 2026-03-19
tags: [OpenGL, Game, 애니팡]
---

# OpenGL로 애니팡 스타일 퍼즐 게임 만들기

처음 이 프로젝트를 시작했을 때 목표는 단순했다.  
`애니팡`처럼 누구나 바로 이해할 수 있는 3매치 퍼즐 게임을 직접 만들어보는 것이었다.

하지만 실제로 구현을 진행해보니, 퍼즐 게임은 겉보기보다 훨씬 많은 시스템이 맞물려 있었다.

- 클릭 입력 해석
- 인접 타일 스왑
- 매치 탐지
- 연쇄 제거
- 낙하와 리필
- 점수, 콤보, 제한 시간
- 특수 블록 생성
- 특수 블록 조합
- 애니메이션과 이펙트
- 유지보수 가능한 코드 구조

이번 글에서는 단순히 “무엇을 만들었다”보다, **이 프로젝트를 어떤 순서로 확장했고, 어떤 기준으로 구조를 분리했는지**를 기술적인 관점에서 정리해보려고 한다.

---

## 프로젝트 목표

이번 프로젝트의 목표는 크게 두 가지였다.

첫 번째는 **실제로 플레이 가능한 퍼즐 게임을 만드는 것**이었다.  
보드가 화면에 나오고, 타일을 선택해서 교환하고, 3개 이상 맞으면 제거되고, 연쇄가 이어지고, 점수가 오르는 흐름이 자연스럽게 연결되어야 했다.

두 번째는 **기능이 늘어나도 버티는 구조를 만드는 것**이었다.  
퍼즐 게임은 초반에는 단순해 보이지만, 특수 블록과 조합 규칙이 붙기 시작하면 로직이 빠르게 비대해진다. 그래서 기능을 추가할 때마다 “이 책임은 어디에 있어야 가장 읽기 쉬울까?”를 계속 고민하면서 리팩터링을 병행했다.

조금 더 기술적으로 말하면, 이번 프로젝트에서 중요하게 본 기준은 다음과 같았다.

- 입력 처리와 게임 규칙 계산을 분리할 것
- 렌더링과 상태 전이를 분리할 것
- 특수 블록 조합처럼 복잡도가 빠르게 커지는 규칙은 별도 레이어로 분리할 것
- `PuzzleBoard` 는 계산 엔진이 아니라 오케스트레이터에 가깝게 유지할 것

---

## 1. 가장 먼저 만든 것: 8x8 보드와 스왑

가장 먼저 구현한 것은 기본 보드와 타일 스왑이었다.

1. 8x8 보드를 만든다.
2. 마우스로 타일을 선택한다.
3. 인접한 타일과 교환한다.
4. 유효한 스왑이면 다음 단계로 넘긴다.

이 단계에서 중요한 건 “클릭을 어떻게 해석할 것인가”였다.

- 아무 것도 선택되지 않은 상태에서 클릭하면 선택
- 같은 칸을 다시 클릭하면 선택 해제
- 인접하지 않은 칸을 클릭하면 선택 변경
- 인접한 칸을 클릭하면 스왑 시도

이 해석은 현재 `PuzzleInputController.h`에 들어 있다.

```cpp
InputAction PuzzleInputController::processClick(bool hasSelection, const Cell& selectedCell, const Cell& clickedCell)
{
    if (!hasSelection)
    {
        return { InputActionType::Select, clickedCell };
    }

    if (selectedCell == clickedCell)
    {
        return { InputActionType::Deselect, clickedCell };
    }

    if (!PuzzleRuleEngine::areAdjacent(selectedCell, clickedCell))
    {
        return { InputActionType::Select, clickedCell };
    }

    return { InputActionType::Swap, clickedCell };
}
```

여기서 중요한 점은, 입력 계층은 아직 “이 스왑이 유효한가?”까지 판단하지 않는다는 것이다.  
입력 계층은 오직 사용자의 의도를 `선택`, `해제`, `스왑 시도`로 해석하는 데 집중하고, 실제 규칙 검사는 이후 `SwapResolver` 와 `PuzzleRuleEngine` 이 담당한다.

---

## 2. 퍼즐 게임의 핵심: 매치 판정과 연쇄 처리

스왑이 가능해진 뒤에는 퍼즐 게임의 핵심인 **매치 탐지와 연쇄 처리**를 구현했다.

기본 규칙은 다음과 같다.

- 가로 또는 세로로 같은 색 타일이 3개 이상 이어지면 제거
- 제거된 자리는 빈칸이 된다
- 위 타일이 아래로 낙하한다
- 빈칸은 새 타일로 채워진다
- 새로 채워진 결과에서 다시 3매치가 생기면 연쇄가 이어진다

문제는 이 흐름이 코드 상으로는 한 번의 함수 호출이 아니라는 점이었다.  
실제 한 번의 턴은 내부적으로 다음 단계를 거친다.

1. 스왑 애니메이션
2. 매치 탐지
3. 제거 연출
4. 실제 제거
5. 낙하 계산
6. 낙하 애니메이션
7. 다시 매치 탐지
8. 더 이상 연쇄가 없으면 입력 대기 상태로 복귀

이 흐름을 오케스트레이션하는 중심 클래스가 `PuzzleBoard.h` 이다.

```cpp
void PuzzleBoard::finishAnimationStep()
{
    switch (_state)
    {
    case BoardState::AnimatingSwap:
    {
        const MatchResolution resolution = !_pendingSwapResolution.cells.empty()
            ? _pendingSwapResolution
            : MatchFactory::createBoardMatch(_tiles, _swapSource, _swapTarget);

        _pendingSwapResolution = {};
        if (resolution.cells.empty())
        {
            _session.breakCombo();
            ensurePlayableBoard();
            _state = BoardStateMachine::onWaitingForInput();
            return;
        }

        beginClearAnimation(resolution);
        return;
    }
    default:
        return;
    }
}
```

이 설계에서 핵심은 “애니메이션 종료 시점이 곧 상태 전이 시점”이라는 점이었다.  
퍼즐 게임은 단순히 배열만 바꾸는 문제가 아니라, **보여주는 연출과 실제 보드 상태를 동기화해야 하는 구조**에 가깝다.  
그래서 `BoardState` 와 `BoardStateMachine.h`를 도입해, 보드가 현재 어떤 단계에 있는지 명시적으로 관리하도록 정리했다.

```cpp
BoardState BoardStateMachine::stateForSwapResult(bool validSwap)
{
    return validSwap ? BoardState::AnimatingSwap : BoardState::AnimatingInvalidSwapForward;
}
```

---

## 3. 시작 보드는 왜 따로 신경 써야 할까?

퍼즐 게임에서 의외로 중요했던 문제는 **초기 보드 품질**이었다.

그냥 무작위로 타일을 채우면 다음 두 가지 문제가 바로 생긴다.

- 게임 시작과 동시에 자동으로 매치가 터진다
- 플레이어가 둘 수 있는 수가 없는 보드가 나온다

그래서 초기 보드는 다음 조건을 만족하도록 만들었다.

- 시작 직후 3매치가 없어야 함
- 적어도 한 개 이상의 가능한 이동이 있어야 함

초기 타일 생성은 `PuzzleRuleEngine.cpp` 의 `generateTileForPosition` 에서 처리한다.

```cpp
Tile PuzzleRuleEngine::generateTileForPosition(const PuzzleGrid& tiles, int row, int column, mt19937& rng)
{
    vector<int> candidates;

    for (int color = 0; color < PuzzleTileTypeCount; ++color)
    {
        const bool createsHorizontalMatch = column >= 2
            && tiles[row][column - 1].color == color
            && tiles[row][column - 2].color == color;

        const bool createsVerticalMatch = row >= 2
            && tiles[row - 1][column].color == color
            && tiles[row - 2][column].color == color;

        if (!createsHorizontalMatch && !createsVerticalMatch)
        {
            candidates.push_back(color);
        }
    }

    uniform_int_distribution<int> distribution(0, static_cast<int>(candidates.size()) - 1);
    return { candidates[distribution(rng)], SpecialType::None };
}
```

플레이 도중 가능한 이동이 사라진 경우에는 `ShuffleResolver.h` 를 통해 셔플로 다시 살아있는 보드를 만든다.

이 부분을 따로 분리한 이유는 단순했다.  
초기 생성, 리필, 셔플 가능 여부 판정은 모두 “새 타일을 어떻게 공급할 것인가”에 대한 문제이기 때문이다.  
그래서 나중에는 `SpawnResolver.h` 와 `ShuffleResolver` 로 책임을 분리해 보드 클래스가 직접 무작위 생성 세부사항을 들고 있지 않도록 정리했다.

---

## 4. 점수, 콤보, 제한 시간 추가

기본 3매치만 구현했을 때는 게임이 동작하기는 했지만, 아직 “퍼즐 게임답다”는 느낌은 약했다.  
그래서 그 다음 단계로 점수, 콤보, 제한 시간을 추가했다.

현재 한 판의 상태는 `GameSession.h` 에서 관리한다.

- 현재 점수
- 현재 콤보
- 남은 시간
- 게임오버 상태

```cpp
void GameSession::registerClear(int clearedCount, int spawnCount)
{
    _combo += 1;
    const int comboMultiplier = std::max(1, _combo);
    _score += clearedCount * 10 * comboMultiplier;
    _score += spawnCount * 40;
    _timeRemaining = std::min(PuzzleRoundTimeSeconds, _timeRemaining + (0.6f * static_cast<float>(comboMultiplier)));
}
```

점수 시스템에서 중요했던 건 단순한 숫자 증가보다 **플레이 리듬과 피드백**이었다.  
연쇄가 이어질수록 콤보가 오르고, 그 결과 시간이 조금 회복되게 만들면 플레이어는 “잘 풀고 있다”는 감각을 더 직접적으로 느끼게 된다.

또 하나 중요했던 점은, 점수 정책을 보드 로직과 분리했다는 것이다.  
보드 로직은 “무슨 일이 일어났는가”를 계산하고, `GameSession` 은 “그 결과를 점수와 시간 관점에서 어떻게 해석할 것인가”를 담당한다.  
이렇게 나누니 이후 점수 정책을 바꾸더라도 매치 로직을 건드릴 필요가 없어졌다.

---

## 5. 손맛을 만드는 요소: 애니메이션과 이펙트

퍼즐 게임은 규칙만 맞다고 재미있어지지 않는다.  
특히 스왑, 제거, 낙하처럼 반복되는 행동은 애니메이션의 품질이 체감 재미를 크게 좌우한다.

현재 프로젝트에는 다음 연출이 들어 있다.

- 성공 스왑 애니메이션
- 실패 스왑 복귀 애니메이션
- 제거 플래시
- 낙하 애니메이션
- 특수 블록 버스트 이펙트
- 게임오버 오버레이

애니메이션 상태는 `BoardAnimator.h`,  
버스트 생성은 `SpecialEffectSystem.h`,  
실제 드로우는 `PuzzleRenderer.h` 가 맡고 있다.

예를 들어 `PuzzleRenderer` 는 정적 타일과 애니메이션 중인 타일이 겹쳐 보이지 않도록, 애니메이션 목적지와 겹치는 정적 셀을 숨긴다.

```cpp
bool PuzzleRenderer::isCellHiddenByAnimation(const vector<TileAnimation>& animations, int row, int column) const
{
    const Cell cell{ column, row };
    const vec2 position = getCellPosition(cell);

    for (const TileAnimation& animation : animations)
    {
        if (distance(animation.end, position) < 0.01f)
        {
            return true;
        }
    }

    return false;
}
```

렌더링 계층을 따로 둔 이유도 분명했다.  
초기에 `PuzzleBoard` 안에서 좌표 계산과 드로우 호출을 같이 처리하면 빠르게 만들 수는 있지만, 나중에는 셀 크기 계산, 보드 위치 조정, 특수 블록 마커 렌더링, 애니메이션 보간이 모두 뒤섞이게 된다.  
그래서 현재는 렌더링 책임을 `PuzzleRenderer` 로 모아, 보드 클래스가 표현 계층 세부사항을 직접 알지 않도록 정리했다.

---

## 6. 특수 블록을 넣으면서 게임이 확 달라졌다

기본 3매치만으로는 금방 단조로워지기 때문에, 게임성을 확장하기 위해 특수 블록을 추가했다.

현재 구현된 특수 블록은 다음과 같다.

- `4개 직선 매치` -> `RowClear`
- `T/L 형태 매치` -> `Bomb`
- `5개 직선 매치` -> `ColorBomb`

이 규칙은 `PuzzleRuleEngine::findMatches` 안에서 처리된다.

```cpp
if (hasCross)
{
    resolution.spawns.push_back({ anchor, Tile{ color, SpecialType::Bomb } });
}
else if (hasLengthFive)
{
    resolution.spawns.push_back({ anchor, Tile{ color, SpecialType::ColorBomb } });
}
else if (hasLengthFour)
{
    resolution.spawns.push_back({ anchor, Tile{ color, SpecialType::RowClear } });
}
```

이 시점부터 `findMatches` 는 단순히 “같은 색 3개를 찾는 함수”가 아니게 되었다.  
가로/세로 연속 길이를 기록하고, 연결된 컴포넌트를 묶고, 매치 형태를 해석하고, 어떤 칸에 어떤 특수 블록을 생성할지까지 결정해야 했다.

특히 T/L 형태 판정은 가로 길이와 세로 길이를 각각 기록한 뒤, 같은 컴포넌트 안에서 둘 다 3 이상인 교차점이 있는지를 보는 방식으로 처리했다.

```cpp
if (horizontalLen[cell.row][cell.column] >= 3 && verticalLen[cell.row][cell.column] >= 3)
{
    hasCross = true;
    anchor = cell;
    break;
}
```

특수 블록이 들어간 뒤부터는 플레이 감각도 확 달라졌다.  
이전에는 “3개를 맞춘다”가 중심이었다면, 이후에는 “어떻게 특수 블록을 만들고, 그걸 어떤 위치에서 터뜨릴까?”가 플레이의 핵심이 되었다.

---

## 7. 가장 재미있었던 확장: 특수 블록 조합

프로젝트를 진행하면서 가장 재미있었던 부분은 **특수 블록 조합 시스템**이었다.

현재 구현된 조합은 다음과 같다.

- `줄 제거 + 폭탄` = 십자 대폭발
- `줄 제거 + 줄 제거` = 이중 가로/세로 정리
- `폭탄 + 폭탄` = `5x5` 대폭발
- `폭탄 + 일반 블록` = 해당 색 전체 제거
- `줄 제거 + 일반 블록` = 해당 색 전체를 줄 제거처럼 발동
- `컬러 폭탄 + 일반 블록` = 해당 색 전체 제거
- `컬러 폭탄 + 줄 제거 블록` = 해당 색 전체를 줄 제거처럼 발동
- `컬러 폭탄 + 폭탄` = 해당 색 전체를 폭탄처럼 발동
- `컬러 폭탄 + 컬러 폭탄` = 보드 전체 제거

이 조합은 일반 3매치와 계산 출발점부터 다르다.

- 일반 매치는 보드 전체를 스캔해서 결과를 찾는다
- 특수 조합은 스왑한 두 칸의 타입 조합만으로 결과가 즉시 결정된다

그래서 현재는 `SpecialComboResolver.h` 와 `MatchFactory.h` 로 일반 매치와 특수 조합 매치를 분리해두었다.

```cpp
MatchResolution MatchFactory::createSpecialSwapMatch(const PuzzleGrid& tiles, const Cell& first, const Cell& second)
{
    return SpecialComboResolver::resolveSwap(tiles, first, second);
}
```

이 선택은 구조적으로도 꽤 중요했다.  
조합 규칙을 일반 매치 안에 섞으면 조건문이 빠르게 비대해지고, 어느 순간부터는 규칙 추가가 아니라 “분기 수습”이 된다.  
특수 조합을 별도 파이프라인으로 분리한 뒤에는 새 조합을 넣을 때 수정 범위가 훨씬 예측 가능해졌다.

---

## 8. 코드가 커지면서 가장 중요했던 일: 역할 분리

처음에는 `PuzzleBoard` 하나에 거의 모든 기능이 들어 있었다.  
하지만 기능이 늘어날수록 다음 문제가 생겼다.

- 파일이 너무 커진다
- 입력, 규칙, 세션, 렌더링, 이펙트가 한곳에 섞인다
- 수정해야 할 위치를 찾기 어렵다
- 기능 하나를 고치다가 다른 기능을 깨뜨릴 가능성이 커진다

그래서 중간부터는 기능 추가와 병행해서 클래스를 계속 분리했다.

현재 구조는 대략 이렇게 정리되어 있다.

### 퍼즐 코어

- `PuzzleBoard.h`
- `PuzzleTypes.h`

### 규칙 계산

- `PuzzleRuleEngine.h`

### 턴 파이프라인

- `PuzzleInputController.h`
- `SwapResolver.h`
- `CascadeResolver.h`
- `SpecialComboResolver.h`
- `BoardStateMachine.h`
- `MatchFactory.h`
- `SpawnResolver.h`
- `ShuffleResolver.h`

### 판 상태와 표현 계층

- `GameSession.h`
- `BoardAnimator.h`
- `SpecialEffectSystem.h`
- `PuzzleRenderer.h`

조금 더 요약하면 최종 구조는 다음 방향을 목표로 했다.

- `PuzzleBoard`: 턴 흐름 제어
- `PuzzleRuleEngine`: 순수 규칙 계산
- `Resolver` 계열: 턴 파이프라인 세분화
- `GameSession`: 판 단위 진행 상태
- `BoardAnimator` / `PuzzleRenderer`: 표현 계층

이렇게 정리하고 나니 `PuzzleBoard` 는 더 이상 거대한 만능 클래스가 아니라, “누가 무엇을 해야 하는지 연결하는 오케스트레이터”에 가까워졌다.  
개인적으로는 이 단계가 프로젝트 완성도를 가장 크게 끌어올린 전환점이었다.

---

## 9. Visual Studio 솔루션 탐색기도 같이 정리했다

코드 구조를 분리한 뒤에는 Visual Studio 솔루션 탐색기에서도 보기 좋게 정리했다.  
실제 디스크 폴더를 옮긴 것은 아니고, `.vcxproj.filters` 를 이용해 가상 폴더만 재구성했다.

현재는 대략 다음처럼 나뉘어 있다.

- `App`
- `App\Window`
- `Puzzle\Core`
- `Puzzle\Rules`
- `Puzzle\Flow`
- `Puzzle\Presentation`
- `Puzzle\Systems`
- `OpenGL\Rendering`
- `OpenGL\Resources`
- `Support\Utilities`
- `Support\ThirdParty`

실제 디스크 구조를 건드리지 않고도, 솔루션 탐색기 기준으로는 훨씬 덜 지저분하게 보이도록 정리할 수 있었다.

---

## 10. 개발하면서 느낀 점

이번 프로젝트를 진행하면서 특히 크게 느낀 점은 세 가지였다.

### 1. 처음부터 완벽한 구조를 만들 필요는 없다

초반에는 빠르게 만들고, 기능이 실제로 커졌을 때 구조를 다시 나누는 편이 훨씬 효율적이었다.  
실제로 어떤 책임이 문제를 만들고 있는지는 코드가 어느 정도 자란 뒤에 더 잘 보인다.

### 2. 퍼즐 게임은 상태 전이가 정말 중요하다

퍼즐 게임은 단순해 보여도 내부적으로는 계속 상태가 바뀐다.

- 입력 대기
- 스왑 중
- 제거 중
- 낙하 중
- 연쇄 확인 중
- 게임오버

결국 이 장르는 “타일을 어떻게 그릴까?”보다도 **지금 보드가 어떤 상태이고, 다음 상태로 어떻게 넘어갈까?**를 명확히 관리하는 것이 핵심이었다.

이 점은 디버깅할 때 특히 큰 차이를 만들었다.  
예를 들어 “특정 상황에서 연쇄가 한 번 덜 터진다” 같은 문제는 배열 값만 봐서는 원인을 찾기 어렵다.  
대신 현재 상태가 `AnimatingClear` 였는지, `AnimatingFall` 에서 입력 대기로 너무 빨리 넘어갔는지처럼 상태 전이 관점에서 보면 훨씬 빨리 원인을 좁힐 수 있었다.

### 3. 특수 규칙은 반드시 분리하는 편이 좋다

특수 블록 조합을 일반 매치 규칙과 섞어버리면 조건문이 금방 감당하기 어려워진다.  
이번 프로젝트에서는 특수 조합을 별도 레이어로 분리한 것이 전체 구조를 안정시키는 데 큰 도움이 됐다.

---

## 11. 다음에 더 해보고 싶은 것들

현재도 충분히 플레이 가능한 상태지만, 더 다듬고 싶은 부분은 남아 있다.

- 사운드 효과 추가
- 콤보 텍스트 팝업
- 목표 점수 / 스테이지 구조
- 남은 시간 보너스
- 셔플 연출 강화
- 더 다양한 특수 블록
- 모바일 입력 대응

특히 다음 단계에서는 단순한 기능 추가보다, **연출 완성도와 피드백 강화**에 더 집중하면 게임 느낌이 한층 더 살아날 것 같다.

기술적으로는 다음 두 방향이 특히 재미있을 것 같다.

- `ComboSystem` 을 실제 점수 정책 계산에 적극 연결하기
- 특수 블록 조합을 데이터 기반으로 옮겨서 규칙 추가 비용 줄이기

---

## 마무리

이번 프로젝트는 단순한 퍼즐 게임 구현이면서도, 동시에 **작은 프로토타입이 기능 추가와 구조 분리를 거치며 어떻게 점점 게임다운 형태로 변해가는지**를 보여주는 과정이기도 했다.

처음엔 8x8 보드와 간단한 3매치만 있었지만, 지금은 다음 요소들이 모두 들어간 상태가 되었다.

- 기본 퍼즐 플레이
- 연쇄 제거
- 점수 / 콤보 / 제한 시간
- 특수 블록
- 특수 블록 조합
- 애니메이션과 이펙트
- 모듈화된 코드 구조

무엇보다도 가장 크게 느낀 건, **일단 돌아가게 만든 뒤 그다음에 구조를 다듬는 과정이 정말 중요하다**는 점이었다.  
게임 로직은 기능이 늘어날수록 복잡도가 빠르게 올라가기 때문에, 중간중간 리팩터링을 통해 책임을 정리해두는 것이 결국 프로젝트 전체의 완성도를 결정한다.

같은 흐름으로 다음에는 더 큰 퍼즐 시스템이나, 다른 장르의 게임도 충분히 확장해볼 수 있을 것 같다.

---

## 부록: 핵심 코드 위치

기술 블로그 형태로 읽는 사람을 위해, 실제 핵심 코드가 들어 있는 파일도 마지막에 정리해둔다.

- 보드 파이프라인 오케스트레이션: `PuzzleBoard.cpp`
- 타입 정의: `PuzzleTypes.h`
- 규칙 계산: `PuzzleRuleEngine.cpp`
- 입력 해석: `PuzzleInputController.cpp`
- 스왑 처리: `SwapResolver.cpp`
- 연쇄 탐지/낙하: `CascadeResolver.cpp`
- 특수 조합: `SpecialComboResolver.cpp`
- 렌더링: `PuzzleRenderer.cpp`
- 애니메이션 상태: `BoardAnimator.cpp`
- 세션 상태: `GameSession.cpp`
