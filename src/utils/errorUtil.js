import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

const isLocal = process.env.NODE_ENV === 'development';

export function initSentry () {
  if (isLocal) {
    return;
  }
  Sentry.init({
    dsn: 'https://84c59c27895b48e38e0e703c8d55da80@o551876.ingest.sentry.io/5692036',
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

export function logError(error, errorInfo = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope(scope => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

export function formatErr(err = '') {
  let errorInfo = {};
  let message = err.toString();
  if (!(err instanceof Error) && err.message) {
    errorInfo = err;
    message = err.message;
    err = new Error(message);
  } else if (err.config && err.config.url) {
    errorInfo.url = err.config.url;
  }
  logError(err, errorInfo);
  return message;
}

