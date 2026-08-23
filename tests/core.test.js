'use strict';
const assert = require('node:assert/strict');
const Core = require('../js/core.js');

(function testNormalizeReference() {
  assert.equal(Core.normalizeReference(' ven - 001 '), 'VEN-001');
  assert.equal(Core.normalizeReference('abc 123'), 'ABC123');
})();

(function testCompletion() {
  const empty = Core.calculateCompletion({});
  const filled = Core.calculateCompletion({
    occurrenceDate:'2026-08-23', agentName:'A', clientName:'C', establishmentName:'E', address:'M',
    equipmentReference:'R', faultCategory:'F', faultDescription:'D', customerContact:'9', openingHours:'8-20', symptom:'S', routingCode:'PT 32', noteNumber:'1'
  });
  assert.equal(empty, 0);
  assert.equal(filled, 100);
})();

(function testDuplicates() {
  const records = [
    { id:'1', equipmentReference:'VEN-1', status:'IN_PROGRESS', archived:false, occurrenceDate:'2026-08-20', updatedAt:'2026-08-20T10:00:00Z' },
    { id:'2', equipmentReference:'VEN-2', status:'IN_PROGRESS', archived:false, occurrenceDate:'2026-08-20', updatedAt:'2026-08-20T10:00:00Z' },
    { id:'3', equipmentReference:'VEN-1', status:'CLOSED', archived:false, occurrenceDate:'2026-08-20', updatedAt:'2026-08-20T10:00:00Z' },
  ];
  const hits = Core.findDuplicates(records, { id:'x', equipmentReference:' ven-1 ', occurrenceDate:'2026-08-23' }, { days:14 });
  assert.deepEqual(hits.map(x=>x.id), ['1']);
})();

(function testRouting() {
  const rules = [
    { code:'PT 32', active:true, equipmentType:'Frio', symptom:'Não liga', faultCategory:'' },
    { code:'PT 60', active:true, equipmentType:'Frio', symptom:'', faultCategory:'' },
  ];
  const result = Core.suggestRouting(rules, { equipmentType:'Frio', symptom:'Não liga', faultCategory:'Avaria técnica' });
  assert.equal(result.rule.code, 'PT 32');
  assert.equal(result.rule.specificity, 2);
})();

(function testRoutingAmbiguity() {
  const rules = [
    { code:'PT 32', active:true, equipmentType:'Frio', symptom:'', faultCategory:'' },
    { code:'PT 60', active:true, equipmentType:'Frio', symptom:'', faultCategory:'' },
  ];
  const result = Core.suggestRouting(rules, { equipmentType:'Frio' });
  assert.equal(result.rule, null);
  assert.equal(result.ambiguous, true);
})();

(function testDiff() {
  const changes = Core.diffRecord({clientName:'A', status:'REGISTERED'}, {clientName:'B', status:'REGISTERED'}, ['clientName','status']);
  assert.equal(changes.length, 1);
  assert.equal(changes[0].field, 'clientName');
})();

(function testTemplate() {
  const out = Core.applyTemplate('{{id}} - {{client}} - {{equipment}}', { displayId:'REG-1', clientName:'Café', equipmentReference:'VEN-1' });
  assert.equal(out, 'REG-1 - Café - VEN-1');
})();

(function testCsv() {
  assert.equal(Core.safeCsvCell('a"b'), '"a""b"');
})();

console.log('Core tests: OK');
