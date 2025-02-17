export const appInfo = () => {
  // app info
  console.log(
    `%c APP_VERSION %c ${import.meta.env.VITE_APP_NAME} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:#e6a23c; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  );
  console.log(
    `%c APP_BUILD_TIME %c ${import.meta.env.APP_BUILD_TIME} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:#409eff; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  );
  console.log(
    `%c APP_VERSION %c ${import.meta.env.APP_VERSION} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:#67c23a; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  );
  console.groupEnd();
};

export const logger = {
  info: (message: string) => {
    console.log(
      `%c${message}`,
      `background:#35495E; padding: 1px 6px; border-radius: 3px;  color: #fff;`
    );
  },
  progress: (message: string) => {
    console.log(
      `%c${message}`,
      `background:#409eff; padding: 1px 6px; border-radius: 3px;  color: #fff;`
    );
  },
  success: (message: string) => {
    console.log(
      `%c${message}`,
      `background:#67c23a; padding: 1px 6px; border-radius: 3px;  color: #fff;`
    );
  },
  warning: (message: string) => {
    console.log(
      `%c${message}`,
      `background:#e6a23c; padding: 1px 6px; border-radius: 3px;  color: #fff;`
    );
  },
  error: (message: string) => {
    console.log(
      `%c${message}`,
      `background:#f56c6c; padding: 1px 6px; border-radius: 3px;  color: #fff;`
    );
  },
};
