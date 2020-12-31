import 'filepond/dist/filepond.min.css';
import "../styles/tailwind.css";

function MyApp({ Component, pageProps }: { Component: React.FC, pageProps: any }) {
    return <Component {...pageProps} />;
}

export default MyApp;