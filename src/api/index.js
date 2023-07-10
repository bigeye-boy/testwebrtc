import request from '@/utils/request'

// 退出方法 Exit method
export function logout() {
    return request({
        url: "/logout",
        method: "post",
    });
}

// 获取跳转TMF管理后台地址 Get jump TMF management background address
export const getCode = (query) => {
    console.log(1);
    return request({
        url: '/getCode',
        method: 'get',
        params: query
    })
}

// 获取赛事列表
export const tournament_list = (query) => {
    return request({
        url: '/tournament_list',
        method: 'get',
        params: query
    })
}

// 获取游戏列表
export const game_list = (query) => {
    return request({
        url: '/game_list',
        method: 'get',
        params: query
    })
}

// 获取overview
export const overview = (query) => {
    return request({
        url: '/tournament/overview',
        method: 'get',
        params: query
    })
}


// 获取platform_list
export const get_platform_list = (query) => {
    return request({
        url: '/platform_list',
        method: 'get',
        params: query
    })
}

// 获取temperature
export const get_temperature = (data) => {
    return request({
        url: '/statistics/temperature',
        method: 'post',
        data: data
    })
}

// 获取platform_list
export const get_language_list = (query) => {
    return request({
        url: '/language_list',
        method: 'get',
        params: query
    })
}

// 获取viewers_chat
export const get_viewers_chat = (query) => {
    return request({
        url: '/viewers_chat',
        method: 'get',
        params: query
    })
}

// 获取temperature
export const get_popular_platforms = (data) => {
    return request({
        url: '/popular_platforms',
        method: 'post',
        data: data
    })
}

// 获取popular_language
export const get_popular_language = (data) => {
    return request({
        url: '/popular_languages',
        method: 'post',
        data: data
    })
}

// 获取popular_matches
export const get_popular_matches = (data) => {
    return request({
        url: '/popular_matches',
        method: 'post',
        data: data
    })
}

// 查询通用接口
export const get_target = (data) => {
    return request({
        url: 'statistics/target',
        method: 'post',
        data: data
    })
}
