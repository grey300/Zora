import React from "react";
import D3WordCloud from "react-d3-cloud";

const data = [
  { text: "Thinley", value: 1 },
  { text: "Tshering", value: 9 },
  { text: "Pema", value: 5 },
  { text: "UgyenTech", value: 5 },
  { text: "Chime", value: 5 },
  { text: "Dechen", value: 10 },
  { text: "Yamnang", value: 5 },
];

const fontSizeMapper = (word) => Math.log2(word.value) * 5 + 16;

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
        fill={() => "black"}
        onWordClick={(e, d) => {
          router.push("/quiz?topic=" + d.text);
        }}
      />
    </>
  );
}

export default CustomWordCloud;
