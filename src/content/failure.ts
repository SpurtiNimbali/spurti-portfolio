// The two curves behind "what i got wrong".
//
// Both series must have the same number of points — the toggle morphs one into
// the other point-by-point, so a length mismatch would tear the animation.
// Values are percentages. Replace with the real logged numbers when you have
// them to hand; the shape is what carries the point, but the shape should be true.

export type FailureSeries = {
  id: "optimised" | "mattered";
  /** Switch label. Lowercase — it sits in utility type. */
  switchLabel: string;
  /** What the axis is actually measuring. */
  metric: string;
  /** Headline number, formatted. */
  readout: string;
  /** One line under the plot. */
  caption: string;
  points: number[];
};

export const CHANCE = 50;

export const FAILURE_SERIES: FailureSeries[] = [
  {
    id: "optimised",
    switchLabel: "the metric i optimised",
    metric: "held-out reconstruction similarity",
    readout: "98.5%",
    caption:
      "Twelve epochs of a number going up. Every review I gave that quarter led with this curve.",
    points: [54.2, 63.8, 72.1, 79.4, 84.9, 88.6, 91.8, 94.1, 95.9, 97.2, 98.0, 98.5],
  },
  {
    id: "mattered",
    switchLabel: "the thing that mattered",
    metric: "identity-matched retrieval, 2-way",
    readout: "47.2%",
    caption:
      "Same model, same twelve epochs, scored on whether the reconstruction belonged to the right person. Chance is 50%.",
    points: [50.4, 49.1, 51.2, 48.6, 50.8, 49.3, 48.1, 49.7, 47.9, 48.8, 47.4, 47.2],
  },
];

export const FAILURE_RESOLUTION =
  "The fix was a two-layer adapter — the smallest component in the pipeline.";
