interface AppConfig {
  PORT: number
}

const appConfig: AppConfig = {
  PORT: process.env.CLOUDTOP_SERVER_PORT
    ? +process.env.CLOUDTOP_SERVER_PORT
    : 3000,
}

export default appConfig
