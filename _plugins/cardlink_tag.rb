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
