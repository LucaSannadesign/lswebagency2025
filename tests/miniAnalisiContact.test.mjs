// Component handler regression test with isolated hooks and mocked transport.
// Does not substitute for browser, CRM or notification integration checks.
// Run: node tests/miniAnalisiContact.test.mjs
import * as esbuild from "esbuild";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import assert from "node:assert/strict";
(async () => {
  const result = await esbuild.build({
    entryPoints: ["src/components/MiniAnalisi.tsx"],
    absWorkingDir: fileURLToPath(new URL("../", import.meta.url)),
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    jsx: "transform",
    jsxFactory: "h",
    banner: {
      js: "const h=(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)});",
    },
    plugins: [
      {
        name: "hooks",
        setup(b) {
          b.onResolve({ filter: /^react$/ }, () => ({
            path: "react",
            namespace: "mock",
          }));
          b.onLoad({ filter: /.*/, namespace: "mock" }, () => ({
            contents:
              "export const useState=(v)=>globalThis.__hooks.state(v); export const useEffect=()=>{}; export const useRef=(v)=>({current:v});",
          }));
        },
      },
    ],
  });
  const mod = { exports: {} };
  new Function("module", "exports", "require", result.outputFiles[0].text)(
    mod,
    mod.exports,
    require,
  );
  const Component = mod.exports.default;
  for (const mode of ["no-site", "audit", "cancel-audit"]) {
    let states = [],
      cursor = 0,
      payloads = [];
    globalThis.__hooks = {
      state(v) {
        let i = cursor++;
        if (!(i in states)) states[i] = v;
        return [states[i], (n) => (states[i] = n)];
      },
    };
    globalThis.fetch = async (url, options) => {
      payloads.push(JSON.parse(options.body));
      return { ok: true, json: async () => ({ ok: true }) };
    };
    let tree;
    function render() {
      cursor = 0;
      tree = Component({});
    }
    function nodes(n = tree) {
      if (!n || typeof n !== "object") return [];
      return [n, ...n.children.flatMap(nodes)];
    }
    function txt(n) {
      return typeof n === "string"
        ? n
        : n && typeof n === "object"
          ? n.children.map(txt).join("")
          : "";
    }
    function button(label) {
      return nodes().find(
        (n) => n.type === "button" && txt(n).trim() === label,
      );
    }
    function click(label) {
      const b = button(label);
      assert.ok(b, label);
      b.props.onClick();
      render();
    }
    function field(id, value) {
      nodes()
        .find((n) => n.props.id === id)
        .props.onChange({ target: { value } });
      render();
    }
    function checkbox(pattern, checked) {
      const label = nodes().find(
        (n) => n.type === "label" && pattern.test(txt(n)),
      );
      assert.ok(label);
      nodes(label)
        .find((n) => n.type === "input")
        .props.onChange({ target: { checked } });
      render();
    }
    async function submit() {
      await nodes()
        .find((n) => n.type === "form")
        .props.onSubmit({ preventDefault() {} });
      render();
    }
    render();
    for (const label of [
      "Parto da zero",
      "Professionista",
      "Ricevere più richieste",
      "Sito strategico nuovo",
      "Solo logo",
      "Email",
      "Entro 1 mese",
    ])
      click(label);
    click("Sì, vorrei un approfondimento");
    field("ma-name", "QA");
    field("ma-email", "qa@example.com");
    checkbox(/Accetto la/, true);
    await submit();
    assert.ok(!nodes().find((n) => n.props.id === "ma-website"));
    if (mode !== "no-site") {
      checkbox(/Desidero anche/, true);
      await submit();
      assert.equal(payloads.length, 0);
      field("ma-website", "example.com");
      await submit();
      assert.equal(payloads.length, 0);
      checkbox(/Confermo di essere titolare/, true);
      if (mode === "cancel-audit") checkbox(/Desidero anche/, false);
    }
    if (mode === "no-site") {
      // Doppio invio ravvicinato (stesso render): deve partire una sola richiesta.
      const onSubmit = nodes().find((n) => n.type === "form").props.onSubmit;
      await Promise.all([
        onSubmit({ preventDefault() {} }),
        onSubmit({ preventDefault() {} }),
      ]);
      render();
    } else {
      await submit();
    }
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0].auditConsent, mode === "audit");
    assert.equal(
      payloads[0].websiteUrl,
      mode === "audit" ? "example.com" : undefined,
    );
    assert.ok(txt(tree).includes("Richiesta inviata correttamente"));
    console.log("PASS component handlers:", mode);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
