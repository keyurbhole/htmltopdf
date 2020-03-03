import pdf from 'html-pdf'
import handlebars from 'handlebars'
import AWS from 'aws-sdk'

process.env.PATH = `${process.env.PATH}:/opt`
process.env.FONTCONFIG_PATH = '/opt'
process.env.LD_LIBRARY_PATH = '/opt'

export const htmlToPdf = async event => {
    try {
        // Initialize s3 Object
        const s3 = new AWS.S3();
        // Define the bucket to use
        let Bucket = process.env.S3_BUCKET
        // path to sample html file stored in s3
        let Key = `html/sample.html`

        // hardcode the HTML string
        let html = `<h1>This is a example to convert html to pdf</h1><br /><b>{{template}}</b>`

        // OR get the html file from s3
        // let { Body } = await s3.getObject({ Bucket, Key }).promise()
        // // Body will be a buffer type so need to convert it to string before converting to pdf
        // html = Body.toString()

        // OR get the HTML string from request body
        // html = event.body.html

        // To generate HTML with dynamic data there are some popular template engines 
        // like hbs, pug, Mustache, ejs, etc.
        // For list of template engines visit https://github.com/expressjs/express/wiki#template-engines 
        // In this example we will be using handlebars(hbs)
        html = handlebars.compile(html)({ template: 'HBS' })

        let file = await exportHtmlToPdf(html)
        // path where sample.pdf file will stored in s3
        Key = `pdf/sample.pdf`
        return await s3.putObject({ Bucket, Key, Body: file }).promise()
    } catch (error) {
        return error
    }
}

/**
 * 
 * @param {string} html 
 * takes html string as input and convert it into Buffer
 */
const exportHtmlToPdf = html => {
    return new Promise((resolve, reject) => {
        pdf.create(html, {
            format: "Letter",
            orientation: "portrait",
            // This is the path for compiled phantomjs executable stored in layer.
            // To test locally comment out the following line.
            phantomPath: '/opt/phantomjs_linux-x86_64'
        }).toBuffer((err, buffer) => {
            if (err) {
                reject(err)
            } else {
                resolve(buffer)
            }
        });
    })
}
