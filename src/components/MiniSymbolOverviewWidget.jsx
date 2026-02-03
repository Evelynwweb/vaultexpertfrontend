import { useEffect, useRef } from "react";

const MiniSymbolOverviewWidget = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove existing script if it exists
    const existingScript = containerRef.current.querySelector("script");
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append script for the TradingView mini symbol overview widget
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "FX:EURUSD",
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "12M",
      colorTheme: "dark",
      trendLineColor: "rgba(17, 85, 204, 1)",
      isTransparent: true,
      autosize: true,
      largeChartUrl: ""
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        {/* <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a> */}
      </div>
    </div>
  );
};

export default MiniSymbolOverviewWidget;
