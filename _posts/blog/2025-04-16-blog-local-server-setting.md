---
title: "GitHub Blog Local Server 설정"
date: 2025-04-16
tags: [GitHubBlog]
---

GitHub Blog #3

## 필요한 준비물

[https://www.ruby-lang.org/ko/](https://www.ruby-lang.org/ko/)

## Gemfile

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.3.2"
gem "minimal-mistakes-jekyll"
gem "jekyll-feed"
gem "jekyll-seo-tag"
gem "jekyll-paginate"
gem "jekyll-sitemap"
gem "jekyll-include-cache"
gem "tzinfo"
gem "tzinfo-data"
```

Ruby를 설치해줍니다. 저의 경우 ruby3.3.8 의 버전을 설치하여 진행했습니다.

1. Gemfile을 위와 같이 수정을 진행합니다.
2. 자기 자신의 Github Blog가 있는 로컬 폴더에서 cmd를 실행시키거나 cmd를 실행시켜 예시) cd C:\[ruyshy.github.io](http://ruyshy.github.io/)(경로) 통해 이동해줍니다.
3. `bundle install` 명령어를 통해 위와 같은 종속성을 설치를 진행합니다.
4. 설치가 정상적으로 진행되었을 때, Gemfile.lock 파일이 생성이 됩니다.
5. `bundle exec jekyll serve` 을 통해 Local Server를 열어줍니다.
6. 정상적으로 작동했으면 아래와 같은 그림의 텍스트가 cmd에서 실행됩니다.
    
{% include post-image1.html name="image.png" alt="image" %}
    
7. Server address : [http://127.0.0.1:4000/](http://127.0.0.1:4000/) 에 접속하여 실시간으로 수정을 진행하며 확인할 수 있습니다.

서버를 켜둔 상태에서 서버를 종료하려면 ctrl-c를 눌러 y를 입력해 서버를 종료합니다.

`bundle exec jekyll clean` 해당 명령어로 이전 빌드 결과가 꼬였거나, 레이아웃, 설정파일 변경 후 캐시를 무시하고 새로 빌드하고싶을 때 사용합니다.