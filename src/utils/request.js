import axios from "axios";
import cache from "@/utils/cache";
import { tansParams } from "@/utils/common";
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例  Create axios instance
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分  The request in axios is configured with the baseURL option, which represents the public part of the request URL
    baseURL: '/esports_server',
    // 超时 overtime
    timeout: 10000,
});
  
// request拦截器  Request interceptor
service.interceptors.request.use(
    (config) => {
      // 是否需要设置 token Whether to set token
      const isToken = (config.headers || {}).isToken === false;
      // 是否需要防止数据重复提交 Whether it is necessary to prevent data re-submission
      const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
      
      // get请求映射params参数  Get request mapping params parameter
      if (config.method === "get" && config.params) {
        let url = config.url + "?" + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
      }
      if (
        !isRepeatSubmit &&
        (config.method === "post" || config.method === "put")
      ) {
        const requestObj = {
          url: config.url,
          data:
            typeof config.data === "object"
              ? JSON.stringify(config.data)
              : config.data,
          time: new Date().getTime(),
        };
        const sessionObj = cache.session.getJSON("sessionObj");
        if (
          sessionObj === undefined ||
          sessionObj === null ||
          sessionObj === ""
        ) {
          cache.session.setJSON("sessionObj", requestObj);
        } else {
          const s_url = sessionObj.url; // 请求地址 Request address
          const s_data = sessionObj.data; // 请求数据 Request data
          const s_time = sessionObj.time; // 请求时间 Request time
          const interval = 0; // 间隔时间(ms)，小于此时间视为重复提交  Interval time (ms), less than this time is considered as repeated submission
          if (
            s_data === requestObj.data &&
            requestObj.time - s_time < interval &&
            s_url === requestObj.url
          ) {
            return Promise.reject();
          } else {
            cache.session.setJSON("sessionObj", requestObj);
          }
        }
      }
      return config;
    },
    (error) => {
      console.log(error);
      Promise.reject(error);
    }
  );
  
  // 响应拦截器 Response interceptor
  service.interceptors.response.use(
    (res) => {
      // 未设置状态码则默认成功状态 If the status code is not set, the default success status is
      const code = res.data.code || 200;
      // 二进制数据则直接返回 Binary data is returned directly
      if (
        res.request.responseType === "blob" ||
        res.request.responseType === "arraybuffer"
      ) {
        return res.data;
      }
      if (code === 500) {
        return Promise.reject();
      }else if (code !== 200) {
        return Promise.reject(res.data);
      } else {
        return Promise.resolve(res.data.response);
      }
    },
    (error) => {
      console.log("err" + error);
      return Promise.reject(error);
    }
  );
  export default service;