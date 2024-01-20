import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';

import { generateModels } from './connectionResolver';

export const initBroker = async () => {
  consumeRPCQueue('exmfeed:ExmFeed.find', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.ExmFeed.find(data).lean(),
    };
  });
};

export const sendCoreMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    serviceName: 'core',
    ...args,
  });
};

export const sendReactionsMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'reactions',
    ...args,
  });
};

export const sendCommonMessage = async (
  args: ISendMessageArgs & { serviceName: string },
): Promise<any> => {
  return sendMessage({
    ...args,
  });
};

export const sendNotificationsMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'notifications',
    ...args,
  });
};

export const sendNotification = (subdomain: string, data) => {
  return sendNotificationsMessage({ subdomain, action: 'send', data });
};

export const sendEXMFeedMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'exmfeed',
    ...args,
  });
};
