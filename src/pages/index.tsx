import { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { PropertyCard } from '../components/Properties/PropertyCard';
import { getProperties, PropertyInterface } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './index.module.scss';

interface IndexProps {
  properties: PropertyInterface[];
  preview: boolean;
}

export default function Index({
  properties,
  preview,
}: IndexProps): JSX.Element {
  const [query, setQuery] = useState('');

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setQuery(e.target.value || '');
  };
  return (
    <>
      <Head>
        <title>Больше не ...</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.search}>
          <input
            autoComplete={'off'}
            value={query}
            disabled={true}
            onChange={onChangeHandler}
          />
        </div>

        <div className={styles.properties}>
          {properties.map(p => (
            <PropertyCard
              key={p.uid}
              title={p.title}
              log={p.log}
              logo={p.logo}
              link={p.link}
            />
          ))}

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

export const getStaticProps: GetStaticProps<IndexProps> = async ({
  preview = false,
}) => {
  return {
    props: {
      properties: await getProperties(),
      preview,
    },
  };
};
