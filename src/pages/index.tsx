import Prismic from '@prismicio/client';
import * as Helpers from '@prismicio/helpers';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './index.module.scss';

interface Property {
  uid?: string;
  data: {
    title: string;
  };
}

interface PropResponse {
  results: Property[];
}

interface IndexProps {
  properties: PropResponse;
  preview: boolean;
}

export default function Index({
  properties,
  preview,
}: IndexProps): JSX.Element {
  console.log('got props', properties);
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {properties.map(prop => {
            console.log(prop.data.title);
            return Helpers.asHTML(prop.data.title);
          })}

          {preview && (
            <aside>
              <Link href="/api/exit-preview">
                <a className={commonStyles.preview}>Preview</a>
              </Link>
            </aside>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<PropResponse> = async ({
  preview = false,
}) => {
  const prismic = getPrismicClient();

  const propertiesResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'property')
  );

  console.log(propertiesResponse);

  const properties = propertiesResponse.results.map(prop => ({
    uid: prop.uid,
    data: { title: prop.data.title },
  }));

  return {
    props: {
      properties,
      preview,
    },
  };
};
