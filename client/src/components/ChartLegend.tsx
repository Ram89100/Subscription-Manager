import React from 'react';

interface ChartLegendProps {
  data: {
    labels: string[];
    datasets: { backgroundColor: string[] }[];
  };
}

// Componente que exibe a legenda do gráfico
export const ChartLegend: React.FC<ChartLegendProps> = ({ data }) => {
  return (
    <div className="chart-legend">
      {data.labels.map((label, index) => (
        <div key={label} className="legend-item">
          <span
            className="legend-color-box"
            style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
          ></span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};
