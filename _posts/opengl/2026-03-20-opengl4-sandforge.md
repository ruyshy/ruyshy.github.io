---
title: "OpenGL SandForge"
date: 2026-03-19
tags: [OpenGL, Game, RTS]
---

# OpenGL RTS 프로토타입에 멀티플레이 로비와 권한형 동기화 붙이기

> 프로젝트는 아래에 링크했습니다.
>
>[sandforge project](https://github.com/ruyshy/OpenGL-Game/tree/Sandforge)
>


## TL;DR

이 글은 `Project Sandforge` 프로토타입에 멀티플레이를 붙이면서 정리한 설계와 구현 기록이다.  
핵심은 세 가지였다.

- 로비를 별도 씬으로 분리해서 접속, 준비, 시작 설정을 관리하기
- 호스트 authoritative 구조로 월드 상태를 단일 기준으로 유지하기
- 클라이언트는 입력을 명령으로 보내고, 결과는 스냅샷으로 복제받기

이 과정을 통해 "두 창에서 비슷하게 보이는 상태"가 아니라, 실제로 플레이 가능한 멀티플레이 프로토타입에 가까운 구조를 만들 수 있었다.

## 목차

1. [프로젝트 배경](#프로젝트-배경)
2. [문제 정의](#문제-정의)
3. [전체 구조](#전체-구조)
4. [로비를 별도 씬으로 분리한 이유](#로비를-별도-씬으로-분리한-이유)
5. [패킷 설계와 세션 관리](#패킷-설계와-세션-관리)
6. [왜 authoritative host 구조를 택했는가](#왜-authoritative-host-구조를-택했는가)
7. [게임플레이 동기화 방식](#게임플레이-동기화-방식)
8. [로비 설정을 실제 게임 시작에 반영하기](#로비-설정을-실제-게임-시작에-반영하기)
9. [플레이어 2 관점에서 드러난 문제들](#플레이어-2-관점에서-드러난-문제들)
10. [UI에서 가장 많이 배운 점](#ui에서-가장-많이-배운-점)
11. [핵심 코드 예시](#핵심-코드-예시)
12. [현재 구조의 장점과 한계](#현재-구조의-장점과-한계)
13. [마무리](#마무리)

## 프로젝트 배경

`Project Sandforge`는 C++20, OpenGL, GLFW, FreeType 기반으로 만든 2D RTS 프로토타입이다.  
처음에는 싱글플레이 MVP, HUD 프로토타이핑, 생산/전투/자원 채집 루프를 빠르게 확인하는 데 집중했다.

하지만 프로젝트가 커질수록 자연스럽게 다음 요구가 생겼다.

- 메인 메뉴에서 멀티플레이를 선택할 수 있어야 한다.
- 호스트와 클라이언트가 로컬 환경에서 접속할 수 있어야 한다.
- 로비에서 닉네임, 주소, 포트, 시작 설정을 조절할 수 있어야 한다.
- 실제 게임에서는 플레이어 1과 플레이어 2가 각자 자기 진영 기준으로 플레이해야 한다.

여기서부터는 "기능 추가"가 아니라 "게임 상태를 누가 결정하는가"를 다시 설계하는 작업이 시작됐다.

## 문제 정의

싱글플레이 구조에서는 `GameplayState`가 입력을 받아 곧바로 `SandforgeWorld`를 바꾸는 방식이 큰 문제가 되지 않았다.  
하지만 멀티플레이를 붙이는 순간 이 구조는 바로 한계를 드러냈다.

예를 들어 클라이언트가 아래 동작을 로컬에서 직접 처리하면 상태가 쉽게 어긋난다.

- 유닛 생산
- 워커 자원 배정
- 건물 건설
- 유닛 이동
- 생산 취소

결국 필요한 건 단순한 네트워크 연결이 아니라, 다음 질문에 대한 답이었다.

- 누가 진짜 월드 상태를 결정하는가?
- 누가 보여주기만 하는가?
- 어떤 데이터는 명령으로 보내고, 어떤 데이터는 스냅샷으로 복제할 것인가?

## 전체 구조

현재 멀티플레이 관련 핵심 파일은 아래와 같다.

- `OpenGLGame/Network/SandforgePacketTypes.h`
- `OpenGLGame/Network/SandforgePacketBuffer.h`
- `OpenGLGame/Network/SandforgePacketBuffer.cpp`
- `OpenGLGame/Network/SandforgeMultiplayerSession.h`
- `OpenGLGame/Network/SandforgeMultiplayerSession.cpp`
- `OpenGLGame/Scenes/MultiplayerLobbyScene.h`
- `OpenGLGame/Scenes/MultiplayerLobbyScene.cpp`
- `OpenGLGame/Scenes/GameplayScene.cpp`
- `OpenGLGame/Scenes/GameplayState.cpp`
- `OpenGLGame/World/SandforgeWorld.h`
- `OpenGLGame/World/SandforgeWorld.cpp`

구조를 짧게 요약하면 이렇다.

```text
TitleScene
  -> MultiplayerLobbyScene
      -> SandforgeMultiplayerSession
          -> Host authoritative world
          -> Client command sender
          -> Snapshot replication
```

조금 더 자세히 보면:

- 로비에서는 세션 생성, 접속, 준비, 시작 설정을 처리한다.
- 실제 게임에서는 호스트가 월드를 업데이트한다.
- 클라이언트는 입력을 명령 패킷으로 전송한다.
- 호스트는 명령을 적용한 뒤 스냅샷을 보낸다.
- 클라이언트는 최신 스냅샷을 받아 렌더링한다.

## 로비를 별도 씬으로 분리한 이유

처음에는 멀티플레이 버튼을 눌렀을 때 "미구현" 문구만 띄우는 상태였다.  
하지만 로비 단계에서 관리해야 할 정보가 생각보다 많았다.

- 호스트 / 클라이언트 역할
- 닉네임
- 접속 주소
- 포트
- 준비 상태
- 시작 프리셋
- 최종 시작 여부

이걸 타이틀 화면 오버레이로 처리하면 UI가 금방 복잡해진다.  
그래서 `MultiplayerLobbyScene`을 별도 씬으로 분리했다.

현재 로비에서 다루는 항목은 다음과 같다.

- `Host Local Session`
- `Name`
- `Address`
- `Port`
- `Resources`
- `Workers`
- `Start Match`
- `Join Session`
- `Toggle Ready`
- `Back To Title`

특히 `Resources`, `Workers`, `Start Match`는 호스트 전용 기능으로 두고, 클라이언트에서는 시각적으로 비활성처럼 보이게 만들었다.  
이런 사소한 차이가 실제 사용성에 큰 영향을 줬다.

## 패킷 설계와 세션 관리

패킷 종류를 먼저 분리해둔 것이 전체 구조를 단순하게 만드는 데 큰 도움이 됐다.

현재 대표 패킷은 다음과 같다.

```cpp
enum class SandforgePacketType : uint16_t
{
    C2S_JoinRequest = 1,
    S2C_JoinAccept = 2,
    S2C_MatchStart = 3,
    C2S_Ready = 4,
    C2S_Ping = 5,
    S2C_Pong = 6,
    S2C_WorldSnapshot = 7,
    C2S_ProduceCommand = 8,
    C2S_AssignWorkerCommand = 9,
    C2S_MoveUnitCommand = 10,
    C2S_BuildCommand = 11,
    C2S_CancelProduction = 12,
    S2C_LobbySettings = 13
};
```

여기서 중요한 구분은 아래 두 가지다.

### 1. 로비 단계

- 이름
- 준비 상태
- 시작 프리셋
- 게임 시작 신호

즉, 로비에서는 상태 동기화가 중심이다.

### 2. 실제 게임 단계

- 생산 명령
- 워커 배정
- 이동 명령
- 건설 명령
- 생산 취소
- 월드 스냅샷

즉, 인게임에서는 "명령 전송 + 결과 스냅샷 복제"가 중심이다.

## 왜 authoritative host 구조를 택했는가

멀티플레이를 붙일 때 가장 먼저 정해야 했던 것은 권한 구조였다.

이번 프로젝트에서는 host authoritative 구조를 선택했다.

### 호스트의 책임

- 월드 업데이트
- 명령 수신
- 명령 유효성 검사
- 실제 상태 변경
- 스냅샷 송신

### 클라이언트의 책임

- 입력 감지
- 명령 송신
- 최신 스냅샷 수신
- 복제 월드 갱신
- 렌더링

이 구조를 택한 이유는 단순하다.

- 상태 기준점이 하나라서 디버깅이 쉽다.
- 치트나 로컬 오차에 덜 취약하다.
- 기존 싱글플레이 월드 로직을 호스트 쪽으로 거의 그대로 재사용할 수 있다.

## 게임플레이 동기화 방식

현재 동기화 방식은 "클라이언트가 명령을 보내고, 호스트가 적용한 뒤 스냅샷을 보내는 구조"다.

예를 들어 유닛 생산은 대략 이런 흐름이다.

```text
Client input
  -> C2S_ProduceCommand
      -> Host receives command
          -> Host updates SandforgeWorld
              -> Host sends S2C_WorldSnapshot
                  -> Client applies snapshot
```

이 방식은 예측이나 보간이 거의 없기 때문에 아주 고급스럽진 않다.  
하지만 프로토타입 단계에서는 "상태가 틀어지지 않는 것"이 더 중요했고, 이 목표에는 잘 맞았다.

## 로비 설정을 실제 게임 시작에 반영하기

로비 설정이 화면에만 있고 실제 게임에 반영되지 않으면, 결국 가짜 옵션이 된다.  
그래서 `SandforgeWorld`에 아래 구조를 추가했다.

```cpp
struct SandforgeMatchSetup
{
    bool symmetricPlayers = false;
    bool aiEnabled = true;
    SandforgeStartResourcePreset resourcePreset = SandforgeStartResourcePreset::Standard;
    SandforgeStartWorkerPreset workerPreset = SandforgeStartWorkerPreset::Standard;
};
```

멀티플레이 시작 시에는 이 값을 `GameplayScene` 진입 전에 주입하고, `reset()`에서 실제 초기 자원과 시작 워커 수를 계산하도록 연결했다.

현재 의미는 다음과 같다.

- `Resources: Standard`
  - 기본 시작 자원
- `Resources: Rich`
  - 양쪽 시작 자원 증가
- `Workers: Standard`
  - 기본 시작 일꾼 수
- `Workers: Expanded`
  - 양쪽 시작 일꾼 1기 추가

싱글플레이에서 쓰던 비대칭 보정은 멀티플레이에서는 끄고, 대칭 시작 조건으로 바꿨다.

## 플레이어 2 관점에서 드러난 문제들

멀티플레이에서 가장 많이 틀어졌던 부분은 사실 네트워크보다 "플레이어 2 기준 로직"이었다.

대표적으로 이런 문제가 있었다.

- 플레이어 2로 들어가도 카메라가 항상 플레이어 1 진영부터 보임
- 선택/소유권 판정이 플레이어 1 기준으로 남아 있음
- HUD와 명령 처리 일부가 플레이어 1 가정으로 작성되어 있음

이를 해결하기 위해:

- `localPlayerId` 개념을 `GameplayState`에 도입
- 선택/렌더링/UI 판정에서 하드코딩된 `1` 제거
- 카메라 시작 위치를 로컬 플레이어 HQ 기준으로 설정

이 마지막 수정은 의외로 체감이 컸다.  
플레이어 2도 이제 게임 시작 시 자기 기지부터 보게 된다.

## UI에서 가장 많이 배운 점

로비를 계속 확장하다 보니, 기능은 늘었는데 화면은 오히려 더 나빠지는 구간이 반복됐다.

실제로 겪었던 문제는 다음과 같다.

- 상태 텍스트가 버튼 구역과 겹침
- 하단 긴 상태 문구가 한 줄로 밀려 화면을 가로질러 튀어나감
- 클라이언트가 건드릴 수 없는 항목도 똑같이 보여 혼란스러움

이 문제를 해결한 방법은 꽤 기본적이었다.

- 패널을 더 크게 잡고 여백 확보
- 상태 텍스트 영역과 버튼 영역 분리
- 긴 문구 자동 줄바꿈
- 호스트 전용 항목 비활성 표현
- 준비/연결/시작 가능 상태를 색으로 구분

결국 UI는 정보의 양보다 "읽히는가"가 더 중요했다.

## 핵심 코드 예시

### 1. 호스트만 명시적으로 경기 시작

자동 시작 대신 호스트가 `Start Match`를 눌렀을 때만 시작하도록 바꿨다.

```cpp
bool SandforgeMultiplayerSession::tryStartMatch()
{
    if (_lobbyState.mode != SandforgeMultiplayerMode::Host)
    {
        _lobbyState.statusText = "Only the host can start the match.";
        return false;
    }
    if (!_lobbyState.remoteConnected)
    {
        _lobbyState.statusText = "A remote player must join before starting.";
        return false;
    }
    if (!_lobbyState.localReady || !_lobbyState.remoteReady)
    {
        _lobbyState.statusText = "Both players must be ready before the match can start.";
        return false;
    }

    sendMatchStartPacket();
    _lobbyState.matchStartReceived = true;
    _lobbyState.statusText = "Host started the match.";
    return true;
}
```

### 2. 로컬 플레이어 HQ 기준 카메라 시작

플레이어 2가 자기 기지를 보지 못하던 문제를 여기서 해결했다.

```cpp
const float viewWidth = static_cast<float>(window.getScreenWidth());
const float maxCameraX = (std::max)(0.0f, kGameplayWorldWidth - viewWidth);
if (const SandforgeBuilding* localHq = _state.getWorld().findPrimaryBuilding(_state.getLocalPlayerId(), SandforgeBuildingType::HQ))
{
    _cameraX = glm::clamp(localHq->position.x - (viewWidth * 0.5f), 0.0f, maxCameraX);
}
```

### 3. 클라이언트는 명령만 보내고 월드는 호스트가 반영

```cpp
if (isRemoteClientControlled())
{
    _multiplayerSession->sendMoveUnitCommand(unitId, position);
    _statusText = "Move command sent to host.";
    return true;
}

return _world.moveUnitTo(_localPlayerId, unitId, position);
```

## 현재 구조의 장점과 한계

### 장점

- 싱글플레이 월드 로직을 크게 버리지 않았다.
- 책임 분리가 비교적 명확하다.
- 디버깅 기준점이 호스트 하나로 모인다.
- 로비 설정과 실제 게임 시작 조건이 연결되어 있다.

### 한계

- 스냅샷 기반이라 전송량 최적화가 아직 부족하다.
- 보간이나 예측이 거의 없어 고급 네트워크 감각은 약하다.
- 핑, 재접속, 리매치 흐름은 아직 미완성이다.
- 입력 필드가 아직 "게임용 폼 UI"로 완전 정교하진 않다.

## 마무리

이번 작업에서 가장 크게 느낀 점은, 멀티플레이는 단순히 소켓을 여는 일이 아니라 "게임의 책임 구조를 다시 나누는 일"이라는 것이다.

싱글플레이에서는 입력과 상태 변경이 가까이 있어도 큰 문제가 없어 보인다.  
하지만 멀티플레이를 붙이는 순간 바로 질문이 생긴다.

- 누가 상태를 결정하는가
- 누가 보여주기만 하는가
- 어떤 정보가 즉시 반영되고 어떤 정보가 동기화되어야 하는가

이 질문들에 답하면서 로비, 패킷, 세션, 명령, 스냅샷, UI를 한 번씩 다시 설계하게 됐다.  
그 과정 자체가 멀티플레이 구현의 본질에 더 가까웠다.
