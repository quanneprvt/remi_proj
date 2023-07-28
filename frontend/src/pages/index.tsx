const Index = () => {
  return <></>;
};

export default Index;

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/login",
    },
  };
}
