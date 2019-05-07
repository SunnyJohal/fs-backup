/**
 * Convert HEX To RGBA
 *
 * @description Converts hex colors into their rgba
 *   equivalents.
 *
 * @param {string} hex Hex code with/without leading #
 * @return {string} opacity Text opacity level.
 */
export default (hex, opacity = 1) => {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
};
