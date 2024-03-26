/* eslint-disable @typescript-eslint/no-var-requires */
import { parse } from 'yaml';

const path = require('path');
const fs = require('fs');

export const getEnv = () => {
  //   return process.env.NODE_ENV || 'development';
  return process.env.RUNNING_ENV;
};

/**
 * 读取 YAML 配置文件
 */
export const getConfig = () => {
  const environment = getEnv();
  const yamlPath = path.resolve(process.cwd(), `./.config/${environment}.yaml`);
  const file = fs.readFileSync(yamlPath, 'utf8');
  const config = parse(file);
  return config;
};
