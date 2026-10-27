/* مشاركة اللينكات (واتساب / نسخ / مشاركة الموبايل) — HINDAWY Agency
   - صفحات العملاء: زرار مشاركة جنب كل لينك (a.tile)، وزرار «ابعت لينكات المشروع للعميل» بلينكات المشروع ده بس. الشيتات (سجلات داخلية) مش بتتبعت.
   - الصفحة الرئيسية: زرار مشاركة على كارت البورتفوليو بس.
   - من أي صفحة تانية: HShare.open(عنوان, وصف, لينك) أو HShare.openAll(عنوان, [[اسم, لينك], ...]). */
(function () {
  var ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>';
  var WA = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"/></svg>';
  var COPY = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';

  var css = '.shr-row{display:flex;gap:8px;align-items:stretch;min-width:0}.shr-row>.tile{flex:1}' +
    '.shr-btn{flex:none;width:52px;display:flex;align-items:center;justify-content:center;border-radius:18px;cursor:pointer;font:inherit;' +
    'background:var(--card,transparent);border:1px solid var(--line,rgba(127,127,127,.3));color:var(--brand,currentColor);transition:transform .15s}' +
    '@media (max-width:420px){.shr-row>.shr-btn{width:42px;border-radius:14px}}.shr-btn:hover{transform:translateY(-2px)}.shr-btn:focus-visible{outline:3px solid var(--gold,#e9a72e);outline-offset:2px}' +
    '.shr-wrap{position:relative;display:flex;flex-direction:column;min-width:0}.shr-wrap>a{flex:1}' +
    '.shr-wrap>.shr-btn{position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:12px;background:rgba(127,127,127,.14);border:0;color:inherit}' +
    '.shr-all{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:13px 16px;border-radius:16px;cursor:pointer;font:inherit;font-size:15px;font-weight:800;' +
    'background:#25D366;color:#fff;border:0}.shr-all:hover{filter:brightness(1.05)}.shr-all:focus-visible{outline:3px solid var(--gold,#e9a72e);outline-offset:2px}' +
    '.shr-back{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:16px}' +
    '.shr-sheet{width:100%;max-width:420px;background:var(--card,#fff);color:var(--fg,#111);border-radius:22px;padding:18px;display:flex;flex-direction:column;gap:10px;' +
    'font-family:var(--f-ar,"Cairo",sans-serif);direction:rtl;box-shadow:0 20px 60px rgba(0,0,0,.35);margin-bottom:env(safe-area-inset-bottom,0px)}' +
    '.shr-sheet h3{margin:0;font-size:17px;font-weight:900}.shr-sheet .u{font-size:13px;color:var(--mute,#666);direction:ltr;text-align:left;word-break:break-all;' +
    'background:rgba(127,127,127,.1);border-radius:10px;padding:8px 10px;max-height:110px;overflow:auto;white-space:pre-line}' +
    '.shr-sheet button{display:flex;align-items:center;gap:10px;justify-content:center;padding:13px;border-radius:14px;border:1px solid var(--line,rgba(127,127,127,.3));' +
    'background:transparent;color:inherit;font:inherit;font-size:15px;font-weight:800;cursor:pointer}' +
    '.shr-sheet .wa{background:#25D366;color:#fff;border-color:#25D366}.shr-sheet .x{border:0;color:var(--mute,#666);font-weight:700;padding:8px}' +
    '.shr-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:10px 18px;border-radius:30px;font:800 14px "Cairo",sans-serif;z-index:10000}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function toast(t) { var d = document.createElement('div'); d.className = 'shr-toast'; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1800); }
  function copy(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).then(function () { toast('اتنسخ ✓'); });
    var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); toast('اتنسخ ✓'); } catch (_) { } a.remove();
  }
  function sheet(title, msg, url) {
    var b = document.createElement('div'); b.className = 'shr-back';
    b.innerHTML = '<div class="shr-sheet" role="dialog" aria-modal="true" aria-label="مشاركة"><h3></h3><div class="u"></div>' +
      '<button class="wa">' + WA + 'ابعت على واتساب</button>' +
      '<button class="cp">' + COPY + (url ? 'انسخ اللينك' : 'انسخ الرسالة') + '</button>' +
      (navigator.share ? '<button class="ns">' + ICON + 'مشاركة بطريقة تانية</button>' : '') +
      '<button class="x">إلغاء</button></div>';
    b.querySelector('h3').textContent = title;
    var u = b.querySelector('.u'); u.textContent = url || msg;
    if (!url) { u.style.direction = 'rtl'; u.style.textAlign = 'right'; }
    function close() { b.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    b.addEventListener('click', function (e) { if (e.target === b) close(); });
    b.querySelector('.x').onclick = close;
    b.querySelector('.wa').onclick = function () { window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener'); close(); };
    b.querySelector('.cp').onclick = function () { copy(url || msg); close(); };
    var ns = b.querySelector('.ns');
    if (ns) ns.onclick = function () { navigator.share(url ? { title: title, text: msg.replace(url, '').trim(), url: url } : { title: title, text: msg }).catch(function () { }); close(); };
    document.addEventListener('keydown', esc);
    document.body.appendChild(b); b.querySelector('.wa').focus();
  }

  function project() { var h = document.querySelector('.hero h1'); return h ? h.textContent.trim() : ''; }
  function info(a) {
    var b = a.querySelector('b, h3'), s = a.querySelector('.txt>span, p');
    return { name: b ? b.textContent.trim() : a.textContent.trim(), desc: s ? s.textContent.trim() : '', url: a.href };
  }
  /* اللي بيتبعت للعميل بس: الشيتات (سجلات داخلية) مالهاش زرار */
  function shareable(a) { var h = a.getAttribute('href') || ''; return h && h.charAt(0) !== '#' && /^https?:/.test(a.href) && !/docs\.google\.com/.test(a.href) && !a.classList.contains('off'); }

  var H = window.HShare = {
    open: function (name, desc, url) {
      var p = project(), msg = '*' + name + '*' + (p && p !== name ? ' — ' + p : '') + (desc ? '\n' + desc : '') + '\n' + url;
      sheet(name, msg, url);
    },
    openAll: function (title, list) {
      var seen = {}, rows = [];
      list.forEach(function (x) { if (seen[x[1]] != null) { rows[seen[x[1]]][0] += ' / ' + x[0]; } else { seen[x[1]] = rows.length; rows.push([x[0], x[1]]); } });
      var msg = '*' + title + '*\n\n' + rows.map(function (r) { return '▪️ ' + r[0] + '\n' + r[1]; }).join('\n\n') + '\n\nPOWERED BY HINDAWY';
      sheet(title, msg, '');
    }
  };

  function btn(a, cls) {
    var x = document.createElement('button'); x.type = 'button'; x.className = 'shr-btn'; x.innerHTML = ICON;
    var i = info(a); x.setAttribute('aria-label', 'شارك: ' + i.name); x.title = 'شارك';
    x.onclick = function (e) { e.preventDefault(); e.stopPropagation(); var j = info(a); H.open(j.name, j.desc, j.url); };
    var w = document.createElement('div'); w.className = cls;
    a.parentNode.insertBefore(w, a); w.appendChild(a); w.appendChild(x);
  }

  function init() {
    var tiles = [].slice.call(document.querySelectorAll('a.tile')).filter(shareable);
    tiles.forEach(function (a) { btn(a, 'shr-row'); });
    /* زرار واحد يبعت لينكات المشروع اللي تخص العميل (من غير الشيتات) */
    var hero = document.querySelector('.hero');
    if (hero && tiles.length > 1) {
      var all = document.createElement('button'); all.type = 'button'; all.className = 'shr-all';
      all.innerHTML = WA + 'ابعت لينكات المشروع للعميل';
      all.onclick = function () { H.openAll(project(), tiles.map(function (a) { var i = info(a); return [i.name, i.url]; })); };
      hero.parentNode.insertBefore(all, hero.nextSibling);
    }
    /* الرئيسية: البورتفوليو بس (صفحات العملاء فيها حاجات داخلية) */
    [].slice.call(document.querySelectorAll('a.proj.pf')).filter(shareable).forEach(function (a) { btn(a, 'shr-wrap'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
