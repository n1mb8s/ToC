export const AlphabetMock = {
  key: "alphabet",
  initial: "All",
  label: "Alphabet",
  options: [
    "All",
    ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  ].map((v) => ({ value: v, label: v })),
};

export const TypeMock = {
  key: "type",
  initial: "All",
  label: "Type",
  options: [
    "All",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Black",
    "White",
    "Orange",
    "Purple",
  ].map((v) => ({ value: v, label: v })),
};

export const YearMock = {
  key: "year",
  initial: "All",
  label: "Year",
  options: ["All", "2025", "2024", "2023", "2022", "2021", "2020"].map((v) => ({
    value: v,
    label: v,
  })),
};
