/* eslint-disable jsx-a11y/anchor-is-valid */
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import CatCard from './CatCard';

export default function Cats() {
    const addDialogRef = useRef();
    const { data: cats, refetch, metadata } = useCats();

    const paginationHandler = (e) => {
        e.preventDefault();
        const name = e.target.getAttribute('data-name');
        if (name in metadata?.links) {
            const url = metadata.links[name];
            refetch(url);
        }
    };

    return (
        <article>
            <h2>
                Cats List (
                <a
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        addDialogRef.current.showModal();
                    }}
                >
                    Create
                </a>
                )
                <AddCatDialogForm ref={addDialogRef} refetch={refetch} />
            </h2>

            {cats?.length ? (
                <table border="1" cellpading="5" cellSpacing="5">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cats?.map((cat) => (
                            <CatCard
                                cat={cat}
                                getCats={refetch}
                                url={''}
                                key={cat.id}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No cats to display</p>
            )}

            <menu style={{ display: 'flex' }}>
                {metadata?.links?.previous ? (
                    <a
                        href="#"
                        data-name="previous"
                        onClick={paginationHandler}
                    >
                        &lsaquo;Previous
                    </a>
                ) : null}
                {metadata?.links?.next ? (
                    <a
                        href="#"
                        data-name="next"
                        onClick={paginationHandler}
                        style={{ marginInlineStart: 'auto' }}
                    >
                        Next&rsaquo;
                    </a>
                ) : null}
            </menu>
        </article>
    );
}

const AddCatDialogForm = forwardRef((props, ref) => {
    const [name, setName] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const handleSubmit = async (e) => {
        if (!name) {
            e.preventDefault();
            alert('Name is required!');
            return;
        }

        addCat(axiosPrivate, { name }).then(() => {
            // refetch cats
            props.refetch();
        });
        setName('');
    };

    return (
        <dialog ref={ref}>
            <form method="dialog" onSubmit={handleSubmit}>
                <header>
                    <h4>New Cat</h4>
                </header>
                <article>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </article>
                <footer>
                    <menu>
                        <button
                            className="cancel"
                            type="button"
                            onClick={() => ref.current.close()}
                        >
                            Cancel
                        </button>
                        <button>Create</button>
                    </menu>
                </footer>
            </form>
        </dialog>
    );
});

function useCats() {
    const axiosPrivate = useAxiosPrivate();
    const [cats, setCats] = useState();

    const fetcher = useCallback(
        (url) => {
            getCats(axiosPrivate, url)
                .then((res) => res.data)
                .then((data) => setCats(data));
        },
        [axiosPrivate]
    );

    useEffect(() => {
        if (axiosPrivate) fetcher();
    }, [axiosPrivate, fetcher]);

    return { data: cats?.data, metadata: cats?.metadata, refetch: fetcher };
}

const getCats = (axios, url = '/cats?limit=3&offset=0') => axios.get(url);
const addCat = (axios, body) => axios.post('/cats/', { id: 0, ...body });
