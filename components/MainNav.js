import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { getToken, readToken, removeToken } from '@/lib/authenticate';
import { addToHistory } from '@/lib/userData';

export default function MainNav() {
  const [searchField, setSearchField] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (getToken()) {
      const token = readToken();
      setUserName(token.userName);
    } else {
      setUserName('');
    }
  }, [router.pathname]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsExpanded(false);
    const queryString = `title=true&q=${searchField}`;

    if (getToken()) {
      await addToHistory(queryString);
    } else {
      setSearchHistory(current => [...current, queryString]);
    }

    router.push(`/artwork?${queryString}`);
  }

  function logout() {
    setIsExpanded(false);
    removeToken();
    setUserName('');
    router.push('/login');
  }

  return (
    <>
      <Navbar className="fixed-top navbar-dark bg-primary" expand="lg" expanded={isExpanded}>
        <Container>
          <Navbar.Brand>Gaurav Vedak</Navbar.Brand>
          <Navbar.Toggle onClick={() => setIsExpanded(!isExpanded)} />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link active={router.pathname === "/"} onClick={() => setIsExpanded(false)}>Home</Nav.Link>
              </Link>

              {userName && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link active={router.pathname === "/search"} onClick={() => setIsExpanded(false)}>Advanced Search</Nav.Link>
                </Link>
              )}
            </Nav>

            {userName && (
              <Form className="d-flex" onSubmit={handleSubmit}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                />
                <Button type="submit" variant="outline-light">Search</Button>
              </Form>
            )}

            &nbsp;

            <Nav>
              {userName ? (
                <NavDropdown title={userName} id="basic-nav-dropdown">
                  <Link href="/favourites" passHref legacyBehavior>
                    <NavDropdown.Item onClick={() => setIsExpanded(false)}>Favourites</NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref legacyBehavior>
                    <NavDropdown.Item onClick={() => setIsExpanded(false)}>Search History</NavDropdown.Item>
                  </Link>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Link href="/register" passHref legacyBehavior>
                    <Nav.Link active={router.pathname === "/register"} onClick={() => setIsExpanded(false)}>Register</Nav.Link>
                  </Link>
                  <Link href="/login" passHref legacyBehavior>
                    <Nav.Link active={router.pathname === "/login"} onClick={() => setIsExpanded(false)}>Login</Nav.Link>
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br /><br />
    </>
  );
}