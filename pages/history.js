import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { searchHistoryAtom } from '@/store';
import styles from '@/styles/History.module.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { getHistory, removeFromHistory } from '@/lib/userData';
import { getToken } from '@/lib/authenticate';

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [parsedHistory, setParsedHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function loadHistory() {
      if (getToken()) {
        const serverHistory = await getHistory();
        setSearchHistory(serverHistory);
      }
    }
    loadHistory();
  }, []);

  useEffect(() => {
    const parsed = searchHistory.map((item) => {
      const params = new URLSearchParams(item);
      return Object.fromEntries(params.entries());
    });
    setParsedHistory(parsed);
  }, [searchHistory]);

  function historyClicked(e, index) {
    router.push(`/artwork?${searchHistory[index]}`);
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation();

    if (getToken()) {
      const updated = await removeFromHistory(searchHistory[index]);
      setSearchHistory(updated);
    } else {
      const updated = [...searchHistory];
      updated.splice(index, 1);
      setSearchHistory(updated);
    }
  }

  return (
    <>
      {parsedHistory.length === 0 ? (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for some artwork.
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {parsedHistory.map((item, index) => (
            <ListGroup.Item
              key={index}
              className={styles.historyListItem}
              onClick={(e) => historyClicked(e, index)}
            >
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
              {Object.keys(item).map((key) => (
                <span key={key}>
                  {key}: <strong>{item[key]}</strong>&nbsp;
                </span>
              ))}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}