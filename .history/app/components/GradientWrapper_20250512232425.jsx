const GradientWrapper = ({ children, ...props }) => (
  <div {...props} className={`relative ${props.className || ""}`}>
    <div
      className={`absolute inset-0 blur-[160px] ${
        props.wrapperClassName || ""
      }`}
      style={{
        background:
          "linear-gradient(180deg, #7C3AED 0%, rgba(152, 103, 240, 0.984375) 0.01%, rgba(237, 78, 80, 0.2) 100%)",
        height: "100%", // Ensuring it covers the wrapper
        width: "100%", // Ensuring it covers the wrapper
        zIndex: "-1", // Prevent overlapping with children
      }}
    ></div>
    <div className="relative">{children}</div>
  </div>
);

export default GradientWrapper;
