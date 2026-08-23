(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AppCore = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const OPEN_STATUSES = new Set(['DRAFT', 'REGISTERED', 'IN_PROGRESS', 'SENT', 'IN_TREATMENT', 'WAITING_RESPONSE']);

  function normalizeText(value) {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleLowerCase('pt-PT');
  }

  function normalizeReference(value) {
    return String(value ?? '').trim().replace(/\s+/g, '').toUpperCase();
  }

  function calculateCompletion(record) {
    const fields = [
      'occurrenceDate', 'agentName', 'clientName', 'establishmentName', 'address',
      'equipmentReference', 'faultCategory', 'faultDescription', 'customerContact',
      'openingHours', 'symptom', 'routingCode', 'noteNumber'
    ];
    const required = new Set(['occurrenceDate', 'agentName', 'clientName', 'establishmentName', 'address', 'equipmentReference', 'faultCategory', 'faultDescription']);
    let score = 0;
    let max = 0;
    fields.forEach((field) => {
      const weight = required.has(field) ? 2 : 1;
      max += weight;
      if (String(record?.[field] ?? '').trim()) score += weight;
    });
    return max ? Math.round((score / max) * 100) : 0;
  }

  function findDuplicates(records, candidate, options = {}) {
    const reference = normalizeReference(candidate?.equipmentReference);
    if (!reference) return [];
    const excludeId = options.excludeId || candidate?.id || '';
    const days = Number(options.days || 14);
    const occurrence = candidate?.occurrenceDate ? new Date(`${candidate.occurrenceDate}T12:00:00`) : new Date();
    const maxDelta = days * 24 * 60 * 60 * 1000;

    return (records || []).filter((record) => {
      if (!record || record.id === excludeId || record.archived || !OPEN_STATUSES.has(record.status)) return false;
      if (normalizeReference(record.equipmentReference) !== reference) return false;
      const dateValue = record.occurrenceDate ? new Date(`${record.occurrenceDate}T12:00:00`) : new Date(record.createdAt || 0);
      if (Number.isNaN(dateValue.getTime())) return true;
      return Math.abs(dateValue - occurrence) <= maxDelta;
    }).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  }

  function routingSpecificity(rule) {
    return ['equipmentType', 'symptom', 'faultCategory'].reduce((count, key) => count + (String(rule?.[key] ?? '').trim() ? 1 : 0), 0);
  }

  function routingMatches(rule, record) {
    if (!rule?.active) return false;
    const specificity = routingSpecificity(rule);
    if (!specificity) return false;
    for (const key of ['equipmentType', 'symptom', 'faultCategory']) {
      const expected = normalizeText(rule[key]);
      if (expected && expected !== normalizeText(record?.[key])) return false;
    }
    return true;
  }

  function suggestRouting(rules, record) {
    const matches = (rules || [])
      .filter((rule) => routingMatches(rule, record))
      .map((rule) => ({ ...rule, specificity: routingSpecificity(rule) }))
      .sort((a, b) => b.specificity - a.specificity || String(a.code).localeCompare(String(b.code), 'pt-PT'));
    if (!matches.length) return { rule: null, ambiguous: false, matches: [] };
    const top = matches[0];
    const peers = matches.filter((match) => match.specificity === top.specificity);
    const uniqueCodes = new Set(peers.map((match) => match.code));
    return { rule: uniqueCodes.size === 1 ? top : null, ambiguous: uniqueCodes.size > 1, matches };
  }

  function diffRecord(previous, current, fields) {
    if (!previous) return [];
    const list = fields || Object.keys(current || {});
    const changes = [];
    for (const field of list) {
      const before = previous?.[field];
      const after = current?.[field];
      if (JSON.stringify(before ?? null) !== JSON.stringify(after ?? null)) {
        changes.push({ field, before: before ?? '', after: after ?? '' });
      }
    }
    return changes;
  }

  function applyTemplate(template, record, extra = {}) {
    const values = {
      id: record?.displayId || '',
      date: record?.occurrenceDate || '',
      agent: record?.agentName || '',
      taxpayer: record?.taxpayerNumber || '',
      client: record?.clientName || '',
      contact: record?.contactName || '',
      phone: record?.customerContact || '',
      establishment: record?.establishmentName || '',
      address: record?.address || '',
      locality: record?.locality || '',
      equipment: record?.equipmentReference || '',
      equipmentType: record?.equipmentType || '',
      faultCategory: record?.faultCategory || '',
      symptom: record?.symptom || '',
      fault: record?.faultDescription || '',
      pt: record?.routingCode || '',
      note: record?.noteNumber || '',
      observations: record?.observations || '',
      ...extra,
    };
    return String(template ?? '').replace(/\{\{\s*([a-zA-Z][\w]*)\s*\}\}/g, (_, key) => String(values[key] ?? ''));
  }

  function safeCsvCell(value) {
    const text = String(value ?? '').replaceAll('"', '""');
    return `"${text}"`;
  }

  return {
    OPEN_STATUSES,
    normalizeText,
    normalizeReference,
    calculateCompletion,
    findDuplicates,
    routingSpecificity,
    routingMatches,
    suggestRouting,
    diffRecord,
    applyTemplate,
    safeCsvCell,
  };
});
