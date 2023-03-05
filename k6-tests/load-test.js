import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  stages: [
    { target: `${__ENV.VUS}`, duration: `${__ENV.RAMP_UP}` },
    { target: `${__ENV.VUS}`, duration: `${__ENV.STEADY}` },
    { target: 0, duration: `${__ENV.RAMP_DOWN}` }
  ]
};
export default function () {
  const req = http.get(`http://${__ENV.BASE_URL}/api/fights/randomfighters`);
  check(req, {
    'is status 200': (r) => r.status == 200,
  });
  sleep(1)
  const request = http.get(`http://${__ENV.BASE_URL}/api/fights`);
  sleep(1)
}
//    '${__ENV.REPORT_DIR}/summary.json': JSON.stringify(data), 
//    '/workspace/reports/summary.json': JSON.stringify(data), 
//    '/workspace/report/summary.html': htmlReport(data), 
export function handleSummary(data) {
  return {
    '/workspace/cms/integration.result': JSON.stringify(data), 
    '/workspace/cms/summary.html': htmlReport(data), 
    'stdout': textSummary(data, { indent: ' ', enableColors: true })
  };
}
