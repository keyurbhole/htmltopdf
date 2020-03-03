# HTML To PDF using AWS Lambda Functions and Layers with Serverless

[html-pdf](https://www.npmjs.com/package/html-pdf) is used to convert html to pdf

## Prerequisite
1. [Nodejs](https://nodejs.org/en/download/)
2. Install Serverless globally 

```bash 
npm i -g serverless
```

## Getting Started
Install all dependencies
```bash
cd path/to/the/repo
npm install
```

To run Locally
```bash
cd htmlToPdf/
sls offline start
```
Make sure the following lines are commented to run locally
```javascript
htmlToPdf/handler.js

pdf.create(html, {
    format: "Letter",
    orientation: "portrait",
    // phantomPath: '/opt/phantomjs_linux-x86_64'
}).toBuffer((err, buffer) => {
    if (err) {
        reject(err)
    } else {
        resolve(buffer)
    }
});
```

```yml
htmlToPdf/serverless.yml

htmlToPdf:
    handler: handler.htmlToPdf
    # layers:
    #   - ${cf:executables-layer-${self:provider.stage}.HtmlToPdfLayerExport}
    events:
      - http:
          path: api/htmltopdf
          method: get
          cors: true
          integration: lambda
```

## Setting Environment
The following environment variables must be set before the function. If not set the pdf will not be generated or else the pdf will contain black dots.
```javascript
process.env.PATH = `${process.env.PATH}:/opt`
process.env.FONTCONFIG_PATH = '/opt'
process.env.LD_LIBRARY_PATH = '/opt'
```

[AWS Environment Variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)

## Deployment
Step 1. First deploy the layer.
```bash
cd layers/
sls deploy
```

Step 2. Deploy the main service that will be converting html to pdf
```bash
cd htmlToPdf/
sls deploy
```

## Example 
1. Plain HTML
```javascript
let html = `<h1>This is a example to convert html to pdf<h1>`
let file = await exportHtmlToPdf(html)
```
[sample.pdf](sample.pdf)

2. With Template Engine(hbs)
```javascript
import handlebars from 'handlebars'


let html = `<h1>This is a example to convert html to pdf</h1><br /><b>{{template}}</b>`

html = handlebars.compile(html)({ template: 'HBS' })

let file = await exportHtmlToPdf(html)
```
[sample(hbs).pdf](sample(hbs).pdf)

### Template Engines
To generate HTML with dynamic data there are some popular template engines like hbs, pug, Mustache, ejs, etc.<br />

For list of template engines visit [Template Engines](https://github.com/expressjs/express/wiki#template-engines)


## More Fonts
For more fonts add .ttf font files in executable folder and redeploy the layer and the redeploy the other service so the function is pointing to the latest Lambda Layer

## Reference
1. https://github.com/naeemshaikh27/phantom-lambda-fontconfig-pack
