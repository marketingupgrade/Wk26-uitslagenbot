import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { motion } from "motion/react";
import { useIsMobile } from "../lib/useMediaQuery";

echarts.use([GaugeChart, CanvasRenderer]);

function colorFor(v: number): string {
  if (v < 34) return "#dc2626"; // rood
  if (v < 67) return "#f59e0b"; // amber
  return "#16a34a"; // groen
}

/**
 * Waarheidsmeter — een Apache ECharts gauge die per vraag oploopt.
 * value: 0..100, label: de (random) sentiment-tekst voor deze stand.
 */
export default function TruthMeter({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const isMobile = useIsMobile();

  // Init één keer; resize mee met de container (rotatie/breedte) via observer.
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, undefined, { renderer: "canvas" });
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  // Update bij elke verandering van value/label.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const col = colorFor(value);
    chart.setOption({
      series: [
        {
          type: "gauge",
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          radius: "92%",
          center: ["50%", "62%"],
          progress: {
            show: true,
            width: 12,
            roundCap: true,
            itemStyle: { color: col, shadowColor: col, shadowBlur: 12 },
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 12,
              color: [
                [0.34, "rgba(220,38,38,0.35)"],
                [0.67, "rgba(245,158,11,0.35)"],
                [1, "rgba(22,163,74,0.35)"],
              ],
            },
          },
          pointer: {
            length: "62%",
            width: 5,
            itemStyle: { color: col },
          },
          anchor: {
            show: true,
            size: 14,
            itemStyle: { color: "#0a0d0b", borderColor: col, borderWidth: 3 },
          },
          axisTick: { show: false },
          splitLine: {
            distance: -12,
            length: 10,
            lineStyle: { color: "rgba(255,255,255,0.25)", width: 1 },
          },
          axisLabel: { show: false },
          title: { show: false },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, "34%"],
            color: col,
            fontSize: isMobile ? 15 : 18,
            fontWeight: 800,
            formatter: (v: number) => `${Math.round(v)}%`,
          },
          data: [{ value, name: "WAARHEIDSMETER" }],
        },
      ],
    });
  }, [value, label]);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      style={{ overflow: "hidden", borderBottom: "1px solid var(--line)" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 10 : 16,
          maxWidth: 760,
          margin: "0 auto",
          padding: isMobile ? "6px 14px" : "8px clamp(14px, 6vw, 80px)",
        }}
      >
        <div
          ref={ref}
          style={{
            width: isMobile ? 110 : 150,
            height: isMobile ? 92 : 120,
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 1.6,
              color: "var(--green-bright)",
              fontWeight: 700,
            }}
          >
            Afstand tot de waarheid
          </div>
          <div
            style={{
              fontSize: isMobile ? 14 : 15,
              fontWeight: 800,
              color: colorFor(value),
              marginTop: 4,
              lineHeight: 1.25,
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: 12, color: "var(--cream)", opacity: 0.6, marginTop: 4 }}>
            {value}% richting absolute voetbalwijsheid
          </div>
        </div>
      </div>
    </motion.div>
  );
}
