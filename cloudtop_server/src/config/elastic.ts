const elasticConfig = {
  NODE: process.env.CLOUDTOP_ELASTIC_NODE!,
  AUTH: {
    username: process.env.CLOUDTOP_ELASTIC_USERNAME!,
    password: process.env.CLOUDTOP_ELASTIC_PASSWORD!,
  },
  INDEX: process.env.CLOUDTOP_ELASTIC_INDEX!,
  TYPE: process.env.CLOUDTOP_ELASTIC_TYPE!,
}

export default elasticConfig
