import pandas as pd
import plotly.graph_objects as go

graph_df = pd.read_csv("/Users/gifhariheryndra/Documents/Semester 1 2026/FIT 5120/Studio/SunSmart/visualization/datasets/generational_sun_safety.csv")

# Keep original order
labels = ['15–24 years (Gen Z)', '35–44 years (Millennials)', '65+ years (Boomers)']

graph_df["label"] = pd.Categorical(
    graph_df["label"],
    categories=labels,
    ordered=True
)

graph_df = graph_df.sort_values(["label", "behavior"]).reset_index(drop=True)

suntan_pct = graph_df[graph_df["behavior"] == "Attempted to Suntan (%)"].sort_values("label")["percentage"].tolist()
sunburn_pct = graph_df[graph_df["behavior"] == "Experienced Sunburn (%)"].sort_values("label")["percentage"].tolist()
sunscreen_pct = graph_df[graph_df["behavior"] == "Used Sunscreen regularly (%)"].sort_values("label")["percentage"].tolist()

print("Generating Plotly chart...")

fig = go.Figure(data=[
    go.Bar(
        name='Attempted to Suntan (%)',
        x=labels,
        y=suntan_pct,
        marker_color='#FF8C00',
        text=suntan_pct,
        textposition='auto'
    ),
    go.Bar(
        name='Experienced Sunburn (%)',
        x=labels,
        y=sunburn_pct,
        marker_color='#DC143C',
        text=sunburn_pct,
        textposition='auto'
    ),
    go.Bar(
        name='Used Sunscreen regularly (%)',
        x=labels,
        y=sunscreen_pct,
        marker_color='#4682B4',
        text=sunscreen_pct,
        textposition='auto'
    )
])

# 7. Add Styling, Labels, and Titles
fig.update_layout(
    title='<b>The Generational Shift in Sun-Safety Attitudes</b><br><i>(Data from ABS Survey in 2023 to 2024)</i>',
    yaxis_title='Percentage of Population (%)',
    barmode='group',
    font=dict(size=12),
    plot_bgcolor='white',
    hovermode='x unified'
)

# Optional: Add faint grid lines for readability
fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='LightGray')

# 8. Render the interactive chart
fig.show()