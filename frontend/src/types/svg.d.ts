/**
 * This file declares TypeScript module definitions for importing SVG files.
 * It allows TypeScript to recognize SVG imports as modules and prevents type errors.
 */
declare module "*.svg" {
    const content: string;
    export default content;
}