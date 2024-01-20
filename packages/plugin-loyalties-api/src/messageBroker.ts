import { generateModels } from './connectionResolver';
import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';

import { checkVouchersSale, confirmVoucherSale } from './utils';

export const initBroker = async () => {
  consumeRPCQueue(
    'loyalties:voucherCampaigns.find',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      return {
        data: await models.VoucherCampaigns.find(data).lean(),
        status: 'success',
      };
    },
  );

  consumeRPCQueue('loyalties:checkLoyalties', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    const { ownerType, ownerId, products } = data;
    return {
      data: await checkVouchersSale(
        models,
        subdomain,
        ownerType,
        ownerId,
        products,
      ),
      status: 'success',
    };
  });

  consumeQueue('loyalties:confirmLoyalties', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    const { checkInfo } = data;
    return {
      data: await confirmVoucherSale(models, checkInfo),
      status: 'success',
    };
  });

  consumeQueue(
    'loyalties:automations.receiveSetPropertyForwardTo',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      const target = data.target;

      const response = await models.ScoreLogs.create({
        ownerId: target._id,
        ownerType: data.collectionType,
        changeScore: data.setDoc[Object.keys(data.setDoc)[0]],
        createdAt: new Date(),
        description: 'Via automation',
      });

      return {
        data: response,
        status: 'success',
      };
    },
  );
};

export const sendProductsMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'products',
    ...args,
  });
};

export const sendContactsMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'contacts',
    ...args,
  });
};

export const sendCoreMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    serviceName: 'core',
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

export const sendClientPortalMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'clientportal',
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

export const sendRPCMessage = async (channel, message): Promise<any> => {
  return client.sendRPCMessage(channel, message);
};

export const sendNotification = (subdomain: string, data) => {
  return sendNotificationsMessage({ subdomain, action: 'send', data });
};

export const sendSegmentsMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'segments',
    ...args,
  });
};
