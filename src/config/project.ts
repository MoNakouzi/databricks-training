/**
 * CITYRIDE PROJECT CONFIGURATION
 * Edit the values in this one file before sharing the site with learners.
 * No learner-facing links or project names should need changing elsewhere.
 */
export const projectConfig = {
  // Team and access
  databricksFreeEditionSignupUrl: "https://login.databricks.com/signup?dbx_source=docs&intent=SIGN_UP&tuuid=e55f8d49-4d78-4743-ace1-bf6e269c310e&rl_aid=2c6741b7-cd4e-4771-84d8-e09f60e1bb1b&provider=DB_FREE_TIER&sisu_state=eyJsZWdhbFRleHRTZWVuIjp7Ii9zaWdudXAiOnsidG9zIjp0cnVlLCJwcml2YWN5Ijp0cnVlLCJjb3Jwb3JhdGVFbWFpbFNoYXJpbmciOnRydWV9fX0%3D",
  repositoryUrl: "https://github.com/MoNakouzi/cityride-analytics",
  databricksWorkspaceUrl: "https://dbc-b4856907-e1bd.cloud.databricks.com",
  gitProviderName: "GitHub",
  projectOwnerName: "Mo",

  // Source data: the table name is used in code; the URL is learner-facing help.
  sourceTable: "samples.nyctaxi.trips",
  sourceDataUrl: "https://docs.databricks.com/aws/en/discover/databricks-datasets#nyctaxi",

  // Project resources
  projectCatalog: "cityride",
  developmentSchema: "dev",
  productionSchema: "prod",
  workspaceProvisioningComplete: true,
  repositoryScaffoldComplete: true,
  dashboardName: "CityRide Operations — DEV",
  jobName: "cityride-dev-pipeline",

  // Current official references (review before each new cohort)
  freeEditionGuideUrl: "https://docs.databricks.com/aws/en/getting-started/free-edition",
  freeEditionLimitsUrl: "https://docs.databricks.com/aws/en/getting-started/free-edition-limitations",
  gitFoldersGuideUrl: "https://docs.databricks.com/aws/en/repos/git-operations-with-repos",
  dashboardsGuideUrl: "https://docs.databricks.com/aws/en/dashboards/",
  jobsGuideUrl: "https://docs.databricks.com/aws/en/jobs",
  medallionGuideUrl: "https://docs.databricks.com/aws/en/lakehouse/medallion",
  lakehouseGuideUrl: "https://docs.databricks.com/aws/en/lakehouse",
  unityCatalogGuideUrl: "https://docs.databricks.com/aws/en/catalogs/",
  deltaLakeGuideUrl: "https://docs.databricks.com/aws/en/delta/",
  notebooksGuideUrl: "https://docs.databricks.com/aws/en/notebooks/",
} as const;

export const featureBranches = {
  sourceExploration: "feature/source-exploration",
  bronzeIngestion: "feature/bronze-ingestion",
  silverCleaning: "feature/silver-cleaning",
  goldMetrics: "feature/gold-metrics",
  qualityChecks: "feature/quality-checks",
  dashboard: "feature/dashboard",
} as const;

export type LearnerId = "viri" | "isabel";

export const learners = {
  viri: { name: "Viri", role: "Data engineer", focus: "Bronze, quality gates & release" },
  isabel: { name: "Isabel", role: "Analytics engineer", focus: "Silver, Gold, SQL & dashboard" },
} as const;
