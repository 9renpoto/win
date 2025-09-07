import { useState, useEffect, useRef } from "preact/hooks";
import algoliasearch from "algoliasearch/lite";

interface SearchProps {
  appId: string;
  searchKey: string;
  indexName: string;
}

interface Hit {
  objectID: string;
  title: string;
  snippet: string;
}

export default function Search(props: SearchProps) {
  const { appId, searchKey, indexName } = props;
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const searchInput = useRef<HTMLInputElement>(null);

  const searchClient = algoliasearch(appId, searchKey);
  const index = searchClient.initIndex(indexName);

  useEffect(() => {
    if (query.length > 0) {
      index.search<Hit>(query).then(({ hits }) => {
        setHits(hits);
      });
    } else {
      setHits([]);
    }
  }, [query]);

  return (
    <div class="relative">
      <input
        ref={searchInput}
        type="text"
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
        placeholder="Search..."
        class="border rounded-lg px-2 py-1"
      />
      {hits.length > 0 && (
        <ul class="absolute top-full left-0 w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
          {hits.map((hit) => (
            <li key={hit.objectID} class="border-b">
              <a href={`/entry/${hit.objectID}`} class="block p-2 hover:bg-gray-100">
                <div class="font-bold">{hit.title}</div>
                <p class="text-sm text-gray-600">{hit.snippet}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
