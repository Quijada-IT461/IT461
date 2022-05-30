/* eslint-disable jsx-a11y/anchor-is-valid */
import { forwardRef, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const CatCard = ({ cat, getCats, url }) => {
    const axiosPrivate = useAxiosPrivate();

    const deleteCat = (id) =>
        axiosPrivate.delete(`/cats/${id}`).then(() => {
            // refetch on success
            getCats();
        });

    const deleteDialogRef = useRef();
    const editDialogRef = useRef();

    return (
        <tr key={cat.id}>
            <td>{cat.id}</td>
            <td>{cat.name}</td>
            <td style={{ display: 'flex', gap: '0.25rem' }}>
                <Link to={`/cats/${cat.id}`} state={{ cat }}>
                    View
                </Link>
                |
                <a
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        editDialogRef.current.showModal();
                    }}
                >
                    Edit
                </a>
                <EditCatDialogForm
                    ref={editDialogRef}
                    cat={cat}
                    refetch={getCats}
                />
                |
                <a
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        deleteDialogRef.current.showModal();
                    }}
                >
                    Delete
                </a>
                <DeleteDialogForm
                    ref={deleteDialogRef}
                    onSubmit={() => {
                        deleteCat(cat.id);
                    }}
                />
            </td>
        </tr>
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

const EditCatDialogForm = forwardRef((props, ref) => {
    const axiosPrivate = useAxiosPrivate();
    const [name, setName] = useState(props.cat.name);
    const [dirty, setDirty] = useState(false);

    function reset({ name, dirty } = { name: props.cat.name, dirty: false }) {
        setDirty(dirty);
        setName(name);
    }

    const handleSubmit = async (e) => {
        if (!name) {
            e.preventDefault();
            alert('Name is required!');
            return;
        }

        editCat(axiosPrivate, props.cat.id, { name }).then(() => {
            // refetch cats
            props.refetch();
        });
        reset({ name });
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
                        onChange={(e) => {
                            setDirty(props.cat.name !== e.target.value);
                            setName(e.target.value);
                        }}
                        value={name}
                    />
                </article>
                <footer>
                    <menu>
                        <button
                            className="cancel"
                            type="button"
                            onClick={() => {
                                ref.current.close();
                                reset();
                            }}
                        >
                            Cancel
                        </button>
                        {dirty ? <button>Update</button> : null}
                    </menu>
                </footer>
            </form>
        </dialog>
    );
});

const editCat = (axios, id, body) => axios.put(`/cats/${id}`, body);

export default CatCard;
