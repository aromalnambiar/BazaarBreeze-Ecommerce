import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

function Authentication({children}) {
  return (
    <>
      <Header />
        {children}
      <Footer />
    </>
  );
}

export default Authentication;
