---
title: "GitHub Blog Start"
date: 2025-04-10
tags: [GitHubBlog]
---

# jekyll 테마 GitHub Blog 시작하기

## Jekyll 기반 GitHub Blog 생성

[https://mmistakes.github.io/minimal-mistakes/](https://mmistakes.github.io/minimal-mistakes/)

해당 Jekyll 테마 기준으로 작성 되어있습니다.

## 준비해야 할 준비물

개인 GitHub 계정 ([https://github.com/](https://github.com/))

Visual Studio Code ([https://code.visualstudio.com/](https://code.visualstudio.com/))

## GitHub Blog 시작하기

[https://github.com/mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes)

github 홈페이지에서 로그인을 한 상태로 해당 jekyll 테마 github 사이트에 접속합니다.
{% include post-image.html name="mmistakes_minimal-mistakes___triangular_ruler__Jekyll_theme_for_building_a_personal_site_blog_project_documentation_or_portfolio._-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_47_30.png" alt="mmistakes" %}


해당 사이트에서 위 오른쪽에 Fork가 있습니다. 해당 버튼을 눌러주세요.

Fork 버튼을 누르면 로그인하고있는 Github계정에 **repositories(저장소)** 에 똑같은 코드를 가진 Project(코드 저장소)가 생성이 됩니다.

{% include post-image.html name="ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_53_33_-_%EB%B3%B5%EC%82%AC%EB%B3%B8.png" alt="mmistakes" %}

Fork 작업이 완료되면 Setting 버튼을 눌러 Setting 홈페이지로 이동합니다.

{% include post-image.html name="General_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_55_02.png" alt="mmistakes" %}

코드 저장소의 이름을 바꿔줘야 합니다.

무조건 자기 자신의 [githubID.github.io](http://githubID.github.io)

저의 경우, 제 닉네임은 ruyshy 이므로 [ruyshy.github.io](http://ruyshy.github.io) 로 설정해줍니다.

{% include post-image.html name="ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_59_32.png" alt="mmistakes" %}

다음으로 Code로 돌아가서 **_config.yml**을 클릭해서 해당 파일로 들어갑니다.

{% include post-image.html name="ruyshy.github.io__config.yml_at_main__ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_2_01_54.png" alt="mmistakes" %}

화면과 같이 펜모양 버튼을 눌러, 하단 메뉴인 Edit in place를 클릭하여 편집 화면으로 넘어갑니다.

 url                      : "[https://ruyshy.github.io](https://ruyshy.github.io/)"

제일 먼저 url을 위 형식처럼 변경해줍니다.

{% include post-image.html name="Editing_ruyshy.github.io__config.yml_at_main__ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_2_11_22.png" alt="mmistakes" %}

변경 후, Commit changes…를 눌러 편집 완료를 진행합니다.

이 작업을 통해 자신의 블로그를 접속하실 수 있게 됩니다.

{% include post-image.html name="ruyshys_blog_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_2_13_31.png" alt="mmistakes" %}

다음으로 자신의 블로그 홈페이지([https://ruyshy.github.io/](https://ruyshy.github.io/))를 들어가서 정상적으로 만들어졌는지 확인합니다. 제 블로그는 이미 작성이 되어있기 때문에 저와 다르게 보이긴 해도 블로그에 접속하실 수 있습니다.

# Blog Post 작성 방법

{% include post-image.html name="ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_5_06_32.png" alt="mmistakes" %}

다시 GitHub 저장소로 돌아와서 Add file 버튼을 눌러 Create new file을 선택합니다.

{% include post-image.html name="New_File_at____ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_5_08_36.png" alt="mmistakes" %}

입력 칸에 _posts/ 를 입력해 폴더를 만들어줍니다.

다음 입력 칸에 포스트 파일을 작성할 것인데, 작성할 때, 형식은 다음과 같습니다.

예시) [YYYY-MM-DD-PostName.md](http://YYYY-MM-DD-PostName.md) (2025-04-10-TestPost.md)

.md 확장자는 마크다운 파일 형식입니다.

[https://mmistakes.github.io/minimal-mistakes/docs/configuration/#paginate-v2](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#paginate-v2)

해당 홈페이지에 들어가면

{% include post-image.html name="image.png" alt="mmistakes" %}

살짝 스크롤을 내려보면 

Then, create `/posts/index.html` with the following content:
밑에 코드 블럭을 복사해서 깃허브 코드에 붙여줍니다.

{% include post-image.html name="image%201.png" alt="mmistakes" %}

입력 후, 아래 줄에 아무 텍스트나 적어서 테스트를 진행 해봅시다.

편집이 다 끝나면, Commit changes… 을 눌러 저장소에 적용합니다.

{% include post-image.html name="Workflow_runs__ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_5_50_39.png" alt="mmistakes" %}

적용 후, Action을 눌러 가보면 맨위에 노란색으로 뜨며 해당 액션을 눌러서 보면

{% include post-image.html name="image%202.png" alt="mmistakes" %}

이런식으로 빌드가 진행되고 있습니다.

{% include post-image.html name="image%203.png" alt="mmistakes" %}
위 스크린샷처럼 완료가 되면 홈페이지에 적용이 됩니다.

 

{% include post-image.html name="image%204.png" alt="mmistakes" %}

포스트 작성까지 진행이 되었습니다.

Posts를 눌러 작성이 된 내용이 뛰워지는 것을 확인할 수 있습니다.

{% include post-image.html name="image%205.png" alt="mmistakes" %}
