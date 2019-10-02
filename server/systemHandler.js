const fs = require('fs');
const path = require('path');
const { sysPaths } = require('./systemPaths');
const mammoth = require('mammoth');
const trash = require('trash');


function getFiles(basePath, filter, ignore) {
    if (!fs.existsSync(basePath)) {
        console.log('no dir', basePath);
        return;
    }
    let results = [];
    var files = fs.readdirSync(basePath);

    for (var i = 0; i < files.length; i++) {
        var filename = path.join(basePath, files[i]);
        if (ignore.indexOf(files[i]) >= 0)
            continue;
        var stat = fs.statSync(filename);
        if (stat.isDirectory()) {
            results = results.concat(getFiles(filename, filter, ignore));
        } else {
            var extIndex = filename.lastIndexOf('.');
            var ext = filename.slice(extIndex);
            if (filter.indexOf(ext) >= 0) {
                results.push({
                    filename, stat
                })
            }
        }
    }

    return results;
}

function findFiles() {
    const filter = ['.docx', 'doc'];
    const ignore = ['node_modules', '$RECYCLE.BIN', 'System Volume Information', '.git'];
    let results = [];
    sysPaths.forEach(val => {
        console.log(val);
        results = results.concat(getFiles(val, filter, ignore));
    });

    return results;
}

function createBuffer(pdfPath, thumbnailPath) {
    let buffer = fs.readFileSync(thumbnailPath);
    fs.unlinkSync(pdfPath);
    fs.unlinkSync(thumbnailPath);

    return buffer;
}

async function getPreview(filePath, puppeteerBrowser) {
    
    try {
        const fileName = filePath.slice(filePath.lastIndexOf(path.sep) + 1);

        let results = await mammoth.convertToHtml({path: filePath});
        let html = results.value;
        const page = await puppeteerBrowser.newPage();
        await page.setViewport({width: 595, height: 842});
        await page.setContent(html, {waitUntil: "load"})

        let buffer = await page.screenshot({});
        return buffer;
    } catch (error) {
        throw error;
    }

}

async function deleteFile(filePath) {
    try { 
        if(!fs.existsSync(filePath))
            throw new Error();
        
        await trash(filePath);
    } catch (error) {
        console.log("throwing error")
        throw new Error();
    }
}

module.exports = {
    findFiles,
    getPreview,
    deleteFile
}
