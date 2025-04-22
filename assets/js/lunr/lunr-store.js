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
        "title": "GitHub Blog 시작하기",
        "excerpt":"GitHub Blog #1 jekyll 테마 GitHub Blog 시작하기 Jekyll 기반 GitHub Blog 생성 https://mmistakes.github.io/minimal-mistakes/ 해당 Jekyll 테마 기준으로 작성 되어있습니다. 준비해야 할 준비물 개인 GitHub 계정 (https://github.com/) Visual Studio Code (https://code.visualstudio.com/) GitHub Blog 시작하기 https://github.com/mmistakes/minimal-mistakes github 홈페이지에서 로그인을 한 상태로 해당 jekyll 테마 github 사이트에 접속합니다. 해당 사이트에서 위 오른쪽에...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog1-start/",
        "teaser": null
      },{
        "title": "GitHub Blog 로컬 서버 설정",
        "excerpt":"GitHub Blog #2 필요한 준비물 https://www.ruby-lang.org/ko/ Gemfile # Gemfile source \"https://rubygems.org\" gem \"jekyll\", \"~&gt; 4.3.2\" gem \"jekyll-paginate\" gem \"jekyll-sitemap\" gem \"jekyll-feed\" gem \"jekyll-include-cache\" gem \"jekyll-gist\" gem \"tzinfo\" gem \"tzinfo-data\" Ruby를 설치해줍니다. 저의 경우 ruby3.3.8 의 버전을 설치하여 진행했습니다. Gemfile을 위와 같이 수정을 진행합니다. 자기 자신의 Github Blog가 있는 로컬 폴더에서...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog2-local-server/",
        "teaser": null
      },{
        "title": "GitHub Blog 빌드&릴리즈 설정",
        "excerpt":"GitHub Blog #3 GitHub에 Action기능 알아보기 GitHub Action 문서 : https://docs.github.com/ko/actions GitHub Actions는 CI/CD(지속적 통합/배포)를 위한 자동화된 작업(Workflow)을 만들어주는 도구입니다. 블로그 자동 배포와 코드 빌드 등의 작업을 자동으로 처리할 수 있습니다. GitHub Actions 개념 정리 용어 설명 Workflow 자동화 작업의 전체 흐름 (YAML 파일로 설정) Job Workflow 내에서 실행되는 작업...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog3-build-release/",
        "teaser": null
      },{
        "title": "GitHub Blog 게시글 설정",
        "excerpt":"GitHub Blog #4 GitHub Blog Image Path 설정하기 ._include\\ 해당 경로에 post-image.html 생성합니다. &lt;!-- post-image.html --&gt; {% assign parts = page.path | split: '/' %} {% assign category = parts[1] %} {% assign slug = parts[2] | remove: '.md' %} &lt;img src=\"/assets/images/{{ category }}/{{ slug }}/{{ include.name }}\" alt=\"{{ include.alt...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog4-post/",
        "teaser": null
      },{
        "title": "GitHub Blog 카테고리 설정",
        "excerpt":"GitHub Blog #5 GitHub Blog 시작하기에 이어 다음 편입니다. 이 글은 기본적인 마크다운 문법을 알고 있다고 가정하고 진행합니다. https://www.markdownguide.org/ 해당 사이트에서 마크다운 문법을 알아볼 수 있습니다. GitHub Blog 카테고리 설정 ._data\\navigation.yml 부분입니다. main: - title: \"Quick-Start Guide\" url: https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/ # - title: \"About\" # url: https://mmistakes.github.io/minimal-mistakes/about/ # - title: \"Sample...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog5-category/",
        "teaser": null
      },{
        "title": "GitHub Blog 댓글 설정",
        "excerpt":"GitHub Blog #6 jekyll 테마(minimal-mistakes) 기준으로 작성되었습니다 1. GitHub 저장소 설정 Utterances는 댓글을 저장할 issue 기반 저장소가 필요합니다. 예: your-username/your-blog-repo 이 저장소의 issue 탭이 열려 있어야 함 댓글 저장용 저장소는 블로그 repo와 동일하게 해도 되고, 별도 repo를 만들어도 됨. 2. Utterances 앱 설치 https://utteranc.es/ 접속 후 아래 순서대로 진행: Install...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog6-comment/",
        "teaser": null
      },{
        "title": "GitHub Blog 폰트 설정",
        "excerpt":"GitHub Blog #7 여러 폰트 사이트가 있지만 저는 구글 폰트 사이트를 예시로 사용하겠습니다. https://fonts.google.com/ 저는 폰트를 다운 받아서 진행했습니다. Dongle Font(Dongle-Regular.ttf)를 사용하고 있습니다. _sass\\minimal-mistakes_variables.scss 추가 $dongle: 'Dongle', -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif !default; 수정해야 할 부분: $global-font-family: $sans-serif !default; $header-font-family: $sans-serif !default; 수정할 코드: $global-font-family: $dongle !default; $header-font-family: $dongle !default;...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog7-font/",
        "teaser": null
      },{
        "title": "Assembly 시작하기",
        "excerpt":"assembly #1 시작하기 앞 서, 학습할 사이트 목록 입니다. 드림 해커 : https://dreamhack.io/  CrackMe : https://crackmy.app/ 어셈블리(Assembly)란? 어셈블리어는 사람이 읽을 수 있는 저수준 언어로, CPU가 실제로 이해하는 기계어(machine code)와 1:1로 대응됨. 쉽게 말하면, CPU와 직접 대화하기 직전 단계라고 볼 수 있음. 한 줄로 요약하면 “CPU가 이해할 수 있는 인간 최저 레벨 언어”...","categories": ["assembly"],
        "tags": ["nasm","assembly"],
        "url": "/assembly/assembly1-start/",
        "teaser": null
      },{
        "title": "GitHub Blog 목차 설정",
        "excerpt":"GitHub Blog #8 목차 설정 방법 목차 설정 코드: toc: true toc_sticky: true toc는 목차, toc_sticky는 스크롤 따라가기 게시글 설정 예시: --- title: \"GitHub Blog Start\" date: 2025-04-10 tags: [GitHubBlog] toc: true toc_sticky: true --- 게시글 전체 적용 예시 (_config.yml): - scope: path: \"\" type: posts values: layout: single author_profile:...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog8-toc/",
        "teaser": null
      },{
        "title": "GitHub Blog 이미지 커스텀 플로그인",
        "excerpt":"GitHub Blog #9 기존 방식 과 태그 플러그인 비교 기존에 이미지 불러오는 방식: {% include post-image.html name=\"image.png\" alt=\"image\" %} 플러그인 적용한 방식: {% img \"image1.png\", \"tag image test\" %} or {% img \"image1.png\" %} \\plugins\\img_tag.rb 코드 추가 module Jekyll class ImgTag &lt; Liquid::Tag def initialize(tag_name, markup, tokens) super @markup =...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog9-Image-plugin/",
        "teaser": null
      },{
        "title": "GitHub Blog 코드블럭 copy 버튼",
        "excerpt":"GitHub Blog #10 code block copy button 추가 \\include\\code-block_custom.html 추가 &lt;script src=\"https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js\"&gt;&lt;/script&gt; &lt;script&gt; document.addEventListener('DOMContentLoaded', function() { document.querySelectorAll('div.highlighter-rouge').forEach(function(block) { var button = document.createElement('button'); button.className = 'copy-button'; button.textContent = 'Copy'; button.style.position = 'absolute'; button.style.top = '0.25em'; button.style.right = '0.25em'; block.style.position = 'relative'; block.appendChild(button); }); var clipboard = new ClipboardJS('.copy-button', { target: function(trigger)...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog10-code-block-copy-button/",
        "teaser": null
      },{
        "title": "Assembly 실습 환경 설정",
        "excerpt":"assembly #2 1. SASM SASM ( SimpleASM 의 약자 )은 NASM , MASM , GAS , FASM 어셈블리 언어를 위한 무료 오픈 소스 크로스 플랫폼 통합 개발 환경 입니다 . 구문 강조 기능과 디버거가 포함되어 있습니다. 1-1. SASM 설치하기 sasm 공식 홈페이지 : https://dman95.github.io/SASM/english.html 해당 홈페이지에 접속하여 설치파일 다운로드 후, 설치를 진행합니다. 1-2. SASM Setting nasm x64 기준으로 진행 합니다. 설치 후, 설치 경로인 \\SASM\\Projects...","categories": ["assembly"],
        "tags": ["nasm","assembly"],
        "url": "/assembly/assembly2-setting/",
        "teaser": null
      },{
        "title": "GitHub Blog 검색엔진 설정",
        "excerpt":"GitHub Blog #11 검색 엔진 개요 월드 와이드 웹 상에 존재하는 정보와 웹 사이트를 검색하기 위한 프로그램. 웹의 정보를 긁어오는 소프트웨어는 크롤러라고 부르고, 그 행위는 크롤링이라고 부른다. 참고로 일반 검색 엔진에 안 잡히는 웹을 딥 웹이라고 한다. 검색 엔진 종류 구글, 네이버, Bing, zum, 네이트, 다음… 여러가지가 있습니다. Google Search...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog11-search-engine/",
        "teaser": null
      }]
