import { useState, useEffect } from "react";

export function useUVData(latitude, longitude, timezone) {
  const [uvIndex, setUvIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    async function fetchUV() {
      setLoading(true);
      setError(null);
      try {
        // Always request with timezone=auto so open-meteo returns times in local timezone
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=uv_index&timezone=auto&forecast_days=1`;
        const res = await fetch(url);
        const data = await res.json();

        // data.timezone is the IANA timezone of the location (e.g. "Europe/Lisbon")
        // Use it to find what the LOCAL hour is at the destination right now
        const locationTimezone = timezone || data.timezone || "UTC";

        // Get the current local time string in the location's timezone
        const nowInLocation = new Date().toLocaleString("en-US", { timeZone: locationTimezone });
        const localHour = new Date(nowInLocation).getHours();

        const currentUV = data.hourly.uv_index[localHour];
        setUvIndex(currentUV !== undefined ? Math.round(currentUV) : 0);
      } catch (err) {
        setError("Failed to fetch UV data");
      } finally {
        setLoading(false);
      }
    }

    fetchUV();
  }, [latitude, longitude, timezone]);

  return { uvIndex, loading, error };
}
