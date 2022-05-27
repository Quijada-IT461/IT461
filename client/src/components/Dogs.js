import { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

const Dogs = () => {
    const [dogs, setDogs] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const getDogs = useCallback(
        async (url, options) => {
            try {
                const response = await axiosPrivate.get(url, options);
                console.log(response.data);
                setDogs(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', {
                    state: { from: location },
                    replace: true,
                });
            }
        },
        [axiosPrivate, location, navigate]
    );

    const deleteDog = useCallback(
        (id) =>
            axiosPrivate.delete(`/dogs/${id}`).then(() => {
                // refetch on success
                getDogs();
            }),
        [axiosPrivate, getDogs]
    );

    useEffect(() => {
        const controller = new AbortController();
        getDogs('/dogs/?limit=3&offset=0', {
            signal: controller.signal,
        });
        return () => {
            controller.abort();
        };
    }, [getDogs]);

    const paginationHandler = (e) => {
        e.preventDefault();
        const name = e.target.getAttribute('data-name');
        if (name in dogs?.metadata?.links) {
            const url = dogs.metadata.links[name];
            getDogs(url);
        }
    };

    const dialogRef = useRef();

    return (
        <article>
            <h2>Dogs List</h2>

            {dogs?.data?.length ? (
                <>
                    <table border="1" cellpading="5" cellspacing="5">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dogs.data.map((dog, i) => (
                                <tr key={dog.id}>
                                    <td>{dog.id}</td>
                                    <td>{dog.name}</td>
                                    <td>
                                        <a href=""> View </a> |
                                        <a href=""> Edit </a> |
                                        <a
                                            href=""
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dialogRef.current.showModal();
                                            }}
                                        >
                                            Delete
                                        </a>
                                        <DeleteDialogForm
                                            ref={dialogRef}
                                            onSubmit={() => {
                                                deleteDog(dog.id);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {dogs?.metadata?.links?.previous ? (
                        <a
                            href="#"
                            data-name="previous"
                            onClick={paginationHandler}
                        >
                            {' '}
                            &lsaquo;Previous{' '}
                        </a>
                    ) : (
                        ''
                    )}
                    {dogs?.metadata?.links?.next ? (
                        <a
                            href="#"
                            data-name="next"
                            onClick={paginationHandler}
                        >
                            {' '}
                            Next&rsaquo;{' '}
                        </a>
                    ) : (
                        ''
                    )}
                </>
            ) : (
                <p>No dogs to display</p>
            )}
        </article>
    );
};

const DeleteDialogForm = forwardRef((props, ref) => (
    <dialog ref={ref}>
        <form method="dialog" onSubmit={props.onSubmit}>
            <header>
                <h4>Are you sure?</h4>
                <p>You cannot undo this action.</p>
            </header>
            <footer>
                <menu>
                    <button
                        className="cancel"
                        type="button"
                        onClick={() => ref.current.close()}
                    >
                        Cancel
                    </button>
                    <button>Confirm</button>
                </menu>
            </footer>
        </form>
    </dialog>
));

export default Dogs;
