// ==UserScript==
// @name         JIRA | Comment input field fix
// @namespace    JIRA
// @version      1.0
// @description  Restores auto-expanding comment editor and removes inner scroll in Jira
// @author       Saymonn
// @match        https://*.atlassian.net/*
// @match        https://jira.*/*
// @match        https://*.jira.*/*
// @icon         https://bitbag.atlassian.net/favicon.ico
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  const css = `
    textarea,
    div[contenteditable="true"],
    .ak-editor-content-area,
    .ProseMirror {
      max-height: none !important;
      height: auto !important;
      overflow: visible !important;
    }
    [data-test-id="issue.views.issue-base.foundation.quick-add.comment-editor"],
    [data-testid="issue-view-comment-create"],
    [data-testid="comment-create.footer"],
    .ak-editor-toolbar,
    .ak-editor-footer,
    .ak-editor-popup-scroll-parent,
    .css-1p3n0ce,
    .css-1x5se2i {
      position: static !important;
      bottom: auto !important;
      top: auto !important;
    }
  `;
  const addStyle = s => {
    if (typeof GM_addStyle === "function") {
      GM_addStyle(s);
    } else {
      const el = document.createElement("style");
      el.textContent = s;
      document.documentElement.appendChild(el);
    }
  };
  addStyle(css);
  const autoresize = el => {
    if (!el || el.__tm_resized) return;
    el.__tm_resized = true;
    const handler = () => {
      el.style.height = "auto";
      const h = el.scrollHeight;
      if (h && Number.isFinite(h)) el.style.height = h + "px";
    };
    handler();
    el.addEventListener("input", handler, { passive: true });
  };
  const unsticky = root => {
    if (!root) return;
    const scan = nodes => {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!(n instanceof HTMLElement)) continue;
        const cs = getComputedStyle(n);
        if (cs.position === "sticky") {
          n.style.position = "static";
          n.style.top = "auto";
          n.style.bottom = "auto";
        }
      }
    };
    scan(root.querySelectorAll("*"));
  };
  const fixOnce = root => {
    const textareas = root.querySelectorAll('textarea');
    textareas.forEach(autoresize);
    const editors = root.querySelectorAll('div[contenteditable="true"], .ProseMirror, .ak-editor-content-area');
    editors.forEach(e => {
      e.style.maxHeight = "none";
      e.style.overflowY = "visible";
    });
    unsticky(root);
  };
  const fix = target => {
    const root = target || document;
    fixOnce(root);
  };
  const mo = new MutationObserver(muts => {
    let doFix = false;
    for (const m of muts) {
      if (m.type === "childList" && (m.addedNodes && m.addedNodes.length)) {
        doFix = true;
        break;
      }
      if (m.type === "attributes") {
        doFix = true;
        break;
      }
    }
    if (doFix) fix(document);
  });
  const start = () => {
    fix(document);
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
    window.addEventListener("load", () => fix(document));
    window.addEventListener("resize", () => fix(document));
    document.addEventListener("focusin", e => {
      const ta = e.target;
      if (ta && ta.tagName === "TEXTAREA") autoresize(ta);
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
