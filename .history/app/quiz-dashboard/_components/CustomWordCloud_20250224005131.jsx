import React from "react";
import D3WordCloud from "react-d3-cloud";

const data = [
  {
    text: "Thinley",
    value: 3,
  },
];
function CustomWordCloud() {
  return (
    <>
      <D3WordCloud
        data={data}
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        onWordClick={(e, d) => {
          router.push("/quiz?topic=" + d.text);
        }}
      />
    </>
  );
}

export default CustomWordCloud;
