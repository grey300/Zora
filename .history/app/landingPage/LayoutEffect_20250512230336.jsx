"use client"; // This is the directive that marks this component as a client component

import { cloneElement, useRef } from "react";
import { useInView } from "framer-motion";

const LayoutEffect = ({ children, className, isInviewState }) => {
  const ref = useRef(null);
  const { inView } = useInView({ triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`${className} ${
        inView ? isInviewState.trueState : isInviewState.falseState
      }`}
    >
      {children}
    </div>
  );
};

export default LayoutEffect;
