#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const QUEUE_FILE = process.env.QUEUE_FILE || "editorial/social-queue.json";
const STATE_FILE = process.env.STATE_FILE || ".cache/lsweb-social-state.json";
const RAW_MAKE_WEBHOOK_URL = process.env.RAW_MAKE_WEBHOOK_URL || "";
const PUBLISH_ENABLED = process.env.PUBLISH_ENABLED === "true";
const DRY_RUN = process.env.DRY_RUN === "true" || process.argv.includes("--dry-run");
const MAKE_VERIFIED = process.env.MAKE_ACTIVATION_VERIFIED === "true";
const REQUESTED_POST_ID = process.env.POST_ID || "";
const REQUESTED_CHANNEL = process.env.CHANNEL || "";
const ALLOW_INITIAL_STATE = process.env.ALLOW_INITIAL_STATE === "true";
const NOW = process.env.SOCIAL_NOW ? new Date(process.env.SOCIAL_NOW) : new Date();
const SUPPORTED_CHANNELS = new Set(["facebook", "instagram", "linkedin"]);

function normalizeWebhook(raw) {
  return String(raw).match(/https:\/\/hook\.[A-Za-z0-9.-]+\.make\.com\/[A-Za-z0-9_-]+/)?.[0] || "";
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file), "utf8"));
}

function statePath() {
  return path.resolve(process.cwd(), STATE_FILE);
}

function emptyState() {
  return { version: 1, sentEvents: [], completedPosts: [], unresolvedEvents: [] };
}

function loadState() {
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath(), "utf8"));
    if (!Array.isArray(parsed.sentEvents) || !Array.isArray(parsed.completedPosts)) {
      throw new Error("Invalid social state structure");
    }
    return {
      version: 1,
      sentEvents: parsed.sentEvents,
      completedPosts: parsed.completedPosts,
      unresolvedEvents: parsed.unresolvedEvents || [],
    };
  } catch (error) {
    if (error?.code === "ENOENT") {
      if (PUBLISH_ENABLED && !DRY_RUN && !ALLOW_INITIAL_STATE) {
        throw new Error("Social state missing: reconcile Make history before explicitly allowing initial state");
      }
      return emptyState();
    }
    throw new Error(`Cannot load social state safely: ${error?.message || error}`);
  }
}

function saveState(state) {
  const target = statePath();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(`${target}.tmp`, JSON.stringify(state, null, 2), "utf8");
  fs.renameSync(`${target}.tmp`, target);
  console.log(`[lsweb-social] State saved: ${target}`);
}

function romeDateStamp(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function withUtm(link, channel) {
  if (!link) return "";
  const url = new URL(link);
  url.searchParams.set("utm_source", channel);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "lsweb_social_light");
  return url.toString();
}

function eventId(post, channel) {
  const clean = String(post.id || "post").toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `LSWEB-${post.date.replaceAll("-", "")}-${channel.toUpperCase()}-${clean}`;
}

function hasEvent(state, post, channel) {
  const id = eventId(post, channel);
  return state.sentEvents.some((event) => event.eventId === id);
}

function isComplete(state, post) {
  return post.channels.every((channel) => hasEvent(state, post, channel));
}

function isValidDateStamp(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function requireHttpsUrl(value, label, postId) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") throw new Error("not https");
  } catch {
    throw new Error(`${label} must be a valid absolute HTTPS URL in ${postId}`);
  }
}

function validateQueue(queue) {
  if (!Array.isArray(queue?.posts)) throw new Error("Queue must contain a posts array");

  const seenPostIds = new Set();

  for (const post of queue.posts) {
    if (!post.id || !isValidDateStamp(post.date)) {
      throw new Error(`Invalid id/date in queue item: ${post.id || "unknown"}`);
    }
    if (seenPostIds.has(post.id)) throw new Error(`Duplicate post id: ${post.id}`);
    seenPostIds.add(post.id);

    if (!post.title?.trim()) throw new Error(`Missing title in ${post.id}`);
    if (!Array.isArray(post.channels) || !post.channels.length) {
      throw new Error(`No channels configured for ${post.id}`);
    }
    if (new Set(post.channels).size !== post.channels.length) {
      throw new Error(`Duplicate channel in ${post.id}`);
    }

    for (const channel of post.channels) {
      if (!SUPPORTED_CHANNELS.has(channel)) throw new Error(`Unsupported channel ${channel} in ${post.id}`);
      if (!post.copy?.[channel]?.trim()) throw new Error(`Missing copy.${channel} in ${post.id}`);
    }

    requireHttpsUrl(post.link, "Link", post.id);
    requireHttpsUrl(post.image, "Image", post.id);
  }
}

function buildPayload(post, channel) {
  const link = withUtm(post.link, channel);
  return {
    eventId: eventId(post, channel),
    channel,
    title: post.title,
    description: post.copy[channel],
    content: post.copy[channel],
    link,
    image: post.image,
    scheduledDate: post.date,
    dateISO: post.date,
    facebookCopy: post.copy.facebook || "",
    instagramCaption: post.copy.instagram || "",
    linkedinCopy: post.copy.linkedin || "",
    source: "github-actions-social-queue",
    site: "lswebagency",
  };
}

async function notifyMake(webhook, payload) {
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": payload.eventId },
    signal: AbortSignal.timeout(45000),
    body: JSON.stringify(payload),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Make webhook error ${response.status}: ${body.slice(0, 300)}`);
  let receipt;
  try { receipt = JSON.parse(body); } catch { throw new Error("Make returned no publication receipt; reconcile before retry"); }
  if (receipt.eventId !== payload.eventId || receipt.channel !== payload.channel ||
      !["published", "already_published"].includes(receipt.status) ||
      typeof receipt.platformPostId !== "string" || !receipt.platformPostId.trim()) {
    throw new Error("Make receipt invalid or publication pending; reconcile before retry");
  }
  return receipt;
}

async function main() {
  if (Number.isNaN(NOW.getTime())) throw new Error("Invalid SOCIAL_NOW value");
  const queue = loadJson(QUEUE_FILE);
  validateQueue(queue);
  const state = loadState();
  const today = romeDateStamp(NOW);
  const webhook = normalizeWebhook(RAW_MAKE_WEBHOOK_URL);

  console.log(`[lsweb-social] Today (Europe/Rome): ${today}`);
  console.log(`[lsweb-social] Mode: ${PUBLISH_ENABLED && !DRY_RUN ? "publish" : "safe/dry-run"}`);

  const due = queue.posts
    .filter((post) => post.status === "ready" && post.date <= today && !isComplete(state, post))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!due.length) {
    console.log("[lsweb-social] no-op: no due post");
    return;
  }

  const post = REQUESTED_POST_ID ? due.find((item) => item.id === REQUESTED_POST_ID) : due[0];
  if (!post) throw new Error("Requested post is not due or is already complete");
  if (REQUESTED_CHANNEL && !post.channels.includes(REQUESTED_CHANNEL)) throw new Error("Channel is not configured for selected post");
  const pendingChannels = post.channels.filter((channel) => !hasEvent(state, post, channel) && (!REQUESTED_CHANNEL || channel === REQUESTED_CHANNEL));
  console.log(`[lsweb-social] Selected: ${post.id} (${post.date})`);
  console.log(`[lsweb-social] Pending channels: ${pendingChannels.join(", ")}`);

  if (!PUBLISH_ENABLED || DRY_RUN) {
    for (const channel of pendingChannels) {
      console.log(`[lsweb-social] DRY RUN ${channel}: ${JSON.stringify(buildPayload(post, channel))}`);
    }
    return;
  }

  if (!MAKE_VERIFIED) throw new Error("Make activation checklist and persistent idempotency have not been verified");
  if (!REQUESTED_POST_ID) throw new Error("Real publishing requires an explicit POST_ID");
  if (state.unresolvedEvents.length) throw new Error("Unresolved delivery: reconcile Make and platform history before retry");
  if (!webhook) throw new Error("Publishing enabled but SOCIAL_MAKE_WEBHOOK_URL is missing or invalid");

  for (const channel of pendingChannels) {
    const payload = buildPayload(post, channel);
    state.unresolvedEvents.push({ eventId: payload.eventId, postId: post.id, channel, startedAt: new Date().toISOString() });
    saveState(state);
    const receipt = await notifyMake(webhook, payload);
    state.unresolvedEvents = state.unresolvedEvents.filter((item) => item.eventId !== payload.eventId);
    state.sentEvents.push({
      eventId: payload.eventId,
      postId: post.id,
      channel,
      sentAt: new Date().toISOString(),
      platformPostId: receipt.platformPostId,
    });
    saveState(state);
  }

  if (isComplete(state, post) && !state.completedPosts.some((item) => item.id === post.id)) {
    state.completedPosts.push({ id: post.id, completedAt: new Date().toISOString() });
    saveState(state);
  }

  console.log(`[lsweb-social] ${isComplete(state, post) ? "Completed" : "Partially completed"}: ${post.id}`);
}

main().catch((error) => {
  console.error(`[lsweb-social] ERROR: ${error?.message || error}`);
  process.exit(1);
});
