import { Button } from "@chakra-ui/react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <p>
          Image galery would be here...
        </p>
        <Button as="a" href="/canvas" colorScheme="teal">Realtime canvas</Button>
      </div>
    </main>
  );
}
