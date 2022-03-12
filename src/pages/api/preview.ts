import { linkResolver, prismicClient } from '../../services/prismic';

const Preview = async (req, res) => {
  const { token: ref } = req.query;
  const previewURL = await prismicClient(req).resolvePreviewURL({
    linkResolver,
    defaultURL: '/',
  });

  if (!previewURL) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });
  res.writeHead(302, { Location: `${previewURL}` });
  res.end();
};

export default Preview;
