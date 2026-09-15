import test from 'node:test';
import assert from 'node:assert/strict';
import { PODCAST_EPISODES, pickNextEpisode, updateRecentIds } from '../podcast-bank.mjs';

test('bank contains a deliberately small curated set with unique Spotify episodes', () => {
  assert.ok(PODCAST_EPISODES.length >= 10 && PODCAST_EPISODES.length <= 15);
  assert.equal(new Set(PODCAST_EPISODES.map((episode) => episode.id)).size, PODCAST_EPISODES.length);
  for (const episode of PODCAST_EPISODES) {
    assert.match(episode.url, /^https:\/\/open\.spotify\.com\/episode\/[A-Za-z0-9]+$/);
    assert.equal(episode.url.split('/').at(-1), episode.id);
  }
});

test('selection avoids recently played episodes when alternatives exist', () => {
  const recent = PODCAST_EPISODES.slice(0, 4).map((episode) => episode.id);
  const selected = pickNextEpisode(PODCAST_EPISODES, recent, 0);
  assert.ok(selected);
  assert.ok(!recent.includes(selected.id));
});

test('selection still works after every episode has recently appeared', () => {
  const recent = PODCAST_EPISODES.map((episode) => episode.id);
  assert.equal(pickNextEpisode(PODCAST_EPISODES, recent, 0.999).id, PODCAST_EPISODES.at(-1).id);
});

test('recent list is de-duplicated, newest first, and bounded', () => {
  assert.deepEqual(updateRecentIds(['b', 'a', 'c', 'd'], 'a', 3), ['a', 'b', 'c']);
});
