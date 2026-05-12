import { View } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { useTheme } from "../hooks/use-theme";

type TinyChartProps = {
  values: number[];
  color?: string;
  height?: number;
};

export function TinyChart({ values, color, height = 90 }: TinyChartProps) {
  const { theme } = useTheme();
  const points = makePoints(values, 320, height);
  return (
    <View style={{ height }}>
      <Svg width="100%" height={height} viewBox={`0 0 320 ${height}`}>
        <Polyline
          points={points}
          fill="none"
          stroke={color ?? theme.primary}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function makePoints(values: number[], width: number, height: number) {
  if (values.length === 0) return `0,${height - 10} ${width},${height - 10}`;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - 10 - ((value - min) / range) * (height - 22);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
