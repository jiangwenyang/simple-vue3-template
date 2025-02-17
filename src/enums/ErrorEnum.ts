export enum ErrorEnum {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const ErrorDetails = {
  [ErrorEnum.UNAUTHORIZED]: {
    code: ErrorEnum.UNAUTHORIZED,
    message: '未授权访问，请先登录。',
  },
  [ErrorEnum.FORBIDDEN]: {
    code: ErrorEnum.FORBIDDEN,
    message: '您没有访问此资源的权限。',
  },
  [ErrorEnum.NOT_FOUND]: {
    code: ErrorEnum.NOT_FOUND,
    message: '资源未找到。',
  },
  [ErrorEnum.INTERNAL_SERVER_ERROR]: {
    code: ErrorEnum.INTERNAL_SERVER_ERROR,
    message: '服务器内部错误，请稍后重试。',
  },
};
