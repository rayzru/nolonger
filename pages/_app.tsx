import type { AppProps } from "next/app";
import { PrismicPreview } from "@prismicio/next";
import { apiEndpoint } from "../prismic-config";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrismicPreview repositoryName={apiEndpoint}>
      <Component {...pageProps} />
    </PrismicPreview>
  );
}

export default MyApp;
