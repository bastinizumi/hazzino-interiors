import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9227;

const chromeProc = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=375,812',
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
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });

    console.log('Navigating to http://localhost:5173/ at 375px mobile...');
    await sendSession('Page.navigate', { url: 'http://localhost:5173/' });
    await sleep(3500);

    const artifactDir = '/Users/apple/.gemini/antigravity-ide/brain/f9ea80d0-b72c-4125-a62a-dde4359d6c32';
    
    // Check horizontal overflow
    const overflowReport = await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const docWidth = document.documentElement.clientWidth;
          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > docWidth + 1 || rect.left < -1) {
              overflowing.push({
                tag: el.tagName,
                id: el.id,
                className: el.className?.toString ? el.className.toString() : '',
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
                docWidth
              });
            }
          });
          return overflowing.slice(0, 30);
        })()
      `,
      returnByValue: true,
    });

    console.log('Overflowing elements count:', overflowReport.result?.value?.length);
    console.log('Sample overflowing elements:', JSON.stringify(overflowReport.result?.value?.slice(0, 10), null, 2));

    // Capture mobile top screenshot
    const shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_01_hero.png`, Buffer.from(shot1.data, 'base64'));
    console.log('Saved mobile_01_hero.png');

    // Scroll to and capture configurator section
    await sendSession('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('#configurator');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await sleep(1500);
    const shot2 = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_02_configurator.png`, Buffer.from(shot2.data, 'base64'));
    console.log('Saved mobile_02_configurator.png');

    // Scroll to kitchen section
    await sendSession('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('#kitchen');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await sleep(1500);
    const shot3 = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_03_kitchen.png`, Buffer.from(shot3.data, 'base64'));
    console.log('Saved mobile_03_kitchen.png');

    // Scroll to contact section
    await sendSession('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('#contact');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await sleep(1500);
    const shot4 = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_04_contact.png`, Buffer.from(shot4.data, 'base64'));
    console.log('Saved mobile_04_contact.png');

    ws.close();
    chromeProc.kill();
  } catch (err) {
    console.error('Audit error:', err);
    chromeProc.kill();
    process.exit(1);
  }
}

run();
