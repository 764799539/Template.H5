// import env from '../../build/env'
let env = 'development'

// 系统管理接口请求基地址
export const SystemApiUrl = env === 'development'
    ? 'http://localhost:5002/api/system'
    : env === 'production'
        ? 'http://222.211.86.211:5002/api/system'
        : 'http://222.211.86.211:5002/api/system'

// 日志管理接口请求基地址
export const LogApiUrl = env === 'development'
    ? 'http://222.211.86.211:5001/api/log'
    : env === 'production'
        ? 'http://222.211.86.211:5001/api/log'
        : 'http://222.211.86.211:5001/api/log'

// ERP接口请求基地址
export const ErpApiUrl = env === 'development'
    ? 'http://localhost:5003/api'
    : env === 'production'
        ? 'http://222.211.86.211:5067/api'
        : 'http://222.211.86.211:5067/api'

// 仓储ERP接口请求基地址
export const StoreErpApiUrl = env === 'development'
    ? 'http://localhost:5020/api/Store'
    : env === 'production'
        ? 'http://222.211.86.211:5020/api/Store'
        : 'http://222.211.86.211:5020/api/Store'

// 图片服务器基地址
export const ImageServer = env === 'development'
    ? 'http://imgtest.pelly.cc/'
    : env === 'production'
        ? 'http://imgtest.pelly.cc/'
        : 'http://imgtest.pelly.cc/'

// 老图片服务器基地址
export const OldImageServer = env === 'development'
    ? 'https://test.pelly.cc/UKPelly/uploadfiles/'
    : env === 'production'
        ? 'https://test.pelly.cc/UKPelly/uploadfiles/'
        : 'https://test.pelly.cc/UKPelly/uploadfiles/'

export const QiniuUploadUrl = 'https://upload-z2.qiniup.com'
export const WebSocketUrl = 'ws://222.211.86.211:5014/ws?sid='
