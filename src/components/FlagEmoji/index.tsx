const FlagEmoji = (flag: string): JSX.Element => {
  if (!/^[a-zA-Z]+$/.test(flag)) {
    flag = Array.from(flag, (codeUnit) => {
      const codePoint = codeUnit.codePointAt(0);
      if (codePoint !== undefined) {
        return String.fromCharCode(codePoint - 127397).toLowerCase();
      }
      return "";
    }).join("");
  } else {
    flag = flag.toLowerCase();
  }
  return <img src={`https://flagcdn.com/24x18/${flag}.png`} alt="flag" />;
};

export default FlagEmoji;
