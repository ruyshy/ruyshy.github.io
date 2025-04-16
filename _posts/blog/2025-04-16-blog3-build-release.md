---
title: "GitHub Blog Build&Release 설정"
date: 2025-04-16
tags: [GitHubBlog]
---

GitHub Blog #3

## GitHub에 Action기능 알아보기

GitHub Action 문서 : [https://docs.github.com/ko/actions](https://docs.github.com/ko/actions)

GitHub Actions는 **CI/CD(지속적 통합/배포)**를 위한 자동화된 작업(Workflow)을 만들어주는 도구입니다. 블로그 자동 배포와 코드 빌드 등의 작업을 자동으로 처리할 수 있습니다.

## GitHub Actions 개념 정리

| 용어 | 설명 |
| --- | --- |
| **Workflow** | 자동화 작업의 전체 흐름 (YAML 파일로 설정) |
| **Job** | Workflow 내에서 실행되는 작업 단위 |
| **Step** | Job 안에서 실행되는 세부 명령 |
| **Action** | 재사용 가능한 명령 묶음 (남이 만든 것도 쉽게 사용 가능) |
| **Runner** | GitHub 서버 or 네가 직접 설정한 컴퓨터에서 실행됨 |

## GitHub Workflow 생성 방법

{% include post-image.html name="image1.png" alt="image1" %}

Action을 생성할 저장소에 들어가 Action을 눌러 Action페이지로 이동합니다.

{% include post-image.html name="image2.png" alt="image2" %}

New workflow을 눌러 .yml을 작성해줍니다.

## 현재 Blog Workflow

```yaml
name: Build and Deploy from ph-pages to gh-pages

on:
  push:
    branches:
      - ph-pages

permissions:
  contents: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source branch
        uses: actions/checkout@v3
        with:
          ref: ph-pages

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'

      - name: Install dependencies
        run: |
          gem install bundler
          bundle install

      - name: Build Jekyll site
        run: bundle exec jekyll build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: gh-pages
          publish_dir: ./_site
```

## 코드 진행 설명

- `ph-pages` 브랜치에 푸시하면,
- GitHub 서버에서 자동으로 Ruby 세팅하고,
- Jekyll로 블로그 빌드하고,
- 결과물(`_site` 폴더)을 `gh-pages` 브랜치로 배포함.

## 사용할 수 있는 곳

- 블로그 자동 배포 (Jekyll, Hugo 등)
- 코드 테스트 자동 실행
- PR 올릴 때 자동으로 포맷 검사
- 릴리즈 빌드 자동 생성
- 정적 웹사이트 자동 배포 (React, Vue 등)

## 위 코드 주의점 및 확인해야 할 부분

1. 워크플로우 파일 위치 확인
    1. 워크플로우 파일이 반드시 **`.github/workflows/`** 폴더 안에 있어야 함.
    
    ```markdown
    .github/
      workflows/
        deploy.yml ← 여기에 있어야 작동함!
    
    ```
    
2. `ph-pages` 브랜치로 **푸시가 실제로 있었는지**
    1. GitHub Action은 `on: push` 조건에 따라 실행됩니다. `ph-pages` 브랜치에 push해야만 작동합니다.
        1. GitHub Desktop을 사용하는 경우, 커밋 후에 **실제로 push까지 완료했는지 확인**하세요.
        2. 파일만 수정하고 커밋하지 않으면 작동하지 않습니다.
        3. `git push origin ph-pages` 명령이 실행된 상태여야 합니다.
3. `.jekyll-cache`나 `_site`가 Git으로 추적되고 있는지
    1. 이건 종종 문제가 되진 않지만, 만약 `_site/`가 git에 들어있고 `.gitignore` 안 되어 있으면 충돌 생길 수 있음.
    2. `.gitignore`에 아래 내용이 있는지 확인:
    
    ```markdown
    _site/
    .jekyll-cache/
    ```

4. GitHub 페이지 설정 확인
    1. `gh-pages` 브랜치를 페이지 소스로 지정했는지?
        1. [Repository → Settings → Pages](https://github.com/%EC%82%AC%EC%9A%A9%EC%9E%90%EB%AA%85/%EB%A0%88%ED%8F%AC%EB%AA%85/settings/pages) 에 가서
        2. **Source**: `gh-pages` 선택
        3. **Folder**: `/ (root)` 또는 `/docs` 말고 `/`로 돼야 함

push 없이도 수동 실행 가능하게 하려면 아래처럼 수정:

```yaml
on:
  push:
    branches:
      - ph-pages
  workflow_dispatch: # 수동 실행 가능

```
GitHub UI 상에서 "Run workflow" 버튼이 생성됩니다.