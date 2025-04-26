---
title: "GitHub Blog 카드 링크 플러그인 만들기"
description: "Jekyll 블로그에서 외부 링크를 깔끔한 카드 형식으로 표시하는 Liquid 플러그인 구현 방법을 소개합니다. OG 태그 기반 링크 미리보기를 직접 구현해보세요."
date: 2025-04-24
tags:
  [
    GitHubBlog,
    link preview,
    liquid plugin,
    jekyll plugin,
    open graph,
    javascript,
  ]
---

GitHub Pages 기반 Jekyll 블로그에서 외부 링크를 자동으로 카드 형식으로 만들어주는 **링크 카드 플러그인**, **OG 태그 기반 미리보기 카드**, **Liquid 태그 확장**을 구현하고 싶다면 이 글을 참고하세요.

### 링크 카드 미리 보기

{% cardlink https://jekyllrb.com/ %}

### /plugins/cardlink_tag.rb 추가

```ruby
require 'open-uri'
require 'nokogiri'
require 'uri'

module Jekyll
  class CardLink < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @url = markup.strip
    end

    def render(_context)
      begin
        html = URI.open(@url, "User-Agent" => "JekyllCardPreviewBot").read
        doc = Nokogiri::HTML(html)

        title = doc.at('meta[property="og:title"]')&.[]('content') || @url
        description = doc.at('meta[property="og:description"]')&.[]('content') || ""
        image = doc.at('meta[property="og:image"]')&.[]('content') || ""
        host = URI.parse(@url).host

        <<~HTML
        <div style="margin: 1em 0;">
          <a href="#{@url}" target="_blank" rel="noopener" style="text-decoration: none; color: inherit;">
            <div style="display: flex; background: #f5f5f5; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              #{image != "" ? "<img src=\"#{image}\" alt=\"thumbnail\" style=\"width: 40%; object-fit: cover;\">" : ""}
              <div style="padding: 1em; flex: 1;">
                <h3 style="margin: 0; color: #1a73e8; font-size: 1.1em; line-height: 1.4;">#{title}</h3>
                <p style="margin: 0.5em 0 0 0; color: #555; font-size: 0.9em; line-height: 1.4;">#{description}</p>
                <small style="color: #999;">#{host}</small>
              </div>
            </div>
          </a>
        </div>
        HTML
      rescue => e
        "<p style='color:red;'>[cardlink error] #{@url} - #{e.message}</p>"
      end
    end
  end
end

Liquid::Template.register_tag('cardlink', Jekyll::CardLink)

```

### Gemfile 해당 코드 추가

```
gem 'nokogiri'
```

해당 코드 추가 후, 로컬에서 실행하기 위해서 bundle install 을 진행해주세요!

### 사용 방법

{% raw %}`{% cardlink https://jekyllrb.com/ %}`{% endraw %}
