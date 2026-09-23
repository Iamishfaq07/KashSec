/* FIRST/Red Hat's BSD-2-Clause reference scorer runs in a dedicated worker.
   Its original calculator uses global variables; isolation keeps those out of
   KashSec's app and makes this tool load only when opened. See LICENSE. */
importScripts(
  'cvss_config.js', 'metrics.js', 'cvss_lookup.js',
  'max_composed.js', 'max_severity.js', 'cvss_score.js'
);

const defaults = {};
for (const type of Object.values(cvssConfig)) {
  for (const group of Object.values(type.metric_groups)) {
    for (const metric of Object.values(group)) defaults[metric.short] = metric.selected;
  }
}

self.postMessage({ type:'ready', config:cvssConfig, defaults });
self.onmessage = ({data}) => {
  if(data?.type !== 'score') return;
  try {
    const selected = {...defaults, ...data.selected};
    const vector = 'CVSS:4.0/' + Object.keys(expectedMetricOrder)
      .filter(key => selected[key] && selected[key] !== 'X')
      .map(key => `${key}:${selected[key]}`).join('/');
    const score = cvss_score(selected, cvssLookup_global, maxSeverity, macroVector(selected));
    if(!Number.isFinite(score)) throw new Error('Invalid CVSS v4.0 metric combination');
    self.postMessage({type:'score', score, vector});
  } catch(error) {
    self.postMessage({type:'error', message:error.message});
  }
};
