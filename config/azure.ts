/**
 * Azure OpenAI Configuration
 * Configuration for Azure OpenAI services
 */

export const AZURE_CONFIG = {
  OPENAI_API_KEY: "298f0acdd2354859842285849d5d9d26",
  OPENAI_ENDPOINT: "https://inkr-openai.openai.azure.com/",
  OPENAI_DEPLOYMENT: "gpt-4.1-mini",
  API_VERSION: "2024-12-01-preview",
};

export const AZURE_OPENAI_URL = `${AZURE_CONFIG.OPENAI_ENDPOINT}openai/deployments/${AZURE_CONFIG.OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_CONFIG.API_VERSION}`;
