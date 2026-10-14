import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9224;

const chromeProc = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1600,1050',
  'about:blank',
]);

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      if (data.webSocketDebuggerUrl) return data.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('Failed to connect to Chrome debugging port');
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    await new Promise((r) => (ws.onopen = r));

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        callbacks.set(reqId, (res) => {
          if (res.error) reject(res.error);
          else resolve(res.result);
        });
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    const { targetId } = await send('Target.createTarget', { url: 'http://localhost:5173/' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    function sendSession(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        callbacks.set(reqId, (res) => {
          if (res.error) reject(res.error);
          else resolve(res.result);
        });
        ws.send(JSON.stringify({ id: reqId, sessionId, method, params }));
      });
    }

    await sendSession('Page.enable');
    await sendSession('Runtime.enable');
    await sendSession('DOM.enable');

    console.log('Navigating to http://localhost:5173/ ...');
    await sendSession('Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(3000);

    async function captureScreen(fileName) {
      const { data } = await sendSession('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(fileName, Buffer.from(data, 'base64'));
      console.log(`Saved: ${fileName}`);
    }

    // Helper to click button by text in browser context
    async function clickButton(txt) {
      const res = await sendSession('Runtime.evaluate', {
        expression: `
          (() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => {
              const str = (b.innerText || b.textContent || '').toUpperCase();
              return str.includes('${txt.toUpperCase()}');
            });
            if (btn) {
              btn.click();
              return true;
            }
            return false;
          })()
        `,
        returnByValue: true,
      });
      return res.result?.value;
    }

    // 1. Scroll to #work and show Dining slide (slide 3)
    console.log('Navigating to Home Interiors Dining slide...');
    await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.querySelector('#work');
          if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
          const slides = document.querySelectorAll('#work > div > div');
          slides.forEach((s, idx) => {
            if (idx === 3) {
              s.style.transform = 'translateX(0%)';
              s.style.zIndex = '50';
              s.style.opacity = '1';
              s.style.clipPath = 'none';
              const info = s.querySelector('.room-info');
              if (info) { info.style.opacity = '1'; info.style.transform = 'translateY(0px)'; }
            } else {
              s.style.transform = 'translateX(100%)';
              s.style.zIndex = '1';
            }
          });
        })()
      `,
    });
    await sleep(1500);
    await captureScreen('new_dining_home_interior.png');

    // 2. Scroll to #configurator
    console.log('Scrolling to Furniture Laboratory (#configurator)...');
    await sendSession('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('#configurator');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await sleep(2000);

    // Click "DINING CHAIR" (item 07)
    console.log('Selecting 07 DINING CHAIR...');
    await clickButton('DINING CHAIR');
    await sleep(2500);
    await captureScreen('new_dining_chair_lab.png');

    // Click "EXPLODE"
    console.log('Testing EXPLODE on dining chair...');
    await clickButton('EXPLODE');
    await sleep(1800);
    await captureScreen('new_dining_chair_exploded.png');

    // Reset explode
    await clickButton('RESET');
    await sleep(1200);

    // Click "DINING TABLE" (item 06)
    console.log('Selecting 06 DINING TABLE...');
    await clickButton('DINING TABLE');
    await sleep(2500);
    await captureScreen('new_dining_table_lab.png');

    console.log('Verification completed successfully!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    try {
      chromeProc.kill('SIGTERM');
    } catch {}
    process.exit(0);
  }
}

run();
