import React, { useEffect, useRef, memo } from "react";

function TeslaWidget() {
  const container = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    // Prevent duplicate script injection
    if (scriptRef.current) return;

    // Clear previous widget before adding a new one
    if (container.current) {
      container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    }

    // Create script element
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          ["Apple", "AAPL|1D"],
          ["Google", "GOOGL|1D"],
          ["Microsoft", "MSFT|1D"],
          ["NASDAQ:TSLA|1D"],
          ["NASDAQ:NVDA|1D"],
          ["NASDAQ:META|1D"]
        ],
        "chartOnly": false,
        "width": "100%",
        "height": "100%",
        "locale": "en",
        "colorTheme": "dark",
        "autosize": true,
        "showVolume": true,
        "showMA": true,
        "hideDateRanges": false,
        "hideMarketStatus": false,
        "hideSymbolLogo": false,
        "scalePosition": "right",
        "scaleMode": "Normal",
        "fontFamily": "Trebuchet MS, Roboto, Ubuntu, sans-serif",
        "fontSize": "10",
        "noTimeScale": false,
        "valuesTracking": "1",
        "changeMode": "price-and-percent",
        "chartType": "candlestick",
        "maLineColor": "#2962FF",
        "maLineWidth": 2,
        "maLength": 9,
        "headerFontSize": "medium",
        "backgroundColor": "rgba(255, 255, 255, 0)",
        "widgetFontColor": "rgba(219, 219, 219, 1)",
        "lineWidth": 2,
        "lineType": 0,
        "dateRanges": ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
        "lineColor": "rgba(49, 121, 245, 1)",
        "topColor": "rgba(12, 50, 153, 1)",
        "bottomColor": "rgba(255, 255, 255, 1)"
      }`;

    scriptRef.current = script;
    container.current.appendChild(script);

    return () => {
      // Cleanup: Remove script on unmount to avoid duplication
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container tesla-cont" data-aos="fade-up" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        {/* <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a> */}
      </div>
    </div>
  );
}

export default memo(TeslaWidget);
