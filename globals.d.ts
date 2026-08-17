// Fallback ambient declarations so plain-CSS side-effect imports
// (e.g. `import "./globals.css"`) always resolve for TypeScript, even if
// the editor's TS server hasn't picked up Next.js's own types yet (most
// commonly right after cloning, before `npm install` has run).
declare module "*.css";
