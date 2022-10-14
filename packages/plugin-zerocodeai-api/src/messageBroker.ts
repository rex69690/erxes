import * as request from 'request';
import * as dotenv from 'dotenv';
import {
  ISendMessageArgs,
  sendMessage as sendCommonMessage
} from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { generateModels } from './connectionResolver';

dotenv.config();

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeQueue } = client;

  consumeQueue(
    'zerocodeai:analyze',
    async ({ subdomain, data: { conversation, messages } }) => {
      const models = await generateModels(subdomain);
      const config = await models.Configs.getConfig();

      let negativeCount = 0;
      let positiveCount = 0;

      for (const message of messages) {
        const response: any = await new Promise((resolve, reject) => {
          request(
            {
              method: 'POST',
              url: 'https://zero-ai.com/inference',
              formData: {
                // api_key: config.apiKey,
                // token: config.token,
                // values: message.content
                api_key: '621cdaffe1655b48d3573bc8',
                token: '61ea8538f5971f9cd11805a6::6294dbb4c52888681f37f8a2',
                // api_key: '62c28b1ca92a75129cf0f914',
                // token: '61ea8538f5971f9cd11805a6::6348d5efb329d7d584f2fbae',
                values: message.content
              }
            },
            (error, response) => {
              if (error) {
                return reject(error);
              }

              return resolve(JSON.parse(response.body));
            }
          );
        });

        if (response.p.includes('positive')) {
          positiveCount++;
        }

        if (response.p.includes('negative')) {
          negativeCount++;
        }

        if (
          !(await models.Analysis.findOne({ contentTypeId: conversation._id }))
        ) {
          await models.Analysis.create({
            contentType: 'inbox:conversation',
            contentTypeId: conversation._id,
            sentiment: positiveCount > negativeCount ? 'positive' : 'negative'
          });
        }
      }
    }
  );
};

export default function() {
  return client;
}

export const sendContactsMessage = (args: ISendMessageArgs) => {
  return sendCommonMessage({
    client,
    serviceDiscovery,
    serviceName: 'contacts',
    ...args
  });
};

export const sendInboxMessage = (args: ISendMessageArgs) => {
  return sendCommonMessage({
    client,
    serviceDiscovery,
    serviceName: 'inbox',
    ...args
  });
};
