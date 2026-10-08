import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const script = path.resolve("scripts/lsweb-social-agent.mjs");
const queue = path.resolve("editorial/social-queue.json");
function run(extra = {}, state, receipt = "published") {
 const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lsweb-social-"));
 const file = path.join(dir, "state.json");
 if (state) fs.writeFileSync(file, JSON.stringify(state));
 const mock = `globalThis.fetch = async (url, options) => {
 const p = JSON.parse(options.body);
 console.log("MOCK_FETCH " + p.channel);
 return { ok: true, status: 200, text: async () => ${JSON.stringify(receipt)} === "plain" ? "Accepted" : JSON.stringify({eventId:p.eventId,channel:p.channel,status:${JSON.stringify(receipt)},platformPostId:"platform-123"}) };
 };`;
 const r = spawnSync(process.execPath, ["--import", "data:text/javascript," + encodeURIComponent(mock), script], {
 env: { ...process.env, QUEUE_FILE: queue, STATE_FILE:file, SOCIAL_NOW:"2026-10-08T06:43:00Z", PUBLISH_ENABLED:"true", DRY_RUN:"false", MAKE_ACTIVATION_VERIFIED:"true", POST_ID:"visite-senza-richieste", CHANNEL:"facebook", RAW_MAKE_WEBHOOK_URL:"https://hook.eu1.make.com/test", ...extra }, encoding:"utf8"
 });
 const saved = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : null;
 fs.rmSync(dir, {recursive:true,force:true});
 return {code:r.status,out:r.stdout+r.stderr,state:saved};
}
const empty = {version:1,sentEvents:[],completedPosts:[],unresolvedEvents:[]};
test("disabled and dry-run never contact Make or change state", () => {
 for (const env of [{PUBLISH_ENABLED:"false"}, {DRY_RUN:"true"}]) {
 const r=run(env); assert.equal(r.code,0); assert.ok(!r.out.includes("MOCK_FETCH")); assert.equal(r.state,null);
 }
});
test("activation and missing-state gates stop delivery", () => {
 for (const env of [{MAKE_ACTIVATION_VERIFIED:"false"},{POST_ID:""},{}]) {
 const r=run(env,env.POST_ID === "" || env.MAKE_ACTIVATION_VERIFIED === "false" ? empty : undefined);
 assert.equal(r.code,1); assert.ok(!r.out.includes("MOCK_FETCH"));
 }
});
test("future post cannot be sent early",()=>{const r=run({POST_ID:"sito-bello-non-basta"},empty);assert.equal(r.code,1);assert.ok(!r.out.includes("MOCK_FETCH"));});
test("confirmed single channel saved; other channels remain pending",()=>{
 const r=run({},empty);assert.equal(r.code,0);assert.equal(r.state.sentEvents.length,1);
 assert.equal(r.state.sentEvents[0].channel,"facebook");assert.equal(r.state.sentEvents[0].platformPostId,"platform-123");
 assert.equal(r.state.completedPosts.length,0);assert.equal(r.state.unresolvedEvents.length,0);
 const repeat=run({},r.state);assert.equal(repeat.code,0);assert.ok(!repeat.out.includes("MOCK_FETCH"));
});
test("plain 200 or pending response blocks retry instead of marking sent",()=>{
 for (const receipt of ["plain","pending"]) {
 const r=run({},empty,receipt);assert.equal(r.code,1);assert.equal(r.state.sentEvents.length,0);assert.equal(r.state.unresolvedEvents.length,1);
 const repeat=run({},r.state);assert.equal(repeat.code,1);assert.ok(!repeat.out.includes("MOCK_FETCH"));
 }
});
test("explicit initial state and duplicate publication receipt accepted",()=>{
 const r=run({ALLOW_INITIAL_STATE:"true"},undefined,"already_published");assert.equal(r.code,0);assert.equal(r.state.sentEvents.length,1);
});
