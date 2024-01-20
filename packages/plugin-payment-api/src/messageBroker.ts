import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';

import { generateModels } from './connectionResolver';

export const initBroker = async () => {
  consumeRPCQueue('payment:invoices.findOne', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Invoices.findOne(data).lean(),
    };
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

export const sendCommonMessage = async (
  serviceName: string,
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName,
    ...args,
  });
};

export const sendInboxMessage = async (
  args: ISendMessageArgs,
): Promise<any> => {
  return sendMessage({
    serviceName: 'inbox',
    ...args,
  });
};
