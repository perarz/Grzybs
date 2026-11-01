import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { MONTH_NUMERALS } from '@/features/atlas/labels';
import { pointOnCircle, ringSegmentPath } from '@/features/atlas/ringGeometry';
import { ALL_MONTHS } from '@/features/atlas/season';
import type { Month } from '@/features/atlas/types';
import { typography, useTheme } from '@/theme';

type SeasonClockProps = {
  months: Month[];
  currentMonth: Month;
};

const SIZE = 220;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 104;
const INNER_RADIUS = 72;
const LABEL_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2;
const HAND_LENGTH = INNER_RADIUS - 14;
const HAND_WIDTH = 3;
const HUB_RADIUS = 5;
const DEGREES_PER_MONTH = 360 / 12;
const GAP_DEGREES = 2;

/** A year as a clock face: months in season are filled, the hand points at the current month. */
export function SeasonClock({ months, currentMonth }: SeasonClockProps) {
  const { colors } = useTheme();
  const handAngle = (currentMonth - 0.5) * DEGREES_PER_MONTH;
  const handEnd = pointOnCircle(CENTER, HAND_LENGTH, handAngle);

  return (
    <Svg width={SIZE} height={SIZE} accessibilityElementsHidden importantForAccessibility="no">
      {ALL_MONTHS.map((month) => {
        const startAngle = (month - 1) * DEGREES_PER_MONTH + GAP_DEGREES / 2;
        const endAngle = month * DEGREES_PER_MONTH - GAP_DEGREES / 2;
        const label = pointOnCircle(CENTER, LABEL_RADIUS, (month - 0.5) * DEGREES_PER_MONTH);
        const inSeason = months.includes(month);
        const isNow = month === currentMonth;

        return (
          <G key={month}>
            <Path
              d={ringSegmentPath(CENTER, OUTER_RADIUS, INNER_RADIUS, startAngle, endAngle)}
              fill={inSeason ? colors.season : colors.surfaceMuted}
              stroke={isNow ? colors.accent : 'none'}
              strokeWidth={isNow ? HAND_WIDTH : 0}
            />
            <SvgText
              x={label.x}
              y={label.y}
              fill={inSeason ? colors.onPrimary : colors.textMuted}
              fontSize={typography.label.fontSize}
              fontFamily={typography.label.fontFamily}
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {MONTH_NUMERALS[month]}
            </SvgText>
          </G>
        );
      })}
      <Line
        x1={CENTER}
        y1={CENTER}
        x2={handEnd.x}
        y2={handEnd.y}
        stroke={colors.accent}
        strokeWidth={HAND_WIDTH}
        strokeLinecap="round"
      />
      <Circle cx={CENTER} cy={CENTER} r={HUB_RADIUS} fill={colors.accent} />
    </Svg>
  );
}
