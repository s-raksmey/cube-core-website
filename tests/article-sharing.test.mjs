import assert from "node:assert/strict";
import { test } from "node:test";
import { copyArticleLink, initiateNativeShare, openSocialShare } from "../src/lib/article-sharing.ts";

const articleUrl = "https://news.example.com/en/news/local/story";

test("Facebook and Telegram clicks open their share targets and record the selected platform", () => {
  for (const platform of ["FACEBOOK", "TELEGRAM"]) {
    const calls = [];
    openSocialShare(platform, articleUrl, "News title", (url) => calls.push(["open", url]),
      (selected) => calls.push(["record", selected]));
    assert.equal(calls[0][0], "open");
    assert.ok(calls[0][1].includes(encodeURIComponent(articleUrl)));
    assert.equal(calls[1][0], "record");
    assert.equal(calls[1][1], platform);
  }
  assert.doesNotThrow(() => openSocialShare("FACEBOOK", articleUrl, "News title", () => {},
    () => { throw new Error("tracking unavailable"); }));
});

test("Copy Link records only after the clipboard succeeds", async () => {
  const calls = [];
  await copyArticleLink(articleUrl, async (url) => { calls.push(["copy", url]); },
    () => calls.push(["record", "COPY_LINK"]));
  assert.deepEqual(calls, [["copy", articleUrl], ["record", "COPY_LINK"]]);
  await assert.rejects(copyArticleLink(articleUrl, async () => { throw new Error("clipboard denied"); },
    () => calls.push(["record", "COPY_LINK"])));
  assert.equal(calls.length, 2);
  await assert.doesNotReject(copyArticleLink(articleUrl, async () => {},
    () => { throw new Error("tracking unavailable"); }));
});

test("Native sharing records only after the browser resolves the share", async () => {
  const calls = [];
  const data = { title: "News title", url: articleUrl };
  await initiateNativeShare(data, async (input) => { calls.push(["share", input]); },
    () => calls.push(["record", "NATIVE"]));
  assert.deepEqual(calls, [["share", data], ["record", "NATIVE"]]);
  await assert.rejects(initiateNativeShare(data, async () => { throw new Error("cancelled"); },
    () => calls.push(["record", "NATIVE"])));
  assert.equal(calls.length, 2);
  await assert.doesNotReject(initiateNativeShare(data, async () => {},
    () => { throw new Error("tracking unavailable"); }));
});
