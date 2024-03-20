import { DataTypes } from 'sequelize'
import dayjs from 'dayjs'
import { sequelize } from '../database/connection'

const User = sequelize.define(
  'User',
  {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 用户唯一标识
    userId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'userId',
    },
    // 用户类型（权限控制） super 超级管理员 manager 管理员 developer 开发者 operator 运营人员 guest 体验人员
    userType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'userType',
    },
    // 手机号
    phone: {
      type: DataTypes.STRING(11),
      allowNull: true,
      field: 'phone',
    },
    // 邮箱
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'email',
    },
    // 登录名
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'nickname',
    },
    // 登录密码
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'password',
    },
    // 头像
    avatar: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'avatar',
    },
    // 人员所属团队
    teamId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'teamId',
    },
    // 状态 0=未激活 1=已激活 2=禁用
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status',
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

export { User }
