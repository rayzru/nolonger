import { Client, createClient, getRepositoryEndpoint } from '@prismicio/client';
import { LinkResolverFunction } from '@prismicio/helpers';
import { enableAutoPreviews, CreateClientConfig } from '@prismicio/next';

export const apiEndpoint = getRepositoryEndpoint('nolonger');

export const linkResolver: LinkResolverFunction = (doc) => {
  if (doc.type === 'product') {
    return `/products/${doc.uid}`;
  }

  return '/';
};

export const createPrismicClient = (config: CreateClientConfig): Client => {
  const client = createClient(apiEndpoint);

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};