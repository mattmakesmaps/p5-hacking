import os
from string import Template

html_template = Template("""<DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <title>p5.js example</title>
    <style> body {padding: 0; margin: 0;} canvas {vertical-align: top;} </style>
    <script src="../p5/p5.min.js"></script>
    <script src="../addons/p5.dom.min.js"></script>
    <script src="../addons/p5.sound.min.js"></script>
    <script src="../p5.gui/libraries/p5.gui.js"></script>
    <script src="../p5.gui/libraries/quicksettings.js"></script>
    <script src="${fileName}"></script>
  </head>
  <body>
  </body>
</html>""")

if __name__ == "__main__":
    # Get JS Files 
    examplePath = os.path.join(os.getcwd(), 'examples')
    jsFiles = [f for f in os.listdir(examplePath) if f.endswith('js')]
    print(jsFiles)

    for jsFilename in jsFiles:
        htmlFilename = jsFilename.replace('.js', '.html')
        htmlPath = os.path.join(examplePath, htmlFilename)

        with open(htmlPath, 'w') as htmlFileHandle:
            contents = html_template.substitute({'fileName': jsFilename})
            htmlFileHandle.write(contents)