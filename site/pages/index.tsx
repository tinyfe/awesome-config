import Head from 'next/head';
import { Card, Layout, List, PageHeader, Typography } from 'antd';

const { Content, Footer, Header } = Layout;
const { Text, Title } = Typography;

export default function Home() {
  return (
    <Layout className="layout">
      <Head>
        <title>Lerna Quick Start</title>
      </Head>

      <Content>
        <Title>Welcome to Here</Title>
      </Content>
    </Layout>
  );
}
