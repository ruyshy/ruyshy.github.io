module Jekyll
    class ToggleText < Liquid::Block
      def initialize(tag_name, markup, tokens)
        super
        if markup =~ /(.*?)\s+class=["']([^"']+)["']/
          @label = $1.strip
          @extra_class = $2.strip
        else
          @label = markup.strip
          @extra_class = ""
        end
      end
  
      def render(context)
        site = context.registers[:site]
        converter = site.find_converter_instance(Jekyll::Converters::Markdown)
        content = converter.convert(super)
      
        id = "toggle-#{rand(36**6).to_s(36)}"
        label = @label.strip
      
        <<~HTML
          <div class="toggle">
            <div class="toggle-label #{@extra_class}" onclick="toggleTextContent('#{id}', this)" data-label="#{label}">
            </div>
            <div id="#{id}" class="toggle-body" style="display: none; max-height: 0;">
              #{content}
            </div>
          </div>
        HTML
      end      
    end
  end
  
  Liquid::Template.register_tag('toggle', Jekyll::ToggleText)