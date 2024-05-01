import React from 'react';
import { View } from 'react-native';
import Svg, { Text, Path, Defs, LinearGradient, Stop, Line, Circle } from 'react-native-svg';
import * as d3 from 'd3';


const Stressometer = ({ stressValue }) => {
    const width = 100;
    const height = 100;
    const radius = Math.min(width, height) / 2;

    const scale = d3.scaleLinear()
        .domain([0, 100])
        .range([Math.PI, 0])
        .clamp(true);

    const angle = scale(stressValue);

    const strokeWidth = 40;
    const centerY = radius + strokeWidth / 2;
    const centerX = radius + strokeWidth / 2;
    const x = Math.cos(angle)*radius*1.4+centerX;
    const y = -Math.sin(angle)*radius*1.4+centerY;
 
    // Calculate start and end points of the arc
    const startX = centerX + Math.cos(Math.PI) * radius;
    const startY = centerY + Math.sin(Math.PI) * radius;
    const endX = centerX + Math.cos(0) * radius;
    const endY = centerY + Math.sin(0) * radius;

    // Construct the SVG path string
    const path = `M ${startX},${startY} A ${radius},${radius} 0 0 1 ${endX},${endY}`;


    return (
        <View>
            <Svg width={radius * 2 + strokeWidth} height={radius + strokeWidth}>
                {/* Gauge Background */}
                <Defs>
                    <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#24FF00" />
                        <Stop offset="50%" stopColor="#FAFF00" />
                        <Stop offset="100%" stopColor="#FF0000" />
                    </LinearGradient>
                </Defs>
                <Path
                    d={path}
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Gauge Indicator */}
                <Line
                    x1={radius + strokeWidth / 2}
                    y1={radius + strokeWidth / 2}
                    x2={x}
                    y2={y}
                    stroke="#3B3B3B"
                    strokeWidth="3"
                />
                {/* Center Circle */}
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={5}
                    fill="#3B3B3B"
                />
                {/* Display Value */}
                <Text x={radius + strokeWidth/2} y={radius + strokeWidth} textAnchor="middle" fill="white" fontSize={18}>
                    {stressValue}
                </Text>
            </Svg>
        </View>
    );
};

export default Stressometer;