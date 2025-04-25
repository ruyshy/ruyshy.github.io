module Jekyll
    class RevealBlock < Liquid::Block
      @@counter = 0
  
      def initialize(tag_name, markup, tokens)
        super
        @params = {}
  
        markup.scan(/(\w+)=["']?(.*?)["']?(?= |$)/).each do |key, value|
          @params[key] = value.downcase
        end
      end
  
      def to_js_bool(val)
        return "true" if val == "true"
        return "false" if val == "false"
        "\"#{val}\""
      end
  
      def render(context)
        content = super
        @@counter += 1
        uid = "reveal#{@@counter}"
        slide_count = content.scan(/<section>/i).size
  
        js_options = {
          "embedded" => "true",
          "hash" => "false",
          "slideNumber" => "false",
          "center" => to_js_bool(@params["center"] || "false"),
          "controls" => to_js_bool(@params["controls"] || "true"),
          "loop" => to_js_bool(@params["loop"] || "false"),
          "transition" => "\"#{@params["transition"] || "slide"}\""
        }.map { |k, v| "#{k}: #{v}" }.join(",\n")
  
        <<~HTML
          <div class="reveal-embedded" id="#{uid}_container">
            <link rel="stylesheet" href="/assets/js/reveal/reveal.css">
            <link rel="stylesheet" href="/assets/js/reveal/reveal_black.css">
            <style>
              ##{uid}_container .reveal {
                width: 100%;
                height: 400px;
                margin: 2em auto;
                overflow: hidden;
                position: relative;
              }
              ##{uid}_container .custom-slide-number {
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10;
                color: white;
                font-size: 0.9em;
                font-weight: bold;
              }
            </style>
  
            <div class="reveal" id="#{uid}">
              <div class="slides">
                #{content}
              </div>
              <div class="custom-slide-number" id="#{uid}_slide_number">1 / #{slide_count}</div>
            </div>
  
            <script src="/assets/js/reveal/reveal.js"></script>
            <script>
              document.addEventListener('DOMContentLoaded', () => {
                const el = document.getElementById("#{uid}");
                if (!window._revealInstances) window._revealInstances = {};
  
                const deck = new Reveal(el, {
                  #{js_options}
                });
  
                deck.initialize().then(() => {
                  window._revealInstances["#{uid}"] = deck;
  
                  const indicator = document.getElementById("#{uid}_slide_number");
                  const total = #{slide_count};
                  deck.slide(0); // Always start at slide 0
  
                  const updateLabel = (index) => {
                    indicator.textContent = (index + 1) + " / " + total;
                  };
  
                  updateLabel(0);
                  deck.on("slidechanged", e => updateLabel(e.indexh));
                });
              });
  
              window.goToRevealSlide = function(id, index) {
                const instance = window._revealInstances?.[id];
                if (instance) instance.slide(index);
              };
            </script>
          </div>
        HTML
      end
    end
  end
  
  Liquid::Template.register_tag("reveal", Jekyll::RevealBlock)
  