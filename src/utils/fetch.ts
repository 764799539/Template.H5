
import axios from 'axios'
import { getToken, setToken } from '@/utils/auth'
import { SystemApiUrl } from '../utils/config'
import { Notice, Modal } from 'view-design';
import store from '@/store/index'
let NoticeEntity: any = Notice
let ModalEntity: any = Modal
// 创建axios实例
const service = axios.create({
    baseURL: SystemApiUrl, // api的base_url
    timeout: 30000,        // 请求超时时间ms
    responseType: 'json',
    withCredentials: true,
    transformRequest: [function (data) {
        // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs
        // data = qs.stringify(data)
        return data
    }],
    transformResponse: [function (data) {
        // 这里提前处理返回的数据
        return data
    }]
})

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return config
}, error => {
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error)
})

// response 拦截器
service.interceptors.response.use(
    response => {
        // 处理excel文件
        if (response.headers && (response.headers['content-type'] === 'application/x-msdownload' || response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            let blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
            let a = document.createElement('a')
            let url = window.URL.createObjectURL(blob)
            let date = new Date()
            let year = date.getFullYear()
            let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
            let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            let filename = 'Excel_' + year + '-' + month + '-' + day + ' ' + hour + '点' + minute + '分' + second + '秒' + '.xls'
            a.href = url
            a.download = filename
            a.click()
            window.URL.revokeObjectURL(url)
        }
        if (response.data.Status !== 100) {
            if (response.data.Msg) {
                NoticeEntity.error({
                    title: '提示',
                    desc: response.data.Msg
                })
            }
            return response.data
            // return new Promise(() => { })
            // return Promise.reject(new Error(response.data.Msg))
        }
        return response.data
    },
    error => {
        // let LoginStatus = store.state.erp.LoginStatus
        // if (!LoginStatus) LoginStatus = 1
        if (error.code === 'ECONNABORTED') {
            error.message = '连接服务器超时，请重试'
            NoticeEntity.error({
                title: '错误',
                desc: '连接服务器超时，请重试'
            })
            return Promise.reject(error)
        }
        if (error.message === 'Network Error') {
            error.message = '连接服务器出错，请检查网络是否正常'
            NoticeEntity.error({
                title: '错误',
                desc: '连接服务器出错，请检查网络是否正常'
            })
            return Promise.reject(error)
        }
        if (error && error.response) {
            // if (LoginStatus === 1 || LoginStatus === 0) {
            if (true) {
                switch (error.response.status) {
                    case 400:
                        error.message = '请求错误'
                        NoticeEntity.error({
                            title: '错误',
                            desc: '请求错误，请重试'
                        })
                        break
                    case 401:
                        // store.state.erp.LoginStatus = 0
                        error.message = '您的登录会话已过期，请退出重新登录'
                        NoticeEntity.warning({
                            title: '错误',
                            content: '您的登录会话已过期，请退出重新登录',
                            onOk: () => {
                                store.dispatch('Logout')
                                setToken('')
                                return null
                            }
                        })
                        // Vue.$router.push({
                        //   name: 'login'
                        // })
                        break
                    case 403:
                        error.message = '您的请求过于频繁，请稍后重试'
                        NoticeEntity.warning({
                            title: '警告',
                            desc: '您的请求过于频繁，请稍后重试'
                        })
                        break
                    case 404:
                        error.message = `请求地址出错: ${error.response.config.url}`
                        NoticeEntity.error({
                            title: '错误',
                            desc: `请求地址出错: ${error.response.config.url}`
                        })
                        break
                    case 408:
                        error.message = '请求超时，请重试'
                        NoticeEntity.error({
                            title: '错误',
                            desc: '请求超时，请重试'
                        })
                        break
                    case 500:
                        error.message = '服务器内部错误'
                        NoticeEntity.error({
                            title: '服务器内部错误'
                        })
                        break
                    case 501:
                        error.message = '服务未实现'
                        NoticeEntity.error({
                            title: '错误',
                            desc: '服务未实现'
                        })
                        break
                    case 502:
                        error.message = '网关错误'
                        NoticeEntity.error({
                            title: '错误',
                            desc: '网关错误'
                        })
                        break
                    case 503:
                        error.message = '系统维护中，请稍后访问'
                        NoticeEntity.info({
                            title: '系统维护中，请稍后访问'
                        })
                        break
                    case 504:
                        error.message = '网关超时'
                        NoticeEntity.error({
                            title: '错误',
                            desc: '网关超时'
                        })
                        break
                    case 505:
                        error.message = 'HTTP版本不受支持'
                        NoticeEntity.warning({
                            title: '错误',
                            desc: 'HTTP版本不受支持'
                        })
                        break
                    default:
                }
            } else {
                // store.state.erp.LoginStatus = 0
                error.message = '您的登录会话已过期，请退出重新登录'
                ModalEntity.warning({
                    title: '错误',
                    content: '您的登录会话已过期，请退出重新登录',
                    onOk: () => {
                        store.dispatch('Logout')
                        setToken('')
                        return null
                    }
                })
            }
            return Promise.reject()
        }
        return Promise.reject(error)
    }
)

export default service
