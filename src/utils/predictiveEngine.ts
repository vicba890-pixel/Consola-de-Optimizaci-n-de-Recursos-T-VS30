/**
 * T-VS30 Predictive Engine
 * Linear Regression (OLS) & Holt's Double Exponential Smoothing for distributed node telemetry.
 */

export interface ForecastPoint {
  step: number;
  timeLabel: string;
  actual?: number;
  predicted: number;
  upperBound: number;
  lowerBound: number;
}

export interface PredictiveResult {
  algorithm: 'linear_regression' | 'exponential_smoothing';
  forecastPoints: ForecastPoint[];
  currentLoadGbps: number;
  predictedPeakGbps: number;
  projectedGrowthPercent: number;
  rSquaredOrMape: number; // R² for regression or MAPE % for smoothing
  slopeOrTrend: number;
  riskStatus: 'nominal' | 'elevated' | 'critical_preemption_required';
  preemptiveActionSuggested: string;
}

/**
 * Ordinary Least Squares (OLS) Linear Regression
 */
export function computeLinearRegressionForecast(
  history: number[],
  horizonSteps: number = 6,
  stepMinutes: number = 5
): PredictiveResult {
  const n = history.length;
  if (n < 2) {
    return getFallbackResult(history[0] || 250);
  }

  // Calculate means
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += history[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  // Calculate slope (beta1) and intercept (beta0)
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    const diffX = i - meanX;
    num += diffX * (history[i] - meanY);
    den += diffX * diffX;
  }

  const slope = den !== 0 ? num / den : 0;
  const intercept = meanY - slope * meanX;

  // Calculate R² (coefficient of determination) and standard error
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const yPred = intercept + slope * i;
    ssTot += Math.pow(history[i] - meanY, 2);
    ssRes += Math.pow(history[i] - yPred, 2);
  }
  const r2 = ssTot !== 0 ? Math.max(0, Math.min(0.999, 1 - ssRes / ssTot)) : 0.95;
  const stdError = Math.sqrt(ssRes / Math.max(1, n - 2));

  // Build points
  const points: ForecastPoint[] = [];

  // Historical fitted points
  for (let i = 0; i < n; i++) {
    const predicted = Number((intercept + slope * i).toFixed(1));
    points.push({
      step: i,
      timeLabel: `-${(n - 1 - i) * stepMinutes}m`,
      actual: history[i],
      predicted: predicted,
      upperBound: Number((predicted + 1.96 * stdError).toFixed(1)),
      lowerBound: Number((Math.max(0, predicted - 1.96 * stdError)).toFixed(1)),
    });
  }

  // Future projected points
  for (let h = 1; h <= horizonSteps; h++) {
    const stepIdx = n - 1 + h;
    const predicted = Number((intercept + slope * stepIdx).toFixed(1));
    // Uncertainty grows with horizon sqrt(h)
    const margin = 1.96 * stdError * Math.sqrt(1 + h / n);
    points.push({
      step: stepIdx,
      timeLabel: `+${h * stepMinutes}m`,
      predicted: predicted,
      upperBound: Number((predicted + margin).toFixed(1)),
      lowerBound: Number((Math.max(0, predicted - margin)).toFixed(1)),
    });
  }

  const currentVal = history[n - 1];
  const lastPredicted = points[points.length - 1].predicted;
  const growth = Number((((lastPredicted - currentVal) / currentVal) * 100).toFixed(1));

  let risk: 'nominal' | 'elevated' | 'critical_preemption_required' = 'nominal';
  let action = 'Carga proyectada dentro de márgenes de confort. Sin acción correctiva.';

  if (lastPredicted > 450 || growth > 30) {
    risk = 'critical_preemption_required';
    action = 'Alerta preventiva: Se aconseja pre-calentar enlaces alternativos en árbol CMST.';
  } else if (lastPredicted > 350 || growth > 15) {
    risk = 'elevated';
    action = 'Crecimiento sostenido: Habilitar desvío bioclimático a zonas free-cooling.';
  }

  return {
    algorithm: 'linear_regression',
    forecastPoints: points,
    currentLoadGbps: currentVal,
    predictedPeakGbps: lastPredicted,
    projectedGrowthPercent: growth,
    rSquaredOrMape: Number(r2.toFixed(3)),
    slopeOrTrend: Number(slope.toFixed(2)),
    riskStatus: risk,
    preemptiveActionSuggested: action,
  };
}

/**
 * Holt's Double Exponential Smoothing (Level + Trend)
 */
export function computeExponentialSmoothingForecast(
  history: number[],
  alpha: number = 0.35,
  beta: number = 0.15,
  horizonSteps: number = 6,
  stepMinutes: number = 5
): PredictiveResult {
  const n = history.length;
  if (n < 2) {
    return getFallbackResult(history[0] || 250);
  }

  let level = history[0];
  let trend = history[1] - history[0];

  const smoothedValues: number[] = [level];

  // Run recurrence
  let absErrorsSum = 0;
  for (let i = 1; i < n; i++) {
    const val = history[i];
    const prevLevel = level;
    const prevTrend = trend;

    level = alpha * val + (1 - alpha) * (prevLevel + prevTrend);
    trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;

    const oneStepAhead = prevLevel + prevTrend;
    smoothedValues.push(oneStepAhead);
    absErrorsSum += Math.abs((val - oneStepAhead) / (val || 1));
  }

  const mape = Number(((absErrorsSum / (n - 1)) * 100).toFixed(2)); // MAPE percentage

  const points: ForecastPoint[] = [];

  // Historical
  for (let i = 0; i < n; i++) {
    const smoothed = Number(smoothedValues[i].toFixed(1));
    points.push({
      step: i,
      timeLabel: `-${(n - 1 - i) * stepMinutes}m`,
      actual: history[i],
      predicted: smoothed,
      upperBound: Number((smoothed * 1.05).toFixed(1)),
      lowerBound: Number((smoothed * 0.95).toFixed(1)),
    });
  }

  // Future projection: y_hat = level + h * trend
  for (let h = 1; h <= horizonSteps; h++) {
    const stepIdx = n - 1 + h;
    const projected = Number((level + h * trend).toFixed(1));
    const margin = projected * (0.04 + h * 0.015);
    points.push({
      step: stepIdx,
      timeLabel: `+${h * stepMinutes}m`,
      predicted: projected,
      upperBound: Number((projected + margin).toFixed(1)),
      lowerBound: Number((Math.max(0, projected - margin)).toFixed(1)),
    });
  }

  const currentVal = history[n - 1];
  const lastPredicted = points[points.length - 1].predicted;
  const growth = Number((((lastPredicted - currentVal) / currentVal) * 100).toFixed(1));

  let risk: 'nominal' | 'elevated' | 'critical_preemption_required' = 'nominal';
  let action = 'Modelo exponencial adaptado a la volatilidad estocástica. Tráfico nominal.';

  if (lastPredicted > 450 || growth > 30) {
    risk = 'critical_preemption_required';
    action = 'Alerta de tendencia ascendente: Desviar micro-slices a núcleos RISC-V secundarios.';
  } else if (lastPredicted > 350 || growth > 15) {
    risk = 'elevated';
    action = 'Régimen de alta demanda: Incrementar buffer zero-copy a 512MB preventivamente.';
  }

  return {
    algorithm: 'exponential_smoothing',
    forecastPoints: points,
    currentLoadGbps: currentVal,
    predictedPeakGbps: lastPredicted,
    projectedGrowthPercent: growth,
    rSquaredOrMape: mape,
    slopeOrTrend: Number(trend.toFixed(2)),
    riskStatus: risk,
    preemptiveActionSuggested: action,
  };
}

function getFallbackResult(val: number): PredictiveResult {
  return {
    algorithm: 'linear_regression',
    forecastPoints: [],
    currentLoadGbps: val,
    predictedPeakGbps: val,
    projectedGrowthPercent: 0,
    rSquaredOrMape: 1.0,
    slopeOrTrend: 0,
    riskStatus: 'nominal',
    preemptiveActionSuggested: 'Recopilando muestras históricas suficientes...',
  };
}
