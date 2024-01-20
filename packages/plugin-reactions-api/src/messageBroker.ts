import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';

import { generateModels } from './connectionResolver';

export const initBroker = async () => {
  consumeRPCQueue('reactions:comments.count', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Comments.find(data).countDocuments(),
    };
  });

  consumeRPCQueue(
    'reactions:emojies.likeCount',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      return {
        status: 'success',
        data: await models.Emojis.find(data).countDocuments(),
      };
    },
  );

  consumeRPCQueue(
    'reactions:emojies.heartCount',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      return {
        status: 'success',
        data: await models.Emojis.find(data).countDocuments(),
      };
    },
  );

  consumeRPCQueue(
    'reactions:emojies.isHearted',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      return {
        status: 'success',
        data: await models.Emojis.exists(data),
      };
    },
  );

  consumeRPCQueue('reactions:emojies.isLiked', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Emojis.exists(data),
    };
  });
};

export const sendCoreMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    serviceName: 'core',
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
