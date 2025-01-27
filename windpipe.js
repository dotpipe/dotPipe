const { app, BrowserWindow } = require('electron');
const dotpipe = require('./dotpipe.js');

function createWindow(modalaJSON) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const androidHierarchy = dotpipe.createAndroidHierarchy(modalaJSON);
  const htmlContent = convertAndroidToHtml(androidHierarchy);

  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
}

function convertAndroidToHtml(androidHierarchy) {
  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8">';
  html += '<script src="dotpipe.js"></script>';
  html += '</head><body>';

  function processElement(element) {
    let tag = mapAndroidToHtmlTag(element['@android:id'].split('_')[1]);
    html += `<${tag}`;
    
    for (let attr in element) {
      if (attr.startsWith('@android:')) {
        let htmlAttr = mapAndroidAttrToHtml(attr.substring(9));
        html += ` ${htmlAttr}="${element[attr]}"`;
      }
    }

    html += '>';

    for (let child in element) {
      if (typeof element[child] === 'object') {
        processElement(element[child]);
      }
    }

    if (element['@android:text']) {
      html += element['@android:text'];
    }

    html += `</${tag}>`;
  }

  processElement(androidHierarchy['LinearLayout']);

  html += '<script>document.addEventListener("DOMContentLoaded", function() { domContentLoad(); });</script>';
  html += '</body></html>';

  return html;
}

function mapAndroidToHtmlTag(androidTag) {
  const tagMap = {
    'LinearLayout': 'div',
    'TextView': 'p',
    'ImageView': 'img',
    'Button': 'button',
    'EditText': 'input',
    'ListView': 'ul',
    'ScrollView': 'div'
  };
  return tagMap[androidTag] || 'div';
}

function mapAndroidAttrToHtml(androidAttr) {
  const attrMap = {
    'layout_width': 'style="width:',
    'layout_height': 'style="height:',
    'text': 'textContent',
    'src': 'src',
    'onClick': 'onclick'
  };
  return attrMap[androidAttr] || androidAttr;
}

app.whenReady().then(() => {
  const modalaJSON = require('./input.json');
  createWindow(modalaJSON);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(modalaJSON);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});