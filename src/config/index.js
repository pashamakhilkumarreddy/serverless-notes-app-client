const dev = {
  STRIPE_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  s3: {
    REGION: process.env.REACT_APP_REGION,
    BUCKET: process.env.REACT_APP_BUCKET,
  },
  apiGateway: {
    REGION: process.env.REACT_APP_REGION,
    URL: process.env.REACT_APP_URL,
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
}

const prod = {
  STRIPE_KEY: process.env.REACT_APP_PROD_STRIPE_PUBLIC_KEY,
  s3: {
    REGION: process.env.REACT_APP_PROD_REGION,
    BUCKET: process.env.REACT_APP_PROD_BUCKET,
  },
  apiGateway: {
    REGION: process.env.REACT_APP_PROD_REGION,
    URL: process.env.REACT_APP_PROD_URL,
  },
  cognito: {
    REGION: process.env.REACT_APP_PROD_REGION,
    USER_POOL_ID: process.env.REACT_APP_PROD_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_PROD_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_PROD_IDENTITY_POOL_ID,
  },
}

const config = {
  MAX_ATTACHMENT_SIZE: 5000000,
  ...(process.env.REACT_APP_STAGE === 'prod' ? prod : dev),
};

export default config;
