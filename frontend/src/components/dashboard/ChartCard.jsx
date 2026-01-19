import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, description, data, type = 'line', dataKeys = [] }) => {
  const renderChart = () => {
    const commonProps = {
      data: data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Bar
                key={key.key}
                dataKey={key.key}
                fill={key.color || `hsl(${index * 60}, 70%, 50%)`}
                name={key.name || key.key}
              />
            ))}
          </BarChart>
        );
      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line
                key={key.key}
                type="monotone"
                dataKey={key.key}
                stroke={key.color || `hsl(${index * 60}, 70%, 50%)`}
                name={key.name || key.key}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
