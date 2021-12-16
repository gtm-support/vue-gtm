import { App, createApp, defineComponent } from 'vue';
import type { Router, RouteRecordRaw } from 'vue-router';
import { createMemoryHistory, createRouter } from 'vue-router';

export function appendAppDivToBody(): void {
  const appDiv: HTMLDivElement = document.createElement('div');
  appDiv.id = 'app';
  document.body.appendChild(appDiv);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function createAppWithComponent() {
  // eslint-disable-next-line @typescript-eslint/typedef
  const appComponent = defineComponent({
    name: 'App',
    render() {
      return null;
    }
  });
  const app: App<Element> = createApp(appComponent);
  return { app, component: appComponent };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function createAppWithRouter(routes: RouteRecordRaw[]) {
  const router: Router = createRouter({
    history: createMemoryHistory(),
    routes
  });
  // eslint-disable-next-line @typescript-eslint/typedef
  const appComponent = defineComponent({
    name: 'App',
    render() {
      return null;
    }
  });
  const app: App<Element> = createApp(appComponent);
  app.use(router);
  return { app, router };
}

export function resetHtml(): void {
  const html: HTMLHtmlElement = document.getElementsByTagName('html')[0] as HTMLHtmlElement;
  html.innerHTML = '';
}

export function resetDataLayer(): void {
  delete window['dataLayer'];
}
