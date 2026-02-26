import useSWR from 'swr';
import Error from 'next/error';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';
import { useRouter } from 'next/router';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null, fetcher);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList, objectID]);

  async function favouritesClicked() {
    let updatedList;

    if (showAdded) {
      updatedList = await removeFromFavourites(objectID);
      setShowAdded(false);
    } else {
      updatedList = await addToFavourites(objectID);
      setShowAdded(true);
    }

    if (updatedList) setFavouritesList(updatedList);
  }

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  return (
    <Card>
      {data.primaryImage && (
        <Card.Img variant="top" src={data.primaryImage} />
      )}
      <Card.Body>
        <Card.Title>{data.title || 'N/A'}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {data.objectDate || 'N/A'} <br />
          <strong>Classification:</strong> {data.classification || 'N/A'} <br />
          <strong>Medium:</strong> {data.medium || 'N/A'} <br /><br />
          <strong>Artist:</strong> {data.artistDisplayName || 'N/A'} <br />
          <strong>Credit Line:</strong> {data.creditLine || 'N/A'} <br />
          <strong>Dimensions:</strong> {data.dimensions || 'N/A'} <br />
          {data.artistWikidata_URL && (
            <>
              <strong>Wiki:</strong>{' '}
              <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer">
                wiki
              </a>
              <br />
            </>
          )}
        </Card.Text>
        <Button
          variant={showAdded ? 'primary' : 'outline-primary'}
          onClick={favouritesClicked}
        >
          {showAdded ? '+ Favourite (added)' : '+ Favourite'}
        </Button>
      </Card.Body>
    </Card>
  );
}
// Final version - committed as Final Commit