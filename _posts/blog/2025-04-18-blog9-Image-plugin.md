---
title: "GitHub Blog 이미지 태그 플러그인 만들기 - Jekyll에서 커스텀 Liquid 태그로 이미지 처리 자동화"
description: "Jekyll 블로그에서 직접 만든 Liquid 플러그인을 통해 게시글 경로 기반으로 이미지를 자동으로 불러오는 {% img %} 커스텀 태그를 구현하는 방법을 소개합니다."
date: 2025-04-18
tags: [GitHub Blog, Jekyll, 이미지 태그, Liquid 플러그인, 커스텀 태그]
---

Jekyll 블로그에서 **이미지를 불러오는 태그를 매번 include로 작성하기 번거롭다면**,  
Liquid 플러그인을 직접 만들어 `post 경로 기반 자동 이미지 경로 지정`이 가능한  
`{% img %}` 커스텀 태그를 사용하는 것이 훨씬 효율적입니다.  
이 글에서는 **Jekyll 플러그인 구조부터 img 태그 구현까지** 모든 과정을 예제로 설명합니다.


## 기존 방식 과 태그 플러그인 비교

기존에 이미지 불러오는 방식:

```markdown
{% raw %}{% include post-image.html name="image.png" alt="image" %}{% endraw %}
```

플러그인 적용한 방식:

```markdown
{% raw %}{% img "image1.png", "tag image test" %}{% endraw %}
```

or

```markdown
{% raw %}{% img "image1.png" %}{% endraw %}
```


## \plugins\img_tag.rb 코드 추가

```ruby
module Jekyll
  class ImgTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
    end

    def render(context)
      args = @markup.split(",").map(&:strip)
      img_name = sanitize(args[0])
      alt_text = args.length > 1 ? sanitize(args[1]) : img_name

      page = context.registers[:page] || {}
      page_path = page['path'] || ''

      parts = page_path.split('/')

      idx = parts.find_index("_posts")
      if idx && parts.length > idx + 2
        category = parts[idx + 1]
        post_filename = parts[idx + 2]
      else
        category = ""
        post_filename = "unknown-post.md"
      end

      post_name = File.basename(post_filename, File.extname(post_filename))

      img_src = "/assets/images/#{category}/#{post_name}/#{img_name}"

      %(<img src="#{img_src}" alt="#{alt_text}" style="max-width:100%;">)
    end

    private

    def sanitize(text)
      text.gsub('"', '').gsub("'", '')
    end
  end
end

Liquid::Template.register_tag('img', Jekyll::ImgTag)

```

## 주의사항
해당 글 처럼 블로그 예시를 작성하기 위해
```
 {% raw %}{%{% endraw %} raw {% raw %}%}{% endraw %}
 {% raw %}{% img "test.png" %}{% endraw %}
 {% raw %}{%{% endraw %} endraw {% raw %}%}{% endraw %}
```
liquid 문법의 raw tag를 사용해야한다.


## 예시 사용법

| 작성 | 실제 결과 |
| --- | --- |
| `{% raw %}{% img "test.png" %}{% endraw %}` | `<img src="/assets/images/xxx/xxx/test.png" alt="test.png" style="max-width:100%;">` |
| `{% raw %}{% img "test.png", "설명" %}{% endraw %}` | `<img src="/assets/images/xxx/xxx/test.png" alt="설명" style="max-width:100%;">` |