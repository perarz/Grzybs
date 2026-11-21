export type WeatherPoint = { latitude: number; longitude: number };
export type WeatherDay = {
  date: string;
  minTemp: number | null;
  maxTemp: number | null;
  precipitation: number | null;
  rainChance: number | null;
  wind: number | null;
  code: number | null;
};
export type WeatherForecast = {
  point: WeatherPoint;
  timezone: string;
  utcOffsetSeconds: number;
  fetchedAt: number;
  days: WeatherDay[];
  history?: WeatherDay[];
  hours?: WeatherHour[];
};

export type WeatherHour = {
  time: string;
  temperature: number | null;
  precipitation: number | null;
  wind: number | null;
};
export type WeatherPeriod = Omit<WeatherHour, 'time'> & { label: string };
