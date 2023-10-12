const plugin = require("tailwindcss/plugin");

const range = (size) =>
  Object.fromEntries(
    [...Array(size).keys()]
      .slice(1)
      .map((i) => [`${i}_${size}`, `${(i / size) * 100}%`]),
  );
const generateSpacing = (num) => {
  return new Array(num)
    .fill(1)
    .reduce((cur, next, index) => ({ ...cur, [index]: `${index}rpx` }), {});
};
const setPx = () => {
  return new Array(100)
    .fill(1)
    .reduce(
      (cur, next, index) => ({ ...cur, [`${index}Px`]: `${index}Px` }),
      {},
    );
};
module.exports = {
  prefixer: false,
  separator: "_",
  compile: false,
  globalUtility: false,
  darkMode: "media",
  important: false,
  corePlugins: {
    space: false,
    divideStyle: false,
    divideWidth: false,
    divideColor: false,
    divideOpacity: false,
    // 涉及到通配符（*），wx 小程序不支持
    ringWidth: false,
    ringColor: false,
    ringOpacity: false,
    ringOffsetWidth: false,
    ringOffsetColor: false,
    // web 浏览器相关功能，wx 小程序不支持
    appearance: false,
    cursor: false,
    outline: false,
    placeholderColor: false,
    pointerEvents: false,
    stroke: false,
    tableLayout: false,
    userSelect: false,
  },
  theme: {
    // textColor: {
    //   primary: "#3490dc",
    //   secondary: "#ffed4a",
    //   danger: "#e3342f",
    // },
    extend: {
      fontSize: {
        ...setPx(),
      },
      colors: {
        green: {
          theme: "#27AE60",
        },
        blue: {
          theme: "#2F80ED",
        },
        gray: {
          "desc-50": "#E0E0E0",
          "desc-100": "#BDBDBD",
          "desc-200": "#828282",
        },
        red: {
          theme: "#D42D3A",
        },
      },
      backgroundColor: (theme) => ({
        ...theme("colors"),
        primary: "#3490dc",
        secondary: "#ffed4a",
        danger: "#3490dc",
        grayBtn: "#1a1a1a",
        grayBg: "#6C6C6C",
        black2: "#212121",
        762022: "#762022",
        373737: "#373737",
        b4F4F4F: "#4F4F4F",
      }),
    },
    spacing: {
      ...generateSpacing(1501),
    },
    fontSize: (theme) => theme("spacing"),
    borderWidth: (theme) => theme("spacing"),
    lineHeight: (theme) => theme("spacing"),
    translate: () => {
      return {
        ...(theme) => theme("spacing"),
        p30: "30%",
        p40: "40%",
        p45: "45%",
        p50: "50%",
        n50: "-50%",
      };
    },
    inset: (theme) => {
      return {
        ...theme("spacing"),
        ...setPx(),
        p30: "30%",
        p40: "40%",
        p45: "45%",
        p50: "50%",
      };
    },
    borderRadius: (theme) => theme("spacing"),
    width: (theme) => {
      return {
        auto: "auto",
        full: "100%",
        screen: "100vw",
        ...Object.assign(...[2, 3, 4, 5, 6, 12].map(range)),
        ...theme("spacing"),
      };
    },
    height: (theme) => ({
      auto: "auto",
      full: "100%",
      screen: "100vh",
      ...Object.assign(...[2, 3, 4, 5, 6, 12].map(range)),
      ...theme("spacing"),
    }),
    maxHeight: {
      full: "100%",
      screen: "100vh",
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".vhCenter": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        ".full": {
          position: "absolute",
          left: 0,
          top: 0,
          opacity: 0,
          width: "100%",
          height: "100%",
        },
      };

      addUtilities(newUtilities);
    }),
  ],
  blocklist: ["animate.css"], //排除有异样的样式类
};
