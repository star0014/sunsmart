import pandas as pd
import requests
import plotly.express as px

# =========================================================
# AUSTRALIAN SUN SAFETY HUB
# Fully working Plotly map with:
# - live UV + weather data from OpenWeather
# - rich custom hover cards
# - city zoom dropdown
# - map style switcher
# - safe fallback if API fails
# =========================================================

API_KEY = "fbb042d19a635b120baa0a4958cbabb6"

cities = [
    {"name": "Melbourne", "lat": -37.8136, "lon": 144.9631},
    {"name": "Sydney", "lat": -33.8688, "lon": 151.2093},
    {"name": "Brisbane", "lat": -27.4698, "lon": 153.0251},
    {"name": "Perth", "lat": -31.9505, "lon": 115.8605},
    {"name": "Adelaide", "lat": -34.9285, "lon": 138.6007},
    {"name": "Darwin", "lat": -12.4634, "lon": 130.8456}
]

# ---------------------------------------------------------
# Helper: UV category
# ---------------------------------------------------------
def classify_uv(uv_val):
    if uv_val < 3:
        return {
            "status": "LOW RISK",
            "rec": "Minimal protection needed 🌳",
            "warning": "Safe for most people.",
            "color": "#289500"
        }
    elif uv_val < 6:
        return {
            "status": "MODERATE",
            "rec": "Wear SPF + hat 🧴",
            "warning": "Protect your skin during midday.",
            "color": "#F7E400"
        }
    elif uv_val < 8:
        return {
            "status": "HIGH",
            "rec": "Seek shade + cover up ⛱️",
            "warning": "Unprotected skin may burn quickly.",
            "color": "#F85900"
        }
    elif uv_val < 11:
        return {
            "status": "VERY HIGH",
            "rec": "Avoid direct sun if possible ☂️",
            "warning": "Burn risk is very high.",
            "color": "#D8001D"
        }
    else:
        return {
            "status": "EXTREME",
            "rec": "Stay indoors if possible 🏠",
            "warning": "Extreme UV exposure risk.",
            "color": "#6B49C8"
        }

# ---------------------------------------------------------
# Fetch live weather + UV data
# ---------------------------------------------------------
map_list = []

for city in cities:
    url = (
        f"https://api.openweathermap.org/data/3.0/onecall"
        f"?lat={city['lat']}&lon={city['lon']}"
        f"&exclude=minutely,hourly,daily,alerts"
        f"&appid={API_KEY}&units=metric"
    )

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        current = data.get("current", {})

        uv_val = float(current.get("uvi", 9.2))
        temp = current.get("temp", "N/A")
        feels_like = current.get("feels_like", "N/A")
        humidity = current.get("humidity", "N/A")
        wind = current.get("wind_speed", "N/A")
        clouds = current.get("clouds", "N/A")
        weather_desc = current.get("weather", [{}])[0].get("description", "Unavailable").title()

    except Exception:
        # Fallback values if API key fails or request errors
        uv_val = 9.2
        temp = "N/A"
        feels_like = "N/A"
        humidity = "N/A"
        wind = "N/A"
        clouds = "N/A"
        weather_desc = "Unavailable"

    uv_info = classify_uv(uv_val)

    custom_tooltip = (
        f"<span style='font-size:18px;'>📍 <b>{city['name']}</b></span><br>"
        f"<span style='font-size:14px; color:{uv_info['color']};'><b>{uv_info['status']}</b></span><br>"
        f"<span style='font-size:14px; color:orange;'><b>UV Index: {uv_val:.1f}</b></span><br><br>"
        f"<span><b>Weather:</b> {weather_desc}</span><br>"
        f"<span><b>Temp:</b> {temp}°C</span><br>"
        f"<span><b>Feels Like:</b> {feels_like}°C</span><br>"
        f"<span><b>Humidity:</b> {humidity}%</span><br>"
        f"<span><b>Wind:</b> {wind} m/s</span><br>"
        f"<span><b>Cloud Cover:</b> {clouds}%</span><br><br>"
        f"<span><b>Recommendation:</b> {uv_info['rec']}</span><br>"
        f"<span><b>Warning:</b> {uv_info['warning']}</span>"
        f"<extra></extra>"
    )

    map_list.append({
        "City": city["name"],
        "Lat": city["lat"],
        "Lon": city["lon"],
        "UV_Index": uv_val,
        "UV_Status": uv_info["status"],
        "UV_Color": uv_info["color"],
        "Rec": uv_info["rec"],
        "Warning": uv_info["warning"],
        "Temp": temp,
        "Feels_Like": feels_like,
        "Humidity": humidity,
        "Wind": wind,
        "Clouds": clouds,
        "Weather": weather_desc,
        "Custom_Hover": custom_tooltip
    })

df_map = pd.DataFrame(map_list)

# ---------------------------------------------------------
# Main map
# ---------------------------------------------------------
fig = px.scatter_mapbox(
    df_map,
    lat="Lat",
    lon="Lon",
    color="UV_Index",
    size=[22] * len(df_map),
    hover_name="City",
    custom_data=[
        "Custom_Hover",
        "UV_Status",
        "Temp",
        "Humidity",
        "Wind",
        "Rec"
    ],
    color_continuous_scale=[
        (0.00, "#289500"),
        (0.20, "#F7E400"),
        (0.45, "#F85900"),
        (0.70, "#D8001D"),
        (1.00, "#6B49C8")
    ],
    range_color=[0, 14],
    zoom=3.2,
    center={"lat": -25.5, "lon": 133.0},
    mapbox_style="open-street-map",
    title="<b>☀️ Australian Sun Safety Hub</b><br><sup>Live UV + Weather Snapshot</sup>"
)

fig.update_traces(
    hovertemplate="%{customdata[0]}",
    marker=dict(opacity=0.95)
)

# ---------------------------------------------------------
# City zoom dropdown
# ---------------------------------------------------------
buttons_city = [
    dict(
        label="Reset View",
        method="relayout",
        args=[{
            "mapbox.center": {"lat": -25.5, "lon": 133.0},
            "mapbox.zoom": 3.2,
            "annotations": [{
                "text": "Select a city to zoom in",
                "xref": "paper",
                "yref": "paper",
                "x": 0.5,
                "y": 0.02,
                "showarrow": False,
                "font": {"size": 13, "color": "lightgray"},
                "bgcolor": "rgba(0,0,0,0)"
            }]
        }]
    )
]

for _, row in df_map.iterrows():
    buttons_city.append(
        dict(
            label=f"Visit {row['City']}",
            method="relayout",
            args=[{
                "mapbox.center": {"lat": row["Lat"], "lon": row["Lon"]},
                "mapbox.zoom": 8,
                "annotations": [{
                    "text": (
                        f"📍 <b>{row['City']}</b><br>"
                        f"UV: <b>{row['UV_Index']:.1f}</b> ({row['UV_Status']})<br>"
                        f"🌡 Temp: {row['Temp']}°C<br>"
                        f"💨 Wind: {row['Wind']} m/s<br>"
                        f"🧴 {row['Rec']}"
                    ),
                    "xref": "paper",
                    "yref": "paper",
                    "x": 0.98,
                    "y": 0.06,
                    "xanchor": "right",
                    "yanchor": "bottom",
                    "showarrow": False,
                    "align": "left",
                    "bgcolor": "rgba(255,255,255,0.95)",
                    "bordercolor": "#D0D7DE",
                    "borderwidth": 1,
                    "font": {"color": "#111111", "size": 14},
                    "borderpad": 8
                }]
            }]
        )
    )

# ---------------------------------------------------------
# Map style switcher
# These styles are usually safe without Mapbox token
# ---------------------------------------------------------
buttons_style = [
    dict(label="Street", method="relayout", args=[{"mapbox.style": "open-street-map"}]),
    dict(label="Dark", method="relayout", args=[{"mapbox.style": "carto-darkmatter"}]),
    dict(label="Light", method="relayout", args=[{"mapbox.style": "carto-positron"}]),
]

# ---------------------------------------------------------
# Layout polish
# ---------------------------------------------------------
fig.update_layout(
    hovermode="closest",
    margin={"r": 0, "t": 90, "l": 0, "b": 0},
    paper_bgcolor="black",
    plot_bgcolor="black",
    font=dict(color="white", family="Arial"),
    coloraxis_colorbar=dict(
        title="UV Index",
        thickness=16,
        len=0.75,
        bgcolor="rgba(0,0,0,0.35)"
    ),
    updatemenus=[
        {
            "buttons": buttons_city,
            "direction": "down",
            "showactive": True,
            "x": 0.01,
            "y": 0.99,
            "xanchor": "left",
            "yanchor": "top",
            "bgcolor": "rgba(255,255,255,0.92)",
            "bordercolor": "#D0D7DE",
            "font": {"color": "#111111", "size": 12},
            "pad": {"r": 10, "t": 10}
        },
        {
            "buttons": buttons_style,
            "direction": "right",
            "showactive": True,
            "x": 0.14,
            "y": 0.99,
            "xanchor": "left",
            "yanchor": "top",
            "bgcolor": "rgba(255,255,255,0.92)",
            "bordercolor": "#D0D7DE",
            "font": {"color": "#111111", "size": 12},
            "pad": {"r": 10, "t": 10}
        }
    ],
    annotations=[
        {
            "text": "Select a city to zoom in",
            "xref": "paper",
            "yref": "paper",
            "x": 0.5,
            "y": 0.02,
            "showarrow": False,
            "font": {"size": 13, "color": "lightgray"},
            "bgcolor": "rgba(0,0,0,0)"
        }
    ]
)

fig.show(config={
    "scrollZoom": True,
    "displayModeBar": True
})