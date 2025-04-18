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
