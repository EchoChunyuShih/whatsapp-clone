import "../styles/globals.css";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import Login from "../pages/login";
import Loading from "../components/Loading";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const docRef = collection(db, "users");
      setDoc(
        doc(docRef, user.uid),
        {
          displayName: user.displayName,
          email: user.email,
          lastSeen: serverTimestamp(),
          photoUrl: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
