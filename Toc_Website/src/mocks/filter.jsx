export const ALPHABET_OPTIONS = [
  "All",
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
].map((v) => ({ value: v, label: v }));

export const COLOR_OPTIONS = [
  "All",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Orange",
  "Purple",
].map((v) => ({ value: v, label: v }));

export const YEAR_OPTIONS = [
  "All",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
].map((v) => ({ value: v, label: v }));
