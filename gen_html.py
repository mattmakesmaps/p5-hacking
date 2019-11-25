import os
from string import Template

htmlTemplateIndex = Template("""<DOCTYPE html>
<html lang="">
  <head>
    <link href="https://fonts.googleapis.com/css?family=Public+Sans&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Public Sans', sans-serif;
        font-size: 36px;
      }
    </style>
    <meta charset="utf-8">
    <title>Examples</title>
  </head>
  <body>
    <h2>Examples</h2>
    <ul>
        ${htmlFiles}
    </ul>
  </body>
</html>""")

htmlTemplateIndexLinkElement = Template('<li><a href="${relURL}">${exampleName}</a></li>\n')

htmlTemplateExample = Template("""<DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <title>${fileName}</title>
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

    htmlFilesString = ''

    for jsFilename in jsFiles:
        # Create links to the HTML pages for each example 
        # To be used in index.html
        htmlFilename = jsFilename.replace('.js', '.html')
        htmlLinkElement = htmlTemplateIndexLinkElement.substitute({
            'relURL': './examples/' + htmlFilename,
            'exampleName': htmlFilename
        })
        htmlFilesString = htmlFilesString + htmlLinkElement

        # Create the HTML pages for each example
        htmlPath = os.path.join(examplePath, htmlFilename)
        if not os.path.isfile:
          with open(htmlPath, 'w') as htmlFileHandle:
              contents = htmlTemplateExample.substitute({'fileName': jsFilename})
              htmlFileHandle.write(contents)

    # Create index.html
    htmlIndexFilePath = os.path.join(os.getcwd(), 'index.html')
    with open(htmlIndexFilePath, 'w') as htmlIndexFileHandle:
        contents = htmlTemplateIndex.substitute({'htmlFiles': htmlFilesString})
        htmlIndexFileHandle.write(contents)
    
    print('Done')