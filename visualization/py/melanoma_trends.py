import pandas as pd
import plotly.express as px

# Load cleaned young-adult CSV
sc_df = pd.read_csv("/Users/gifhariheryndra/Documents/Semester 1 2026/FIT 5120/Studio/week 1/dataset/processed/csv_final/clean_skin_cancer_young.csv")

# Keep only actual observed data
sc_df = sc_df[
    (sc_df["cancer"] == "Melanoma of the skin") &
    (sc_df["sex"].isin(["Males", "Females", "Persons"])) &
    (sc_df["data_type"] == "Actual")
].copy()

# Optional cleanup for presentation
sc_df["year"] = pd.to_numeric(sc_df["year"], errors="coerce")
sc_df["count"] = pd.to_numeric(sc_df["count"], errors="coerce")

# Aggregate across young-adult age groups
trend = (
    sc_df.groupby(["year", "sex"], as_index=False)["count"]
    .sum()
)

start_year = int(trend["year"].min())
end_year = int(trend["year"].max())

fig = px.line(
    trend,
    x="year",
    y="count",
    color="sex",
    markers=True,
    title=f"Young Adults (15–39): Melanoma New Cases Over Time<br><sup>Actual observed data only, {start_year}–{end_year}</sup>",
    labels={
        "year": "Year",
        "count": "New Cases",
        "sex": "Sex"
    }
)

fig.update_traces(
    hovertemplate="Year: %{x}<br>Cases: %{y:,.0f}<br>Sex: %{fullData.name}<extra></extra>",
    line=dict(width=3),
    marker=dict(size=8)
)

fig.update_layout(
    template="plotly_white",
    hovermode="x unified",
    height=520,
    legend_title="Sex",
    font=dict(size=12),
    plot_bgcolor="white",
    paper_bgcolor="white",
    margin=dict(l=70, r=40, t=100, b=60)
)

fig.update_xaxes(
    showgrid=False,
    dtick=2
)

fig.update_yaxes(
    showgrid=True,
    gridwidth=1,
    gridcolor="LightGray"
)

fig.show()