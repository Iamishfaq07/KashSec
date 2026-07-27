/* KashSec Academy — minimal PDF writer.
 *
 * Loaded on demand (see ensurePdf in app.js), only on the certificate and
 * transcript pages. Nothing else pulls it in.
 *
 * WHY NOT A LIBRARY
 * jsPDF is ~350KB minified for a job that here is text, rules and filled
 * rectangles on a handful of pages. More to the point, the whole site was
 * deliberately moved off third-party CDNs so lessons render when jsdelivr
 * is blocked; adding a CDN script back for a certificate would undo that,
 * and vendoring 350KB to draw ten lines of text is a poor trade. This is
 * ~8KB and uses only the 14 standard PDF fonts, which every reader has
 * built in — so there is no font to embed and no licence to worry about.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 * No images, no transparency, no embedded fonts, no compression, no
 * bookmarks. If any of those are ever needed, that is the point to
 * reconsider a real library rather than to grow this one.
 */
(function (global) {
  'use strict';

  const PT = { A4: [595.28, 841.89], A4L: [841.89, 595.28] };

  /* PDF strings are Latin-1/WinAnsi, not UTF-8. The site's copy is full of
     typographic punctuation (em dashes, curly quotes, middots) that would
     otherwise emit as mojibake or break the string entirely, so map the
     characters actually used to their WinAnsi bytes and transliterate the
     rest to a sane ASCII fallback. */
  const WINANSI = {
    '–': '\x96', '—': '\x97', '‘': '\x91', '’': '\x92',
    '“': '\x93', '”': '\x94', '•': '\x95', '…': '\x85',
    '·': '\xB7', '‹': '\x8B', '›': '\x9B', '™': '\x99',
    ' ': ' ',
  };
  const ASCII_FALLBACK = {
    '→': '->', '←': '<-', '≤': '<=', '≥': '>=',
    '×': 'x', '✓': 'v', '✗': 'x',
  };

  function encodeText(s) {
    let out = '';
    for (const ch of String(s == null ? '' : s)) {
      if (WINANSI[ch]) { out += WINANSI[ch]; continue; }
      if (ASCII_FALLBACK[ch]) { out += ASCII_FALLBACK[ch]; continue; }
      const c = ch.codePointAt(0);
      // Anything outside Latin-1 has no byte in this encoding. Dropping it
      // silently would mangle a name; '?' at least shows something happened.
      out += c <= 0xFF ? ch : '?';
    }
    // ( ) and \ are structural inside a PDF string literal.
    return out.replace(/[\\()]/g, m => '\\' + m);
  }

  /* Widths for the base-14 fonts, in 1/1000 em. Only Helvetica and
     Helvetica-Bold are used; carrying the full table would be dead weight,
     so this stores the widths for the printable ASCII range and falls back
     to the average for anything else. Good enough to centre and wrap text,
     which is all the measurement here is for. */
  const HELV = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
  const HELV_B = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];

  function charWidth(ch, bold) {
    const c = ch.charCodeAt(0);
    const table = bold ? HELV_B : HELV;
    if (c >= 32 && c <= 126) return table[c - 32];
    return bold ? 600 : 556;
  }
  function textWidth(s, size, bold) {
    let w = 0;
    for (const ch of String(s)) w += charWidth(ch, bold);
    return w * size / 1000;
  }

  function Doc(opts) {
    opts = opts || {};
    this.size = PT[opts.size] || PT.A4;
    this.pages = [];
    this.newPage();
  }

  Doc.prototype.newPage = function () {
    this.ops = [];
    this.pages.push(this.ops);
    return this;
  };

  Doc.prototype.width = function () { return this.size[0]; };
  Doc.prototype.height = function () { return this.size[1]; };

  const fmt = n => (Math.round(n * 100) / 100).toString();

  Doc.prototype.rect = function (x, y, w, h, color) {
    const [r, g, b] = color;
    this.ops.push(`${fmt(r)} ${fmt(g)} ${fmt(b)} rg ${fmt(x)} ${fmt(this.height() - y - h)} ${fmt(w)} ${fmt(h)} re f`);
    return this;
  };

  Doc.prototype.line = function (x1, y1, x2, y2, color, w) {
    const [r, g, b] = color || [0, 0, 0];
    const H = this.height();
    this.ops.push(`${fmt(r)} ${fmt(g)} ${fmt(b)} RG ${fmt(w == null ? 1 : w)} w ${fmt(x1)} ${fmt(H - y1)} m ${fmt(x2)} ${fmt(H - y2)} l S`);
    return this;
  };

  /* y is the text baseline measured from the TOP of the page, because every
     caller here lays out downwards. PDF's origin is bottom-left, so the
     flip happens once, here, rather than in every call site. */
  Doc.prototype.text = function (str, x, y, o) {
    o = o || {};
    const size = o.size || 11;
    const bold = !!o.bold;
    const [r, g, b] = o.color || [0, 0, 0];
    let tx = x;
    if (o.align === 'center') tx = x - textWidth(str, size, bold) / 2;
    else if (o.align === 'right') tx = x - textWidth(str, size, bold);
    this.ops.push(
      `BT ${fmt(r)} ${fmt(g)} ${fmt(b)} rg /${bold ? 'F2' : 'F1'} ${fmt(size)} Tf ` +
      `${fmt(tx)} ${fmt(this.height() - y)} Td (${encodeText(str)}) Tj ET`);
    return this;
  };

  /* Greedy word wrap. Returns the y baseline after the last line so callers
     can keep flowing without tracking line heights themselves.

     x is an ANCHOR, not always a left edge: it is handed to text() unchanged,
     so with align:'center' it is the centre line and with align:'right' it is
     the right edge. maxWidth only governs where lines break. Passing a left
     edge together with align:'center' silently shifts the whole block half a
     column left, which is exactly the bug the certificate shipped with. */
  Doc.prototype.paragraph = function (str, x, y, maxWidth, o) {
    o = o || {};
    const size = o.size || 11;
    const lead = o.leading || size * 1.45;
    const words = String(str).split(/\s+/).filter(Boolean);
    let line = '';
    for (const word of words) {
      const attempt = line ? line + ' ' + word : word;
      if (textWidth(attempt, size, !!o.bold) > maxWidth && line) {
        this.text(line, x, y, o);
        y += lead;
        line = word;
      } else {
        line = attempt;
      }
    }
    if (line) { this.text(line, x, y, o); y += lead; }
    return y;
  };

  Doc.prototype.build = function () {
    const objs = [];
    const add = body => { objs.push(body); return objs.length; }; // 1-based

    const pageIds = [];
    const contentIds = this.pages.map(ops => add(`<< /Length ${ops.join('\n').length} >>\nstream\n${ops.join('\n')}\nendstream`));
    const fontRegular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const fontBold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const pagesId = objs.length + this.pages.length + 1;

    this.pages.forEach((_, i) => {
      pageIds.push(add(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${fmt(this.size[0])} ${fmt(this.size[1])}] ` +
        `/Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> ` +
        `/Contents ${contentIds[i]} 0 R >>`));
    });
    const realPagesId = add(`<< /Type /Pages /Kids [${pageIds.map(i => i + ' 0 R').join(' ')}] /Count ${pageIds.length} >>`);
    const catalogId = add(`<< /Type /Catalog /Pages ${realPagesId} 0 R >>`);

    let out = '%PDF-1.4\n';
    const offsets = [0];
    objs.forEach((body, i) => {
      offsets.push(out.length);
      out += `${i + 1} 0 obj\n${body}\nendobj\n`;
    });
    const xref = out.length;
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objs.length; i++) {
      out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    }
    out += `trailer\n<< /Size ${objs.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return out;
  };

  Doc.prototype.blob = function () {
    const str = this.build();
    // Latin-1 bytes, not UTF-8 — the string was encoded for WinAnsi above,
    // so writing it as UTF-8 would double-encode every byte over 0x7F and
    // corrupt the xref offsets along with it.
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i) & 0xFF;
    return new Blob([bytes], { type: 'application/pdf' });
  };

  Doc.prototype.save = function (filename) {
    const url = URL.createObjectURL(this.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'document.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  global.KashPDF = { Doc, textWidth, PT };
})(typeof window !== 'undefined' ? window : globalThis);
