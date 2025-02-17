import { type ApiPromise, request } from '@/libs';

/**
 * 登录
 */
export const login = async (data: any): ApiPromise<any> => {
  return await request({
    url: '/auth/user/loginV2',
    method: 'post',
    data,
  })
}

/**
 * 退出登录
 */
export const logout = async () => {
  return await request({
    url: '/auth/user/logout',
    method: 'get',
  });
};

// 获取系统菜单及操作权限列表
export const getResourceMenuPer = async (
  params: { resPlate: string | number } = {
    resPlate: import.meta.env.VITE_APP_RESOURCE_PLATE,
  }
) => {
  return await request({
    url: '/auth/resource/menuPer',
    method: 'get',
    params,
  });
};
