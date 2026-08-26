import test from "node:test";
import assert from "node:assert/strict";
import { attributeShift } from "../src/rules/attribution.js";

// SUP-2304's worked example: Ruth Adeyemi, 19:00 Tuesday to 07:00 Wednesday.
test("Ruth's shift: 19:00 Tue - 07:00 Wed divides at midnight", () => {
  const segs = attributeShift({
    start: new Date(2026, 5, 2, 19, 0), // Tue 2 Jun, 19:00
    end: new Date(2026, 5, 3, 7, 0),    // Wed 3 Jun, 07:00
  });
  assert.equal(segs.length, 2);
  assert.equal(segs[0].dayKey, "2026-06-02");
  assert.equal(segs[0].hours, 5); // 19:00-24:00 on Tuesday
  assert.equal(segs[1].dayKey, "2026-06-03");
  assert.equal(segs[1].hours, 7); // 00:00-07:00 on Wednesday
});

// SUP-2312's invariant: the header total equals the sum of the day columns.
test("segments always sum to the shift's full length", () => {
  const segs = attributeShift({
    start: new Date(2026, 5, 2, 22, 30),
    end: new Date(2026, 5, 3, 6, 15),
  });
  const total = segs.reduce((h, s) => h + s.hours, 0);
  assert.equal(total, 7.75);
});

test("a day shift stays one segment on its own day", () => {
  const segs = attributeShift({
    start: new Date(2026, 5, 2, 9, 0),
    end: new Date(2026, 5, 2, 17, 0),
  });
  assert.equal(segs.length, 1);
  assert.equal(segs[0].dayKey, "2026-06-02");
  assert.equal(segs[0].hours, 8);
});

test("a shift ending exactly at midnight owns nothing of the next day", () => {
  const segs = attributeShift({
    start: new Date(2026, 5, 2, 16, 0),
    end: new Date(2026, 5, 3, 0, 0),
  });
  assert.equal(segs.length, 1);
  assert.equal(segs[0].dayKey, "2026-06-02");
  assert.equal(segs[0].hours, 8);
});

test("a shift spanning two midnights gets three segments", () => {
  const segs = attributeShift({
    start: new Date(2026, 5, 2, 20, 0),
    end: new Date(2026, 5, 4, 4, 0),
  });
  assert.deepEqual(segs.map((s) => s.dayKey), ["2026-06-02", "2026-06-03", "2026-06-04"]);
  assert.deepEqual(segs.map((s) => s.hours), [4, 24, 4]);
});

test("a backwards or empty shift is refused, not guessed at", () => {
  assert.throws(() => attributeShift({
    start: new Date(2026, 5, 3, 7, 0),
    end: new Date(2026, 5, 2, 19, 0),
  }));
});
