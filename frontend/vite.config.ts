import {resolve} from 'path'
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import {flatRoutes} from 'remix-flat-routes'
import tsconfigPaths from "vite-tsconfig-paths";

const MODE = process.env.NODE_ENV;
installGlobals();

export default defineConfig({
  resolve: { preserveSymlinks: true },
  build: {
    cssMinify: MODE === "production",
    sourcemap: true,
    commonjsOptions: {
			include: [/frontend/, /backend/, /node_modules/],
		},
  },
  plugins: [
    tsconfigPaths({}),
    remix({
      ignoredRouteFiles: ["**/*"],
      future: {
        v3_fetcherPersist: true,
      },
      serverModuleFormat: "esm",
      routes: async (defineRoutes) => {
        return flatRoutes('routes', defineRoutes, {
          ignoredRouteFiles: [
						'.*',
						'**/*.css',
						'**/*.test.{js,jsx,ts,tsx}',
						'**/__*.*',
						// If you need a route that includes "server" or "client" in the
						// filename, use the escape brackets like: my-route.[server].tsx
							// '**/*.server.*',
							// '**/*.client.*',
					],
          appDir: resolve(__dirname, 'app')
        })

      }

      
    }),
  ],
});
