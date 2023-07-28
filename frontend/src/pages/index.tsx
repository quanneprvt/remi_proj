const Index = () => {
  return <></>;
};

export default Index;

export async function getStaticProps() {
  return {
    redirect: {
      destination: "/login",
    },
  };
}
