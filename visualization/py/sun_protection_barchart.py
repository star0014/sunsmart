import pandas as pd
import plotly.graph_objects as go

# ---------------------------------------------------------
# 1. Load cleaned CSV
# ---------------------------------------------------------
sb_df = pd.read_csv(
    "/Users/gifhariheryndra/Documents/Semester 1 2026/FIT 5120/Studio/week 1/dataset/processed/csv_final/sun_protection_behaviours_cleaned.csv"
)

# Optional: enforce age order
age_order = [
    "15–24 years",
    "25–34 years",
    "35–44 years",
    "45–54 years",
    "55–64 years",
    "65 years and over"
]

sb_df["age_group"] = pd.Categorical(
    sb_df["age_group"],
    categories=age_order,
    ordered=True
)

sb_df = sb_df.sort_values(["behavior", "age_group"]).reset_index(drop=True)

# Age-based color palette
age_colors = {
    "15–24 years": "#1f77b4",
    "25–34 years": "#17becf",
    "35–44 years": "#2ca02c",
    "45–54 years": "#ff7f0e",
    "55–64 years": "#d62728",
    "65 years and over": "#9467bd"
}

# ---------------------------------------------------------
# 2. Build heatmap data
# ---------------------------------------------------------
pivot = sb_df.pivot(index="behavior", columns="age_group", values="percentage")

avg_map = (
    sb_df.groupby("behavior")["percentage"]
    .mean()
    .reindex(pivot.index)
    .round(1)
)

max_age_map = (
    sb_df.loc[
        sb_df.groupby("behavior")["percentage"].idxmax(),
        ["behavior", "age_group"]
    ]
    .set_index("behavior")["age_group"]
    .reindex(pivot.index)
)

custom_heat = []
for beh in pivot.index:
    row_custom = []
    for age in pivot.columns:
        row = sb_df[
            (sb_df["behavior"] == beh) &
            (sb_df["age_group"] == age)
        ].iloc[0]

        row_custom.append([
            avg_map.loc[beh],                    # 0
            max_age_map.loc[beh],               # 1
            int(row["age_rank_within_behavior"]),  # 2
            row["insight"]                      # 3
        ])
    custom_heat.append(row_custom)

# ---------------------------------------------------------
# 3. Interactive Heatmap
# ---------------------------------------------------------
fig_heat = go.Figure(
    data=go.Heatmap(
        z=pivot.values,
        x=pivot.columns.tolist(),
        y=pivot.index.tolist(),
        customdata=custom_heat,
        colorscale="YlGnBu",
        colorbar=dict(
            title="Percentage (%)",
            thickness=18
        ),
        hovertemplate=(
            "<b>%{y}</b><br>"
            "Age Group: <b>%{x}</b><br>"
            "Value: <b>%{z:.1f}%</b><br>"
            "Behaviour Avg (all ages): %{customdata[0]:.1f}%<br>"
            "Top age for this behaviour: %{customdata[1]}<br>"
            "Rank within behaviour: #%{customdata[2]}<br>"
            "<i>%{customdata[3]}</i>"
            "<extra></extra>"
        )
    )
)

fig_heat.update_layout(
    title="<b>Sun-Protection Behaviours by Age Group</b><br><i>Interactive Heatmap</i>",
    xaxis_title="Age Group",
    yaxis_title="Behaviour",
    template="plotly_white",
    height=560,
    margin=dict(l=140, r=40, t=90, b=60),
    font=dict(family="Arial", size=13)
)

fig_heat.show()

# ---------------------------------------------------------
# 4. Dropdown Bar Chart
# ---------------------------------------------------------
beh_list = pivot.index.tolist()

fig_bar = go.Figure()

for i, behavior_name in enumerate(beh_list):
    subset = (
        sb_df[sb_df["behavior"] == behavior_name]
        .sort_values("age_group")
        .copy()
    )

    custom_bar = subset[
        ["behavior_avg", "age_rank_within_behavior", "insight"]
    ].to_numpy()

    bar_colors = subset["age_group"].map(age_colors).tolist()

    fig_bar.add_trace(
        go.Bar(
            x=subset["age_group"],
            y=subset["percentage"],
            name=behavior_name,
            customdata=custom_bar,
            marker=dict(color=bar_colors),
            text=subset["percentage"].round(1),
            textposition="outside",
            visible=(i == 0),
            hovertemplate=(
                "<b>%{fullData.name}</b><br>"
                "Age Group: <b>%{x}</b><br>"
                "Value: <b>%{y:.1f}%</b><br>"
                "Behaviour Avg (all ages): %{customdata[0]:.1f}%<br>"
                "Rank within behaviour: #%{customdata[1]}<br>"
                "<i>%{customdata[2]}</i>"
                "<extra></extra>"
            )
        )
    )

# ---------------------------------------------------------
# 5. Dropdown buttons
# ---------------------------------------------------------
buttons = []
for i, behavior_name in enumerate(beh_list):
    visible = [False] * len(beh_list)
    visible[i] = True

    buttons.append(
        dict(
            label=behavior_name,
            method="update",
            args=[
                {"visible": visible},
                {"title": f"<b>{behavior_name}</b><br><i>Percentage by Age Group</i>"}
            ]
        )
    )

# ---------------------------------------------------------
# 6. Layout for dropdown bar chart
# ---------------------------------------------------------
fig_bar.update_layout(
    title=f"<b>{beh_list[0]}</b><br><i>Percentage by Age Group</i>",
    xaxis_title="Age Group",
    yaxis_title="Percentage (%)",
    template="plotly_white",
    height=540,
    margin=dict(l=80, r=40, t=110, b=70),
    font=dict(family="Arial", size=13),
    updatemenus=[
        dict(
            buttons=buttons,
            direction="down",
            showactive=True,
            x=1.02,
            xanchor="left",
            y=1.12,
            yanchor="top",
            bgcolor="#f8f9fa",
            bordercolor="#cccccc",
            borderwidth=1,
            font=dict(color="black", size=12),
            pad=dict(r=10, t=5, b=5, l=5)
        )
    ]
)

fig_bar.update_yaxes(
    showgrid=True,
    gridwidth=1,
    gridcolor="LightGray"
)

fig_bar.show()