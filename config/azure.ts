/**
 * Azure OpenAI Configuration
 * Configuration for Azure OpenAI services
 */

export const AZURE_CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_ENDPOINT: process.env.OPENAI_ENDPOINT || "",
  OPENAI_DEPLOYMENT: process.env.OPENAI_DEPLOYMENT || "",
  API_VERSION: process.env.API_VERSION || "",
};

export const AZURE_OPENAI_URL = `${AZURE_CONFIG.OPENAI_ENDPOINT}openai/deployments/${AZURE_CONFIG.OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_CONFIG.API_VERSION}`;
