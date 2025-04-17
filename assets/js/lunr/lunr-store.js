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
        "title": "Assembly Start",
        "excerpt":"Assembly 시작하기 어셈블리(Assembly)란? 어셈블리어는 사람이 읽을 수 있는 저수준 언어로, CPU가 실제로 이해하는 기계어(machine code)와 1:1로 대응돼. 쉽게 말하면, CPU와 직접 대화하기 직전 단계라고 볼 수 있어. 왜 어셈블리를 배울까? 시스템 내부 동작을 깊이 이해할 수 있음 최적화된 코드 작성 가능 (속도 극한까지 뽑기) 리버스 엔지니어링, 보안 분야에서 필수 디버깅...","categories": ["assembly"],
        "tags": ["nasm","reverse"],
        "url": "/assembly/assembly-start/",
        "teaser": null
      },{
        "title": "GitHub Blog Start",
        "excerpt":"GitHub Blog #1 jekyll 테마 GitHub Blog 시작하기 Jekyll 기반 GitHub Blog 생성 https://mmistakes.github.io/minimal-mistakes/ 해당 Jekyll 테마 기준으로 작성 되어있습니다. 준비해야 할 준비물 개인 GitHub 계정 (https://github.com/) Visual Studio Code (https://code.visualstudio.com/) GitHub Blog 시작하기 https://github.com/mmistakes/minimal-mistakes github 홈페이지에서 로그인을 한 상태로 해당 jekyll 테마 github 사이트에 접속합니다. 해당 사이트에서 위 오른쪽에...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog1-start/",
        "teaser": null
      },{
        "title": "GitHub Blog Local Server 설정",
        "excerpt":"GitHub Blog #2 필요한 준비물 https://www.ruby-lang.org/ko/ Gemfile source \"https://rubygems.org\" gem \"jekyll\", \"~&gt; 4.3.2\" gem \"minimal-mistakes-jekyll\" gem \"jekyll-feed\" gem \"jekyll-seo-tag\" gem \"jekyll-paginate\" gem \"jekyll-sitemap\" gem \"jekyll-include-cache\" gem \"tzinfo\" gem \"tzinfo-data\" Ruby를 설치해줍니다. 저의 경우 ruby3.3.8 의 버전을 설치하여 진행했습니다. Gemfile을 위와 같이 수정을 진행합니다. 자기 자신의 Github Blog가 있는 로컬 폴더에서...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog2-local-server/",
        "teaser": null
      },{
        "title": "GitHub Blog Build&Release 설정",
        "excerpt":"GitHub Blog #3 GitHub에 Action기능 알아보기 GitHub Action 문서 : https://docs.github.com/ko/actions GitHub Actions는 CI/CD(지속적 통합/배포)를 위한 자동화된 작업(Workflow)을 만들어주는 도구입니다. 블로그 자동 배포와 코드 빌드 등의 작업을 자동으로 처리할 수 있습니다. GitHub Actions 개념 정리 용어 설명 Workflow 자동화 작업의 전체 흐름 (YAML 파일로 설정) Job Workflow 내에서 실행되는 작업...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog3-build-release/",
        "teaser": null
      },{
        "title": "GitHub Blog Category, Post 설정",
        "excerpt":"GitHub Blog #4 GitHub Blog 시작하기에 이어 다음 편입니다. 이 글은 기본적인 마크다운 문법을 알고 있다고 가정하고 진행합니다. https://www.markdownguide.org/ 해당 사이트에서 마크다운 문법을 알아볼 수 있습니다. GitHub Blog 카테고리 설정 ._data\\navigation.yml 부분입니다. main: - title: \"Quick-Start Guide\" url: https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/ # - title: \"About\" # url: https://mmistakes.github.io/minimal-mistakes/about/ # - title: \"Sample...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog4-category-post/",
        "teaser": null
      },{
        "title": "GitHub Blog 댓글 설정",
        "excerpt":"GitHub Blog #5 jekyll 테마(minimal-mistakes) 기준으로 작성되었습니다 1. GitHub 저장소 설정 Utterances는 댓글을 저장할 issue 기반 저장소가 필요합니다. 예: your-username/your-blog-repo 이 저장소의 issue 탭이 열려 있어야 함 댓글 저장용 저장소는 블로그 repo와 동일하게 해도 되고, 별도 repo를 만들어도 됨. 2. Utterances 앱 설치 https://utteranc.es/ 접속 후 아래 순서대로 진행: Install...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog5-comment/",
        "teaser": null
      },{
        "title": "GitHub Blog Font 설정",
        "excerpt":"GitHub Blog #6 여러 폰트 사이트가 있지만 저는 구글 폰트 사이트를 예시로 사용하겠습니다. https://fonts.google.com/ 저는 Dongle Font(Dongle-Regular.ttf)를 사용하고 있습니다. _sass\\minimal-mistakes_variables.scss 추가 $dongle: 'Dongle', -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif !default; 수정해야 할 부분: $global-font-family: $sans-serif !default; $header-font-family: $sans-serif !default; 수정할 코드: $global-font-family: $dongle !default; $header-font-family: $dongle !default; 수정해야 할 부분: /*...","categories": ["blog"],
        "tags": ["GitHubBlog"],
        "url": "/blog/blog6-font/",
        "teaser": null
      }]
