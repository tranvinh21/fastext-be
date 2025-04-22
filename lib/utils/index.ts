import type { Router } from "express";
import type { RoutePlugin } from "../../http/router/routePlugin";

export function registerPlugins(router: Router, plugins: RoutePlugin[]) {
	for (const plugin of plugins) {
		const { path, stack, method } = plugin.build();
		router[method](path, ...stack);
	}
	return router;
}
