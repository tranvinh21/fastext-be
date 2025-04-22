import type { NextFunction, Request, Response } from "express";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type Handler = (req: Request, res: Response, next: NextFunction) => void;

export class RoutePlugin {
  private middlewares: Middleware[] = [];
  private routePath: string = "";
  private routeHandler: Handler | null = null;
  private method: "get" | "post" | "put" | "delete" = "get";

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  register(path: string, handler: Handler) {
    this.routePath = path;
    this.routeHandler = handler;
    return this;
  }

  setMethod(method: "get" | "post" | "put" | "delete") {
    this.method = method;
    return this;
  }

  build() {
    if (!this.routeHandler) {
      throw new Error("Route handler is not set");
    }
    return {
      path: this.routePath,
      stack: [...this.middlewares, this.routeHandler],
      method: this.method,
    };
  }
}
