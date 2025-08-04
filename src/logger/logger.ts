/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Request } from 'express';
import { Logger } from '@nestjs/common';

// 配置日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  }),
);

export const logger = WinstonModule.createLogger({
  transports: [
    // 按天存储日志文件
    new winston.transports.DailyRotateFile({
      level: 'info',
      dirname: 'logs', // 日志文件目录
      filename: 'application-%DATE%.log', // 文件名称
      datePattern: 'YYYY-MM-DD', // 每天生成新的日志文件
      zippedArchive: true, // 是否压缩历史日志
      maxSize: '20m', // 每个日志文件最大 20MB
      maxFiles: '180d', // 只保留最近 180 天的日志
      format: logFormat,
    }),
    // 记录错误日志
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: 'logs/errors',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '180d',
      format: logFormat,
    }),
    // 控制台日志
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
      ),
    }),
  ],
});

const noLogUrls = [/.*\/page/];
const noParamsUrls = [/^\/auth\/.*/, /^\/user\/.*/];
export const handleRequestLogger = (
  logger: Logger,
  request: Request,
  code: number = 0,
) => {
  if (noLogUrls.some((url) => request.url.match(url))) return;
  if (request.method.toLowerCase() !== 'post') return;
  const urlInfo = `${request.method} ${request.url}`;
  let log = `请求接口: ${urlInfo} 请求来源: ${request.ip}`;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const userInfo = request['user'];
  if (userInfo) log += ` 用户: ${JSON.stringify(userInfo)}`;
  if (!noParamsUrls.some((url) => url.test(request.url)))
    log += ` 请求参数：${JSON.stringify(request.body)}`;
  if (code === 0) {
    log += ` 成功`;
    logger.log(log);
  } else {
    log += ` 失败`;
    logger.error(log);
  }
};
