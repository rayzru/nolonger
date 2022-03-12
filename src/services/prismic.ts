import * as prismic from '@prismicio/client';
import { Element, LinkResolverFunction } from '@prismicio/helpers';
import {
  CustomTypeModelGroupField,
  DateField,
  FilledLinkToWebField,
  ImageField,
  KeyTextField,
  PrismicDocument,
  SelectField,
} from '@prismicio/types';

const apiEndpoint = prismic.getRepositoryEndpoint(
  process.env.PRISMIC_REPO || 'nolonger'
);
const accessToken = process.env.PRISMIC_ACESS_TROKEN;

export const linkResolver: LinkResolverFunction<string> = doc => {
  if (doc.type === 'property') {
    return `/property/${doc.uid}`;
  }
  return '/';
};

export const prismicClient = (req = null) =>
  prismic.createClient(apiEndpoint, createClientOptions(req, accessToken));

const createClientOptions = (req = null, prismicAccessToken = null) => {
  const reqOption = req ? { req } : {};
  const accessTokenOption = prismicAccessToken
    ? { accessToken: prismicAccessToken }
    : {};
  return {
    ...reqOption,
    ...accessTokenOption,
  };
};
export type PropertyLogStatusType =
  | 'inaccessible'
  | 'obstructing'
  | 'unspecified'
  | 'normal';
export interface PropertyLogInterface {
  status: PropertyLogStatusType;
  blocked?: string;
  updated?: string;
  reason: string;
  source: string;
}
export interface PropertyInterface {
  uid?: string;
  title: string;
  log: PropertyLogInterface[];
  logo: string;
  link: string;
}

export interface PrismicPropertyLogo extends ImageData {
  square: ImageField;
  small: ImageField;
}

interface PrismicPropertyLog extends CustomTypeModelGroupField {
  status: SelectField<PropertyLogStatusType>;
  blocked: DateField;
  updated: DateField;
  reason?: KeyTextField;
  source: Partial<FilledLinkToWebField>;
}

interface PrismicProperty extends PrismicDocument {
  title: KeyTextField;
  logo: PrismicPropertyLogo;
  log: PrismicPropertyLog[];
  link: FilledLinkToWebField;
}

export const getProperties = async (q?: string) => {
  const client = prismicClient();

  const propertiesResponse = await client.getAllByType('property');
  console.log(propertiesResponse);
  const properties = propertiesResponse.map(prop => {
    return {
      uid: prop.uid,
      title: prop.data.title,
      logo: prop.data.logo?.square?.url || null,
      link: prop.data.link?.url || null,
      log: prop.data.log.map(l => ({
        status: l?.status || 'normal',
        blocked: new Date(l?.blocked).toISOString() || null,
        updated: new Date(l?.updated).toISOString() || null,
        reason: l?.reason,
        source: l?.source?.url || null,
      })),
    };
  });
  return properties || [];
};
