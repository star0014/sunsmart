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

