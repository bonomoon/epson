import Link from "next/link";
import Container from "../Container";

export default function ScoreHeader(props) {
  return (
    <header className={`text-center sm:text-left py-2 ${props.className}`}>
      <Container>
        <h1>
          <Link href="/">
            <img src="/logo.svg" alt="Haneum AI" className="h-8 w-auto" />
          </Link>
        </h1>
      </Container>
    </header>
  );
}
