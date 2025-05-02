require 'set'

module Jekyll
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      seen = Set.new
      site.tags.each do |tag, posts|
        next if seen.include?(tag)
        seen.add(tag)

        dir = File.join('tags', Jekyll::Utils.slugify(tag))
        site.pages << TagPage.new(site, site.source, dir, tag)
      end
    end
  end

  class TagPage < Page
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag_archive.html')
      self.data['tag'] = tag
      self.data['title'] = "Tag: #{tag}"
      self.data['entries_layout'] = 'list'
    end
  end
end
