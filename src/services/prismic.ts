import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';
import * as pHelpers from '@prismicio/helpers';
import {
  CustomTypeModelGroupField,
  DateField,
  FilledLinkToWebField,
  ImageField,
  KeyTextField,
  PrismicDocument,
  SelectField,
} from '@prismicio/types';

const Elements = pHelpers.Element;

export function getPrismicClient(req?: unknown): DefaultClient {
  const apiEndpoint = process.env.PRISMIC_API_ENDPOINT;
  const accessToken = process.env.PRISMIC_ACESS_TROKEN;
  return Prismic.client(apiEndpoint, { req, accessToken });
}

export const linkResolver = document => `/${document.data?.uid || ''}`;

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
  const prismic = getPrismicClient();

  const propertiesResponse = await prismic.query<PrismicProperty>(
    Prismic.predicates.at('document.type', 'property')
  );

  const properties = propertiesResponse.results.map(prop => {
    console.log(prop.data.log);
    return {
      uid: prop.uid,
      title: prop.data.title,
      logo: prop.data.logo.square.url,
      link: prop.data.link.url,
      log: prop.data.log.map(l => ({
        status: l?.status || 'normal',
        blocked: new Date(l?.blocked).toISOString() || null,
        updated: new Date(l?.updated).toISOString() || null,
        reason: l?.reason,
        source: l?.source?.url || '',
      })),
    };
  });
  return properties || [];
};
