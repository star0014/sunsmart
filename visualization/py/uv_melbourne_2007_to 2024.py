import pandas as pd
import plotly.graph_objects as go
import calendar

# ---------------------------------------------------------
# 1. Load data
# ---------------------------------------------------------
master_df = pd.read_csv(
    "/Users/gifhariheryndra/Documents/Semester 1 2026/FIT 5120/Studio/week 1/dataset/processed/csv_final/uv_melbourne_df.csv"
)

date_col = "Date-Time"
uv_col = "UV_Index"

# ---------------------------------------------------------
# 2. Clean and prepare data
# ---------------------------------------------------------
master_df["Real_Date"] = pd.to_datetime(
    master_df[date_col],
    dayfirst=True,
    errors="coerce"
)

master_df = master_df.dropna(subset=["Real_Date", uv_col]).copy()

master_df["Month_Num"] = master_df["Real_Date"].dt.month
master_df["Month_Name"] = master_df["Month_Num"].apply(lambda x: calendar.month_abbr[x])
master_df["Year"] = master_df["Real_Date"].dt.year

years = sorted(master_df["Year"].dropna().unique())

# ---------------------------------------------------------
# 3. Create figure
# ---------------------------------------------------------
fig = go.Figure()

# WHO-style UV colors
uv_colorscale = [
    (0.00, "#289500"),
    (0.20, "#F7E400"),
    (0.50, "#F85900"),
    (0.75, "#D8001D"),
    (1.00, "#6B49C8")
]

# Month order
month_order = list(calendar.month_abbr)[1:]

# ---------------------------------------------------------
# 4. Helper function: add lollipop traces
# ---------------------------------------------------------
def add_lollipop_pair(df_slice, is_visible=False):
    df_slice = df_slice.sort_values("Month_Num").copy()

    # Ensure all months appear in correct order if available
    df_slice["Month_Name"] = pd.Categorical(
        df_slice["Month_Name"],
        categories=month_order,
        ordered=True
    )
    df_slice = df_slice.sort_values("Month_Name")

    months = df_slice["Month_Name"].tolist()
    uvs = df_slice[uv_col].tolist()

    # Sticks
    x_lines = []
    y_lines = []
    for m, uv in zip(months, uvs):
        x_lines.extend([m, m, None])
        y_lines.extend([0, uv, None])

    fig.add_trace(
        go.Scatter(
            x=x_lines,
            y=y_lines,
            mode="lines",
            line=dict(color="lightgray", width=3),
            hoverinfo="skip",
            showlegend=False,
            visible=is_visible
        )
    )

    # Dots
    fig.add_trace(
        go.Scatter(
            x=months,
            y=uvs,
            mode="markers+text",
            marker=dict(
                size=22,
                color=uvs,
                colorscale=uv_colorscale,
                cmin=0,
                cmax=15,
                line=dict(color="white", width=2)
            ),
            text=[round(u, 1) for u in uvs],
            textposition="top center",
            textfont=dict(
                family="Arial",
                size=14,
                color="black"
            ),
            hovertemplate="<b>%{x}</b><br>Max UV: %{y:.1f}<extra></extra>",
            visible=is_visible,
            showlegend=False
        )
    )

# ---------------------------------------------------------
# 5. Add traces for all years + each year
# ---------------------------------------------------------
all_years_max = (
    master_df.groupby(["Month_Num", "Month_Name"], as_index=False)[uv_col]
    .max()
)
add_lollipop_pair(all_years_max, is_visible=True)

for y in years:
    year_df = master_df[master_df["Year"] == y]
    year_max = (
        year_df.groupby(["Month_Num", "Month_Name"], as_index=False)[uv_col]
        .max()
    )
    add_lollipop_pair(year_max, is_visible=False)

# ---------------------------------------------------------
# 6. Dropdown menu
# ---------------------------------------------------------
buttons = []
total_trace_pairs = 1 + len(years)  # 1 for "All Years" + individual years

def create_visibility_list(active_index):
    vis = [False] * (total_trace_pairs * 2)
    vis[active_index * 2] = True
    vis[active_index * 2 + 1] = True
    return vis

buttons.append(
    dict(
        label="All Years",
        method="update",
        args=[
            {"visible": create_visibility_list(0)},
            {
                "title": "<b>Absolute Maximum UV Index by Month</b><br><i>Melbourne Historical Extremes</i>"
            }
        ]
    )
)

for i, y in enumerate(years):
    buttons.append(
        dict(
            label=str(int(y)),
            method="update",
            args=[
                {"visible": create_visibility_list(i + 1)},
                {
                    "title": f"<b>Maximum UV Index by Month</b><br><i>Melbourne Extremes in {int(y)}</i>"
                }
            ]
        )
    )

# ---------------------------------------------------------
# 7. Reference line
# ---------------------------------------------------------
fig.add_hline(
    y=11,
    line_dash="dash",
    line_color="red",
    annotation_text="Extreme Danger (UV 11+)",
    annotation_position="top left",
    annotation_font_color="red"
)

# ---------------------------------------------------------
# 8. Layout
# ---------------------------------------------------------
fig.update_layout(
    updatemenus=[
        {
            "buttons": buttons,
            "direction": "down",
            "showactive": True,
            "x": -0.20,
            "y": 1.05,
            "xanchor": "left",
            "yanchor": "top",
            "bgcolor": "#f8f9fa",
            "font": {"color": "black", "size": 14},
            "bordercolor": "#cccccc",
            "borderwidth": 1,
            "pad": {"r": 15, "t": 5, "b": 5, "l": 5}
        }
    ],
    title=dict(
        text="<b>Absolute Maximum UV Index by Month</b><br><i>Melbourne Historical Extremes</i>",
        x=0.05
    ),
    xaxis=dict(
        title="Month of the Year",
        showgrid=False,
        categoryorder="array",
        categoryarray=month_order
    ),
    yaxis=dict(
        title="Maximum Recorded UV Index",
        range=[0, 16.5],
        gridcolor="#f0f0f0"
    ),
    plot_bgcolor="white",
    paper_bgcolor="white",
    font=dict(family="Arial", size=14),
    margin=dict(l=180, r=60, t=120, b=50),
    height=600
)

fig.show()