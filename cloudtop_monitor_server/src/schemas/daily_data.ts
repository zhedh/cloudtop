import { DataTypes } from 'sequelize'
import dayjs from 'dayjs'
import { sequelize } from '../database/mysql/connection'

const DailyData = sequelize.define(
  'DailyData',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 浏览量(PV)
    pv: {
      type: DataTypes.NUMBER(),
      allowNull: true,
      field: 'pv',
    },
    // 访客数(UV)
    uv: {
      type: DataTypes.NUMBER(),
      allowNull: true,
      field: 'uv',
    },
    // 新访客
    newUv: {
      type: DataTypes.NUMBER(),
      allowNull: true,
      field: 'newUv',
    },
    // IP
    ip: {
      type: DataTypes.NUMBER(),
      allowNull: true,
      field: 'ip',
    },
    // 日期
    date: {
      type: DataTypes.STRING(100), // '2023-07-14'
      allowNull: false,
      field: 'date',
    },
    // 应用标识
    projectCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'projectCode',
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

export { DailyData }
