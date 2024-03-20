import { DataTypes } from 'sequelize'
import dayjs from 'dayjs'
import { sequelize } from '../database/connection'

const Project = sequelize.define(
  'Project',
  {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 项目类型 h5 mini
    projectType: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'projectType',
    },
    // 项目标识
    projectCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'projectCode',
    },
    // 项目名称
    projectName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'projectName',
    },
    // 项目LOGO
    projectLogo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'projectLogo',
    },
    // userId
    userId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'userId',
    },
    teamId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'teamId',
    },

    // // 查看者列表
    // viewers: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    //   field: 'viewers',
    // },
    // // 监控代码
    // monitorCode: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    //   field: 'monitorCode',
    // },
    // // 监控代码(fetch)
    // monitorFetchCode: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    //   field: 'monitorFetchCode',
    // },
    // // fetch代码
    // fetchCode: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    //   field: 'fetchCode',
    // },
    // // 上报域名
    // uploadDomain: {
    //   type: DataTypes.STRING(200),
    //   allowNull: true,
    //   field: 'uploadDomain',
    // },
    // // 过滤域名
    // filterDomain: {
    //   type: DataTypes.STRING(200),
    //   allowNull: true,
    //   field: 'filterDomain',
    // },
    // // 过滤类型（包含，不包含）
    // filterType: {
    //   type: DataTypes.STRING(20),
    //   allowNull: true,
    //   field: 'filterType',
    // },
    // // 是否记录
    // recording: {
    //   type: DataTypes.STRING(2),
    //   allowNull: true,
    //   field: 'recording',
    // },
    // // 页面是否聚合
    // pageAggregation: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   field: 'pageAggregation',
    // },
    // // 接口是否聚合
    // httpAggregation: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   field: 'httpAggregation',
    // },
    // // 采样率
    // samplingRate: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   field: 'samplingRate',
    // },
    // // 采样率生效周期
    // samplingCircle: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   field: 'samplingCircle',
    // },
    // // 监控配置项
    // recordConfig: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    //   field: 'recordConfig',
    // },
    // // 健康分
    // healthScore: {
    //   type: DataTypes.FLOAT,
    //   allowNull: true,
    //   field: 'healthScore',
    // },

    // 状态 0=未激活 1=已激活 2=禁用
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status',
    },

    // 删除状态 0, 1代表删除状态
    delStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'delStatus',
    },

    // 创建时间
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return dayjs(this.getDataValue('createdAt')).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      },
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return dayjs(this.getDataValue('updatedAt')).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      },
    },
  },
  {
    freezeTableName: true,
  }
)

export { Project }
