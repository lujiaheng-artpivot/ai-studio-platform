import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(`
<!DOCTYPE html>
<html>
<head>
  <title>Error Monitor</title>
  <style>
    body {
      font-family: monospace;
      background: #1a1a1a;
      color: #fff;
      padding: 20px;
    }
    .error {
      background: #ff4444;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .log {
      background: #333;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>Checking /sign-in page errors...</h1>
  <div id="output"></div>
  
  <script>
    const output = document.getElementById('output');
    const errors = [];
    
    // Capture console errors
    const originalError = console.error;
    console.error = function(...args) {
      errors.push({ type: 'error', message: args.join(' ') });
      originalError.apply(console, args);
    };
    
    // Capture window errors
    window.addEventListener('error', (e) => {
      errors.push({ 
        type: 'window-error', 
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      });
    });
    
    // Load sign-in page in iframe
    const iframe = document.createElement('iframe');
    iframe.src = '/sign-in';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    document.body.appendChild(iframe);
    
    // Wait and display errors
    setTimeout(() => {
      if (errors.length === 0) {
        output.innerHTML = '<div class="log">No errors detected!</div>';
      } else {
        output.innerHTML = errors.map(e => 
          \`<div class="error">
            <strong>\${e.type}</strong><br>
            \${JSON.stringify(e, null, 2)}
          </div>\`
        ).join('');
      }
      
      // Also check iframe content
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const iframeBody = iframeDoc.body;
        output.innerHTML += \`
          <div class="log">
            <strong>Iframe body content length:</strong> \${iframeBody ? iframeBody.innerHTML.length : 0}<br>
            <strong>Iframe has SignIn component:</strong> \${iframeBody && iframeBody.innerHTML.includes('clerk') ? 'Yes' : 'No'}
          </div>
        \`;
      } catch (e) {
        output.innerHTML += \`<div class="error">Cannot access iframe: \${e.message}</div>\`;
      }
    }, 5000);
  </script>
</body>
</html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
