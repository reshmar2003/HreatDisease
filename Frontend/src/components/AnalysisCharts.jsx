import { BarChart3, PieChart } from 'lucide-react'
import Chart from 'react-apexcharts'

function valueOf(value) {
  return Number(value || 0)
}

function CategoryPieChart({ rows, labelKey, colors = ['#5997b5', '#ef836d', '#178f8c', '#e6b85c'] }) {
  const values = rows.map((row) => valueOf(row.patient_count))
  const total = values.reduce((sum, value) => sum + value, 0)
  let currentPercentage = 0
  const segments = rows.map((row, index) => {
    const percentage = total ? (values[index] / total) * 100 : 0
    const segment = `${colors[index % colors.length]} ${currentPercentage}% ${currentPercentage + percentage}%`
    currentPercentage += percentage
    return { label: row[labelKey], value: values[index], color: colors[index % colors.length], segment }
  })
  const gradient = segments.length ? `conic-gradient(${segments.map((segment) => segment.segment).join(', ')})` : '#edf3f3'

  return (
    <div className="pie-chart-layout">
      <div
        className="pie-chart"
        style={{ background: gradient }}
        aria-label={`${total} patients across ${rows.length} categories`}
      >
        <div className="pie-chart-center"><strong>{total}</strong><span>patients</span></div>
      </div>
      <div className="pie-labels">
        {segments.map((segment) => (
          <div key={String(segment.label)}><i style={{ background: segment.color }} /><span>{segment.label}</span><strong>{segment.value}</strong></div>
        ))}
      </div>
    </div>
  )
}

function VerticalBarChart({ rows, labelKey, series }) {
  const options = {
    chart: { toolbar: { show: false }, fontFamily: 'DM Sans, sans-serif' },
    plotOptions: { bar: { horizontal: false, columnWidth: '52%', borderRadius: 3 } },
    colors: series.map(({ color }) => color),
    dataLabels: { enabled: false },
    legend: { show: series.length > 1, position: 'top', horizontalAlign: 'right', fontSize: '11px' },
    grid: { borderColor: '#dce7e9', strokeDashArray: 4, padding: { top: -8, left: 4, right: 4 } },
    xaxis: {
      categories: rows.map((row) => row[labelKey]),
      labels: { style: { colors: '#537080', fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { min: 0, forceNiceScale: true, labels: { style: { colors: '#6a8290', fontSize: '10px' } } },
    tooltip: { theme: 'light' },
  }

  return (
    <div className="apex-chart">
      <Chart options={options} series={series.map(({ name, values }) => ({ name, data: values }))} type="bar" height={190} />
    </div>
  )
}

function SimpleBarChart({ rows, labelKey, valueKey = 'patient_count', color = '#178f8c' }) {
  return (
    <VerticalBarChart
      rows={rows}
      labelKey={labelKey}
      series={[{ name: 'Patients', values: rows.map((row) => valueOf(row[valueKey])), color }]}
    />
  )
}

function GroupedBarChart({ rows, labelKey }) {
  return (
    <VerticalBarChart
      rows={rows}
      labelKey={labelKey}
      series={[
        { name: 'No heart disease', values: rows.map((row) => valueOf(row.no_heart_disease)), color: '#5997b5' },
        { name: 'Heart disease', values: rows.map((row) => valueOf(row.heart_disease)), color: '#ef836d' },
      ]}
    />
  )
}

function ChartPanel({ title, subtitle, children, className = '', icon: Icon = BarChart3 }) {
  return (
    <article className={`chart-panel ${className}`}>
      <div className="chart-panel-heading">
        <div className="chart-panel-icon"><Icon size={17} /></div>
        <div><h2>{title}</h2><p>{subtitle}</p></div>
      </div>
      {children}
    </article>
  )
}

function AnalysisCharts({ chartData, isLoading }) {
  if (isLoading) {
    return <div className="charts-loading">Loading patient analysis...</div>
  }

  if (!chartData) {
    return null
  }

  const heartDiseaseRows = [
    { label: 'No heart disease', patient_count: chartData.heartDisease.find((row) => row.target === 0)?.patient_count },
    { label: 'Heart disease', patient_count: chartData.heartDisease.find((row) => row.target === 1)?.patient_count },
  ]

  return (
    <section className="analysis-section" aria-label="Patient analysis charts">
      <div className="section-heading"><p className="eyebrow">Patient analysis</p><h2>Understand the registry</h2></div>
      <div className="charts-grid">
        <ChartPanel title="Heart disease split" subtitle="Target comparison" icon={PieChart}>
          <CategoryPieChart rows={heartDiseaseRows} labelKey="label" />
        </ChartPanel>
        <ChartPanel title="Age distribution" subtitle="Patients by age group">
          <SimpleBarChart rows={chartData.ageDistribution} labelKey="age_group" color="#5997b5" />
        </ChartPanel>
        <ChartPanel title="Cholesterol analysis" subtitle="No disease / disease">
          <GroupedBarChart rows={chartData.cholesterol} labelKey="cholesterol_group" />
        </ChartPanel>
        <ChartPanel title="Blood pressure" subtitle="No disease / disease">
          <GroupedBarChart rows={chartData.bloodPressure} labelKey="blood_pressure_group" />
        </ChartPanel>
        <ChartPanel title="Maximum heart rate" subtitle="No disease / disease">
          <GroupedBarChart rows={chartData.maximumHeartRate} labelKey="heart_rate_group" />
        </ChartPanel>
        <ChartPanel title="Chest pain type" subtitle="Patients by type" icon={PieChart}>
          <CategoryPieChart rows={chartData.chestPainType} labelKey="chest_pain_type" />
        </ChartPanel>
      </div>
      <div className="chart-legend"><span><i className="legend-blue" /> No heart disease</span><span><i className="legend-coral" /> Heart disease</span></div>
    </section>
  )
}

export default AnalysisCharts
