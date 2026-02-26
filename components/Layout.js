import MainNav from './MainNav';
import Container from 'react-bootstrap/Container';

export default function Layout({ children }) {
  return (
    <>
      <MainNav />
      <Container>
        {children}
      </Container>
      <br />
    </>
  );
}
// Final version - committed as Final Commit