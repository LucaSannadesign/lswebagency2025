#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const QUEUE_FILE = process.env.QUEUE_FILE || "editorial/social-queue.json";
const STATE_FILE = process.env.STATE_FILE || ".cache/lsweb-social-state.json";
const RAW_MAKE_WEBHOOK_URL = process.env.RAW_MAKE_WEBHOOK_URL || "";
const PUBLISH_ENABLED = process.env.PUBLISH_ENABLED === "true";
const DRY_RUN = process.env.DRY_RUN === "true" || process.argv.includes("--dry-run");
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

function loadState() {
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath(), "utf8"));
    return {
      version: 1,
      sentEvents: Array.isArray(parsed.sentEvents) ? parsed.sentEvents : [],
      completedPosts: Array.isArray(parsed.completedPosts) ? parsed.completedPosts : [],
    };
  } catch {
    return { version: 1, sentEvents: [], completedPosts: [] };
  }
}

function saveState(state) {
  const target = statePath();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(state, null, 2), "utf8");
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

function validateQueue(queue) {
  if (!Array.isArray(queue?.posts)) throw new Error("Queue must contain a posts array");
  for (const post of queue.posts) {
    if (!post.id || !/^\d{4}-\d{2}-\d{2}$/.test(post.date || "")) {
      throw new Error(`Invalid id/date in queue item: ${post.id || "unknown"}`);
    }
    if (!Array.isArray(post.channels) || !post.channels.length) {
      throw new Error(`No channels configured for ${post.id}`);
    }
    for (const channel of post.channels) {
      if (!SUPPORTED_CHANNELS.has(channel)) throw new Error(`Unsupported channel ${channel} in ${post.id}`);
      if (!post.copy?.[channel]?.trim()) throw new Error(`Missing copy.${channel} in ${post.id}`);
    }
    if (!post.image?.startsWith("https://")) throw new Error(`Image must be absolute HTTPS URL in ${post.id}`);
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Make webhook error ${response.status}: ${body.slice(0, 300)}`);
  console.log(`[lsweb-social] Make accepted ${payload.eventId}: HTTP ${response.status}`);
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

  const post = due[0];
  const pendingChannels = post.channels.filter((channel) => !hasEvent(state, post, channel));
  console.log(`[lsweb-social] Selected: ${post.id} (${post.date})`);
  console.log(`[lsweb-social] Pending channels: ${pendingChannels.join(", ")}`);

  if (!PUBLISH_ENABLED || DRY_RUN) {
    for (const channel of pendingChannels) {
      console.log(`[lsweb-social] DRY RUN ${channel}: ${JSON.stringify(buildPayload(post, channel))}`);
    }
    return;
  }

  if (!webhook) throw new Error("Publishing enabled but SOCIAL_MAKE_WEBHOOK_URL is missing or invalid");

  for (const channel of pendingChannels) {
    const payload = buildPayload(post, channel);
    await notifyMake(webhook, payload);
    state.sentEvents.push({
      eventId: payload.eventId,
      postId: post.id,
      channel,
      sentAt: new Date().toISOString(),
    });
    saveState(state);
  }

  if (isComplete(state, post) && !state.completedPosts.some((item) => item.id === post.id)) {
    state.completedPosts.push({ id: post.id, completedAt: new Date().toISOString() });
    saveState(state);
  }

  console.log(`[lsweb-social] Completed: ${post.id}`);
}

main().catch((error) => {
  console.error(`[lsweb-social] ERROR: ${error?.message || error}`);
  process.exit(1);
});
