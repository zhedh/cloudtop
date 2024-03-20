interface AppConfig {
  PORT: number
}

const appConfig: AppConfig = {
  PORT: process.env.CLOUDTOP_MONITOR_SERVER_PORT
    ? +process.env.CLOUDTOP_MONITOR_SERVER_PORT
    : 3100,
}

export default appConfig
