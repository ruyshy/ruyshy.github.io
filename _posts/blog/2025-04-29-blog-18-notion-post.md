---
title: "GitHub Blog에 Notion으로 글 작성하고 업로드하는 방법"
description: "Notion에서 Markdown 파일로 내보내기한 후, GitHub 블로그에 포스트로 등록하는 전체 과정을 설명합니다. Front Matter 설정, 마크다운 내보내기, 포스트 업로드까지 단계별로 다룹니다."
date: 2025-04-29
tags: [GitHubBlog, Notion, markdown, Jekyll, 블로그 포스트 작성, 마크다운 변환, front-matter]
---

GitHub Blog에 글을 올릴 때 Notion을 활용하고 싶다면 이 포스트를 참고하세요. **Notion Markdown 내보내기**, **Front Matter 설정**, **GitHub 블로그 포스트 등록**까지 전체 과정을 쉽게 설명합니다.


## GitHub Blog post Notion으로 작성

저는 notion 에서 문서를 작성한 뒤, 블로그에 옮기는 작업을 진행하여 글을 써왔습니다.

{% img "GitHub-Blog-Notion-Post1.png","GitHub-Blog-Notion-Post1" %}

과정:

```mathematica
Notion 작성 → Markdown 내보내기 → Front Matter 추가 → _posts에 넣기 → Push
```

이번 게시글에서 알아볼 내용

- Front Matter
- Notion → Markdown 내보내기

## Front Matter

**Front Matter**는 **Markdown 파일 맨 위**에 적는 **"메타데이터 영역"** 

Jekyll이나 Hugo 같은 정적 사이트 생성기(SSG)는 **Markdown 파일을 그냥 읽는 게 아니라**,이 Front Matter를 먼저 읽고 **글의 정보(제목, 날짜, 카테고리, 레이아웃 등)를 파악**

여태 익숙하게 사용했었지만, 좀 자세히 알아보는 시간을 가져볼까 합니다.

 

```markdown
---
title: "글 제목"
date: 2025-04-29
categories: [blog]
tags: [notion, markdown]
layout: post
---
```

- `---` 로 시작하고, `---` 로 끝남.
- 그 사이에 **키: 값** 형태로 메타데이터를 적음.
- **YAML 문법**을 사용함.

### 주요 속성 설명

| 항목 | 설명 | 예시 |
| --- | --- | --- |
| `title` | 글 제목 | `"Notion으로 GitHub Blog 쓰기"` |
| `date` | 글 작성/게시 날짜 (yyyy-mm-dd 형식) | `2025-04-29` |
| `categories` | 글이 속할 카테고리 (폴더처럼) | `[blog]` |
| `tags` | 글에 달 태그들 (검색, 분류 용도) | `[notion, markdown]` |
| `layout` | 사용할 레이아웃(보통 `post` 또는 `single`) | `post` |
| `author` | 작성자 이름 (설정해놓은 경우) | `ruyshy2` |
| `toc` | 글에 목차(Table of Contents)를 넣을지 | `true` |
| `comments` | 댓글 기능 켤지 | `true` |

### Front Matter 요약

- Front Matter = **글 정보**를 알려주는 영역
- 반드시 맨 위에 `---`로 감싸서 작성
- Jekyll 같은 시스템이 글을 정리하는 데 필수

## Notion → Markdown 생성 방법

{% img "GitHub-Blog-Notion-Post2.png", "GitHub-Blog-Notion-Post2" %}

Notion 오른쪽 상단 위에 보면 공유와 여러 아이콘이 있는데 … 아이콘을 클릭합니다.

아래에 여러 메뉴들이 줄줄이 나오는데 내보내기를 클릭하여 파일을 저장합니다.

아마 이미지를 포함한 압축 파일로 저장되며, GitHub에 옮기는 작업은 수동으로 진행합니다..

.md 파일을 드래그하여 옮기고, assets/images/blog/게시글파일이름 경로 생성 후, 이미지를 옮기고
markdown형식에서 liquid tag으로 바꾼 뒤, image를 불러오는 작업으로 변환해줍니다.

예시:

markdown:
```markdown
![GitHub-Blog-Notion-Post.png](GitHub-Blog-Notion-Post.png)
```

에서

liquid:
```markdown
{% raw %}{% img "GitHub-Blog-Notion-Post.png","GitHub-Blog-Notion-Post" %}{% endraw %}
```

으로 변환

<br/>

### 생산성을 높이기 위한 고민

앞으로 어떻게 하면 더 효율적으로 작업할 수 있을지 여러 방면으로 고민하고 있습니다.

몇 가지 아이디어가 떠오르긴 했지만, 보다 충분한 자료를 수집하고 생각을 정리한 뒤에 방향을 확정하려 합니다.

- Notion과 GitHub를 연동하는 방법
- Notion에서 내보낸 `.md` 파일을 Python으로 변환하는 방법
- Visual Studio Code용 확장 프로그램(Extension)을 직접 제작해 활용하는 방법
- 혹은, 현재처럼 Notion의 내보내기 기능을 그대로 활용하는 방법