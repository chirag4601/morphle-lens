import { Helmet } from "react-helmet";

const MetaTag = ({ title }) => (
  <Helmet>
    <title>{title}</title>
  </Helmet>
);

export default MetaTag;
