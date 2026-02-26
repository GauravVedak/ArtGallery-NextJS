import validObjectIDList from '@/public/data/validObjectIDList.json';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import ArtworkCard from '@/components/ArtworkCard';

const PER_PAGE = 12;

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Artwork() {
  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];

  const [artworkList, setArtworkList] = useState();
  const [page, setPage] = useState(1);

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`,
    fetcher
  );

  useEffect(() => {
  if (data?.objectIDs?.length > 0) {
    const filteredResults = validObjectIDList.objectIDs.filter(x =>
      data.objectIDs.includes(x)
    );
    const results = [];
    for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
      const chunk = filteredResults.slice(i, i + PER_PAGE);
      results.push(chunk);
    }
    setArtworkList(results);
    setPage(1);
  } else {
    setArtworkList([]);
  }
}, [data]);

  function previousPage() {
    if (page > 1) setPage((p) => p - 1);
  }

  function nextPage() {
    if (page < artworkList.length) setPage((p) => p + 1);
  }

  if (error) return <Error statusCode={404} />;
  if (!artworkList) return null;

  return (
    <>
      <Row className="gy-4">
        {artworkList.length > 0 ? (
          artworkList[page - 1].map((objectID) => (
            <Col lg={3} key={objectID}>
              <ArtworkCard objectID={objectID} />
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <h4>Nothing Here</h4>
                Try searching for something else.
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      {artworkList.length > 0 && (
        <Row>
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}