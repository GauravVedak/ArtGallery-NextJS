import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ArtworkCard from '@/components/ArtworkCard';
import { getFavourites } from '@/lib/userData';
import { getToken } from '@/lib/authenticate';

export default function Favourites() {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  useEffect(() => {
    if (getToken()) {
      getFavourites().then(setFavouritesList);
    }
  }, []);

  return (
    <Row className="gy-4">
      {favouritesList.length > 0 ? (
        favouritesList.map((objectID) => (
          <Col lg={3} key={objectID}>
            <ArtworkCard objectID={objectID} />
          </Col>
        ))
      ) : (
        <Col>
          <Card>
            <Card.Body>
              <h4>Nothing Here</h4>
              Try adding some new artwork to the list.
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>
  );
}