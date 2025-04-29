var store = [{
        "title": "Assembly",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/categories/assembly/",
        "teaser": null
      },{
        "title": "Blog",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/categories/blog/",
        "teaser": null
      },{
        "title": "category",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/categories/",
        "teaser": null
      },{
        "title": "프레젠테이션 슬라이드",
        "excerpt":"   Reveal.js 소개    Jekyll 블로그에서 슬라이드 프레젠테이션을 할 수 있어요!       두 번째 슬라이드    이 슬라이드는 마크다운이 아니라 HTML 형식이에요.       세 번째 슬라이드         왼쪽/오른쪽 키로 이동     터치도 지원     커스터마이징 가능        ","categories": [],
        "tags": [],
        "url": "/example/slide/",
        "teaser": null
      },{
        "title": "Reversing Engineering",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/categories/reversing_engineering/",
        "teaser": null
      },{
        "title": "GitHub Blog 시작하기 - Jekyll과 GitHub Pages 블로그 만들기",
        "excerpt":"GitHub Blog를 시작하려는 분들을 위한 가이드입니다. 이 글에서는 GitHub Pages, Jekyll, 그리고 인기 테마인 minimal-mistakes를 활용해 나만의 기술 블로그를 만드는 과정을 단계별로 설명합니다. Jekyll 기반 GitHub Blog 생성 https://mmistakes.github.io/minimal-mistakes/ 해당 Jekyll 테마(minimal-mistakes) 기준으로 작성 되어있습니다. 준비해야 할 준비물 개인 GitHub 계정 (https://github.com/) Visual Studio Code (https://code.visualstudio.com/) GitHub Blog 시작하기 https://github.com/mmistakes/minimal-mistakes...","categories": ["blog"],
        "tags": ["GitHub Blog","GitHub Pages","Jekyll","블로그 만들기","minimal-mistakes"],
        "url": "/blog/blog1-start/",
        "teaser": null
      },{
        "title": "GitHub Blog 로컬 서버 설정 - Jekyll 개발 환경 구축",
        "excerpt":"GitHub 블로그를 로컬에서 수정하고 테스트하려면, Jekyll 로컬 서버 설정을 통해 실시간으로 확인하는 환경이 필요합니다. 이 글에서는 Ruby, Jekyll, Bundler 설치부터 bundle exec jekyll serve 명령어로 로컬 서버를 띄우는 전체 과정을 설명합니다. 필요한 준비물 https://www.ruby-lang.org/ko/ Gemfile # Gemfile source \"https://rubygems.org\" gem \"jekyll\", \"~&gt; 4.3.2\" gem \"jekyll-paginate\" gem \"jekyll-sitemap\" gem \"jekyll-feed\" gem...","categories": ["blog"],
        "tags": ["GitHub Blog","Jekyll","로컬 서버","Ruby","bundle exec jekyll serve"],
        "url": "/blog/blog2-local-server/",
        "teaser": null
      },{
        "title": "GitHub Blog 빌드 & 릴리즈 자동화 - GitHub Actions로 Jekyll 배포하기",
        "excerpt":"GitHub 블로그를 운영하면서 자동 배포를 설정하고 싶다면, GitHub Actions를 사용한 CI/CD 환경이 필요합니다. 이 글에서는 Jekyll로 작성한 블로그를 GitHub 서버에서 자동으로 빌드하고 gh-pages 브랜치로 배포하는 워크플로우를 설정하는 방법을 정리합니다. GitHub에 Action기능 알아보기 GitHub Action 문서 : https://docs.github.com/ko/actions GitHub Actions는 CI/CD(지속적 통합/배포)를 위한 자동화된 작업(Workflow)을 만들어주는 도구입니다. 블로그 자동 배포와 코드...","categories": ["blog"],
        "tags": ["GitHub Blog","Jekyll","GitHub Actions","블로그 자동 배포","CI/CD"],
        "url": "/blog/blog3-build-release/",
        "teaser": null
      },{
        "title": "GitHub Blog 카테고리 설정 - Jekyll 블로그 사이드바 구성 완벽 가이드",
        "excerpt":"Jekyll 기반 GitHub 블로그를 카테고리별로 나눠서 정리하고 싶다면, _data/navigation.yml, _includes/sidebar.html, _config.yml 설정이 핵심입니다. 이 포스트에서는 minimal-mistakes 테마 기준으로 카테고리를 생성하고 사이드바에 자동으로 표시하는 설정법을 순차적으로 설명합니다. 이 글은 기본적인 마크다운 문법을 알고 있다고 가정하고 진행합니다. https://www.markdownguide.org/ 해당 사이트에서 마크다운 문법을 알아볼 수 있습니다. GitHub Blog 카테고리 설정 ._data\\navigation.yml 부분입니다. main:...","categories": ["blog"],
        "tags": ["GitHub Blog","Jekyll","카테고리 설정","사이드바 구성","navigation.yml","config.yml"],
        "url": "/blog/blog4-category/",
        "teaser": null
      },{
        "title": "GitHub Blog 이미지 경로 설정 - Jekyll 블로그 이미지 관리법",
        "excerpt":"Jekyll 기반 GitHub 블로그에서 이미지를 체계적으로 관리하고 싶다면, 게시글 별 이미지 폴더 구조를 사용하는 것이 좋습니다. 이 글에서는 post-image.html 인클루드를 만들어, 자동으로 포스트 경로에 맞는 이미지 경로를 지정하는 방법을 소개합니다. GitHub Blog Image Path 설정하기 ._include\\ 해당 경로에 post-image.html 생성합니다. &lt;!-- post-image.html --&gt; {% assign parts = page.path | split:...","categories": ["blog"],
        "tags": ["GitHub Blog","이미지 경로 설정","post-image","Jekyll 이미지 관리"],
        "url": "/blog/blog5-post-image/",
        "teaser": null
      },{
        "title": "GitHub Blog 댓글 설정 - Utterances를 이용한 Jekyll 댓글 시스템",
        "excerpt":"Jekyll 블로그에 댓글 기능을 추가하고 싶다면, GitHub의 이슈 기능을 활용하는 Utterances가 가장 간단하면서도 강력한 선택입니다. 이 글에서는 minimal-mistakes 테마를 기준으로, Utterances 댓글 시스템을 설정하고 _config.yml과 블로그 포스트에 적용하는 방법을 설명합니다. 1. GitHub 저장소 설정 Utterances는 댓글을 저장할 issue 기반 저장소가 필요합니다. 예: your-username/your-blog-repo 이 저장소의 issue 탭이 열려 있어야 함...","categories": ["blog"],
        "tags": ["GitHub Blog","댓글 시스템","Utterances","Jekyll","GitHub Comments"],
        "url": "/blog/blog6-comment/",
        "teaser": null
      },{
        "title": "GitHub Blog 폰트 설정 - Jekyll SCSS로 커스텀 폰트 적용하기",
        "excerpt":"GitHub Pages 기반 Jekyll 블로그에서 폰트를 커스터마이징하고 싶다면, _variables.scss, main.scss, 그리고 @font-face를 수정해 구글 폰트 적용이 가능합니다. 이 글에서는 Dongle 폰트를 기준으로 minimal-mistakes 테마에서의 적용 과정을 단계별로 설명합니다. https://fonts.google.com/ 저는 폰트를 다운 받아서 진행했습니다. Dongle Font(Dongle-Regular.ttf)를 사용하고 있습니다. _sass\\minimal-mistakes_variables.scss 추가 $dongle: \"Dongle\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif !default; 수정해야 할...","categories": ["blog"],
        "tags": ["GitHub Blog","폰트 설정","Jekyll 폰트 적용","SCSS","구글 폰트"],
        "url": "/blog/blog7-font/",
        "teaser": null
      },{
        "title": "Assembly 시작하기 - Windows 64bit NASM 어셈블리 입문 가이드",
        "excerpt":"Windows 64bit 기반 NASM 어셈블리를 처음 공부한다면, 이 글에서 레지스터 구조 → 명령어 구조 → 메모리 → 호출 규약 → 실전 흐름까지 한 번에 정리해드릴게요. x64dbg로 디버깅을 하면서 구조를 시각화해보고, 어떻게 동작하는지를 정확히 이해하는 데 큰 도움이 될 겁니다. 시작하기 앞 서, 학습할 사이트 목록 입니다. 드림 해커 : https://dreamhack.io/ CrackMe...","categories": ["assembly"],
        "tags": ["nasm","assembly","Windows Assembly","x64dbg","어셈블리 시작하기"],
        "url": "/assembly/assembly1-start/",
        "teaser": null
      },{
        "title": "GitHub Blog 목차 설정 - Jekyll 블로그 TOC 스크롤 고정 기능",
        "excerpt":"Jekyll 블로그에서 글의 구조를 명확히 보여주기 위해 목차(TOC)를 추가하는 것은 매우 유용합니다. 특히 minimal-mistakes 테마는 toc 옵션 하나로 자동 생성이 가능하며, toc_sticky 설정을 통해 스크롤을 따라다니는 고정 목차도 구현할 수 있습니다. 목차 설정 방법 목차 설정 코드: toc: true # 본문 안에 목차 표시 toc_sticky: true # 목차가 오른쪽에 고정되어...","categories": ["blog"],
        "tags": ["GitHub Blog","목차 설정","TOC","toc_sticky","Jekyll Blog"],
        "url": "/blog/blog8-toc/",
        "teaser": null
      },{
        "title": "GitHub Blog 이미지 태그 플러그인 만들기 - Jekyll에서 커스텀 Liquid 태그로 이미지 처리 자동화",
        "excerpt":"Jekyll 블로그에서 이미지를 불러오는 태그를 매번 include로 작성하기 번거롭다면, Liquid 플러그인을 직접 만들어 post 경로 기반 자동 이미지 경로 지정이 가능한 {% img %} 커스텀 태그를 사용하는 것이 훨씬 효율적입니다. 이 글에서는 Jekyll 플러그인 구조부터 img 태그 구현까지 모든 과정을 예제로 설명합니다. 기존 방식 과 태그 플러그인 비교 기존에 이미지...","categories": ["blog"],
        "tags": ["GitHub Blog","Jekyll","이미지 태그","Liquid 플러그인","커스텀 태그"],
        "url": "/blog/blog9-Image-plugin/",
        "teaser": null
      },{
        "title": "GitHub Blog 코드 복사 버튼 추가 - Jekyll에서 Copy 버튼 구현",
        "excerpt":"Jekyll 블로그에서 코드블럭에 복사 버튼을 추가하고 싶다면, clipboard.js를 활용해 div.highlighter-rouge 안에 Copy 버튼을 삽입하면 됩니다. 이 글에서는 복사 기능 구현 → 복사 후 텍스트 변경 → 로컬 대체까지 완벽하게 적용하는 법을 단계별로 설명합니다. code block copy button 추가 \\include\\code-block_custom.html 추가 &lt;script src=\"https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js\"&gt;&lt;/script&gt; &lt;script&gt; document.addEventListener(\"DOMContentLoaded\", function () { document .querySelectorAll(\"div.highlighter-rouge\") .forEach(function...","categories": ["blog"],
        "tags": ["GitHub Blog","코드 복사","clipboard.js","Jekyll Copy 버튼","Code block"],
        "url": "/blog/blog10-code-block-copy-button/",
        "teaser": null
      },{
        "title": "Assembly 실습 환경 설정 - SASM 기반 NASM 디버깅 입문",
        "excerpt":"Windows 환경에서 NASM 어셈블리를 실습하려면 가장 쉬운 도구는 SASM입니다. 이 글에서는 SASM 설치 → Hello, world 예제 → 디버깅 방법 → 메모리/레지스터 분석까지 어셈블리 학습의 첫 실습 환경을 완벽하게 세팅하는 방법을 정리합니다. 1. SASM SASM ( SimpleASM 의 약자 )은 NASM , MASM , GAS , FASM 어셈블리 언어를 위한 무료 오픈 소스 크로스 플랫폼 통합 개발 환경 입니다 . 구문 강조 기능과 디버거가 포함되어...","categories": ["assembly"],
        "tags": ["nasm","assembly","SASM","어셈블리 실습","Windows Assembly"],
        "url": "/assembly/assembly2-setting/",
        "teaser": null
      },{
        "title": "Assembly 기본 명령어 - Windows NASM 실습 가이드",
        "excerpt":"NASM 기반 어셈블리를 처음 접하는 사용자라면, 가장 먼저 익혀야 할 것은 기본 명령어의 역할과 사용법입니다. 이 글에서는 mov, add, sub, cmp, jmp, push, pop, call, ret 같은 필수 명령어들을 Windows 64bit 기준 실습 코드와 함께 정리합니다. 또한, cmp 명령어와 플래그 레지스터(Zero Flag, Sign Flag 등)의 작동 원리를 조건 분기 명령어...","categories": ["assembly"],
        "tags": ["nasm","assembly","어셈블리 명령어","조건 분기","Windows Assembly"],
        "url": "/assembly/assembly3-basic-commands-1/",
        "teaser": null
      },{
        "title": "GitHub Blog 검색엔진 등록 & SEO 설정 - Google Search Console 연동",
        "excerpt":"GitHub Pages에서 만든 Jekyll 블로그를 검색엔진에 노출시키기 위해서는 Google Search Console 등록과 sitemap, robots.txt, 그리고 SEO 메타태그 설정이 필요합니다. 이 포스트는 GitHub 블로그의 SEO 설정을 처음부터 끝까지 따라 할 수 있도록 구성된 실전 가이드입니다. 검색 엔진 개요 월드 와이드 웹 상에 존재하는 정보와 웹 사이트를 검색하기 위한 프로그램. 웹의 정보를...","categories": ["blog"],
        "tags": ["GitHub Blog","SEO 설정","Google Search Console","sitemap.xml","jekyll-seo-tag"],
        "url": "/blog/blog11-search-engine/",
        "teaser": null
      },{
        "title": "GitHub Blog Toggle 플러그인 설정 - Jekyll에서 접기 UI 구현하기",
        "excerpt":"Jekyll 블로그에 접이식 콘텐츠를 넣고 싶다면 기본 &lt;details&gt; 외에도 커스텀 Liquid 플러그인을 통해 더 유연하고 스타일링 가능한 Toggle UI를 구현할 수 있습니다. 이 글에서는 toggle 플러그인을 직접 만들어 접기 기능을 구현하고, 내용에 따라 class, 제목, 마크다운을 넣을 수 있도록 확장하는 방법을 소개합니다. Markdown 기본 Toggle 사용 방법 &lt;details&gt; &lt;summary&gt;toggle 펼쳐보기&lt;/summary&gt;...","categories": ["blog"],
        "tags": ["GitHub Blog","toggle 플러그인","Liquid 태그","접기 기능","Jekyll UI 구성"],
        "url": "/blog/blog12-toggle-plugin/",
        "teaser": null
      },{
        "title": "Assembly 호출 규약 비교: cdecl vs stdcall - 스택 정리 방식과 호출 흐름 이해",
        "excerpt":"NASM 기반 Windows 어셈블리 실습에서 흔히 등장하는 cdecl, stdcall 호출 규약(Call Convention)에 대해 다룹니다. 함수 호출 시 스택 구조, 인자 전달 방식, 복귀 흐름 분석은 리버싱과 디버깅에 핵심입니다. Call Convention이란? 함수를 어떻게 호출하고 인자를 어떻게 전달하고, 누가 스택을 정리하는지를 정한 약속. C/C++ 컴파일러가 어셈블리로 함수 호출을 만들 때 이 규칙을...","categories": ["assembly"],
        "tags": ["assembly","call convention","cdecl","stdcall","fastcall","nasm","stack frame"],
        "url": "/assembly/assembly3-basic-commands-2/",
        "teaser": null
      },{
        "title": "GitHub Blog Quiz Form - Liquid 플러그인으로 퀴즈 기능 구현하기",
        "excerpt":"Jekyll 블로그에서 Liquid 플러그인으로 퀴즈(객관식/주관식) 기능을 구현하고 인터랙티브한 문제 출제를 만드는 방법을 소개합니다. Quiz Form 미리보기 객관식 문제 1 : 객관식 미리보기 문제입니다. 문제의 테스트용 코드 블럭 입니다. 정답은 2번 1번 2번 3번 4번 제출 문제의 해설 보기 입니다. 주관식 test? 정답은 test 제출 test 문제 입니다. Quiz Form Code...","categories": ["blog"],
        "tags": ["GitHubBlog","quiz","plugin","liquid","jekyll","javascript"],
        "url": "/blog/blog13-quiz-form/",
        "teaser": null
      },{
        "title": "GitHub Blog 카드 링크 플러그인 만들기",
        "excerpt":"GitHub Pages 기반 Jekyll 블로그에서 외부 링크를 자동으로 카드 형식으로 만들어주는 링크 카드 플러그인, OG 태그 기반 미리보기 카드, Liquid 태그 확장을 구현하고 싶다면 이 글을 참고하세요. 링크 카드 미리 보기 Jekyll • Simple, blog-aware, static sites Transform your plain text into static websites and blogs jekyllrb.com /plugins/cardlink_tag.rb 추가 require...","categories": ["blog"],
        "tags": ["GitHubBlog","link preview","liquid plugin","jekyll plugin","open graph","javascript"],
        "url": "/blog/blog14-card-link-pulgin/",
        "teaser": null
      },{
        "title": "GitHub Blog Reveal.js 슬라이드 만들기",
        "excerpt":"Reveal.js를 사용하면 GitHub 블로그에서도 마치 PowerPoint처럼 HTML 슬라이드를 만들 수 있습니다. 이 글에서는 Jekyll 환경에서 reveal.js를 이용해 슬라이드 프레젠테이션, 인터랙티브 발표용 페이지, Jekyll 커스텀 플러그인 구현 방법까지 단계별로 설명합니다. reveal.js 으로 슬라이드 만들기 예시 슬라이드: Reveal.js 소개 Jekyll 블로그에서 슬라이드 프레젠테이션을 할 수 있어요! 두 번째 슬라이드 이 슬라이드는 마크다운이...","categories": ["blog"],
        "tags": ["GitHubBlog","reveal.js","jekyll plugin","slide presentation","liquid plugin"],
        "url": "/blog/blog15-slide/",
        "teaser": null
      },{
        "title": "Assembly 함수 호출 구조와 스택프레임 이해하기 - Windows NASM 실습",
        "excerpt":"Assembly 실습 시 자주 등장하는 함수 호출 구조, 스택프레임 구성 방식, RBP와 RSP의 역할, 그리고 지역 변수 접근 방법까지 NASM 기반 Windows 환경에서 상세하게 실습합니다. 전 편에서 Assembly 기본 명령어 - Windows NASM 실습 가이드 에서 조건 분기문과 loop 에 대해 학습을 진행했습니다. 이번 편에서는 함수/스택 호출 구조, 스택 프레임에...","categories": ["assembly"],
        "tags": ["assembly","nasm","x64dbg","함수 호출","스택프레임","스택 구조","리버스엔지니어링"],
        "url": "/assembly/assembly3-basic-commands-3/",
        "teaser": null
      },{
        "title": "Assembly로 간단한 계산기 만들기: Hello World부터 사칙연산까지 실습",
        "excerpt":"Assembly 언어로 Hello World 출력부터 덧셈 계산기, 사칙연산 계산기까지 NASM과 io64.inc 매크로를 활용하여 실습해봅니다. 이 예제들을 통해 PRINT_STRING, READ_INT, cmp, call, ret 등의 명령어 흐름과 스택 사용법까지 익힐 수 있습니다. SASM + io64.inc 환경 기준으로 진행합니다. 예제: Hello World 출력 (x64, NASM, io64.inc) %include \"io64.inc\" ; 문자열 출력 등 유틸리티...","categories": ["assembly"],
        "tags": ["assembly","nasm","io64","계산기","READ_INT","PRINT_STRING","기초실습"],
        "url": "/assembly/assembly4-practice/",
        "teaser": null
      },{
        "title": "Assembly 기초 연습문제 풀이1 - NASM 기반 개념 정리 퀴즈",
        "excerpt":"Assembly(NASM) 학습 내용을 복습하는 기초 연습문제입니다. 64비트 레지스터 구분, 스택 구조 이해, 리틀 엔디안 메모리 저장 방식, 함수 호출 시 RSP/RBP 역할 등 퀴즈로 정리합니다. 1. 다음 중 64비트 레지스터가 아닌 것은? RAX RBX EAX RDI 제출 해설: EAX는 32비트 레지스터. RAX의 하위 32비트 버전. 2. 스택에서 함수 호출 시...","categories": ["assembly"],
        "tags": ["assembly","nasm","x64","어셈블리 퀴즈","리틀엔디안","스택프레임","레지스터"],
        "url": "/assembly/assembly5-exercises1/",
        "teaser": null
      },{
        "title": "Assembly 기초 연습문제 풀이2 - 명령어 개념 정리 퀴즈",
        "excerpt":"NASM 어셈블리어 명령어에 대한 이해도를 높이기 위한 연습문제입니다. mov, add, cmp, jmp, push, pop, call, ret 등 핵심 명령어와 스택 동작 구조를 객관식 퀴즈 형식으로 정리했습니다. 1. 다음 중 mov 명령어의 올바른 사용 예시는? mov [rax], [rbx] mov rax, 1234h mov 1234h, rax mov rax, [rbx + rcx] 제출 해설:...","categories": ["assembly"],
        "tags": ["assembly","nasm","x64","어셈블리 퀴즈","명령어 실습","call","ret","push","pop"],
        "url": "/assembly/assembly5-exercises2/",
        "teaser": null
      },{
        "title": "GitHub Blog Google Analytics GA4 연동 가이드",
        "excerpt":"GitHub Pages 기반 Jekyll 블로그에서 방문자 추적을 하고 싶다면, Google Analytics GA4를 연동하는 것이 필수입니다. 이 글에서는 GA4 측정 ID 삽입, minimal-mistakes 테마 설정, 실시간 유입 확인, 그리고 Google Search Console 연동 방법까지 전체 과정을 상세히 다룹니다. 1. GA4 속성 만들기 Google Analytics 접속 ‘만들기’ → ‘계정 생성’ → ‘속성...","categories": ["blog"],
        "tags": ["GitHubBlog","GoogleAnalytics","GA4","minimal-mistakes","Jekyll","SearchConsole"],
        "url": "/blog/blog16-google-analytics/",
        "teaser": null
      },{
        "title": "Assembly 조건 분기와 스택프레임 연습문제 풀이3 - NASM 실습 퀴즈",
        "excerpt":"NASM 어셈블리어에서 조건 분기(jmp, je, jne, jl, jg), 함수 호출 구조(call, ret), 스택프레임과 지역 변수 접근 방식을 복습하는 퀴즈입니다. 기본 명령어 흐름을 명확히 이해하는 데 도움이 됩니다. 1. cmp rax, rbx 실행 후 je label 명령이 의미하는 것은? rax &gt; rbx이면 점프 rax == rbx이면 점프 rax &lt; rbx이면 점프...","categories": ["assembly"],
        "tags": ["assembly","nasm","조건 분기","call ret 구조","스택프레임","x64","reversing","어셈블리어"],
        "url": "/assembly/assembly5-exercises3/",
        "teaser": null
      },{
        "title": "x64dbg 기본 사용법과 디버깅 흐름 이해하기 - Windows 어셈블리 디버거 입문",
        "excerpt":"Windows에서 어셈블리 디버깅을 배울 때 가장 많이 쓰는 도구인 x64dbg를 소개합니다. x64dbg의 설치 방법, 기본 인터페이스 구성, Breakpoint 설정, Step 실행(F7, F8), 레지스터/메모리/스택 분석 방법을 기초부터 정리합니다. x64dbg란? x64dbg는 Windows용 오픈소스 디버거. x64(64비트), x86(32비트) 프로그램을 역분석, 디버깅할 수 있음. 쉽게 말하면, “프로그램 내부에서 무슨 일이 일어나는지 실시간으로 볼 수 있게...","categories": ["assembly"],
        "tags": ["x64dbg","디버깅","reversing","assembly","windows 디버거","스택 분석","메모리 분석"],
        "url": "/assembly/assembly6-x64-dbg/",
        "teaser": null
      },{
        "title": "초보자를 위한 x64dbg 실습 흐름 가이드 - Windows 어셈블리 디버깅 입문",
        "excerpt":"x64dbg를 이용해 Windows C++ 프로그램을 디버깅하는 실습을 진행합니다. EntryPoint(진입점) 분석, main 함수 추적, Az 메모리 문자열 검색, operator&lt;&lt; 호출 추적까지 단계별로 상세히 따라가는 x64dbg 초보자 가이드입니다. x64에서 실행해볼 예제 Visual Studio 2015 C++로 작성되어있습니다. #include &lt;iostream&gt; int main() { std::cout &lt;&lt; \"Hello World!\" &lt;&lt; std::endl; return 0; } 빌드 환경...","categories": ["assembly"],
        "tags": ["x64dbg","디버깅 실습","reversing","assembly","entrypoint 분석","메모리 검색","함수 추적"],
        "url": "/assembly/assembly7-x64-dbg-guide/",
        "teaser": null
      },{
        "title": "GitHub Blog 카테고리 사이드바 설정 방법 - 상위/하위 카테고리 구현",
        "excerpt":"GitHub Blog에서 카테고리를 상위/하위 트리 구조로 표현하고 싶다면 이 글을 참고하세요. Liquid 템플릿 수정, sidebar.html/sidebar-items.html 추가, _navigation.scss 스타일 커스터마이징을 통해 GitHub 블로그 카테고리 트리 구성을 완성하는 방법을 자세히 정리했습니다. 이전에 다루었던 Cateory 업데이트 글입니다. Category 상위목록/하위목록을 만들어보자. _include/sidebar.html {% if page.author_profile or layout.author_profile or page.sidebar %} &lt;div class=\"sidebar sticky\"&gt; {%...","categories": ["blog"],
        "tags": ["GitHubBlog","Liquid","sidebar","카테고리 설정","Jekyll 커스터마이징","navigation","SCSS"],
        "url": "/blog/blog-17-category2/",
        "teaser": null
      }]
