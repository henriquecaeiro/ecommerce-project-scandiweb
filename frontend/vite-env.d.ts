/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Define your environment variables here.
    // For example, the following variable is defined as a string:
    readonly VITE_GRAPHQL_URI: string;
    // Add other environment variables as needed...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  