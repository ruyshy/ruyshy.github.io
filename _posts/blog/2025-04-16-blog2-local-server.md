---
title: "GitHub Blog 로컬 서버 설정 - Jekyll 개발 환경 구축"
description: "GitHub 블로그를 로컬에서 개발하기 위해 Jekyll과 Ruby, Bundler를 설치하고 로컬 서버를 실행하는 방법을 설명합니다."
date: 2025-04-16
tags: [GitHub Blog, Jekyll, 로컬 서버, Ruby, bundle exec jekyll serve]
---

GitHub 블로그를 로컬에서 수정하고 테스트하려면,  
**Jekyll 로컬 서버 설정**을 통해 실시간으로 확인하는 환경이 필요합니다.  
이 글에서는 Ruby, Jekyll, Bundler 설치부터 `bundle exec jekyll serve` 명령어로 로컬 서버를 띄우는 전체 과정을 설명합니다.

## 필요한 준비물

[https://www.ruby-lang.org/ko/](https://www.ruby-lang.org/ko/)

## Gemfile

```ruby
# Gemfile
source "https://rubygems.org"

gem "jekyll", "~> 4.3.2"
gem "jekyll-paginate"
gem "jekyll-sitemap"
gem "jekyll-feed"
gem "jekyll-include-cache"
gem "jekyll-gist"
gem "tzinfo"
gem "tzinfo-data"
```

Ruby를 설치해줍니다. 저의 경우 ruby3.3.8 의 버전을 설치하여 진행했습니다.

## ruby jekyll Compatibility(호환성) 개요

**`Jekyll`은 일반적으로 `Ruby 3.3.x`를 지원합니다.**하지만 프로젝트 내에 호환성 문제를 일으킬 수 있는 특정 젬이 있을 수 있습니다. 특히 최근에 업데이트되지 않은 경우 더욱 그렇습니다. `Jekyll `프로젝트의 종속성을 관리하려면 `Bundler`를 사용해야 할 가능성이 높으며, 호환성을 보장하기 위해 `Gemfile`에 `Ruby` 버전을 지정하는 것이 좋습니다. 

**고려해야 할 사항은 다음과 같습니다.**

**루비 버전:**

`Jekyll`은 `Ruby 2.7.0` 이상을 필요로 합니다. `Ruby 3.3.x`는 최신 버전이므로 일반적으로 호환되지만, 특정 종속성을 확인해야 합니다. 

**번들러:**

`Bundler`를 사용하면 `Jekyll` 프로젝트의 종속성을 관리할 수 있어 다양한 `Ruby` 버전과 젬 간의 호환성을 보장하는 데 도움이 됩니다. 

**Gemfile:**

`Gemfile`에서 지시어를 사용하여 사용할 `Ruby` 버전을 지정하세요 ruby. 예: `ruby '~> 3.3.0'.`

**잠재적인 문제:**

오류가 발생하는 경우 프로젝트의 특정 젬이 문제의 원인일 가능성이 높습니다. 최근 업데이트되지 않았거나 `Ruby 3.3.x` 버전과 호환성 문제가 있는 젬이 있는지 확인해 보세요. 

**웹릭:**

`Ruby 3.0.0`부터는 `webrick`더 이상 기본 `gem`으로 포함되지 않습니다. `Webrick` 기반 `Jekyll` 서버를 사용하는 경우 `Gemfile`에 명시적으로 추가해야 할 수 있습니다. 

**`bundle install`:**

`Gemfile`을 변경한 후에는 `bundle install`으로 `Gem`을 업데이트하고 호환성 문제를 해결하세요. 

<br/>

## 로컬 서버 작업 흐름

1. Gemfile을 위와 같이 수정을 진행합니다.
2. 자기 자신의 Github Blog가 있는 로컬 폴더에서 cmd를 실행시키거나 cmd를 실행시켜 예시) cd C:\[ruyshy.github.io](http://ruyshy.github.io/)(경로) 통해 이동해줍니다.
3. `bundle install` 명령어를 통해 위와 같은 종속성을 설치를 진행합니다.
4. 설치가 정상적으로 진행되었을 때, `Gemfile.lock` 파일이 생성이 됩니다.
5. `bundle exec jekyll serve` 을 통해 Local Server를 열어줍니다.
6. 정상적으로 작동했으면 아래와 같은 그림의 텍스트가 cmd에서 실행됩니다.

{% img "github-blog-local-server-bash-image.png", "github-blog-local-server-bash-image" %}

> Server address : [http://127.0.0.1:4000/](http://127.0.0.1:4000/) 에 접속하여 실시간으로 수정을 진행하며 확인할 수 있습니다.
>

서버를 켜둔 상태에서 서버를 종료하려면 ctrl-c를 눌러 y를 입력해 서버를 종료합니다.

`bundle exec jekyll clean` 해당 명령어로 이전 빌드 결과가 꼬였거나, 레이아웃, 설정파일 변경 후 캐시를 무시하고 새로 빌드하고싶을 때 사용합니다.
